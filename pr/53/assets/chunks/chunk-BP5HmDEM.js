//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/utils/unique.js
function unique(arr) {
	return Array.from(new Set(arr));
}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/utils/getGlobalObject.js
/**
* Share information across module instances.
*
* @__NO_SIDE_EFFECTS__
*/
function getGlobalObject(moduleId, defaultValue) {
	const globals = getGlobals();
	return globals[moduleId] ?? (globals[moduleId] = defaultValue);
}
function getGlobals() {
	var _a;
	globalThis._vike ?? (globalThis._vike = {});
	(_a = globalThis._vike).globals ?? (_a.globals = {});
	return globalThis._vike.globals;
}
//#endregion
//#region ../../node_modules/.pnpm/@brillout+picocolors@1.0.30/node_modules/@brillout/picocolors/dist/picocolors.browser.js
var picocolors_browser_default = new Proxy({}, { get: (_, p) => (s) => {
	if (p === "code") return `\`${s}\``;
	if (p === "string") return `'${s}'`;
	return s;
} });
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/utils/PROJECT_VERSION.js
var PROJECT_VERSION = "0.4.258";
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/utils/assertSingleInstance.js
var globalObject$4;
globalObject$4 ?? (globalObject$4 = genGlobalConfig());
function genGlobalConfig() {
	return getGlobalObject("utils/assertSingleInstance.ts", {
		instances: [],
		alreadyLogged: /* @__PURE__ */ new Set()
	});
}
function getGlobalObjectSafe() {
	globalObject$4 ?? (globalObject$4 = genGlobalConfig());
	return globalObject$4;
}
var clientRuntimesClonflict = "Client runtime of both Server Routing and Client Routing loaded https://vike.dev/client-runtimes-conflict";
var clientNotSingleInstance = "Client runtime loaded twice https://vike.dev/client-runtime-duplicated";
function assertSingleInstance() {
	const globalObject = getGlobalObjectSafe();
	{
		const versions = unique(globalObject.instances);
		assertWarning$1(versions.length <= 1, `vike@${picocolors_browser_default.bold(versions[0])} and vike@${picocolors_browser_default.bold(versions[1])} loaded which is highly discouraged ${picocolors_browser_default.underline("https://vike.dev/warning/version-mismatch")}`, {
			onlyOnce: true,
			showStackTrace: false
		});
	}
	if (globalObject.checkSingleInstance && globalObject.instances.length > 1) assertWarning$1(false, clientNotSingleInstance, {
		onlyOnce: true,
		showStackTrace: true
	});
}
function assertSingleInstance_onClientEntryServerRouting(isProduction) {
	const globalObject = getGlobalObjectSafe();
	assertWarning$1(globalObject.isClientRouting !== true, clientRuntimesClonflict, {
		onlyOnce: true,
		showStackTrace: true
	});
	assertWarning$1(globalObject.isClientRouting === void 0, clientNotSingleInstance, {
		onlyOnce: true,
		showStackTrace: true
	});
	globalObject.isClientRouting = false;
	if (isProduction) globalObject.checkSingleInstance = true;
	assertSingleInstance();
}
function assertSingleInstance_onAssertModuleLoad() {
	getGlobalObjectSafe().instances.push(PROJECT_VERSION);
	assertSingleInstance();
}
function assertWarning$1(condition, errorMessage, { onlyOnce, showStackTrace }) {
	const globalObject = getGlobalObjectSafe();
	if (condition) return;
	const msg = `[Vike][Warning] ${errorMessage}`;
	if (onlyOnce) {
		const { alreadyLogged } = globalObject;
		const key = onlyOnce === true ? msg : onlyOnce;
		if (alreadyLogged.has(key)) return;
		else alreadyLogged.add(key);
	}
	if (showStackTrace) console.warn(new Error(msg));
	else console.warn(msg);
}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/utils/isNodeJS.js
function isNodeJS() {
	if (typeof process === "undefined") return false;
	if (!process.cwd) return false;
	if (!process.versions || typeof process.versions.node === "undefined") return false;
	if (!process.release || process.release.name !== "node") return false;
	return true;
}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/utils/createErrorWithCleanStackTrace.js
function createErrorWithCleanStackTrace(errorMessage, numberOfStackTraceLinesToRemove) {
	const err = new Error(errorMessage);
	if (isNodeJS()) err.stack = clean(err.stack, numberOfStackTraceLinesToRemove);
	return err;
}
function clean(errStack, numberOfStackTraceLinesToRemove) {
	if (!errStack) return errStack;
	const stackLines = splitByLine(errStack);
	let linesRemoved = 0;
	return stackLines.filter((line) => {
		if (line.includes(" (internal/") || line.includes(" (node:internal")) return false;
		if (linesRemoved < numberOfStackTraceLinesToRemove && isStackTraceLine(line)) {
			linesRemoved++;
			return false;
		}
		return true;
	}).join("\n");
}
function isStackTraceLine(line) {
	return line.startsWith("    at ");
}
function splitByLine(str) {
	return str.split(/\r?\n/);
}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/utils/colorsClient.js
function colorVike(str) {
	return picocolors_browser_default.bold(picocolors_browser_default.yellow(str));
}
function colorError(str) {
	return picocolors_browser_default.bold(picocolors_browser_default.red(str));
}
function colorWarning(str) {
	return picocolors_browser_default.yellow(str);
}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/utils/assert.js
var globalObject$3 = getGlobalObject("utils/assert.ts", { alreadyLogged: /* @__PURE__ */ new Set() });
assertSingleInstance_onAssertModuleLoad();
var tagVike = `[vike]`;
var tagVikeWithVersion = `[vike@${PROJECT_VERSION}]`;
var tagTypeBug = "Bug";
function assert(condition, debugInfo) {
	if (condition) return;
	const debugStr = (() => {
		if (!debugInfo) return null;
		const debugInfoSerialized = typeof debugInfo === "string" ? debugInfo : JSON.stringify(debugInfo);
		return picocolors_browser_default.dim(`Debug for maintainers (you can ignore this): ${debugInfoSerialized}`);
	})();
	let errMsg = [`You stumbled upon a Vike bug. Go to ${picocolors_browser_default.underline("https://github.com/vikejs/vike/issues/new?template=bug.yml")} and copy-paste this error. A maintainer will fix the bug (usually within 24 hours).`, debugStr].filter(Boolean).join(" ");
	errMsg = addTags(errMsg, tagTypeBug, true);
	const internalError = createError(errMsg);
	globalObject$3.onBeforeLog?.();
	globalObject$3.onBeforeErr?.(internalError);
	throw internalError;
}
function assertUsage(condition, errMsg, { showStackTrace, exitOnError } = {}) {
	if (condition) return;
	showStackTrace = showStackTrace || globalObject$3.alwaysShowStackTrace;
	errMsg = addTags(errMsg, "Wrong Usage");
	const usageError = createError(errMsg);
	globalObject$3.onBeforeLog?.();
	globalObject$3.onBeforeErr?.(usageError);
	if (!exitOnError) throw usageError;
	else {
		console.error(showStackTrace ? usageError : errMsg);
		process.exit(1);
	}
}
function getProjectError(errMsg) {
	errMsg = addTags(errMsg, "Error");
	return createError(errMsg);
}
function assertWarning(condition, msg, { onlyOnce, showStackTrace }) {
	if (condition) return;
	showStackTrace = showStackTrace || globalObject$3.alwaysShowStackTrace;
	if (onlyOnce) {
		const { alreadyLogged } = globalObject$3;
		const key = onlyOnce === true ? msg : onlyOnce;
		if (alreadyLogged.has(key)) return;
		alreadyLogged.add(key);
	}
	const msgWithTags = addTags(msg, "Warning");
	globalObject$3.onBeforeLog?.();
	if (showStackTrace) {
		const err = createError(msgWithTags);
		globalObject$3.onBeforeErr?.(err);
		console.warn(err);
	} else console.warn(msgWithTags);
}
function assertInfo(condition, msg, { onlyOnce }) {
	if (condition) return;
	msg = addTags(msg, null);
	if (onlyOnce) {
		const { alreadyLogged } = globalObject$3;
		const key = msg;
		if (alreadyLogged.has(key)) return;
		else alreadyLogged.add(key);
	}
	globalObject$3.onBeforeLog?.();
	console.log(msg);
}
function addTags(msg, tagType, showProjectVersion = false) {
	const tagVike = getTagVike(showProjectVersion);
	const tagTypeOuter = getTagType(tagType);
	const whitespace = getTagWhitespace(msg);
	if (globalObject$3.addAssertTagsDev) return `${globalObject$3.addAssertTagsDev(tagVike, tagTypeOuter)}${whitespace}${msg}`;
	else return `${`${tagVike}${tagTypeOuter}`}${whitespace}${msg}`;
}
function getTagWhitespace(msg) {
	if (msg.startsWith("[")) return "";
	else return " ";
}
function getTagType(tagType) {
	if (!tagType) return "";
	let tag = `[${tagType}]`;
	if (tagType === "Warning") tag = colorWarning(tag);
	else tag = colorError(tag);
	return tag;
}
function getTagVike(showProjectVersion = false) {
	return colorVike(showProjectVersion ? tagVikeWithVersion : tagVike);
}
function createError(errMsg) {
	const err = createErrorWithCleanStackTrace(errMsg, 3);
	if (globalObject$3.addAssertTagsDev) err.stack = err.stack?.replace(/^Error:\s*/, "");
	return err;
}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/utils/humanizeTime.js
function humanizeTime(milliseconds) {
	const seconds = milliseconds / 1e3;
	if (seconds < 120) {
		const n = round(seconds);
		return `${n} second${plural(n)}`;
	}
	{
		const n = round(seconds / 60);
		return `${n} minute${plural(n)}`;
	}
}
function round(n) {
	let rounded = n.toFixed(1);
	if (rounded.endsWith(".0")) rounded = rounded.slice(0, -2);
	return rounded;
}
function plural(n) {
	return n === "1" ? "" : "s";
}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/utils/isObject.js
function isObject(value) {
	return typeof value === "object" && value !== null;
}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/utils/isArray.js
function isArray(value) {
	return Array.isArray(value);
}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/shared-server-client/page-configs/helpers.js
function getPageConfig(pageId, pageConfigs) {
	const pageConfig = pageConfigs.find((p) => p.pageId === pageId);
	assert(pageConfigs.length > 0);
	assert(pageConfig);
	return pageConfig;
}
function getConfigValueFilePathToShowToUser(definedAtData) {
	if (!definedAtData || isArray(definedAtData) || definedAtData.definedBy) return null;
	const { filePathToShowToUser } = definedAtData;
	assert(filePathToShowToUser);
	return filePathToShowToUser;
}
function getHookFilePathToShowToUser(definedAtData) {
	const filePathToShowToUser = getConfigValueFilePathToShowToUser(definedAtData);
	assert(filePathToShowToUser);
	return filePathToShowToUser;
}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/utils/getValuePrintable.js
function getValuePrintable(value) {
	if ([null, void 0].includes(value)) return String(value);
	if ([
		"boolean",
		"number",
		"string"
	].includes(typeof value)) return JSON.stringify(value);
	return null;
}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/utils/checkType.js
function checkType(_) {}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/shared-server-client/page-configs/getExportPath.js
function getExportPath(fileExportPathToShowToUser, configName) {
	if (!fileExportPathToShowToUser) return null;
	let [exportName, ...exportObjectPath] = fileExportPathToShowToUser;
	if (!exportName) return null;
	if (exportObjectPath.length === 0 && [
		"*",
		"default",
		configName
	].includes(exportName)) return null;
	assert(exportName !== "*");
	let prefix = "";
	let suffix = "";
	if (exportName === "default") prefix = "export default";
	else {
		prefix = "export";
		exportObjectPath = [exportName, ...exportObjectPath];
	}
	exportObjectPath.forEach((prop) => {
		prefix = `${prefix} { ${prop}`;
		suffix = ` }${suffix}`;
	});
	return prefix + suffix;
}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/shared-server-client/page-configs/getConfigDefinedAt.js
function getConfigDefinedAt(sentenceBegin, configName, definedAtData) {
	return `${begin(sentenceBegin, configName)} at ${getDefinedAtString(definedAtData, configName)}`;
}
function getConfigDefinedAtOptional(sentenceBegin, configName, definedAtData) {
	if (!definedAtData) return `${begin(sentenceBegin, configName)} internally`;
	else return `${begin(sentenceBegin, configName)} at ${getDefinedAtString(definedAtData, configName)}`;
}
function begin(sentenceBegin, configName) {
	return `${sentenceBegin} ${picocolors_browser_default.cyan(configName)} defined`;
}
function getDefinedAtString(definedAtData, configName) {
	let files;
	if (isArray(definedAtData)) files = definedAtData;
	else files = [definedAtData];
	assert(files.length >= 1);
	return files.map((definedAt) => {
		if (definedAt.definedBy) return getDefinedByString(definedAt, configName);
		const { filePathToShowToUser, fileExportPathToShowToUser } = definedAt;
		const exportPath = getExportPath(fileExportPathToShowToUser, configName);
		if (exportPath) return `${filePathToShowToUser} > ${picocolors_browser_default.cyan(exportPath)}`;
		else return filePathToShowToUser;
	}).join(" / ");
}
function getDefinedByString(definedAt, configName) {
	if (definedAt.definedBy === "api") return `API call ${picocolors_browser_default.cyan(`${definedAt.operation}({ vikeConfig: { ${configName} } })`)}`;
	const { definedBy } = definedAt;
	if (definedBy === "cli") return `CLI option ${picocolors_browser_default.cyan(`--${configName}`)}`;
	if (definedBy === "env") return `environment variable ${picocolors_browser_default.cyan(`VIKE_CONFIG="{${configName}}"`)}`;
	assert(false);
}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/shared-server-client/page-configs/getConfigValueTyped.js
function getConfigValueTyped(configValue, configName, type) {
	const { value, definedAtData } = configValue;
	if (type) assertConfigValueType(value, type, configName, definedAtData);
	return configValue;
}
function assertConfigValueType(value, type, configName, definedAtData) {
	assert(value !== null);
	const typeActual = typeof value;
	if (typeActual === type) return;
	const valuePrintable = getValuePrintable(value);
	const problem = valuePrintable !== null ? `value ${picocolors_browser_default.cyan(valuePrintable)}` : `type ${picocolors_browser_default.cyan(typeActual)}`;
	assertUsage(false, `${getConfigDefinedAtOptional("Config", configName, definedAtData)} has an invalid ${problem}: it should be a ${picocolors_browser_default.cyan(type)} instead`);
}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/shared-server-client/page-configs/getConfigValueRuntime.js
function getConfigValueRuntime(pageConfig, configName, type) {
	const configValue = pageConfig.configValues[configName];
	if (!configValue) return null;
	return getConfigValueTyped(configValue, configName, type);
}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/utils/isCallable.js
function isCallable(thing) {
	return thing instanceof Function || typeof thing === "function";
}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/shared-server-client/hooks/getHook.js
var globalObject$2 = getGlobalObject("hooks/getHook.ts", {});
function getHookFromPageContext(pageContext, hookName) {
	if (!(hookName in pageContext.exports)) return null;
	const { hooksTimeout } = pageContext.config;
	const hookTimeout = getHookTimeout(hooksTimeout, hookName);
	const hookFn = pageContext.exports[hookName];
	if (hookFn === null) return null;
	const file = pageContext.exportsAll[hookName][0];
	assert(file.exportValue === hookFn);
	const hookFilePath = file.filePath;
	assert(hookFilePath);
	return getHook(hookFn, hookName, hookFilePath, hookTimeout);
}
function getHooksFromPageContextNew(hookName, pageContext) {
	const { hooksTimeout } = pageContext.config;
	const hookTimeout = getHookTimeout(hooksTimeout, hookName);
	const hooks = [];
	pageContext.exportsAll[hookName]?.forEach((val) => {
		const hookFn = val.exportValue;
		if (hookFn === null) return;
		const hookFilePath = val.filePath;
		assert(hookFilePath);
		hooks.push(getHook(hookFn, hookName, hookFilePath, hookTimeout));
	});
	return hooks;
}
function getHookFromPageConfigGlobal(pageConfigGlobal, hookName) {
	const configValue = pageConfigGlobal.configValues[hookName];
	if (!configValue?.value) return null;
	const { hookFn, hookFilePath } = getHookFromConfigValue(configValue);
	return getHook(hookFn, hookName, hookFilePath, getHookTimeoutGlobal(hookName));
}
function getHooksFromPageConfigGlobalCumulative(pageConfigGlobal, hookName) {
	const configValue = pageConfigGlobal.configValues[hookName];
	if (!configValue?.value) return [];
	const val = configValue.value;
	assert(isArray(val));
	return val.map((v, i) => {
		const hookFn = v;
		const hookTimeout = getHookTimeoutGlobal(hookName);
		assert(isArray(configValue.definedAtData));
		return getHook(hookFn, hookName, getHookFilePathToShowToUser(configValue.definedAtData[i]), hookTimeout);
	});
}
function getHookTimeoutGlobal(hookName) {
	return getHookTimeoutDefault(hookName);
}
function getHook(hookFn, hookName, hookFilePath, hookTimeout) {
	assert(hookFilePath);
	assertHookFn(hookFn, {
		hookName,
		hookFilePath
	});
	return {
		hookFn,
		hookName,
		hookFilePath,
		hookTimeout
	};
}
function getHookFromConfigValue(configValue) {
	const hookFn = configValue.value;
	assert(hookFn);
	return {
		hookFn,
		hookFilePath: getHookFilePathToShowToUser(configValue.definedAtData)
	};
}
function assertHookFn(hookFn, { hookName, hookFilePath }) {
	assert(hookName && hookFilePath);
	assert(!hookName.endsWith(")"));
	assert(!hookFilePath.endsWith(" "));
	assertUsage(isCallable(hookFn), `Hook ${hookName}() defined by ${hookFilePath} should be a function`);
}
function getHookTimeout(hooksTimeoutProvidedByUser, hookName) {
	const hooksTimeoutProvidedbyUserNormalized = getHooksTimeoutProvidedByUserNormalized(hooksTimeoutProvidedByUser);
	if (hooksTimeoutProvidedbyUserNormalized === false) return {
		error: false,
		warning: false
	};
	const providedbyUser = hooksTimeoutProvidedbyUserNormalized[hookName];
	const hookTimeout = getHookTimeoutDefault(hookName);
	if (providedbyUser?.error !== void 0) hookTimeout.error = providedbyUser.error;
	if (providedbyUser?.warning !== void 0) hookTimeout.warning = providedbyUser.warning;
	return hookTimeout;
}
function getHooksTimeoutProvidedByUserNormalized(hooksTimeoutProvidedByUser) {
	if (hooksTimeoutProvidedByUser === void 0) return {};
	if (hooksTimeoutProvidedByUser === false) return false;
	assertUsage(isObject(hooksTimeoutProvidedByUser), `Setting ${picocolors_browser_default.cyan("hooksTimeout")} should be ${picocolors_browser_default.cyan("false")} or an object`);
	const hooksTimeoutProvidedByUserNormalized = {};
	Object.entries(hooksTimeoutProvidedByUser).forEach(([hookName, hookTimeoutProvidedbyUser]) => {
		if (hookTimeoutProvidedbyUser === false) {
			hooksTimeoutProvidedByUserNormalized[hookName] = {
				error: false,
				warning: false
			};
			return;
		}
		assertUsage(isObject(hookTimeoutProvidedbyUser), `Setting ${picocolors_browser_default.cyan(`hooksTimeout.${hookName}`)} should be ${picocolors_browser_default.cyan("false")} or an object`);
		const [error, warning] = ["error", "warning"].map((timeoutName) => {
			const timeoutVal = hookTimeoutProvidedbyUser[timeoutName];
			if (timeoutVal === void 0 || timeoutVal === false) return timeoutVal;
			const errPrefix = `Setting ${picocolors_browser_default.cyan(`hooksTimeout.${hookName}.${timeoutName}`)} should be`;
			assertUsage(typeof timeoutVal === "number", `${errPrefix} ${picocolors_browser_default.cyan("false")} or a number`);
			assertUsage(timeoutVal > 0, `${errPrefix} a positive number`);
			return timeoutVal;
		});
		hooksTimeoutProvidedByUserNormalized[hookName] = {
			error,
			warning
		};
	});
	return hooksTimeoutProvidedByUserNormalized;
}
function getHookTimeoutDefault(hookName) {
	if (hookName === "onBeforeRoute") return {
		error: 5 * 1e3,
		warning: 1 * 1e3
	};
	if (globalObject$2.isPrerendering) return {
		error: 120 * 1e3,
		warning: 30 * 1e3
	};
	else assert(!hookName.toLowerCase().includes("prerender"));
	return {
		error: 30 * 1e3,
		warning: 4 * 1e3
	};
}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/utils/isPropertyGetter.js
function isPropertyGetter(obj, prop) {
	const descriptor = Object.getOwnPropertyDescriptor(obj, prop);
	return !!descriptor && !("value" in descriptor) && !!descriptor.get;
}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/shared-server-client/addIs404ToPageProps.js
function addIs404ToPageProps(pageContext) {
	addIs404(pageContext);
}
function addIs404(pageContext) {
	if (pageContext.is404 === void 0 || pageContext.is404 === null) return;
	const pageProps = pageContext.pageProps || {};
	if (!isObject(pageProps)) {
		assertWarning(false, "pageContext.pageProps should be an object", {
			showStackTrace: true,
			onlyOnce: true
		});
		return;
	}
	pageProps.is404 = pageProps.is404 || pageContext.is404;
	pageContext.pageProps = pageProps;
}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/utils/getPropAccessNotation.js
function getPropAccessNotation(key) {
	return typeof key === "string" && isKeyDotNotationCompatible(key) ? `.${key}` : `[${JSON.stringify(key)}]`;
}
function isKeyDotNotationCompatible(key) {
	return /^[a-z0-9\$_]+$/i.test(key);
}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/utils/isBrowser.js
/** Test whether the environment is a *real* browser (not a browser simulation such as `jsdom`). */
function isBrowser() {
	return Object.getOwnPropertyDescriptor(globalThis, "window")?.get?.toString().includes("[native code]") ?? false;
}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/shared-server-client/getPublicProxy.js
function getPublicProxy(obj, objName, skipOnInternalProp, fallback) {
	return new Proxy(obj, { get: (_, prop) => getProp(prop, obj, objName, skipOnInternalProp, fallback) });
}
function getProp(prop, ...args) {
	const [obj, objName, skipOnInternalProp, fallback] = args;
	const propStr = String(prop);
	if (prop === "_isProxyObject") return true;
	if (prop === "dangerouslyUseInternals") {
		args[2] = true;
		return getPublicProxy(...args);
	}
	if (!skipOnInternalProp) {}
	if (prop === "_originalObject") return obj;
	if (fallback && !(prop in obj)) return fallback(prop);
	const val = obj[prop];
	onNotSerializable(propStr, val, objName);
	return val;
}
function onNotSerializable(propStr, val, objName) {
	if (val !== "__VIKE__NOT_SERIALIZABLE__") return;
	const propName = getPropAccessNotation(propStr);
	assert(isBrowser());
	assertUsage(false, `Can't access ${objName}${propName} on the client side. Because it can't be serialized, see server logs.`);
}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/shared-server-client/getGlobalContextPublicShared.js
function getGlobalContextPublicShared(globalContext) {
	assert(globalContext._isOriginalObject);
	return getPublicProxy(globalContext, "globalContext");
}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/shared-server-client/getPageContextPublicShared.js
function getPageContextPublicShared(pageContext) {
	assert(!pageContext._isProxyObject);
	assert(!pageContext.globalContext);
	assert(pageContext._isOriginalObject);
	addIs404ToPageProps(pageContext);
	if (!("_pageId" in pageContext)) Object.defineProperty(pageContext, "_pageId", {
		get() {
			assertWarning(false, "pageContext._pageId has been renamed to pageContext.pageId", {
				showStackTrace: true,
				onlyOnce: true
			});
			return pageContext.pageId;
		},
		enumerable: false
	});
	const globalContextPublic = getGlobalContextPublicShared(pageContext._globalContext);
	return getPublicProxy(pageContext, "pageContext", true, (prop) => {
		if (prop === "globalContext") return globalContextPublic;
		if (prop in globalContextPublic) return globalContextPublic[prop];
	});
}
function assertPropertyGetters(pageContext) {
	[
		"urlPathname",
		"urlParsed",
		"url",
		"pageExports"
	].forEach((prop) => {
		if (pageContext.prop) assert(isPropertyGetter(pageContext, prop));
	});
}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/shared-server-client/hooks/execHook.js
var globalObject$1 = getGlobalObject("utils/execHook.ts", {
	userHookErrors: /* @__PURE__ */ new WeakMap(),
	pageContext: null
});
async function execHook(hookName, pageContext, getPageContextPublic) {
	return await execHookList(getHooksFromPageContextNew(hookName, pageContext), pageContext, getPageContextPublic);
}
async function execHookGlobal(hookName, globalContext, getGlobalContextPublic) {
	const hooks = getHooksFromPageConfigGlobalCumulative(globalContext._pageConfigGlobal, hookName);
	const globalContextPublic = getGlobalContextPublic(globalContext);
	await Promise.all(hooks.map(async (hook) => {
		await execHookBaseAsync(() => hook.hookFn(globalContextPublic), hook, globalContext, null);
	}));
}
async function execHookList(hooks, pageContext, getPageContextPublic) {
	if (!hooks.length) return [];
	const pageContextPublic = getPageContextPublic(pageContext);
	return await Promise.all(hooks.map(async (hook) => {
		const hookReturn = await execHookBaseAsync(() => hook.hookFn(pageContextPublic), hook, pageContext._globalContext, pageContextPublic);
		return {
			...hook,
			hookReturn
		};
	}));
}
async function execHookSingle(hook, pageContext, getPageContextPublic) {
	const { hookReturn } = (await execHookList([hook], pageContext, getPageContextPublic))[0];
	assertUsage(hookReturn === void 0, `The ${hook.hookName}() hook defined by ${hook.hookFilePath} isn't allowed to return a value`);
}
function execHookSingleSync(hook, globalContext, pageContext, getPageContextPublic, hookFnCaller) {
	const pageContextPublic = pageContext && getPageContextPublic(pageContext);
	hookFnCaller ?? (hookFnCaller = () => hook.hookFn(pageContextPublic));
	return { hookReturn: execHookBase(hookFnCaller, hook, globalContext, pageContextPublic) };
}
function execHookBaseAsync(hookFnCaller, hook, globalContext, pageContextPublic) {
	const { hookName, hookFilePath, hookTimeout: { error: timeoutErr, warning: timeoutWarn } } = hook;
	let resolve;
	let reject;
	const promise = new Promise((resolve_, reject_) => {
		resolve = (ret) => {
			clearTimeouts();
			resolve_(ret);
		};
		reject = (err) => {
			clearTimeouts();
			reject_(err);
		};
	});
	const clearTimeouts = () => {
		if (currentTimeoutWarn) clearTimeout(currentTimeoutWarn);
		if (currentTimeoutErr) clearTimeout(currentTimeoutErr);
	};
	const currentTimeoutWarn = isNotDisabled(timeoutWarn) && setTimeout(() => {
		assertWarning(false, `The ${hookName}() hook defined by ${hookFilePath} is slow: it's taking more than ${humanizeTime(timeoutWarn)} (https://vike.dev/hooksTimeout)`, { onlyOnce: false });
	}, timeoutWarn);
	const currentTimeoutErr = isNotDisabled(timeoutErr) && setTimeout(() => {
		const err = getProjectError(`The ${hookName}() hook defined by ${hookFilePath} timed out: it didn't finish after ${humanizeTime(timeoutErr)} (https://vike.dev/hooksTimeout)`);
		reject(err);
	}, timeoutErr);
	(async () => {
		try {
			const ret = await execHookBase(hookFnCaller, hook, globalContext, pageContextPublic);
			resolve(ret);
		} catch (err) {
			if (isObject(err)) globalObject$1.userHookErrors.set(err, {
				hookName,
				hookFilePath
			});
			reject(err);
		}
	})();
	return promise;
}
function execHookBase(hookFnCaller, hook, globalContext, pageContext) {
	const { hookName, hookFilePath } = hook;
	assert(hookName !== "onHookCall");
	const configValue = globalContext._pageConfigGlobal.configValues["onHookCall"];
	const callOriginal = () => {
		providePageContextInternal(pageContext);
		return hookFnCaller();
	};
	if (!configValue?.value) return callOriginal();
	let originalCalled = false;
	let originalReturn;
	let originalError;
	let call = () => {
		originalCalled = true;
		try {
			originalReturn = callOriginal();
		} catch (err) {
			originalError = err;
			throw err;
		}
		return originalReturn;
	};
	for (const onHookCall of configValue.value) {
		const hookPublic = {
			name: hookName,
			filePath: hookFilePath,
			call
		};
		call = () => {
			(async () => {
				try {
					await onHookCall(hookPublic, pageContext);
				} catch (err) {
					if (err !== originalError) console.error(err);
				}
			})();
			assertUsage(originalCalled, "onHookCall() must run hook.call()");
			return originalReturn;
		};
	}
	call();
	if (originalError) throw originalError;
	return originalReturn;
}
function isNotDisabled(timeout) {
	return !!timeout && timeout !== Infinity;
}
/**
* Provide `pageContext` for universal hooks.
*
* https://vike.dev/getPageContext
*/
function providePageContext(pageContext) {
	providePageContextInternal(pageContext);
}
function providePageContextInternal(pageContext) {
	globalObject$1.pageContext = pageContext;
	Promise.resolve().then(() => {
		globalObject$1.pageContext = null;
	});
}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/utils/genPromise.js
var timeoutDefault = 25 * 1e3;
function genPromise({ timeout = timeoutDefault } = {}) {
	let resolve;
	let reject;
	let finished = false;
	const promise_internal = new Promise((resolve_, reject_) => {
		resolve = (...args) => {
			finished = true;
			timeoutClear();
			return resolve_(...args);
		};
		reject = (...args) => {
			finished = true;
			timeoutClear();
			return reject_(...args);
		};
	});
	const timeoutClear = () => timeouts.forEach((t) => clearTimeout(t));
	const timeouts = [];
	let promise;
	if (!timeout) promise = promise_internal;
	else promise = new Proxy(promise_internal, { get(target, prop) {
		if (prop === "then" && !finished) {
			const err = /* @__PURE__ */ new Error(`Promise hasn't resolved after ${humanizeTime(timeout)}`);
			timeouts.push(setTimeout(() => {
				assert(err.stack);
				assertWarning(false, removeStackErrorPrefix(err.stack), { onlyOnce: false });
			}, timeout));
		}
		const value = Reflect.get(target, prop);
		return typeof value === "function" ? value.bind(target) : value;
	} });
	return {
		promise,
		resolve,
		reject
	};
}
function removeStackErrorPrefix(errStack) {
	if (errStack.startsWith("Error: ")) errStack = errStack.slice(7);
	return errStack;
}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/utils/isArrayOfStrings.js
function isArrayOfStrings(val) {
	return isArray(val) && val.every((v) => typeof v === "string");
}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/utils/isObjectOfStrings.js
function isObjectOfStrings(val) {
	return isObject(val) && Object.values(val).every((v) => typeof v === "string");
}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/utils/hasProp.js
function hasProp(obj, prop, type) {
	if (!isObject(obj)) return false;
	if (!(prop in obj)) return type === "undefined";
	if (type === void 0) return true;
	const propValue = obj[prop];
	if (type === "undefined") return propValue === void 0;
	if (type === "array") return isArray(propValue);
	if (type === "object") return isObject(propValue);
	if (type === "string[]") return isArrayOfStrings(propValue);
	if (type === "string{}") return isObjectOfStrings(propValue);
	if (type === "function") return isCallable(propValue);
	if (isArray(type)) return typeof propValue === "string" && type.includes(propValue);
	if (type === "null") return propValue === null;
	if (type === "true") return propValue === true;
	if (type === "false") return propValue === false;
	return typeof propValue === type;
}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/utils/objectAssign.js
function objectAssign(obj, objAddendum, objAddendumCanBeOriginalObject) {
	if (!objAddendum) return;
	if (!objAddendumCanBeOriginalObject) assert(!objAddendum._isOriginalObject);
	Object.defineProperties(obj, Object.getOwnPropertyDescriptors(objAddendum));
}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/utils/updateType.js
/** Help TypeScript update the type of dynamically modified objects. */
function updateType(thing, clone) {
	assert(thing === clone);
}
//#endregion
//#region ../../node_modules/.pnpm/@brillout+json-serializer@0.5.22/node_modules/@brillout/json-serializer/dist/types.js
var types = [
	ts({
		is: (val) => val === void 0,
		match: (str) => str === "!undefined",
		serialize: () => "!undefined",
		deserialize: () => void 0
	}),
	ts({
		is: (val) => val === Infinity,
		match: (str) => str === "!Infinity",
		serialize: () => "!Infinity",
		deserialize: () => Infinity
	}),
	ts({
		is: (val) => val === -Infinity,
		match: (str) => str === "!-Infinity",
		serialize: () => "!-Infinity",
		deserialize: () => -Infinity
	}),
	ts({
		is: (val) => typeof val === "number" && isNaN(val),
		match: (str) => str === "!NaN",
		serialize: () => "!NaN",
		deserialize: () => NaN
	}),
	ts({
		is: (val) => val instanceof Date,
		match: (str) => str.startsWith("!Date:"),
		serialize: (val) => "!Date:" + val.toISOString(),
		deserialize: (str) => new Date(str.slice(6))
	}),
	ts({
		is: (val) => typeof val === "bigint",
		match: (str) => str.startsWith("!BigInt:"),
		serialize: (val) => "!BigInt:" + val.toString(),
		deserialize: (str) => {
			if (typeof BigInt === "undefined") throw new Error("Your JavaScript environement does not support BigInt. Consider adding a polyfill.");
			return BigInt(str.slice(8));
		}
	}),
	ts({
		is: (val) => val instanceof RegExp,
		match: (str) => str.startsWith("!RegExp:"),
		serialize: (val) => "!RegExp:" + val.toString(),
		deserialize: (str) => {
			str = str.slice(8);
			const args = str.match(/\/(.*)\/(.*)?/);
			const pattern = args[1];
			const flags = args[2];
			return new RegExp(pattern, flags);
		}
	}),
	ts({
		is: (val) => val instanceof Map,
		match: (str) => str.startsWith("!Map:"),
		serialize: (val, serializer) => "!Map:" + serializer(Array.from(val.entries())),
		deserialize: (str, parser) => new Map(parser(str.slice(5)))
	}),
	ts({
		is: (val) => val instanceof Set,
		match: (str) => str.startsWith("!Set:"),
		serialize: (val, serializer) => "!Set:" + serializer(Array.from(val.values())),
		deserialize: (str, parser) => new Set(parser(str.slice(5)))
	}),
	ts({
		is: (val) => typeof val === "string" && val.startsWith("!"),
		match: (str) => str.startsWith("!"),
		serialize: (val) => "!" + val,
		deserialize: (str) => str.slice(1)
	})
];
function ts(t) {
	return t;
}
//#endregion
//#region ../../node_modules/.pnpm/@brillout+json-serializer@0.5.22/node_modules/@brillout/json-serializer/dist/parse.js
function parse(str, options = {}) {
	return parseTransform(JSON.parse(str), options);
}
function parseTransform(value, options = {}) {
	if (typeof value === "string") return reviver(value, options);
	if (typeof value === "object" && value !== null) Object.entries(value).forEach(([key, val]) => {
		value[key] = parseTransform(val, options);
	});
	return value;
}
function reviver(value, options) {
	const parser = (str) => parse(str, options);
	{
		const res = options.reviver?.(void 0, value, parser);
		if (res) if (typeof res.replacement !== "string") return res.replacement;
		else {
			value = res.replacement;
			if (res.resolved) return value;
		}
	}
	for (const { match, deserialize } of types) if (match(value)) return deserialize(value, parser);
	return value;
}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/shared-server-client/htmlElementIds.js
var htmlElementId_pageContext = "vike_pageContext";
var htmlElementId_globalContext = "vike_globalContext";
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/utils/assertIsBrowser.js
function assertIsBrowser() {
	assert(isBrowser());
}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/client/assertEnvClient.js
assertEnvClient();
function assertEnvClient() {
	assertIsBrowser();
}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/client/shared/getJsonSerializedInHtml.js
function getPageContextSerializedInHtml() {
	const pageContextSerializedInHtml = findAndParseJson(htmlElementId_pageContext);
	assert(hasProp(pageContextSerializedInHtml, "pageId", "string"));
	assert(hasProp(pageContextSerializedInHtml, "routeParams", "string{}"));
	return pageContextSerializedInHtml;
}
function getGlobalContextSerializedInHtml() {
	return findAndParseJson(htmlElementId_globalContext);
}
function findAndParseJson(id) {
	const elem = document.getElementById(id);
	assertUsage(elem, `Couldn't find #${id} (which Vike automatically injects in the HTML): make sure it exists (i.e. don't remove it and make sure your HTML isn't malformed)`);
	const jsonStr = elem.textContent;
	assert(jsonStr);
	return parse(jsonStr, { reviver(_key, value) {
		if (typeof value === "string") return {
			replacement: value.replaceAll("\\/", "/"),
			resolved: false
		};
	} });
}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/utils/isNullish.js
function isNullish(val) {
	return val === null || val === void 0;
}
function isNotNullish(p) {
	return !isNullish(p);
}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/shared-server-client/getPageFiles/getAllPageIdFiles.js
function getPageFilesClientSide(pageFilesAll, pageId) {
	return determine(pageFilesAll, pageId, true);
}
function getPageFilesServerSide(pageFilesAll, pageId) {
	return determine(pageFilesAll, pageId, false);
}
function determine(pageFilesAll, pageId, envIsClient) {
	const env = envIsClient ? "CLIENT_ONLY" : "SERVER_ONLY";
	const pageFilesRelevant = pageFilesAll.filter((p) => p.isRelevant(pageId) && p.fileType !== ".page.route").sort(getPageFilesSorter(envIsClient, pageId));
	const getPageIdFile = (iso) => {
		const files = pageFilesRelevant.filter((p) => p.pageId === pageId && p.isEnv(iso ? "CLIENT_AND_SERVER" : env));
		assertUsage(files.length <= 1, `Merge the following files into a single file: ${files.map((p) => p.filePath).join(" ")}`);
		const pageIdFile = files[0];
		assert(pageIdFile === void 0 || !pageIdFile.isDefaultPageFile);
		return pageIdFile;
	};
	const pageIdFileEnv = getPageIdFile(false);
	const pageIdFileIso = getPageIdFile(true);
	const getRendererFile = (iso) => pageFilesRelevant.filter((p) => p.isRendererPageFile && p.isEnv(iso ? "CLIENT_AND_SERVER" : env))[0];
	const rendererFileEnv = getRendererFile(false);
	const rendererFileIso = getRendererFile(true);
	return [
		pageIdFileEnv,
		pageIdFileIso,
		...pageFilesRelevant.filter((p) => p.isDefaultPageFile && !p.isRendererPageFile && (p.isEnv(env) || p.isEnv("CLIENT_AND_SERVER"))),
		rendererFileEnv,
		rendererFileIso
	].filter(isNotNullish);
}
function getPageFilesSorter(envIsClient, pageId) {
	const env = envIsClient ? "CLIENT_ONLY" : "SERVER_ONLY";
	const e1First = -1;
	const e2First = 1;
	const noOrder = 0;
	return (e1, e2) => {
		if (!e1.isDefaultPageFile && e2.isDefaultPageFile) return e1First;
		if (!e2.isDefaultPageFile && e1.isDefaultPageFile) return e2First;
		{
			const e1_isRenderer = e1.isRendererPageFile;
			const e2_isRenderer = e2.isRendererPageFile;
			if (!e1_isRenderer && e2_isRenderer) return e1First;
			if (!e2_isRenderer && e1_isRenderer) return e2First;
			assert(e1_isRenderer === e2_isRenderer);
		}
		{
			const e1_distance = getPathDistance(pageId, e1.filePath);
			const e2_distance = getPathDistance(pageId, e2.filePath);
			if (e1_distance < e2_distance) return e1First;
			if (e2_distance < e1_distance) return e2First;
			assert(e1_distance === e2_distance);
		}
		if (e1.isEnv(env) && e2.isEnv("CLIENT_AND_SERVER")) return e1First;
		if (e2.isEnv(env) && e1.isEnv("CLIENT_AND_SERVER")) return e2First;
		return noOrder;
	};
}
function getPathDistance(pathA, pathB) {
	let idx = 0;
	for (; idx < pathA.length && idx < pathB.length; idx++) if (pathA[idx] !== pathB[idx]) break;
	const pathAWithoutCommon = pathA.slice(idx);
	const pathBWithoutCommon = pathB.slice(idx);
	return pathAWithoutCommon.split("/").length + pathBWithoutCommon.split("/").length;
}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/utils/slice.js
function slice(thing, from, to) {
	if (typeof thing === "string") return sliceArray(thing.split(""), from, to).join("");
	else return sliceArray(thing, from, to);
}
function sliceArray(list, from, to) {
	const listSlice = [];
	let start = from >= 0 ? from : list.length + from;
	assert(start >= 0 && start <= list.length);
	let end = to >= 0 ? to : list.length + to;
	assert(end >= 0 && end <= list.length);
	while (true) {
		if (start === end) break;
		if (start === list.length) start = 0;
		if (start === end) break;
		const el = list[start];
		assert(el !== void 0);
		listSlice.push(el);
		start++;
	}
	return listSlice;
}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/utils/parseUrl.js
function parseUrl(url, baseServer) {
	assert(isUrl(url), url);
	assert(baseServer.startsWith("/"));
	const { hashString: hashOriginal, withoutHash: urlWithoutHash } = extractHash(url);
	assert(hashOriginal === null || hashOriginal.startsWith("#"));
	const hash = hashOriginal === null ? "" : decodeSafe(hashOriginal.slice(1));
	const { searchString: searchOriginal, withoutSearch: urlWithoutHashNorSearch } = extractSearch(urlWithoutHash);
	assert(searchOriginal === null || searchOriginal.startsWith("?"));
	let searchString = "";
	if (searchOriginal !== null) searchString = searchOriginal;
	else if (url.startsWith("#")) {
		const baseURI = getBaseURI();
		searchString = baseURI && extractSearch(baseURI).searchString || "";
	}
	const search = {};
	const searchAll = {};
	Array.from(new URLSearchParams(searchString)).forEach(([key, val]) => {
		search[key] = val;
		searchAll[key] = [...searchAll.hasOwnProperty(key) ? searchAll[key] : [], val];
	});
	let { protocol, origin, pathnameAbsoluteWithBase } = getPathnameAbsoluteWithBase(urlWithoutHashNorSearch, baseServer);
	const pathnameOriginal = urlWithoutHashNorSearch.slice((origin || "").length);
	assertUrlComponents(url, origin, pathnameOriginal, searchOriginal, hashOriginal);
	let { pathname, isBaseMissing } = removeBaseServer(pathnameAbsoluteWithBase, baseServer);
	const href = createUrlFromComponents(origin, pathname, searchOriginal, hashOriginal);
	const { hostname, port } = parseHost(!origin ? null : origin.slice(protocol.length), url);
	pathname = decodePathname(pathname);
	assert(pathname.startsWith("/"));
	return {
		href,
		protocol,
		hostname,
		port,
		origin,
		pathname,
		pathnameOriginal,
		isBaseMissing,
		search,
		searchAll,
		searchOriginal,
		hash,
		hashOriginal
	};
}
function extractHash(url) {
	const [withoutHash, ...parts] = url.split("#");
	return {
		hashString: ["", ...parts].join("#") || null,
		withoutHash
	};
}
function extractSearch(url) {
	const [withoutSearch, ...parts] = url.split("?");
	return {
		searchString: ["", ...parts].join("?") || null,
		withoutSearch
	};
}
function decodeSafe(urlComponent) {
	try {
		return decodeURIComponent(urlComponent);
	} catch {}
	try {
		return decodeURI(urlComponent);
	} catch {}
	return urlComponent;
}
function decodePathname(urlPathname) {
	urlPathname = urlPathname.replace(/\s+$/, "");
	urlPathname = urlPathname.split("/").map((dir) => decodeSafe(dir).split("/").join("%2F")).join("/");
	return urlPathname;
}
function getPathnameAbsoluteWithBase(url, baseServer) {
	assert(!url.includes("?") && !url.includes("#"));
	{
		const { protocol, origin, pathname } = parseOrigin(url);
		if (origin) return {
			protocol,
			origin,
			pathnameAbsoluteWithBase: pathname
		};
		assert(pathname === url);
	}
	if (url.startsWith("/")) return {
		protocol: null,
		origin: null,
		pathnameAbsoluteWithBase: url
	};
	else {
		const baseURI = getBaseURI();
		let base;
		if (baseURI) base = parseOrigin(baseURI.split("?")[0].split("#")[0]).pathname;
		else base = baseServer;
		return {
			protocol: null,
			origin: null,
			pathnameAbsoluteWithBase: resolveUrlPathnameRelative(url, base)
		};
	}
}
function getBaseURI() {
	return typeof window !== "undefined" ? window?.document?.baseURI : void 0;
}
function parseOrigin(url) {
	if (!isUrlWithWebProtocol(url)) return {
		pathname: url,
		origin: null,
		protocol: null
	};
	else {
		const { protocol, uriWithoutProtocol } = parseProtocol(url);
		assert(protocol);
		const [host, ...rest] = uriWithoutProtocol.split("/");
		const origin = protocol + host;
		return {
			pathname: "/" + rest.join("/"),
			origin,
			protocol
		};
	}
}
function parseHost(host, url) {
	const ret = {
		hostname: null,
		port: null
	};
	if (!host) return ret;
	const parts = host.split(":");
	if (parts.length > 1) {
		const port = parseInt(parts.pop(), 10);
		assert(port || port === 0, url);
		ret.port = port;
	}
	ret.hostname = parts.join(":");
	return ret;
}
function parseProtocol(uri) {
	const SEP = ":";
	const [before, ...after] = uri.split(SEP);
	if (after.length === 0 || !/^[a-z][a-z0-9\+\-]*$/i.test(before)) return {
		protocol: null,
		uriWithoutProtocol: uri
	};
	let protocol = before + SEP;
	let uriWithoutProtocol = after.join(SEP);
	const SEP2 = "//";
	if (uriWithoutProtocol.startsWith(SEP2)) {
		protocol = protocol + SEP2;
		uriWithoutProtocol = uriWithoutProtocol.slice(2);
	}
	return {
		protocol,
		uriWithoutProtocol
	};
}
function isWebUrlProtocol(protocol) {
	if (["ipfs://", "ipns://"].includes(protocol)) return false;
	return protocol.endsWith("://");
}
function resolveUrlPathnameRelative(pathnameRelative, base) {
	const stack = base.split("/");
	const parts = pathnameRelative.split("/");
	let baseRestoreTrailingSlash = base.endsWith("/");
	if (pathnameRelative.startsWith(".")) stack.pop();
	for (const i in parts) {
		const p = parts[i];
		if (p == "" && i === "0") continue;
		if (p == ".") continue;
		if (p == "..") stack.pop();
		else {
			baseRestoreTrailingSlash = false;
			stack.push(p);
		}
	}
	let pathnameAbsolute = stack.join("/");
	if (baseRestoreTrailingSlash && !pathnameAbsolute.endsWith("/")) pathnameAbsolute += "/";
	if (!pathnameAbsolute.startsWith("/")) pathnameAbsolute = "/" + pathnameAbsolute;
	return pathnameAbsolute;
}
function removeBaseServer(pathnameAbsoluteWithBase, baseServer) {
	assert(pathnameAbsoluteWithBase.startsWith("/"));
	assert(isBaseServer(baseServer));
	let urlPathname = pathnameAbsoluteWithBase;
	assert(urlPathname.startsWith("/"));
	assert(baseServer.startsWith("/"));
	if (baseServer === "/") return {
		pathname: pathnameAbsoluteWithBase,
		isBaseMissing: false
	};
	let baseServerNormalized = baseServer;
	if (baseServer.endsWith("/") && urlPathname === slice(baseServer, 0, -1)) {
		baseServerNormalized = slice(baseServer, 0, -1);
		assert(urlPathname === baseServerNormalized);
	}
	if (!urlPathname.startsWith(baseServerNormalized)) return {
		pathname: pathnameAbsoluteWithBase,
		isBaseMissing: true
	};
	assert(urlPathname.startsWith("/") || urlPathname.startsWith("http"));
	assert(urlPathname.startsWith(baseServerNormalized));
	urlPathname = urlPathname.slice(baseServerNormalized.length);
	if (!urlPathname.startsWith("/")) urlPathname = "/" + urlPathname;
	assert(urlPathname.startsWith("/"));
	return {
		pathname: urlPathname,
		isBaseMissing: false
	};
}
function isBaseServer(baseServer) {
	return baseServer.startsWith("/");
}
function assertUrlComponents(url, origin, pathnameOriginal, searchOriginal, hashOriginal) {
	assert(url === createUrlFromComponents(origin, pathnameOriginal, searchOriginal, hashOriginal));
}
function createUrlFromComponents(origin, pathname, search, hash) {
	return `${origin || ""}${pathname}${search || ""}${hash || ""}`;
}
function isUrl(url) {
	return isUrlAbsolute(url) || isUrlRelative(url);
}
function isUrlAbsolute(url) {
	return isUrlPathAbsolute(url) || isUrlWithWebProtocol(url);
}
function isUrlPathAbsolute(url) {
	return url.startsWith("/");
}
function isUrlRelative(url) {
	return [
		".",
		"?",
		"#"
	].some((c) => url.startsWith(c)) || url === "";
}
function isUrlExternal(url) {
	return !url.startsWith("/") && !isUrlRelative(url);
}
function isUrlWithWebProtocol(url) {
	const { protocol } = parseProtocol(url);
	return !!protocol && isWebUrlProtocol(protocol);
}
function assertUsageUrlAbsolute(url, errPrefix) {
	assertUsage(isUrlAbsolute(url), getErrMsg(url, errPrefix, true));
}
function getErrMsg(url, errPrefix, allowProtocol, allowUri) {
	let errMsg = `${errPrefix} is ${picocolors_browser_default.string(url)} but it should start with ${picocolors_browser_default.string("/")}`;
	if (allowProtocol) errMsg += ` or a protocol (e.g. ${picocolors_browser_default.string("http://")})`;
	if (allowUri) errMsg += `, or be ${picocolors_browser_default.string("*")}`;
	return errMsg;
}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/client/shared/getPageContextPublicClientShared.js
function getPageContextPublicClientShared(pageContext) {
	objectAssign(pageContext, { Page: pageContext.config?.Page || pageContext.exports?.Page });
	assertPropertyGetters(pageContext);
	supportVueReactiviy(pageContext);
	return getPageContextPublicClientMinimal(pageContext);
}
function getPageContextPublicClientMinimal(pageContext) {
	return getPageContextPublicShared(pageContext);
}
function supportVueReactiviy(pageContext) {
	resolveGetters(pageContext);
}
function resolveGetters(pageContext) {
	Object.entries(pageContext).forEach(([key, val]) => {
		delete pageContext[key];
		pageContext[key] = val;
	});
}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/utils/changeEnumerable.js
/** Change enumerability of an object property. */
function changeEnumerable(obj, prop, enumerable) {
	Object.defineProperty(obj, prop, {
		...Object.getOwnPropertyDescriptor(obj, prop),
		enumerable
	});
}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/shared-server-client/createPageContextShared.js
function createPageContextShared(pageContextCreated, globalConfigPublic) {
	objectAssign(pageContextCreated, globalConfigPublic);
	return pageContextCreated;
}
function createPageContextObject() {
	const pageContext = {
		_isOriginalObject: true,
		isPageContext: true
	};
	changeEnumerable(pageContext, "_isOriginalObject", false);
	return pageContext;
}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/utils/objectDefineProperty.js
function objectDefineProperty(obj, prop, { get, ...args }) {
	Object.defineProperty(obj, prop, {
		...args,
		get
	});
}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/utils/objectReplace.js
function objectReplace(objOld, objNew, except) {
	Object.keys(objOld).filter((key) => !except?.includes(key)).forEach((key) => delete objOld[key]);
	Object.defineProperties(objOld, Object.getOwnPropertyDescriptors(objNew));
}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/utils/cast.js
function cast(_thing) {}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/shared-server-client/getPageFiles/assert_exports_old_design.js
var enforceTrue = ["clientRouting"];
function assertExportValues(pageFile) {
	enforceTrue.forEach((exportName) => {
		assert(pageFile.fileExports);
		if (!(exportName in pageFile.fileExports)) return;
		const explainer = `The value of \`${exportName}\` is only allowed to be \`true\`.`;
		assertUsage(pageFile.fileExports[exportName] !== false, `${pageFile.filePath} has \`export { ${exportName} }\` with the value \`false\` which is prohibited: remove \`export { ${exportName} }\` instead. (${explainer})`);
		assertUsage(pageFile.fileExports[exportName] === true, `${pageFile.filePath} has \`export { ${exportName} }\` with a forbidden value. ${explainer}`);
	});
}
var forbiddenDefaultExports = [
	"render",
	"clientRouting",
	"prerender",
	"doNotPrerender"
];
function assertDefaultExports(defaultExportName, filePath) {
	assertUsage(!forbiddenDefaultExports.includes(defaultExportName), `${filePath} has \`export default { ${defaultExportName} }\` which is prohibited, use \`export { ${defaultExportName} }\` instead.`);
}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/shared-server-client/determinePageIdOld.js
function determinePageIdOld(filePath) {
	const pageSuffix = ".page.";
	const pageId = slice(filePath.split(pageSuffix), 0, -1).join(pageSuffix);
	assert(!pageId.includes("\\"));
	return pageId;
}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/shared-server-client/error-page.js
function isErrorPageId(pageId, _isV1Design) {
	assert(!pageId.includes("\\"));
	return pageId.includes("/_error");
}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/utils/isScriptFile.js
var extJs = [
	"js",
	"cjs",
	"mjs"
];
var extTs = [
	"ts",
	"cts",
	"mts"
];
var extJsOrTs = [...extJs, ...extTs];
var extJsx = [
	"jsx",
	"cjsx",
	"mjsx"
];
var extTsx = [
	"tsx",
	"ctsx",
	"mtsx"
];
var extJsxOrTsx = [...extJsx, ...extTsx];
var extTemplates = [
	"vue",
	"svelte",
	"marko",
	"md",
	"mdx"
];
var scriptFileExtensionList = [
	...extJsOrTs,
	...extJsxOrTsx,
	...extTemplates
];
"" + scriptFileExtensionList.join(",");
function isScriptFile(filePath) {
	return scriptFileExtensionList.some((ext) => filePath.endsWith("." + ext));
}
function isTemplateFile(filePath) {
	return extTemplates.some((ext) => filePath.endsWith("." + ext));
}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/shared-server-client/getPageFiles/fileTypes.js
var fileTypes = [
	".page",
	".page.server",
	".page.route",
	".page.client",
	".css"
];
function determineFileType(filePath) {
	if (filePath.endsWith(".css")) return ".css";
	assert(isScriptFile(filePath), filePath);
	const parts = filePath.split("/").slice(-1)[0].split(".");
	const suffix1 = parts.slice(-3)[0];
	const suffix2 = parts.slice(-2)[0];
	if (suffix2 === "page") return ".page";
	assert(suffix1 === "page", filePath);
	if (suffix2 === "server") return ".page.server";
	if (suffix2 === "client") return ".page.client";
	if (suffix2 === "route") return ".page.route";
	assert(false, filePath);
}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/shared-server-client/getPageFiles/getPageFileObject.js
function getPageFileObject(filePath) {
	const isRelevant = (pageId) => pageFile.pageId === pageId || pageFile.isDefaultPageFile && (isRendererFilePath(pageFile.filePath) || isAncestorDefaultPage(pageId, pageFile.filePath));
	const fileType = determineFileType(filePath);
	const isEnv = (env) => {
		assert(fileType !== ".page.route");
		if (env === "CLIENT_ONLY") return fileType === ".page.client" || fileType === ".css";
		if (env === "SERVER_ONLY") return fileType === ".page.server";
		if (env === "CLIENT_AND_SERVER") return fileType === ".page";
		assert(false);
	};
	const pageFile = {
		filePath,
		fileType,
		isEnv,
		isRelevant,
		isDefaultPageFile: isDefaultFilePath(filePath),
		isRendererPageFile: fileType !== ".css" && isDefaultFilePath(filePath) && isRendererFilePath(filePath),
		isErrorPageFile: isErrorPageId(filePath, false),
		pageId: determinePageIdOld(filePath)
	};
	return pageFile;
}
function isDefaultFilePath(filePath) {
	if (isErrorPageId(filePath, false)) return false;
	return filePath.includes("/_default");
}
function isRendererFilePath(filePath) {
	return filePath.includes("/renderer/");
}
function isAncestorDefaultPage(pageId, defaultPageFilePath) {
	assert(!pageId.endsWith("/"));
	assert(!defaultPageFilePath.endsWith("/"));
	assert(isDefaultFilePath(defaultPageFilePath));
	const defaultPageDir = slice(defaultPageFilePath.split("/"), 0, -1).filter((filePathSegment) => filePathSegment !== "_default").join("/");
	return pageId.startsWith(defaultPageDir);
}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/shared-server-client/page-configs/assertPlusFileExport.js
var SIDE_EXPORTS_TOLERATE = ["$$registrations", "_rerender_only"];
var SIDE_EXPORTS_DO_NOT_CHECK = [".md", ".mdx"];
var SIDE_EXPORTS_DO_NOT_CHECK_CONFIG = ["server"];
function assertPlusFileExport(fileExports, filePathToShowToUser, configName) {
	const exportNames = Object.keys(fileExports);
	const isValid = (exportName) => exportName === "default" || exportName === configName;
	const exportNamesValid = exportNames.filter(isValid);
	const exportDefault = picocolors_browser_default.code("export default");
	const exportNamed = picocolors_browser_default.code(`export { ${configName} }`);
	if (exportNamesValid.length === 0) assertUsage(false, `${filePathToShowToUser} should define ${exportNamed} or ${exportDefault}`);
	if (exportNamesValid.length === 2) assertUsage(false, `${filePathToShowToUser} is ambiguous: remove ${exportDefault} or ${exportNamed}`);
	assert(exportNamesValid.length === 1);
	if (!(SIDE_EXPORTS_DO_NOT_CHECK_CONFIG.includes(configName) || SIDE_EXPORTS_DO_NOT_CHECK.some((ext) => filePathToShowToUser.endsWith(ext)))) exportNames.filter((e) => !isValid(e)).filter((exportName) => !SIDE_EXPORTS_TOLERATE.includes(exportName)).forEach((exportInvalid) => {
		assertWarning(false, `${filePathToShowToUser} unexpected ${picocolors_browser_default.cyan(`export { ${exportInvalid} }`)}, see https://vike.dev/no-side-exports`, { onlyOnce: true });
	});
}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/shared-server-client/page-configs/serialize/parsePageConfigsSerialized.js
function parsePageConfigsSerialized(pageConfigsSerialized, pageConfigGlobalSerialized) {
	const pageConfigs = pageConfigsSerialized.map((pageConfigSerialized) => {
		const configValues = parseConfigValuesSerialized(pageConfigSerialized.configValuesSerialized);
		assertRouteConfigValue(configValues);
		return {
			...pageConfigSerialized,
			configValues
		};
	});
	const pageConfigGlobal = { configValues: {} };
	{
		const configValues = parseConfigValuesSerialized(pageConfigGlobalSerialized.configValuesSerialized);
		Object.assign(pageConfigGlobal.configValues, configValues);
	}
	return {
		pageConfigs,
		pageConfigGlobal
	};
}
function assertRouteConfigValue(configValues) {
	const configName = "route";
	const configValue = configValues[configName];
	if (!configValue) return;
	const { value, definedAtData } = configValue;
	const configValueType = typeof value;
	assert(definedAtData);
	const configDefinedAt = getConfigDefinedAt("Config", configName, definedAtData);
	assertUsage(configValueType === "string" || isCallable(value), `${configDefinedAt} has an invalid type '${configValueType}': it should be a string or a function instead, see https://vike.dev/route`);
}
function parseConfigValuesSerialized(configValuesSerialized) {
	const configValues = {};
	Object.entries(configValuesSerialized).forEach(([configName, configValueSeriliazed]) => {
		let configValue;
		if (configValueSeriliazed.type === "cumulative") {
			const { valueSerialized, ...common } = configValueSeriliazed;
			configValue = {
				value: valueSerialized.map((valueSerializedElement, i) => {
					const { value, sideExports } = parseValueSerialized(valueSerializedElement, configName, () => {
						const definedAtFile = configValueSeriliazed.definedAtData[i];
						assert(definedAtFile);
						return definedAtFile;
					});
					addSideExports(sideExports);
					return value;
				}),
				...common
			};
		} else {
			const { valueSerialized, ...common } = configValueSeriliazed;
			const { value, sideExports } = parseValueSerialized(valueSerialized, configName, () => {
				assert(configValueSeriliazed.type !== "computed");
				const { definedAtData } = configValueSeriliazed;
				return Array.isArray(definedAtData) ? definedAtData[0] : definedAtData;
			});
			addSideExports(sideExports);
			configValue = {
				value,
				...common
			};
		}
		configValues[configName] = configValue;
	});
	return configValues;
	function addSideExports(sideExports) {
		sideExports.forEach((sideExport) => {
			const { configName, configValue } = sideExport;
			if (!configValues[configName]) configValues[configName] = configValue;
		});
	}
}
function parseValueSerialized(valueSerialized, configName, getDefinedAtFile) {
	if (valueSerialized.type === "js-serialized") {
		let { value } = valueSerialized;
		value = parseTransform(value);
		return {
			value,
			sideExports: []
		};
	}
	if (valueSerialized.type === "pointer-import") {
		const { value } = valueSerialized;
		return {
			value,
			sideExports: []
		};
	}
	if (valueSerialized.type === "plus-file") {
		const definedAtFile = getDefinedAtFile();
		const { exportValues } = valueSerialized;
		assert(!definedAtFile.definedBy);
		assertPlusFileExport(exportValues, definedAtFile.filePathToShowToUser, configName);
		let value;
		let valueWasFound = false;
		const sideExports = [];
		Object.entries(exportValues).forEach(([exportName, exportValue]) => {
			if (!(exportName !== "default" && exportName !== configName)) {
				value = exportValue;
				assert(!valueWasFound);
				valueWasFound = true;
			} else sideExports.push({
				configName: exportName,
				configValue: {
					type: "standard",
					value: exportValue,
					definedAtData: {
						filePathToShowToUser: definedAtFile.filePathToShowToUser,
						fileExportPathToShowToUser: [exportName]
					}
				}
			});
		});
		assert(valueWasFound);
		return {
			value,
			sideExports
		};
	}
	assert(false);
}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/shared-server-client/assertVirtualFileExports.js
function assertVirtualFileExports(moduleExports, test, moduleId) {
	assert(moduleExports, typeof moduleExports);
	if (!test(moduleExports)) assert(false, {
		moduleExports,
		moduleExportsKeys: getKeys(moduleExports),
		moduleId
	});
}
function getKeys(obj) {
	return [
		...Object.getOwnPropertyNames(obj),
		...Object.getOwnPropertySymbols(obj),
		...Object.keys(obj)
	];
}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/shared-server-client/getPageFiles/parseVirtualFileExportsGlobalEntry.js
function parseVirtualFileExportsGlobalEntry(virtualFileExportsGlobalEntry) {
	assertVirtualFileExports(virtualFileExportsGlobalEntry, (moduleExports) => "pageFilesLazy" in moduleExports);
	assert(hasProp(virtualFileExportsGlobalEntry, "pageFilesLazy", "object"));
	assert(hasProp(virtualFileExportsGlobalEntry, "pageFilesEager", "object"));
	assert(hasProp(virtualFileExportsGlobalEntry, "pageFilesExportNamesLazy", "object"));
	assert(hasProp(virtualFileExportsGlobalEntry, "pageFilesExportNamesEager", "object"));
	assert(hasProp(virtualFileExportsGlobalEntry.pageFilesLazy, ".page"));
	assert(hasProp(virtualFileExportsGlobalEntry.pageFilesLazy, ".page.client") || hasProp(virtualFileExportsGlobalEntry.pageFilesLazy, ".page.server"));
	assert(hasProp(virtualFileExportsGlobalEntry, "pageFilesList", "string[]"));
	assert(hasProp(virtualFileExportsGlobalEntry, "pageConfigsSerialized"));
	assert(hasProp(virtualFileExportsGlobalEntry, "pageConfigGlobalSerialized"));
	const { pageConfigsSerialized, pageConfigGlobalSerialized } = virtualFileExportsGlobalEntry;
	assertPageConfigsSerialized(pageConfigsSerialized);
	assertPageConfigGlobalSerialized(pageConfigGlobalSerialized);
	const { pageConfigs, pageConfigGlobal } = parsePageConfigsSerialized(pageConfigsSerialized, pageConfigGlobalSerialized);
	const pageFilesMap = {};
	parseGlobResult(virtualFileExportsGlobalEntry.pageFilesLazy).forEach(({ filePath, pageFile, globValue }) => {
		pageFile = pageFilesMap[filePath] = pageFilesMap[filePath] ?? pageFile;
		const loadModule = globValue;
		assertLoadModule(loadModule);
		pageFile.loadFile = async () => {
			if (!("fileExports" in pageFile)) {
				pageFile.fileExports = await loadModule();
				assertExportValues(pageFile);
			}
		};
	});
	parseGlobResult(virtualFileExportsGlobalEntry.pageFilesExportNamesLazy).forEach(({ filePath, pageFile, globValue }) => {
		pageFile = pageFilesMap[filePath] = pageFilesMap[filePath] ?? pageFile;
		const loadModule = globValue;
		assertLoadModule(loadModule);
		pageFile.loadExportNames = async () => {
			if (!("exportNames" in pageFile)) {
				const moduleExports = await loadModule();
				assert(hasProp(moduleExports, "exportNames", "string[]"), pageFile.filePath);
				pageFile.exportNames = moduleExports.exportNames;
			}
		};
	});
	parseGlobResult(virtualFileExportsGlobalEntry.pageFilesEager).forEach(({ filePath, pageFile, globValue }) => {
		pageFile = pageFilesMap[filePath] = pageFilesMap[filePath] ?? pageFile;
		const moduleExports = globValue;
		assert(isObject(moduleExports));
		pageFile.fileExports = moduleExports;
	});
	parseGlobResult(virtualFileExportsGlobalEntry.pageFilesExportNamesEager).forEach(({ filePath, pageFile, globValue }) => {
		pageFile = pageFilesMap[filePath] = pageFilesMap[filePath] ?? pageFile;
		const moduleExports = globValue;
		assert(isObject(moduleExports));
		assert(hasProp(moduleExports, "exportNames", "string[]"), pageFile.filePath);
		pageFile.exportNames = moduleExports.exportNames;
	});
	virtualFileExportsGlobalEntry.pageFilesList.forEach((filePath) => {
		pageFilesMap[filePath] = pageFilesMap[filePath] ?? getPageFileObject(filePath);
	});
	const pageFilesAll = Object.values(pageFilesMap);
	pageFilesAll.forEach(({ filePath }) => {
		assert(!filePath.includes("\\"));
	});
	return {
		pageFilesAll,
		pageConfigs,
		pageConfigGlobal
	};
}
function parseGlobResult(globObject) {
	const ret = [];
	Object.entries(globObject).forEach(([fileType, globFiles]) => {
		cast(fileType);
		assert(fileTypes.includes(fileType));
		assert(isObject(globFiles));
		Object.entries(globFiles).forEach(([filePath, globValue]) => {
			const pageFile = getPageFileObject(filePath);
			assert(pageFile.fileType === fileType);
			ret.push({
				filePath,
				pageFile,
				globValue
			});
		});
	});
	return ret;
}
function assertLoadModule(globValue) {
	assert(isCallable(globValue));
}
function assertPageConfigsSerialized(pageConfigsSerialized) {
	assert(isArray(pageConfigsSerialized));
	pageConfigsSerialized.forEach((pageConfigSerialized) => {
		assert(isObject(pageConfigSerialized));
		assert(hasProp(pageConfigSerialized, "pageId", "string"));
		assert(hasProp(pageConfigSerialized, "routeFilesystem"));
		assert(hasProp(pageConfigSerialized, "configValuesSerialized"));
	});
}
function assertPageConfigGlobalSerialized(pageConfigGlobalSerialized) {
	assert(hasProp(pageConfigGlobalSerialized, "configValuesSerialized"));
}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/utils/sorter.js
/**
* ```js
* let arr = [
*   { price: 10 },
*   { price: 1000 },
*   { price: 100 }
* ]
* arr = arr.sort(higherFirst(el => el.price))
* isEqual(arr, [
*   { price: 1000 },
*   { price: 100 },
*   { price: 10 }
* ])
* ```
*/
function higherFirst(getValue) {
	return (element1, element2) => {
		const val1 = getValue(element1);
		const val2 = getValue(element2);
		if (val1 === val2) return 0;
		return val1 > val2 ? -1 : 1;
	};
}
/**
* ```js
* let arr = [
*   { price: 10 },
*   { price: 1000 },
*   { price: 100 }
* ]
* arr = arr.sort(lowerFirst(el => el.price))
* isEqual(arr, [
*   { price: 10 },
*   { price: 100 },
*   { price: 1000 }
* ])
* ```
*/
function lowerFirst(getValue) {
	return (element1, element2) => {
		const val1 = getValue(element1);
		const val2 = getValue(element2);
		if (val1 === val2) return 0;
		return val1 < val2 ? -1 : 1;
	};
}
/**
* ```js
* let arr = [
*  { name: 'iphone', isRocket: false },
*  { name: 'starship', isRocket: true }
* ]
* arr = arr.sort(makeFirst(el => el.isRocket))
* isEqual(arr, [
*  { name: 'starship', isRocket: true },
*  { name: 'iphone', isRocket: false }
* ])
* ```
*/
function makeFirst(getValue) {
	return (element1, element2) => {
		const val1 = getValue(element1);
		const val2 = getValue(element2);
		assert([
			true,
			false,
			null
		].includes(val1));
		assert([
			true,
			false,
			null
		].includes(val2));
		if (val1 === val2) return 0;
		if (val1 === true || val2 === false) return -1;
		if (val2 === true || val1 === false) return 1;
		assert(false);
	};
}
/**
* ```js
* let arr = [
*  { name: 'starship', isRocket: true },
*  { name: 'iphone', isRocket: false }
* ]
* arr = arr.sort(makeLast(el => el.isRocket))
* isEqual(arr, [
*  { name: 'iphone', isRocket: false },
*  { name: 'starship', isRocket: true }
* ])
* ```
*/
function makeLast(getValue) {
	return makeFirst((element) => {
		const val = getValue(element);
		if (val === null) return null;
		else return !val;
	});
}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/shared-server-client/page-configs/resolveVikeConfigPublic.js
function resolveGlobalConfigPublicPage(pageConfigGlobalValues, pageConfig, pageConfigValues) {
	const pageConfigPublic = getPublicCopy(resolvePageConfigPublic({
		pageConfigGlobalValues,
		pageConfigValues
	}));
	const page = (() => {
		if (!pageConfig.isErrorPage) {
			const route = pageConfigPublic.config.route ?? pageConfig.routeFilesystem.routeString;
			return {
				...pageConfigPublic,
				route
			};
		} else return {
			...pageConfigPublic,
			isErrorPage: true
		};
	})();
	return [pageConfig.pageId, page];
}
function getPublicCopy(configInternal) {
	return {
		config: configInternal.config,
		_source: configInternal.source,
		_sources: configInternal.sources,
		_from: configInternal.from
	};
}
function resolvePageConfigPublic({ pageConfigGlobalValues, pageConfigValues }) {
	return resolveConfigPublic_V1Design({ configValues: {
		...pageConfigGlobalValues,
		...pageConfigValues
	} });
}
function resolvePageContextConfig(pageFiles, pageConfig, pageConfigGlobal) {
	const config = {};
	const configEntries = {};
	const exportsAll = {};
	pageFiles.forEach((pageFile) => {
		getExportValues(pageFile).forEach(({ exportName, exportValue, isFromDefaultExport }) => {
			assert(exportName !== "default");
			exportsAll[exportName] = exportsAll[exportName] ?? [];
			exportsAll[exportName].push({
				exportValue,
				exportSource: `${pageFile.filePath} > ${isFromDefaultExport ? `\`export default { ${exportName} }\`` : `\`export { ${exportName} }\``}`,
				filePath: pageFile.filePath,
				_filePath: pageFile.filePath,
				_fileType: pageFile.fileType,
				_isFromDefaultExport: isFromDefaultExport
			});
		});
	});
	let source;
	let sources;
	let from;
	if (pageConfig) {
		const res = resolvePageConfigPublic({
			pageConfigGlobalValues: pageConfigGlobal.configValues,
			pageConfigValues: pageConfig.configValues
		});
		source = res.source;
		sources = res.sources;
		from = res.from;
		Object.assign(config, res.config);
		Object.assign(configEntries, res.configEntries);
		Object.assign(exportsAll, res.exportsAll);
	} else {
		source = {};
		sources = {};
		from = {
			configsStandard: {},
			configsCumulative: {},
			configsComputed: {}
		};
	}
	const pageExports = {};
	const exports = {};
	Object.entries(exportsAll).forEach(([exportName, values]) => {
		values.forEach(({ exportValue, _fileType, _isFromDefaultExport }) => {
			exports[exportName] = exports[exportName] ?? exportValue;
			if (_fileType === ".page" && !_isFromDefaultExport) {
				if (!(exportName in pageExports)) pageExports[exportName] = exportValue;
			}
		});
	});
	assert(!("default" in exports));
	assert(!("default" in exportsAll));
	const pageContextAddendum = {
		config,
		from,
		source,
		sources,
		configEntries,
		exports,
		exportsAll
	};
	objectDefineProperty(pageContextAddendum, "pageExports", {
		get: () => {
			if (!isBrowser()) assertWarning(false, "pageContext.pageExports is outdated, use pageContext.exports instead", {
				onlyOnce: true,
				showStackTrace: true
			});
			return pageExports;
		},
		enumerable: false,
		configurable: true
	});
	return pageContextAddendum;
}
function resolveGlobalContextConfig(pageConfigs, pageConfigGlobal) {
	return resolveGlobalConfigPublic(pageConfigs, pageConfigGlobal, (c) => c.configValues);
}
function resolveGlobalConfigPublic(pageConfigs, pageConfigGlobal, getConfigValues) {
	const pageConfigGlobalValues = getConfigValues(pageConfigGlobal, true);
	const globalConfigPublicBase = getPublicCopy(resolveConfigPublic_V1Design({ configValues: pageConfigGlobalValues }));
	const pages = Object.fromEntries(pageConfigs.map((pageConfig) => {
		return resolveGlobalConfigPublicPage(pageConfigGlobalValues, pageConfig, getConfigValues(pageConfig));
	}));
	const globalConfigPublic = {
		...globalConfigPublicBase,
		pages
	};
	return {
		...globalConfigPublic,
		_globalConfigPublic: globalConfigPublic
	};
}
function resolveConfigPublic_V1Design(pageConfig) {
	const config = {};
	const configEntries = {};
	const exportsAll = {};
	const source = {};
	const sources = {};
	const from = {
		configsStandard: {},
		configsCumulative: {},
		configsComputed: {}
	};
	const addSrc = (src, configName) => {
		source[configName] = src;
		sources[configName] ?? (sources[configName] = []);
		sources[configName].push(src);
	};
	const addLegacy = (configName, value, definedAtData) => {
		const configValueFilePathToShowToUser = getConfigValueFilePathToShowToUser(definedAtData);
		const configDefinedAt = getConfigDefinedAtOptional("Config", configName, definedAtData);
		configEntries[configName] = configEntries[configName] ?? [];
		configEntries[configName].push({
			configValue: value,
			configDefinedAt,
			configDefinedByFile: configValueFilePathToShowToUser
		});
		const exportName = configName;
		exportsAll[exportName] = exportsAll[exportName] ?? [];
		exportsAll[exportName].push({
			exportValue: value,
			exportSource: configDefinedAt,
			filePath: configValueFilePathToShowToUser,
			_filePath: configValueFilePathToShowToUser,
			_fileType: null,
			_isFromDefaultExport: null
		});
	};
	Object.entries(pageConfig.configValues).forEach(([configName, configValue]) => {
		const { value } = configValue;
		config[configName] = config[configName] ?? value;
		if (configValue.type === "standard") {
			const src = {
				type: "configsStandard",
				value: configValue.value,
				definedAt: getDefinedAtString(configValue.definedAtData, configName)
			};
			addSrc(src, configName);
			from.configsStandard[configName] = src;
			addLegacy(configName, value, configValue.definedAtData);
		}
		if (configValue.type === "cumulative") {
			const src = {
				type: "configsCumulative",
				definedAt: getDefinedAtString(configValue.definedAtData, configName),
				values: configValue.value.map((value, i) => {
					const definedAtFile = configValue.definedAtData[i];
					assert(definedAtFile);
					const definedAt = getDefinedAtString(definedAtFile, configName);
					addLegacy(configName, value, definedAtFile);
					return {
						value,
						definedAt
					};
				})
			};
			addSrc(src, configName);
			from.configsCumulative[configName] = src;
		}
		if (configValue.type === "computed") {
			const src = {
				type: "configsComputed",
				definedAt: "Vike",
				value: configValue.value
			};
			addSrc(src, configName);
			from.configsComputed[configName] = src;
			addLegacy(configName, value, configValue.definedAtData);
		}
	});
	return {
		config,
		configEntries,
		exportsAll,
		source,
		sources,
		from
	};
}
function getExportValues(pageFile) {
	const { filePath, fileExports } = pageFile;
	assert(fileExports);
	assert(isScriptFile(filePath));
	const exportValues = [];
	Object.entries(fileExports).sort(makeLast(([exportName]) => exportName === "default")).forEach(([exportName, exportValue]) => {
		let isFromDefaultExport = exportName === "default";
		if (isFromDefaultExport) if (isTemplateFile(filePath)) exportName = "Page";
		else {
			assertUsage(isObject(exportValue), `The ${picocolors_browser_default.cyan("export default")} of ${filePath} should be an object.`);
			Object.entries(exportValue).forEach(([defaultExportName, defaultExportValue]) => {
				assertDefaultExports(defaultExportName, filePath);
				exportValues.push({
					exportName: defaultExportName,
					exportValue: defaultExportValue,
					isFromDefaultExport
				});
			});
			return;
		}
		exportValues.push({
			exportName,
			exportValue,
			isFromDefaultExport
		});
	});
	exportValues.forEach(({ exportName, isFromDefaultExport }) => {
		assert(!(isFromDefaultExport && forbiddenDefaultExports.includes(exportName)));
	});
	return exportValues;
}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/shared-server-client/createGlobalContextShared.js
async function createGlobalContextShared(virtualFileExportsGlobalEntry, globalObject, addGlobalContext, addGlobalContextTmp, addGlobalContextAsync) {
	const { previousCreateGlobalContextPromise } = globalObject;
	const { promise, resolve } = genPromise({ timeout: null });
	globalObject.previousCreateGlobalContextPromise = promise;
	if (previousCreateGlobalContextPromise) {
		assert(globalObject.globalContext);
		await previousCreateGlobalContextPromise;
	}
	try {
		const globalContext = createGlobalContextBase(virtualFileExportsGlobalEntry);
		let isNewGlobalContext;
		if (!globalObject.globalContext) {
			globalObject.globalContext = globalContext;
			isNewGlobalContext = false;
		} else isNewGlobalContext = true;
		if (addGlobalContext && globalContext._pageConfigs.length > 0) {
			const globalContextAdded = addGlobalContext?.(globalContext);
			objectAssign(globalContext, globalContextAdded);
		} else objectAssign(globalContext, await addGlobalContextTmp?.(globalContext));
		objectAssign(globalContext, await addGlobalContextAsync?.(globalContext));
		const onCreateGlobalContextHooks = getHooksFromPageConfigGlobalCumulative(globalContext._pageConfigGlobal, "onCreateGlobalContext");
		let hooksCalled = false;
		if (!hooksAreEqual(globalObject.onCreateGlobalContextHooks ?? [], onCreateGlobalContextHooks)) {
			globalObject.onCreateGlobalContextHooks = onCreateGlobalContextHooks;
			await execHookGlobal("onCreateGlobalContext", globalContext, getGlobalContextPublicShared);
			hooksCalled = true;
		}
		if (isNewGlobalContext) if (hooksCalled) objectReplace(globalObject.globalContext, globalContext);
		else objectAssign(globalObject.globalContext, globalContext, true);
		return globalObject.globalContext;
	} finally {
		resolve();
	}
}
function createGlobalContextBase(virtualFileExportsGlobalEntry) {
	const { pageFilesAll, pageConfigs, pageConfigGlobal } = parseVirtualFileExportsGlobalEntry(virtualFileExportsGlobalEntry);
	const globalContext = {
		isGlobalContext: true,
		_isOriginalObject: true,
		_virtualFileExportsGlobalEntry: virtualFileExportsGlobalEntry,
		_pageFilesAll: pageFilesAll,
		_pageConfigs: pageConfigs,
		_pageConfigGlobal: pageConfigGlobal,
		_allPageIds: getAllPageIds(pageFilesAll, pageConfigs),
		...resolveGlobalContextConfig(pageConfigs, pageConfigGlobal)
	};
	changeEnumerable(globalContext, "_isOriginalObject", false);
	return globalContext;
}
function getAllPageIds(pageFilesAll, pageConfigs) {
	const allPageIds = unique(pageFilesAll.filter(({ isDefaultPageFile }) => !isDefaultPageFile).map(({ pageId }) => pageId));
	const allPageIds2 = pageConfigs.map((p) => p.pageId);
	return [...allPageIds, ...allPageIds2];
}
function hooksAreEqual(hooks1, hooks2) {
	const hooksFn1 = hooks1.map((hook) => hook.hookFn);
	const hooksFn2 = hooks2.map((hook) => hook.hookFn);
	return hooksFn1.every((hook) => hooksFn2.includes(hook)) && hooksFn2.every((hook) => hooksFn1.includes(hook));
}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/client/shared/getGlobalContextClientInternalShared.js
var globalObject = getGlobalObject("getGlobalContextClientInternalShared.ts", (() => {
	const { promise: globalContextInitialPromise, resolve: globalContextInitialPromiseResolve } = genPromise();
	return {
		globalContextInitialPromise,
		globalContextInitialPromiseResolve
	};
})());
async function getGlobalContextClientInternalShared() {
	if (globalObject.globalContextPromise) return await globalObject.globalContextPromise;
	const globalContextPromise = createGlobalContextShared(globalObject.virtualFileExportsGlobalEntry, globalObject, () => {
		const globalContextAddendum = { isClientSide: true };
		objectAssign(globalContextAddendum, getGlobalContextSerializedInHtml());
		return globalContextAddendum;
	});
	globalObject.globalContextPromise = globalContextPromise;
	const globalContext = await globalContextPromise;
	assert(globalObject.globalContext === globalContext);
	globalObject.globalContextInitialPromiseResolve();
	return globalContext;
}
async function setVirtualFileExportsGlobalEntry(virtualFileExportsGlobalEntry) {
	if (globalObject.virtualFileExportsGlobalEntry !== virtualFileExportsGlobalEntry) {
		delete globalObject.globalContextPromise;
		globalObject.virtualFileExportsGlobalEntry = virtualFileExportsGlobalEntry;
		await getGlobalContextClientInternalShared();
	}
}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/utils/assertRoutingType.js
var state = getGlobalObject("utils/assertRouterType.ts", {});
function assertClientRouting() {
	assertNoContradiction(checkIfClientRouting());
	state.isClientRouting = true;
}
function checkIfClientRouting() {
	return state.isClientRouting !== false;
}
function assertServerRouting() {
	assertNoContradiction(state.isClientRouting !== true);
	state.isClientRouting = false;
}
function assertNoContradiction(noContradiction) {
	assertUsage(isBrowser(), `${picocolors_browser_default.cyan("import { something } from 'vike/client/router'")} is forbidden on the server-side`, { showStackTrace: true });
	assertWarning(noContradiction, "You shouldn't `import { something } from 'vike/client/router'` when using Server Routing. The 'vike/client/router' utilities work only with Client Routing. In particular, don't `import { navigate }` nor `import { prefetch }` as they unnecessarily bloat your client-side bundle sizes.", {
		showStackTrace: true,
		onlyOnce: true
	});
}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/shared-server-client/page-configs/findPageConfig.js
function findPageConfig(pageConfigs, pageId) {
	const result = pageConfigs.filter((p) => p.pageId === pageId);
	assert(result.length <= 1);
	return result[0] ?? null;
}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/shared-server-client/page-configs/loadAndParseVirtualFilePageEntry.js
async function loadAndParseVirtualFilePageEntry(pageConfig, isDev) {
	if ("isPageEntryLoaded" in pageConfig && !isDev) return pageConfig;
	const { moduleId, moduleExportsPromise } = pageConfig.loadVirtualFilePageEntry();
	const moduleExports = await moduleExportsPromise;
	assertVirtualFileExports(moduleExports, () => "configValuesSerialized" in moduleExports, moduleId);
	const virtualFileExportsPageEntry = moduleExports;
	let configValues;
	try {
		configValues = parseVirtualFileExportsPageEntry(virtualFileExportsPageEntry);
	} catch (e) {
		if (!(e instanceof ReferenceError) && !(e instanceof TypeError)) throw e;
		await new Promise((resolve) => setTimeout(resolve));
		configValues = parseVirtualFileExportsPageEntry(virtualFileExportsPageEntry);
	}
	Object.assign(pageConfig.configValues, configValues);
	objectAssign(pageConfig, { isPageEntryLoaded: true });
	return pageConfig;
}
function parseVirtualFileExportsPageEntry(virtualFileExportsPageEntry) {
	return parseConfigValuesSerialized(virtualFileExportsPageEntry.configValuesSerialized);
}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/client/shared/loadPageConfigsLazyClientSide.js
var errStamp = "_isAssetsError";
async function loadPageConfigsLazyClientSide(pageId, pageFilesAll, pageConfigs, pageConfigGlobal) {
	const pageFilesClientSide = getPageFilesClientSide(pageFilesAll, pageId);
	const pageConfig = findPageConfig(pageConfigs, pageId);
	let pageConfigLoaded;
	try {
		pageConfigLoaded = (await Promise.all([pageConfig && loadAndParseVirtualFilePageEntry(pageConfig, false), ...pageFilesClientSide.map((p) => p.loadFile?.())]))[0];
	} catch (err) {
		if (isFetchError(err)) Object.assign(err, { [errStamp]: true });
		throw err;
	}
	const pageContextAddendum = {};
	objectAssign(pageContextAddendum, resolvePageContextConfig(pageFilesClientSide, pageConfigLoaded, pageConfigGlobal));
	objectAssign(pageContextAddendum, { _pageFilesLoaded: pageFilesClientSide });
	return pageContextAddendum;
}
function isErrorFetchingStaticAssets(err) {
	if (!err) return false;
	return err[errStamp] === true;
}
function isFetchError(err) {
	if (!(err instanceof Error)) return false;
	return [
		"Failed to fetch dynamically imported module",
		"error loading dynamically imported module",
		"Importing a module script failed",
		"error resolving module specifier",
		"failed to resolve module"
	].some((s) => err.message.toLowerCase().includes(s.toLowerCase()));
}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/client/shared/normalizeClientSideUrl.js
/** Resolves relative URLs */
function normalizeClientSideUrl(url, options) {
	assert(!url.startsWith("#"));
	const { searchOriginal, hashOriginal, pathname } = parseUrl(url, "/");
	let urlCurrent = `${pathname}${searchOriginal || ""}`;
	if (!options?.withoutHash) urlCurrent += hashOriginal || "";
	assert(urlCurrent.startsWith("/"));
	return urlCurrent;
}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/client/shared/execHookOnRenderClient.js
async function execHookOnRenderClient(pageContext, getPageContextPublic) {
	let hook = null;
	hook = getHookFromPageContext(pageContext, "render");
	{
		const renderHook = getHookFromPageContext(pageContext, "onRenderClient");
		if (renderHook) hook = renderHook;
	}
	if (!hook) {
		const urlToShowToUser = getUrlToShowToUser(pageContext);
		assert(urlToShowToUser);
		if (pageContext._globalContext._pageConfigs.length > 0) assertUsage(false, `No onRenderClient() hook defined for URL '${urlToShowToUser}', but it's needed, see https://vike.dev/onRenderClient`);
		else {
			const pageClientsFilesLoaded = pageContext._pageFilesLoaded.filter((p) => p.fileType === ".page.client");
			let errMsg;
			if (pageClientsFilesLoaded.length === 0) errMsg = "No file `*.page.client.*` found for URL " + urlToShowToUser;
			else errMsg = "One of the following files should export a render() hook: " + pageClientsFilesLoaded.map((p) => p.filePath).join(" ");
			assertUsage(false, errMsg);
		}
	}
	await execHookSingle(hook, pageContext, getPageContextPublic);
}
function getUrlToShowToUser(pageContext) {
	let url;
	try {
		url = pageContext.urlPathname ?? pageContext.urlOriginal;
	} catch {}
	url = url ?? window.location.href;
	return url;
}
//#endregion
//#region ../../node_modules/.pnpm/vike@0.4.258_@cloudflare+workers-types@4.20260702.1_hono@4.13.3_react-streaming@0.4.3_r_f9626dad2d1aa69d4216c8456c7e67ee/node_modules/vike/dist/client/shared/getCurrentUrl.js
function getCurrentUrl(options) {
	return normalizeClientSideUrl(window.location.href, options);
}
//#endregion
export { getProjectError as $, updateType as A, getHookFromPageConfigGlobal as B, isUrlExternal as C, getPageFilesServerSide as D, getPageFilesClientSide as E, execHookSingleSync as F, checkType as G, isCallable as H, providePageContext as I, isObject as J, getPageConfig as K, assertPropertyGetters as L, hasProp as M, genPromise as N, getPageContextSerializedInHtml as O, execHook as P, assertWarning as Q, getPageContextPublicShared as R, isUrl as S, slice as T, getConfigValueRuntime as U, getHookTimeoutDefault as V, getDefinedAtString as W, assertInfo as X, assert as Y, assertUsage as Z, createPageContextShared as _, loadPageConfigsLazyClientSide as a, assertUsageUrlAbsolute as b, assertServerRouting as c, higherFirst as d, assertSingleInstance_onClientEntryServerRouting as et, lowerFirst as f, createPageContextObject as g, objectDefineProperty as h, isErrorFetchingStaticAssets as i, objectAssign as j, parse as k, getGlobalContextClientInternalShared as l, isErrorPageId as m, execHookOnRenderClient as n, getGlobalObject as nt, findPageConfig as o, makeFirst as p, isArray as q, normalizeClientSideUrl as r, assertClientRouting as s, getCurrentUrl as t, picocolors_browser_default as tt, setVirtualFileExportsGlobalEntry as u, changeEnumerable as v, parseUrl as w, isBaseServer as x, getPageContextPublicClientShared as y, isBrowser as z };
