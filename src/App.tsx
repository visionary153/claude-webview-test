import { useState } from 'react';

import { BridgeError, isInApp, send } from './bridge/client';
import { isLocationResult } from './bridge/guards';
import type { BridgeErrorInfo, BridgeMethods, BridgeType, SharePayload } from './bridge/protocol';
import { type Action, ActionGrid } from './components/ActionGrid';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { type ResultEntry, ResultList } from './components/ResultList';
import { TYPE_LABELS } from './labels';

// 브릿지 객체는 페이지 로드 전에 주입되므로 한 번만 확인하면 된다
const IN_APP = isInApp();

function toErrorInfo(error: unknown): BridgeErrorInfo {
  if (error instanceof BridgeError) return { code: error.code, message: error.message };
  return { code: 'NATIVE_ERROR', message: String(error) };
}

/** 가장 최근 위치 결과가 있으면 좌표와 지도 링크를, 없으면 기본 문구를 공유한다 */
function buildSharePayload(entries: ResultEntry[]): SharePayload {
  const title = 'claude-webview-test';
  for (const entry of entries) {
    if (entry.outcome.status === 'success' && isLocationResult(entry.outcome.data)) {
      const { latitude, longitude } = entry.outcome.data;
      return {
        title,
        message: `현재 위치: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}\nhttps://www.google.com/maps?q=${latitude},${longitude}`,
      };
    }
  }
  return { title, message: `claude-webview-test에서 공유합니다 (${new Date().toLocaleString('ko-KR')})` };
}

export default function App() {
  const [entries, setEntries] = useState<ResultEntry[]>([]);

  function updateOutcome(id: string, outcome: ResultEntry['outcome']) {
    setEntries((prev) => prev.map((entry) => (entry.id === id ? { ...entry, outcome } : entry)));
  }

  function run<T extends BridgeType>(type: T, payload: BridgeMethods[T]['payload']) {
    const { id, request, result } = send(type, payload);
    const startedAt = Date.now();
    setEntries((prev) => [{ id, type, request, startedAt, outcome: { status: 'pending' } }, ...prev]);

    result.then(
      (data) => updateOutcome(id, { status: 'success', endedAt: Date.now(), data }),
      (error: unknown) => updateOutcome(id, { status: 'error', endedAt: Date.now(), error: toErrorInfo(error) }),
    );
  }

  const actions: Action[] = [
    {
      key: 'camera',
      icon: 'camera',
      label: TYPE_LABELS['camera.open'],
      hint: '촬영 후 이미지',
      onPress: () => run('camera.open', null),
    },
    {
      key: 'gallery',
      icon: 'image',
      label: TYPE_LABELS['gallery.open'],
      hint: '사진 선택',
      onPress: () => run('gallery.open', null),
    },
    {
      key: 'location',
      icon: 'location',
      label: TYPE_LABELS['location.get'],
      hint: '위도·경도 기록',
      onPress: () => run('location.get', null),
    },
    {
      key: 'share',
      icon: 'share',
      label: TYPE_LABELS['share.open'],
      hint: '네이티브 공유 창',
      onPress: () => run('share.open', buildSharePayload(entries)),
    },
    { key: 'ping', icon: 'ping', label: TYPE_LABELS.ping, hint: '연결·왕복 시간', onPress: () => run('ping', null) },
    {
      key: 'clear',
      icon: 'clear',
      label: '결과 지우기',
      hint: `${entries.length}건`,
      tone: 'muted',
      onPress: () => setEntries([]),
    },
  ];

  return (
    <div className="app">
      <Header inApp={IN_APP} />
      <main className="wrap main">
        <section className="intro">
          <h1 className="intro-title">
            <span className="gradient-text">WebView</span> Bridge
          </h1>
          <p className="intro-sub">claude-rn-test 앱과 웹뷰 사이의 브릿지 통신을 테스트합니다.</p>
        </section>
        <ActionGrid actions={actions} />
        <ResultList entries={entries} />
      </main>
      <Footer inApp={IN_APP} />
    </div>
  );
}
