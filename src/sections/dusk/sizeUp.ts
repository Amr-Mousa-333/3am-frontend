import { View } from "@lib/view";

type SizeSpec = {
	label: string;
	value: string;
};

const sizeSpecs: ReadonlyArray<SizeSpec> = [
	{ label: "A. Max height (with antenna)", value: "77.3 in" },
	{ label: "B. Width (side mirrors folded)", value: "82 in" },
	{ label: "C. Wheelbase", value: "121.1 in" },
	{ label: "D. Length", value: "200.8 in" },
	{ label: "E. Approach angle", value: "35.8°" },
	{ label: "F. Departure angle", value: "34.4°" },
];

export class DuskSizeUpSection extends View<"section"> {
	constructor() {
		super("section", {
			className: ["page-section", "dusk-sizeup"],
			dataset: { gaSection: "dusk-size-up" },
		});
	}

	render(): DocumentFragment {
		return this.tpl`
			<div class="dusk-sizeup__shell">
				<header class="dusk-sizeup__header">
					<h2 class="dusk-sizeup__title">Size it up</h2>
				</header>

				<div class="dusk-sizeup__drawings" aria-label="Dusk dimensions diagrams">
					<figure class="dusk-sizeup__drawing dusk-sizeup__drawing--front">
						<img
							class="dusk-sizeup__car-image"
							src="/assets/dusk/blueprint/front.png"
							alt="Front view technical blueprint of Dusk"
							loading="lazy"
						/>
						<span class="dusk-sizeup__line dusk-sizeup__line--front-width" aria-hidden="true"></span>
						<span class="dusk-sizeup__line dusk-sizeup__line--front-height" aria-hidden="true"></span>
						<span class="dusk-sizeup__marker dusk-sizeup__marker--front-a" aria-hidden="true">A</span>
						<span class="dusk-sizeup__marker dusk-sizeup__marker--front-b" aria-hidden="true">B</span>
					</figure>

					<figure class="dusk-sizeup__drawing dusk-sizeup__drawing--side">
						<img
							class="dusk-sizeup__car-image"
							src="/assets/dusk/blueprint/side.png"
							alt="Side view technical blueprint of Dusk"
							loading="lazy"
						/>
						<span class="dusk-sizeup__line dusk-sizeup__line--side-top" aria-hidden="true"></span>
						<span class="dusk-sizeup__line dusk-sizeup__line--side-bottom" aria-hidden="true"></span>
						<span class="dusk-sizeup__line dusk-sizeup__line--side-left-angle" aria-hidden="true"></span>
						<span class="dusk-sizeup__line dusk-sizeup__line--side-right-angle" aria-hidden="true"></span>
						<span class="dusk-sizeup__marker dusk-sizeup__marker--side-c" aria-hidden="true">C</span>
						<span class="dusk-sizeup__marker dusk-sizeup__marker--side-d" aria-hidden="true">D</span>
						<span class="dusk-sizeup__marker dusk-sizeup__marker--side-e" aria-hidden="true">E</span>
						<span class="dusk-sizeup__marker dusk-sizeup__marker--side-f" aria-hidden="true">F</span>
					</figure>
				</div>

				<ul class="dusk-sizeup__spec-list">
					${sizeSpecs.map(
						(spec) => this.tpl`
							<li class="dusk-sizeup__spec-item">
								<span class="dusk-sizeup__spec-label">${spec.label}</span>
								<span class="dusk-sizeup__spec-value">${spec.value}</span>
							</li>
						`,
					)}
				</ul>
			</div>
		`;
	}
}
