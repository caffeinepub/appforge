import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { Layout } from "./components/Layout";
import { AppDetailPage } from "./pages/AppDetailPage";
import { BuilderPage } from "./pages/BuilderPage";
import { HomePage } from "./pages/HomePage";

// ── Routes ────────────────────────────────────────────────────────────────────

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Layout>
        <Outlet />
      </Layout>
      <Toaster richColors position="top-right" />
    </>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const builderNewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/builder",
  component: BuilderPage,
});

const builderEditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/builder/$appId",
  component: BuilderPage,
});

const appDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/app/$appId",
  component: AppDetailPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  builderNewRoute,
  builderEditRoute,
  appDetailRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  return <RouterProvider router={router} />;
}
