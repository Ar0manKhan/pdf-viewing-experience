import PageScale from "./components/pdf/PageScale";
import PdfCanvas from "./components/pdf/PdfCanvas";

function App() {
  return (
    <div className="w-screen h-screen overflow-auto flex justify-between items-center">
      <PageScale />
      <PdfCanvas />
    </div>
  );
}

export default App;
