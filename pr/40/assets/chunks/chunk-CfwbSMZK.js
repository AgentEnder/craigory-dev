import { u as usePageContext, j as jsxRuntimeExports, R as React } from './chunk-BhkQSdlV.js';
/* empty css               */

/*! pages/(legal)/legal.scss [vike:pluginModuleBanner] */

/*! pages/(legal)/+Layout.clear.tsx [vike:pluginModuleBanner] */
function Layout({ children }) {
  const pageContext = usePageContext();
  const pathname = pageContext.urlPathname;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(React.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "legal-container", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "legal-card", children: [
    children,
    /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "legal-nav", "aria-label": "Legal pages", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/privacy",
          "aria-current": pathname === "/privacy" ? "page" : void 0,
          children: "Privacy Policy"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/data-deletion",
          "aria-current": pathname === "/data-deletion" ? "page" : void 0,
          children: "Data Deletion"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "legal-footer", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "/", className: "back-link", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "svg",
        {
          width: "20",
          height: "20",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M19 12H5M12 19l-7-7 7-7" })
        }
      ),
      "Return to craigory.dev"
    ] }) })
  ] }) }) });
}

const import3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: Layout
}, Symbol.toStringTag, { value: 'Module' }));

export { import3 as i };
