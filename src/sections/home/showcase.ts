import { View } from "@lib/view";
import { setupHomeShowcase } from "./showcaseBehavior";

type ShowcaseVehicle = {
	model: string;
	themeClassName: string;
};

const vehicles: ShowcaseVehicle[] = [
	{
		model: "DAWN",
		themeClassName: "showcase-panel--dawn",
	},
	{
		model: "DUSK",
		themeClassName: "showcase-panel--dusk",
	},
];

export class HomeShowcaseSection extends View<"section"> {
	constructor() {
		super("section", {
			className: ["page-section", "showcase"],
			dataset: { gaSection: "home-showcase" },
		});
	}

	protected override onMount(): void {
		setupHomeShowcase(this.element, this.cleanup);
	}

	render(): DocumentFragment {
		return this.tpl`
			<div class="showcase-shell">
				<div class="showcase-sticky">
					<div class="showcase-viewport">
						<div class="showcase-track">
							${vehicles.map((vehicle, index) =>
								this.renderVehiclePanel(vehicle, index),
							)}
						</div>
					</div>
				</div>
			</div>
		`;
	}

	private renderVehiclePanel(
		vehicle: ShowcaseVehicle,
		index: number,
	): DocumentFragment {
		return this.tpl`
				<article
				class="showcase-panel ${vehicle.themeClassName}"
				data-showcase-panel
				aria-label="${vehicle.model} canvas showcase"
			>
					<div class="showcase-stage" aria-hidden="true">
						<h3
							class="showcase-model"
							data-showcase-model
							data-showcase-model-index="${index}"
						>
							${vehicle.model}
						</h3>
						<div class="showcase-vehicle">
							<canvas
								class="showcase-car-canvas"
								data-showcase-car-canvas
								data-vehicle-index="${index}"
							></canvas>
						</div>
					</div>
				</article>
			`;
	}
}
