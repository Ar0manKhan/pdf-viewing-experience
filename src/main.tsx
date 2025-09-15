import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router";

const router = createBrowserRouter([
  {
    path: "/doc",
    Component: App,
  },
]);

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />,
);
