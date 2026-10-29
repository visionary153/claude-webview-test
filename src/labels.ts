import type { BridgeType } from './bridge/protocol';

export const TYPE_LABELS: Record<BridgeType, string> = {
  ping: 'Ping',
  'camera.open': '카메라',
  'gallery.open': '갤러리',
  'location.get': '현재 위치',
  'share.open': '공유',
};
