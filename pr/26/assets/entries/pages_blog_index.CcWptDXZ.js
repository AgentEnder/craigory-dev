import { r as reactExports, j as jsxRuntimeExports, u as usePageContext, i as import5, o as onRenderClient } from '../chunks/chunk-BiSMlUrc.js';
import { b as blogPosts, g as getBlogUrl } from '../chunks/chunk-BVSxiK3S.js';
import { I as IoClose, L as Link, i as import3 } from '../chunks/chunk-Cj1Pzm3x.js';
import { f as format } from '../chunks/chunk-DI4sGg5h.js';
/* empty css                       */
import '../chunks/chunk-C_jR_L7K.js';
/* empty css                       */

/*! pages/blog/index/index.page.scss [vike:pluginModuleBanner] */

/*! pages/blog/components/blog-filter-bar.module.scss [vike:pluginModuleBanner] */
const styles = {
	"filter-table": "_filter-table_1fxh1_1"
};

/*! pages/blog/components/blog-filter-bar.tsx [vike:pluginModuleBanner] */
function SearchFilter({
  onSetFilter,
  filter: { initialValue, id }
}) {
  const [state, setState] = reactExports.useState(initialValue ?? "");
  reactExports.useEffect(() => {
    if (state) {
      onSetFilter(
        id,
        (p) => p.title.toLowerCase().includes(state.toLowerCase()) || p.description.toLowerCase().includes(state.toLowerCase())
      );
    } else {
      onSetFilter(id, () => true);
    }
  }, [state, onSetFilter, id]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "input",
    {
      type: "text",
      placeholder: "Search posts...",
      value: state,
      onChange: (e) => setState(e.target.value),
      style: { width: "100%" }
    }
  ) });
}
function TagFilter({
  onSetFilter,
  context,
  filter
}) {
  const [selectedTags, setSelectedTags] = reactExports.useState([]);
  reactExports.useEffect(() => {
    if (selectedTags.length > 0) {
      onSetFilter(
        filter.id,
        (p) => selectedTags.some((tag) => p.tags.includes(tag))
      );
    } else {
      onSetFilter(filter.id, () => true);
    }
  }, [selectedTags, onSetFilter, filter.id]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "select",
    {
      multiple: true,
      value: selectedTags,
      onChange: (e) => {
        const selected = Array.from(e.target.selectedOptions).map(
          (option) => option.value
        );
        setSelectedTags(selected);
      },
      style: { width: "100%", minHeight: "60px" },
      children: context.allTags.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: tag, children: tag }, tag))
    }
  ) });
}
function CategoryFilter({
  onSetFilter,
  filter: { id }
}) {
  const [category, setCategory] = reactExports.useState("all");
  reactExports.useEffect(() => {
    if (category === "technical") {
      onSetFilter(id, (p) => p.tags.includes("technical"));
    } else if (category === "non-technical") {
      onSetFilter(id, (p) => p.tags.includes("non-technical"));
    } else {
      onSetFilter(id, () => true);
    }
  }, [category, onSetFilter, id]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "select",
    {
      value: category,
      onChange: (e) => setCategory(e.target.value),
      style: { width: "100%" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "All Posts" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "technical", children: "Technical" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "non-technical", children: "Non-Technical" })
      ]
    }
  ) });
}
const ALL_FILTERS = [
  { id: "search", component: SearchFilter, label: "Search" },
  { id: "category", component: CategoryFilter, label: "Category" },
  { id: "tags", component: TagFilter, label: "Tags" }
];
const DEFAULT_FILTERS = [ALL_FILTERS[1]];
function BlogFilterBar({
  onSetFilter,
  posts
}) {
  const allTags = reactExports.useMemo(
    () => {
      const tagSet = /* @__PURE__ */ new Set();
      posts.forEach((post) => {
        post.tags.forEach((tag) => tagSet.add(tag));
      });
      return Array.from(tagSet).sort();
    },
    [posts]
  );
  const [filterById] = reactExports.useState(/* @__PURE__ */ new Map());
  const [filters, setFilters] = reactExports.useState(
    new Map(DEFAULT_FILTERS.map((f) => [f.id, f]))
  );
  const [availableFilters, setAvailableFilters] = reactExports.useState([]);
  const setFilterFn = reactExports.useCallback(
    (id, filterFn) => {
      filterById.set(id, filterFn);
      onSetFilter(aggregateFilters(filterById));
    },
    [filterById, onSetFilter]
  );
  reactExports.useEffect(() => {
    setAvailableFilters(ALL_FILTERS.filter((f) => !filters.has(f.id)));
    onSetFilter(aggregateFilters(filterById));
  }, [filters, onSetFilter, filterById]);
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
  return /* @__PURE__ */ jsxRuntimeExports.jsx("table", { className: styles["filter-table"], children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
    Array.from(filters.values()).map((filter) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { width: "120px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
        filter.label,
        ":"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        filter.component,
        {
          onSetFilter: setFilterFn,
          context: { posts, allTags },
          filter
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { width: "40px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
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
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(IoClose, {})
        }
      ) })
    ] }, filter.id)),
    availableFilters.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 3, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "select",
      {
        style: { width: "100%" },
        value: "",
        onChange: (e) => {
          const selectedFilterId = e.target.value;
          const selectedFilter = availableFilters.find(
            (filter) => filter.id === selectedFilterId
          );
          if (selectedFilter) {
            addFilter(selectedFilter);
          }
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", disabled: true, children: "Add Filter" }),
          availableFilters.map((filter) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: filter.id, children: filter.label }, filter.id))
        ]
      }
    ) }) }) : null
  ] }) });
}
function aggregateFilters(filters) {
  return (p) => {
    for (const filter of filters.values()) {
      if (!filter(p)) {
        return false;
      }
    }
    return true;
  };
}

