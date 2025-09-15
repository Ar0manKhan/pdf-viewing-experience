import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import { lazy, StrictMode } from "react";

const HomeOutlet = lazy(() => import("./pages/outlet"));
const Homepage = lazy(() => import("./pages/App"));
const Upload = lazy(() => import("./pages/Upload"));
const Doc = lazy(() => import("./pages/Doc"));

const router = createBrowserRouter([
  {
    path: "",
    Component: HomeOutlet,
    children: [
      {
        path: "/",
        Component: Homepage,
      },
      {
        path: "/upload",
        Component: Upload,
      },
    ],
  },
  {
    path: "/doc",
    Component: Doc,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />,
  </StrictMode>,
);
