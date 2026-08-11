import { n as __exportAll, r as __toESM } from "../chunks/chunk-Sg1e8hzK.js";
import { a as require_react, i as usePageContext, n as require_jsx_runtime, r as onRenderClient, t as Loading_default } from "../chunks/chunk-BNAzBgDM.js";
import { i as Link, n as IoClose, t as _Layout_exports } from "../chunks/chunk-CyOZtUxH.js";
import { t as format } from "../chunks/chunk--bj4_xRV.js";
import { l as blogPosts, o as getBlogUrl } from "../chunks/chunk-V8dgwebH.js";
//#region pages/blog/index/index.page.scss
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
//#endregion
//#region pages/blog/components/blog-filter-bar.module.scss
var blog_filter_bar_module_default = { "filter-table": "_filter-table_1fxh1_1" };
//#endregion
//#region pages/blog/components/blog-filter-bar.tsx
var import_jsx_runtime = require_jsx_runtime();
function SearchFilter({ onSetFilter, filter: { initialValue, id } }) {
	const [state, setState] = (0, import_react.useState)(initialValue ?? "");
	(0, import_react.useEffect)(() => {
		if (state) onSetFilter(id, (p) => p.title.toLowerCase().includes(state.toLowerCase()) || p.description.toLowerCase().includes(state.toLowerCase()));
		else onSetFilter(id, () => true);
	}, [
		state,
		onSetFilter,
		id
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type: "text",
		placeholder: "Search posts...",
		value: state,
		onChange: (e) => setState(e.target.value),
		style: { width: "100%" }
	}) });
}
function TagFilter({ onSetFilter, context, filter }) {
	const [selectedTags, setSelectedTags] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		if (selectedTags.length > 0) onSetFilter(filter.id, (p) => selectedTags.some((tag) => p.tags.includes(tag)));
		else onSetFilter(filter.id, () => true);
	}, [
		selectedTags,
		onSetFilter,
		filter.id
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
		multiple: true,
		value: selectedTags,
		onChange: (e) => {
			setSelectedTags(Array.from(e.target.selectedOptions).map((option) => option.value));
		},
		style: {
			width: "100%",
			minHeight: "60px"
		},
		children: context.allTags.map((tag) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
			value: tag,
			children: tag
		}, tag))
	}) });
}
function CategoryFilter({ onSetFilter, filter: { id } }) {
	const [category, setCategory] = (0, import_react.useState)("all");
	(0, import_react.useEffect)(() => {
		if (category === "technical") onSetFilter(id, (p) => p.tags.includes("technical"));
		else if (category === "non-technical") onSetFilter(id, (p) => p.tags.includes("non-technical"));
		else onSetFilter(id, () => true);
	}, [
		category,
		onSetFilter,
		id
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
		value: category,
		onChange: (e) => setCategory(e.target.value),
		style: { width: "100%" },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
				value: "all",
				children: "All Posts"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
				value: "technical",
				children: "Technical"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
				value: "non-technical",
				children: "Non-Technical"
			})
		]
	}) });
}
var ALL_FILTERS = [
	{
		id: "search",
		component: SearchFilter,
		label: "Search"
	},
	{
		id: "category",
		component: CategoryFilter,
		label: "Category"
	},
	{
		id: "tags",
		component: TagFilter,
		label: "Tags"
	}
];
var DEFAULT_FILTERS = [ALL_FILTERS[1]];
function BlogFilterBar({ onSetFilter, posts }) {
	const allTags = (0, import_react.useMemo)(() => {
		const tagSet = /* @__PURE__ */ new Set();
		posts.forEach((post) => {
			post.tags.forEach((tag) => tagSet.add(tag));
		});
		return Array.from(tagSet).sort();
	}, [posts]);
	const [filterById] = (0, import_react.useState)(/* @__PURE__ */ new Map());
	const [filters, setFilters] = (0, import_react.useState)(new Map(DEFAULT_FILTERS.map((f) => [f.id, f])));
	const [availableFilters, setAvailableFilters] = (0, import_react.useState)([]);
	const setFilterFn = (0, import_react.useCallback)((id, filterFn) => {
		filterById.set(id, filterFn);
		onSetFilter(aggregateFilters(filterById));
	}, [filterById, onSetFilter]);
	(0, import_react.useEffect)(() => {
		setAvailableFilters(ALL_FILTERS.filter((f) => !filters.has(f.id)));
		onSetFilter(aggregateFilters(filterById));
	}, [
		filters,
		onSetFilter,
		filterById
	]);
	function removeFilter(id) {
		filterById.delete(id);
		setFilters((f) => {
			const newFilters = new Map(f);
			newFilters.delete(id);
			return newFilters;
		});
	}
	function addFilter(filter) {
		setFilters((f) => {
			const newFilters = new Map(f);
			newFilters.set(filter.id, filter);
			return newFilters;
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
		className: blog_filter_bar_module_default["filter-table"],
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [Array.from(filters.values()).map((filter) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				style: { width: "120px" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [filter.label, ":"] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(filter.component, {
				onSetFilter: setFilterFn,
				context: {
					posts,
					allTags
				},
				filter
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				style: { width: "40px" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					title: "Remove filter",
					onClick: () => {
						removeFilter(filter.id);
					},
					style: {
						background: "none",
						border: "none",
						cursor: "pointer",
						fontSize: "1.2rem",
						color: "#666"
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IoClose, {})
				})
			})
		] }, filter.id)), availableFilters.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
			colSpan: 3,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				style: { width: "100%" },
				value: "",
				onChange: (e) => {
					const selectedFilterId = e.target.value;
					const selectedFilter = availableFilters.find((filter) => filter.id === selectedFilterId);
					if (selectedFilter) addFilter(selectedFilter);
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "",
					disabled: true,
					children: "Add Filter"
				}), availableFilters.map((filter) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: filter.id,
					children: filter.label
				}, filter.id))]
			})
		}) }) : null] })
	});
}
function aggregateFilters(filters) {
	return (p) => {
		for (const filter of filters.values()) if (!filter(p)) return false;
		return true;
	};
}
//#endregion
//#region pages/blog/index/+Page.tsx
var _Page_exports = /* @__PURE__ */ __exportAll({ Page: () => Page });
function Page() {
	const pageContext = usePageContext();
	const { readingTimes } = pageContext.data || {};
	const pageNumber = tryOr(() => parseInt(pageContext.routeParams?.pageNumber ?? "1"), 1);
	const allPosts = (0, import_react.useMemo)(() => blogPosts.map((post) => ({
		...post,
		readingTimeMinutes: readingTimes?.[post.slug]
	})), [readingTimes]);
	const [filterFn, setFilterFn] = (0, import_react.useState)(null);
	const [filteredPosts, setFilteredPosts] = (0, import_react.useState)([]);
	const filteredPages = (0, import_react.useMemo)(() => {
		const pageSize = 10;
		const result = [];
		for (let i = 0; i < filteredPosts.length; i += pageSize) result.push(filteredPosts.slice(i, i + pageSize));
		return result.length > 0 ? result : [[]];
	}, [filteredPosts]);
	(0, import_react.useEffect)(() => {
		setFilteredPosts(filterFn ? allPosts.filter((p) => filterFn(p)) : allPosts);
	}, [filterFn, allPosts]);
	const onSetFilter = (0, import_react.useCallback)((fn) => {
		setFilterFn(() => fn);
	}, [setFilterFn]);
	const currentPagePosts = filteredPages[pageNumber - 1] || [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "blog-index-header",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Blog" })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlogFilterBar, {
			onSetFilter,
			posts: allPosts
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "posts-container",
			children: currentPagePosts.map((post) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				id: post.slug,
				className: "post-container",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "date",
						children: format(post.publishDate, "MMM dd, yyyy")
					}, post.title + "PUBLISH DATE"),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "title",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							href: getBlogUrl(post) + `?ref=/blog/${pageNumber}`,
							children: post.title
						})
					}, post.title + "TITLE"),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "description",
						children: post.description.split("\n").map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: line }, line))
					}, post.title + "DESCRIPTION"),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "post-meta",
						children: [post.readingTimeMinutes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
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
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "tags",
							children: post.tags.map((tag) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tag",
								children: tag
							}, tag))
						})]
					})
				]
			}, post.slug))
		}),
		filteredPages.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pagination",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pagination-controls",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						href: `/blog/${Math.max(1, pageNumber - 1)}`,
						className: `pagination-button ${pageNumber === 1 ? "disabled" : ""}`,
						"aria-disabled": pageNumber === 1,
						children: "← Previous"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "pagination-info",
						children: [
							"Page ",
							pageNumber,
							" of ",
							filteredPages.length,
							filteredPosts.length !== allPosts.length && ` (${filteredPosts.length} posts matching filter)`
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						href: `/blog/${Math.min(filteredPages.length, pageNumber + 1)}`,
						className: `pagination-button ${pageNumber === filteredPages.length ? "disabled" : ""}`,
						"aria-disabled": pageNumber === filteredPages.length,
						children: "Next →"
					})
				]
			})
		})
	] });
}
function tryOr(fn, or) {
	try {
		return fn();
	} catch {
		return or;
	}
}
//#endregion
//#region \0virtual:vike:page-entry:client:/pages/blog/index
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
			"filePathToShowToUser": "/pages/blog/index/+Page.tsx",
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
