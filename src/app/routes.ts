import type { RouteMap } from "@lib/router";
import { HomePage } from "@pages/home";
import { NotFoundPage } from "@pages/notFound";

export const routes: RouteMap = {
	"/": { title: "Home", create: () => new HomePage() },
	"/404": { title: "Not found", create: () => new NotFoundPage() },
};
