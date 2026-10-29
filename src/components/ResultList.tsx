import { isImageResult, isLocationResult, isPingResult, isShareResult } from '../bridge/guards';
import type { BridgeErrorInfo, BridgeRequest, BridgeType } from '../bridge/protocol';
import { TYPE_LABELS } from '../labels';

export type ResultEntry = {
  id: string;
  type: BridgeType;
  request: BridgeRequest;
  startedAt: number;
  outcome:
    | { status: 'pending' }
    | { status: 'success'; endedAt: number; data: unknown }
    | { status: 'error'; endedAt: number; error: BridgeErrorInfo };
};

const STATUS_LABELS = { pending: '대기', success: '성공', error: '실패' } as const;
// base64 이미지처럼 긴 문자열은 JSON 보기에서 잘라 길이만 보여준다
const MAX_JSON_STRING = 80;

function toDisplayJson(value: unknown) {
  return JSON.stringify(
    value,
    (_key, v: unknown) =>
      typeof v === 'string' && v.length > MAX_JSON_STRING ? `${v.slice(0, MAX_JSON_STRING)}… (${v.length}자)` : v,
    2,
  );
}

const timeOf = (at: number) => new Date(at).toLocaleTimeString('ko-KR', { hour12: false });

export function ResultList({ entries }: { entries: ResultEntry[] }) {
  return (
    <section className="section">
      <h2 className="section-title">결과</h2>
      {entries.length === 0 ? (
        <p className="empty">버튼을 누르면 요청과 응답이 여기에 쌓입니다.</p>
      ) : (
        <ol className="results">
          {entries.map((entry) => (
            <ResultCard key={entry.id} entry={entry} />
          ))}
        </ol>
      )}
    </section>
  );
}

function ResultCard({ entry }: { entry: ResultEntry }) {
  const { outcome } = entry;
  const elapsed = outcome.status === 'pending' ? null : outcome.endedAt - entry.startedAt;

  return (
    <li className="card">
      <div className="card-header">
        <strong className="card-title">{TYPE_LABELS[entry.type]}</strong>
        <span className={`badge badge-${outcome.status}`}>{STATUS_LABELS[outcome.status]}</span>
        <span className="card-meta">
          #{entry.id} · {timeOf(entry.startedAt)}
          {elapsed !== null ? ` · ${elapsed}ms` : ''}
        </span>
      </div>

      {outcome.status === 'pending' ? <p className="muted">응답을 기다리는 중…</p> : null}
      {outcome.status === 'error' ? (
        <p className="error">
          <code>{outcome.error.code}</code> {outcome.error.message}
        </p>
      ) : null}
      {outcome.status === 'success' ? <SuccessBody type={entry.type} data={outcome.data} /> : null}

      <details className="details">
        <summary>요청 / 응답 JSON</summary>
        <pre>{toDisplayJson({ request: entry.request, response: outcome })}</pre>
      </details>
    </li>
  );
}

function SuccessBody({ type, data }: { type: BridgeType; data: unknown }) {
  if ((type === 'camera.open' || type === 'gallery.open') && isImageResult(data)) {
    return (
      <div className="image-result">
        <img className="preview" src={data.dataUri} alt="선택한 이미지" />
        <dl className="fields">
          <Field label="크기" value={`${data.width} × ${data.height}`} />
          <Field label="용량" value={data.fileSize ? `${Math.round(data.fileSize / 1024)} KB` : '-'} />
          <Field label="형식" value={data.mimeType ?? '-'} />
          <Field label="URI" value={data.uri} />
        </dl>
      </div>
    );
  }

  if (type === 'location.get' && isLocationResult(data)) {
    return (
      <dl className="fields">
        <Field label="위도" value={data.latitude.toFixed(6)} />
        <Field label="경도" value={data.longitude.toFixed(6)} />
        <Field label="정확도" value={data.accuracy !== null ? `±${Math.round(data.accuracy)}m` : '-'} />
        <Field label="측정 시각" value={timeOf(data.timestamp)} />
        {data.mocked ? <Field label="모의 위치" value="예" /> : null}
      </dl>
    );
  }

  if (type === 'share.open' && isShareResult(data)) {
    return (
      <dl className="fields">
        <Field label="결과" value={data.action === 'shared' ? '공유함' : '닫음'} />
        <Field label="공유 대상" value={data.activityType ?? '-'} />
      </dl>
    );
  }

  if (type === 'ping' && isPingResult(data)) {
    return (
      <dl className="fields">
        <Field label="플랫폼" value={`${data.platform} ${data.osVersion}`} />
        <Field label="앱 버전" value={data.appVersion} />
      </dl>
    );
  }

  return null;
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </>
  );
}
