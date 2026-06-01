import type { OnBeforePrerenderStartSync } from 'vike/types';
import { loadUnicodeData } from '../../../unicode-loader.server';

export const onBeforePrerenderStart: OnBeforePrerenderStartSync = (): ReturnType<OnBeforePrerenderStartSync> => {
  return loadUnicodeData().versions.map((v) => `/unicode/versions/${v}`);
};
