import { authStore } from "@lib/authStore";
import { getRouter } from "@lib/router";

const ROLE_CLAIM_KEYS = [
	"role",
	"roles",
	"http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
	"http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role",
] as const;

type JwtPayload = Record<string, unknown>;

const toArray = (value: unknown): unknown[] => {
	if (Array.isArray(value)) {
		return value;
	}
	return [value];
};

const collectRoles = (payload: JwtPayload): Set<string> => {
	const roles = new Set<string>();

	for (const key of ROLE_CLAIM_KEYS) {
		if (!(key in payload)) {
			continue;
		}

		const claimValues = toArray(payload[key]);
		for (const claim of claimValues) {
			if (typeof claim !== "string") {
				continue;
			}
			const normalized = claim.trim().toLowerCase();
			if (normalized) {
				roles.add(normalized);
			}
		}
	}

	return roles;
};

const decodeJwtPayload = (token: string): JwtPayload | null => {
	const parts = token.split(".");
	if (parts.length < 2) {
		return null;
	}

	const payloadPart = parts[1];
	const decoder =
		typeof globalThis.atob === "function" ? globalThis.atob : null;
	if (!decoder) {
		return null;
	}

	const base64 = payloadPart
		.replace(/-/g, "+")
		.replace(/_/g, "/")
		.padEnd(Math.ceil(payloadPart.length / 4) * 4, "=");

	try {
		const decoded = decoder(base64);
		return JSON.parse(decoded) as JwtPayload;
	} catch {
		return null;
	}
};

/**
 * Creates a route guard that redirects to signin if not authenticated
 */
export const requireAuth = (): void => {
	const state = authStore.getState();
	if (!state.isAuthenticated) {
		const router = getRouter();
		router.navigate("/signin");
	}
};

/**
 * Creates a route guard that redirects to home if already authenticated
 */
export const requireGuest = (): void => {
	const state = authStore.getState();
	if (state.isAuthenticated) {
		const router = getRouter();
		router.navigate("/");
	}
};

/**
 * Checks if user is authenticated (synchronous, uses cached state)
 */
export const isAuthenticated = (): boolean => {
	const state = authStore.getState();
	return state.isAuthenticated;
};

/**
 * Checks if current user has a role claim in the JWT access token
 */
export const hasRole = (role: string): boolean => {
	const normalizedRole = role.trim().toLowerCase();
	if (!normalizedRole) {
		return false;
	}

	const { accessToken } = authStore.getState();
	if (!accessToken) {
		return false;
	}

	const payload = decodeJwtPayload(accessToken);
	if (!payload) {
		return false;
	}

	return collectRoles(payload).has(normalizedRole);
};

/**
 * Checks whether the current user is an admin
 */
export const isAdmin = (): boolean => {
	return hasRole("admin");
};

/**
 * Creates a route guard that allows admin users only
 */
export const requireAdmin = (): void => {
	if (!isAuthenticated()) {
		const router = getRouter();
		router.navigate("/signin");
		return;
	}

	if (!isAdmin()) {
		const router = getRouter();
		router.navigate("/");
	}
};

/**
 * Gets current user profile (synchronous, uses cached state)
 */
export const getCurrentUser = () => {
	const state = authStore.getState();
	return state.user;
};
