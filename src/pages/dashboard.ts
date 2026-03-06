import { Button } from "@components/button";
import { dashboardApi, productsApi } from "@lib/api";
import type { Category, DashboardDTO } from "@lib/api/auth.types";
import { isAdmin, isAuthenticated, requireAdmin } from "@lib/authGuard";
import { emitToast } from "@lib/toastBus";
import { View } from "@lib/view";

type DashboardMetric = {
	label: string;
	value: string;
};

const MAX_METRICS = 8;

type FormFeedbackState = "success" | "error";

const isFiniteNumber = (value: unknown): value is number =>
	typeof value === "number" && Number.isFinite(value);

const parseJson = (value: string): Record<string, unknown> | null => {
	const trimmed = value.trim();
	if (!trimmed) {
		return {};
	}

	try {
		const parsed = JSON.parse(trimmed) as unknown;
		if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
			return null;
		}
		return parsed as Record<string, unknown>;
	} catch {
		return null;
	}
};

export class DashboardPage extends View<"section"> {
	private isLoading = true;
	private error: string | null = null;
	private payload: DashboardDTO = null;
	private categories: Category[] = [];
	private isLoadingCategories = false;
	private isSubmittingProduct = false;

	constructor() {
		super("section", { className: ["page-section", "dashboard-page"] });
	}

	protected override onMount(): void {
		requireAdmin();
		if (!isAuthenticated() || !isAdmin()) {
			return;
		}

		void this.loadDashboard();
		void this.loadCategories();
		this.bindEvents();
	}

	private async loadDashboard(): Promise<void> {
		this.isLoading = true;
		this.error = null;
		this.rerender();
		this.bindEvents();

		try {
			this.payload = await dashboardApi.getDashboard();
		} catch (error) {
			console.error("Failed to load dashboard:", error);
			const message =
				error instanceof Error
					? error.message
					: "Unable to load dashboard data.";

			const normalizedMessage = message.toLowerCase();
			if (
				normalizedMessage.includes("403") ||
				normalizedMessage.includes("forbidden") ||
				normalizedMessage.includes("permission")
			) {
				this.error =
					"You do not have permission to access the admin dashboard.";
			} else {
				this.error = message;
			}
		} finally {
			this.isLoading = false;
			this.rerender();
			this.bindEvents();
		}
	}

	private async loadCategories(): Promise<void> {
		this.isLoadingCategories = true;
		this.rerender();
		this.bindEvents();

		try {
			const categories = await productsApi.getCategories();
			this.categories = [...categories].sort((a, b) =>
				a.name.localeCompare(b.name),
			);
		} catch (error) {
			console.error("Failed to load product categories:", error);
			emitToast({
				level: "error",
				title: "Could not load categories",
				message: "Refresh and try again before adding a product.",
			});
		} finally {
			this.isLoadingCategories = false;
			this.rerender();
			this.bindEvents();
		}
	}

	private bindEvents(): void {
		const refreshButton = this.element.querySelector<HTMLButtonElement>(
			"[data-dashboard-refresh]",
		);
		if (refreshButton) {
			this.cleanup.on(refreshButton, "click", this.handleRefresh);
		}

		const form = this.element.querySelector<HTMLFormElement>(
			"[data-admin-add-product-form]",
		);
		if (form) {
			this.cleanup.on(form, "submit", this.handleAddProductSubmit);
		}

		const imageBrowseButton = this.element.querySelector<HTMLButtonElement>(
			"[data-admin-image-browse]",
		);
		const imageInput = this.element.querySelector<HTMLInputElement>(
			"[data-admin-product-image-input]",
		);
		if (imageBrowseButton && imageInput) {
			this.cleanup.on(imageBrowseButton, "click", () => {
				imageInput.click();
			});
		}

		if (imageInput) {
			this.cleanup.on(imageInput, "change", this.handleImageSelection);
		}
	}

