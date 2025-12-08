import { useState, useEffect } from 'react'

const useDetectOutsideClick = (ref, initialValue) => {
  const [isActive, setIsActive] = useState(initialValue);

  useEffect(() => {
    if(!isActive) return;

    const listener = (event) => {
      if(ref.current && !ref.current.contains(event.target)) {
        setIsActive(false);
      }
    }

    // touchstart for mobiles
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [isActive, ref]);

  return [isActive, setIsActive]
}

export default useDetectOutsideClick;
