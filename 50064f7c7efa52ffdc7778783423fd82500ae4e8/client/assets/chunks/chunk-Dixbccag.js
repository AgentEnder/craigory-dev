import { j as jsxRuntimeExports, t as toast } from './chunk-KfAUObKh.js';

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
