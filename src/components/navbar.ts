import { Button, type ButtonVariant } from "@components/button";
import { MediaCard, type MediaCardConfig } from "@components/mediaCard";
import { getRouter } from "@lib/router";
import { View } from "@lib/view";

type NavMenuName = "dusk" | "dawn" | "gears";

type PrimaryNavItem = {
	menu: NavMenuName;
	label: string;
	href: string;
};

type SecondaryNavItem = {
	label: string;
	href: string;
	variant?: ButtonVariant;
	className?: string;
	authAction?: "sign-out";
};

type MobileNavItem = {
	label: string;
	href: string;
	variant?: ButtonVariant;
	className?: string;
	authAction?: "sign-out";
};

type NavTopContrastMode = "light" | "dark";

const PRIMARY_NAV_ITEMS: ReadonlyArray<PrimaryNavItem> = [
	{ menu: "dusk", label: "DUSK", href: "/dusk" },
	{ menu: "dawn", label: "DAWN", href: "/dawn" },
	{ menu: "gears", label: "GEARS", href: "/gears" },
];

const DEMO_DRIVE_ITEM: SecondaryNavItem = {
	label: "Demo Drive",
	href: "/demo",
	variant: "cta",
	className: "nav-link-demo-drive",
};

const DASHBOARD_ITEM: SecondaryNavItem = {
	label: "Dashboard",
	href: "/admin/dashboard",
	variant: "text",
	className: "nav-link-dashboard",
};

const AUTHENTICATED_NAV_ITEMS: ReadonlyArray<SecondaryNavItem> = [
	DEMO_DRIVE_ITEM,
	{
		label: "Sign Out",
		href: "/signin",
		variant: "text",
		className: "nav-link-sign-out",
		authAction: "sign-out",
	},
];

const AUTHENTICATED_ADMIN_NAV_ITEMS: ReadonlyArray<SecondaryNavItem> = [
	DASHBOARD_ITEM,
	{
		label: "Sign Out",
		href: "/signin",
		variant: "text",
		className: "nav-link-sign-out",
		authAction: "sign-out",
	},
];

const GUEST_NAV_ITEMS: ReadonlyArray<SecondaryNavItem> = [
	DEMO_DRIVE_ITEM,
	{ label: "Sign In", href: "/signin", variant: "outline" },
];

const MOBILE_NAV_ITEMS: ReadonlyArray<MobileNavItem> = [
	{ label: "DUSK", href: "/dusk" },
	{ label: "DAWN", href: "/dawn" },
	{ label: "GEARS", href: "/gears" },
	{ label: "DEMO DRIVE", href: "/demo" },
];

const MOBILE_NAV_ITEMS_ADMIN: ReadonlyArray<MobileNavItem> = [
	{ label: "DUSK", href: "/dusk" },
	{ label: "DAWN", href: "/dawn" },
	{ label: "GEARS", href: "/gears" },
];

const MOBILE_DASHBOARD_ITEM: MobileNavItem = {
	label: "DASHBOARD",
	href: "/admin/dashboard",
};

const MOBILE_SIGN_IN_ITEM: MobileNavItem = {
	label: "SIGN IN",
	href: "/signin",
	variant: "outline",
	className: "nav-mobile-link-sign-in",
};

const MOBILE_SIGN_OUT_ITEM: MobileNavItem = {
	label: "SIGN OUT",
	href: "/signin",
	variant: "text",
	className: "nav-mobile-link-sign-out",
	authAction: "sign-out",
};

const NAV_MEGA_PLACEHOLDER_IMAGE = "/assets/shared/placeholder.png";
const NAV_MEGA_MEDIA_SOURCES = {
	dusk: "/assets/dusk/dusk_transparent.webp",
	dawn: "/assets/hero/slide-2-1440.webp",
} as const satisfies Record<Exclude<NavMenuName, "gears">, string>;

const ROLE_CLAIM_KEYS = [
	"role",
	"roles",
	"http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
	"http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role",
] as const;

const decodeJwtPayload = (token: string): Record<string, unknown> | null => {
	const parts = token.split(".");
	if (parts.length < 2) {
		return null;
	}

	const decoder =
		typeof globalThis.atob === "function" ? globalThis.atob : null;
	if (!decoder) {
		return null;
	}

	const payloadPart = parts[1];
	const base64 = payloadPart
		.replace(/-/g, "+")
		.replace(/_/g, "/")
		.padEnd(Math.ceil(payloadPart.length / 4) * 4, "=");

	try {
		return JSON.parse(decoder(base64)) as Record<string, unknown>;
	} catch {
		return null;
	}
};

const hasAdminRole = (token: string | null): boolean => {
	if (!token) {
		return false;
	}

	const payload = decodeJwtPayload(token);
	if (!payload) {
		return false;
	}

	for (const key of ROLE_CLAIM_KEYS) {
		const claim = payload[key];
		if (typeof claim === "string" && claim.trim().toLowerCase() === "admin") {
			return true;
		}
		if (
			Array.isArray(claim) &&
			claim.some(
				(item) =>
					typeof item === "string" && item.trim().toLowerCase() === "admin",
			)
		) {
			return true;
		}
	}

	return false;
};

/**
 * Gears card data lives in one place so updates are simple:
 * - move text with `textAnchor` + optional offsets
 * - adjust typography with `textSize`, `textColor`, and `textWeight`
 * - turn gradient readability layer on/off with `withOverlay`
 */
const GEARS_CARDS: ReadonlyArray<MediaCardConfig> = [
	{
		label: "Autonomous",
		href: "/gears/autonomous",
		className: "nav-gears-card-autonomous",
		backgroundImage: "/assets/shared/placeholder.png",
		deferBackgroundLoad: true,
		backgroundPosition: "right 20% center",
		textAnchor: "top-center",
		textSize: "3rem",
		textWeight: "bold",
		textColor: "rgb(255 255 255)",
		withOverlay: false,
	},
	{
		label: "Services",
		href: "/gears/services",
		className: "nav-gears-card-services",
		backgroundImage: "/assets/shared/placeholder.png",
		deferBackgroundLoad: true,
		backgroundPosition: "left 20% center",
		textAnchor: "bottom-left",
		textSize: "1.6rem",
		textColor: "rgb(255 255 255)",
		textWeight: "bold",
		withOverlay: false,
	},
	{
		label: "Chargers",
		href: "/gears/chargers",
		className: "nav-gears-card-chargers",
		backgroundImage: "/assets/shared/placeholder.png",
		deferBackgroundLoad: true,
		backgroundPosition: "center",
		textAnchor: "bottom-left",
		textSize: "1.6rem",
		textColor: "rgb(255 255 255)",
		textWeight: "bold",
		withOverlay: false,
	},
];

