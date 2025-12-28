import { useState, useEffect } from 'react'

const useDetectOutsideClick = (ref, initialValue) => {
  const [isActive, setIsActive] = useState(initialValue);

  useEffect(() => {
    if(!isActive) return;

    const listener = (event) => {
      console.log("If is contain: ", ref.current.contains(event.target))
      console.log(ref.current)
      console.log(event.target)
      if(ref.current && !ref.current.contains(event.target)) {
        console.log("logged")
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
