import { usPdfUiStore } from "@/stores/pdf-ui-store";
import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";

export default function PageScale() {
  const scale = usPdfUiStore((state) => state.scale);
  const setScale = usPdfUiStore((state) => state.setScale);
  const zoomIn = () => setScale(scale + 0.1);
  const zoomOut = () => setScale(scale - 0.1);
  return (
    <div className="flex flex-col gap-2 items-center w-fit">
      <span>{scale.toFixed(1)}</span>
      <Button onClick={zoomOut} variant={"outline"}>
        <Minus />
      </Button>
      <Button onClick={zoomIn} variant={"outline"}>
        <Plus />
      </Button>
    </div>
  );
}
