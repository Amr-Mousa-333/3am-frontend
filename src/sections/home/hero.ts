import { Button } from "@components/button";
import { LazyPicture } from "@components/lazyPicture";
import { View } from "@lib/view";
import { setupHomeHeroCarousel } from "./heroCarousel";

const slideOneMobile = "/assets/hero/slide-1-520.png";
const slideOneTablet = "/assets/hero/slide-1-1024.png";
const slideOneDesktop = "/assets/hero/slide-1-1440.png";
const slideTwoMobile = "/assets/hero/slide-2-520.png";
const slideTwoTablet = "/assets/hero/slide-2-1024.png";
const slideTwoDesktop = "/assets/hero/slide-2-1440.png";
const slideThreeMobile = "/assets/hero/slide-3-520.png";
const slideThreeTablet = "/assets/hero/slide-3-1024.png";
const slideThreeDesktop = "/assets/hero/slide-3-1440.png";
const slideFourTablet = "/assets/hero/slide-4_1024.png";
const slideFourDesktop = "/assets/hero/slide-4_1440.png";
const slideFourMobile = "/assets/hero/slide-4-520.png";

export class HomeHeroSection extends View<"section"> {
	constructor() {
		super("section", { className: ["page-section", "hero"] });
	}

	protected override onMount(): void {
		// Why: carousel behavior needs the rendered DOM tree.
		setupHomeHeroCarousel(this.element, this.cleanup);
	}

