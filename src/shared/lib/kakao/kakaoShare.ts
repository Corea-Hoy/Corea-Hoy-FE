import { ENV } from '@/shared/config/env';

interface KakaoShareOptions {
  title: string;
  imageUrl: string;
  url: string;
}

export const kakaoShare = ({ title, imageUrl, url }: KakaoShareOptions) => {
  if (!window.Kakao) {
    console.error('[kakaoShare] Kakao SDK가 아직 로드되지 않았습니다.');
    return;
  }

  if (!window.Kakao.isInitialized()) {
    window.Kakao.init(ENV.KAKAO_KEY);
  }

  window.Kakao.Share.sendDefault({
    objectType: 'feed',
    content: {
      title,
      imageUrl,
      link: {
        mobileWebUrl: url,
        webUrl: url,
      },
    },
  });
};
