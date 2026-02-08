import { r as reactExports, j as jsxRuntimeExports, u as usePageContext, R as React, i as import5, o as onRenderClient } from '../chunks/chunk-BiSMlUrc.js';
import { _ as __vitePreload } from '../chunks/chunk-DxuxlC8X.js';
import { P as PRESENTATIONS } from '../chunks/chunk-CGzni5O_.js';
/* empty css                       */
import '../chunks/chunk-C_jR_L7K.js';

/*! vite/dynamic-import-helper.js [vike:pluginModuleBanner] */
const __variableDynamicImportRuntimeHelper = (glob$1, path$13, segs) => {
	const v = glob$1[path$13];
	if (v) return typeof v === "function" ? v() : Promise.resolve(v);
	return new Promise((_, reject) => {
		(typeof queueMicrotask === "function" ? queueMicrotask : setTimeout)(reject.bind(null, /* @__PURE__ */ new Error("Unknown variable dynamic import: " + path$13 + (path$13.split("/").length !== segs ? ". Note that variables only represent file names one level deep." : ""))));
	});
};

/*! /home/runner/work/craigory-dev/craigory-dev/libs/presentations/src/lib/post-remark-load.js?raw [vike:pluginModuleBanner] */
const afterRemarkLoaded = "this.initialized = false;\n\n// eslint-disable-next-line no-undef\nremark\n  // eslint-disable-next-line no-undef\n  .create({ source: `${md}`, ratio: '16:9' })\n  .on('showSlide', function (slide) {\n    if (this.initialized) return;\n    this.initialized = true;\n    const observer = new IntersectionObserver(\n      (entries) => {\n        entries.forEach((entry) => {\n          if (entry.target instanceof HTMLVideoElement) {\n            if (entry.isIntersecting) {\n              entry.target.play();\n              entry.target.currentTime = 0;\n            } else if (!entry.isIntersecting) {\n              entry.target.pause();\n            }\n          } else if (entry.target instanceof HTMLImageElement) {\n            if (entry.isIntersecting && entry.target.src.endsWith('.gif')) {\n              entry.target.src = entry.target.getAttribute('src');\n            }\n          }\n        });\n      },\n      {\n        rootMargin: '0px',\n        threshold: 0.95,\n        root: document.querySelector('.remark-visible'),\n      }\n    );\n    document.querySelectorAll('video,img').forEach((el) => {\n      observer.observe(el);\n    });\n  });\n";

