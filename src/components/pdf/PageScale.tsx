import { usePdfUiStore } from "@/stores/pdf-ui-store";
import { Button } from "../ui/button";
import { Slider } from "../ui/slider";
import { Minus, Plus, RotateCcw } from "lucide-react";

export default function PageScale() {
  const scale = usePdfUiStore((state) => state.scale);
  const setScale = usePdfUiStore((state) => state.setScale);

  const zoomIn = () => setScale(Math.min(scale + 0.1, 3.0));
  const zoomOut = () => setScale(Math.max(scale - 0.1, 0.5));
  const resetZoom = () => setScale(1.0);

  const handleSliderChange = (value: number[]) => {
    setScale(value[0]);
  };

  return (
    <div className="space-y-4">
      {/* Zoom Controls */}
      <div className="flex items-center gap-2">
        <Button
          onClick={zoomOut}
          variant="outline"
          size="sm"
          disabled={scale <= 0.5}
        >
          <Minus className="h-4 w-4" />
        </Button>

        <div className="flex-1 px-2">
          <Slider
            value={[scale]}
            onValueChange={handleSliderChange}
            min={0.5}
            max={3.0}
            step={0.1}
            className="w-full"
          />
        </div>

        <Button
          onClick={zoomIn}
          variant="outline"
          size="sm"
          disabled={scale >= 3.0}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Zoom Display and Reset */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {Math.round(scale * 100)}%
        </span>
        <Button
          onClick={resetZoom}
          variant="ghost"
          size="sm"
          className="h-8 px-2"
        >
          <RotateCcw className="h-3 w-3 mr-1" />
          Reset
        </Button>
      </div>
    </div>
  );
}
