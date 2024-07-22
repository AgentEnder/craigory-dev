import { j as jsxRuntimeExports, i as import1, o as onRenderClient, a as import4$1 } from '../chunks/chunk-D5GMF5o4.js';

function App() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: "Welcome!!" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "I'm Craigory" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "I'm a software engineer, currently focused on open source and developer tooling. I enjoy programming, tech conferences, woodworking and games." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Links" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "https://www.github.com/agentender", children: "Github" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "https://www.linkedin.com/in/craigoryvcoppola", children: "LinkedIn" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "https://www.twitter.com/@EnderAgent", children: "Twitter" }) })
    ] })
  ] });
}

function Page() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(App, {});
}

const import4 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  Page
}, Symbol.toStringTag, { value: 'Module' }));

const configValuesSerialized = {
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
  ["Loading"]: {
    type: "standard",
    definedAtData: {"filePathToShowToUser":"vike-react/components/Loading","fileExportPathToShowToUser":[]},
    valueSerialized: {
      type: "pointer-import",
      value: import1,
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
  ["onRenderClient"]: {
    type: "standard",
    definedAtData: {"filePathToShowToUser":"vike-react/renderer/onRenderClient","fileExportPathToShowToUser":[]},
    valueSerialized: {
      type: "pointer-import",
      value: onRenderClient,
    },
  },
  ["Layout"]: {
    type: "cumulative",
    definedAtData: [{"filePathToShowToUser":"/renderer/+Layout.tsx","fileExportPathToShowToUser":[]}],
    valueSerialized: [ {
      type: "plus-file",
      exportValues: import4$1,
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
  ["Page"]: {
    type: "standard",
    definedAtData: {"filePathToShowToUser":"/pages/index/+Page.tsx","fileExportPathToShowToUser":[]},
    valueSerialized: {
      type: "plus-file",
      exportValues: import4,
    },
  },
};

export { configValuesSerialized };
