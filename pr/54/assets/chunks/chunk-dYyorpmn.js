import { i as usePageContext, n as require_jsx_runtime } from "./chunk-B3ASU73i.js";
//#region renderer/Link.tsx
var import_jsx_runtime = require_jsx_runtime();
/**
* An `<a>` that prefixes the deploy's base path and marks itself active on the
* current route. Remaining anchor attributes pass straight through, so callers
* can set things like `aria-hidden` on a decorative link.
*/
function Link({ href, className, children, ...rest }) {
	const classes = [className, usePageContext().urlPathname === href && "is-active"].filter(Boolean).join(" ");
	const base = "/pr/54";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		href: base === "/" ? href : base + href,
		...rest,
		className: classes,
		children
	});
}
//#endregion
export { Link as t };
