import { n as __exportAll } from "../chunks/chunk-Sg1e8hzK.js";
import { n as require_jsx_runtime, r as onRenderClient, t as Loading_default } from "../chunks/chunk-Bla4Nnmu.js";
import { t as _Layout_exports } from "../chunks/chunk-Dmktz08c.js";
//#region pages/_error/+Page.tsx
var _Page_exports = /* @__PURE__ */ __exportAll({ Page: () => Page });
var import_jsx_runtime = require_jsx_runtime();
function Page({ is404, abortReason, abortStatusCode }) {
	if (is404) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "404 Page Not Found" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "This page could not be found." })] });
	else return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "500 Internal Error" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Something went wrong." }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: JSON.stringify(abortReason) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: abortStatusCode })
	] });
}
//#endregion
//#region \0virtual:vike:page-entry:client:/pages/_error
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
			"filePathToShowToUser": "/pages/_error/+Page.tsx",
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
