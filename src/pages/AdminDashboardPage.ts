import { View } from "@lib/view";
// import { ProductManagementSection } from "@sections/admin/ProductManagementSection";
import { ProductManagementSection } from "@sections/admin/testFakeAPI";
export class AdminDashboardPage extends View<"div"> {
	constructor() {
		super("div", { className: "admin-dashboard" });
	}

	render(): DocumentFragment {
		return this.tpl`
			<div class="admin-dashboard__inner">
				<header class="admin-dashboard__header">
					<div class="admin-dashboard__header-left">
						<span class="admin-dashboard__logo-mark">3AM</span>
						<div>
							<h1 class="admin-dashboard__title">Product Dashboard</h1>
							<p class="admin-dashboard__subtitle">Car Accessories Management</p>
						</div>
					</div>
					<div class="admin-dashboard__header-right">
						<span class="admin-dashboard__status-dot"></span>
						<span class="admin-dashboard__status-label">Live</span>
					</div>
				</header>

				<main class="admin-dashboard__main">
					${new ProductManagementSection()}
				</main>
			</div>
		`;
	}
}