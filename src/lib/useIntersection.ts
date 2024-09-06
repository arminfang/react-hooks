import { useEffect, useMemo, useState } from "react";

interface UseIntersection {
  (target: Element | null): boolean;
}

const useIntersection: UseIntersection = (target) => {
  const [isInViewport, setIsInViewPort] = useState(false);

  const observer = useMemo(
    () =>
      new IntersectionObserver(([entry]) => {
        setIsInViewPort(entry.isIntersecting);
      }),
    []
  );

  useEffect(() => {
    if (target) {
      observer.observe(target);
    }
    return () => {
      observer.disconnect();
    };
  }, [target, observer]);

  return isInViewport;
};

export default useIntersection;
