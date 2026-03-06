import type { CleanupBag } from "@lib/cleanup";
import { clamp } from "@lib/math";

const CAR_SEQUENCE_FRAME_COUNT = 20;
const MODEL_LEFT_PARALLAX_RATIO = 0.18;
const APPROACH_SCROLL_VIEWPORT_RATIO = 0.34;
const APPROACH_START_TRIGGER_RATIO = 0.62;
const MODEL_APPROACH_DOWN_VIEWPORT_RATIO = 0.24;
const HORIZONTAL_SCROLL_DURATION_MULTIPLIER = 1.85;
const MAX_CANVAS_DPR = 1.5;
const FRAME_PRELOAD_INITIAL_DELAY_MS = 260;
const FRAME_PRELOAD_INTERVAL_MS = 140;
const GSAP_HYDRATE_ROOT_MARGIN = "320px 0px";

type CarCanvasHandle = {
	node: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	vehicleIndex: number;
	lastFrame: number;
};

type ShowcaseModelHandle = {
	node: HTMLElement;
	modelIndex: number;
};

type ShowcaseAnimationState = {
	approachProgress: number;
	horizontalProgress: number;
};

type ScrollTriggerUpdate = {
	progress: number;
};

type ScrollTriggerConfig = {
	trigger: Element;
	start: string;
	end: string | (() => string);
	scrub: boolean;
	invalidateOnRefresh: boolean;
	onUpdate: (self: ScrollTriggerUpdate) => void;
};

type ScrollTriggerHandle = {
	kill: () => void;
	refresh: () => void;
	progress: number;
};

const frameUrlAt = (frameIndex: number): string =>
	`/assets/cars/${String(frameIndex + 1).padStart(4, "0")}.webp`;

const parseVehicleIndex = (value: string | undefined): number | null => {
	const parsed = Number.parseInt(value ?? "", 10);
	if (Number.isNaN(parsed) || parsed < 0) {
		return null;
	}
	return parsed;
};

const resizeCanvasBitmap = (canvas: HTMLCanvasElement): boolean => {
	const dpr = Math.min(window.devicePixelRatio || 1, MAX_CANVAS_DPR);
	const width = Math.max(1, Math.round(canvas.clientWidth * dpr));
	const height = Math.max(1, Math.round(canvas.clientHeight * dpr));

	if (canvas.width === width && canvas.height === height) {
		return false;
	}

	canvas.width = width;
	canvas.height = height;
	return true;
};

const drawCarFrame = (canvas: CarCanvasHandle, frame: HTMLImageElement): void => {
	resizeCanvasBitmap(canvas.node);

	if (canvas.node.width <= 0 || canvas.node.height <= 0) {
		return;
	}

	if (frame.naturalWidth <= 0 || frame.naturalHeight <= 0) {
		return;
	}

	const scale = Math.max(
		canvas.node.width / frame.naturalWidth,
		canvas.node.height / frame.naturalHeight,
	);
	const drawWidth = frame.naturalWidth * scale;
	const drawHeight = frame.naturalHeight * scale;
	const drawX = (canvas.node.width - drawWidth) / 2;
	const drawY = canvas.node.height - drawHeight;

	canvas.ctx.clearRect(0, 0, canvas.node.width, canvas.node.height);
	canvas.ctx.drawImage(frame, drawX, drawY, drawWidth, drawHeight);
};

const findNearestLoadedFrame = (
	frames: Array<HTMLImageElement | null>,
	targetIndex: number,
): HTMLImageElement | null => {
	const exact = frames[targetIndex];
	if (exact) {
		return exact;
	}

	for (let distance = 1; distance < frames.length; distance += 1) {
		const backward = targetIndex - distance;
		if (backward >= 0) {
			const backwardFrame = frames[backward];
			if (backwardFrame) {
				return backwardFrame;
			}
		}

		const forward = targetIndex + distance;
		if (forward < frames.length) {
			const forwardFrame = frames[forward];
			if (forwardFrame) {
				return forwardFrame;
			}
		}
	}

	return null;
};

