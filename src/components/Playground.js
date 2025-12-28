import React, { useState, Suspense, lazy } from 'react';

// محاكاة لملف كبير بياخد 3 ثواني عشان يتحمل من السيرفر
// لاحظ: الكود ده مش هيتنفذ غير لما نحتاج الكومبوننت
const LazyChat = lazy(() => {
  return new Promise((resolve) => {
    console.log("📡 جاري تحميل ملف الشات من السيرفر...");
    setTimeout(() => {
      resolve(import('./HeavyChat')); // عدل المسار لو الملف في مكان تاني
    }, 3000); // تأخير 3 ثواني (كأن النت بطيء)
  });
});

const Playground = () => {
  const [showChat, setShowChat] = useState(false);

  return (
    <div style={{ padding: '50px' }}>
      <h1>🚀 الصفحة الرئيسية (سريعة جداً)</h1>
      <p>لاحظ إن الصفحة دي فتحت فوراً ومستنتش الشات يحمل.</p>

      <hr />

      {/* الزرار ده هو اللي هيشغل تحميل الملف */}
      <button
        onClick={() => setShowChat(true)}
        style={{ padding: '10px 20px', fontSize: '18px', cursor: 'pointer' }}
      >
        📥 اضغط هنا لفتح الشات (تحميل الملف)
      </button>

      <div style={{ marginTop: '20px' }}>
        {showChat && (
          // الـ Suspense هنا هو اللي بيعرض "Loading" في الـ 3 ثواني بتوع التحميل
          <Suspense fallback={<h3 style={{color: 'blue'}}>⏳ استنى بنحمل ملف الجافاسكريبت بتاع الشات...</h3>}>
            <LazyChat />
          </Suspense>
        )}
      </div>
    </div>
  );
};

export default Playground;
