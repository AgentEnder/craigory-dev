import { createContext, useContext } from 'react';

/**
 * Split out from spotlight-search.tsx so that file exports nothing but
 * components. A module mixing component and non-component exports can't be a
 * React Fast Refresh boundary, so editing it invalidates every importer up to
 * +Layout — which remounts the whole shell on the next navigation.
 */

export interface SpotlightContextValue {
  open: () => void;
}

export const SpotlightContext = createContext<SpotlightContextValue>({
  open: () => undefined,
});

export function useSpotlight(): SpotlightContextValue {
  return useContext(SpotlightContext);
}