export const setupHomeShowcase = (
	root: ParentNode,
	cleanup: CleanupBag,
): void => {
	const shell = root.querySelector<HTMLElement>(".showcase-shell");
	const track = root.querySelector<HTMLElement>(".showcase-track");
	const panels = Array.from(
		root.querySelectorAll<HTMLElement>("[data-showcase-panel]"),
	);
	const modelNodes = Array.from(
		root.querySelectorAll<HTMLElement>("[data-showcase-model]"),
	);
	const carCanvasNodes = Array.from(
		root.querySelectorAll<HTMLCanvasElement>("[data-showcase-car-canvas]"),
	);

	if (!shell || !track || panels.length === 0 || carCanvasNodes.length === 0) {
		return;
	}

	const carCanvases: CarCanvasHandle[] = [];

	for (const node of carCanvasNodes) {
		const ctx = node.getContext("2d");
		const vehicleIndex = parseVehicleIndex(node.dataset.vehicleIndex);

		if (!ctx || vehicleIndex === null) {
			continue;
		}

		ctx.imageSmoothingEnabled = true;
		ctx.imageSmoothingQuality = "high";

		carCanvases.push({
			node,
			ctx,
			vehicleIndex,
			lastFrame: -1,
		});
	}

	if (carCanvases.length === 0) {
		return;
	}

	const models: ShowcaseModelHandle[] = [];
	for (const modelNode of modelNodes) {
		const modelIndex = parseVehicleIndex(modelNode.dataset.showcaseModelIndex);
		if (modelIndex === null) {
			continue;
		}
		models.push({ node: modelNode, modelIndex });
	}

	const reducedMotionQuery =
		typeof window.matchMedia === "function"
			? window.matchMedia("(prefers-reduced-motion: reduce)")
			: null;
	const prefersReducedMotion = (): boolean =>
		reducedMotionQuery?.matches ?? false;

	const frames: Array<HTMLImageElement | null> = Array.from(
		{ length: CAR_SEQUENCE_FRAME_COUNT },
		() => null,
	);
	const frameRequested: boolean[] = Array.from(
		{ length: CAR_SEQUENCE_FRAME_COUNT },
		() => false,
	);

	let isDisposed = false;
	let rafId = 0;
	let preloadTimer = 0;
	let preloadCursor = 0;
	let scrollSpan = 1;
	let approachSpan = 1;
	let trackDistance = 0;
	let animationSpan = 1;
	let scrollTrigger: ScrollTriggerHandle | null = null;
	let createScrollTrigger:
		| ((config: ScrollTriggerConfig) => ScrollTriggerHandle)
		| null = null;
	let isScrollTriggerReady = false;
	let isScrollTriggerLoading = false;
	let hasStartedFrameLoading = false;

	const animationState: ShowcaseAnimationState = {
		approachProgress: 0,
		horizontalProgress: 0,
	};

	const hydrateGsap = async (): Promise<void> => {
		if (createScrollTrigger || isScrollTriggerLoading) {
			return;
		}

		isScrollTriggerLoading = true;

		try {
			const [{ gsap }, { ScrollTrigger }] = await Promise.all([
				import("gsap"),
				import("gsap/ScrollTrigger"),
			]);

			if (isDisposed) {
				return;
			}

			gsap.registerPlugin(ScrollTrigger);
			const scrollTriggerApi = ScrollTrigger as unknown as {
				create: (config: ScrollTriggerConfig) => ScrollTriggerHandle;
			};
			createScrollTrigger = (config) => scrollTriggerApi.create(config);
			isScrollTriggerReady = true;
		} finally {
			isScrollTriggerLoading = false;
		}
	};

	const queueRender = (): void => {
		if (rafId !== 0) {
			return;
		}

		rafId = window.requestAnimationFrame(render);
	};

	const updateAnimationState = (overallProgress: number): void => {
		const normalizedProgress = clamp(overallProgress, 0, 1);
		const splitRatio = approachSpan / Math.max(1, approachSpan + scrollSpan);

		animationState.approachProgress =
			splitRatio <= 0 ? 1 : clamp(normalizedProgress / splitRatio, 0, 1);
		animationState.horizontalProgress =
			splitRatio >= 1
				? 0
				: clamp((normalizedProgress - splitRatio) / (1 - splitRatio), 0, 1);

		queueRender();
	};

	const syncGeometry = (): void => {
		const viewportHeight = window.innerHeight;
		const horizontalDistance = Math.max(
			0,
			window.innerWidth * (panels.length - 1),
		);
		trackDistance = horizontalDistance;
		approachSpan = Math.max(
			1,
			Math.round(viewportHeight * APPROACH_SCROLL_VIEWPORT_RATIO),
		);
		scrollSpan = Math.max(
			1,
			Math.round(horizontalDistance * HORIZONTAL_SCROLL_DURATION_MULTIPLIER),
		);
		animationSpan = Math.max(1, approachSpan + scrollSpan);

		shell.style.blockSize = `${Math.round(viewportHeight + animationSpan)}px`;

		for (const carCanvas of carCanvases) {
			if (resizeCanvasBitmap(carCanvas.node)) {
				carCanvas.lastFrame = -1;
			}
		}
	};

	const requestFrame = (frameIndex: number): void => {
		if (frameIndex < 0 || frameIndex >= CAR_SEQUENCE_FRAME_COUNT) {
			return;
		}
		if (frameRequested[frameIndex]) {
			return;
		}

		frameRequested[frameIndex] = true;

		const image = new Image();
		image.decoding = "async";
		image.src = frameUrlAt(frameIndex);
		image.addEventListener(
			"load",
			() => {
				if (isDisposed) {
					return;
				}
				frames[frameIndex] = image;
				queueRender();
			},
			{ once: true },
		);
		image.addEventListener(
			"error",
			() => {
				if (isDisposed) {
					return;
				}
				// Allow future retry attempts if the request fails transiently.
				frameRequested[frameIndex] = false;
			},
			{ once: true },
		);
	};

	const schedulePreloadStep = (): void => {
		if (isDisposed) {
			return;
		}

		while (
			preloadCursor < CAR_SEQUENCE_FRAME_COUNT &&
			frameRequested[preloadCursor]
		) {
			preloadCursor += 1;
		}

		if (preloadCursor >= CAR_SEQUENCE_FRAME_COUNT) {
			return;
		}

		requestFrame(preloadCursor);
		preloadCursor += 1;
		preloadTimer = window.setTimeout(
			schedulePreloadStep,
			FRAME_PRELOAD_INTERVAL_MS,
		);
	};

	const startFrameLoading = (): void => {
		if (hasStartedFrameLoading) {
			return;
		}

		hasStartedFrameLoading = true;
		requestFrame(0);
		requestFrame(1);
		preloadTimer = window.setTimeout(
			schedulePreloadStep,
			FRAME_PRELOAD_INITIAL_DELAY_MS,
		);
	};

	const render = (): void => {
		rafId = 0;

		const isReducedMotion = prefersReducedMotion();
		const viewportHeight = window.innerHeight;
		const approachProgress = isReducedMotion
			? 0
			: animationState.approachProgress;
		const horizontalProgress = isReducedMotion
			? 0
			: animationState.horizontalProgress;
		const trackOffset = Math.round(horizontalProgress * trackDistance);
		track.style.transform = `translate3d(${-trackOffset}px, 0, 0)`;

		const modelLeftParallaxMax = window.innerWidth * MODEL_LEFT_PARALLAX_RATIO;
		const modelVerticalOffset =
			viewportHeight * MODEL_APPROACH_DOWN_VIEWPORT_RATIO * approachProgress;

		for (const model of models) {
			const modelX = isReducedMotion
				? 0
				: modelLeftParallaxMax * model.modelIndex -
					modelLeftParallaxMax * horizontalProgress;
			model.node.style.setProperty(
				"--showcase-model-x",
				`${modelX.toFixed(2)}px`,
			);
			model.node.style.setProperty(
				"--showcase-model-y",
				`${modelVerticalOffset.toFixed(2)}px`,
			);
		}

		const panelProgressBase = horizontalProgress;

		for (const carCanvas of carCanvases) {
			const localProgress = clamp(
				panelProgressBase * panels.length - carCanvas.vehicleIndex,
				0,
				1,
			);
			const frameIndex = Math.round(
				localProgress * (CAR_SEQUENCE_FRAME_COUNT - 1),
			);
			requestFrame(frameIndex);
			requestFrame(frameIndex - 1);
			requestFrame(frameIndex + 1);
			const frame =
				findNearestLoadedFrame(frames, frameIndex) ?? findNearestLoadedFrame(frames, 0);

			if (!frame) {
				continue;
			}

			if (frameIndex === carCanvas.lastFrame && carCanvas.node.width > 0) {
				continue;
			}

			drawCarFrame(carCanvas, frame);
			carCanvas.lastFrame = frameIndex;
		}
	};

	const setupScrollTrigger = (): void => {
		if (!createScrollTrigger) {
			return;
		}

		scrollTrigger?.kill();

		const startThresholdPercent = Math.round(APPROACH_START_TRIGGER_RATIO * 100);
		scrollTrigger = createScrollTrigger({
			trigger: shell,
			start: `top ${startThresholdPercent}%`,
			end: () => `+=${Math.max(1, animationSpan)}`,
			scrub: true,
			invalidateOnRefresh: true,
			onUpdate: (self) => {
				updateAnimationState(self.progress);
			},
		});

		updateAnimationState(scrollTrigger.progress);
	};

	cleanup.on(
		window,
		"resize",
		() => {
			syncGeometry();
			if (isScrollTriggerReady) {
				scrollTrigger?.refresh();
			}
			queueRender();
		},
		{ passive: true },
	);

	if (reducedMotionQuery) {
		const handleReducedMotionChange = (): void => {
			queueRender();
		};
		reducedMotionQuery.addEventListener("change", handleReducedMotionChange);
		cleanup.add(() => {
			reducedMotionQuery.removeEventListener(
				"change",
				handleReducedMotionChange,
			);
		});
	}

	const initializeScrollAnimation = async (): Promise<void> => {
		try {
			await hydrateGsap();
		} catch (error) {
			console.error("Failed to load GSAP for showcase animation", error);
			return;
		}

		if (isDisposed) {
			return;
		}

		setupScrollTrigger();
	};

	syncGeometry();
	if (typeof IntersectionObserver === "function") {
		const observer = new IntersectionObserver(
			(entries) => {
				if (!entries.some((entry) => entry.isIntersecting)) {
					return;
				}

				observer.disconnect();
				startFrameLoading();
				void initializeScrollAnimation();
			},
			{ rootMargin: GSAP_HYDRATE_ROOT_MARGIN },
		);

		observer.observe(shell);
		cleanup.add(() => observer.disconnect());
	} else {
		startFrameLoading();
		void initializeScrollAnimation();
	}
	queueRender();

	cleanup.add(() => {
		isDisposed = true;
		if (preloadTimer !== 0) {
			window.clearTimeout(preloadTimer);
		}
		if (rafId !== 0) {
			window.cancelAnimationFrame(rafId);
		}
		scrollTrigger?.kill();
	});
};
