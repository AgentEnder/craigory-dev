import { n as __exportAll } from "../chunks/chunk-Sg1e8hzK.js";
import { n as require_jsx_runtime, r as onRenderClient, t as Loading_default } from "../chunks/chunk-BNAzBgDM.js";
import { t as _Layout_exports } from "../chunks/chunk-CyOZtUxH.js";
import { r as FaExternalLinkAlt, s as useData } from "../chunks/chunk-DSa7az7o.js";
//#region pages/tools/+Page.tsx
var _Page_exports = /* @__PURE__ */ __exportAll({ Page: () => Page });
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	const { tools } = useData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Web Dev Tools" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "tools-intro",
			children: "A selection of web based tools that may come in handy during development or otherwise."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "tools-grid",
			children: tools.map((tool) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToolCard, { tool }, tool.repo))
		})
	] });
}
function ToolCard({ tool }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "tool-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "tool-card-name",
				children: "metadata" in tool && tool.metadata.name ? tool.metadata.name : tool.repo
			}),
			tool.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "tool-card-description",
				children: tool.description
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "tool-card-actions",
				children: [tool.deployment && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: tool.deployment,
					className: "tool-card-launch",
					target: "_blank",
					rel: "noreferrer",
					children: ["Launch", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FaExternalLinkAlt, {})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: tool.url,
					className: "tool-card-source",
					target: "_blank",
					rel: "noreferrer",
					children: "Source"
				})]
			})
		]
	});
}
//#endregion
//#region \0virtual:vike:page-entry:client:/pages/tools
var configValuesSerialized = {
	["hasServerOnlyHook"]: {
		type: "computed",
		definedAtData: null,
		valueSerialized: {
			type: "js-serialized",
			value: true
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
			value: { "server": true }
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
			"filePathToShowToUser": "/pages/tools/+Page.tsx",
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
