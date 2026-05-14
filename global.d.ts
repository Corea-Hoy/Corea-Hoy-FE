declare global {
  interface Window {
    __googleSDKReady?: boolean;
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (res: { credential: string }) => void;
            itp_support?: boolean;
          }) => void;
          prompt: () => void;
        };
      };
    };
    Kakao?: {
      isInitialized: () => boolean;
      init: (key: string) => void;
      Share: {
        sendDefault: (settings: {
          objectType: string;
          content: {
            title: string;
            imageUrl: string;
            link: {
              mobileWebUrl: string;
              webUrl: string;
            };
          };
        }) => void;
      };
    };
  }
}

export {};
