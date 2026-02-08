import { u as usePageContext, j as jsxRuntimeExports, R as React, r as reactExports } from './chunk-BiSMlUrc.js';
/* empty css               */

/*! renderer/Link.tsx [vike:pluginModuleBanner] */
function Link(p) {
  const pageContext = usePageContext();
  const { children, href, ...props } = p;
  const className = [
    props.className,
    pageContext.urlPathname === href && "is-active"
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "a",
    {
      href: "/pr/26" + href,
      ...props,
      className,
      children
    }
  );
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/react-icons@5.5.0_react@19.1.1/node_modules/react-icons/lib/iconContext.mjs [vike:pluginModuleBanner] */
var DefaultContext = {
  color: undefined,
  size: undefined,
  className: undefined,
  style: undefined,
  attr: undefined
};
var IconContext = React.createContext && /*#__PURE__*/React.createContext(DefaultContext);

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/react-icons@5.5.0_react@19.1.1/node_modules/react-icons/lib/iconBase.mjs [vike:pluginModuleBanner] */
var _excluded = ["attr", "size", "title"];
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } } return target; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), true).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function Tree2Element(tree) {
  return tree && tree.map((node, i) => /*#__PURE__*/React.createElement(node.tag, _objectSpread({
    key: i
  }, node.attr), Tree2Element(node.child)));
}
function GenIcon(data) {
  return props => /*#__PURE__*/React.createElement(IconBase, _extends({
    attr: _objectSpread({}, data.attr)
  }, props), Tree2Element(data.child));
}
function IconBase(props) {
  var elem = conf => {
    var {
        attr,
        size,
        title
      } = props,
      svgProps = _objectWithoutProperties(props, _excluded);
    var computedSize = size || conf.size || "1em";
    var className;
    if (conf.className) className = conf.className;
    if (props.className) className = (className ? className + " " : "") + props.className;
    return /*#__PURE__*/React.createElement("svg", _extends({
      stroke: "currentColor",
      fill: "currentColor",
      strokeWidth: "0"
    }, conf.attr, attr, svgProps, {
      className: className,
      style: _objectSpread(_objectSpread({
        color: props.color || conf.color
      }, conf.style), props.style),
      height: computedSize,
      width: computedSize,
      xmlns: "http://www.w3.org/2000/svg"
    }), title && /*#__PURE__*/React.createElement("title", null, title), props.children);
  };
  return IconContext !== undefined ? /*#__PURE__*/React.createElement(IconContext.Consumer, null, conf => elem(conf)) : elem(DefaultContext);
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/react-icons@5.5.0_react@19.1.1/node_modules/react-icons/io5/index.mjs [vike:pluginModuleBanner] */
// THIS FILE IS AUTO GENERATED
function IoClose (props) {
  return GenIcon({"attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"m289.94 256 95-95A24 24 0 0 0 351 127l-95 95-95-95a24 24 0 0 0-34 34l95 95-95 95a24 24 0 1 0 34 34l95-95 95 95a24 24 0 0 0 34-34z"},"child":[]}]})(props);
}

/*! src/shared-components/toaster.tsx [vike:pluginModuleBanner] */
function toast(options) {
  window.dispatchEvent(
    new CustomEvent("toast", {
      detail: options
    })
  );
}
function Toaster() {
  const [toasts, setToasts] = reactExports.useState([]);
  reactExports.useEffect(() => {
    const listener = (e) => {
      const id = performance.now() + Math.random().toFixed(4);
      setToasts((prev) => [
        {
          ...e.detail,
          id
        },
        ...prev
      ]);
      if (e.detail.ephemeral !== false) {
        setTimeout(() => {
          setToasts((prev) => prev.slice(0, -1));
        }, e.detail.duration ?? 3e3);
      }
    };
    window.addEventListener("toast", listener);
    return () => {
      window.removeEventListener("toast", listener);
    };
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      style: {
        position: "fixed",
        bottom: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        margin: 16,
        borderRadius: 8,
        width: "min(100%, 400px)"
      },
      children: toasts.map((toast2, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          style: {
            transition: "bottom 0.3s",
            bottom: `${i * 64}px`,
            right: 0,
            position: "absolute",
            textAlign: "right",
            padding: "1em",
            borderRadius: 8,
            ...((style) => {
              switch (style) {
                case "success":
                  return { backgroundColor: "#282", color: "white" };
                case "error":
                  return { backgroundColor: "#822", color: "white" };
                case "info":
                  return { backgroundColor: "#228", color: "white" };
                default:
                  return {
                    backgroundColor: "#434",
                    color: "white"
                  };
              }
            })(toast2.style),
            opacity: 0.7,
            display: "flex",
            alignItems: "center"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                style: {
                  display: "inline-block",
                  appearance: "none",
                  border: "none",
                  padding: 0,
                  background: "none"
                },
                onClick: () => {
                  setToasts((prev) => prev.filter((t) => t.id !== toast2.id));
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(IoClose, { color: "white", fontSize: "2em" })
              }
            ),
            toast2.content
          ]
        },
        toast2.id
      ))
    }
  );
}

/*! renderer/MobileNav.scss [vike:pluginModuleBanner] */

/*! renderer/MobileNav.tsx [vike:pluginModuleBanner] */
function MobileNav({ children }) {
  const [isOpen, setIsOpen] = reactExports.useState(false);
  const [scrolledDown, setScrolledDown] = reactExports.useState(false);
  const headerRef = reactExports.useRef(null);
  const drawerRef = reactExports.useRef(null);
  const triggerRef = reactExports.useRef(null);
  const pageContext = usePageContext();
  const closeDrawer = () => setIsOpen(false);
  reactExports.useEffect(() => {
    closeDrawer();
  }, [pageContext.urlPathname]);
  reactExports.useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && isOpen) {
        closeDrawer();
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen]);
  reactExports.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);
  reactExports.useEffect(() => {
    if (isOpen) {
      const toggleButton = document.querySelector(".menu-toggle");
      toggleButton?.focus();
    } else if (!isOpen && triggerRef.current) {
      triggerRef.current.focus();
      triggerRef.current = null;
    }
  }, [isOpen]);
  reactExports.useEffect(() => {
    const handleScroll = () => {
      setScrolledDown(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const toggleDrawer = () => {
    if (!isOpen) {
      triggerRef.current = document.activeElement;
    }
    setIsOpen(!isOpen);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mobile-nav-container", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(MobileHeader, { ref: headerRef }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mobile-content", children }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(MobileDrawer, { ref: drawerRef, isOpen }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(MobileOverlay, { isOpen, onClick: closeDrawer }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(MenuToggle, { isOpen, onClick: toggleDrawer, scrolledDown })
  ] });
}
const MobileHeader = React.forwardRef((_, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("header", { ref, className: "mobile-header", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mobile-header-brand" }) }));
MobileHeader.displayName = "MobileHeader";
function MenuToggle({
  isOpen,
  onClick,
  scrolledDown
}) {
  const classes = [
    "menu-toggle",
    isOpen && "menu-toggle--open",
    scrolledDown && !isOpen && "menu-toggle--scrolled"
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      className: classes,
      onClick,
      "aria-label": isOpen ? "Close navigation menu" : "Open navigation menu",
      "aria-expanded": isOpen,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(HamburgerIcon, {})
    }
  );
}
const MobileDrawer = React.forwardRef(
  ({ isOpen }, ref) => {
    const handleKeyDown = (e) => {
      if (e.key !== "Tab" || !ref || typeof ref === "function") return;
      const focusableElements = ref.current?.querySelectorAll(
        'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusableElements || focusableElements.length === 0) return;
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "nav",
      {
        ref,
        className: `mobile-drawer ${isOpen ? "mobile-drawer--open" : ""}`,
        role: "dialog",
        "aria-label": "Navigation menu",
        "aria-hidden": !isOpen,
        onKeyDown: handleKeyDown,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mobile-drawer-nav", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { className: "mobile-navitem", href: "/", children: "Home" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { className: "mobile-navitem", href: "/projects", children: "Projects" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { className: "mobile-navitem", href: "/presentations", children: "Speaking + Presentations" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { className: "mobile-navitem", href: `/blog/1`, children: "Blog" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mobile-drawer-footer", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { className: "mobile-footer-link", href: "/privacy", children: "Privacy Policy" }) })
        ]
      }
    );
  }
);
MobileDrawer.displayName = "MobileDrawer";
function MobileOverlay({
  isOpen,
  onClick
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: `mobile-overlay ${isOpen ? "mobile-overlay--visible" : ""}`,
      onClick,
      "aria-hidden": "true"
    }
  );
}
function HamburgerIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      className: "hamburger-icon",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "line",
          {
            className: "hamburger-line hamburger-line-top",
            x1: "3",
            y1: "6",
            x2: "21",
            y2: "6"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "line",
          {
            className: "hamburger-line hamburger-line-middle",
            x1: "3",
            y1: "12",
            x2: "21",
            y2: "12"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "line",
          {
            className: "hamburger-line hamburger-line-bottom",
            x1: "3",
            y1: "18",
            x2: "21",
            y2: "18"
          }
        )
      ]
    }
  );
}

/*! renderer/PageShell.tsx [vike:pluginModuleBanner] */
function PageShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(React.StrictMode, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout$1, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Sidebar, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sidebar-nav", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { className: "navitem", href: "/", children: "Home" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { className: "navitem", href: "/projects", children: "Projects" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { className: "navitem", href: "/presentations", children: "Speaking + Presentations" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { className: "navitem", href: `/blog/1`, children: "Blog" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sidebar-footer", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { className: "footer-link", href: "/privacy", children: "Privacy Policy" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Content, { children })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(MobileNav, { children }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, {})
  ] });
}
function Layout$1({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "layout", children });
}
function Sidebar({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sidebar", children });
}
function Content({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "content", children });
}

/*! renderer/+Layout.tsx [vike:pluginModuleBanner] */
function Layout({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PageShell, { children });
}

const import3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  Layout
}, Symbol.toStringTag, { value: 'Module' }));

export { GenIcon as G, IoClose as I, Link as L, import3 as i, toast as t };
