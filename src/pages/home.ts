import { View } from "@lib/view";
import { HomeHeroSection } from "@sections/home/hero";

export class HomePage extends View<"section"> {
	constructor() {
		super("section");
	}

	render(): DocumentFragment {
		return this.tpl`
			${new HomeHeroSection()}
		`;
	}
}
