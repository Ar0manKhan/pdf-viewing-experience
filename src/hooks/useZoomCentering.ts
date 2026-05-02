import { useEffect, useRef } from "react";
import type { List } from "react-virtualized/dist/es/List";

/**
 * State captured at the start of a zoom operation.
 * Stores the visual center point of the viewport normalized by scale,
 * allowing us to restore the same center point after zoom completes.
 */
interface ZoomState {
  /** The distance from the top of the document to the viewport center, normalized by scale (pixels at scale=1) */
  centerOffset: number;
  /** The scale value when the zoom started */
  scale: number;
}

/**
 * Hook to maintain viewport center position during zoom operations.
 *
 * When user zooms in/out on a PDF, react-virtualized's List maintains the same
 * scrollTop value, which causes the viewport to jump to a different part of the document
 * because row heights have changed. This hook captures the visual center point
 * when zoom starts and restores it after the debounced scale settles.
 *
 * **Usage:** This hook is specifically designed for PDF zoom behavior with react-virtualized.
 * Do not modify unless the zoom/centering behavior requirements change.
 *
 * @param listRef - Ref to the react-virtualized List component
 * @param isDebouncing - Whether the scale value is currently debouncing (zoom in progress)
 * @param debouncedScale - The settled scale value after debounce
 * @param viewportHeight - Height of the viewport/container
 *
 * @example
 * ```tsx
 * const listRef = useRef<List | null>(null);
 * const { debouncedScale, isDebouncing } = useDebouncedScale();
 * const size = useElementSize(containerRef);
 *
 * useZoomCentering(listRef, isDebouncing, debouncedScale, size?.height);
 *
 * return <List ref={listRef} ... />;
 * ```
 */
export function useZoomCentering(
  listRef: React.RefObject<List | null>,
  isDebouncing: boolean,
  debouncedScale: number,
  viewportHeight: number,
): void {
  const preZoomStateRef = useRef<ZoomState | null>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    if (isDebouncing) {
      // Zoom started - capture the center point of the viewport
      if (preZoomStateRef.current === null) {
        // Access the internal Grid's scrolling container to get current scrollTop
        const scrollTop = (list as unknown as { Grid: { _scrollingContainer: { scrollTop: number } } }).Grid._scrollingContainer.scrollTop;
        const currentScale = debouncedScale;

        // Store the offset from top to center of viewport, normalized by current scale
        // This allows us to calculate the new scroll position after scale changes
        preZoomStateRef.current = {
          centerOffset: (scrollTop + viewportHeight / 2) / currentScale,
          scale: currentScale,
        };
      }
    } else if (preZoomStateRef.current !== null) {
      // Zoom ended (debounce settled) - restore center position
      const newScale = debouncedScale;
      const { centerOffset } = preZoomStateRef.current;

      // Invalidate cached row heights so List recalculates with new scale
      list.recomputeRowHeights(0);

      // Calculate new scroll position to keep the same center point in the middle of viewport
      // newScrollTop = (centerOffset * newScale) - (viewportHeight / 2)
      const newScrollTop = centerOffset * newScale - viewportHeight / 2;
      list.scrollToPosition(Math.max(0, newScrollTop));

      preZoomStateRef.current = null;
    }
  }, [isDebouncing, debouncedScale, viewportHeight, listRef]);
}