	private buildMetrics(payload: DashboardDTO): DashboardMetric[] {
		if (
			payload === null ||
			Array.isArray(payload) ||
			typeof payload !== "object"
		) {
			return this.buildPrimitiveMetrics(payload);
		}

		const metrics: DashboardMetric[] = [];
		for (const [key, value] of Object.entries(payload)) {
			if (metrics.length >= MAX_METRICS) {
				break;
			}

			const label = this.formatLabel(key);
			if (value === null) {
				metrics.push({ label, value: "-" });
				continue;
			}

			if (typeof value === "number" && Number.isFinite(value)) {
				metrics.push({ label, value: this.formatNumeric(value) });
				continue;
			}

			if (typeof value === "string") {
				metrics.push({ label, value });
				continue;
			}

			if (typeof value === "boolean") {
				metrics.push({ label, value: value ? "Yes" : "No" });
				continue;
			}

			if (Array.isArray(value)) {
				metrics.push({
					label,
					value: `${value.length} ${value.length === 1 ? "item" : "items"}`,
				});
				continue;
			}

			if (typeof value === "object") {
				const objectSize = Object.keys(value).length;
				metrics.push({
					label,
					value: `${objectSize} fields`,
				});
			}
		}

		if (metrics.length > 0) {
			return metrics;
		}

		return [
			{
				label: "Fields",
				value: String(Object.keys(payload).length),
			},
		];
	}

	private buildPrimitiveMetrics(payload: DashboardDTO): DashboardMetric[] {
		if (Array.isArray(payload)) {
			return [
				{
					label: "Records",
					value: String(payload.length),
				},
			];
		}

		if (payload === null) {
			return [{ label: "Response", value: "Empty" }];
		}

		if (typeof payload === "number" && Number.isFinite(payload)) {
			return [
				{
					label: "Response",
					value: this.formatNumeric(payload),
				},
			];
		}

		if (typeof payload === "boolean") {
			return [
				{
					label: "Response",
					value: payload ? "Yes" : "No",
				},
			];
		}

		return [{ label: "Response", value: String(payload) }];
	}

	private formatLabel(label: string): string {
		return label
			.replace(/([a-z])([A-Z])/g, "$1 $2")
			.replace(/[_-]+/g, " ")
			.trim()
			.replace(/^./, (char) => char.toUpperCase());
	}

	private formatNumeric(value: number): string {
		const isInteger = Number.isInteger(value);
		return new Intl.NumberFormat("en-US", {
			maximumFractionDigits: isInteger ? 0 : 2,
		}).format(value);
	}

	private setFormSubmitting(
		form: HTMLFormElement,
		isSubmitting: boolean,
	): void {
		const submitButton = form.querySelector<HTMLButtonElement>(
			"[data-admin-add-product-submit]",
		);
		if (submitButton) {
			submitButton.disabled = isSubmitting;
			const label =
				submitButton.querySelector<HTMLElement>(".ui-button__label");
			if (label) {
				label.textContent = isSubmitting ? "Adding..." : "Add Product";
			}
		}
	}

	private setFormFeedback(
		form: HTMLFormElement,
		message: string,
		state: FormFeedbackState,
	): void {
		const feedback = form.querySelector<HTMLElement>(
			"[data-admin-form-feedback]",
		);
		if (!feedback) {
			return;
		}

		feedback.textContent = message;
		feedback.dataset.state = state;
	}

	private clearFormFeedback(form: HTMLFormElement): void {
		const feedback = form.querySelector<HTMLElement>(
			"[data-admin-form-feedback]",
		);
		if (!feedback) {
			return;
		}

		feedback.textContent = "";
		feedback.removeAttribute("data-state");
	}

	private setImageFileName(form: HTMLFormElement, name: string | null): void {
		const fileName = form.querySelector<HTMLElement>(
			"[data-admin-image-file-name]",
		);
		if (!fileName) {
			return;
		}

		fileName.textContent = name?.trim() || "No file selected";
	}

