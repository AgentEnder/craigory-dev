import vikeReact from 'vike-react/config';
import type { Config } from 'vike/types';

export default {
  extends: [vikeReact],
  // `partial` lets the /glyph viewer opt out of prerendering (its CJK URLs render
  // client-side) without Vike warning that the route wasn't fully pre-rendered.
  prerender: { partial: true },
} satisfies Config;
