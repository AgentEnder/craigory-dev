import { r as reactExports, j as jsxRuntimeExports, i as import5, o as onRenderClient } from '../chunks/chunk-BiSMlUrc.js';
import { P as PRESENTATIONS } from '../chunks/chunk-CGzni5O_.js';
import { C as ContentMarker } from '../chunks/chunk-bNc2JGQN.js';
import { L as Link, i as import3 } from '../chunks/chunk-Cj1Pzm3x.js';
import { f as format } from '../chunks/chunk-DI4sGg5h.js';
/* empty css                       */
import '../chunks/chunk-C_jR_L7K.js';
/* empty css                       */

/*! pages/presentations/index/index.page.scss [vike:pluginModuleBanner] */

/*! pages/presentations/index/+Page.tsx [vike:pluginModuleBanner] */
function Page() {
  const hash = useLocationHash();
  reactExports.useEffect(() => {
    if (hash) {
      const active = document.querySelector(".presentation-container.active");
      if (active) {
        active.classList.remove("active");
      }
      const el = document.getElementById(hash);
      el?.classList.add("active");
    }
  }, [hash]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "presentations-container", children: Object.values(PRESENTATIONS).map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "row",
        gap: "1em",
        alignItems: "top"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: p.slug, className: `presentation-container`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "h2",
            {
              style: {
                margin: 0
              },
              className: "title",
              children: p.title
            },
            p.title + p.presentedAt + "TITLE"
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "location",
              children: p.presentedAt
            },
            p.title + p.presentedAt + "PRESENTEDAT"
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "date", children: format(p.presentedOn, "MMM dd, yyyy") }, p.title + p.presentedAt + "PRESENTEDON"),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "description",
              children: [
                p.description.split("\n").map((line) => /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: line }, line)),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "links", children: [
                  p.mdUrl || p.htmlUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { href: "/presentations/view/" + p.slug, children: "View Slides" }) : null,
                  p.recordingUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: p.recordingUrl, target: "_blank", rel: "noreferrer", children: "View Recording" }) : null,
                  p.extraLinks ? p.extraLinks.map((link, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "a",
                    {
                      href: link.url,
                      target: "_blank",
                      rel: "noreferrer",
                      children: link.title
                    },
                    link.title
                  )) : null
                ] })
              ]
            },
            p.title + p.presentedAt + "DESCRIPTION"
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            href: "#" + p.slug,
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
              textDecoration: "none",
              color: "darkgray",
              scrollBehavior: "smooth"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ContentMarker, {})
          }
        )
      ]
    },
    p.slug
  )) });
}
function useLocationHash() {
  const [hash, setHash] = reactExports.useState(globalThis?.window?.location?.hash);
  const window = globalThis?.window;
  if (!window) return null;
  window.addEventListener("hashchange", () => setHash(window.location.hash));
  return hash.slice(1);
}

const import2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  Page
}, Symbol.toStringTag, { value: 'Module' }));

/*! virtual:vike:page-entry:client:/pages/presentations/index [vike:pluginModuleBanner] */
const configValuesSerialized = {
  ["serverOnlyHooks"]: {
    type: "computed",
    definedAtData: null,
    valueSerialized: {
      type: "js-serialized",
      value: false,
    },
  },
  ["isClientRuntimeLoaded"]: {
    type: "computed",
    definedAtData: null,
    valueSerialized: {
      type: "js-serialized",
      value: true,
    },
  },
  ["onBeforeRenderEnv"]: {
    type: "computed",
    definedAtData: null,
    valueSerialized: {
      type: "js-serialized",
      value: null,
    },
  },
  ["dataEnv"]: {
    type: "computed",
    definedAtData: null,
    valueSerialized: {
      type: "js-serialized",
      value: null,
    },
  },
  ["onRenderClient"]: {
    type: "standard",
    definedAtData: {"filePathToShowToUser":"vike-react/__internal/integration/onRenderClient","fileExportPathToShowToUser":[]},
    valueSerialized: {
      type: "pointer-import",
      value: onRenderClient,
    },
  },
  ["Page"]: {
    type: "standard",
    definedAtData: {"filePathToShowToUser":"/pages/presentations/index/+Page.tsx","fileExportPathToShowToUser":[]},
    valueSerialized: {
      type: "plus-file",
      exportValues: import2,
    },
  },
  ["hydrationCanBeAborted"]: {
    type: "standard",
    definedAtData: {"filePathToShowToUser":"vike-react/config","fileExportPathToShowToUser":["default","hydrationCanBeAborted"]},
    valueSerialized: {
      type: "js-serialized",
      value: true,
    },
  },
  ["Layout"]: {
    type: "cumulative",
    definedAtData: [{"filePathToShowToUser":"/renderer/+Layout.tsx","fileExportPathToShowToUser":[]}],
    valueSerialized: [ {
      type: "plus-file",
      exportValues: import3,
    }, ],
  },
  ["title"]: {
    type: "standard",
    definedAtData: {"filePathToShowToUser":"/renderer/+config.ts","fileExportPathToShowToUser":["default","title"]},
    valueSerialized: {
      type: "js-serialized",
      value: "Craigory Coppola",
    },
  },
  ["Loading"]: {
    type: "standard",
    definedAtData: {"filePathToShowToUser":"vike-react/__internal/integration/Loading","fileExportPathToShowToUser":[]},
    valueSerialized: {
      type: "pointer-import",
      value: import5,
    },
  },
};

export { configValuesSerialized };