/**
 * Global top navigation with:
 * 1) scroll-aware shell style + hide/show behavior
 * 2) hover/focus driven desktop mega menus
 * 3) mobile toggle menu under 1100px
 */
class Navbar extends View<"nav"> {
	private static readonly SCROLL_THRESHOLD_PX = 12;
	private static readonly MIN_SCROLL_DELTA_PX = 6;
	private static readonly MENU_CLOSE_DELAY_MS = 100;
	private static readonly MOBILE_BREAKPOINT_PX = 1100;
	private static readonly MIN_TEXT_CONTRAST_RATIO = 4.5;
	private static readonly TOP_CONTRAST_SAMPLE_X_RATIOS = [0.18, 0.5, 0.82];
	private static readonly TOP_CONTRAST_SAMPLE_Y_RATIO = 0.55;
	private static readonly TOP_CONTRAST_MIN_SAMPLE_Y_PX = 14;
	private static readonly TOP_CONTRAST_WARMUP_STEPS = 18;
	private static readonly TOP_CONTRAST_WARMUP_STEP_MS = 180;
	private static readonly UNKNOWN_BACKDROP_LUMINANCE = 0.92;
	private static readonly MOBILE_MENU_PANEL_ID = "nav-mobile-panel";
	private static readonly MENU_NAMES = new Set<NavMenuName>([
		"dusk",
		"dawn",
		"gears",
	]);
	private static readonly ACTIVE_PAGE_LINK_SELECTOR = [
		".nav-menu-trigger",
		".nav-link",
		".nav-mega-link",
		".nav-mobile-link",
		".nav-mobile-top-sign-in",
	].join(", ");

	private static isNavMenuName(
		value: string | undefined,
	): value is NavMenuName {
		return (
			typeof value === "string" && Navbar.MENU_NAMES.has(value as NavMenuName)
		);
	}

	private static normalizePath(path: string): string {
		if (!path) {
			return "/";
		}

		const withLeadingSlash = path.startsWith("/") ? path : `/${path}`;
		if (withLeadingSlash === "/" || withLeadingSlash === "") {
			return "/";
		}
		return withLeadingSlash.endsWith("/")
			? withLeadingSlash.slice(0, -1)
			: withLeadingSlash;
	}