	private readonly handleRefresh = (): void => {
		void this.loadDashboard();
	};

	private readonly handleImageSelection = (event: Event): void => {
		const input = event.currentTarget;
		if (!(input instanceof HTMLInputElement)) {
			return;
		}

		const form = input.closest<HTMLFormElement>(
			"[data-admin-add-product-form]",
		);
		if (!form) {
			return;
		}

		const fileName = input.files?.[0]?.name ?? null;
		this.setImageFileName(form, fileName);
	};

	private readonly handleAddProductSubmit = (event: Event): void => {
		event.preventDefault();
		const form = event.currentTarget;
		if (!(form instanceof HTMLFormElement)) {
			return;
		}

		void this.submitAddProductForm(form);
	};

	private async submitAddProductForm(form: HTMLFormElement): Promise<void> {
		if (this.isSubmittingProduct) {
			return;
		}

		const formData = new FormData(form);
		const name = String(formData.get("name") ?? "").trim();
		const description = String(formData.get("description") ?? "").trim();
		const brand = String(formData.get("brand") ?? "").trim();
		const specsJson = String(formData.get("specsJson") ?? "{}").trim();
		const categoryId = Number(formData.get("categoryId"));
		const price = Number(formData.get("price"));
		const stockQuantity = Number(formData.get("stockQuantity"));
		const rawImage = formData.get("image");
		const image =
			rawImage instanceof File && rawImage.size > 0 ? rawImage : undefined;

		if (!name || !description || !brand) {
			this.setFormFeedback(
				form,
				"Name, description, and brand are required.",
				"error",
			);
			return;
		}

		if (!isFiniteNumber(price) || price <= 0) {
			this.setFormFeedback(
				form,
				"Price must be a number greater than zero.",
				"error",
			);
			return;
		}

		if (
			!isFiniteNumber(stockQuantity) ||
			stockQuantity < 0 ||
			!Number.isInteger(stockQuantity)
		) {
			this.setFormFeedback(
				form,
				"Stock quantity must be a whole number 0 or higher.",
				"error",
			);
			return;
		}

		if (!isFiniteNumber(categoryId) || categoryId <= 0) {
			this.setFormFeedback(form, "Please choose a product category.", "error");
			return;
		}

		if (!parseJson(specsJson)) {
			this.setFormFeedback(
				form,
				"Specs JSON must be a valid JSON object.",
				"error",
			);
			return;
		}

		this.isSubmittingProduct = true;
		this.setFormSubmitting(form, true);
		this.clearFormFeedback(form);

		try {
			await productsApi.addProduct({
				name,
				description,
				price,
				stockQuantity,
				brand,
				specsJson,
				categoryId,
				image,
			});

			this.setFormFeedback(form, "Product added successfully.", "success");
			emitToast({
				level: "success",
				title: "Product added",
				message: `${name} is now available in the catalog.`,
			});
			form.reset();
			this.setImageFileName(form, null);
			await this.loadDashboard();
		} catch (error) {
			console.error("Failed to add product:", error);
			const message =
				error instanceof Error
					? error.message
					: "Failed to add product. Please try again.";
			this.setFormFeedback(form, message, "error");
			emitToast({
				level: "error",
				title: "Add product failed",
				message,
			});
		} finally {
			this.isSubmittingProduct = false;
			this.setFormSubmitting(form, false);
		}
	}

