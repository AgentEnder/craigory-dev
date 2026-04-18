const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/entries/pages_-legal-_data-deletion.ipNnlCHM.js","assets/chunks/chunk-CTuRrTE3.js","assets/chunks/chunk-BhW2AVEc.js","assets/static/style-5774bf13.BcWtY8Ol.css","assets/chunks/chunk-DPdSi0aC.js","assets/static/Layout.COIA3UtX.css","assets/static/PageShell.CJ_TIreb.css","assets/entries/pages_-legal-_privacy.13KboE8A.js","assets/entries/pages_error.CYujZh5b.js","assets/chunks/chunk-BpziaHqb.js","assets/static/Layout.CM1M0hot.css","assets/entries/pages_index.CwLTg_6t.js","assets/entries/pages_presentations_index.sOoTSlzO.js","assets/chunks/chunk-CGzni5O_.js","assets/static/view-presentation.B8dU2LIX.css","assets/chunks/chunk-BYnjURgY.js","assets/chunks/chunk-DI4sGg5h.js","assets/static/index.n5f9Fz8I.css","assets/entries/pages_projects.zgWkdLLd.js","assets/chunks/chunk-B83k2ARV.js","assets/static/projects.C8GaCyB6.css","assets/entries/pages_tools.CHdJjpT3.js","assets/static/tools.D0XBDd9l.css","assets/entries/pages_blog_index.Dl-jWyrs.js","assets/chunks/chunk-Bxn-dSA1.js","assets/static/index.nOSVi-_M.css","assets/entries/pages_blog_view.B4So06TZ.js","assets/static/view.Bt-1NU10.css","assets/entries/pages_presentations_view.rbqYppGq.js","assets/chunks/chunk-zhDXCwJd.js"])))=>i.map(i=>d[i]);
import { o as objectAssign, m as assertPropertyGetters, w as getPageContextPublicShared, W as getHookFromPageContext, a as assert, b as assertUsage, X as execHookSingle, C as getGlobalContextClientInternalShared, E as updateType, D as createPageContextShared, F as createPageContextObject, Y as assertServerRouting, S as getCurrentUrl, Z as assertSingleInstance_onClientEntryServerRouting, _ as setVirtualFileExportsGlobalEntry, $ as getPageContextSerializedInHtml, Q as loadPageConfigsLazyClientSide, a0 as execHook } from '../chunks/chunk-BhW2AVEc.js';
import { _ as __vitePreload } from '../chunks/chunk-zhDXCwJd.js';

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/client/shared/getPageContextPublicClientShared.js [vike:pluginModuleBanner] */
function getPageContextPublicClientShared(pageContext) {
    // TO-DO/soon/proxy: use proxy
    const Page = pageContext.config?.Page ||
        // TO-DO/next-major-release: remove
        pageContext.exports?.Page;
    objectAssign(pageContext, { Page });
    // TO-DO/next-major-release: after we remove supportVueReactiviy() we can call this later inside the agnostic getPageContextPublicShared()
    assertPropertyGetters(pageContext);
    // TO-DO/next-major-release: remove
    // - Requires https://github.com/vikejs/vike-vue/issues/198
    // - Last time I tried to remove it (https://github.com/vikejs/vike/commit/705fd23598d9d69bf46a52c8550216cd7117ce71) the tests were failing as expected: only the Vue integrations that used shallowReactive() failed.
    supportVueReactiviy(pageContext);
    return getPageContextPublicClientMinimal(pageContext);
}
function getPageContextPublicClientMinimal(pageContext) {
    const pageContextPublic = getPageContextPublicShared(pageContext);
    return pageContextPublic;
}
// With Vue + Client Routing, the `pageContext` is made reactive:
// ```js
// import { reactive } from 'vue'
// // See /examples/vue-full/renderer/createVueApp.ts
// const pageContextReactive = reactive(pageContext)
// ```
function supportVueReactiviy(pageContext) {
    resolveGetters(pageContext);
}
// Remove property descriptor getters because they break Vue's reactivity.
// E.g. resolve the `pageContext.urlPathname` getter.
function resolveGetters(pageContext) {
    Object.entries(pageContext).forEach(([key, val]) => {
        delete pageContext[key];
        pageContext[key] = val;
    });
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/client/shared/execHookOnRenderClient.js [vike:pluginModuleBanner] */
async function execHookOnRenderClient(pageContext, getPageContextPublic) {
    let hook = null;
    {
        const renderHook = getHookFromPageContext(pageContext, 'render');
        hook = renderHook;
    }
    {
        const renderHook = getHookFromPageContext(pageContext, 'onRenderClient');
        if (renderHook) {
            hook = renderHook;
        }
    }
    if (!hook) {
        const urlToShowToUser = getUrlToShowToUser(pageContext);
        assert(urlToShowToUser);
        if (pageContext._globalContext._pageConfigs.length > 0) {
            // V1 design
            assertUsage(false, `No onRenderClient() hook defined for URL '${urlToShowToUser}', but it's needed, see https://vike.dev/onRenderClient`);
        }
        else {
            // TO-DO/next-major-release: remove
            // V0.4 design
            const pageClientsFilesLoaded = pageContext._pageFilesLoaded.filter((p) => p.fileType === '.page.client');
            let errMsg;
            if (pageClientsFilesLoaded.length === 0) {
                errMsg = 'No file `*.page.client.*` found for URL ' + urlToShowToUser;
            }
            else {
                errMsg =
                    'One of the following files should export a render() hook: ' +
                        pageClientsFilesLoaded.map((p) => p.filePath).join(' ');
            }
            assertUsage(false, errMsg);
        }
    }
    // We don't use a try-catch wrapper because rendering errors are usually handled by the UI framework. (E.g. React's Error Boundaries.)
    await execHookSingle(hook, pageContext, getPageContextPublic);
}
function getUrlToShowToUser(pageContext) {
    let url;
    // try/catch to avoid passToClient assertUsage() (although: this may not be needed anymore, since we're now accessing pageContext and not pageContextPublic)
    try {
        url =
            // Client Routing
            pageContext.urlPathname ??
                // Server Routing
                pageContext.urlOriginal;
    }
    catch { }
    url = url ?? window.location.href;
    return url;
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/client/runtime-server-routing/getGlobalContextClientInternal.js [vike:pluginModuleBanner] */
async function getGlobalContextClientInternal() {
    const globalContext = await getGlobalContextClientInternalShared();
    return globalContext;
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/client/runtime-server-routing/createPageContextClient.js [vike:pluginModuleBanner] */
async function createPageContextClient() {
    const pageContext = createPageContextBase();
    const globalContext = await getGlobalContextClientInternal();
    objectAssign(pageContext, {
        _globalContext: globalContext,
        _pageFilesAll: globalContext._pageFilesAll, // TO-DO/next-major-release: remove
    });
    // Sets pageContext.config to global configs
    updateType(pageContext, createPageContextShared(pageContext, globalContext._globalConfigPublic));
    return pageContext;
}
function createPageContextBase() {
    const pageContextCreated = createPageContextObject();
    objectAssign(pageContextCreated, {
        isClientSide: true,
        isPrerendering: false,
        isHydration: true,
        isBackwardNavigation: null,
        isHistoryNavigation: null,
        _hasPageContextFromServer: true,
    });
    return pageContextCreated;
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/client/runtime-server-routing/getPageContextPublicClient.js [vike:pluginModuleBanner] */
function getPageContextPublicClient(pageContext) {
    return getPageContextPublicClientShared(pageContext);
}

/*! virtual:vike:global-entry:client:server-routing [vike:pluginModuleBanner] */

const pageFilesLazy = {};
const pageFilesEager = {};
const pageFilesExportNamesLazy = {};
const pageFilesExportNamesEager = {};
const pageFilesList = [];
const neverLoaded = {};

const pageConfigsSerialized = [
  {
    pageId: "/pages/(legal)/data-deletion",
    isErrorPage: undefined,
    routeFilesystem: {"routeString":"/data-deletion","definedAtLocation":"/pages/(legal)/data-deletion/"},
    loadVirtualFilePageEntry: () => ({ moduleId: "virtual:vike:page-entry:client:/pages/(legal)/data-deletion", moduleExportsPromise: __vitePreload(() => import('./pages_-legal-_data-deletion.ipNnlCHM.js'),true              ?__vite__mapDeps([0,1,2,3,4,5,6]):void 0) }),
    configValuesSerialized: {
      ["hasServerOnlyHook"]: {
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
      ["guardEnv"]: {
        type: "computed",
        definedAtData: null,
        valueSerialized: {
          type: "js-serialized",
          value: null,
        },
      },
      ["clientRouting"]: {
        type: "standard",
        definedAtData: {"filePathToShowToUser":"/pages/+config.ts","fileExportPathToShowToUser":["default","clientRouting"]},
        valueSerialized: {
          type: "js-serialized",
          value: false,
        },
      },
    },
  },
  {
    pageId: "/pages/(legal)/privacy",
    isErrorPage: undefined,
    routeFilesystem: {"routeString":"/privacy","definedAtLocation":"/pages/(legal)/privacy/"},
    loadVirtualFilePageEntry: () => ({ moduleId: "virtual:vike:page-entry:client:/pages/(legal)/privacy", moduleExportsPromise: __vitePreload(() => import('./pages_-legal-_privacy.13KboE8A.js'),true              ?__vite__mapDeps([7,1,2,3,4,5,6]):void 0) }),
    configValuesSerialized: {
      ["hasServerOnlyHook"]: {
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
      ["guardEnv"]: {
        type: "computed",
        definedAtData: null,
        valueSerialized: {
          type: "js-serialized",
          value: null,
        },
      },
      ["clientRouting"]: {
        type: "standard",
        definedAtData: {"filePathToShowToUser":"/pages/+config.ts","fileExportPathToShowToUser":["default","clientRouting"]},
        valueSerialized: {
          type: "js-serialized",
          value: false,
        },
      },
    },
  },
  {
    pageId: "/pages/_error",
    isErrorPage: true,
    routeFilesystem: undefined,
    loadVirtualFilePageEntry: () => ({ moduleId: "virtual:vike:page-entry:client:/pages/_error", moduleExportsPromise: __vitePreload(() => import('./pages_error.CYujZh5b.js'),true              ?__vite__mapDeps([8,1,2,3,9,10,6]):void 0) }),
    configValuesSerialized: {
      ["hasServerOnlyHook"]: {
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
      ["guardEnv"]: {
        type: "computed",
        definedAtData: null,
        valueSerialized: {
          type: "js-serialized",
          value: null,
        },
      },
      ["clientRouting"]: {
        type: "standard",
        definedAtData: {"filePathToShowToUser":"/pages/+config.ts","fileExportPathToShowToUser":["default","clientRouting"]},
        valueSerialized: {
          type: "js-serialized",
          value: false,
        },
      },
    },
  },
  {
    pageId: "/pages/index",
    isErrorPage: undefined,
    routeFilesystem: {"routeString":"/","definedAtLocation":"/pages/index/"},
    loadVirtualFilePageEntry: () => ({ moduleId: "virtual:vike:page-entry:client:/pages/index", moduleExportsPromise: __vitePreload(() => import('./pages_index.CwLTg_6t.js'),true              ?__vite__mapDeps([11,1,2,3,9,10,6]):void 0) }),
    configValuesSerialized: {
      ["hasServerOnlyHook"]: {
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
      ["guardEnv"]: {
        type: "computed",
        definedAtData: null,
        valueSerialized: {
          type: "js-serialized",
          value: null,
        },
      },
      ["clientRouting"]: {
        type: "standard",
        definedAtData: {"filePathToShowToUser":"/pages/+config.ts","fileExportPathToShowToUser":["default","clientRouting"]},
        valueSerialized: {
          type: "js-serialized",
          value: false,
        },
      },
    },
  },
  {
    pageId: "/pages/presentations/index",
    isErrorPage: undefined,
    routeFilesystem: {"routeString":"/presentations","definedAtLocation":"/pages/presentations/index/"},
    loadVirtualFilePageEntry: () => ({ moduleId: "virtual:vike:page-entry:client:/pages/presentations/index", moduleExportsPromise: __vitePreload(() => import('./pages_presentations_index.sOoTSlzO.js'),true              ?__vite__mapDeps([12,1,2,3,13,14,15,9,10,6,16,17]):void 0) }),
    configValuesSerialized: {
      ["hasServerOnlyHook"]: {
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
      ["guardEnv"]: {
        type: "computed",
        definedAtData: null,
        valueSerialized: {
          type: "js-serialized",
          value: null,
        },
      },
      ["clientRouting"]: {
        type: "standard",
        definedAtData: {"filePathToShowToUser":"/pages/+config.ts","fileExportPathToShowToUser":["default","clientRouting"]},
        valueSerialized: {
          type: "js-serialized",
          value: false,
        },
      },
    },
  },
  {
    pageId: "/pages/projects",
    isErrorPage: undefined,
    routeFilesystem: {"routeString":"/projects","definedAtLocation":"/pages/projects/"},
    loadVirtualFilePageEntry: () => ({ moduleId: "virtual:vike:page-entry:client:/pages/projects", moduleExportsPromise: __vitePreload(() => import('./pages_projects.zgWkdLLd.js'),true              ?__vite__mapDeps([18,1,2,3,19,9,10,6,16,15,20]):void 0) }),
    configValuesSerialized: {
      ["hasServerOnlyHook"]: {
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
      ["guardEnv"]: {
        type: "computed",
        definedAtData: null,
        valueSerialized: {
          type: "js-serialized",
          value: null,
        },
      },
      ["clientRouting"]: {
        type: "standard",
        definedAtData: {"filePathToShowToUser":"/pages/+config.ts","fileExportPathToShowToUser":["default","clientRouting"]},
        valueSerialized: {
          type: "js-serialized",
          value: false,
        },
      },
    },
  },
  {
    pageId: "/pages/tools",
    isErrorPage: undefined,
    routeFilesystem: {"routeString":"/tools","definedAtLocation":"/pages/tools/"},
    loadVirtualFilePageEntry: () => ({ moduleId: "virtual:vike:page-entry:client:/pages/tools", moduleExportsPromise: __vitePreload(() => import('./pages_tools.CHdJjpT3.js'),true              ?__vite__mapDeps([21,1,2,3,19,9,10,6,22]):void 0) }),
    configValuesSerialized: {
      ["hasServerOnlyHook"]: {
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
      ["guardEnv"]: {
        type: "computed",
        definedAtData: null,
        valueSerialized: {
          type: "js-serialized",
          value: null,
        },
      },
      ["clientRouting"]: {
        type: "standard",
        definedAtData: {"filePathToShowToUser":"/pages/+config.ts","fileExportPathToShowToUser":["default","clientRouting"]},
        valueSerialized: {
          type: "js-serialized",
          value: false,
        },
      },
    },
  },
  {
    pageId: "/pages/blog/index",
    isErrorPage: undefined,
    routeFilesystem: {"routeString":"/blog","definedAtLocation":"/pages/blog/index/"},
    loadVirtualFilePageEntry: () => ({ moduleId: "virtual:vike:page-entry:client:/pages/blog/index", moduleExportsPromise: __vitePreload(() => import('./pages_blog_index.Dl-jWyrs.js'),true              ?__vite__mapDeps([23,1,2,3,24,9,10,6,16,25]):void 0) }),
    configValuesSerialized: {
      ["hasServerOnlyHook"]: {
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
      ["guardEnv"]: {
        type: "computed",
        definedAtData: null,
        valueSerialized: {
          type: "js-serialized",
          value: null,
        },
      },
      ["clientRouting"]: {
        type: "standard",
        definedAtData: {"filePathToShowToUser":"/pages/+config.ts","fileExportPathToShowToUser":["default","clientRouting"]},
        valueSerialized: {
          type: "js-serialized",
          value: false,
        },
      },
    },
  },
  {
    pageId: "/pages/blog/view",
    isErrorPage: undefined,
    routeFilesystem: {"routeString":"/blog/view","definedAtLocation":"/pages/blog/view/"},
    loadVirtualFilePageEntry: () => ({ moduleId: "virtual:vike:page-entry:client:/pages/blog/view", moduleExportsPromise: __vitePreload(() => import('./pages_blog_view.B4So06TZ.js'),true              ?__vite__mapDeps([26,1,2,3,24,15,9,10,6,16,27]):void 0) }),
    configValuesSerialized: {
      ["hasServerOnlyHook"]: {
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
      ["guardEnv"]: {
        type: "computed",
        definedAtData: null,
        valueSerialized: {
          type: "js-serialized",
          value: null,
        },
      },
      ["clientRouting"]: {
        type: "standard",
        definedAtData: {"filePathToShowToUser":"/pages/+config.ts","fileExportPathToShowToUser":["default","clientRouting"]},
        valueSerialized: {
          type: "js-serialized",
          value: false,
        },
      },
    },
  },
  {
    pageId: "/pages/presentations/view",
    isErrorPage: undefined,
    routeFilesystem: {"routeString":"/presentations/view","definedAtLocation":"/pages/presentations/view/"},
    loadVirtualFilePageEntry: () => ({ moduleId: "virtual:vike:page-entry:client:/pages/presentations/view", moduleExportsPromise: __vitePreload(() => import('./pages_presentations_view.rbqYppGq.js'),true              ?__vite__mapDeps([28,1,2,3,29,13,14]):void 0) }),
    configValuesSerialized: {
      ["hasServerOnlyHook"]: {
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
      ["guardEnv"]: {
        type: "computed",
        definedAtData: null,
        valueSerialized: {
          type: "js-serialized",
          value: null,
        },
      },
      ["clientRouting"]: {
        type: "standard",
        definedAtData: {"filePathToShowToUser":"/pages/+config.ts","fileExportPathToShowToUser":["default","clientRouting"]},
        valueSerialized: {
          type: "js-serialized",
          value: false,
        },
      },
    },
  },
];
const pageConfigGlobalSerialized = {
  configValuesSerialized: {
  },
};

const pageFilesLazyIsomorph1 = /* #__PURE__ */ Object.assign({});
const pageFilesLazyIsomorph = {...pageFilesLazyIsomorph1};
pageFilesLazy['.page'] = pageFilesLazyIsomorph;
const pageFilesLazyClient1 = /* #__PURE__ */ Object.assign({});
const pageFilesLazyClient = {...pageFilesLazyClient1};
pageFilesLazy['.page.client'] = pageFilesLazyClient;
const neverLoadedServer1 = /* #__PURE__ */ Object.assign({});
const neverLoadedServer = {...neverLoadedServer1};
neverLoaded['.page.server'] = neverLoadedServer;

const virtualFileExportsGlobalEntry = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    neverLoaded,
    pageConfigGlobalSerialized,
    pageConfigsSerialized,
    pageFilesEager,
    pageFilesExportNamesEager,
    pageFilesExportNamesLazy,
    pageFilesLazy,
    pageFilesList
}, Symbol.toStringTag, { value: 'Module' }));

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/client/runtime-server-routing/entry.js [vike:pluginModuleBanner] */
assertServerRouting();
const urlFirst = getCurrentUrl({ withoutHash: true });
assertSingleInstance_onClientEntryServerRouting();
setVirtualFileExportsGlobalEntry(virtualFileExportsGlobalEntry);
hydrate();
async function hydrate() {
  const pageContext = await createPageContextClient();
  objectAssign(pageContext, getPageContextSerializedInHtml());
  const pageContextAddendum = await loadPageConfigsLazyClientSide(pageContext.pageId, pageContext._pageFilesAll, pageContext._globalContext._pageConfigs, pageContext._globalContext._pageConfigGlobal);
  objectAssign(pageContext, pageContextAddendum);
  await execHook("onCreatePageContext", pageContext, getPageContextPublicClient);
  assertPristineUrl();
  await execHookOnRenderClient(pageContext, getPageContextPublicClient);
  await execHook("onHydrationEnd", pageContext, getPageContextPublicClient);
}
function assertPristineUrl() {
  const urlCurrent = getCurrentUrl({ withoutHash: true });
  assertUsage(urlFirst === urlCurrent, `The URL was manipulated before the hydration finished ('${urlFirst}' to '${urlCurrent}'). Ensure the hydration has finished before manipulating the URL. Consider using the onHydrationEnd() hook.`);
}
