import { n as __exportAll, r as __toESM } from "./chunk-Sg1e8hzK.js";
import { a as require_react, i as usePageContext, n as require_jsx_runtime } from "./chunk-Bla4Nnmu.js";
/* empty css               */
//#region pages/(legal)/legal.scss
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
//#endregion
//#region pages/(legal)/+Layout.clear.tsx
var _Layout_clear_exports = /* @__PURE__ */ __exportAll({ default: () => Layout });
var import_jsx_runtime = require_jsx_runtime();
function Layout({ children }) {
	const pathname = usePageContext().urlPathname;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.StrictMode, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "legal-container",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "legal-card",
			children: [
				children,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "legal-nav",
					"aria-label": "Legal pages",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/privacy",
						"aria-current": pathname === "/privacy" ? "page" : void 0,
						children: "Privacy Policy"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/data-deletion",
						"aria-current": pathname === "/data-deletion" ? "page" : void 0,
						children: "Data Deletion"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "legal-footer",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: "/",
						className: "back-link",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
							width: "20",
							height: "20",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "2",
							strokeLinecap: "round",
							strokeLinejoin: "round",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M19 12H5M12 19l-7-7 7-7" })
						}), "Return to craigory.dev"]
					})
				})
			]
		})
	}) });
}
//#endregion
export { _Layout_clear_exports as t };
