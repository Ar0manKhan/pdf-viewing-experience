import { useDebounce } from "@uidotdev/usehooks";
import { usePdfUiStore } from "@/stores/pdf-ui-store";

export const useDebouncedScale = () => {
  const scale = usePdfUiStore((state) => state.scale);
  const debouncedScale = useDebounce(scale, 500);
  const isDebouncing = scale !== debouncedScale;
  return { debouncedScale, isDebouncing };
};
