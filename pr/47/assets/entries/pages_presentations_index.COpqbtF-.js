import { n as __exportAll, r as __toESM } from "../chunks/chunk-Sg1e8hzK.js";
import { a as require_react, n as require_jsx_runtime, r as onRenderClient, t as Loading_default } from "../chunks/chunk-BNAzBgDM.js";
import { i as Link, t as _Layout_exports } from "../chunks/chunk-CyOZtUxH.js";
import { n as PRESENTATIONS } from "../chunks/chunk-D93QnQ0y.js";
import { n as RelatedContent, t as ContentMarker } from "../chunks/chunk-Zjlt27lt.js";
import { t as format } from "../chunks/chunk--bj4_xRV.js";
//#region pages/presentations/index/+Page.tsx
var _Page_exports = /* @__PURE__ */ __exportAll({ Page: () => Page });
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	const hash = useLocationHash();
	(0, import_react.useEffect)(() => {
		if (hash) {
			const active = document.querySelector(".presentation-container.active");
			if (active) active.classList.remove("active");
			document.getElementById(hash)?.classList.add("active");
		}
	}, [hash]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "presentations-container",
		children: Object.values(PRESENTATIONS).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			style: {
				display: "flex",
				flexDirection: "row",
				gap: "1em",
				alignItems: "top"
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				id: p.slug,
				className: `presentation-container`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						style: { margin: 0 },
						className: "title",
						children: p.title
					}, p.title + p.presentedAt + "TITLE"),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "location",
						children: p.presentedAt
					}, p.title + p.presentedAt + "PRESENTEDAT"),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "date",
						children: format(p.presentedOn, "MMM dd, yyyy")
					}, p.title + p.presentedAt + "PRESENTEDON"),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "description",
						children: [p.description.split("\n").map((line, lineIdx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: line }, lineIdx)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "links",
							children: [
								p.mdUrl || p.htmlUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									href: "/presentations/view/" + p.slug,
									children: "View Slides"
								}) : null,
								p.recordingUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: p.recordingUrl,
									target: "_blank",
									rel: "noreferrer",
									children: "View Recording"
								}) : null,
								p.extraLinks ? p.extraLinks.map((link, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: link.url,
									target: "_blank",
									rel: "noreferrer",
									children: link.title
								}, link.title)) : null
							]
						})]
					}, p.title + p.presentedAt + "DESCRIPTION"),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RelatedContent, {
						type: "presentation",
						slug: p.slug,
						limit: 2,
						className: "presentation-related"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
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
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContentMarker, {})
			})]
		}, p.slug))
	});
}
function useLocationHash() {
	const [hash, setHash] = (0, import_react.useState)(globalThis?.window?.location?.hash);
	const window = globalThis?.window;
	if (!window) return null;
	window.addEventListener("hashchange", () => setHash(window.location.hash));
	return hash.slice(1);
}
//#endregion
//#region \0virtual:vike:page-entry:client:/pages/presentations/index
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
			"filePathToShowToUser": "/pages/presentations/index/+Page.tsx",
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
