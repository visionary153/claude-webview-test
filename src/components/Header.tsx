export function Header({ inApp }: { inApp: boolean }) {
  return (
    <header className="header">
      <div>
        <h1 className="header-title">WebView Bridge</h1>
        <p className="header-subtitle">claude-rn-test 앱과 브릿지 통신 테스트</p>
      </div>
      <span className={`status ${inApp ? 'status-on' : 'status-off'}`}>{inApp ? '앱 연결됨' : '브라우저'}</span>
    </header>
  );
}
