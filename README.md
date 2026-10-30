# claude-webview-test

`claude-rn-test` 앱의 **웹뷰 테스트** 화면에 띄우는 웹. 웹뷰 ↔ React Native 브릿지 통신을 만들면서 배우는 학습용 프로젝트다.

React 19 + Vite + TypeScript. UI 라이브러리 없이 CSS만 쓴다.

## 화면

- **Header**: 제목, 연결 상태 (`앱 연결됨` = RN WebView 안, `브라우저` = 일반 브라우저)
- **기능 (2x3)**: 카메라 | 갤러리 / 현재 위치 | 공유 / Ping | 결과 지우기
- **결과**: 요청마다 카드 1장 (최신이 위). 상태·요청 ID·걸린 시간, 이미지 미리보기·좌표·공유 결과, 요청/응답 JSON
- **Footer**: 프로토콜 버전, 실행 환경, 접속 host

## 브릿지 프로토콜

```
웹 → RN   window.ReactNativeWebView.postMessage(JSON.stringify({ v, id, type, payload }))
RN → 웹   webview.injectJavaScript("window.__bridgeReceive({ v, id, ok, data | error })")
```

| type | 기능 | 성공 data | 주요 실패 code |
|---|---|---|---|
| `ping` | 연결 확인 | 플랫폼·OS·앱 버전 | `TIMEOUT` |
| `camera.open` | 카메라 촬영 | 이미지 (base64 data URI) | `CANCELLED`, `PERMISSION_DENIED` |
| `gallery.open` | 갤러리 선택 | 이미지 (base64 data URI) | `CANCELLED`, `PERMISSION_DENIED` |
| `location.get` | 현재 위치 | 위도·경도·정확도·측정 시각 | `PERMISSION_DENIED`, `LOCATION_DISABLED` |
| `share.open` | OS 공유 창 | `shared` / `dismissed` | `INVALID_REQUEST` |

- 공통 실패 code: `NOT_IN_APP`(브라우저에서 열림), `UNKNOWN_TYPE`, `NATIVE_ERROR`
- 타입 정의는 `src/bridge/protocol.ts`. **앱의 `claude-rn-test/src/features/bridge/protocol.ts`와 같은 파일**이라 바꾸면 양쪽을 맞춘다.
- 요청 id로 응답을 짝짓고(`src/bridge/client.ts`의 대기 Map), type별 타임아웃이 지나면 `TIMEOUT`으로 끝낸다.
- 이미지는 `file://` URI를 웹(http)에서 열 수 없어 base64 data URI로 받는다.
- 공유는 최근 위치 결과가 있으면 좌표 + 지도 링크, 없으면 기본 문구를 보낸다.

## 실행

```bash
npm install
npm run dev        # http://localhost:5173 (host: true로 LAN IP에서도 접속 가능)
npm run typecheck
npm run lint
npm run format     # prettier
npm run build
```

### 앱에서 열기

앱 웹뷰 화면의 기본 주소가 `http://localhost:5173`이다. 기기에서 `localhost`는 기기 자신이므로:

- USB 기기·에뮬레이터: `adb reverse tcp:5173 tcp:5173` 후 `localhost:5173`
- 에뮬레이터: host를 `10.0.2.2`로
- Wi-Fi: host에 PC의 IP

일반 브라우저에서 열면 모든 요청이 `NOT_IN_APP`으로 실패한다 (화면 확인용).
