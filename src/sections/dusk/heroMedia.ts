import { View } from "@lib/view";

const DUSK_STARTING_PRICE = 82_990;
const DUSK_TERM_MONTHS = 24;

const wholeUsdFormatter = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	minimumFractionDigits: 0,
	maximumFractionDigits: 0,
});

const preciseUsdFormatter = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
});

export class DuskHeroMediaSection extends View<"section"> {
	constructor() {
		super("section", {
			className: ["page-section", "dusk-hero"],
			dataset: { gaSection: "dusk-hero-media" },
		});
	}

	protected override onMount(): void {
		const media = this.element.querySelector<HTMLElement>(
			"[data-dusk-hero-media]",
		);
		const video = this.element.querySelector<HTMLVideoElement>(
			"[data-dusk-hero-video]",
		);

		if (!media || !video) {
			return;
		}

		const shouldReduceMotion =
			typeof window.matchMedia === "function" &&
			window.matchMedia("(prefers-reduced-motion: reduce)").matches;

		if (shouldReduceMotion) {
			media.classList.add("is-finished");
			video.pause();
			return;
		}

		let hasFinished = false;
		let isInViewport = false;

		const resolveViewportVisibility = (): boolean => {
			const viewportHeight = Math.max(window.innerHeight, 1);
			const rect = media.getBoundingClientRect();
			const visibleBlockSize =
				Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
			const minVisibleBlockSize = Math.min(rect.height, viewportHeight) * 0.2;
			return visibleBlockSize >= minVisibleBlockSize;
		};

		const syncPlaybackState = (): void => {
			if (hasFinished) {
				return;
			}

			const shouldPlay = isInViewport && !document.hidden;
			if (!shouldPlay) {
				video.pause();
				return;
			}

			const playPromise = video.play();
			if (playPromise instanceof Promise) {
				void playPromise.catch(() => {
					// If autoplay is blocked, keep the first frame visible.
				});
			}
		};

		const revealStillImage = (): void => {
			hasFinished = true;
			media.classList.add("is-finished");
			video.pause();
		};

		this.cleanup.on(video, "ended", revealStillImage);
		this.cleanup.on(video, "error", revealStillImage);
		document.addEventListener("visibilitychange", syncPlaybackState);
		this.cleanup.add(() => {
			document.removeEventListener("visibilitychange", syncPlaybackState);
		});

		isInViewport = resolveViewportVisibility();
		syncPlaybackState();

		if (typeof IntersectionObserver === "function") {
			const observer = new IntersectionObserver(
				(entries) => {
					const entry = entries[0];
					isInViewport = Boolean(
						entry?.isIntersecting && entry.intersectionRatio >= 0.2,
					);
					syncPlaybackState();
				},
				{ threshold: [0, 0.2, 0.5] },
			);

			observer.observe(media);
			this.cleanup.add(() => observer.disconnect());
			return;
		}

		const handleViewportFallback = (): void => {
			isInViewport = resolveViewportVisibility();
			syncPlaybackState();
		};

		this.cleanup.on(window, "scroll", handleViewportFallback, {
			passive: true,
		});
		this.cleanup.on(window, "resize", handleViewportFallback, {
			passive: true,
		});
	}

	render(): DocumentFragment {
		const monthlyEstimate = DUSK_STARTING_PRICE / DUSK_TERM_MONTHS;
		const pricingLabel = `From ${wholeUsdFormatter.format(DUSK_STARTING_PRICE)} or ${preciseUsdFormatter.format(monthlyEstimate)}/mo. for ${DUSK_TERM_MONTHS} mo.*`;

		return this.tpl`
			<div class="dusk-hero__shell">
				<div class="dusk-hero__media" data-dusk-hero-media>
					<video
						class="dusk-hero__video"
						data-dusk-hero-video
						muted
						playsinline
						preload="auto"
						poster="/assets/dusk/hero_endframe.webp"
						aria-label="Dusk hero video"
					>
						<source src="/assets/dusk/hero_video.webm" type="video/webm" />
					</video>
					<img
						class="dusk-hero__image"
						src="/assets/dusk/hero_endframe.webp"
						alt="Dusk exterior still frame"
					/>
				</div>
					<div class="dusk-hero__buy-block">
						<a class="dusk-hero__buy-button" href="/dusk/build">Buy</a>
						<p class="dusk-hero__buy-price">${pricingLabel}</p>
					</div>
				</div>
			`;
	}
}
