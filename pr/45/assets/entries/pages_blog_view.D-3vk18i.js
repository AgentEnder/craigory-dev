import { n as __exportAll, r as __toESM } from "../chunks/chunk-Sg1e8hzK.js";
import { a as require_react, i as usePageContext, n as require_jsx_runtime, r as onRenderClient, t as Loading_default } from "../chunks/chunk-bRLaqz_4.js";
import { a as Link, t as _Layout_exports } from "../chunks/chunk-D36Vu01V.js";
import { n as RelatedContent, t as ContentMarker } from "../chunks/chunk-Ca6cIYUC.js";
import { t as format } from "../chunks/chunk--bj4_xRV.js";
import { a as PostContext, c as Cite, i as LinkToPost, n as Tab, r as Tabs, s as CodeWrapper, t as TikiTable, u as slugMap } from "../chunks/chunk-BnRSX21H.js";
//#region pages/blog/view/BlogPostEnhanced.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
function BlogPostEnhanced({ children }) {
	const [progress, setProgress] = (0, import_react.useState)(0);
	const [showScrollTop, setShowScrollTop] = (0, import_react.useState)(false);
	const [toc, setToc] = (0, import_react.useState)([]);
	const [activeHeading, setActiveHeading] = (0, import_react.useState)("");
	const contentRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const handleScroll = () => {
			const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
			const scrollPosition = window.scrollY;
			const progress = scrollPosition / scrollHeight * 100;
			setProgress(Math.min(100, Math.max(0, progress)));
			setShowScrollTop(scrollPosition > 300);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);
	(0, import_react.useEffect)(() => {
		if (contentRef.current) {
			const headings = contentRef.current.querySelectorAll("h2, h3, h4");
			const tocItems = [];
			headings.forEach((heading) => {
				const id = heading.id || heading.textContent?.toLowerCase().replace(/\s+/g, "-") || "";
				if (!heading.id) heading.id = id;
				const headingClone = heading.cloneNode(true);
				const hashLink = headingClone.querySelector(".heading-link");
				if (hashLink) hashLink.remove();
				const cleanText = headingClone.textContent?.trim() || "";
				tocItems.push({
					id,
					text: cleanText,
					level: parseInt(heading.tagName[1])
				});
			});
			setToc(tocItems);
		}
	}, [children]);
	(0, import_react.useEffect)(() => {
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) setActiveHeading(entry.target.id);
			});
		}, { rootMargin: "-80px 0px -80% 0px" });
		const headings = contentRef.current?.querySelectorAll("h2, h3, h4");
		headings?.forEach((heading) => observer.observe(heading));
		return () => {
			headings?.forEach((heading) => observer.unobserve(heading));
		};
	}, [toc]);
	const scrollToTop = (0, import_react.useCallback)(() => {
		window.scrollTo({
			top: 0,
			behavior: "smooth"
		});
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "reading-progress",
			style: { transform: `scaleX(${progress / 100})` }
		}),
		toc.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "toc-container",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Table of Contents" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: toc.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				style: { marginLeft: `${(item.level - 2) * 1}rem` },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: `#${item.id}`,
					className: activeHeading === item.id ? "active" : "",
					onClick: (e) => {
						e.preventDefault();
						document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
					},
					children: item.text
				})
			}, item.id)) })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "blog-post-container",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "blog-content",
				ref: contentRef,
				children
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			className: `scroll-to-top ${showScrollTop ? "visible" : ""}`,
			onClick: scrollToTop,
			"aria-label": "Scroll to top",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M18 15l-6-6-6 6" })
			})
		})
	] });
}
//#endregion
//#region pages/blog/view/BlogH1.tsx
function BlogH1({ children }) {
	const post = (0, import_react.useContext)(PostContext);
	const headerRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (headerRef.current) headerRef.current.classList.add("blog-header");
	}, []);
	if (!post) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		ref: headerRef,
		className: "blog-header",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "meta-info",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "publish-date",
				children: format(post.publishDate, "MMMM dd, yyyy")
			}), post.readingTimeMinutes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "reading-time",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						role: "img",
						"aria-label": "reading time",
						children: "📖"
					}),
					" ",
					post.readingTimeMinutes,
					" min read"
				]
			})]
		})]
	});
}
//#endregion
//#region src/utils/post-theming.ts
function getPostThemeClass(post) {
	if (post.tags.includes("tiki")) return "theme-tiki";
	if (post.tags.includes("technical")) return "theme-technical";
	if (post.tags.includes("review")) return "theme-review";
	return "theme-default";
}
//#endregion
//#region pages/blog/view/+Page.tsx
var _Page_exports = /* @__PURE__ */ __exportAll({ Page: () => Page });
function Page() {
	const pageContext = usePageContext();
	const { readingTimeMinutes } = pageContext.data || {};
	const blogPost = pageContext.routeParams?.slug;
	const [returnLink, setReturnLink] = (0, import_react.useState)();
	(0, import_react.useEffect)(() => {
		const ref = new URLSearchParams(window.location.search).get("ref");
		if (ref) setReturnLink(ref);
	}, []);
	if (!blogPost) throw new Error();
	const basePost = slugMap[blogPost];
	const postData = readingTimeMinutes ? {
		...basePost,
		readingTimeMinutes
	} : basePost;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		returnLink ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "return-link-top",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				href: returnLink,
				children: "← Return to previous page"
			})
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PostContext.Provider, {
			value: postData,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `blog-post-theme ${getPostThemeClass(postData)}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlogPostEnhanced, { children: postData.mdx({ components: {
					h1: BlogH1,
					pre: CodeWrapper,
					Anchor: ContentMarker,
					Cite,
					LinkToPost,
					Tab,
					Tabs,
					TikiTable
				} }) })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RelatedContent, {
				type: "blog",
				slug: blogPost
			})]
		}),
		returnLink ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "return-link-bottom",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				href: returnLink,
				children: "← Return to previous page"
			})
		}) : null
	] });
}
//#endregion
//#region pages/blog/view/+title.ts
var _title_exports = /* @__PURE__ */ __exportAll({ default: () => _title_default });
var _title_default = (pageContext) => {
	return slugMap[pageContext.routeParams?.slug].title;
};
//#endregion
//#region \0virtual:vike:page-entry:client:/pages/blog/view
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
			"filePathToShowToUser": "/pages/blog/view/+Page.tsx",
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
			"filePathToShowToUser": "/pages/blog/view/+title.ts",
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
