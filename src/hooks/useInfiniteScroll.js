import { useCallback, useEffect } from 'react';

const useInfiniteScroll = (bodyRef, bottomLineRef, callback) => {
  const handleScroll = useCallback(() => {
    const containerHeight = bodyRef.current.getBoundingClientRect().height;
    const { top: bottomLineTop } =
      bottomLineRef.current.getBoundingClientRect();

    if (bottomLineTop <= containerHeight) {
      callback();
    }
  }, [bodyRef, bottomLineRef, callback]);

  useEffect(() => {
    bodyRef?.current.addEventListener('scroll', handleScroll, true);
    return () => bodyRef.removeEventListener('scroll', handleScroll, true);
  }, [handleScroll, bodyRef]);
};

export default useInfiniteScroll;