	render(): DocumentFragment {
		// Keep content inline so this file is the single place to edit hero copy/buttons/images.
		return this.tpl`
			<div class="hero-carousel">
				<div
					class="hero-carousel__viewport"
					role="region"
					aria-roledescription="carousel"
					aria-label="Featured Rivian gallery"
					tabindex="0"
				>
					<div class="hero-carousel__track">
						<!-- Slide 1: edit image, text, and buttons here -->
						<div class="hero-slide hero-slide--1" id="slide-1" aria-label="Slide 1 of 4">
							${new LazyPicture({
								pictureClassName: "hero-slide-picture",
								src: {
									phone: slideOneMobile,
									tablet: slideOneTablet,
									pc: slideOneDesktop,
								},
								alt: "Blue Rivian truck parked on rocky terrain by a mountain lake",
								sizes: "100vw",
								className: "hero-slide-image",
							})}
							<p class="hero-layer hero-layer--eyebrow mobile">Adventure Package</p>
							<h2 class="hero-layer hero-layer--title mobile">Find New Trails Faster</h2>
							<p class="hero-layer hero-layer--description mobile">
								Dual-motor confidence, adaptive air suspension, and enough range for a full weekend escape.
							</p>
							${new Button({
								label: "Build Yours",
								variant: "solid",
								href: "/build",
								className: "hero-layer hero-layer--primary mobile",
							})}
							${new Button({
								label: "View Specs",
								variant: "outline",
								href: "/specs",
								className: "hero-layer hero-layer--secondary mobile",
							})}
							<p class="hero-layer hero-layer--eyebrow tablet">Adventure Package</p>
							<h2 class="hero-layer hero-layer--title tablet">Find New Trails Faster</h2>
							<p class="hero-layer hero-layer--description tablet">
								Dual-motor confidence, adaptive air suspension, and enough range for a full weekend escape.
							</p>
							${new Button({
								label: "Build Yours",
								variant: "solid",
								href: "/build",
								className: "hero-layer hero-layer--primary tablet",
							})}
							${new Button({
								label: "View Specs",
								variant: "outline",
								href: "/specs",
								className: "hero-layer hero-layer--secondary tablet",
							})}
							<p class="hero-layer hero-layer--eyebrow desktop">Adventure Package</p>
							<h2 class="hero-layer hero-layer--title desktop">Find New Trails Faster</h2>
							<p class="hero-layer hero-layer--description desktop">
								Dual-motor confidence, adaptive air suspension, and enough range for a full weekend escape.
							</p>
							${new Button({
								label: "Build Yours",
								variant: "solid",
								href: "/build",
								className: "hero-layer hero-layer--primary desktop",
							})}
							${new Button({
								label: "View Specs",
								variant: "outline",
								href: "/specs",
								className: "hero-layer hero-layer--secondary desktop",
							})}
						</div>

						<!-- Slide 2: edit image, text, and buttons here -->
						<div class="hero-slide hero-slide--2" id="slide-2" aria-label="Slide 2 of 4">
							${new LazyPicture({
								pictureClassName: "hero-slide-picture",
								src: {
									phone: slideTwoMobile,
									tablet: slideTwoTablet,
									pc: slideTwoDesktop,
								},
								alt: "Rivian truck parked near the waterfront at sunset",
								sizes: "100vw",
								className: "hero-slide-image",
							})}
							<p class="hero-layer hero-layer--eyebrow mobile">City Ready</p>
							<h2 class="hero-layer hero-layer--title mobile">Comfort That Moves Quietly</h2>
							<p class="hero-layer hero-layer--description mobile">
								Clean interior lines, premium materials, and instant response made for daily use.
							</p>
							${new Button({
								label: "Book a Demo",
								variant: "solid",
								href: "/demo-drive",
								className: "hero-layer hero-layer--primary mobile",
							})}
							${new Button({
								label: "Compare Models",
								variant: "outline",
								href: "/models",
								className: "hero-layer hero-layer--secondary mobile",
							})}
							<p class="hero-layer hero-layer--eyebrow tablet">City Ready</p>
							<h2 class="hero-layer hero-layer--title tablet">Comfort That Moves Quietly</h2>
							<p class="hero-layer hero-layer--description tablet">
								Clean interior lines, premium materials, and instant response made for daily use.
							</p>
							${new Button({
								label: "Book a Demo",
								variant: "solid",
								href: "/demo-drive",
								className: "hero-layer hero-layer--primary tablet",
							})}
							${new Button({
								label: "Compare Models",
								variant: "outline",
								href: "/models",
								className: "hero-layer hero-layer--secondary tablet",
							})}
							<p class="hero-layer hero-layer--eyebrow desktop">City Ready</p>
							<h2 class="hero-layer hero-layer--title desktop">Comfort That Moves Quietly</h2>
							<p class="hero-layer hero-layer--description desktop">
								Clean interior lines, premium materials, and instant response made for daily use.
							</p>
							${new Button({
								label: "Book a Demo",
								variant: "solid",
								href: "/demo-drive",
								className: "hero-layer hero-layer--primary desktop",
							})}
							${new Button({
								label: "Compare Models",
								variant: "outline",
								href: "/models",
								className: "hero-layer hero-layer--secondary desktop",
							})}
						</div>

						<!-- Slide 3: edit image, text, and buttons here -->
						<div class="hero-slide hero-slide--3" id="slide-3" aria-label="Slide 3 of 4">
							${new LazyPicture({
								pictureClassName: "hero-slide-picture",
								src: {
									phone: slideThreeMobile,
									tablet: slideThreeTablet,
									pc: slideThreeDesktop,
								},
								alt: "Blue Rivian truck on a coastal road with mountains in the background",
								sizes: "100vw",
								className: "hero-slide-image",
							})}
							<p class="hero-layer hero-layer--eyebrow mobile">Long Range</p>
							<h2 class="hero-layer hero-layer--title mobile">Drive Coast to Coast</h2>
							<p class="hero-layer hero-layer--description mobile">
								Fast charging and smart trip planning keep your route smooth from sunrise to sunset.
							</p>
							${new Button({
								label: "Estimate Range",
								variant: "solid",
								href: "/range",
								className: "hero-layer hero-layer--primary mobile",
							})}
							${new Button({
								label: "Find Chargers",
								variant: "outline",
								href: "/charging",
								className: "hero-layer hero-layer--secondary mobile",
							})}
							<p class="hero-layer hero-layer--eyebrow tablet">Long Range</p>
							<h2 class="hero-layer hero-layer--title tablet">Drive Coast to Coast</h2>
							<p class="hero-layer hero-layer--description tablet">
								Fast charging and smart trip planning keep your route smooth from sunrise to sunset.
							</p>
							${new Button({
								label: "Estimate Range",
								variant: "solid",
								href: "/range",
								className: "hero-layer hero-layer--primary tablet",
							})}
							${new Button({
								label: "Find Chargers",
								variant: "outline",
								href: "/charging",
								className: "hero-layer hero-layer--secondary tablet",
							})}
							<p class="hero-layer hero-layer--eyebrow desktop">Long Range</p>
							<h2 class="hero-layer hero-layer--title desktop">Drive Coast to Coast</h2>
							<p class="hero-layer hero-layer--description desktop">
								Fast charging and smart trip planning keep your route smooth from sunrise to sunset.
							</p>
							${new Button({
								label: "Estimate Range",
								variant: "solid",
								href: "/range",
								className: "hero-layer hero-layer--primary desktop",
							})}
							${new Button({
								label: "Find Chargers",
								variant: "outline",
								href: "/charging",
								className: "hero-layer hero-layer--secondary desktop",
							})}
						</div>

						<!-- Slide 4: edit image, text, and buttons here -->
						<div class="hero-slide hero-slide--4" id="slide-4" aria-label="Slide 4 of 4">
							${new LazyPicture({
								pictureClassName: "hero-slide-picture",
								src: {
									phone: slideFourMobile,
									tablet: slideFourTablet,
									pc: slideFourDesktop,
								},
								alt: "Rivian truck parked beside a forested mountain road",
								sizes: "100vw",
								className: "hero-slide-image",
							})}
							<p class="hero-layer hero-layer--eyebrow mobile">Off-Road Control</p>
							<h2 class="hero-layer hero-layer--title mobile">Built for Uneven Ground</h2>
							<p class="hero-layer hero-layer--description mobile">
								Torque on demand, high ground clearance, and traction systems tuned for difficult terrain.
							</p>
							${new Button({
								label: "See Features",
								variant: "solid",
								href: "/features",
								className: "hero-layer hero-layer--primary mobile",
							})}
							${new Button({
								label: "Talk to Sales",
								variant: "outline",
								href: "/contact",
								className: "hero-layer hero-layer--secondary mobile",
							})}
							<p class="hero-layer hero-layer--eyebrow tablet">Off-Road Control</p>
							<h2 class="hero-layer hero-layer--title tablet">Built for Uneven Ground</h2>
							<p class="hero-layer hero-layer--description tablet">
								Torque on demand, high ground clearance, and traction systems tuned for difficult terrain.
							</p>
							${new Button({
								label: "See Features",
								variant: "solid",
								href: "/features",
								className: "hero-layer hero-layer--primary tablet",
							})}
							${new Button({
								label: "Talk to Sales",
								variant: "outline",
								href: "/contact",
								className: "hero-layer hero-layer--secondary tablet",
							})}
							<p class="hero-layer hero-layer--eyebrow desktop">Off-Road Control</p>
							<h2 class="hero-layer hero-layer--title desktop">Built for Uneven Ground</h2>
							<p class="hero-layer hero-layer--description desktop">
								Torque on demand, high ground clearance, and traction systems tuned for difficult terrain.
							</p>
							${new Button({
								label: "See Features",
								variant: "solid",
								href: "/features",
								className: "hero-layer hero-layer--primary desktop",
							})}
							${new Button({
								label: "Talk to Sales",
								variant: "outline",
								href: "/contact",
								className: "hero-layer hero-layer--secondary desktop",
							})}
						</div>
					</div>
				</div>
				<!-- Slider pill indicator -->
				<div
					class="hero-carousel__nav"
					role="tablist"
					aria-label="Hero carousel navigation"
				>
					<button
						type="button"
						class="hero-carousel__dot is-active"
						data-slide-index="0"
						aria-label="Go to slide 1 of 4"
						aria-current="true"
						aria-pressed="true"
					></button>
					<button
						type="button"
						class="hero-carousel__dot"
						data-slide-index="1"
						aria-label="Go to slide 2 of 4"
						aria-pressed="false"
					></button>
					<button
						type="button"
						class="hero-carousel__dot"
						data-slide-index="2"
						aria-label="Go to slide 3 of 4"
						aria-pressed="false"
					></button>
					<button
						type="button"
						class="hero-carousel__dot"
						data-slide-index="3"
						aria-label="Go to slide 4 of 4"
						aria-pressed="false"
					></button>
					</div>
				</div>
			`;
	}
}
