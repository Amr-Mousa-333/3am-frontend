import { View } from "@lib/view";
import { DAWN_BUILD_LINEUP_MODELS } from "@sections/dawn/buildJourneyConfig";
import { DuskLineupSection } from "@sections/dusk/buildJourney";
import { DuskHeroMediaSection } from "@sections/dusk/heroMedia";
import { DuskSizeUpSection } from "@sections/dusk/sizeUp";
import { DuskSpinCanvasSection } from "@sections/dusk/spinCanvas";

export class DawnPage extends View<"section"> {
	constructor() {
		super("section", { className: ["dawn-page", "dusk-page"] });
	}

	render(): DocumentFragment {
		return this.tpl`
			<h1 class="visually-hidden">Model Dawn</h1>
			${new DuskHeroMediaSection()}
			${new DuskSpinCanvasSection()}
			${new DuskSizeUpSection()}
			${new DuskLineupSection({
				title: "Choose your DAWN build",
				buildHref: "/dawn/build",
				models: DAWN_BUILD_LINEUP_MODELS,
			})}
		`;
	}
}
