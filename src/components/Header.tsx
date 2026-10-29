import { Logo } from './Logo';

export function Header({ inApp }: { inApp: boolean }) {
  return (
    <header className="header">
      <div className="wrap header-inner">
        <Logo height={40} className="header-logo" />
        <span className={`status ${inApp ? 'status-on' : 'status-off'}`}>
          <span className="status-dot" aria-hidden />
          {inApp ? '앱 연결됨' : '브라우저'}
        </span>
      </div>
    </header>
  );
}
