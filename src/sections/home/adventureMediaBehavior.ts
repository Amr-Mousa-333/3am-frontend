import type { CleanupBag } from "@lib/cleanup";

const PROGRAMMATIC_SCROLL_SETTLE_MS = 150;
const ACTIVE_INDEX_HYSTERESIS_PX = 20;

const parseIndex = (value: string | undefined): number | null => {
	const parsed = Number.parseInt(value ?? "", 10);
	if (Number.isNaN(parsed) || parsed < 0) {
		return null;
	}
	return parsed;
};

export const setupHomeAdventureMedia = (
	root: ParentNode,
	cleanup: CleanupBag,
): void => {
	const rail = root.querySelector<HTMLElement>(".adventure-media__rail");
	const pills = Array.from(
		root.querySelectorAll<HTMLButtonElement>("[data-adventure-pill-index]"),
	);
	const cards = Array.from(
		root.querySelectorAll<HTMLElement>("[data-adventure-card-index]"),
	);

	if (!rail || pills.length === 0 || cards.length === 0) {
		return;
	}

	let activeIndex = 0;
	let rafId = 0;
	let settleTimerId = 0;
	let pendingProgrammaticIndex: number | null = null;

	const setActivePill = (targetIndex: number): void => {
		if (targetIndex === activeIndex) {
			return;
		}
		activeIndex = targetIndex;

		for (const [index, pill] of pills.entries()) {
			const isActive = index === targetIndex;
			pill.classList.toggle("is-active", isActive);
			pill.setAttribute("aria-pressed", String(isActive));
		}
	};

	const scheduleScrollSettle = (): void => {
		if (settleTimerId !== 0) {
			window.clearTimeout(settleTimerId);
		}

		settleTimerId = window.setTimeout(() => {
			settleTimerId = 0;
			pendingProgrammaticIndex = null;
			if (rafId !== 0) {
				return;
			}
			rafId = window.requestAnimationFrame(syncActiveFromScroll);
		}, PROGRAMMATIC_SCROLL_SETTLE_MS);
	};

	const scrollToCard = (
		targetIndex: number,
		behavior: ScrollBehavior = "smooth",
	): void => {
		const target = cards[targetIndex];
		if (!target) {
			return;
		}

		const railRect = rail.getBoundingClientRect();
		const targetRect = target.getBoundingClientRect();
		const deltaToCenter =
			targetRect.left +
			targetRect.width / 2 -
			(railRect.left + railRect.width / 2);
		const centeredLeft = rail.scrollLeft + deltaToCenter;
		const maxScrollLeft = Math.max(0, rail.scrollWidth - rail.clientWidth);
		const nextLeft = Math.min(Math.max(0, centeredLeft), maxScrollLeft);
		pendingProgrammaticIndex = behavior === "smooth" ? targetIndex : null;
		rail.scrollTo({ left: nextLeft, behavior });
		setActivePill(targetIndex);
		scheduleScrollSettle();
	};

	const syncActiveFromScroll = (): void => {
		rafId = 0;
		const railCenterX = rail.scrollLeft + rail.clientWidth / 2;
		let nearestIndex = activeIndex;
		let nearestDistance = Number.POSITIVE_INFINITY;
		let activeDistance = Number.POSITIVE_INFINITY;

		for (const [index, card] of cards.entries()) {
			const centerX = card.offsetLeft + card.offsetWidth / 2;
			const distance = Math.abs(centerX - railCenterX);
			if (distance < nearestDistance) {
				nearestDistance = distance;
				nearestIndex = index;
			}
			if (index === activeIndex) {
				activeDistance = distance;
			}
		}

		if (
			nearestIndex !== activeIndex &&
			nearestDistance + ACTIVE_INDEX_HYSTERESIS_PX >= activeDistance
		) {
			return;
		}

		setActivePill(nearestIndex);
	};

	for (const pill of pills) {
		cleanup.on(pill, "click", () => {
			const targetIndex = parseIndex(pill.dataset.adventurePillIndex);
			if (targetIndex === null) {
				return;
			}
			scrollToCard(targetIndex);
		});
	}

	cleanup.on(
		rail,
		"scroll",
		() => {
			scheduleScrollSettle();
			if (pendingProgrammaticIndex !== null) {
				setActivePill(pendingProgrammaticIndex);
				return;
			}

			if (rafId !== 0) {
				return;
			}
			rafId = window.requestAnimationFrame(syncActiveFromScroll);
		},
		{ passive: true },
	);

	scrollToCard(0, "auto");

	cleanup.add(() => {
		if (rafId !== 0) {
			window.cancelAnimationFrame(rafId);
		}
		if (settleTimerId !== 0) {
			window.clearTimeout(settleTimerId);
		}
	});
};
