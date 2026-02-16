import { useLayoutEffect, useRef } from 'react';

const useChatScroll = (messages) => {
  const scrollRef = useRef(null);
  const prevScrollHeightRef = useRef(0);
  const prevMessagesLengthRef = useRef(0);

  useLayoutEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    // 1. حساب الفرق في عدد الرسائل
    const currentLength = messages.length;
    const oldLength = prevMessagesLengthRef.current;

    // 2. هل ده Pagination؟ (الرسائل زادت بس إحنا كنا فوق)
    const isPagination = currentLength > oldLength && oldLength !== 0 && container.scrollTop < 100;

    if (isPagination) {
      // --- التركة الاحترافية هنا ---

      // أ. تعطيل الـ Smooth Behavior مؤقتاً عشان ميبانش الـ "سحب"
      const originalSmooth = container.style.scrollBehavior;
      container.style.scrollBehavior = 'auto';

      // ب. الحسبة السحرية: الفرق بين الطول الجديد والقديم
      const heightDifference = container.scrollHeight - prevScrollHeightRef.current;

      // ج. تثبيت السكرول في مكانه بالمللي
      container.scrollTop = heightDifference;

      // د. ترجيع الـ Smooth Behavior (لو كنت مستخدمه)
      container.style.scrollBehavior = originalSmooth;
    } else if (currentLength > oldLength) {
      // لو رسالة واحدة جديدة (تحت)، انزل بسلاسة
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
    }

    // تحديث المراجع للمرة الجاية
    prevScrollHeightRef.current = container.scrollHeight;
    prevMessagesLengthRef.current = currentLength;
  }, [messages]);

  return scrollRef;
};

export default useChatScroll;
