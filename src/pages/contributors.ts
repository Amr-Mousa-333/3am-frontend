import { html } from "@lib/template";
import { View } from "@lib/view";

const contributors = [
	{ name: "Ali Mustafa", href: "https://github.com/ali7510" },
	{ name: "Amr Mousa", href: "https://github.com/Amr-Mousa-333" },
	{ name: "Aya Mohamed", href: "https://github.com/Ayamohamed2" },
	{ name: "Momen Ayman", href: "https://github.com/momenaymann" },
	{ name: "Muhannad Hassan", href: "https://github.com/Majoramari" },
];

export class ContributorsPage extends View<"section"> {
	constructor() {
		super("section", { className: ["page-section", "legal-page"] });
	}

	render(): DocumentFragment {
		return html`
			<div class="legal-page__shell">
				<h1 class="legal-page__title">Contributors</h1>
				<div class="legal-page__body">
					${contributors.map(
						(contributor) => html`
							<p>
								<a href="${contributor.href}" target="_blank" rel="noreferrer">
									${contributor.name}
								</a>
							</p>
						`,
					)}
				</div>
			</div>
		`;
	}
}
