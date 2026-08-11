import { n as __exportAll } from "../chunks/chunk-Sg1e8hzK.js";
import { n as require_jsx_runtime, r as onRenderClient, t as Loading_default } from "../chunks/chunk-Bla4Nnmu.js";
import { t as _Layout_exports } from "../chunks/chunk-Dmktz08c.js";
//#region src/app/app.tsx
var import_jsx_runtime = require_jsx_runtime();
function App() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Welcome!" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "I'm Craigory" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "I'm a software engineer, currently focused on open source and developer tooling. I enjoy programming, tech conferences, woodworking and games." }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Links" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "https://www.github.com/agentender",
				children: "Github"
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "https://www.linkedin.com/in/craigoryvcoppola",
				children: "LinkedIn"
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "https://www.twitter.com/@EnderAgent",
				children: "Twitter"
			}) })
		] })
	] });
}
//#endregion
//#region pages/index/+Page.tsx
var _Page_exports = /* @__PURE__ */ __exportAll({ Page: () => Page });
function Page() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(App, {});
}
//#endregion
//#region \0virtual:vike:page-entry:client:/pages/index
var configValuesSerialized = {
	["hasServerOnlyHook"]: {
		type: "computed",
		definedAtData: null,
		valueSerialized: {
			type: "js-serialized",
			value: false
		}
	},
	["isClientRuntimeLoaded"]: {
		type: "computed",
		definedAtData: null,
		valueSerialized: {
			type: "js-serialized",
			value: true
		}
	},
	["onBeforeRenderEnv"]: {
		type: "computed",
		definedAtData: null,
		valueSerialized: {
			type: "js-serialized",
			value: null
		}
	},
	["dataEnv"]: {
		type: "computed",
		definedAtData: null,
		valueSerialized: {
			type: "js-serialized",
			value: null
		}
	},
	["guardEnv"]: {
		type: "computed",
		definedAtData: null,
		valueSerialized: {
			type: "js-serialized",
			value: null
		}
	},
	["onRenderClient"]: {
		type: "standard",
		definedAtData: {
			"filePathToShowToUser": "vike-react/__internal/integration/onRenderClient",
			"fileExportPathToShowToUser": []
		},
		valueSerialized: {
			type: "pointer-import",
			value: onRenderClient
		}
	},
	["Page"]: {
		type: "standard",
		definedAtData: {
			"filePathToShowToUser": "/pages/index/+Page.tsx",
			"fileExportPathToShowToUser": []
		},
		valueSerialized: {
			type: "plus-file",
			exportValues: _Page_exports
		}
	},
	["hydrationCanBeAborted"]: {
		type: "standard",
		definedAtData: {
			"filePathToShowToUser": "vike-react/config",
			"fileExportPathToShowToUser": ["default", "hydrationCanBeAborted"]
		},
		valueSerialized: {
			type: "js-serialized",
			value: true
		}
	},
	["Layout"]: {
		type: "cumulative",
		definedAtData: [{
			"filePathToShowToUser": "/renderer/+Layout.tsx",
			"fileExportPathToShowToUser": []
		}],
		valueSerialized: [{
			type: "plus-file",
			exportValues: _Layout_exports
		}]
	},
	["title"]: {
		type: "standard",
		definedAtData: {
			"filePathToShowToUser": "/renderer/+config.ts",
			"fileExportPathToShowToUser": ["default", "title"]
		},
		valueSerialized: {
			type: "js-serialized",
			value: "Craigory Coppola"
		}
	},
	["Loading"]: {
		type: "standard",
		definedAtData: {
			"filePathToShowToUser": "vike-react/__internal/integration/Loading",
			"fileExportPathToShowToUser": []
		},
		valueSerialized: {
			type: "pointer-import",
			value: Loading_default
		}
	}
};
//#endregion
export { configValuesSerialized };
