import { useEffect, useState } from "react";
import { DynamicIcon } from "lucide-react/dynamic";
import Footer from "../components/Footer";
import Header from "../components/Header";
import SavedFiles from "../components/SavedFiles";

export default function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onUploadSuccess={handleUploadSuccess} />
      <main className="flex-grow container mx-auto px-4 py-6">
        <FirefoxWarning />
        <SavedFiles refreshTrigger={refreshTrigger} />
      </main>
      <Footer />
    </div>
  );
}

function FirefoxWarning() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (navigator.userAgent.indexOf("Firefox") > -1) {
      setIsVisible(true);
    }
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 relative rounded-md mb-4"
      role="alert"
    >
      <div className="flex">
        <div className="py-1">
          <DynamicIcon name="alert-triangle" className="h-6 w-6 mr-4" />
        </div>
        <div>
          <p className="font-bold">Firefox Users</p>
          <p>Your browser might behave weirdly. We are working on fixing it.</p>
        </div>
        <button
          className="absolute top-0 bottom-0 right-0 px-4 py-3"
          onClick={() => setIsVisible(false)}
        >
          <DynamicIcon name="x" className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
