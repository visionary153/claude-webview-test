import { BRIDGE_VERSION } from '../bridge/protocol';

export function Footer({ inApp }: { inApp: boolean }) {
  return (
    <footer className="footer">
      <span>Bridge protocol v{BRIDGE_VERSION}</span>
      <span>{inApp ? 'React Native WebView' : '일반 브라우저'}</span>
      <span>{window.location.host}</span>
    </footer>
  );
}
