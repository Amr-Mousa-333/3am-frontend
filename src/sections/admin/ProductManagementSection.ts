// import { html } from "@lib/template";
// import { View } from "@lib/view";
// import { LazyImage } from "@components/lazyImage";

// // ─── Types ───

// interface Product {
// 	id: string;
// 	name: string;
// 	price: number;
// 	quantity: number;
// 	images: string[];
// 	category: string;
// }

// interface EditDraft {
// 	price: number;
// 	quantity: number;
// 	images: string[];
// }

// async function fetchProducts(): Promise<Product[]> {
// 	const res = await fetch("/api/products");
// 	if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
// 	return res.json();
// }

// async function deleteProduct(id: string): Promise<void> {
// 	const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
// 	if (!res.ok) throw new Error(`Failed to delete product: ${res.status}`);
// }

// async function updateProduct(
// 	id: string,
// 	data: EditDraft,
// ): Promise<Product> {
// 	const res = await fetch(`/api/products/${id}`, {
// 		method: "PUT",
// 		headers: { "Content-Type": "application/json" },
// 		body: JSON.stringify(data),
// 	});
// 	if (!res.ok) throw new Error(`Failed to update product: ${res.status}`);
// 	return res.json();
// }

// export class ProductManagementSection extends View<"section"> {
// 	private products: Product[] = [];
// 	private loading = true;
// 	private error: string | null = null;

// 	private editingProduct: Product | null = null;
// 	private draft: EditDraft = { price: 0, quantity: 0, images: [] };
// 	private saving = false;
// 	private saveError: string | null = null;

// 	constructor() {
// 		super("section", { className: ["page-section", "product-management"] });
// 		this.loadProducts();
// 	}

// 	private async loadProducts(): Promise<void> {
// 		this.loading = true;
// 		this.error = null;
// 		this.rerender();

// 		try {
// 			this.products = await fetchProducts();
// 		} catch (err) {
// 			this.error = err instanceof Error ? err.message : "Unknown error";
// 		} finally {
// 			this.loading = false;
// 			this.rerender();
// 		}
// 	}

// 	private async handleDelete(id: string): Promise<void> {
// 		try {
// 			await deleteProduct(id);
// 			this.products = this.products.filter((p) => p.id !== id);
// 			this.rerender();
// 		} catch (err) {
// 			alert(err instanceof Error ? err.message : "Delete failed");
// 		}
// 	}

// 	private openModal(product: Product): void {
// 		this.editingProduct = product;
// 		this.draft = {
// 			price: product.price,
// 			quantity: product.quantity,
// 			images: [...product.images],
// 		};
// 		this.saveError = null;
// 		this.rerender();
// 	}

// 	private closeModal(): void {
// 		this.editingProduct = null;
// 		this.saving = false;
// 		this.saveError = null;
// 		this.rerender();
// 	}

// 	private async handleSave(): Promise<void> {
// 		if (!this.editingProduct) return;

// 		this.saving = true;
// 		this.saveError = null;
// 		this.rerender();

// 		try {
// 			const updated = await updateProduct(
// 				this.editingProduct.id,
// 				this.draft,
// 			);
// 			this.products = this.products.map((p) =>
// 				p.id === updated.id ? updated : p,
// 			);
// 			this.closeModal();
// 		} catch (err) {
// 			this.saveError =
// 				err instanceof Error ? err.message : "Save failed";
// 			this.saving = false;
// 			this.rerender();
// 		}
// 	}

// 	private renderLoading(): DocumentFragment {
// 		return html`
// 			<div class="product-management__state">
// 				<div class="product-management__spinner" aria-label="Loading"></div>
// 				<p class="product-management__state-text">Fetching products…</p>
// 			</div>
// 		`;
// 	}

// 	private renderError(): DocumentFragment {
// 		return html`
// 			<div class="product-management__state product-management__state--error">
// 				<p class="product-management__state-text">⚠ ${this.error}</p>
// 				<button
// 					type="button"
// 					class="pm-btn pm-btn--outline"
// 					data-action="retry"
// 				>
// 					Retry
// 				</button>
// 			</div>
// 		`;
// 	}

// 	private renderEmpty(): DocumentFragment {
// 		return html`
// 			<div class="product-management__state">
// 				<p class="product-management__state-text">No products found.</p>
// 			</div>
// 		`;
// 	}

