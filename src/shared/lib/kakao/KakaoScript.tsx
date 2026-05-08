import Script from 'next/script';

export function KakaoScript() {
  return <Script src="https://developers.kakao.com/sdk/js/kakao.js" strategy="beforeInteractive" />;
}
