import { u as usePageContext, j as jsxRuntimeExports, p as pages, L as Link, i as import1, o as onRenderClient, a as import4$1 } from '../chunks/chunk-DobrybWg.js';
import { f as format } from '../chunks/chunk-CfwY3ly5.js';

function formatDateString(date) {
  return date.toISOString().replace(/T.*/, "");
}

function Page() {
  const pageContext = usePageContext();
  const page = tryOr(
    () => parseInt(pageContext.routeParams?.pageNumber ?? "1"),
    1
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: "Blog" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "posts-container", children: pages[page - 1].map((post) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: "row",
          gap: "1em",
          alignItems: "top"
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: post.slug, className: `post-container`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "h2",
            {
              style: {
                margin: 0
              },
              className: "title",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  href: `/blog/${formatDateString(post.publishDate)}/${post.slug}?ref=/blog/${page}`,
                  children: post.title
                }
              )
            },
            post.title + "TITLE"
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "date", children: format(post.publishDate, "MMM dd, yyyy") }, post.title + "PUBLISH DATE"),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "description", children: post.description.split("\n").map((line) => /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: line }, line)) }, post.title + "DESCRIPTION")
        ] })
      },
      post.slug
    )) })
  ] });
}
function tryOr(fn, or) {
  try {
    return fn();
  } catch {
    return or;
  }
}

const import4 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  Page
}, Symbol.toStringTag, { value: 'Module' }));

const configValuesSerialized = {
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
      value: null,
    },
  },
  ["Loading"]: {
    type: "standard",
    definedAtData: {"filePathToShowToUser":"vike-react/components/Loading","fileExportPathToShowToUser":[]},
    valueSerialized: {
      type: "pointer-import",
      value: import1,
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
  ["onRenderClient"]: {
    type: "standard",
    definedAtData: {"filePathToShowToUser":"vike-react/renderer/onRenderClient","fileExportPathToShowToUser":[]},
    valueSerialized: {
      type: "pointer-import",
      value: onRenderClient,
    },
  },
  ["Layout"]: {
    type: "cumulative",
    definedAtData: [{"filePathToShowToUser":"/renderer/+Layout.tsx","fileExportPathToShowToUser":[]}],
    valueSerialized: [ {
      type: "plus-file",
      exportValues: import4$1,
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
  ["Page"]: {
    type: "standard",
    definedAtData: {"filePathToShowToUser":"/pages/blog/index/+Page.tsx","fileExportPathToShowToUser":[]},
    valueSerialized: {
      type: "plus-file",
      exportValues: import4,
    },
  },
};

export { configValuesSerialized };