// 	private renderTableRow(product: Product): DocumentFragment {
// 		const imageSrc = product.images[0] ?? "";

// 		return this.tpl`
// 			<tr class="pm-table__row" data-product-id="${product.id}">
// 				<td class="pm-table__cell pm-table__cell--image">
// 					${
// 						imageSrc
// 							? new LazyImage({
// 									src: imageSrc,
// 									alt: product.name,
// 									className: "pm-table__thumb",
// 									width: 56,
// 									height: 56,
// 								})
// 							: html`<div class="pm-table__thumb-placeholder" aria-hidden="true"></div>`
// 					}
// 				</td>
// 				<td class="pm-table__cell pm-table__cell--name">
// 					<span class="pm-table__product-name">${product.name}</span>
// 				</td>
// 				<td class="pm-table__cell pm-table__cell--price">
// 					<span class="pm-table__price">$${product.price.toFixed(2)}</span>
// 				</td>
// 				<td class="pm-table__cell pm-table__cell--qty">
// 					<span class="pm-table__qty ${product.quantity < 10 ? "pm-table__qty--low" : ""}">
// 						${product.quantity}
// 					</span>
// 				</td>
// 				<td class="pm-table__cell pm-table__cell--category">
// 					<span class="pm-table__badge">${product.category}</span>
// 				</td>
// 				<td class="pm-table__cell pm-table__cell--actions">
// 					<button
// 						type="button"
// 						class="pm-btn pm-btn--ghost"
// 						data-action="edit"
// 						data-product-id="${product.id}"
// 						aria-label="Edit ${product.name}"
// 					>
// 						Edit
// 					</button>
// 					<button
// 						type="button"
// 						class="pm-btn pm-btn--danger"
// 						data-action="delete"
// 						data-product-id="${product.id}"
// 						aria-label="Delete ${product.name}"
// 					>
// 						Delete
// 					</button>
// 				</td>
// 			</tr>
// 		`;
// 	}

// 	private renderTable(): DocumentFragment {
// 		return this.tpl`
// 			<div class="pm-table-wrapper">
// 				<table class="pm-table" role="table">
// 					<thead class="pm-table__head">
// 						<tr>
// 							<th class="pm-table__th" scope="col">Image</th>
// 							<th class="pm-table__th" scope="col">Product</th>
// 							<th class="pm-table__th" scope="col">Price</th>
// 							<th class="pm-table__th" scope="col">Qty</th>
// 							<th class="pm-table__th" scope="col">Category</th>
// 							<th class="pm-table__th" scope="col">Actions</th>
// 						</tr>
// 					</thead>
// 					<tbody class="pm-table__body">
// 						${this.products.map((p) => this.renderTableRow(p))}
// 					</tbody>
// 				</table>
// 			</div>
// 		`;
// 	}

// 	private renderModal(): DocumentFragment {
// 		const product = this.editingProduct!;
// 		const imagesValue = this.draft.images.join(", ");

// 		return html`
// 			<div
// 				class="pm-modal-overlay"
// 				role="dialog"
// 				aria-modal="true"
// 				aria-label="Edit ${product.name}"
// 				data-action="close-overlay"
// 			>
// 				<div class="pm-modal" data-action="stop-propagation">
// 					<header class="pm-modal__header">
// 						<h2 class="pm-modal__title">Edit Product</h2>
// 						<button
// 							type="button"
// 							class="pm-modal__close"
// 							data-action="close-modal"
// 							aria-label="Close modal"
// 						>
// 							✕
// 						</button>
// 					</header>

// 					<div class="pm-modal__body">
// 						<p class="pm-modal__product-name">${product.name}</p>

// 						${
// 							this.saveError
// 								? html`<p class="pm-modal__error">⚠ ${this.saveError}</p>`
// 								: html``
// 						}

// 						<label class="pm-field">
// 							<span class="pm-field__label">Price ($)</span>
// 							<input
// 								type="number"
// 								class="pm-field__input"
// 								data-field="price"
// 								value="${this.draft.price}"
// 								min="0"
// 								step="0.01"
// 								${this.saving ? "disabled" : ""}
// 							/>
// 						</label>