/*! /home/runner/work/craigory-dev/craigory-dev/libs/presentations/src/lib/view-presentation.tsx [vike:pluginModuleBanner] */
function ViewPresentation(props) {
  const [remarkLoaded, setRemarkedLoaded] = reactExports.useState(false);
  const [md, setMd] = reactExports.useState();
  reactExports.useEffect(() => {
    const p = PRESENTATIONS[props.presentationSlug];
    if (p?.mdUrl) {
      (async function() {
        try {
          const mdModule = await __variableDynamicImportRuntimeHelper(/* @__PURE__ */ Object.assign({ "../presentation-data/devup-2023-benchmarking/slides.md": () => __vitePreload(() => import('../chunks/chunk-CSpamAYG.js'), true               ? [] : void 0), "../presentation-data/devup-2023-full-stack-type-safety/slides.md": () => __vitePreload(() => import('../chunks/chunk-DVyGWm9r.js'), true               ? [] : void 0), "../presentation-data/kcdc-2025-monorepo-nx/slides.md": () => __vitePreload(() => import('../chunks/chunk-BQDwH1cp.js'), true               ? [] : void 0), "../presentation-data/nx-conf-2023-inference/slides.md": () => __vitePreload(() => import('../chunks/chunk-Wbt_mNra.js'), true               ? [] : void 0), "../presentation-data/that-conf-tx-2024-compartmentalization/slides.md": () => __vitePreload(() => import('../chunks/chunk-XmBiV9vi.js'), true               ? [] : void 0), "../presentation-data/that-conf-wi-2023-benchmarking/slides.md": () => __vitePreload(() => import('../chunks/chunk-Dljx_v6L.js'), true               ? [] : void 0), "../presentation-data/that-conf-wi-2024-spaghetti/slides.md": () => __vitePreload(() => import('../chunks/chunk-Dvk0aApf.js'), true               ? [] : void 0) }), `../presentation-data/${p.slug}/${p.mdUrl}.md`, 4);
          const res = mdModule.default;
          console.log("Raw markdown:", res);
          const normalized = res.replace(/`/g, "\\`").replace(/\${/g, "\\${");
          console.log("Normalized markdown:", normalized);
          setMd(normalized);
        } catch (error) {
          console.error("Failed to load markdown:", error);
        }
      })();
    }
    const existingStyle = document.getElementById("presentation-style");
    if (existingStyle) {
      existingStyle.remove();
    }
    if (p?.scssUrl) {
      const scssFiles = /* @__PURE__ */ Object.assign({
        "../presentation-data/devup-2023-benchmarking/slides.scss": () => __vitePreload(() => import('../chunks/chunk-BN9qjEC0.js'), true               ? [] : void 0),
        "../presentation-data/devup-2023-full-stack-type-safety/slides.scss": () => __vitePreload(() => import('../chunks/chunk-CmyvLjBY.js'), true               ? [] : void 0),
        "../presentation-data/kcdc-2025-monorepo-nx/slides.scss": () => __vitePreload(() => import('../chunks/chunk-D8FKZ3wX.js'), true               ? [] : void 0),
        "../presentation-data/nx-conf-2023-inference/slides.scss": () => __vitePreload(() => import('../chunks/chunk-C_ZMCkYB.js'), true               ? [] : void 0)
      });
      scssFiles[`../presentation-data/${p.slug}/${p.scssUrl}.scss`]().then(
        (scss) => {
          const style = document.createElement("style");
          style.id = "presentation-style";
          style.innerHTML = scss.default;
          document.head.appendChild(style);
        }
      );
    }
    if (p?.htmlUrl) {
      (async function() {
        const html = await __variableDynamicImportRuntimeHelper(/* @__PURE__ */ Object.assign({}), `../presentation-data/${p.slug}/${p.htmlUrl}.html`, 4);
        document.body.innerHTML = html.default;
      })();
    }
  }, [props.presentationSlug]);
  useScript(
    { url: "https://remarkjs.com/downloads/remark-latest.min.js" },
    () => {
      console.log("remark script loaded");
      setRemarkedLoaded(true);
    }
  );
  useScript(
    {
      // eslint-disable-next-line no-template-curly-in-string
      body: afterRemarkLoaded.replace("`${md}`", `\`${md}\``),
      waitFor: [remarkLoaded, md]
    },
    () => {
      console.log("afterRemarkLoaded executed");
    }
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, {});
}
function useScript({ url, body, waitFor }, onReady) {
  reactExports.useEffect(() => {
    const cleanupTasks = [];
    console.log("waitFor:", waitFor);
    if (waitFor === void 0 || waitFor.every((w) => !!w)) {
      console.log("Inserting script:", { url, body, waitFor });
      const script = document.createElement("script");
      script.className = "dynamic-script";
      if (url) {
        console.log("Setting up external script:", url);
        script.src = url;
        if (onReady) {
          script.onload = () => {
            console.log("External script loaded:", url);
            onReady();
          };
          script.onerror = (error) => {
            console.error("Failed to load external script:", url, error);
          };
        }
        console.log("Script element created with src:", script.src);
      } else if (body) {
        console.log("Setting up inline script, length:", body.length);
        const escapedBody = body.replace(/<\/script>/gi, "<\\/script>");
        script.innerHTML = escapedBody;
      }
      console.log("Appending script to body...");
      document.body.appendChild(script);
      if (body && onReady) {
        setTimeout(onReady, 0);
      }
      cleanupTasks.push(() => {
        script.remove();
      });
    }
    return () => {
      for (const task of cleanupTasks) {
        task();
      }
    };
  }, [body, url, onReady, waitFor]);
}

/*! pages/presentations/view/+Page.tsx [vike:pluginModuleBanner] */
function Page() {
  const context = usePageContext();
  const [presentation, setPresentation] = reactExports.useState();
  reactExports.useEffect(() => {
    setPresentation(context?.routeParams?.["presentation"]);
  }, [context]);
  return presentation ? /* @__PURE__ */ jsxRuntimeExports.jsx(ViewPresentation, { presentationSlug: presentation }) : (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, {})
  );
}

const import2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	Page
}, Symbol.toStringTag, { value: 'Module' }));

/*! pages/presentations/view/+Layout.clear.tsx [vike:pluginModuleBanner] */
function Layout({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(React.StrictMode, { children });
}

const import3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: Layout
}, Symbol.toStringTag, { value: 'Module' }));

/*! pages/presentations/view/+title.ts [vike:pluginModuleBanner] */
const _title = (pageContext) => {
  const presentation = PRESENTATIONS[pageContext.routeParams?.presentation];
  return presentation.title;
};

const import4 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: _title
}, Symbol.toStringTag, { value: 'Module' }));

/*! virtual:vike:page-entry:client:/pages/presentations/view [vike:pluginModuleBanner] */
const configValuesSerialized = {
  ["serverOnlyHooks"]: {
    type: "computed",
    definedAtData: null,
    valueSerialized: {
      type: "js-serialized",
      value: false,
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
      value: null,
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
    definedAtData: {"filePathToShowToUser":"/pages/presentations/view/+Page.tsx","fileExportPathToShowToUser":[]},
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
    definedAtData: [{"filePathToShowToUser":"/pages/presentations/view/+Layout.clear.tsx","fileExportPathToShowToUser":[]}],
    valueSerialized: [ {
      type: "plus-file",
      exportValues: import3,
    }, ],
  },
  ["title"]: {
    type: "standard",
    definedAtData: {"filePathToShowToUser":"/pages/presentations/view/+title.ts","fileExportPathToShowToUser":[]},
    valueSerialized: {
      type: "plus-file",
      exportValues: import4,
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
