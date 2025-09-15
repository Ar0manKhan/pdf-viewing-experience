import { Link } from "react-router";
import { Button } from "../components/ui/button";

export default function App() {
  return (
    <div className="container mx-auto py-4">
      <div className="flex gap-4">
        <Link to="/doc">
          <Button>Go to doc</Button>
        </Link>
        <Link to="/upload">
          <Button>Upload file</Button>
        </Link>
      </div>
    </div>
  );
}
