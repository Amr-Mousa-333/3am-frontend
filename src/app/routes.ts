import type { RouteMap } from "@lib/router";

export const routes: RouteMap = {
  "/": {
    title: "Home",
    create: async () => {
      const { HomePage } = await import("@pages/home");
      return new HomePage();
    },
  },
  
  "/admin": {
    title: "Admin Dashboard",
    create: async () => {
      const { AdminDashboardPage } = await import("@pages/AdminDashboardPage");
      return new AdminDashboardPage();
    },
  },

  "/404": {
    title: "Not found",
    create: async () => {
      const { NotFoundPage } = await import("@pages/notFound");
      return new NotFoundPage();
    },
  },
};