// 						<label class="pm-field">
// 							<span class="pm-field__label">Quantity</span>
// 							<input
// 								type="number"
// 								class="pm-field__input"
// 								data-field="quantity"
// 								value="${this.draft.quantity}"
// 								min="0"
// 								step="1"
// 								${this.saving ? "disabled" : ""}
// 							/>
// 						</label>

// 						<label class="pm-field">
// 							<span class="pm-field__label">Images (comma-separated URLs)</span>
// 							<textarea
// 								class="pm-field__input pm-field__input--textarea"
// 								data-field="images"
// 								rows="3"
// 								${this.saving ? "disabled" : ""}
// 							>${imagesValue}</textarea>
// 						</label>
// 					</div>

// 					<footer class="pm-modal__footer">
// 						<button
// 							type="button"
// 							class="pm-btn pm-btn--outline"
// 							data-action="close-modal"
// 							${this.saving ? "disabled" : ""}
// 						>
// 							Cancel
// 						</button>
// 						<button
// 							type="button"
// 							class="pm-btn pm-btn--primary"
// 							data-action="save"
// 							${this.saving ? "disabled" : ""}
// 						>
// 							${this.saving ? "Saving…" : "Save Changes"}
// 						</button>
// 					</footer>
// 				</div>
// 			</div>
// 		`;
// 	}

// 	render(): DocumentFragment {
// 		let content: DocumentFragment;

// 		if (this.loading) {
// 			content = this.renderLoading();
// 		} else if (this.error) {
// 			content = this.renderError();
// 		} else if (this.products.length === 0) {
// 			content = this.renderEmpty();
// 		} else {
// 			content = this.renderTable();
// 		}

// 		const view = this.tpl`
// 			<div class="product-management__inner">
// 				<div class="product-management__toolbar">
// 					<h2 class="product-management__heading">
// 						Products
// 						${
// 							!this.loading && !this.error
// 								? html`<span class="product-management__count">${this.products.length}</span>`
// 								: html``
// 						}
// 					</h2>
// 					<button
// 						type="button"
// 						class="pm-btn pm-btn--ghost"
// 						data-action="retry"
// 						aria-label="Refresh products"
// 					>
// 						↺ Refresh
// 					</button>
// 				</div>

// 				${content}
// 				${this.editingProduct ? this.renderModal() : html``}
// 			</div>
// 		`;

// 		this.cleanup.on(this.element, "click", (event) => {
// 			const target = event.target as HTMLElement | null;
// 			if (!target) return;

// 			const action = target.dataset["action"];
// 			const productId = target.dataset["productId"];

// 			if (action === "delete" && productId) {
// 				if (confirm("Delete this product? This cannot be undone.")) {
// 					void this.handleDelete(productId);
// 				}
// 				return;
// 			}

// 			if (action === "edit" && productId) {
// 				const product = this.products.find((p) => p.id === productId);
// 				if (product) this.openModal(product);
// 				return;
// 			}

// 			if (action === "retry") {
// 				void this.loadProducts();
// 				return;
// 			}

// 			if (action === "close-overlay") {
// 				this.closeModal();
// 				return;
// 			}

// 			if (action === "close-modal") {
// 				this.closeModal();
// 				return;
// 			}

// 			if (action === "save") {
// 				void this.handleSave();
// 				return;
// 			}
// 		});

// 		this.cleanup.on(this.element, "click", (event) => {
// 			const target = event.target as HTMLElement | null;
// 			if (target?.dataset["action"] === "stop-propagation") {
// 				event.stopPropagation();
// 			}
// 		});

// 		this.cleanup.on(this.element, "input", (event) => {
// 			if (!this.editingProduct) return;
// 			const target = event.target as HTMLInputElement | HTMLTextAreaElement | null;
// 			if (!target) return;

// 			const field = target.dataset["field"];

// 			if (field === "price") {
// 				this.draft.price = parseFloat(target.value) || 0;
// 			}

// 			if (field === "quantity") {
// 				this.draft.quantity = parseInt(target.value, 10) || 0;
// 			}

// 			if (field === "images") {
// 				this.draft.images = target.value
// 					.split(",")
// 					.map((s) => s.trim())
// 					.filter(Boolean);
// 			}
// 		});

// 		this.cleanup.on(document, "keydown", (event) => {
// 			if ((event as KeyboardEvent).key === "Escape" && this.editingProduct) {
// 				this.closeModal();
// 			}
// 		});

// 		return view;
// 	}
// }