import { useEffect, useRef } from "react";

const useChatScrollToBottom = (messages) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if(scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  return scrollRef;
}

export default useChatScrollToBottom;
