import { j as jsxRuntimeExports, u as usePageContext, r as reactExports, s as slugMap, L as Link, i as import1, o as onRenderClient, a as import4$1 } from '../chunks/chunk-D5GMF5o4.js';
import { C as ContentMarker } from '../chunks/chunk-R6vrXNZx.js';

function CodeWrapper({
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column"
      },
      children: [
        props.filename ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "code-tabs",
            children: props.filename ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "filename",
                children: props.filename
              }
            ) : null
          }
        ) : null,
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "pre",
          {
            style: {
              marginTop: 0
            },
            className: `code-wrapper ${props.filename ? "has-filename" : ""}`,
            children
          }
        )
      ]
    }
  );
}

function Page() {
  const pageContext = usePageContext();
  const blogPost = pageContext.routeParams?.slug;
  const [returnLink, setReturnLink] = reactExports.useState();
  reactExports.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) {
      setReturnLink(ref);
    }
  }, []);
  if (!blogPost) {
    throw new Error();
  }
  const data = slugMap[blogPost];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    returnLink ? /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { href: returnLink, children: "Return to previous page" }) : null,
    data.mdx({
      components: {
        pre: CodeWrapper,
        Anchor: ContentMarker
      }
    }),
    returnLink ? /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { href: returnLink, children: "Return to previous page" }) : null
  ] });
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
    definedAtData: {"filePathToShowToUser":"/pages/blog/view/+Page.tsx","fileExportPathToShowToUser":[]},
    valueSerialized: {
      type: "plus-file",
      exportValues: import4,
    },
  },
};

export { configValuesSerialized };
