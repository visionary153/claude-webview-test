type LogoProps = {
  height: number;
  className?: string;
};

// visionary153.com 가로형 로고 원본 비율 638.6 × 180
const LOGO_ASPECT = 638.6 / 180;

/** 가로형 로고. 화면이 항상 다크라 다크 배경용 로고를 쓴다 */
export function Logo({ height, className }: LogoProps) {
  return (
    <img
      className={className}
      src="/logo-horizontal-dark.svg"
      alt="visionary153"
      width={Math.round(height * LOGO_ASPECT)}
      height={height}
      style={{ display: 'block' }}
    />
  );
}
