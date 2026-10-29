import type { ImageResult, LocationResult, PingResult, ShareResult } from './protocol';

// RN 응답의 data는 JSON으로 넘어온 unknown 값이라 화면에 쓰기 전에 모양을 확인한다

const isObject = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;

export const isPingResult = (value: unknown): value is PingResult =>
  isObject(value) && typeof value.platform === 'string' && typeof value.appVersion === 'string';

export const isImageResult = (value: unknown): value is ImageResult =>
  isObject(value) && typeof value.dataUri === 'string' && typeof value.width === 'number';

export const isLocationResult = (value: unknown): value is LocationResult =>
  isObject(value) && typeof value.latitude === 'number' && typeof value.longitude === 'number';

export const isShareResult = (value: unknown): value is ShareResult =>
  isObject(value) && (value.action === 'shared' || value.action === 'dismissed');
