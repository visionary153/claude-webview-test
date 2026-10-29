import {
  BRIDGE_VERSION,
  type BridgeErrorCode,
  type BridgeMethods,
  type BridgeRequest,
  type BridgeResponse,
  type BridgeType,
} from './protocol';

declare global {
  interface Window {
    /** react-native-webview가 페이지 로드 전에 넣어 주는 객체. 일반 브라우저에는 없다 */
    ReactNativeWebView?: { postMessage: (message: string) => void };
    /** RN이 injectJavaScript로 호출하는 응답 수신 함수 */
    __bridgeReceive?: (response: BridgeResponse) => void;
  }
}

export class BridgeError extends Error {
  readonly code: BridgeErrorCode;

  constructor(code: BridgeErrorCode, message: string) {
    super(message);
    this.name = 'BridgeError';
    this.code = code;
  }
}

/** 사용자 조작(촬영·선택·공유)이 끼는 요청은 오래 기다린다 */
const TIMEOUT_MS: Record<BridgeType, number> = {
  ping: 3_000,
  'camera.open': 120_000,
  'gallery.open': 120_000,
  'location.get': 30_000,
  'share.open': 120_000,
};

type Pending = {
  resolve: (data: unknown) => void;
  reject: (error: BridgeError) => void;
  timer: number;
};

const pending = new Map<string, Pending>();
let sequence = 0;

export const isInApp = () => typeof window.ReactNativeWebView?.postMessage === 'function';

// crypto.randomUUID는 보안 컨텍스트(https, localhost)에서만 있어 Wi-Fi IP(http)로 열면 없다
const nextId = () => `${Date.now().toString(36)}-${(++sequence).toString(36)}`;

window.__bridgeReceive = (response) => {
  const request = pending.get(response.id);
  // 타임아웃이 지났거나 페이지를 새로고침한 뒤 도착한 응답은 버린다
  if (!request) return;

  pending.delete(response.id);
  window.clearTimeout(request.timer);
  if (response.ok) request.resolve(response.data);
  else request.reject(new BridgeError(response.error.code, response.error.message));
};

/**
 * RN에 요청을 보내고 같은 id의 응답을 기다린다.
 * id를 바로 돌려줘 응답이 오기 전에도 화면에 요청을 표시할 수 있게 한다.
 */
export function send<T extends BridgeType>(type: T, payload: BridgeMethods[T]['payload']) {
  const id = nextId();
  const request: BridgeRequest<T> = { v: BRIDGE_VERSION, id, type, payload };

  const result = new Promise<unknown>((resolve, reject) => {
    const bridge = window.ReactNativeWebView;
    if (!bridge) {
      reject(new BridgeError('NOT_IN_APP', '앱(WebView) 밖에서 열려 있어 RN에 요청할 수 없습니다'));
      return;
    }

    const timer = window.setTimeout(() => {
      pending.delete(id);
      reject(new BridgeError('TIMEOUT', `${TIMEOUT_MS[type] / 1000}초 안에 응답이 없습니다`));
    }, TIMEOUT_MS[type]);

    pending.set(id, { resolve, reject, timer });
    bridge.postMessage(JSON.stringify(request));
  });

  return { id, request, result };
}