/*! pages/blog/index/+Page.tsx [vike:pluginModuleBanner] */
function Page() {
  const pageContext = usePageContext();
  const hookData = pageContext.data;
  const { readingTimes } = hookData || {};
  const pageNumber = tryOr(
    () => parseInt(pageContext.routeParams?.pageNumber ?? "1"),
    1
  );
  const allPosts = reactExports.useMemo(
    () => blogPosts.map((post) => ({
      ...post,
      readingTimeMinutes: readingTimes?.[post.slug]
    })),
    [readingTimes]
  );
  const [filterFn, setFilterFn] = reactExports.useState(null);
  const [filteredPosts, setFilteredPosts] = reactExports.useState([]);
  const filteredPages = reactExports.useMemo(() => {
    const pageSize = 10;
    const result = [];
    for (let i = 0; i < filteredPosts.length; i += pageSize) {
      result.push(filteredPosts.slice(i, i + pageSize));
    }
    return result.length > 0 ? result : [[]];
  }, [filteredPosts]);
  reactExports.useEffect(() => {
    setFilteredPosts(
      filterFn ? allPosts.filter((p) => filterFn(p)) : allPosts
    );
  }, [filterFn, allPosts]);
  const onSetFilter = reactExports.useCallback(
    (fn) => {
      setFilterFn(() => fn);
    },
    [setFilterFn]
  );
  const currentPagePosts = filteredPages[pageNumber - 1] || [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "blog-index-header", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: "Blog" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      BlogFilterBar,
      {
        onSetFilter,
        posts: allPosts
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "posts-container", children: currentPagePosts.map((post) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: post.slug, className: "post-container", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "date", children: format(post.publishDate, "MMM dd, yyyy") }, post.title + "PUBLISH DATE"),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "title", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { href: getBlogUrl(post) + `?ref=/blog/${pageNumber}`, children: post.title }) }, post.title + "TITLE"),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "description", children: post.description.split("\n").map((line) => /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: line }, line)) }, post.title + "DESCRIPTION"),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "post-meta", children: [
        post.readingTimeMinutes && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "reading-time", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { role: "img", "aria-label": "reading time", children: "📖" }),
          " ",
          post.readingTimeMinutes,
          " min read"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tags", children: post.tags.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tag", children: tag }, tag)) })
      ] })
    ] }, post.slug)) }),
    filteredPages.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pagination", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pagination-controls", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          href: `/blog/${Math.max(1, pageNumber - 1)}`,
          className: `pagination-button ${pageNumber === 1 ? "disabled" : ""}`,
          "aria-disabled": pageNumber === 1,
          children: "← Previous"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "pagination-info", children: [
        "Page ",
        pageNumber,
        " of ",
        filteredPages.length,
        filteredPosts.length !== allPosts.length && ` (${filteredPosts.length} posts matching filter)`
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          href: `/blog/${Math.min(filteredPages.length, pageNumber + 1)}`,
          className: `pagination-button ${pageNumber === filteredPages.length ? "disabled" : ""}`,
          "aria-disabled": pageNumber === filteredPages.length,
          children: "Next →"
        }
      )
    ] }) })
  ] });
}
function tryOr(fn, or) {
  try {
    return fn();
  } catch {
    return or;
  }
}

