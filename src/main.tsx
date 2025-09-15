import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import App from "./pages/App";
import Doc from "./pages/Doc";
import { StrictMode } from "react";
import Upload from "./pages/Upload";
import Component from "./pages";

const router = createBrowserRouter([
  {
    path: "",
    Component: Component,
    children: [
      {
        path: "/",
        Component: App,
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
