export function Loading() {
  return (
    <div className="fixed left-0 top-0 z-1000 flex items-center justify-center w-full h-full bg-black/20">
      <div className="loader">
        <div className="dot" />
        <div className="dot" />
        <div className="dot" />
        <div className="dot" />
        <div className="dot" />
        <div className="dot" />

        <style jsx>{`
          .loader {
            width: 60px; /* 👈 전체 크기도 살짝 키움 */
            height: 60px;
            position: relative;
            animation: spin 2.2s linear infinite;
          }

          .dot {
            width: 1rem;
            height: 1rem;
            border-radius: 50%;
            position: absolute;
            top: 50%;
            left: 50%;
            margin: -0.5rem;
          }

          /* 👇 반지름 증가 (14px → 22px) */
          .dot:nth-child(1) {
            transform: rotate(0deg) translate(22px);
            background: #008236;
          }

          .dot:nth-child(2) {
            transform: rotate(60deg) translate(22px);
            background: #41a567;
          }

          .dot:nth-child(3) {
            transform: rotate(120deg) translate(22px);
            background: #6cc28f;
          }

          .dot:nth-child(4) {
            transform: rotate(180deg) translate(22px);
            background: #9ed9b2;
          }

          .dot:nth-child(5) {
            transform: rotate(240deg) translate(22px);
            background: #c3eacd;
          }

          .dot:nth-child(6) {
            transform: rotate(300deg) translate(22px);
            background: #e0f6e4;
          }

          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    </div>
  );
}
