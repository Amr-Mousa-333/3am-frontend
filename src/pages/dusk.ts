import { View } from "@lib/view";
import { DuskLineupSection } from "@sections/dusk/buildJourney";
import { DuskHeroMediaSection } from "@sections/dusk/heroMedia";
import { DuskSizeUpSection } from "@sections/dusk/sizeUp";
import { DuskSpinCanvasSection } from "@sections/dusk/spinCanvas";

export class DuskPage extends View<"section"> {
	constructor() {
		super("section", { className: "dusk-page" });
	}

	render(): DocumentFragment {
		return this.tpl`
			<h1 class="visually-hidden">Model Dusk</h1>
			${new DuskHeroMediaSection()}
			${new DuskSpinCanvasSection()}
			${new DuskSizeUpSection()}
			${new DuskLineupSection()}
		`;
	}
}
