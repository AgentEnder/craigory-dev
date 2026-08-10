const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/entries/pages_-legal-_data-deletion.CeaLKYud.js","assets/chunks/chunk-Sg1e8hzK.js","assets/chunks/chunk-D55tFBZo.js","assets/chunks/chunk-Bla4Nnmu.js","assets/chunks/chunk-a-pixR_z.js","assets/static/style-9ca7e227.BcWtY8Ol.css","assets/static/Layout.CKvvAW2y.css","assets/static/PageShell.By1pMcV3.css","assets/entries/pages_-legal-_privacy.2JV_rjsW.js","assets/entries/pages_error.C6OCZm0V.js","assets/chunks/chunk-Dmktz08c.js","assets/chunks/chunk-DOARkCql.js","assets/static/Layout.CQCeDBm5.css","assets/entries/pages_index.Btt9XLON.js","assets/entries/pages_presentations_index.CapSMxnf.js","assets/chunks/chunk-BfFNm7-4.js","assets/static/src.B8dU2LIX.css","assets/chunks/chunk-Cm3bTxvy.js","assets/static/content-marker.DtkiqZQZ.css","assets/chunks/chunk--bj4_xRV.js","assets/static/index.C8hEtJyE.css","assets/entries/pages_projects.BXmEBVQ9.js","assets/chunks/chunk-Dwmc9BD1.js","assets/static/projects.PhaZSyLi.css","assets/entries/pages_tools.CghPQjWQ.js","assets/static/tools.JqAhRSVc.css","assets/entries/pages_blog_index.DJHdMsnI.js","assets/chunks/chunk-CZf36Np_.js","assets/static/src.BMEKT8K_.css","assets/static/index.DAdfchXB.css","assets/entries/pages_blog_view.BiQ0XPbp.js","assets/static/view.CRa8bKWA.css","assets/entries/pages_presentations_view.D1nOmrke.js"])))=>i.map(i=>d[i]);
import { n as __exportAll } from "../chunks/chunk-Sg1e8hzK.js";
import { A as updateType, O as getPageContextSerializedInHtml, P as execHook, Z as assertUsage, _ as createPageContextShared, a as loadPageConfigsLazyClientSide, c as assertServerRouting, et as assertSingleInstance_onClientEntryServerRouting, g as createPageContextObject, j as objectAssign, l as getGlobalContextClientInternalShared, n as execHookOnRenderClient, t as getCurrentUrl, u as setVirtualFileExportsGlobalEntry, y as getPageContextPublicClientShared } from "../chunks/chunk-a-pixR_z.js";
import { t as __vitePreload } from "../chunks/chunk-DOARkCql.js";
//#region ../../node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._b207b9f8c7ea0b559072b65938e06ac0/node_modules/vike/dist/client/runtime-server-routing/getGlobalContextClientInternal.js
async function getGlobalContextClientInternal() {
	return await getGlobalContextClientInternalShared();
}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._b207b9f8c7ea0b559072b65938e06ac0/node_modules/vike/dist/client/runtime-server-routing/createPageContextClient.js
async function createPageContextClient() {
	const pageContext = createPageContextBase();
	const globalContext = await getGlobalContextClientInternal();
	objectAssign(pageContext, {
		_globalContext: globalContext,
		_pageFilesAll: globalContext._pageFilesAll
	});
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
		_hasPageContextFromServer: true
	});
	return pageContextCreated;
}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._b207b9f8c7ea0b559072b65938e06ac0/node_modules/vike/dist/client/runtime-server-routing/getPageContextPublicClient.js
function getPageContextPublicClient(pageContext) {
	return getPageContextPublicClientShared(pageContext);
}
//#endregion
//#region \0virtual:vike:global-entry:client:server-routing
var _virtual_vike_global_entry_client_server_routing_exports = /* @__PURE__ */ __exportAll({
	neverLoaded: () => neverLoaded,
	pageConfigGlobalSerialized: () => pageConfigGlobalSerialized,
	pageConfigsSerialized: () => pageConfigsSerialized,
	pageFilesEager: () => pageFilesEager,
	pageFilesExportNamesEager: () => pageFilesExportNamesEager,
	pageFilesExportNamesLazy: () => pageFilesExportNamesLazy,
	pageFilesLazy: () => pageFilesLazy,
	pageFilesList: () => pageFilesList
});
var pageFilesLazy = {};
var pageFilesEager = {};
var pageFilesExportNamesLazy = {};
var pageFilesExportNamesEager = {};
var pageFilesList = [];
var neverLoaded = {};
var pageConfigsSerialized = [
	{
		pageId: "/pages/(legal)/data-deletion",
		isErrorPage: void 0,
		routeFilesystem: {
			"routeString": "/data-deletion",
			"definedAtLocation": "/pages/(legal)/data-deletion/"
		},
		loadVirtualFilePageEntry: () => ({
			moduleId: "virtual:vike:page-entry:client:/pages/(legal)/data-deletion",
			moduleExportsPromise: __vitePreload(() => import("./pages_-legal-_data-deletion.CeaLKYud.js"), __vite__mapDeps([0,1,2,3,4,5,6,7]))
		}),
		configValuesSerialized: {
			["hasServerOnlyHook"]: {
				type: "computed",
				definedAtData: null,
				valueSerialized: {
					type: "js-serialized",
					value: false
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
					value: null
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
			["clientRouting"]: {
				type: "standard",
				definedAtData: {
					"filePathToShowToUser": "/pages/+config.ts",
					"fileExportPathToShowToUser": ["default", "clientRouting"]
				},
				valueSerialized: {
					type: "js-serialized",
					value: false
				}
			}
		}
	},
	{
		pageId: "/pages/(legal)/privacy",
		isErrorPage: void 0,
		routeFilesystem: {
			"routeString": "/privacy",
			"definedAtLocation": "/pages/(legal)/privacy/"
		},
		loadVirtualFilePageEntry: () => ({
			moduleId: "virtual:vike:page-entry:client:/pages/(legal)/privacy",
			moduleExportsPromise: __vitePreload(() => import("./pages_-legal-_privacy.2JV_rjsW.js"), __vite__mapDeps([8,1,2,3,4,5,6,7]))
		}),
		configValuesSerialized: {
			["hasServerOnlyHook"]: {
				type: "computed",
				definedAtData: null,
				valueSerialized: {
					type: "js-serialized",
					value: false
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
					value: null
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
			["clientRouting"]: {
				type: "standard",
				definedAtData: {
					"filePathToShowToUser": "/pages/+config.ts",
					"fileExportPathToShowToUser": ["default", "clientRouting"]
				},
				valueSerialized: {
					type: "js-serialized",
					value: false
				}
			}
		}
	},
	{
		pageId: "/pages/_error",
		isErrorPage: true,
		routeFilesystem: void 0,
		loadVirtualFilePageEntry: () => ({
			moduleId: "virtual:vike:page-entry:client:/pages/_error",
			moduleExportsPromise: __vitePreload(() => import("./pages_error.C6OCZm0V.js"), __vite__mapDeps([9,1,10,11,3,4,5,12,7]))
		}),
		configValuesSerialized: {
			["hasServerOnlyHook"]: {
				type: "computed",
				definedAtData: null,
				valueSerialized: {
					type: "js-serialized",
					value: false
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
					value: null
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
			["clientRouting"]: {
				type: "standard",
				definedAtData: {
					"filePathToShowToUser": "/pages/+config.ts",
					"fileExportPathToShowToUser": ["default", "clientRouting"]
				},
				valueSerialized: {
					type: "js-serialized",
					value: false
				}
			}
		}
	},
	{
		pageId: "/pages/index",
		isErrorPage: void 0,
		routeFilesystem: {
			"routeString": "/",
			"definedAtLocation": "/pages/index/"
		},
		loadVirtualFilePageEntry: () => ({
			moduleId: "virtual:vike:page-entry:client:/pages/index",
			moduleExportsPromise: __vitePreload(() => import("./pages_index.Btt9XLON.js"), __vite__mapDeps([13,1,10,11,3,4,5,12,7]))
		}),
		configValuesSerialized: {
			["hasServerOnlyHook"]: {
				type: "computed",
				definedAtData: null,
				valueSerialized: {
					type: "js-serialized",
					value: false
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
					value: null
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
			["clientRouting"]: {
				type: "standard",
				definedAtData: {
					"filePathToShowToUser": "/pages/+config.ts",
					"fileExportPathToShowToUser": ["default", "clientRouting"]
				},
				valueSerialized: {
					type: "js-serialized",
					value: false
				}
			}
		}
	},
	{
		pageId: "/pages/presentations/index",
		isErrorPage: void 0,
		routeFilesystem: {
			"routeString": "/presentations",
			"definedAtLocation": "/pages/presentations/index/"
		},
		loadVirtualFilePageEntry: () => ({
			moduleId: "virtual:vike:page-entry:client:/pages/presentations/index",
			moduleExportsPromise: __vitePreload(() => import("./pages_presentations_index.CapSMxnf.js"), __vite__mapDeps([14,1,15,11,3,4,5,16,10,12,7,17,18,19,20]))
		}),
		configValuesSerialized: {
			["hasServerOnlyHook"]: {
				type: "computed",
				definedAtData: null,
				valueSerialized: {
					type: "js-serialized",
					value: false
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
					value: null
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
			["clientRouting"]: {
				type: "standard",
				definedAtData: {
					"filePathToShowToUser": "/pages/+config.ts",
					"fileExportPathToShowToUser": ["default", "clientRouting"]
				},
				valueSerialized: {
					type: "js-serialized",
					value: false
				}
			}
		}
	},
	{
		pageId: "/pages/projects",
		isErrorPage: void 0,
		routeFilesystem: {
			"routeString": "/projects",
			"definedAtLocation": "/pages/projects/"
		},
		loadVirtualFilePageEntry: () => ({
			moduleId: "virtual:vike:page-entry:client:/pages/projects",
			moduleExportsPromise: __vitePreload(() => import("./pages_projects.BXmEBVQ9.js"), __vite__mapDeps([21,1,10,11,3,4,5,12,7,17,18,19,22,23]))
		}),
		configValuesSerialized: {
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
			["clientRouting"]: {
				type: "standard",
				definedAtData: {
					"filePathToShowToUser": "/pages/+config.ts",
					"fileExportPathToShowToUser": ["default", "clientRouting"]
				},
				valueSerialized: {
					type: "js-serialized",
					value: false
				}
			}
		}
	},
	{
		pageId: "/pages/tools",
		isErrorPage: void 0,
		routeFilesystem: {
			"routeString": "/tools",
			"definedAtLocation": "/pages/tools/"
		},
		loadVirtualFilePageEntry: () => ({
			moduleId: "virtual:vike:page-entry:client:/pages/tools",
			moduleExportsPromise: __vitePreload(() => import("./pages_tools.CghPQjWQ.js"), __vite__mapDeps([24,1,10,11,3,4,5,12,7,22,25]))
		}),
		configValuesSerialized: {
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
			["clientRouting"]: {
				type: "standard",
				definedAtData: {
					"filePathToShowToUser": "/pages/+config.ts",
					"fileExportPathToShowToUser": ["default", "clientRouting"]
				},
				valueSerialized: {
					type: "js-serialized",
					value: false
				}
			}
		}
	},
	{
		pageId: "/pages/blog/index",
		isErrorPage: void 0,
		routeFilesystem: {
			"routeString": "/blog",
			"definedAtLocation": "/pages/blog/index/"
		},
		loadVirtualFilePageEntry: () => ({
			moduleId: "virtual:vike:page-entry:client:/pages/blog/index",
			moduleExportsPromise: __vitePreload(() => import("./pages_blog_index.DJHdMsnI.js"), __vite__mapDeps([26,1,10,11,3,4,5,12,7,27,28,19,29]))
		}),
		configValuesSerialized: {
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
			["clientRouting"]: {
				type: "standard",
				definedAtData: {
					"filePathToShowToUser": "/pages/+config.ts",
					"fileExportPathToShowToUser": ["default", "clientRouting"]
				},
				valueSerialized: {
					type: "js-serialized",
					value: false
				}
			}
		}
	},
	{
		pageId: "/pages/blog/view",
		isErrorPage: void 0,
		routeFilesystem: {
			"routeString": "/blog/view",
			"definedAtLocation": "/pages/blog/view/"
		},
		loadVirtualFilePageEntry: () => ({
			moduleId: "virtual:vike:page-entry:client:/pages/blog/view",
			moduleExportsPromise: __vitePreload(() => import("./pages_blog_view.BiQ0XPbp.js"), __vite__mapDeps([30,1,10,11,3,4,5,12,7,17,18,27,28,19,31]))
		}),
		configValuesSerialized: {
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
			["clientRouting"]: {
				type: "standard",
				definedAtData: {
					"filePathToShowToUser": "/pages/+config.ts",
					"fileExportPathToShowToUser": ["default", "clientRouting"]
				},
				valueSerialized: {
					type: "js-serialized",
					value: false
				}
			}
		}
	},
	{
		pageId: "/pages/presentations/view",
		isErrorPage: void 0,
		routeFilesystem: {
			"routeString": "/presentations/view",
			"definedAtLocation": "/pages/presentations/view/"
		},
		loadVirtualFilePageEntry: () => ({
			moduleId: "virtual:vike:page-entry:client:/pages/presentations/view",
			moduleExportsPromise: __vitePreload(() => import("./pages_presentations_view.D1nOmrke.js"), __vite__mapDeps([32,1,15,11,3,4,5,16]))
		}),
		configValuesSerialized: {
			["hasServerOnlyHook"]: {
				type: "computed",
				definedAtData: null,
				valueSerialized: {
					type: "js-serialized",
					value: false
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
					value: null
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
			["clientRouting"]: {
				type: "standard",
				definedAtData: {
					"filePathToShowToUser": "/pages/+config.ts",
					"fileExportPathToShowToUser": ["default", "clientRouting"]
				},
				valueSerialized: {
					type: "js-serialized",
					value: false
				}
			}
		}
	}
];
var pageConfigGlobalSerialized = { configValuesSerialized: {} };
pageFilesLazy[".page"] = { .../* @__PURE__ */ Object.assign({}) };
pageFilesLazy[".page.client"] = { .../* @__PURE__ */ Object.assign({}) };
neverLoaded[".page.server"] = { .../* @__PURE__ */ Object.assign({}) };
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._b207b9f8c7ea0b559072b65938e06ac0/node_modules/vike/dist/client/runtime-server-routing/entry.js
assertServerRouting();
var urlFirst = getCurrentUrl({ withoutHash: true });
assertSingleInstance_onClientEntryServerRouting(true);
setVirtualFileExportsGlobalEntry(_virtual_vike_global_entry_client_server_routing_exports);
hydrate();
async function hydrate() {
	const pageContext = await createPageContextClient();
	objectAssign(pageContext, getPageContextSerializedInHtml());
	objectAssign(pageContext, await loadPageConfigsLazyClientSide(pageContext.pageId, pageContext._pageFilesAll, pageContext._globalContext._pageConfigs, pageContext._globalContext._pageConfigGlobal));
	await execHook("onCreatePageContext", pageContext, getPageContextPublicClient);
	assertPristineUrl();
	await execHookOnRenderClient(pageContext, getPageContextPublicClient);
	await execHook("onHydrationEnd", pageContext, getPageContextPublicClient);
}
function assertPristineUrl() {
	const urlCurrent = getCurrentUrl({ withoutHash: true });
	assertUsage(urlFirst === urlCurrent, `The URL was manipulated before the hydration finished ('${urlFirst}' to '${urlCurrent}'). Ensure the hydration has finished before manipulating the URL. Consider using the onHydrationEnd() hook.`);
}
//#endregion
