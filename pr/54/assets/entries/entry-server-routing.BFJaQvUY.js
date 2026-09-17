const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/entries/pages_-legal-_data-deletion.BYY5cZKQ.js","assets/chunks/chunk-_a1GHatX.js","assets/chunks/chunk-BoKVH0Qf.js","assets/chunks/chunk-B3ASU73i.js","assets/chunks/chunk-BP5HmDEM.js","assets/static/style-96c81c9f.BcWtY8Ol.css","assets/static/Layout.CKvvAW2y.css","assets/static/PageShell.DNsbpT-U.css","assets/entries/pages_-legal-_privacy.B9GJBFKE.js","assets/entries/pages_error.DFc3miUh.js","assets/chunks/chunk-D-oPDRJa.js","assets/chunks/chunk-DPmW-i1e.js","assets/chunks/chunk-dYyorpmn.js","assets/static/Layout.CP-e_zMU.css","assets/entries/pages_index.CUOYap8t.js","assets/entries/pages_presentations_index.MeVZoTCw.js","assets/chunks/chunk-CDdWU5Ti.js","assets/static/src.B8dU2LIX.css","assets/chunks/chunk-CCwDhXLm.js","assets/static/content-marker.DtkiqZQZ.css","assets/chunks/chunk-CEatORTM.js","assets/static/index.SZlazBmq.css","assets/entries/pages_projects.DE5iwUqe.js","assets/chunks/chunk-CAiclvld.js","assets/static/projects.PhaZSyLi.css","assets/entries/pages_resume.teahoEyT.js","assets/static/resume.CBOqK24c.css","assets/entries/pages_tools.BIIEMiEW.js","assets/static/tools.JqAhRSVc.css","assets/entries/pages_blog_index.lgMFP2vI.js","assets/chunks/chunk-CVdNH6Bo.js","assets/static/src.BMEKT8K_.css","assets/static/index.CRsE1GoQ.css","assets/entries/pages_blog_view.DL3DL8ZK.js","assets/static/view.CIcE9BoA.css","assets/entries/pages_presentations_view.DzNKr4s4.js"])))=>i.map(i=>d[i]);
import { n as __exportAll } from "../chunks/chunk-_a1GHatX.js";
import { A as updateType, O as getPageContextSerializedInHtml, P as execHook, Z as assertUsage, _ as createPageContextShared, a as loadPageConfigsLazyClientSide, c as assertServerRouting, et as assertSingleInstance_onClientEntryServerRouting, g as createPageContextObject, j as objectAssign, l as getGlobalContextClientInternalShared, n as execHookOnRenderClient, t as getCurrentUrl, u as setVirtualFileExportsGlobalEntry, y as getPageContextPublicClientShared } from "../chunks/chunk-BP5HmDEM.js";
import { t as __vitePreload } from "../chunks/chunk-DPmW-i1e.js";
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/client/runtime-server-routing/getGlobalContextClientInternal.js
async function getGlobalContextClientInternal() {
	return await getGlobalContextClientInternalShared();
}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/client/runtime-server-routing/createPageContextClient.js
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
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/client/runtime-server-routing/getPageContextPublicClient.js
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
			moduleExportsPromise: __vitePreload(() => import("./pages_-legal-_data-deletion.BYY5cZKQ.js"), __vite__mapDeps([0,1,2,3,4,5,6,7]))
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
			moduleExportsPromise: __vitePreload(() => import("./pages_-legal-_privacy.B9GJBFKE.js"), __vite__mapDeps([8,1,2,3,4,5,6,7]))
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
			moduleExportsPromise: __vitePreload(() => import("./pages_error.DFc3miUh.js"), __vite__mapDeps([9,1,10,11,12,3,4,5,13,7]))
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
			moduleExportsPromise: __vitePreload(() => import("./pages_index.CUOYap8t.js"), __vite__mapDeps([14,1,10,11,12,3,4,5,13,7]))
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
			moduleExportsPromise: __vitePreload(() => import("./pages_presentations_index.MeVZoTCw.js"), __vite__mapDeps([15,1,16,11,3,4,5,17,10,12,13,7,18,19,20,21]))
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
			moduleExportsPromise: __vitePreload(() => import("./pages_projects.DE5iwUqe.js"), __vite__mapDeps([22,1,10,11,12,3,4,5,13,7,18,19,20,23,24]))
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
		pageId: "/pages/resume",
		isErrorPage: void 0,
		routeFilesystem: {
			"routeString": "/resume",
			"definedAtLocation": "/pages/resume/"
		},
		loadVirtualFilePageEntry: () => ({
			moduleId: "virtual:vike:page-entry:client:/pages/resume",
			moduleExportsPromise: __vitePreload(() => import("./pages_resume.teahoEyT.js"), __vite__mapDeps([25,1,16,11,3,4,5,17,12,26]))
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
		pageId: "/pages/tools",
		isErrorPage: void 0,
		routeFilesystem: {
			"routeString": "/tools",
			"definedAtLocation": "/pages/tools/"
		},
		loadVirtualFilePageEntry: () => ({
			moduleId: "virtual:vike:page-entry:client:/pages/tools",
			moduleExportsPromise: __vitePreload(() => import("./pages_tools.BIIEMiEW.js"), __vite__mapDeps([27,1,10,11,12,3,4,5,13,7,23,28]))
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
			moduleExportsPromise: __vitePreload(() => import("./pages_blog_index.lgMFP2vI.js"), __vite__mapDeps([29,1,10,11,12,3,4,5,13,7,30,31,20,32]))
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
			moduleExportsPromise: __vitePreload(() => import("./pages_blog_view.DL3DL8ZK.js"), __vite__mapDeps([33,1,10,11,12,3,4,5,13,7,18,19,30,31,20,34]))
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
			moduleExportsPromise: __vitePreload(() => import("./pages_presentations_view.DzNKr4s4.js"), __vite__mapDeps([35,1,16,11,3,4,5,17]))
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
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/client/runtime-server-routing/entry.js
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
