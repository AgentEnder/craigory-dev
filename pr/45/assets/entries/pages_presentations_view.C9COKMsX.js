import { n as __exportAll, r as __toESM } from "../chunks/chunk-Sg1e8hzK.js";
import { a as require_react, i as usePageContext, n as require_jsx_runtime, r as onRenderClient, t as Loading_default } from "../chunks/chunk-bRLaqz_4.js";
import { n as PRESENTATIONS, t as ViewPresentation } from "../chunks/chunk-DbMyuWyP.js";
//#region pages/presentations/view/+Page.tsx
var _Page_exports = /* @__PURE__ */ __exportAll({ Page: () => Page });
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	const context = usePageContext();
	const [presentation, setPresentation] = (0, import_react.useState)();
	(0, import_react.useEffect)(() => {
		setPresentation(context?.routeParams?.["presentation"]);
	}, [context]);
	return presentation ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ViewPresentation, { presentationSlug: presentation }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, {});
}
//#endregion
//#region pages/presentations/view/+Layout.clear.tsx
var _Layout_clear_exports = /* @__PURE__ */ __exportAll({ default: () => Layout });
function Layout({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.StrictMode, { children });
}
//#endregion
//#region pages/presentations/view/+title.ts
var _title_exports = /* @__PURE__ */ __exportAll({ default: () => _title_default });
var _title_default = (pageContext) => {
	return PRESENTATIONS[pageContext.routeParams?.presentation].title;
};
//#endregion
//#region \0virtual:vike:page-entry:client:/pages/presentations/view
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
			"filePathToShowToUser": "/pages/presentations/view/+Page.tsx",
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
			"filePathToShowToUser": "/pages/presentations/view/+Layout.clear.tsx",
			"fileExportPathToShowToUser": []
		}],
		valueSerialized: [{
			type: "plus-file",
			exportValues: _Layout_clear_exports
		}]
	},
	["title"]: {
		type: "standard",
		definedAtData: {
			"filePathToShowToUser": "/pages/presentations/view/+title.ts",
			"fileExportPathToShowToUser": []
		},
		valueSerialized: {
			type: "plus-file",
			exportValues: _title_exports
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
