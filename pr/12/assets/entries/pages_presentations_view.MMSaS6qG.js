import { r as reactExports, j as jsxRuntimeExports, u as usePageContext, i as import1, o as onRenderClient, a as import4$1 } from '../chunks/chunk-B2i7gW2R.js';
import { _ as __vitePreload } from '../chunks/chunk-CDQ-4LUT.js';
import { P as PRESENTATIONS } from '../chunks/chunk-GvhJ67bf.js';

const __variableDynamicImportRuntimeHelper = (glob, path, segs) => {
  const v = glob[path];
  if (v) {
    return typeof v === "function" ? v() : Promise.resolve(v);
  }
  return new Promise((_, reject) => {
    (typeof queueMicrotask === "function" ? queueMicrotask : setTimeout)(
      reject.bind(
        null,
        new Error(
          "Unknown variable dynamic import: " + path + (path.split("/").length !== segs ? ". Note that variables only represent file names one level deep." : "")
        )
      )
    );
  });
};

const afterRemarkLoaded = "let initialized = false;\n\n// eslint-disable-next-line no-undef\nremark\n  // eslint-disable-next-line no-undef\n  .create({ source: `${md}`, ratio: '16:9' })\n  .on('showSlide', function (slide) {\n    if (initialized) return;\n    initialized = true;\n    const observer = new IntersectionObserver(\n      (entries) => {\n        entries.forEach((entry) => {\n          if (entry.target instanceof HTMLVideoElement) {\n            if (entry.isIntersecting) {\n              entry.target.play();\n              entry.target.currentTime = 0;\n            } else if (!entry.isIntersecting) {\n              entry.target.pause();\n            }\n          } else if (entry.target instanceof HTMLImageElement) {\n            if (entry.isIntersecting && entry.target.src.endsWith('.gif')) {\n              entry.target.src = entry.target.getAttribute('src');\n            }\n          }\n        });\n      },\n      {\n        rootMargin: '0px',\n        threshold: 0.95,\n        root: document.querySelector('.remark-visible'),\n      }\n    );\n    document.querySelectorAll('video,img').forEach((el) => {\n      observer.observe(el);\n    });\n  });\n";

function ViewPresentation(props) {
  const [remarkLoaded, setRemarkedLoaded] = reactExports.useState(false);
  const [md, setMd] = reactExports.useState();
  reactExports.useEffect(() => {
    const p = PRESENTATIONS[props.presentationSlug];
    if (p?.mdUrl) {
      (async function() {
        const res = await __variableDynamicImportRuntimeHelper(/* @__PURE__ */ Object.assign({ "../presentation-data/devup-2023-benchmarking/slides.md": () => __vitePreload(() => import('../chunks/chunk-SkogHJHt.js'), true ? [] : void 0), "../presentation-data/devup-2023-full-stack-type-safety/slides.md": () => __vitePreload(() => import('../chunks/chunk-DcDhWAZH.js'), true ? [] : void 0), "../presentation-data/nx-conf-2023-inference/slides.md": () => __vitePreload(() => import('../chunks/chunk-DEsnqntt.js'), true ? [] : void 0), "../presentation-data/that-conf-tx-2024-compartmentalization/slides.md": () => __vitePreload(() => import('../chunks/chunk-C_kFgUu6.js'), true ? [] : void 0), "../presentation-data/that-conf-wi-2023-benchmarking/slides.md": () => __vitePreload(() => import('../chunks/chunk-1DFQNHAJ.js'), true ? [] : void 0) }), `../presentation-data/${p.slug}/${p.mdUrl}.md`, 4).then((m) => m.default);
        setMd(res.replace(/`/g, "\\`").replace(/\${/g, "\\${"));
      })();
    }
    const existingStyle = document.getElementById("presentation-style");
    if (existingStyle) {
      existingStyle.remove();
    }
    if (p?.scssUrl) {
      const scssFiles = /* @__PURE__ */ Object.assign({
        "../presentation-data/devup-2023-benchmarking/slides.scss": () => __vitePreload(() => import('../chunks/chunk-CVcZSDuk.js'), true ? [] : void 0),
        "../presentation-data/devup-2023-full-stack-type-safety/slides.scss": () => __vitePreload(() => import('../chunks/chunk-Z64xCmXM.js'), true ? [] : void 0),
        "../presentation-data/nx-conf-2023-inference/slides.scss": () => __vitePreload(() => import('../chunks/chunk-DUWdUvRJ.js'), true ? [] : void 0)
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
      setRemarkedLoaded(true);
    }
  );
  useScript({
    // eslint-disable-next-line no-template-curly-in-string
    body: afterRemarkLoaded.replace("`${md}`", `\`${md}\``),
    waitFor: !!(remarkLoaded && md)
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, {});
}
function useScript({ url, body, waitFor }, onReady) {
  reactExports.useEffect(() => {
    const cleanupTasks = [];
    if (waitFor === void 0 || waitFor) {
      const script = document.createElement("script");
      if (url) {
        script.src = url;
      } else if (body) {
        script.innerHTML = body;
      }
      document.body.appendChild(script);
      if (onReady) {
        script.onload = onReady;
      }
      cleanupTasks.push(() => {
        document.body.removeChild(script);
      });
    }
    return () => {
      for (const task of cleanupTasks) {
        task();
      }
    };
  }, [body, url, onReady, waitFor]);
}

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
  ["Page"]: {
    type: "standard",
    definedAtData: {"filePathToShowToUser":"/pages/presentations/view/+Page.tsx","fileExportPathToShowToUser":[]},
    valueSerialized: {
      type: "plus-file",
      exportValues: import4,
    },
  },
  ["title"]: {
    type: "standard",
    definedAtData: {"filePathToShowToUser":"/pages/presentations/view/+config.ts","fileExportPathToShowToUser":["default","title"]},
    valueSerialized: {
      type: "js-serialized",
      value: "Craigory Coppola - View Presentation",
    },
  },
};

export { configValuesSerialized };