	private static toInternalPath(href: string): string | null {
		if (!href) {
			return null;
		}

		try {
			const url = new URL(href, window.location.origin);
			if (url.origin !== window.location.origin) {
				return null;
			}
			return Navbar.normalizePath(url.pathname);
		} catch {
			const [pathOnly = "/"] = href.split(/[?#]/, 1);
			return Navbar.normalizePath(pathOnly);
		}
	}

	private static isPathActive(currentPath: string, linkPath: string): boolean {
		if (linkPath === "/") {
			return currentPath === "/";
		}
		return currentPath === linkPath || currentPath.startsWith(`${linkPath}/`);
	}

	/**
	 * Scroll-derived visual state.
	 * - `isScrolled`: toggles `is-scrolled` class for CSS variables.
	 * - `isHidden`: toggles `is-hidden` class to slide nav out while scrolling down.
	 */
	private isScrolled = false;
	private isHidden = false;

	/**
	 * Last observed Y offset used to compute scroll direction and delta.
	 */
	private lastScrollY = 0;

	/**
	 * Currently open desktop mega menu.
	 */
	private activeMenu: NavMenuName | null = null;

	/**
	 * Mobile menu expanded state.
	 */
	private isMobileMenuOpen = false;

	/**
	 * Last route path used to mark active navbar links.
	 */
	private currentPath = "";

	/**
	 * Authentication state
	 */
	private isAuthenticated = false;
	private isAdmin = false;

	/**
	 * Pending close timer for delayed mega menu dismissal.
	 */
	private closeMenuTimerId: number | null = null;
	private readonly loadedMenuMedia = new Set<NavMenuName>();
	private suppressDesktopHoverUntilPointerLeave = false;
	private topContrastRafId = 0;
	private topContrastWarmupTimerId = 0;
	private topContrastWarmupStepsLeft = 0;
	private readonly contrastSampleCanvas = document.createElement("canvas");
	private readonly contrastSampleContext =
		this.contrastSampleCanvas.getContext("2d");

	constructor() {
		super("nav", { className: "nav-shell" });
	}

	/**
	 * `override` means we intentionally replace the base `View.mount` behavior
	 * while still calling `super.mount(parent)` first to keep default mounting.
	 */
	override mount(parent: HTMLElement): void {
		// Render + attach `<nav>` into the parent element.
		super.mount(parent);

		// Subscribe to auth state changes
		this.subscribeToAuthState();

		// Sync initial scroll state so the first paint matches current position.
		this.lastScrollY = window.scrollY;
		this.updateScrolledState();
		this.syncMobileMenuUi();

		// Global listeners for scroll behavior and menu interactions.
		this.cleanup.on(window, "scroll", this.handleScroll, { passive: true });
		this.cleanup.on(window, "resize", this.handleResize, { passive: true });
		this.cleanup.on(this.element, "pointerover", this.handleMenuPointerOver);
		this.cleanup.on(this.element, "focusin", this.handleMenuFocusIn);
		this.cleanup.on(this.element, "pointerleave", this.handleMenuPointerLeave);
		this.cleanup.on(this.element, "focusout", this.handleMenuFocusOut);
		this.cleanup.on(document, "load", this.handleBackdropMediaUpdate, {
			capture: true,
		});
		this.cleanup.on(document, "loadeddata", this.handleBackdropMediaUpdate, {
			capture: true,
		});
		document.addEventListener(
			"home-hero:slide-change",
			this.handleHeroSlideChange,
		);
		this.cleanup.add(() => {
			document.removeEventListener(
				"home-hero:slide-change",
				this.handleHeroSlideChange,
			);
		});
		this.bindClickHandlers();

		// Sync active-link state with the initial URL.
		this.setCurrentPath(window.location.pathname);
		this.scheduleTopContrastUpdate();
		this.startTopContrastWarmup();
	}

	protected override onDestroy(): void {
		// Why: this timeout is local component state, so clear it on teardown.
		this.cancelMenuClose();
		if (this.topContrastRafId !== 0) {
			window.cancelAnimationFrame(this.topContrastRafId);
		}
		this.stopTopContrastWarmup();
	}

	private subscribeToAuthState(): void {
		void import("@lib/authStore")
			.then(({ authStore }) => {
				const unsubscribe = authStore.subscribe((state) => {
					const wasAuthenticated = this.isAuthenticated;
					const wasAdmin = this.isAdmin;
					this.isAuthenticated = state.isAuthenticated;
					this.isAdmin = state.isAuthenticated
						? hasAdminRole(state.accessToken)
						: false;

					// Re-render nav items when auth state changes
					if (
						wasAuthenticated !== this.isAuthenticated ||
						wasAdmin !== this.isAdmin
					) {
						this.updateAuthNavItems();
					}
				});

				// Cleanup subscription on destroy
				this.cleanup.add(unsubscribe);
			})
			.catch(() => {
				// Ignore auth-store load errors in isolated test environments.
			});
	}

	private updateAuthNavItems(): void {
		// Update desktop nav items
		const navLinksEnd = this.element.querySelector(".nav-links-end");
		if (navLinksEnd) {
			navLinksEnd.innerHTML = "";
			for (const item of this.getAuthNavItems()) {
				const li = document.createElement("li");
				const button = new Button({
					label: item.label,
					className: ["nav-link", item.className ?? ""]
						.filter(Boolean)
						.join(" "),
					variant: item.variant ?? "text",
					href: item.href,
					dataset:
						item.authAction === "sign-out"
							? { authAction: item.authAction }
							: undefined,
				});
				li.appendChild(button.renderToNode());
				navLinksEnd.appendChild(li);
			}
			// Rebind click handlers
			this.bindClickHandlers();
		}

		// Update mobile nav items
		const mobileAuthItem = this.getMobileAuthItem();
		const mobileNavList = this.element.querySelector(".nav-mobile-list");
		if (mobileNavList) {
			// Keep main items and replace only the auth action row.
			const existingAuthItem = mobileNavList.querySelector(
				".nav-mobile-auth-item",
			);
			if (existingAuthItem) {
				existingAuthItem.remove();
			}

			const li = document.createElement("li");
			li.className = "nav-mobile-auth-item";
			const button = new Button({
				label: mobileAuthItem.label,
				className: ["nav-mobile-link", mobileAuthItem.className ?? ""]
					.filter(Boolean)
					.join(" "),
				variant: mobileAuthItem.variant ?? "outline",
				href: mobileAuthItem.href,
				dataset:
					mobileAuthItem.authAction === "sign-out"
						? { authAction: mobileAuthItem.authAction }
						: undefined,
			});
			li.appendChild(button.renderToNode());
			mobileNavList.appendChild(li);
			this.bindClickHandlers();
		}

		// Update top-right mobile auth button.
		const mobileTopAuthButton = this.element.querySelector(
			".nav-mobile-top-sign-in",
		);
		if (mobileTopAuthButton?.parentElement) {
			const button = new Button({
				label: mobileAuthItem.label,
				className: [
					"nav-mobile-top-sign-in",
					mobileAuthItem.authAction === "sign-out"
						? "nav-mobile-top-sign-out"
						: "",
				]
					.filter(Boolean)
					.join(" "),
				variant: mobileAuthItem.variant ?? "outline",
				href: mobileAuthItem.href,
				dataset:
					mobileAuthItem.authAction === "sign-out"
						? { authAction: mobileAuthItem.authAction }
						: undefined,
			});
			mobileTopAuthButton.replaceWith(button.renderToNode());
			this.bindClickHandlers();
		}
	}

	private getAuthNavItems(): ReadonlyArray<SecondaryNavItem> {
		if (!this.isAuthenticated) {
			return GUEST_NAV_ITEMS;
		}

		return this.isAdmin
			? AUTHENTICATED_ADMIN_NAV_ITEMS
			: AUTHENTICATED_NAV_ITEMS;
	}

	private getMobileNavItems(): ReadonlyArray<MobileNavItem> {
		if (!this.isAuthenticated || !this.isAdmin) {
			return MOBILE_NAV_ITEMS;
		}

		return [...MOBILE_NAV_ITEMS_ADMIN, MOBILE_DASHBOARD_ITEM];
	}

	private getMobileAuthItem(): MobileNavItem {
		return this.isAuthenticated ? MOBILE_SIGN_OUT_ITEM : MOBILE_SIGN_IN_ITEM;
	}

	setCurrentPath(path: string): void {
		const normalizedPath = Navbar.toInternalPath(path) ?? "/";
		if (normalizedPath !== this.currentPath) {
			this.currentPath = normalizedPath;
			this.syncActivePageLinks();
		}

		this.setMobileMenuOpen(false);
		this.scheduleTopContrastUpdate();
		this.startTopContrastWarmup();
	}

	/**
	 * Markup structure:
	 * - `nav-grid`: top row with desktop links and mobile toggle.
	 * - `nav-mobile-panel`: mobile expanded menu content.
	 * - `nav-mega-stack`: desktop mega panels.
	 */
	render(): DocumentFragment {
		const mobileAuthItem = this.getMobileAuthItem();

		return this.tpl`
			<div class="nav-inner">
				<ul class="nav-grid">
					<!-- Left: mobile toggle + desktop primary triggers -->
					<li class="nav-grid-start">
						<button
							class="nav-mobile-toggle"
							type="button"
							aria-label="Open navigation menu"
							aria-expanded="false"
							aria-controls="${Navbar.MOBILE_MENU_PANEL_ID}"
						>
							<span class="nav-mobile-toggle-icon" aria-hidden="true">
								<span class="nav-mobile-toggle-line"></span>
								<span class="nav-mobile-toggle-line"></span>
							</span>
						</button>

						<ul class="nav-links nav-links-primary">
							${PRIMARY_NAV_ITEMS.map(
								(item) => this.tpl`
									<li class="nav-item" data-menu="${item.menu}">
										${new Button({
											label: item.label,
											className: "nav-menu-trigger",
											variant: "text",
											href: item.href,
										})}
									</li>
								`,
							)}
						</ul>
					</li>

					<!-- Center: brand/logo -->
					<li class="nav-grid-center">
						<a class="nav-logo" href="/" aria-label="3AM home">
							<img class="nav-logo-image" src="/assets/nav/logo.svg" alt="3AM" />
						</a>
					</li>

					<!-- Right: desktop utility actions -->
					<li class="nav-grid-end">
						<ul class="nav-links nav-links-end">
							${this.getAuthNavItems().map(
								(item) => this.tpl`
									<li>
										${new Button({
											label: item.label,
											className: ["nav-link", item.className ?? ""]
												.filter(Boolean)
												.join(" "),
											variant: item.variant ?? "text",
											href: item.href,
											dataset:
												item.authAction === "sign-out"
													? { authAction: item.authAction }
													: undefined,
										})}
									</li>
								`,
							)}
						</ul>
							${new Button({
								label: mobileAuthItem.label,
								className: "nav-mobile-top-sign-in",
								variant: mobileAuthItem.variant ?? "outline",
								href: mobileAuthItem.href,
								dataset:
									mobileAuthItem.authAction === "sign-out"
										? { authAction: mobileAuthItem.authAction }
										: undefined,
							})}
						</li>
					</ul>

				<div
					class="nav-mobile-panel"
					id="${Navbar.MOBILE_MENU_PANEL_ID}"
					aria-hidden="true"
				>
					<ul class="nav-mobile-list">
						${this.getMobileNavItems().map(
							(item) => this.tpl`
								<li>
									${new Button({
										label: item.label,
										className: "nav-mobile-link",
										variant: "text",
										href: item.href,
									})}
								</li>
							`,
						)}
						<li class="nav-mobile-auth-item">
							${new Button({
								label: mobileAuthItem.label,
								className: ["nav-mobile-link", mobileAuthItem.className ?? ""]
									.filter(Boolean)
									.join(" "),
								variant: mobileAuthItem.variant ?? "outline",
								href: mobileAuthItem.href,
								dataset:
									mobileAuthItem.authAction === "sign-out"
										? { authAction: mobileAuthItem.authAction }
										: undefined,
							})}
						</li>
					</ul>
				</div>

				<div class="nav-mega-stack">
					<!-- Dusk mega panel -->
					<section class="nav-mega" data-menu="dusk" aria-label="Dusk menu">
						<div class="nav-mega-links">
							<p class="nav-mega-title">Dusk</p>
							<ul class="nav-mega-list">
								<li><a class="nav-mega-link" href="/dusk/explore">Explore</a></li>
								<li><a class="nav-mega-link" href="/dusk/build">Buy</a></li>
								<li><a class="nav-mega-link" href="/dusk/demo">Demo Drive</a></li>
							</ul>
						</div>
						<a class="nav-mega-media" href="/dusk">
							<img
								class="nav-mega-image"
								src="${NAV_MEGA_PLACEHOLDER_IMAGE}"
								data-deferred-src="${NAV_MEGA_MEDIA_SOURCES.dusk}"
								alt="Dusk showcase"
								loading="lazy"
							/>
							<div class="nav-mega-overlay" aria-hidden="true">
								<span class="nav-mega-overlay-model">
									<span class="nav-mega-overlay-model-label">MODEL</span>
									<span class="nav-mega-overlay-model-name">DUSK</span>
								</span>
								<span class="nav-mega-overlay-price">
									<span class="nav-mega-overlay-price-label">Starting at</span>
									<span class="nav-mega-overlay-price-value">$82,990</span>
								</span>
							</div>
						</a>
					</section>

					<!-- Dawn mega panel -->
					<section class="nav-mega" data-menu="dawn" aria-label="Dawn menu">
						<div class="nav-mega-links">
							<p class="nav-mega-title">Dawn</p>
							<ul class="nav-mega-list">
								<li><a class="nav-mega-link" href="/dawn/explore">Explore</a></li>
								<li><a class="nav-mega-link" href="/dawn/buy">Buy</a></li>
								<li><a class="nav-mega-link" href="/dawn/demo">Demo Drive</a></li>
							</ul>
						</div>
						<a class="nav-mega-media" href="/dawn">
							<img
								class="nav-mega-image"
								src="${NAV_MEGA_PLACEHOLDER_IMAGE}"
								data-deferred-src="${NAV_MEGA_MEDIA_SOURCES.dawn}"
								alt="Dawn showcase"
								loading="lazy"
							/>
							<div class="nav-mega-overlay" aria-hidden="true">
								<span class="nav-mega-overlay-model">
									<span class="nav-mega-overlay-model-label">MODEL</span>
									<span class="nav-mega-overlay-model-name">DAWN</span>
								</span>
								<span class="nav-mega-overlay-price">
									<span class="nav-mega-overlay-price-label">Starting at</span>
									<span class="nav-mega-overlay-price-value">$45,000</span>
								</span>
							</div>
						</a>
					</section>

					<!-- Gears mega panel -->
					<section class="nav-mega" data-menu="gears" aria-label="Gears menu">
						<div class="nav-mega-links">
							<p class="nav-mega-title">Gears</p>
							<ul class="nav-mega-list">
								<li>
									<a class="nav-mega-link" href="/gears/all">All</a>
								</li>
								<li>
									<a class="nav-mega-link" href="/gears/wheels">Wheels</a>
								</li>
								<li><a class="nav-mega-link" href="/gears/chargers">Chargers</a></li>
								<li><a class="nav-mega-link" href="/gears/services">Services</a></li>
							</ul>
						</div>

						<!-- Card-based media area for gears -->
						<div class="nav-gears-grid" aria-label="Featured gear cards">
							${GEARS_CARDS.map((card) => new MediaCard(card))}
						</div>
					</section>
				</div>
			</div>
		`;
	}

	/**
	 * One scroll handler updates both visual "scrolled" state and hide/show state.
	 */
	private readonly handleScroll = (): void => {
		this.updateScrolledState();
		this.updateVisibilityState();
		this.scheduleTopContrastUpdate();
	};

	private readonly handleResize = (): void => {
		if (this.isDesktopViewport()) {
			this.setMobileMenuOpen(false);
		}
		this.scheduleTopContrastUpdate();
		this.startTopContrastWarmup();
	};

	private readonly handleBackdropMediaUpdate = (): void => {
		this.scheduleTopContrastUpdate();
		this.startTopContrastWarmup();
	};

	private readonly handleHeroSlideChange = (): void => {
		this.scheduleTopContrastUpdate();
		this.startTopContrastWarmup();
	};

	/**
	 * Pointer behavior:
	 * - Hovering a trigger opens that trigger's panel.
	 * - Hovering inside mega stack keeps it open.
	 * - Hovering other nav zones (logo/right links) starts delayed close.
	 */
	private readonly handleMenuPointerOver = (event: Event): void => {
		this.scheduleTopContrastUpdate();

		if (!this.isDesktopViewport()) {
			return;
		}

		if (this.suppressDesktopHoverUntilPointerLeave) {
			return;
		}

		const target = event.target;
		if (!(target instanceof Element)) {
			return;
		}

		const menuTrigger = target.closest<HTMLElement>(".nav-item[data-menu]");
		if (menuTrigger) {
			const menu = menuTrigger.dataset.menu;
			if (!Navbar.isNavMenuName(menu)) {
				return;
			}

			this.cancelMenuClose();
			this.setActiveMenu(menu);
			return;
		}

		const insideMega = target.closest(".nav-mega-stack");
		if (insideMega) {
			this.cancelMenuClose();
			return;
		}

		this.scheduleMenuClose();
	};

	/**
	 * Keyboard accessibility:
	 * focusing any trigger opens the same mega panel as pointer hover.
	 */
	private readonly handleMenuFocusIn = (event: FocusEvent): void => {
		this.scheduleTopContrastUpdate();

		if (!this.isDesktopViewport()) {
			return;
		}

		const target = event.target;
		if (!(target instanceof Element)) {
			return;
		}

		const menuTrigger = target.closest<HTMLElement>(".nav-item[data-menu]");
		if (!menuTrigger) {
			return;
		}

		const menu = menuTrigger.dataset.menu;
		if (!Navbar.isNavMenuName(menu)) {
			return;
		}

		this.cancelMenuClose();
		this.setActiveMenu(menu);
	};

	private bindClickHandlers(): void {
		const mobileToggle = this.$<HTMLButtonElement>(".nav-mobile-toggle");
		this.cleanup.on(mobileToggle, "click", this.handleMobileToggleClick);

		const navLinks =
			this.element.querySelectorAll<HTMLAnchorElement>("a[href]");
		for (const link of navLinks) {
			this.cleanup.on(link, "click", this.handleNavLinkClick);
		}
	}

	private readonly handleMobileToggleClick = (): void => {
		this.setMobileMenuOpen(!this.isMobileMenuOpen);
	};

	private readonly handleNavLinkClick = (event: MouseEvent): void => {
		const link = event.currentTarget;
		if (!(link instanceof HTMLAnchorElement)) {
			return;
		}

		if (link.dataset.authAction === "sign-out") {
			event.preventDefault();
			event.stopPropagation();
			void this.handleSignOut();
			return;
		}

		if (event.detail > 0) {
			// Prevent persistent :focus-within styling after mouse clicks.
			link.blur();
		}

		// Always collapse expanded nav surfaces after any navbar navigation click.
		this.setMobileMenuOpen(false);
		this.clearActiveMenu();

		// Desktop hover menus should stay closed until pointer exits and re-enters nav.
		if (this.isDesktopViewport()) {
			this.suppressDesktopHoverUntilPointerLeave = true;
		}
	};

	private readonly handleSignOut = async (): Promise<void> => {
		this.setMobileMenuOpen(false);
		this.clearActiveMenu();

		try {
			const { authStore } = await import("@lib/authStore");
			await authStore.logout();
		} catch (error) {
			console.error("Failed to sign out cleanly:", error);
		}

		try {
			getRouter().navigate("/signin");
		} catch {
			window.location.href = "/signin";
		}
	};

	/**
	 * Start delayed close when leaving nav with pointer.
	 */
	private readonly handleMenuPointerLeave = (): void => {
		this.scheduleTopContrastUpdate();

		if (!this.isDesktopViewport()) {
			return;
		}

		this.suppressDesktopHoverUntilPointerLeave = false;
		this.scheduleMenuClose();
	};

	/**
	 * For keyboard users:
	 * close menus only after focus has truly left the whole nav.
	 */
	private readonly handleMenuFocusOut = (event: FocusEvent): void => {
		this.scheduleTopContrastUpdate();

		const relatedTarget = event.relatedTarget;
		if (relatedTarget instanceof Node && this.element.contains(relatedTarget)) {
			return;
		}

		// Wait one microtask so `document.activeElement` points to the new focused node.
		queueMicrotask(() => {
			if (this.element.contains(document.activeElement)) {
				return;
			}

			// Pointer clicks on non-focusable space inside the mega panel can move
			// focus to <body>. Keep desktop panel open while the pointer is still over nav.
			if (this.isDesktopViewport() && this.element.matches(":hover")) {
				return;
			}

			this.setMobileMenuOpen(false);
			this.clearActiveMenu();
			this.scheduleTopContrastUpdate();
		});
	};

	/**
	 * Adds/removes the `is-scrolled` class after crossing the configured threshold.
	 */
	private updateScrolledState(): void {
		const scrolled = window.scrollY > Navbar.SCROLL_THRESHOLD_PX;
		if (scrolled === this.isScrolled) {
			return;
		}

		this.isScrolled = scrolled;
		this.element.classList.toggle("is-scrolled", scrolled);
	}

	/**
	 * Hide while scrolling down, reveal while scrolling up.
	 */
	private updateVisibilityState(): void {
		const currentScrollY = window.scrollY;
		if (this.isBuilderRoute()) {
			this.lastScrollY = currentScrollY;
			this.setHidden(currentScrollY > Navbar.SCROLL_THRESHOLD_PX);
			return;
		}

		const deltaY = currentScrollY - this.lastScrollY;
		this.lastScrollY = currentScrollY;

		if (this.isMobileMenuOpen) {
			this.setHidden(false);
			return;
		}

		// At top of page, navbar is always visible.
		if (currentScrollY <= Navbar.SCROLL_THRESHOLD_PX) {
			this.setHidden(false);
			return;
		}

		// Ignore micro movements to avoid flicker.
		if (Math.abs(deltaY) < Navbar.MIN_SCROLL_DELTA_PX) {
			return;
		}

		// Positive delta means user is moving downward.
		this.setHidden(deltaY > 0);
	}

	/**
	 * Centralized hidden-state mutation keeps DOM class toggling in one place.
	 */
	private setHidden(hidden: boolean): void {
		if (hidden === this.isHidden) {
			return;
		}

		this.isHidden = hidden;
		this.element.classList.toggle("is-hidden", hidden);
	}

	/**
	 * Reflect active menu into both JS state and root dataset.
	 * CSS selectors read `data-active-menu` to show the correct panel.
	 */
	private setActiveMenu(menu: NavMenuName | null): void {
		if (this.activeMenu === menu) {
			return;
		}

		this.activeMenu = menu;
		if (menu) {
			this.ensureMenuMediaLoaded(menu);
			this.element.dataset.activeMenu = menu;
			this.scheduleTopContrastUpdate();
			this.stopTopContrastWarmup();
			return;
		}

		delete this.element.dataset.activeMenu;
		this.scheduleTopContrastUpdate();
		this.startTopContrastWarmup();
	}

	private ensureMenuMediaLoaded(menu: NavMenuName): void {
		if (this.loadedMenuMedia.has(menu)) {
			return;
		}

		const megaPanel = this.element.querySelector<HTMLElement>(
			`.nav-mega[data-menu="${menu}"]`,
		);
		if (!megaPanel) {
			this.loadedMenuMedia.add(menu);
			return;
		}

		const deferredImages = megaPanel.querySelectorAll<HTMLImageElement>(
			"img[data-deferred-src]",
		);
		for (const image of deferredImages) {
			const deferredSrc = image.dataset.deferredSrc;
			if (!deferredSrc) {
				continue;
			}

			image.setAttribute("src", deferredSrc);
			delete image.dataset.deferredSrc;
		}

		const deferredBackgroundNodes = megaPanel.querySelectorAll<HTMLElement>(
			"[data-deferred-bg-src]",
		);
		for (const node of deferredBackgroundNodes) {
			const deferredBackgroundSrc = node.dataset.deferredBgSrc;
			if (!deferredBackgroundSrc) {
				continue;
			}

			node.style.setProperty(
				"--media-card-bg-image",
				`url("${deferredBackgroundSrc}")`,
			);
			delete node.dataset.deferredBgSrc;
		}

		this.loadedMenuMedia.add(menu);
	}

	/**
	 * Close immediately and clear pending close timer.
	 */
	private readonly clearActiveMenu = (): void => {
		this.cancelMenuClose();
		this.setActiveMenu(null);
	};

	/**
	 * Schedules a delayed close so users can move the cursor naturally
	 * without the panel disappearing instantly.
	 */
	private scheduleMenuClose(): void {
		this.cancelMenuClose();
		this.closeMenuTimerId = window.setTimeout(() => {
			this.clearActiveMenu();
		}, Navbar.MENU_CLOSE_DELAY_MS);
	}

	/**
	 * Cancels any in-flight delayed close timeout.
	 */
	private cancelMenuClose(): void {
		if (this.closeMenuTimerId === null) {
			return;
		}

		window.clearTimeout(this.closeMenuTimerId);
		this.closeMenuTimerId = null;
	}

	private setMobileMenuOpen(open: boolean): void {
		if (open && this.isDesktopViewport()) {
			return;
		}

		if (open === this.isMobileMenuOpen) {
			return;
		}

		this.isMobileMenuOpen = open;
		this.element.classList.toggle("is-mobile-open", open);
		if (open) {
			this.setHidden(false);
			this.clearActiveMenu();
		}

		this.syncMobileMenuUi();
		this.scheduleTopContrastUpdate();
		if (open) {
			this.stopTopContrastWarmup();
			return;
		}
		this.startTopContrastWarmup();
	}

	private syncMobileMenuUi(): void {
		const toggle = this.$<HTMLButtonElement>(".nav-mobile-toggle");
		toggle.setAttribute("aria-expanded", String(this.isMobileMenuOpen));
		toggle.setAttribute(
			"aria-label",
			this.isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu",
		);

		const panel = this.$<HTMLElement>(".nav-mobile-panel");
		panel.setAttribute("aria-hidden", String(!this.isMobileMenuOpen));
	}

	private isDesktopViewport(): boolean {
		return window.innerWidth >= Navbar.MOBILE_BREAKPOINT_PX;
	}

	private scheduleTopContrastUpdate(): void {
		if (this.topContrastRafId !== 0) {
			return;
		}

		this.topContrastRafId = window.requestAnimationFrame(() => {
			this.topContrastRafId = 0;
			this.updateTopContrastMode();
		});
	}

	private startTopContrastWarmup(): void {
		this.stopTopContrastWarmup();
		if (!this.shouldAutoAdjustTopContrast()) {
			return;
		}

		this.topContrastWarmupStepsLeft = Navbar.TOP_CONTRAST_WARMUP_STEPS;
		const runStep = (): void => {
			this.scheduleTopContrastUpdate();
			this.topContrastWarmupStepsLeft -= 1;

			if (
				this.topContrastWarmupStepsLeft <= 0 ||
				!this.shouldAutoAdjustTopContrast()
			) {
				this.topContrastWarmupTimerId = 0;
				this.topContrastWarmupStepsLeft = 0;
				return;
			}

			this.topContrastWarmupTimerId = window.setTimeout(
				runStep,
				Navbar.TOP_CONTRAST_WARMUP_STEP_MS,
			);
		};

		runStep();
	}

	private stopTopContrastWarmup(): void {
		if (this.topContrastWarmupTimerId !== 0) {
			window.clearTimeout(this.topContrastWarmupTimerId);
		}

		this.topContrastWarmupTimerId = 0;
		this.topContrastWarmupStepsLeft = 0;
	}

	private updateTopContrastMode(): void {
		if (!this.element.isConnected || !this.shouldAutoAdjustTopContrast()) {
			this.setTopContrastMode(null);
			return;
		}

		const forcedMode = this.getRouteTopContrastMode();
		if (forcedMode) {
			this.setTopContrastMode(forcedMode);
			return;
		}

		const navInner = this.element.querySelector<HTMLElement>(".nav-inner");
		if (!navInner) {
			this.setTopContrastMode(null);
			return;
		}

		const backdropLuminance = this.sampleBackdropLuminance(navInner);
		if (backdropLuminance === null) {
			this.setTopContrastMode(null);
			return;
		}

		const whiteTextContrast = Navbar.calculateContrastRatio(
			backdropLuminance,
			1,
		);
		const blackTextContrast = Navbar.calculateContrastRatio(
			backdropLuminance,
			0,
		);

		// Default top-nav text is white. Keep default when it is already accessible
		// and not worse than black.
		if (
			whiteTextContrast >= Navbar.MIN_TEXT_CONTRAST_RATIO &&
			whiteTextContrast >= blackTextContrast
		) {
			this.setTopContrastMode(null);
			return;
		}

		if (blackTextContrast > whiteTextContrast) {
			this.setTopContrastMode("dark");
			return;
		}

		// Rare case where both are low but white is still slightly better.
		if (whiteTextContrast < Navbar.MIN_TEXT_CONTRAST_RATIO) {
			this.setTopContrastMode("light");
			return;
		}

		this.setTopContrastMode(null);
	}

	private shouldAutoAdjustTopContrast(): boolean {
		return (
			!this.isScrolled &&
			!this.isMobileMenuOpen &&
			this.activeMenu === null &&
			!this.element.matches(":hover") &&
			!this.element.matches(":focus-within")
		);
	}

	private isBuilderRoute(): boolean {
		return (
			this.currentPath.startsWith("/dusk/build") ||
			this.currentPath.startsWith("/dusk/buy") ||
			this.currentPath.startsWith("/dawn/build") ||
			this.currentPath.startsWith("/dawn/buy")
		);
	}

	private isGearsRoute(): boolean {
		return (
			this.currentPath === "/gears" || this.currentPath.startsWith("/gears/")
		);
	}

	private getRouteTopContrastMode(): NavTopContrastMode | null {
		if (this.isBuilderRoute()) {
			return "light";
		}
		if (this.isGearsRoute()) {
			return "light";
		}

		return null;
	}

	private setTopContrastMode(mode: NavTopContrastMode | null): void {
		if (!mode) {
			delete this.element.dataset.topContrastMode;
			this.applyTopContrastInlinePresentation(null);
			return;
		}

		this.element.dataset.topContrastMode = mode;
		this.applyTopContrastInlinePresentation(mode);
	}

	private applyTopContrastInlinePresentation(
		mode: NavTopContrastMode | null,
	): void {
		const navButtons = this.element.querySelectorAll<HTMLElement>(
			".nav-menu-trigger, .nav-link, .nav-mobile-link, .nav-mobile-top-sign-in",
		);
		const logo =
			this.element.querySelector<HTMLImageElement>(".nav-logo-image");
		const shouldPreserveButtonStyles = (button: HTMLElement): boolean =>
			button.classList.contains("ui-button--cta") ||
			button.classList.contains("is-active-page");

		for (const button of navButtons) {
			button.style.removeProperty("color");
			button.style.removeProperty("outline-color");
			if (button.classList.contains("ui-button--outline")) {
				button.style.removeProperty("border-color");
			}
			button
				.querySelector<HTMLElement>(".ui-button__label")
				?.style.removeProperty("color");
		}
		if (logo) {
			logo.style.removeProperty("filter");
		}

		if (!this.shouldAutoAdjustTopContrast() || mode === null) {
			return;
		}

		if (mode === "light") {
			for (const button of navButtons) {
				if (shouldPreserveButtonStyles(button)) {
					continue;
				}
				button.style.color = "rgb(255 255 255)";
				button
					.querySelector<HTMLElement>(".ui-button__label")
					?.style.setProperty("color", "rgb(255 255 255)");
			}

			if (logo) {
				logo.style.filter = "none";
			}
			return;
		}

		for (const button of navButtons) {
			if (shouldPreserveButtonStyles(button)) {
				continue;
			}
			button.style.color = "rgb(0 0 0)";
			button
				.querySelector<HTMLElement>(".ui-button__label")
				?.style.setProperty("color", "rgb(0 0 0)");
		}

		if (logo) {
			logo.style.filter = "brightness(0) saturate(100%)";
		}
	}

	private sampleBackdropLuminance(navInner: HTMLElement): number | null {
		const viewportWidth = window.innerWidth;
		const viewportHeight = window.innerHeight;
		if (viewportWidth <= 0 || viewportHeight <= 0) {
			return null;
		}

		const rect = navInner.getBoundingClientRect();
		if (rect.width <= 0 || rect.height <= 0) {
			return null;
		}

		const sampleYOffset = Math.max(
			Navbar.TOP_CONTRAST_MIN_SAMPLE_Y_PX,
			rect.height * Navbar.TOP_CONTRAST_SAMPLE_Y_RATIO,
		);
		const sampleY = Math.min(
			Math.max(rect.top + sampleYOffset, 0),
			viewportHeight - 1,
		);

		const previousPointerEvents = this.element.style.pointerEvents;
		this.element.style.pointerEvents = "none";

		try {
			const samples: number[] = [];
			for (const ratio of Navbar.TOP_CONTRAST_SAMPLE_X_RATIOS) {
				const sampleX = Math.min(
					Math.max(rect.left + rect.width * ratio, 0),
					viewportWidth - 1,
				);
				const luminance = this.sampleLuminanceAtViewportPoint(sampleX, sampleY);
				if (luminance === null) {
					continue;
				}

				samples.push(luminance);
			}

			if (samples.length === 0) {
				return null;
			}

			return samples.reduce((sum, value) => sum + value, 0) / samples.length;
		} finally {
			this.element.style.pointerEvents = previousPointerEvents;
		}
	}

	private sampleLuminanceAtViewportPoint(
		viewportX: number,
		viewportY: number,
	): number | null {
		const stack =
			typeof document.elementsFromPoint === "function"
				? document.elementsFromPoint(viewportX, viewportY)
				: (() => {
						const target = document.elementFromPoint(viewportX, viewportY);
						return target ? [target] : [];
					})();

		for (const element of stack) {
			if (this.element.contains(element)) {
				continue;
			}

			const mediaLuminance = this.sampleMediaElementLuminance(
				element,
				viewportX,
				viewportY,
			);
			if (mediaLuminance !== null) {
				return mediaLuminance;
			}

			const style = window.getComputedStyle(element);
			if (
				style.visibility === "hidden" ||
				Number.parseFloat(style.opacity || "1") <= 0
			) {
				continue;
			}

			const backgroundColor = Navbar.parseCssRgbColor(style.backgroundColor);
			if (!backgroundColor || backgroundColor.alpha <= 0) {
				continue;
			}

			return Navbar.toRelativeLuminance(
				backgroundColor.red,
				backgroundColor.green,
				backgroundColor.blue,
			);
		}

		const sectionLuminance = this.readSectionSurfaceLuminanceAtPoint(
			viewportX,
			viewportY,
		);
		if (sectionLuminance !== null) {
			return sectionLuminance;
		}

		// If we cannot read reliable backdrop color (e.g. pending/broken media),
		// prefer a light fallback so top-nav text switches to black for legibility.
		return Navbar.UNKNOWN_BACKDROP_LUMINANCE;
	}

	private sampleMediaElementLuminance(
		element: Element,
		viewportX: number,
		viewportY: number,
	): number | null {
		const descendantMedia =
			element.querySelector?.<Element>("img, video, canvas");
		if (descendantMedia) {
			const descendantLuminance = this.sampleMediaElementLuminance(
				descendantMedia,
				viewportX,
				viewportY,
			);
			if (descendantLuminance !== null) {
				return descendantLuminance;
			}
		}

		if (element instanceof HTMLImageElement) {
			if (!element.complete) {
				return Navbar.UNKNOWN_BACKDROP_LUMINANCE;
			}
			if (element.naturalWidth <= 0 || element.naturalHeight <= 0) {
				return Navbar.UNKNOWN_BACKDROP_LUMINANCE;
			}

			const rect = element.getBoundingClientRect();
			if (rect.width <= 0 || rect.height <= 0) {
				return null;
			}

			const sourceX = Math.min(
				Math.max(
					Math.floor(
						((viewportX - rect.left) / rect.width) * element.naturalWidth,
					),
					0,
				),
				element.naturalWidth - 1,
			);
			const sourceY = Math.min(
				Math.max(
					Math.floor(
						((viewportY - rect.top) / rect.height) * element.naturalHeight,
					),
					0,
				),
				element.naturalHeight - 1,
			);
			return this.sampleImageSourcePixelLuminance(element, sourceX, sourceY);
		}

		if (element instanceof HTMLVideoElement) {
			if (
				element.readyState < HTMLMediaElement.HAVE_CURRENT_DATA ||
				element.videoWidth <= 0 ||
				element.videoHeight <= 0
			) {
				return Navbar.UNKNOWN_BACKDROP_LUMINANCE;
			}

			const rect = element.getBoundingClientRect();
			if (rect.width <= 0 || rect.height <= 0) {
				return null;
			}

			const sourceX = Math.min(
				Math.max(
					Math.floor(
						((viewportX - rect.left) / rect.width) * element.videoWidth,
					),
					0,
				),
				element.videoWidth - 1,
			);
			const sourceY = Math.min(
				Math.max(
					Math.floor(
						((viewportY - rect.top) / rect.height) * element.videoHeight,
					),
					0,
				),
				element.videoHeight - 1,
			);
			return this.sampleImageSourcePixelLuminance(element, sourceX, sourceY);
		}

		if (element instanceof HTMLCanvasElement) {
			try {
				const context = element.getContext("2d");
				if (!context) {
					return null;
				}

				const rect = element.getBoundingClientRect();
				if (rect.width <= 0 || rect.height <= 0) {
					return null;
				}

				const sourceX = Math.min(
					Math.max(
						Math.floor(((viewportX - rect.left) / rect.width) * element.width),
						0,
					),
					Math.max(0, element.width - 1),
				);
				const sourceY = Math.min(
					Math.max(
						Math.floor(((viewportY - rect.top) / rect.height) * element.height),
						0,
					),
					Math.max(0, element.height - 1),
				);
				const pixel = context.getImageData(sourceX, sourceY, 1, 1).data;
				if (pixel[3] === 0) {
					return null;
				}

				return Navbar.toRelativeLuminance(pixel[0], pixel[1], pixel[2]);
			} catch {
				return null;
			}
		}

		return null;
	}

	private readSectionSurfaceLuminanceAtPoint(
		viewportX: number,
		viewportY: number,
	): number | null {
		const target = document.elementFromPoint(viewportX, viewportY);
		if (!(target instanceof Element)) {
			return null;
		}

		const section = target.closest<HTMLElement>(".page-section");
		if (!section) {
			return null;
		}

		const color = Navbar.parseCssRgbColor(
			window.getComputedStyle(section).backgroundColor,
		);
		if (!color || color.alpha <= 0) {
			return null;
		}

		return Navbar.toRelativeLuminance(color.red, color.green, color.blue);
	}

	private sampleImageSourcePixelLuminance(
		source: CanvasImageSource,
		sourceX: number,
		sourceY: number,
	): number | null {
		const context = this.contrastSampleContext;
		if (!context) {
			return null;
		}

		this.contrastSampleCanvas.width = 1;
		this.contrastSampleCanvas.height = 1;

		try {
			context.clearRect(0, 0, 1, 1);
			context.drawImage(source, sourceX, sourceY, 1, 1, 0, 0, 1, 1);
			const pixel = context.getImageData(0, 0, 1, 1).data;
			if (pixel[3] === 0) {
				return null;
			}

			return Navbar.toRelativeLuminance(pixel[0], pixel[1], pixel[2]);
		} catch {
			return null;
		}
	}

	private static parseCssRgbColor(
		value: string,
	): { red: number; green: number; blue: number; alpha: number } | null {
		const normalized = value.trim().toLowerCase();
		if (!normalized.startsWith("rgb")) {
			return null;
		}

		const channels = normalized.match(/[\d.]+%?/g);
		if (!channels || channels.length < 3) {
			return null;
		}

		const red = Navbar.toByte(channels[0]);
		const green = Navbar.toByte(channels[1]);
		const blue = Navbar.toByte(channels[2]);
		const alpha = channels[3] ? Navbar.toAlpha(channels[3]) : 1;

		if (
			Number.isNaN(red) ||
			Number.isNaN(green) ||
			Number.isNaN(blue) ||
			Number.isNaN(alpha)
		) {
			return null;
		}

		return { red, green, blue, alpha };
	}

	private static toByte(token: string): number {
		if (token.endsWith("%")) {
			const value = Number.parseFloat(token);
			return Math.round(Math.min(100, Math.max(0, value)) * 2.55);
		}

		const value = Number.parseFloat(token);
		return Math.round(Math.min(255, Math.max(0, value)));
	}

	private static toAlpha(token: string): number {
		if (token.endsWith("%")) {
			const value = Number.parseFloat(token);
			return Math.min(100, Math.max(0, value)) / 100;
		}

		const value = Number.parseFloat(token);
		return Math.min(1, Math.max(0, value));
	}

	private static toRelativeLuminance(
		red: number,
		green: number,
		blue: number,
	): number {
		const r = Navbar.srgbToLinear(red);
		const g = Navbar.srgbToLinear(green);
		const b = Navbar.srgbToLinear(blue);
		return 0.2126 * r + 0.7152 * g + 0.0722 * b;
	}

	private static srgbToLinear(channel: number): number {
		const normalized = channel / 255;
		if (normalized <= 0.04045) {
			return normalized / 12.92;
		}
		return ((normalized + 0.055) / 1.055) ** 2.4;
	}

	private static calculateContrastRatio(first: number, second: number): number {
		const lighter = Math.max(first, second);
		const darker = Math.min(first, second);
		return (lighter + 0.05) / (darker + 0.05);
	}

	private syncActivePageLinks(): void {
		const links = this.element.querySelectorAll<HTMLAnchorElement>(
			Navbar.ACTIVE_PAGE_LINK_SELECTOR,
		);
		for (const link of links) {
			const href = link.getAttribute("href");
			const linkPath = href ? Navbar.toInternalPath(href) : null;
			if (!linkPath) {
				continue;
			}

			const isActivePage = Navbar.isPathActive(this.currentPath, linkPath);
			link.classList.toggle("is-active-page", isActivePage);

			if (isActivePage) {
				link.setAttribute("aria-current", "page");
				continue;
			}
			link.removeAttribute("aria-current");
		}
	}
}

export default Navbar;
