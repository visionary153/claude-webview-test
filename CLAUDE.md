@README.md

## 프로젝트 공통 규칙

- 짝 프로젝트: `../claude-rn-test` (Expo 앱). 브릿지 기능은 보통 양쪽을 함께 바꾼다.
- `src/bridge/protocol.ts`는 `../claude-rn-test/src/features/bridge/protocol.ts`와 **같은 내용**을 유지한다. 바꾸면 복사하고 `diff`로 확인한다.
- RN 응답 `data`는 `unknown`이다. 타입 단언 대신 `src/bridge/guards.ts`의 가드로 확인한다.
- 스타일은 `src/index.css` 한 파일, 색은 `:root` CSS 변수를 쓴다 (앱 `theme.ts`와 같은 팔레트).
- 포맷터: prettier (`npm run format`). 검증: `npm run typecheck`, `npm run lint`, `npm run build`.
- TypeScript는 `~6.0.3`으로 고정했다. typescript-eslint가 아직 TS 7을 지원하지 않는다.
