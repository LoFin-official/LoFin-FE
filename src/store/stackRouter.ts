import { NextRouter } from 'next/router';

// react native app 환경인지 판단
const isApp = () => {
  let isApp = false;

  if (typeof window !== 'undefined' && 'ReactNativeWebView' in window) {
    isApp = true;
  }

  return isApp;
};

// ReactNative Webview에 postMessage 요청
const sendRouterEvent = (path: string): void => {
  // 타입 어설션 사용
  (window as any).ReactNativeWebView.postMessage(JSON.stringify({ type: 'ROUTER_EVENT', data: path }));
};

// 뒤로가기 하는 경우
export const stackRouterBack = (router: NextRouter) => {
  if (isApp()) {
    sendRouterEvent('back');
  } else {
    router.back();
  }
};

// push 하는 경우
export const stackRouterPush = (router: NextRouter, url: string) => {
  if (isApp()) {
    sendRouterEvent(url);
  } else {
    router.push(url).then();
  }
};
