import { Icon, type IconName } from './Icon';

export type Action = {
  key: string;
  icon: IconName;
  label: string;
  hint: string;
  tone?: 'muted';
  onPress: () => void;
};

/** 2x3 기능 버튼 */
export function ActionGrid({ actions }: { actions: Action[] }) {
  return (
    <section className="section">
      <h2 className="section-title">기능</h2>
      <div className="grid">
        {actions.map((action) => (
          <button
            key={action.key}
            type="button"
            className={`grid-button ${action.tone === 'muted' ? 'grid-button-muted' : ''}`}
            onClick={action.onPress}
          >
            <span className="grid-icon">
              <Icon name={action.icon} />
            </span>
            <span className="grid-label">{action.label}</span>
            <span className="grid-hint">{action.hint}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
