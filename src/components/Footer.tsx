import { BRIDGE_VERSION } from '../bridge/protocol';
import { Logo } from './Logo';

export function Footer({ inApp }: { inApp: boolean }) {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <div className="footer-brand">
          <Logo height={28} className="footer-logo" />
          <span className="copyright">© 2026 visionary153. All rights reserved.</span>
        </div>
        <ul className="footer-meta">
          <li>Bridge v{BRIDGE_VERSION}</li>
          <li>{inApp ? 'React Native WebView' : '일반 브라우저'}</li>
          <li>{window.location.host}</li>
        </ul>
      </div>
    </footer>
  );
}
