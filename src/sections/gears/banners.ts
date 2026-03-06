import { Button } from "@components/button";
import { View } from "@lib/view";

type Banner = {
	id: string;
	title: string;
	subtitle: string;
	description: string;
	ctaLabel: string;
	ctaHref: string;
	theme: "dark" | "light" | "gradient";
	feature?: string;
};

const BANNERS: ReadonlyArray<Banner> = [
	{
		id: "shipping",
		title: "Free Shipping",
		subtitle: "On Orders Over $200",
		description:
			"Complimentary shipping on all orders over $200. Fast delivery nationwide.",
		ctaLabel: "Learn More",
		ctaHref: "/gears/shipping",
		theme: "dark",
		feature: "🚚",
	},
	{
		id: "warranty",
		title: "Extended Warranty",
		subtitle: "2-Year Protection",
		description:
			"Every purchase comes with our comprehensive 2-year warranty coverage.",
		ctaLabel: "View Details",
		ctaHref: "/gears/warranty",
		theme: "gradient",
		feature: "🛡️",
	},
	{
		id: "installation",
		title: "Professional Installation",
		subtitle: "Expert Service",
		description:
			"Book certified technicians for hassle-free installation at your location.",
		ctaLabel: "Book Now",
		ctaHref: "/gears/installation",
		theme: "light",
		feature: "🔧",
	},
];

export class GearsBannersSection extends View<"section"> {
	constructor() {
		super("section", { className: ["page-section", "gears-banners"] });
	}

	render(): DocumentFragment {
		return this.tpl`
			<!-- Feature Banners Grid -->
			<div class="gears-banners__grid">
				${BANNERS.map((banner) => this.renderFeatureBanner(banner))}
			</div>

			<!-- Newsletter Signup Banner -->
			<div class="gears-banners__newsletter">
				<div class="gears-banners__newsletter-content">
					<h3 class="gears-banners__newsletter-title">Stay in the Loop</h3>
					<p class="gears-banners__newsletter-description">
						Subscribe for exclusive deals, new arrivals, and expert tips.
					</p>
					<form class="gears-banners__newsletter-form" action="/gears/newsletter/subscribe" method="POST">
						<div class="gears-banners__newsletter-inputs">
							<input
								type="email"
								name="email"
								class="gears-banners__newsletter-email"
								placeholder="Enter your email"
								required
								aria-label="Email address"
							/>
							<button type="submit" class="gears-banners__newsletter-submit">
								Subscribe
							</button>
						</div>
						<p class="gears-banners__newsletter-disclaimer">
							By subscribing, you agree to our Terms & Privacy Policy.
						</p>
					</form>
				</div>
			</div>
		`;
	}

	private renderFeatureBanner(banner: Banner): DocumentFragment {
		return this.tpl`
			<div class="gears-feature-banner gears-feature-banner--${banner.theme}" data-banner="${banner.id}">
				<div class="gears-feature-banner__content">
					<span class="gears-feature-banner__feature" aria-hidden="true">${banner.feature}</span>
					<div class="gears-feature-banner__text">
						<h3 class="gears-feature-banner__title">${banner.title}</h3>
						<p class="gears-feature-banner__subtitle">${banner.subtitle}</p>
						<p class="gears-feature-banner__description">${banner.description}</p>
					</div>
				</div>
				${new Button({
					label: banner.ctaLabel,
					variant: banner.theme === "light" ? "solid" : "outline",
					href: banner.ctaHref,
					className: "gears-feature-banner__cta",
				})}
			</div>
		`;
	}

	protected override onMount(): void {
		this.bindFormEvents();
	}

	private bindFormEvents(): void {
		const form = this.element.querySelector<HTMLFormElement>(
			".gears-banners__newsletter-form",
		);
		if (!form) return;

		this.cleanup.on(form, "submit", this.handleNewsletterSubmit);
	}

	private readonly handleNewsletterSubmit = (event: SubmitEvent): void => {
		event.preventDefault();
		const form = event.target as HTMLFormElement;
		const emailInput = form.querySelector<HTMLInputElement>(
			".gears-banners__newsletter-email",
		);
		const email = emailInput?.value;

		if (!email) return;

		// Dispatch custom event for handling
		const submitEvent = new CustomEvent("gears:newsletter-subscribe", {
			bubbles: true,
			detail: { email },
		});
		this.element.dispatchEvent(submitEvent);

		// Show success state
		form.classList.add("is-submitted");
		emailInput.value = "";

		setTimeout(() => {
			form.classList.remove("is-submitted");
		}, 3000);
	};
}
