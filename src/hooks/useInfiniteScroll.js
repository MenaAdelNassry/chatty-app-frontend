import { useRef, useCallback } from 'react';

const useInfiniteScroll = (callback) => {
  const observer = useRef(null);

  const lastElementRef = useCallback((node) => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        console.log('Last element visible! Loading more...');
        callback();
      }
    });

    // 4. لو العنصر موجود (node)، راقبه
    if (node) observer.current.observe(node);
  }, [callback]);

  return lastElementRef;
};

export default useInfiniteScroll;
