import { useDebounce } from "@uidotdev/usehooks";
import { usPdfUiStore } from "@/stores/pdf-ui-store";

export const useDebouncedScale = () => {
  const scale = usPdfUiStore((state) => state.scale);
  const debouncedScale = useDebounce(scale, 500);
  const isDebouncing = scale !== debouncedScale;
  return { debouncedScale, isDebouncing };
};
