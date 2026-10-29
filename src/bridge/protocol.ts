// 웹뷰 ↔ RN 브릿지 프로토콜.
// 웹(claude-webview-test/src/bridge/protocol.ts)과 앱(claude-rn-test/src/features/bridge/protocol.ts)이
// 같은 내용을 복사해 쓴다. 한쪽을 바꾸면 다른 쪽도 똑같이 바꿔야 한다.

export const BRIDGE_VERSION = 1;

export type PingResult = {
  platform: string;
  osVersion: string;
  appVersion: string;
  /** RN이 요청을 받은 시각 (ms) */
  receivedAt: number;
};

export type ImageResult = {
  /** 네이티브 파일 URI. 웹(http)에서는 file:// 을 열 수 없어 표시용으로만 쓴다 */
  uri: string;
  /** 웹의 <img src>에 바로 쓰는 base64 data URI */
  dataUri: string;
  width: number;
  height: number;
  fileSize: number | null;
  mimeType: string | null;
};

export type LocationResult = {
  latitude: number;
  longitude: number;
  /** 오차 반경 (m) */
  accuracy: number | null;
  altitude: number | null;
  /** 위치를 측정한 시각 (ms) */
  timestamp: number;
  /** Android 모의 위치 여부 (에뮬레이터 geo fix 등) */
  mocked: boolean | null;
};

export type SharePayload = {
  title: string;
  message: string;
};

export type ShareResult = {
  /** Android는 사용자가 실제로 공유했는지 알 수 없어 항상 'shared'다 */
  action: 'shared' | 'dismissed';
  activityType: string | null;
};

/** 요청 type별 payload(웹 → RN)와 result(RN → 웹) */
export type BridgeMethods = {
  ping: { payload: null; result: PingResult };
  'camera.open': { payload: null; result: ImageResult };
  'gallery.open': { payload: null; result: ImageResult };
  'location.get': { payload: null; result: LocationResult };
  'share.open': { payload: SharePayload; result: ShareResult };
};

export type BridgeType = keyof BridgeMethods;

export type BridgeErrorCode =
  | 'CANCELLED'
  | 'PERMISSION_DENIED'
  | 'LOCATION_DISABLED'
  | 'TIMEOUT'
  | 'NOT_IN_APP'
  | 'UNKNOWN_TYPE'
  | 'INVALID_REQUEST'
  | 'NATIVE_ERROR';

export type BridgeErrorInfo = {
  code: BridgeErrorCode;
  message: string;
};

/** 웹 → RN: window.ReactNativeWebView.postMessage(JSON.stringify(request)) */
export type BridgeRequest<T extends BridgeType = BridgeType> = {
  v: typeof BRIDGE_VERSION;
  id: string;
  type: T;
  payload: BridgeMethods[T]['payload'];
};

/** RN → 웹: webview.injectJavaScript로 window.__bridgeReceive(response) 호출 */
export type BridgeResponse =
  | { v: typeof BRIDGE_VERSION; id: string; ok: true; data: unknown }
  | { v: typeof BRIDGE_VERSION; id: string; ok: false; error: BridgeErrorInfo };
