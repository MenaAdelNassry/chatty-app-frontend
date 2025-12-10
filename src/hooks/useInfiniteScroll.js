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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => bodyRef.current.removeEventListener('scroll', handleScroll, true);
  }, [handleScroll, bodyRef]);
};

export default useInfiniteScroll;
