import { j as jsxRuntimeExports } from './chunk-BiSMlUrc.js';
import { t as toast } from './chunk-Cj1Pzm3x.js';

/*! src/shared-components/content-marker.tsx [vike:pluginModuleBanner] */
function ContentMarker() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      style: {
        display: "inline-block"
      },
      onClick: (e) => {
        if (e.target instanceof HTMLDivElement) {
          if (e.target.parentElement instanceof HTMLAnchorElement) {
            if (navigator.clipboard) {
              navigator.clipboard.writeText(e.target.parentElement.href);
              toast({ content: "Copied link to clipboard", style: "info" });
            }
          }
        }
      },
      children: "#"
    }
  );
}

export { ContentMarker as C };
