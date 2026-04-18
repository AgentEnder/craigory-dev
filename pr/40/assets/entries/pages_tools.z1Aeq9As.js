import { j as jsxRuntimeExports, i as import5, o as onRenderClient } from '../chunks/chunk-BhkQSdlV.js';
import { u as useData, d as FaExternalLinkAlt } from '../chunks/chunk-CSOl_UGH.js';
import { i as import3 } from '../chunks/chunk-BKK-lUMj.js';
import '../chunks/chunk-BhW2AVEc.js';
/* empty css                       */
/* empty css                       */

/*! pages/tools/styles.scss [vike:pluginModuleBanner] */

/*! pages/tools/+Page.tsx [vike:pluginModuleBanner] */
function Page() {
  const { tools } = useData();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: "Web Dev Tools" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "tools-intro", children: "A selection of web based tools that may come in handy during development or otherwise." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tools-grid", children: tools.map((tool) => /* @__PURE__ */ jsxRuntimeExports.jsx(ToolCard, { tool }, tool.repo)) })
  ] });
}
function ToolCard({ tool }) {
  const name = "metadata" in tool && tool.metadata.name ? tool.metadata.name : tool.repo;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "tool-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "tool-card-name", children: name }),
    tool.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "tool-card-description", children: tool.description }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tool-card-actions", children: [
      tool.deployment && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "a",
        {
          href: tool.deployment,
          className: "tool-card-launch",
          target: "_blank",
          rel: "noreferrer",
          children: [
            "Launch",
            /* @__PURE__ */ jsxRuntimeExports.jsx(FaExternalLinkAlt, {})
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: tool.url,
          className: "tool-card-source",
          target: "_blank",
          rel: "noreferrer",
          children: "Source"
        }
      )
    ] })
  ] });
}

const import2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  Page
}, Symbol.toStringTag, { value: 'Module' }));

/*! virtual:vike:page-entry:client:/pages/tools [vike:pluginModuleBanner] */
const configValuesSerialized = {
  ["hasServerOnlyHook"]: {
    type: "computed",
    definedAtData: null,
    valueSerialized: {
      type: "js-serialized",
      value: true,
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
      value: {"server":true},
    },
  },
  ["guardEnv"]: {
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
    definedAtData: {"filePathToShowToUser":"/pages/tools/+Page.tsx","fileExportPathToShowToUser":[]},
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
