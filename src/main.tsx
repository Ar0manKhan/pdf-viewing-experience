import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import { lazy, StrictMode } from "react";

const Homepage = lazy(() => import("./pages/App"));
const Doc = lazy(() => import("./pages/doc/Doc"));
const Settings = lazy(() => import("./pages/settings/index"));

const router = createBrowserRouter([
  {
    path: "/",
    Component: Homepage,
  },
  {
    path: "/doc",
    Component: Outlet,
    children: [
      {
        path: ":doc-id",
        Component: Doc,
      },
    ],
  },
  {
    path: "/settings",
    Component: Settings,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