const import2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  Page
}, Symbol.toStringTag, { value: 'Module' }));

/*! virtual:vike:page-entry:client:/pages/blog/index [vike:pluginModuleBanner] */
const configValuesSerialized = {
  ["serverOnlyHooks"]: {
    type: "computed",
    definedAtData: null,
    valueSerialized: {
      type: "js-serialized",
      value: true,
    },
  },
  ["isClientRuntimeLoaded"]: {
    type: "computed",
    definedAtData: null,
    valueSerialized: {
      type: "js-serialized",
      value: true,
    },
  },
  ["onBeforeRenderEnv"]: {
    type: "computed",
    definedAtData: null,
    valueSerialized: {
      type: "js-serialized",
      value: null,
    },
  },
  ["dataEnv"]: {
    type: "computed",
    definedAtData: null,
    valueSerialized: {
      type: "js-serialized",
      value: {"server":true},
    },
  },
  ["onRenderClient"]: {
    type: "standard",
    definedAtData: {"filePathToShowToUser":"vike-react/__internal/integration/onRenderClient","fileExportPathToShowToUser":[]},
    valueSerialized: {
      type: "pointer-import",
      value: onRenderClient,
    },
  },
  ["Page"]: {
    type: "standard",
    definedAtData: {"filePathToShowToUser":"/pages/blog/index/+Page.tsx","fileExportPathToShowToUser":[]},
    valueSerialized: {
      type: "plus-file",
      exportValues: import2,
    },
  },
  ["hydrationCanBeAborted"]: {
    type: "standard",
    definedAtData: {"filePathToShowToUser":"vike-react/config","fileExportPathToShowToUser":["default","hydrationCanBeAborted"]},
    valueSerialized: {
      type: "js-serialized",
      value: true,
    },
  },
  ["Layout"]: {
    type: "cumulative",
    definedAtData: [{"filePathToShowToUser":"/renderer/+Layout.tsx","fileExportPathToShowToUser":[]}],
    valueSerialized: [ {
      type: "plus-file",
      exportValues: import3,
    }, ],
  },
  ["title"]: {
    type: "standard",
    definedAtData: {"filePathToShowToUser":"/renderer/+config.ts","fileExportPathToShowToUser":["default","title"]},
    valueSerialized: {
      type: "js-serialized",
      value: "Craigory Coppola",
    },
  },
  ["Loading"]: {
    type: "standard",
    definedAtData: {"filePathToShowToUser":"vike-react/__internal/integration/Loading","fileExportPathToShowToUser":[]},
    valueSerialized: {
      type: "pointer-import",
      value: import5,
    },
  },
};

export { configValuesSerialized };
