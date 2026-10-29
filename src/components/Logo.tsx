type LogoProps = {
  height: number;
  className?: string;
};

// visionary153.com 가로형 로고 원본 비율 638.6 × 180
const LOGO_ASPECT = 638.6 / 180;

/** 가로형 로고. 시스템 다크 모드에서는 다크 배경용 로고로 바뀐다 */
export function Logo({ height, className }: LogoProps) {
  return (
    <picture className={className}>
      <source srcSet="/logo-horizontal-dark.svg" media="(prefers-color-scheme: dark)" />
      <img
        src="/logo-horizontal.svg"
        alt="visionary153"
        width={Math.round(height * LOGO_ASPECT)}
        height={height}
        style={{ display: 'block' }}
      />
    </picture>
  );
}