	render(): DocumentFragment {
		const metrics =
			this.isLoading || this.error ? [] : this.buildMetrics(this.payload);

		return this.tpl`
			<div class="dashboard-shell">
				<header class="dashboard-header">
					<p class="dashboard-eyebrow">Admin</p>
					<h1 class="dashboard-title">Dashboard</h1>
					<p class="dashboard-description">
						Live system overview with product management controls.
					</p>
					${new Button({
						as: "button",
						type: "button",
						label: "Refresh",
						variant: "outline",
						className: "dashboard-refresh-btn",
						dataset: { dashboardRefresh: true },
					})}
				</header>

				${
					this.isLoading
						? this.tpl`
							<div class="dashboard-status-card">
								<p class="dashboard-status">Loading dashboard...</p>
							</div>
						`
						: ""
				}

				${
					!this.isLoading && this.error
						? this.tpl`
							<div class="dashboard-status-card dashboard-status-card--error">
								<p class="dashboard-status">${this.error}</p>
							</div>
						`
						: ""
				}

				${
					!this.isLoading && !this.error
						? this.tpl`
							<section class="dashboard-metrics" aria-label="Dashboard overview">
								${metrics.map(
									(metric) => this.tpl`
										<article class="dashboard-metric">
											<p class="dashboard-metric__label">${metric.label}</p>
											<p class="dashboard-metric__value">${metric.value}</p>
										</article>
									`,
								)}
							</section>
						`
						: ""
				}

				<section class="dashboard-admin-tools" aria-label="Admin product tools">
					<div class="dashboard-admin-tools__header">
						<h2 class="dashboard-admin-tools__title">Add Product</h2>
						<p class="dashboard-admin-tools__description">
							Create products directly from the admin dashboard.
						</p>
					</div>
					<form class="dashboard-product-form" data-admin-add-product-form>
						<label class="dashboard-product-form__field">
							<span>Name</span>
							<input type="text" name="name" maxlength="120" required />
						</label>

						<label class="dashboard-product-form__field dashboard-product-form__field--full">
							<span>Description</span>
							<textarea name="description" rows="3" maxlength="800" required></textarea>
						</label>

						<label class="dashboard-product-form__field">
							<span>Price</span>
							<input type="number" name="price" min="0.01" step="0.01" required />
						</label>

						<label class="dashboard-product-form__field">
							<span>Stock Quantity</span>
							<input type="number" name="stockQuantity" min="0" step="1" required />
						</label>

						<label class="dashboard-product-form__field">
							<span>Brand</span>
							<input type="text" name="brand" maxlength="120" required />
						</label>

						<label class="dashboard-product-form__field">
							<span>Category</span>
							<select name="categoryId" ${this.isLoadingCategories ? "disabled" : ""} required>
								<option value="">
									${
										this.isLoadingCategories
											? "Loading categories..."
											: "Select category"
									}
								</option>
								${this.categories.map(
									(category) => this.tpl`
										<option value="${category.id}">${category.name}</option>
									`,
								)}
							</select>
						</label>

						<label class="dashboard-product-form__field dashboard-product-form__field--full">
							<span>Specs JSON</span>
							<textarea
								name="specsJson"
								rows="4"
								placeholder='{"color":"black","material":"carbon"}'
							>{}</textarea>
						</label>

						<label class="dashboard-product-form__field dashboard-product-form__field--full">
							<span>Image (optional)</span>
							<div class="dashboard-product-form__file-picker">
								<input
									class="dashboard-product-form__file-input"
									type="file"
									name="image"
									accept="image/*"
									data-admin-product-image-input
								/>
								${new Button({
									as: "button",
									type: "button",
									label: "Browse",
									variant: "outline",
									className: "dashboard-product-form__browse",
									dataset: { adminImageBrowse: true },
								})}
								<span class="dashboard-product-form__file-name" data-admin-image-file-name>No file selected</span>
							</div>
						</label>

						<div class="dashboard-product-form__actions dashboard-product-form__field--full">
							${new Button({
								as: "button",
								type: "submit",
								label: this.isSubmittingProduct ? "Adding..." : "Add Product",
								variant: "solid",
								className: "dashboard-product-form__submit",
								attrs: {
									disabled: this.isSubmittingProduct,
								},
								dataset: { adminAddProductSubmit: true },
							})}
							<p class="dashboard-product-form__feedback" data-admin-form-feedback aria-live="polite"></p>
						</div>
					</form>
				</section>
			</div>
		`;
	}
}
