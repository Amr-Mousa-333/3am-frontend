import { Button } from "@components/button";
import { View } from "@lib/view";

export class DawnHeroSection extends View<"section"> {
	constructor() {
		super("section", {
			className: ["page-section", "dawn-hero"],
			dataset: { gaSection: "dawn-hero" },
		});
	}

	render(): DocumentFragment {
		return this.tpl`
			<div class="dawn-hero__shell">
				<div class="dawn-hero__copy">
					<p class="dawn-hero__eyebrow">Model Dawn</p>
					<h2 class="dawn-hero__title">Adventure, reimagined for every day.</h2>
					<p class="dawn-hero__description">
						Dawn pairs rugged capability with a quiet, premium cabin and confident all-wheel-drive performance.
					</p>
					<div class="dawn-hero__actions">
						${new Button({
							label: "Build Dawn",
							variant: "solid",
							href: "/dawn",
						})}
						${new Button({
							label: "Book Demo",
							variant: "outline",
							href: "/demo",
						})}
					</div>
				</div>

				<div class="dawn-hero__media">
					<img src="/assets/shared/placeholder.png" alt="Dawn vehicle preview" loading="lazy" />
				</div>
			</div>
		`;
	}
}
