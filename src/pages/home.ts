import { View } from "@lib/view";
import { HomeHeroSection } from "@sections/home/hero";
import { VideoGallery } from "@components/videoGallery";


export class HomePage extends View<"section"> {
	constructor() {
		super("section", { className: "home-page" });
	}

	render(): DocumentFragment {
		return this.tpl`
			${new HomeHeroSection()}${new VideoGallery({
    headline: "Get the highlights.",
    slides: [
        { src: "/assets/video1.mp4", caption: "Capture life in stunning detail." },
        { src: "/assets/video2.mp4", caption: "Simply powerful." },
        { src: "/assets/video3.mp4", caption: "Pro camera system. Simplified." },
    ],
})}
			<p style='margin-top: 1000px'>Hello</pstyle>
		`;
	}
}

