// apps/alt-codes/pages/category/@id/+onBeforePrerenderStart.ts
import type { OnBeforePrerenderStartSync } from 'vike/types';
import { CATEGORIES } from '../../../src/unicode-data';

export const onBeforePrerenderStart: OnBeforePrerenderStartSync = (): ReturnType<OnBeforePrerenderStartSync> => {
  return CATEGORIES.map((cat) => `/category/${cat.id}`);
};
