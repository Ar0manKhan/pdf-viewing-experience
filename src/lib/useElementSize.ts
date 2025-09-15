import { useState, useLayoutEffect, type RefObject } from "react";
import useResizeObserver from "@react-hook/resize-observer";

type Size = DOMRectReadOnly | undefined;

/**
 * Custom hook to track the size of a DOM element.
 * @param target - React ref for the target element (e.g., useRef<HTMLDivElement>(null))
 * @returns DOMRectReadOnly containing size and position (or undefined if not available)
 */
function useElementSize<T extends HTMLElement>(target: RefObject<T>): Size {
  const [size, setSize] = useState<Size>(undefined);

  useLayoutEffect(() => {
    if (target.current) {
      setSize(target.current.getBoundingClientRect());
    }
  }, [target]);

  useResizeObserver(target, (entry) => setSize(entry.contentRect));

  return size;
}

export default useElementSize;
