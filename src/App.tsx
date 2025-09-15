import PageScale from "./components/pdf/PageScale";
import PdfCanvas from "./components/pdf/PdfCanvas";
import TTSPdf from "./components/TTSPdf";

function App() {
  return (
    <div className="w-screen h-screen overflow-auto flex justify-between items-center">
      <div className="flex flex-col gap-4 items-center">
        <PageScale />
        <TTSPdf />
      </div>
      <PdfCanvas />
    </div>
  );
}

export default App;
