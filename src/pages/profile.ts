import { requireAuth } from "@lib/authGuard";
import { getRouter } from "@lib/router";
import { View } from "@lib/view";
import { authStore } from "@lib/authStore";
import type { OrderDTO } from "@lib/api/auth.types";

export class ProfilePage extends View<"section"> {
	constructor() {
		super("section", { className: ["page-section", "profile-page"] });
	}

	protected override onMount(): void {
		requireAuth();
		this.loadProfile();
	}

	private async loadProfile(): Promise<void> {
		const container = this.$<HTMLElement>(".profile-content");
		if (!container) {
			return;
		}

		container.innerHTML = "";

		const loading = document.createElement("div");
		loading.className = "profile-loading";
		loading.textContent = "Loading profile...";
		container.appendChild(loading);

		try {
			const profile = await authStore.loadProfile();
			if (!profile) {
				requireAuth();
				return;
			}
			this.renderProfile(profile);
		} catch (error) {
			container.innerHTML = "";
			const errorDiv = document.createElement("div");
			errorDiv.className = "profile-error";
			errorDiv.textContent = "Failed to load profile. Please try again.";
			container.appendChild(errorDiv);
		}
	}

	private renderProfile(profile: {
		name: string;
		email: string;
		phone: string;
		orders: OrderDTO[];
	}): void {
		const container = this.$<HTMLElement>(".profile-content");
		if (!container) {
			return;
		}

		container.innerHTML = "";

		const header = document.createElement("div");
		header.className = "profile-header";

		const title = document.createElement("h1");
		title.className = "profile-title";
		title.textContent = "My Profile";

		header.appendChild(title);

		const infoSection = document.createElement("div");
		infoSection.className = "profile-info-section";

		const infoCard = document.createElement("div");
		infoCard.className = "profile-info-card";

		const infoTitle = document.createElement("h2");
		infoTitle.className = "profile-info-title";
		infoTitle.textContent = "Account Information";

		const infoList = document.createElement("dl");
		infoList.className = "profile-info-list";

		const nameItem = this.createInfoItem("Name", profile.name);
		const emailItem = this.createInfoItem("Email", profile.email);
		const phoneItem = this.createInfoItem("Phone", profile.phone);

		infoList.append(nameItem, emailItem, phoneItem);
		infoCard.append(infoTitle, infoList);
		infoSection.appendChild(infoCard);

		const ordersSection = document.createElement("div");
		ordersSection.className = "profile-orders-section";

		const ordersTitle = document.createElement("h2");
		ordersTitle.className = "profile-orders-title";
		ordersTitle.textContent = "Order History";

		if (profile.orders.length === 0) {
			const noOrders = document.createElement("p");
			noOrders.className = "profile-no-orders";
			noOrders.textContent = "You haven't placed any orders yet.";
			ordersSection.append(ordersTitle, noOrders);
		} else {
			const ordersList = document.createElement("div");
			ordersList.className = "profile-orders-list";

			for (const order of profile.orders) {
				const orderCard = this.createOrderCard(order);
				ordersList.appendChild(orderCard);
			}

			ordersSection.append(ordersTitle, ordersList);
		}

		const actionsSection = document.createElement("div");
		actionsSection.className = "profile-actions";

		const logoutBtn = document.createElement("button");
		logoutBtn.className = "profile-logout-btn";
		logoutBtn.textContent = "Sign Out";
		logoutBtn.type = "button";

		this.cleanup.on(logoutBtn, "click", async () => {
			logoutBtn.disabled = true;
			logoutBtn.textContent = "Signing out...";
			try {
				await authStore.logout();
				const router = getRouter();
				router.navigate("/");
			} catch {
				logoutBtn.disabled = false;
				logoutBtn.textContent = "Sign Out";
			}
		});

		const deleteBtn = document.createElement("button");
		deleteBtn.className = "profile-delete-btn";
		deleteBtn.textContent = "Delete Account";
		deleteBtn.type = "button";

		this.cleanup.on(deleteBtn, "click", async () => {
			const confirmed = confirm(
				"Are you sure you want to delete your account? This action cannot be undone.",
			);
			if (!confirmed) {
				return;
			}

			deleteBtn.disabled = true;
			deleteBtn.textContent = "Deleting...";

			try {
				const { authApi } = await import("@lib/api");
				await authApi.deleteAccount();
				await authStore.logout();
				const router = getRouter();
				router.navigate("/");
			} catch (error) {
				alert("Failed to delete account. Please try again.");
				deleteBtn.disabled = false;
				deleteBtn.textContent = "Delete Account";
			}
		});

		actionsSection.append(logoutBtn, deleteBtn);

		container.append(header, infoSection, ordersSection, actionsSection);
	}

	private createInfoItem(label: string, value: string): HTMLDivElement {
		const item = document.createElement("div");
		item.className = "profile-info-item";

		const dt = document.createElement("dt");
		dt.className = "profile-info-label";
		dt.textContent = label;

		const dd = document.createElement("dd");
		dd.className = "profile-info-value";
		dd.textContent = value;

		item.append(dt, dd);
		return item;
	}

	private createOrderCard(order: OrderDTO): HTMLDivElement {
		const card = document.createElement("div");
		card.className = "profile-order-card";

		const header = document.createElement("div");
		header.className = "profile-order-header";

		const orderId = document.createElement("span");
		orderId.className = "profile-order-id";
		orderId.textContent = `Order #${order.id}`;

		const status = document.createElement("span");
		status.className = `profile-order-status status-${order.status.toLowerCase().replace(/\s+/g, "-")}`;
		status.textContent = order.status;

		header.append(orderId, status);

		const details = document.createElement("div");
		details.className = "profile-order-details";

		const totalPrice = document.createElement("div");
		totalPrice.className = "profile-order-total";
		totalPrice.textContent = `Total: $${order.total_Price.toFixed(2)}`;

		const paymentStatus = document.createElement("div");
		paymentStatus.className = "profile-order-payment";
		paymentStatus.textContent = `Payment: ${order.payment_Status}`;

		const itemCount = document.createElement("div");
		itemCount.className = "profile-order-items";
		itemCount.textContent = `${order.cartItems.length} item(s)`;

		details.append(totalPrice, paymentStatus, itemCount);

		const itemsList = document.createElement("ul");
		itemsList.className = "profile-order-items-list";

		for (const item of order.cartItems) {
			const li = document.createElement("li");
			li.className = "profile-order-item";
			li.textContent = `${item.product_Name} × ${item.quantity}`;
			itemsList.appendChild(li);
		}

		card.append(header, details, itemsList);
		return card;
	}

	render(): DocumentFragment {
		return this.tpl`
			<div class="profile-layout">
				<div class="profile-panel">
					<div class="profile-content"></div>
				</div>
			</div>
		`;
	}
}
