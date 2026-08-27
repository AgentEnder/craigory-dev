import { n as __exportAll, r as __toESM } from "./chunk-Sg1e8hzK.js";
import { a as require_react, i as usePageContext, n as require_jsx_runtime } from "./chunk-BQxnj1Uy.js";
/* empty css               */
import { t as __vitePreload } from "./chunk-CwGKFURj.js";
//#region renderer/Link.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
/**
* An `<a>` that prefixes the deploy's base path and marks itself active on the
* current route. Remaining anchor attributes pass straight through, so callers
* can set things like `aria-hidden` on a decorative link.
*/
function Link({ href, className, children, ...rest }) {
	const classes = [className, usePageContext().urlPathname === href && "is-active"].filter(Boolean).join(" ");
	const base = "/pr/51";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		href: base === "/" ? href : base + href,
		...rest,
		className: classes,
		children
	});
}
//#endregion
//#region ../../node_modules/.pnpm/react-icons@5.5.0_react@19.1.1/node_modules/react-icons/lib/iconContext.mjs
var DefaultContext = {
	color: void 0,
	size: void 0,
	className: void 0,
	style: void 0,
	attr: void 0
};
var IconContext = import_react.createContext && /* @__PURE__ */ import_react.createContext(DefaultContext);
//#endregion
//#region ../../node_modules/.pnpm/react-icons@5.5.0_react@19.1.1/node_modules/react-icons/lib/iconBase.mjs
var _excluded = [
	"attr",
	"size",
	"title"
];
function _objectWithoutProperties(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose(source, excluded) {
	if (source == null) return {};
	var target = {};
	for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) {
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
function _extends() {
	_extends = Object.assign ? Object.assign.bind() : function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends.apply(this, arguments);
}
function ownKeys(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r) {
			return Object.getOwnPropertyDescriptor(e, r).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}
function _objectSpread(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys(Object(t), !0).forEach(function(r) {
			_defineProperty(e, r, t[r]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r) {
			Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
		});
	}
	return e;
}
function _defineProperty(obj, key, value) {
	key = _toPropertyKey(key);
	if (key in obj) Object.defineProperty(obj, key, {
		value,
		enumerable: true,
		configurable: true,
		writable: true
	});
	else obj[key] = value;
	return obj;
}
function _toPropertyKey(t) {
	var i = _toPrimitive(t, "string");
	return "symbol" == typeof i ? i : i + "";
}
function _toPrimitive(t, r) {
	if ("object" != typeof t || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != typeof i) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
function Tree2Element(tree) {
	return tree && tree.map((node, i) => /* @__PURE__ */ import_react.createElement(node.tag, _objectSpread({ key: i }, node.attr), Tree2Element(node.child)));
}
function GenIcon(data) {
	return (props) => /* @__PURE__ */ import_react.createElement(IconBase, _extends({ attr: _objectSpread({}, data.attr) }, props), Tree2Element(data.child));
}
function IconBase(props) {
	var elem = (conf) => {
		var { attr, size, title } = props, svgProps = _objectWithoutProperties(props, _excluded);
		var computedSize = size || conf.size || "1em";
		var className;
		if (conf.className) className = conf.className;
		if (props.className) className = (className ? className + " " : "") + props.className;
		return /* @__PURE__ */ import_react.createElement("svg", _extends({
			stroke: "currentColor",
			fill: "currentColor",
			strokeWidth: "0"
		}, conf.attr, attr, svgProps, {
			className,
			style: _objectSpread(_objectSpread({ color: props.color || conf.color }, conf.style), props.style),
			height: computedSize,
			width: computedSize,
			xmlns: "http://www.w3.org/2000/svg"
		}), title && /* @__PURE__ */ import_react.createElement("title", null, title), props.children);
	};
	return IconContext !== void 0 ? /* @__PURE__ */ import_react.createElement(IconContext.Consumer, null, (conf) => elem(conf)) : elem(DefaultContext);
}
//#endregion
//#region ../../node_modules/.pnpm/react-icons@5.5.0_react@19.1.1/node_modules/react-icons/io5/index.mjs
function IoClose(props) {
	return GenIcon({
		"tag": "svg",
		"attr": { "viewBox": "0 0 512 512" },
		"child": [{
			"tag": "path",
			"attr": { "d": "m289.94 256 95-95A24 24 0 0 0 351 127l-95 95-95-95a24 24 0 0 0-34 34l95 95-95 95a24 24 0 1 0 34 34l95-95 95 95a24 24 0 0 0 34-34z" },
			"child": []
		}]
	})(props);
}
//#endregion
//#region src/shared-components/toaster.tsx
function Toaster() {
	const [toasts, setToasts] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		const listener = (e) => {
			const id = performance.now() + Math.random().toFixed(4);
			setToasts((prev) => [{
				...e.detail,
				id
			}, ...prev]);
			if (e.detail.ephemeral !== false) setTimeout(() => {
				setToasts((prev) => prev.slice(0, -1));
			}, e.detail.duration ?? 3e3);
		};
		window.addEventListener("toast", listener);
		return () => {
			window.removeEventListener("toast", listener);
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
		children: toasts.map((toast, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
						case "success": return {
							backgroundColor: "#282",
							color: "white"
						};
						case "error": return {
							backgroundColor: "#822",
							color: "white"
						};
						case "info": return {
							backgroundColor: "#228",
							color: "white"
						};
						default: return {
							backgroundColor: "#434",
							color: "white"
						};
					}
				})(toast.style),
				opacity: .7,
				display: "flex",
				alignItems: "center"
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				style: {
					display: "inline-block",
					appearance: "none",
					border: "none",
					padding: 0,
					background: "none"
				},
				onClick: () => {
					setToasts((prev) => prev.filter((t) => t.id !== toast.id));
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IoClose, {
					color: "white",
					fontSize: "2em"
				})
			}), toast.content]
		}, toast.id))
	});
}
var spotlight_search_module_default = {
	trigger: "_trigger_1gee5_2",
	triggerLabel: "_triggerLabel_1gee5_23",
	triggerHint: "_triggerHint_1gee5_28",
	icon: "_icon_1gee5_37",
	overlay: "_overlay_1gee5_42",
	panel: "_panel_1gee5_53",
	inputRow: "_inputRow_1gee5_65",
	input: "_input_1gee5_65",
	close: "_close_1gee5_82",
	results: "_results_1gee5_96",
	message: "_message_1gee5_101",
	group: "_group_1gee5_112",
	groupHeading: "_groupHeading_1gee5_116",
	result: "_result_1gee5_96",
	selected: "_selected_1gee5_136",
	subResult: "_subResult_1gee5_141",
	resultTitle: "_resultTitle_1gee5_144",
	resultExcerpt: "_resultExcerpt_1gee5_163"
};
//#endregion
//#region src/shared-components/spotlight-context.ts
var SpotlightContext = (0, import_react.createContext)({ open: () => void 0 });
function useSpotlight() {
	return (0, import_react.useContext)(SpotlightContext);
}
//#endregion
//#region src/shared-components/spotlight-search.tsx
var BASE_URL = "/pr/51/";
var pagefindPromise = null;
function loadPagefind() {
	if (!pagefindPromise) pagefindPromise = (async () => {
		const root = BASE_URL.replace(/\/$/, "");
		// @vite-ignore: this file is emitted by the search-index step after the
		const api = await __vitePreload(() => import(
			/* @vite-ignore */
			`${root}/pagefind/pagefind.js`
), []);
		await api.options({ baseUrl: BASE_URL });
		return api;
	})();
	return pagefindPromise;
}
var KIND_ORDER = [
	"Blog",
	"Presentations",
	"Projects",
	"Tools",
	"Pages"
];
/**
* Results are classified by URL rather than a Pagefind filter so that crawled
* pages and the synthetic presentation records are grouped by the same rule.
*/
function kindOf(url) {
	const path = url.startsWith(BASE_URL) ? url.slice(6) : url;
	if (path.startsWith("/blog")) return "Blog";
	if (path.startsWith("/presentations")) return "Presentations";
	if (path.startsWith("/projects")) return "Projects";
	if (path.startsWith("/tools")) return "Tools";
	return "Pages";
}
var MAX_PAGES = 12;
var MAX_SUB_RESULTS = 2;
function toEntries(document_) {
	const title = document_.meta?.title?.trim() || document_.url;
	const kind = kindOf(document_.url);
	const entries = [{
		key: document_.url,
		kind,
		title,
		url: document_.url,
		excerpt: document_.excerpt,
		isSub: false
	}];
	for (const sub of (document_.sub_results ?? []).slice(0, MAX_SUB_RESULTS)) {
		if (!sub.anchor?.id || sub.url === document_.url) continue;
		entries.push({
			key: sub.url,
			kind,
			title: sub.title,
			url: sub.url,
			excerpt: sub.excerpt,
			isSub: true
		});
	}
	return entries;
}
function SpotlightProvider({ children }) {
	const [isOpen, setIsOpen] = (0, import_react.useState)(false);
	const triggerRef = (0, import_react.useRef)(null);
	const open = (0, import_react.useCallback)(() => {
		triggerRef.current = document.activeElement;
		setIsOpen(true);
	}, []);
	const close = (0, import_react.useCallback)(() => {
		setIsOpen(false);
		triggerRef.current?.focus();
		triggerRef.current = null;
	}, []);
	(0, import_react.useEffect)(() => {
		const onKeyDown = (event) => {
			if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
				event.preventDefault();
				if (isOpen) close();
				else open();
			}
		};
		document.addEventListener("keydown", onKeyDown);
		return () => document.removeEventListener("keydown", onKeyDown);
	}, [
		isOpen,
		open,
		close
	]);
	(0, import_react.useEffect)(() => {
		if (!isOpen) return;
		const previous = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = previous;
		};
	}, [isOpen]);
	const value = (0, import_react.useMemo)(() => ({ open }), [open]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SpotlightContext.Provider, {
		value,
		children: [children, isOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpotlightDialog, { onClose: close })]
	});
}
function SpotlightTrigger({ className }) {
	const { open } = useSpotlight();
	const [shortcut, setShortcut] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		setShortcut(/mac|iphone|ipad/i.test(navigator.userAgent) ? "⌘K" : "Ctrl K");
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		className: [spotlight_search_module_default.trigger, className].filter(Boolean).join(" "),
		onClick: open,
		"aria-label": "Search the site",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchIcon, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: spotlight_search_module_default.triggerLabel,
				children: "Search"
			}),
			shortcut && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
				className: spotlight_search_module_default.triggerHint,
				children: shortcut
			})
		]
	});
}
function SpotlightDialog({ onClose }) {
	const [query, setQuery] = (0, import_react.useState)("");
	const [entries, setEntries] = (0, import_react.useState)([]);
	const [status, setStatus] = (0, import_react.useState)("idle");
	const [selected, setSelected] = (0, import_react.useState)(0);
	const inputRef = (0, import_react.useRef)(null);
	const listRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		inputRef.current?.focus();
	}, []);
	(0, import_react.useEffect)(() => {
		const trimmed = query.trim();
		if (!trimmed) {
			setEntries([]);
			setStatus("idle");
			return;
		}
		setStatus("searching");
		let cancelled = false;
		const timer = setTimeout(async () => {
			try {
				const { results } = await (await loadPagefind()).search(trimmed);
				const documents = await Promise.all(results.slice(0, MAX_PAGES).map((result) => result.data()));
				if (cancelled) return;
				setEntries(documents.flatMap(toEntries));
				setSelected(0);
				setStatus("ready");
			} catch {
				if (cancelled) return;
				setStatus("unavailable");
			}
		}, 150);
		return () => {
			cancelled = true;
			clearTimeout(timer);
		};
	}, [query]);
	const groups = (0, import_react.useMemo)(() => {
		const byKind = /* @__PURE__ */ new Map();
		for (const entry of entries) {
			const bucket = byKind.get(entry.kind);
			if (bucket) bucket.push(entry);
			else byKind.set(entry.kind, [entry]);
		}
		return KIND_ORDER.flatMap((kind) => {
			const kindEntries = byKind.get(kind);
			return kindEntries ? [{
				kind,
				entries: kindEntries
			}] : [];
		});
	}, [entries]);
	const ordered = (0, import_react.useMemo)(() => groups.flatMap((group) => group.entries), [groups]);
	const go = (0, import_react.useCallback)((entry) => {
		if (entry) window.location.href = entry.url;
	}, []);
	(0, import_react.useEffect)(() => {
		const onEscape = (event) => {
			if (event.key !== "Escape") return;
			event.preventDefault();
			onClose();
		};
		document.addEventListener("keydown", onEscape);
		return () => document.removeEventListener("keydown", onEscape);
	}, [onClose]);
	const onKeyDown = (event) => {
		if (event.key === "ArrowDown") {
			event.preventDefault();
			setSelected((i) => ordered.length ? (i + 1) % ordered.length : 0);
			return;
		}
		if (event.key === "ArrowUp") {
			event.preventDefault();
			setSelected((i) => ordered.length ? (i - 1 + ordered.length) % ordered.length : 0);
			return;
		}
		if (event.key === "Enter") {
			event.preventDefault();
			go(ordered[selected]);
		}
	};
	(0, import_react.useEffect)(() => {
		listRef.current?.querySelector("[aria-selected=\"true\"]")?.scrollIntoView({ block: "nearest" });
	}, [selected]);
	let index = -1;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: spotlight_search_module_default.overlay,
		onClick: onClose,
		role: "presentation",
		"data-pagefind-ignore": true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: spotlight_search_module_default.panel,
			role: "dialog",
			"aria-modal": "true",
			"aria-label": "Search the site",
			onClick: (event) => event.stopPropagation(),
			onKeyDown,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: spotlight_search_module_default.inputRow,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchIcon, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: inputRef,
						className: spotlight_search_module_default.input,
						type: "text",
						value: query,
						placeholder: "Search posts, talks, and projects…",
						"aria-label": "Search query",
						onChange: (event) => setQuery(event.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: spotlight_search_module_default.close,
						onClick: onClose,
						"aria-label": "Close search",
						children: "Esc"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: spotlight_search_module_default.results,
				ref: listRef,
				role: "listbox",
				children: [
					status === "unavailable" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: spotlight_search_module_default.message,
						children: [
							"Search is unavailable — the index is generated at build time. Run",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "nx build craigory-dev" }),
							" and use the built site."
						]
					}),
					status === "ready" && !ordered.length && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: spotlight_search_module_default.message,
						children: [
							"No matches for “",
							query.trim(),
							"”."
						]
					}),
					status === "idle" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: spotlight_search_module_default.message,
						children: "Search across blog posts, talk slides, and projects."
					}),
					groups.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: spotlight_search_module_default.group,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: spotlight_search_module_default.groupHeading,
							children: group.kind
						}), group.entries.map((entry) => {
							index += 1;
							const position = index;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: entry.url,
								role: "option",
								"aria-selected": position === selected,
								className: [
									spotlight_search_module_default.result,
									entry.isSub ? spotlight_search_module_default.subResult : "",
									position === selected ? spotlight_search_module_default.selected : ""
								].filter(Boolean).join(" "),
								onMouseEnter: () => setSelected(position),
								onClick: (event) => {
									event.preventDefault();
									go(entry);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: spotlight_search_module_default.resultTitle,
									children: entry.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: spotlight_search_module_default.resultExcerpt,
									dangerouslySetInnerHTML: { __html: entry.excerpt }
								})]
							}, entry.key);
						})]
					}, group.kind))
				]
			})]
		})
	});
}
function SearchIcon() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		className: spotlight_search_module_default.icon,
		width: "18",
		height: "18",
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		"aria-hidden": "true",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: "11",
			cy: "11",
			r: "7"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
			x1: "16.5",
			y1: "16.5",
			x2: "21",
			y2: "21"
		})]
	});
}
//#endregion
//#region renderer/MobileNav.tsx
function MobileNav() {
	const [isOpen, setIsOpen] = (0, import_react.useState)(false);
	const [scrolledDown, setScrolledDown] = (0, import_react.useState)(false);
	const headerRef = (0, import_react.useRef)(null);
	const drawerRef = (0, import_react.useRef)(null);
	const triggerRef = (0, import_react.useRef)(null);
	const pageContext = usePageContext();
	const closeDrawer = () => setIsOpen(false);
	(0, import_react.useEffect)(() => {
		closeDrawer();
	}, [pageContext.urlPathname]);
	(0, import_react.useEffect)(() => {
		const handleEsc = (e) => {
			if (e.key === "Escape" && isOpen) closeDrawer();
		};
		document.addEventListener("keydown", handleEsc);
		return () => document.removeEventListener("keydown", handleEsc);
	}, [isOpen]);
	(0, import_react.useEffect)(() => {
		if (isOpen) document.body.style.overflow = "hidden";
		else document.body.style.overflow = "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [isOpen]);
	(0, import_react.useEffect)(() => {
		if (isOpen) document.querySelector(".menu-toggle")?.focus();
		else if (!isOpen && triggerRef.current) {
			triggerRef.current.focus();
			triggerRef.current = null;
		}
	}, [isOpen]);
	(0, import_react.useEffect)(() => {
		const handleScroll = () => {
			setScrolledDown(window.scrollY > 60);
		};
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);
	const toggleDrawer = () => {
		if (!isOpen) triggerRef.current = document.activeElement;
		setIsOpen(!isOpen);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mobile-nav-container",
		"data-pagefind-ignore": true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileHeader, { ref: headerRef }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileDrawer, {
				ref: drawerRef,
				isOpen
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileOverlay, {
				isOpen,
				onClick: closeDrawer
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuToggle, {
				isOpen,
				onClick: toggleDrawer,
				scrolledDown
			})
		]
	});
}
var MobileHeader = import_react.forwardRef((_, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
	ref,
	className: "mobile-header",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mobile-header-brand" })
}));
MobileHeader.displayName = "MobileHeader";
function MenuToggle({ isOpen, onClick, scrolledDown }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		className: [
			"menu-toggle",
			isOpen && "menu-toggle--open",
			scrolledDown && !isOpen && "menu-toggle--scrolled"
		].filter(Boolean).join(" "),
		onClick,
		"aria-label": isOpen ? "Close navigation menu" : "Open navigation menu",
		"aria-expanded": isOpen,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HamburgerIcon, {})
	});
}
var MobileDrawer = import_react.forwardRef(({ isOpen }, ref) => {
	const handleKeyDown = (e) => {
		if (e.key !== "Tab" || !ref || typeof ref === "function") return;
		const focusableElements = ref.current?.querySelectorAll("button, a[href], input, select, textarea, [tabindex]:not([tabindex=\"-1\"])");
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
		ref,
		className: `mobile-drawer ${isOpen ? "mobile-drawer--open" : ""}`,
		role: "dialog",
		"aria-label": "Navigation menu",
		"aria-hidden": !isOpen,
		onKeyDown: handleKeyDown,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mobile-drawer-nav",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpotlightTrigger, { className: "mobile-search-trigger" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					className: "mobile-navitem",
					href: "/",
					children: "Home"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					className: "mobile-navitem",
					href: "/projects",
					children: "Projects"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					className: "mobile-navitem",
					href: "/tools",
					children: "Tools"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					className: "mobile-navitem",
					href: "/presentations",
					children: "Speaking + Presentations"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					className: "mobile-navitem",
					href: `/blog/1`,
					children: "Blog"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mobile-drawer-footer",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				className: "mobile-footer-link",
				href: "/privacy",
				children: "Privacy Policy"
			})
		})]
	});
});
MobileDrawer.displayName = "MobileDrawer";
function MobileOverlay({ isOpen, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `mobile-overlay ${isOpen ? "mobile-overlay--visible" : ""}`,
		onClick,
		"aria-hidden": "true"
	});
}
function HamburgerIcon() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				className: "hamburger-line hamburger-line-top",
				x1: "3",
				y1: "6",
				x2: "21",
				y2: "6"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				className: "hamburger-line hamburger-line-middle",
				x1: "3",
				y1: "12",
				x2: "21",
				y2: "12"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				className: "hamburger-line hamburger-line-bottom",
				x1: "3",
				y1: "18",
				x2: "21",
				y2: "18"
			})
		]
	});
}
//#endregion
//#region renderer/PageShell.tsx
function PageShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.StrictMode, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SpotlightProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Layout$1, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sidebar, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "sidebar-nav",
			"data-pagefind-ignore": true,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpotlightTrigger, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					className: "navitem",
					href: "/",
					children: "Home"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					className: "navitem",
					href: "/projects",
					children: "Projects"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					className: "navitem",
					href: "/tools",
					children: "Tools"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					className: "navitem",
					href: "/presentations",
					children: "Speaking + Presentations"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					className: "navitem",
					href: `/blog/1`,
					children: "Blog"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "sidebar-footer",
			"data-pagefind-ignore": true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				className: "footer-link",
				href: "/privacy",
				children: "Privacy Policy"
			})
		})] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileNav, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content, { children })
	] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {})] }) });
}
function Layout$1({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "layout",
		children
	});
}
function Sidebar({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "sidebar",
		children
	});
}
function Content({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "content",
		children
	});
}
//#endregion
//#region renderer/+Layout.tsx
var _Layout_exports = /* @__PURE__ */ __exportAll({ Layout: () => Layout });
function Layout({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageShell, { children });
}
//#endregion
export { Link as i, IoClose as n, GenIcon as r, _Layout_exports as t };
