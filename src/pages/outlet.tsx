import { Outlet } from "react-router";

export default function Component() {
  return (
    <div className="container mx-auto py-4">
      <Outlet />
    </div>
  );
}
