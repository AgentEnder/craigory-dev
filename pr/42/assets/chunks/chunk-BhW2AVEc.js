/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/utils/unique.js [vike:pluginModuleBanner] */
function unique(arr) {
    return Array.from(new Set(arr));
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/utils/getGlobalObject.js [vike:pluginModuleBanner] */
/**
 * Share information across module instances.
 *
 * @__NO_SIDE_EFFECTS__
 */
function getGlobalObject(moduleId, defaultValue) {
    const globals = getGlobals();
    const globalObject = (globals[moduleId] ?? (globals[moduleId] = defaultValue));
    return globalObject;
}
function getGlobals() {
    var _a;
    globalThis._vike ?? (globalThis._vike = {});
    (_a = globalThis._vike).globals ?? (_a.globals = {});
    return globalThis._vike.globals;
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/@brillout+picocolors@1.0.30/node_modules/@brillout/picocolors/dist/picocolors.browser.js [vike:pluginModuleBanner] */
const pc = new Proxy({}, {
    get: (_, p) => (s) => {
        if (p === 'code')
            return `\`${s}\``;
        if (p === 'string')
            return `'${s}'`;
        return s;
    }
});

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/utils/PROJECT_VERSION.js [vike:pluginModuleBanner] */
// Automatically updated by @brillout/release-me
const PROJECT_VERSION = '0.4.258';

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/utils/assertSingleInstance.js [vike:pluginModuleBanner] */
/* Use original assertWarning() after all CJS is removed from node_modules/vike/dist/
import { assertWarning } from './assert.js'
*/
let globalObject$4;
// getGlobalObjectSafe() can be called before this line
globalObject$4 ?? (globalObject$4 = genGlobalConfig());
function genGlobalConfig() {
    return getGlobalObject('utils/assertSingleInstance.ts', {
        instances: [],
        alreadyLogged: new Set(),
    });
}
// We need getGlobalObjectSafe() because globalObject is `undefined` when exported functions are called before globalObject is initialized
function getGlobalObjectSafe() {
    globalObject$4 ?? (globalObject$4 = genGlobalConfig());
    return globalObject$4;
}
const clientRuntimesClonflict = 'Client runtime of both Server Routing and Client Routing loaded https://vike.dev/client-runtimes-conflict';
const clientNotSingleInstance = 'Client runtime loaded twice https://vike.dev/client-runtime-duplicated';
function assertSingleInstance() {
    const globalObject = getGlobalObjectSafe();
    {
        const versions = unique(globalObject.instances);
        assertWarning$1(versions.length <= 1, 
        // Do *NOT* patch Vike to remove this warning: you *will* eventually encounter the issues listed at https://vike.dev/warning/version-mismatch
        // - This happened before: https://github.com/vikejs/vike/issues/1108#issuecomment-1719061509
        `vike@${pc.bold(versions[0])} and vike@${pc.bold(versions[1])} loaded which is highly discouraged ${pc.underline('https://vike.dev/warning/version-mismatch')}`, { onlyOnce: true, showStackTrace: false });
    }
    if (globalObject.checkSingleInstance && globalObject.instances.length > 1) {
        /*/ Not sure whether circular dependency can cause problems? In principle not since client-side code is ESM.
        console.warn(clientNotSingleInstance)
        /*/
        assertWarning$1(false, clientNotSingleInstance, { onlyOnce: true, showStackTrace: true });
        //*/
    }
}
function assertSingleInstance_onClientEntryServerRouting(isProduction) {
    const globalObject = getGlobalObjectSafe();
    assertWarning$1(globalObject.isClientRouting !== true, clientRuntimesClonflict, {
        onlyOnce: true,
        showStackTrace: true,
    });
    assertWarning$1(globalObject.isClientRouting === undefined, clientNotSingleInstance, {
        onlyOnce: true,
        showStackTrace: true,
    });
    globalObject.isClientRouting = false;
    globalObject.checkSingleInstance = true;
    assertSingleInstance();
}
// Called by utils/assert.ts which is (most certainly) loaded by all entries. That way we don't have to call a callback for every entry. (There are a lot of entries: `client/router/`, `client/`, `server/runtime/`, `node/vite/`, `node/cli`.)
function assertSingleInstance_onAssertModuleLoad() {
    const globalObject = getGlobalObjectSafe();
    globalObject.instances.push(PROJECT_VERSION);
    assertSingleInstance();
}
function assertWarning$1(condition, errorMessage, { onlyOnce, showStackTrace }) {
    const globalObject = getGlobalObjectSafe();
    if (condition) {
        return;
    }
    const msg = `[Vike][Warning] ${errorMessage}`;
    {
        const { alreadyLogged } = globalObject;
        const key = msg ;
        if (alreadyLogged.has(key)) {
            return;
        }
        else {
            alreadyLogged.add(key);
        }
    }
    if (showStackTrace) {
        console.warn(new Error(msg));
    }
    else {
        console.warn(msg);
    }
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/utils/isNodeJS.js [vike:pluginModuleBanner] */
function isNodeJS() {
    if (typeof process === 'undefined')
        return false;
    if (!process.cwd)
        return false;
    // https://stackoverflow.com/questions/4224606/how-to-check-whether-a-script-is-running-under-node-js/35813135#35813135
    if (!process.versions || typeof process.versions.node === 'undefined')
        return false;
    // https://stackoverflow.com/questions/4224606/how-to-check-whether-a-script-is-running-under-node-js/35813135#comment92529277_35813135
    if (!process.release || process.release.name !== 'node')
        return false;
    return true;
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/utils/createErrorWithCleanStackTrace.js [vike:pluginModuleBanner] */
function createErrorWithCleanStackTrace(errorMessage, numberOfStackTraceLinesToRemove) {
    const err = new Error(errorMessage);
    if (isNodeJS()) {
        err.stack = clean(err.stack, numberOfStackTraceLinesToRemove);
    }
    return err;
}
function clean(errStack, numberOfStackTraceLinesToRemove) {
    if (!errStack) {
        return errStack;
    }
    const stackLines = splitByLine(errStack);
    let linesRemoved = 0;
    const stackLine__cleaned = stackLines
        .filter((line) => {
        // Remove internal stack traces
        if (line.includes(' (internal/') || line.includes(' (node:internal')) {
            return false;
        }
        if (linesRemoved < numberOfStackTraceLinesToRemove && isStackTraceLine(line)) {
            linesRemoved++;
            return false;
        }
        return true;
    })
        .join('\n');
    return stackLine__cleaned;
}
function isStackTraceLine(line) {
    return line.startsWith('    at ');
}
function splitByLine(str) {
    // https://stackoverflow.com/questions/21895233/how-in-node-to-split-string-by-newline-n
    return str.split(/\r?\n/);
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/utils/colorsClient.js [vike:pluginModuleBanner] */
// ./colorsServer.js => server only
// ./colorsClient.js => server & client
// !!!WARNING!!! KEEP THIS FILE MINIMAL: to save KBs sent to the browser
function colorVike(str) {
    return pc.bold(pc.yellow(str));
}
function colorError(str) {
    return pc.bold(pc.red(str));
}
function colorWarning(str) {
    return pc.yellow(str);
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/utils/assert.js [vike:pluginModuleBanner] */
const globalObject$3 = getGlobalObject('utils/assert.ts', {
    alreadyLogged: new Set(),
});
assertSingleInstance_onAssertModuleLoad();
const tagVike = `[vike]`;
const tagVikeWithVersion = `[vike@${PROJECT_VERSION}]`;
const tagTypeBug = 'Bug';
function assert(condition, debugInfo) {
    if (condition)
        return;
    const debugStr = (() => {
        if (!debugInfo) {
            return null;
        }
        const debugInfoSerialized = typeof debugInfo === 'string' ? debugInfo : JSON.stringify(debugInfo);
        return pc.dim(`Debug for maintainers (you can ignore this): ${debugInfoSerialized}`);
    })();
    const link = pc.underline('https://github.com/vikejs/vike/issues/new?template=bug.yml');
    let errMsg = [
        `You stumbled upon a Vike bug. Go to ${link} and copy-paste this error. A maintainer will fix the bug (usually within 24 hours).`,
        debugStr,
    ]
        .filter(Boolean)
        .join(' ');
    errMsg = addTags(errMsg, tagTypeBug, true);
    const internalError = createError(errMsg);
    globalObject$3.onBeforeLog?.();
    globalObject$3.onBeforeErr?.(internalError);
    throw internalError;
}
function assertUsage(condition, errMsg, { showStackTrace, exitOnError } = {}) {
    if (condition)
        return;
    showStackTrace = showStackTrace || globalObject$3.alwaysShowStackTrace;
    errMsg = addTags(errMsg, 'Wrong Usage');
    const usageError = createError(errMsg);
    globalObject$3.onBeforeLog?.();
    globalObject$3.onBeforeErr?.(usageError);
    if (!exitOnError) {
        throw usageError;
    }
    else {
        console.error(showStackTrace ? usageError : errMsg);
        process.exit(1);
    }
}
function getProjectError(errMsg) {
    errMsg = addTags(errMsg, 'Error');
    const projectError = createError(errMsg);
    return projectError;
}
function assertWarning(condition, msg, { onlyOnce, showStackTrace }) {
    if (condition)
        return;
    showStackTrace = showStackTrace || globalObject$3.alwaysShowStackTrace;
    if (onlyOnce) {
        const { alreadyLogged } = globalObject$3;
        const key = onlyOnce === true ? msg : onlyOnce;
        if (alreadyLogged.has(key))
            return;
        alreadyLogged.add(key);
    }
    const msgWithTags = addTags(msg, 'Warning');
    globalObject$3.onBeforeLog?.();
    if (showStackTrace) {
        const err = createError(msgWithTags);
        globalObject$3.onBeforeErr?.(err);
        console.warn(err);
    }
    else {
        console.warn(msgWithTags);
    }
}
function assertInfo(condition, msg, { onlyOnce }) {
    msg = addTags(msg, null);
    {
        const { alreadyLogged } = globalObject$3;
        const key = msg;
        if (alreadyLogged.has(key)) {
            return;
        }
        else {
            alreadyLogged.add(key);
        }
    }
    globalObject$3.onBeforeLog?.();
    console.log(msg);
}
function addTags(msg, tagType, showProjectVersion = false) {
    const tagVike = getTagVike(showProjectVersion);
    const tagTypeOuter = getTagType(tagType);
    const whitespace = getTagWhitespace(msg);
    if (globalObject$3.addAssertTagsDev) {
        const tagsDev = globalObject$3.addAssertTagsDev(tagVike, tagTypeOuter);
        return `${tagsDev}${whitespace}${msg}`;
    }
    else {
        const tags = `${tagVike}${tagTypeOuter}`;
        return `${tags}${whitespace}${msg}`;
    }
}
function getTagWhitespace(msg) {
    if (msg.startsWith('[')) {
        return '';
    }
    else {
        return ' ';
    }
}
function getTagType(tagType) {
    if (!tagType)
        return '';
    let tag = `[${tagType}]`;
    if (tagType === 'Warning') {
        tag = colorWarning(tag);
    }
    else {
        tag = colorError(tag);
    }
    return tag;
}
function getTagVike(showProjectVersion = false) {
    const tag = showProjectVersion ? tagVikeWithVersion : tagVike;
    return colorVike(tag);
}
function createError(errMsg) {
    const err = createErrorWithCleanStackTrace(errMsg, 3);
    if (globalObject$3.addAssertTagsDev)
        err.stack = err.stack?.replace(/^Error:\s*/, '');
    return err;
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/utils/humanizeTime.js [vike:pluginModuleBanner] */
function humanizeTime(milliseconds) {
    const seconds = milliseconds / 1000;
    if (seconds < 120) {
        const n = round(seconds);
        return `${n} second${plural(n)}`;
    }
    {
        const minutes = seconds / 60;
        const n = round(minutes);
        return `${n} minute${plural(n)}`;
    }
}
function round(n) {
    let rounded = n.toFixed(1);
    if (rounded.endsWith('.0'))
        rounded = rounded.slice(0, -2);
    return rounded;
}
function plural(n) {
    return n === '1' ? '' : 's';
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/utils/isObject.js [vike:pluginModuleBanner] */
function isObject(value) {
    return typeof value === 'object' && value !== null;
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/utils/isArray.js [vike:pluginModuleBanner] */
// Same as Array.isArray() but typesafe: asserts unknown[] instead of any[]
function isArray(value) {
    return Array.isArray(value);
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/shared-server-client/page-configs/helpers.js [vike:pluginModuleBanner] */
function getPageConfig(pageId, pageConfigs) {
    const pageConfig = pageConfigs.find((p) => p.pageId === pageId);
    assert(pageConfigs.length > 0);
    assert(pageConfig);
    return pageConfig;
}
function getConfigValueFilePathToShowToUser(definedAtData) {
    // A unique file path only exists if the config value isn't cumulative nor computed:
    //  - cumulative config values have multiple file paths
    //  - computed values don't have any file path
    if (!definedAtData || isArray(definedAtData) || definedAtData.definedBy)
        return null;
    const { filePathToShowToUser } = definedAtData;
    assert(filePathToShowToUser);
    return filePathToShowToUser;
}
function getHookFilePathToShowToUser(definedAtData) {
    const filePathToShowToUser = getConfigValueFilePathToShowToUser(definedAtData);
    assert(filePathToShowToUser);
    return filePathToShowToUser;
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/shared-server-client/page-configs/getExportPath.js [vike:pluginModuleBanner] */
function getExportPath(fileExportPathToShowToUser, configName) {
    if (!fileExportPathToShowToUser)
        return null;
    let [exportName, ...exportObjectPath] = fileExportPathToShowToUser;
    if (!exportName)
        return null;
    if (exportObjectPath.length === 0 && ['*', 'default', configName].includes(exportName))
        return null;
    assert(exportName !== '*');
    let prefix = '';
    let suffix = '';
    if (exportName === 'default') {
        prefix = 'export default';
    }
    else {
        prefix = 'export';
        exportObjectPath = [exportName, ...exportObjectPath];
    }
    exportObjectPath.forEach((prop) => {
        prefix = `${prefix} { ${prop}`;
        suffix = ` }${suffix}`;
    });
    const exportPath = prefix + suffix;
    return exportPath;
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/shared-server-client/page-configs/getConfigDefinedAt.js [vike:pluginModuleBanner] */
function getConfigDefinedAt(sentenceBegin, configName, definedAtData) {
    return `${begin(sentenceBegin, configName)} at ${getDefinedAtString(definedAtData, configName)}`;
}
function getConfigDefinedAtOptional(sentenceBegin, configName, definedAtData) {
    if (!definedAtData) {
        return `${begin(sentenceBegin, configName)} internally`;
    }
    else {
        return `${begin(sentenceBegin, configName)} at ${getDefinedAtString(definedAtData, configName)}`;
    }
}
function begin(sentenceBegin, configName) {
    return `${sentenceBegin} ${pc.cyan(configName)} defined`;
}
function getDefinedAtString(definedAtData, configName) {
    let files;
    if (isArray(definedAtData)) {
        files = definedAtData;
    }
    else {
        files = [definedAtData];
    }
    assert(files.length >= 1);
    const definedAtString = files
        .map((definedAt) => {
        if (definedAt.definedBy)
            return getDefinedByString(definedAt, configName);
        const { filePathToShowToUser, fileExportPathToShowToUser } = definedAt;
        const exportPath = getExportPath(fileExportPathToShowToUser, configName);
        if (exportPath) {
            return `${filePathToShowToUser} > ${pc.cyan(exportPath)}`;
        }
        else {
            return filePathToShowToUser;
        }
    })
        .join(' / ');
    return definedAtString;
}
function getDefinedByString(definedAt, configName) {
    if (definedAt.definedBy === 'api') {
        return `API call ${pc.cyan(`${definedAt.operation}({ vikeConfig: { ${configName} } })`)}`;
    }
    const { definedBy } = definedAt;
    if (definedBy === 'cli') {
        return `CLI option ${pc.cyan(`--${configName}`)}`;
    }
    if (definedBy === 'env') {
        return `environment variable ${pc.cyan(`VIKE_CONFIG="{${configName}}"`)}`;
    }
    assert(false);
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/utils/isCallable.js [vike:pluginModuleBanner] */
function isCallable(thing) {
    return thing instanceof Function || typeof thing === 'function';
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/shared-server-client/hooks/getHook.js [vike:pluginModuleBanner] */
const globalObject$2 = getGlobalObject('hooks/getHook.ts', {});
function getHookFromPageContext(pageContext, hookName) {
    if (!(hookName in pageContext.exports)) {
        return null;
    }
    const { hooksTimeout } = pageContext.config;
    const hookTimeout = getHookTimeout(hooksTimeout, hookName);
    const hookFn = pageContext.exports[hookName];
    if (hookFn === null)
        return null;
    // TO-DO/eventually: use pageContext.configEntries in favor of pageContext.exportsAll once V0.4 is removed
    const file = pageContext.exportsAll[hookName][0];
    assert(file.exportValue === hookFn);
    const hookFilePath = file.filePath;
    assert(hookFilePath);
    return getHook(hookFn, hookName, hookFilePath, hookTimeout);
}
// TO-DO/eventually: remove getHookFromPageContext() in favor of getHooksFromPageContextNew()
function getHooksFromPageContextNew(hookName, pageContext) {
    const { hooksTimeout } = pageContext.config;
    const hookTimeout = getHookTimeout(hooksTimeout, hookName);
    const hooks = [];
    /* TO-DO/eventually: use pageContext.configEntries in favor of pageContext.exportsAll once V0.4 is removed
    pageContext.configEntries[hookName]?.forEach((val) => {
      const hookFn = val.configValue
      if (hookFn === null) return
      const hookFilePath = val.configDefinedByFile
    */
    pageContext.exportsAll[hookName]?.forEach((val) => {
        const hookFn = val.exportValue;
        if (hookFn === null)
            return;
        const hookFilePath = val.filePath;
        assert(hookFilePath);
        hooks.push(getHook(hookFn, hookName, hookFilePath, hookTimeout));
    });
    return hooks;
}
function getHookFromPageConfigGlobal(pageConfigGlobal, hookName) {
    const configValue = pageConfigGlobal.configValues[hookName];
    if (!configValue?.value)
        return null;
    const { hookFn, hookFilePath } = getHookFromConfigValue(configValue);
    const hookTimeout = getHookTimeoutGlobal(hookName);
    return getHook(hookFn, hookName, hookFilePath, hookTimeout);
}
function getHooksFromPageConfigGlobalCumulative(pageConfigGlobal, hookName) {
    const configValue = pageConfigGlobal.configValues[hookName];
    if (!configValue?.value)
        return [];
    const val = configValue.value;
    assert(isArray(val));
    return val.map((v, i) => {
        const hookFn = v;
        const hookTimeout = getHookTimeoutGlobal(hookName);
        assert(isArray(configValue.definedAtData));
        const hookFilePath = getHookFilePathToShowToUser(configValue.definedAtData[i]);
        return getHook(hookFn, hookName, hookFilePath, hookTimeout);
    });
}
function getHookTimeoutGlobal(hookName) {
    // TO-DO/perfection: we could use the global value of configooksTimeout but it requires some non-trivial refactoring
    const hookTimeout = getHookTimeoutDefault(hookName);
    return hookTimeout;
}
function getHook(hookFn, hookName, hookFilePath, hookTimeout) {
    assert(hookFilePath);
    assertHookFn(hookFn, { hookName, hookFilePath });
    const hook = { hookFn, hookName, hookFilePath, hookTimeout };
    return hook;
}
function getHookFromConfigValue(configValue) {
    const hookFn = configValue.value;
    assert(hookFn);
    const hookFilePath = getHookFilePathToShowToUser(configValue.definedAtData);
    return { hookFn, hookFilePath };
}
function assertHookFn(hookFn, { hookName, hookFilePath }) {
    assert(hookName && hookFilePath);
    assert(!hookName.endsWith(')'));
    assert(!hookFilePath.endsWith(' '));
    assertUsage(isCallable(hookFn), `Hook ${hookName}() defined by ${hookFilePath} should be a function`);
}
function getHookTimeout(hooksTimeoutProvidedByUser, hookName) {
    const hooksTimeoutProvidedbyUserNormalized = getHooksTimeoutProvidedByUserNormalized(hooksTimeoutProvidedByUser);
    if (hooksTimeoutProvidedbyUserNormalized === false)
        return { error: false, warning: false };
    const providedbyUser = hooksTimeoutProvidedbyUserNormalized[hookName];
    const hookTimeout = getHookTimeoutDefault(hookName);
    if (providedbyUser?.error !== undefined)
        hookTimeout.error = providedbyUser.error;
    if (providedbyUser?.warning !== undefined)
        hookTimeout.warning = providedbyUser.warning;
    return hookTimeout;
}
// Ideally this should be called only once and at build-time (to avoid bloating the client-side bundle), but we didn't implement any mechanism to valid config values at build-time yet
function getHooksTimeoutProvidedByUserNormalized(hooksTimeoutProvidedByUser) {
    if (hooksTimeoutProvidedByUser === undefined)
        return {};
    if (hooksTimeoutProvidedByUser === false)
        return false;
    assertUsage(isObject(hooksTimeoutProvidedByUser), `Setting ${pc.cyan('hooksTimeout')} should be ${pc.cyan('false')} or an object`);
    const hooksTimeoutProvidedByUserNormalized = {};
    Object.entries(hooksTimeoutProvidedByUser).forEach(([hookName, hookTimeoutProvidedbyUser]) => {
        if (hookTimeoutProvidedbyUser === false) {
            hooksTimeoutProvidedByUserNormalized[hookName] = { error: false, warning: false };
            return;
        }
        assertUsage(isObject(hookTimeoutProvidedbyUser), `Setting ${pc.cyan(`hooksTimeout.${hookName}`)} should be ${pc.cyan('false')} or an object`);
        const [error, warning] = ['error', 'warning'].map((timeoutName) => {
            const timeoutVal = hookTimeoutProvidedbyUser[timeoutName];
            if (timeoutVal === undefined || timeoutVal === false)
                return timeoutVal;
            const errPrefix = `Setting ${pc.cyan(`hooksTimeout.${hookName}.${timeoutName}`)} should be`;
            assertUsage(typeof timeoutVal === 'number', `${errPrefix} ${pc.cyan('false')} or a number`);
            assertUsage(timeoutVal > 0, `${errPrefix} a positive number`);
            return timeoutVal;
        });
        hooksTimeoutProvidedByUserNormalized[hookName] = { error, warning };
    });
    return hooksTimeoutProvidedByUserNormalized;
}
function getHookTimeoutDefault(hookName) {
    if (hookName === 'onBeforeRoute') {
        return {
            error: 5 * 1000,
            warning: 1 * 1000,
        };
    }
    if (globalObject$2.isPrerendering) {
        return {
            error: 2 * 60 * 1000,
            warning: 30 * 1000,
        };
    }
    else {
        assert(!hookName.toLowerCase().includes('prerender'));
    }
    return {
        error: 30 * 1000,
        warning: 4 * 1000,
    };
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/utils/isPropertyGetter.js [vike:pluginModuleBanner] */
function isPropertyGetter(obj, prop) {
    const descriptor = Object.getOwnPropertyDescriptor(obj, prop);
    return !!descriptor && !('value' in descriptor) && !!descriptor.get;
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/shared-server-client/addIs404ToPageProps.js [vike:pluginModuleBanner] */
function addIs404ToPageProps(pageContext) {
    addIs404(pageContext);
}
function addIs404(pageContext) {
    if (pageContext.is404 === undefined || pageContext.is404 === null)
        return;
    const pageProps = pageContext.pageProps || {};
    if (!isObject(pageProps)) {
        assertWarning(false, 'pageContext.pageProps should be an object', { showStackTrace: true, onlyOnce: true });
        return;
    }
    pageProps.is404 = pageProps.is404 || pageContext.is404;
    pageContext.pageProps = pageProps;
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/shared-server-client/NOT_SERIALIZABLE.js [vike:pluginModuleBanner] */
const NOT_SERIALIZABLE = '__VIKE__NOT_SERIALIZABLE__';

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/utils/getPropAccessNotation.js [vike:pluginModuleBanner] */
function getPropAccessNotation(key) {
    return typeof key === 'string' && isKeyDotNotationCompatible(key) ? `.${key}` : `[${JSON.stringify(key)}]`;
}
function isKeyDotNotationCompatible(key) {
    return /^[a-z0-9\$_]+$/i.test(key);
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/utils/isBrowser.js [vike:pluginModuleBanner] */
/** Test whether the environment is a *real* browser (not a browser simulation such as `jsdom`). */
function isBrowser() {
    // - Using `typeof window !== 'undefined'` alone isn't narrow enough because some users use https://www.npmjs.com/package/ssr-window
    // - Using `typeof window !== "undefined" && typeof window.scrollY === "number"` still isn't narrow enough because of jsdom
    // - https://github.com/jsdom/jsdom/issues/1537#issuecomment-1689368267
    return Object.getOwnPropertyDescriptor(globalThis, 'window')?.get?.toString().includes('[native code]') ?? false;
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/shared-server-client/getPublicProxy.js [vike:pluginModuleBanner] */
function getPublicProxy(obj, objName, skipOnInternalProp, fallback) {
  return new Proxy(obj, {
    get: (_, prop) => getProp(prop, obj, objName, skipOnInternalProp, fallback)
  });
}
function getProp(prop, ...args) {
  const [obj, objName, skipOnInternalProp, fallback] = args;
  const propStr = String(prop);
  if (prop === "_isProxyObject")
    return true;
  if (prop === "dangerouslyUseInternals") {
    args[2] = true;
    return getPublicProxy(...args);
  }
  if (prop === "_originalObject")
    return obj;
  if (fallback && !(prop in obj)) {
    return fallback(prop);
  }
  const val = obj[prop];
  onNotSerializable(propStr, val, objName);
  return val;
}
function onNotSerializable(propStr, val, objName) {
  if (val !== NOT_SERIALIZABLE)
    return;
  const propName = getPropAccessNotation(propStr);
  assert(isBrowser());
  assertUsage(false, `Can't access ${objName}${propName} on the client side. Because it can't be serialized, see server logs.`);
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/shared-server-client/getGlobalContextPublicShared.js [vike:pluginModuleBanner] */
function getGlobalContextPublicShared(globalContext) {
    assert(globalContext._isOriginalObject); // ensure we preserve the original object reference
    const globalContextPublic = getPublicProxy(globalContext, 'globalContext');
    return globalContextPublic;
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/shared-server-client/getPageContextPublicShared.js [vike:pluginModuleBanner] */
function getPageContextPublicShared(pageContext) {
  assert(!pageContext._isProxyObject);
  assert(!pageContext.globalContext);
  assert(pageContext._isOriginalObject);
  addIs404ToPageProps(pageContext);
  if (!("_pageId" in pageContext)) {
    Object.defineProperty(pageContext, "_pageId", {
      get() {
        assertWarning(false, "pageContext._pageId has been renamed to pageContext.pageId", {
          showStackTrace: true,
          onlyOnce: true
        });
        return pageContext.pageId;
      },
      enumerable: false
    });
  }
  const globalContextPublic = getGlobalContextPublicShared(pageContext._globalContext);
  const pageContextPublic = getPublicProxy(
    pageContext,
    "pageContext",
    // We must skip it in the client-side because of the reactivity mechanism of UI frameworks like Solid.
    // - TO-DO/soon/proxy: double check whether that's true
    true,
    (prop) => {
      if (prop === "globalContext") {
        return globalContextPublic;
      }
      if (prop in globalContextPublic) {
        return globalContextPublic[prop];
      }
    }
  );
  return pageContextPublic;
}
function assertPropertyGetters(pageContext) {
  [
    "urlPathname",
    // TO-DO/next-major-release: remove
    "urlParsed",
    // TO-DO/next-major-release: remove
    "url",
    // TO-DO/next-major-release: remove
    "pageExports"
  ].forEach((prop) => {
    if (pageContext.prop)
      assert(isPropertyGetter(pageContext, prop));
  });
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/shared-server-client/hooks/execHook.js [vike:pluginModuleBanner] */
const globalObject$1 = getGlobalObject("utils/execHook.ts", {
  userHookErrors: /* @__PURE__ */ new WeakMap(),
  pageContext: null
});
async function execHook(hookName, pageContext, getPageContextPublic) {
  const hooks = getHooksFromPageContextNew(hookName, pageContext);
  return await execHookList(hooks, pageContext, getPageContextPublic);
}
async function execHookGlobal(hookName, globalContext, getGlobalContextPublic) {
  const hooks = getHooksFromPageConfigGlobalCumulative(globalContext._pageConfigGlobal, hookName);
  const globalContextPublic = getGlobalContextPublic(globalContext);
  await Promise.all(hooks.map(async (hook) => {
    await execHookBaseAsync(() => hook.hookFn(globalContextPublic), hook, globalContext, null);
  }));
}
async function execHookList(hooks, pageContext, getPageContextPublic) {
  if (!hooks.length)
    return [];
  const pageContextPublic = getPageContextPublic(pageContext);
  const hooksWithResult = await Promise.all(hooks.map(async (hook) => {
    const hookReturn = await execHookBaseAsync(() => hook.hookFn(pageContextPublic), hook, pageContext._globalContext, pageContextPublic);
    return { ...hook, hookReturn };
  }));
  return hooksWithResult;
}
async function execHookSingle(hook, pageContext, getPageContextPublic) {
  const hooksWithResult = await execHookList([hook], pageContext, getPageContextPublic);
  const { hookReturn } = hooksWithResult[0];
  assertUsage(hookReturn === void 0, `The ${hook.hookName}() hook defined by ${hook.hookFilePath} isn't allowed to return a value`);
}
function execHookSingleSync(hook, globalContext, pageContext, getPageContextPublic, hookFnCaller) {
  const pageContextPublic = pageContext && getPageContextPublic(pageContext);
  hookFnCaller ?? (hookFnCaller = () => hook.hookFn(pageContextPublic));
  const hookReturn = execHookBase(hookFnCaller, hook, globalContext, pageContextPublic);
  return { hookReturn };
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
    if (currentTimeoutWarn)
      clearTimeout(currentTimeoutWarn);
    if (currentTimeoutErr)
      clearTimeout(currentTimeoutErr);
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
      if (isObject(err)) {
        globalObject$1.userHookErrors.set(err, { hookName, hookFilePath });
      }
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
  if (!configValue?.value)
    return callOriginal();
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
    const hookPublic = { name: hookName, filePath: hookFilePath, call };
    call = () => {
      (async () => {
        try {
          await onHookCall(hookPublic, pageContext);
        } catch (err) {
          if (err !== originalError) {
            console.error(err);
          }
        }
      })();
      assertUsage(originalCalled, "onHookCall() must run hook.call()");
      return originalReturn;
    };
  }
  call();
  if (originalError)
    throw originalError;
  return originalReturn;
}
function isNotDisabled(timeout) {
  return !!timeout && timeout !== Infinity;
}
function providePageContext(pageContext) {
  providePageContextInternal(pageContext);
}
function providePageContextInternal(pageContext) {
  globalObject$1.pageContext = pageContext;
  Promise.resolve().then(() => {
    globalObject$1.pageContext = null;
  });
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/utils/genPromise.js [vike:pluginModuleBanner] */
const timeoutDefault = 25 * 1000;
function genPromise({ timeout = timeoutDefault, } = {}) {
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
    if (!timeout) {
        promise = promise_internal;
    }
    else {
        promise = new Proxy(promise_internal, {
            get(target, prop) {
                if (prop === 'then' && !finished) {
                    const err = new Error(`Promise hasn't resolved after ${humanizeTime(timeout)}`);
                    timeouts.push(setTimeout(() => {
                        assert(err.stack);
                        assertWarning(false, removeStackErrorPrefix(err.stack), { onlyOnce: false });
                    }, timeout));
                }
                const value = Reflect.get(target, prop);
                return typeof value === 'function' ? value.bind(target) : value;
            },
        });
    }
    return { promise, resolve, reject };
}
function removeStackErrorPrefix(errStack) {
    const errorPrefix = 'Error: ';
    if (errStack.startsWith(errorPrefix))
        errStack = errStack.slice(errorPrefix.length);
    return errStack;
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/utils/isArrayOfStrings.js [vike:pluginModuleBanner] */
function isArrayOfStrings(val) {
    return isArray(val) && val.every((v) => typeof v === 'string');
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/utils/isObjectOfStrings.js [vike:pluginModuleBanner] */
function isObjectOfStrings(val) {
    return isObject(val) && Object.values(val).every((v) => typeof v === 'string');
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/utils/hasProp.js [vike:pluginModuleBanner] */
function hasProp(obj, prop, type) {
    if (!isObject(obj))
        return false;
    if (!(prop in obj)) {
        return type === 'undefined';
    }
    if (type === undefined) {
        return true;
    }
    const propValue = obj[prop];
    if (type === 'undefined') {
        return propValue === undefined;
    }
    if (type === 'array') {
        return isArray(propValue);
    }
    if (type === 'object') {
        return isObject(propValue);
    }
    if (type === 'string[]') {
        return isArrayOfStrings(propValue);
    }
    if (type === 'string{}') {
        return isObjectOfStrings(propValue);
    }
    if (type === 'function') {
        return isCallable(propValue);
    }
    if (isArray(type)) {
        return typeof propValue === 'string' && type.includes(propValue);
    }
    if (type === 'null') {
        return propValue === null;
    }
    if (type === 'true') {
        return propValue === true;
    }
    if (type === 'false') {
        return propValue === false;
    }
    return typeof propValue === type;
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/utils/objectAssign.js [vike:pluginModuleBanner] */
// Same as Object.assign() but:
//  - With type inference
//  - Preserves property descriptors, which we need for preserving the getters of getPageContextUrlComputed()
function objectAssign(obj, objAddendum, objAddendumCanBeOriginalObject) {
    if (!objAddendum)
        return;
    if (!objAddendumCanBeOriginalObject)
        assert(!objAddendum._isOriginalObject);
    Object.defineProperties(obj, Object.getOwnPropertyDescriptors(objAddendum));
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/utils/updateType.js [vike:pluginModuleBanner] */
/** Help TypeScript update the type of dynamically modified objects. */
function updateType(thing, clone) {
    // @ts-ignore
    assert(thing === clone);
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/@brillout+json-serializer@0.5.22/node_modules/@brillout/json-serializer/dist/types.js [vike:pluginModuleBanner] */
const types = [
    ts({
        is: (val) => val === undefined,
        match: (str) => str === '!undefined',
        serialize: () => '!undefined',
        deserialize: () => undefined,
    }),
    ts({
        is: (val) => val === Infinity,
        match: (str) => str === '!Infinity',
        serialize: () => '!Infinity',
        deserialize: () => Infinity,
    }),
    ts({
        is: (val) => val === -Infinity,
        match: (str) => str === '!-Infinity',
        serialize: () => '!-Infinity',
        deserialize: () => -Infinity,
    }),
    ts({
        is: (val) => typeof val === 'number' && isNaN(val),
        match: (str) => str === '!NaN',
        serialize: () => '!NaN',
        deserialize: () => NaN,
    }),
    ts({
        is: (val) => val instanceof Date,
        match: (str) => str.startsWith('!Date:'),
        serialize: (val) => '!Date:' + val.toISOString(),
        deserialize: (str) => new Date(str.slice('!Date:'.length)),
    }),
    ts({
        is: (val) => typeof val === 'bigint',
        match: (str) => str.startsWith('!BigInt:'),
        serialize: (val) => '!BigInt:' + val.toString(),
        deserialize: (str) => {
            if (typeof BigInt === 'undefined') {
                throw new Error('Your JavaScript environement does not support BigInt. Consider adding a polyfill.');
            }
            return BigInt(str.slice('!BigInt:'.length));
        },
    }),
    ts({
        is: (val) => val instanceof RegExp,
        match: (str) => str.startsWith('!RegExp:'),
        serialize: (val) => '!RegExp:' + val.toString(),
        deserialize: (str) => {
            str = str.slice('!RegExp:'.length);
            // const args: string[] = str.match(/\/(.*?)\/([gimy])?$/)!
            const args = str.match(/\/(.*)\/(.*)?/);
            const pattern = args[1];
            const flags = args[2];
            return new RegExp(pattern, flags);
        },
    }),
    ts({
        is: (val) => val instanceof Map,
        match: (str) => str.startsWith('!Map:'),
        serialize: (val, serializer) => '!Map:' + serializer(Array.from(val.entries())),
        deserialize: (str, parser) => new Map(parser(str.slice('!Map:'.length))),
    }),
    ts({
        is: (val) => val instanceof Set,
        match: (str) => str.startsWith('!Set:'),
        serialize: (val, serializer) => '!Set:' + serializer(Array.from(val.values())),
        deserialize: (str, parser) => new Set(parser(str.slice('!Set:'.length))),
    }),
    // Avoid collisions with the special strings defined above
    ts({
        is: (val) => typeof val === 'string' && val.startsWith('!'),
        match: (str) => str.startsWith('!'),
        serialize: (val) => '!' + val,
        deserialize: (str) => str.slice(1),
    }),
];
// Type check
function ts(t) {
    return t;
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/@brillout+json-serializer@0.5.22/node_modules/@brillout/json-serializer/dist/parse.js [vike:pluginModuleBanner] */
function parse(str, options = {}) {
    // We don't use the reviver option in `JSON.parse(str, reviver)` because it doesn't support `undefined` values
    const value = JSON.parse(str);
    return parseTransform(value, options);
}
function parseTransform(value, options = {}) {
    if (typeof value === 'string') {
        return reviver(value, options);
    }
    if (
    // Also matches arrays
    typeof value === 'object' &&
        value !== null) {
        Object.entries(value).forEach(([key, val]) => {
            value[key] = parseTransform(val, options);
        });
    }
    return value;
}
function reviver(value, options) {
    const parser = (str) => parse(str, options);
    {
        const res = options.reviver?.(
        // TO-DO/eventually: provide key if some user needs it
        undefined, value, parser);
        if (res) {
            if (typeof res.replacement !== 'string') {
                return res.replacement;
            }
            else {
                value = res.replacement;
                if (res.resolved)
                    return value;
            }
        }
    }
    for (const { match, deserialize } of types) {
        if (match(value)) {
            return deserialize(value, parser);
        }
    }
    return value;
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/shared-server-client/htmlElementIds.js [vike:pluginModuleBanner] */
const htmlElementId_pageContext = 'vike_pageContext';
const htmlElementId_globalContext = 'vike_globalContext';

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/utils/assertIsBrowser.js [vike:pluginModuleBanner] */
function assertIsBrowser() {
    assert(isBrowser());
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/client/assertEnvClient.js [vike:pluginModuleBanner] */
assertEnvClient();
function assertEnvClient() {
    assertIsBrowser();
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/client/shared/getJsonSerializedInHtml.js [vike:pluginModuleBanner] */
// elements should exist because:
// 1. <script id="vike_pageContext" type="application/json"> appears before the <script> that loads Vike's client runtime (which includes this file)
// 2. <script id="vike_pageContext" type="application/json"> is neither async nor defer
// See https://github.com/vikejs/vike/pull/1271
function getPageContextSerializedInHtml() {
    const pageContextSerializedInHtml = findAndParseJson(htmlElementId_pageContext);
    assert(hasProp(pageContextSerializedInHtml, 'pageId', 'string'));
    assert(hasProp(pageContextSerializedInHtml, 'routeParams', 'string{}'));
    return pageContextSerializedInHtml;
}
function getGlobalContextSerializedInHtml() {
    const globalContextSerializedInHtml = findAndParseJson(htmlElementId_globalContext);
    return globalContextSerializedInHtml;
}
function findAndParseJson(id) {
    const elem = document.getElementById(id);
    assertUsage(elem, 
    // It seems like it can be missing when HTML is malformed: https://github.com/vikejs/vike/issues/913
    `Couldn't find #${id} (which Vike automatically injects in the HTML): make sure it exists (i.e. don't remove it and make sure your HTML isn't malformed)`);
    const jsonStr = elem.textContent;
    assert(jsonStr);
    const json = parse(jsonStr, {
        // Prevent Google from crawling URLs in JSON:
        // - https://github.com/vikejs/vike/pull/2603
        // - https://github.com/brillout/json-serializer/blob/38edbb9945de4938da1e65d6285ce1dd123a45ef/test/main.spec.ts#L44-L95
        reviver(_key, value) {
            if (typeof value === 'string') {
                return { replacement: value.replaceAll('\\/', '/'), resolved: false };
            }
        },
    });
    return json;
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/utils/isNullish.js [vike:pluginModuleBanner] */
function isNullish(val) {
    return val === null || val === undefined;
}
// someArray.filter(isNotNullish)
function isNotNullish(p) {
    return !isNullish(p);
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/shared-server-client/getPageFiles/getAllPageIdFiles.js [vike:pluginModuleBanner] */
// TO-DO/next-major-release: remove this file
function getPageFilesClientSide(pageFilesAll, pageId) {
    return determine(pageFilesAll, pageId, true);
}
function getPageFilesServerSide(pageFilesAll, pageId) {
    return determine(pageFilesAll, pageId, false);
}
function determine(pageFilesAll, pageId, envIsClient) {
    const env = envIsClient ? 'CLIENT_ONLY' : 'SERVER_ONLY';
    const pageFilesRelevant = pageFilesAll
        .filter((p) => p.isRelevant(pageId) && p.fileType !== '.page.route')
        .sort(getPageFilesSorter(envIsClient, pageId));
    // Load the `.page.js` files specific to `pageId`
    const getPageIdFile = (iso) => {
        const files = pageFilesRelevant.filter((p) => p.pageId === pageId && p.isEnv(iso ? 'CLIENT_AND_SERVER' : env));
        assertUsage(files.length <= 1, `Merge the following files into a single file: ${files.map((p) => p.filePath).join(' ')}`);
        const pageIdFile = files[0];
        assert(pageIdFile === undefined || !pageIdFile.isDefaultPageFile);
        return pageIdFile;
    };
    const pageIdFileEnv = getPageIdFile(false);
    const pageIdFileIso = getPageIdFile(true);
    // A page can have only one renderer. In other words: Multiple `renderer/` overwrite each other.
    // Load only load renderer (`/renderer/_default.*`)
    const getRendererFile = (iso) => pageFilesRelevant.filter((p) => p.isRendererPageFile && p.isEnv(iso ? 'CLIENT_AND_SERVER' : env))[0];
    const rendererFileEnv = getRendererFile(false);
    const rendererFileIso = getRendererFile(true);
    // A page can load multiple `_default.page.*` files of the same `fileType`. In other words: non-renderer `_default.page.*` files are cumulative.
    // The exception being HTML-only pages because we pick a single page file as client entry. We handle that use case at `renderPageServer()`.
    const defaultFilesNonRenderer = pageFilesRelevant.filter((p) => p.isDefaultPageFile && !p.isRendererPageFile && (p.isEnv(env) || p.isEnv('CLIENT_AND_SERVER')));
    // Ordered by `pageContext.exports` precedence
    const pageFiles = [pageIdFileEnv, pageIdFileIso, ...defaultFilesNonRenderer, rendererFileEnv, rendererFileIso].filter(isNotNullish);
    return pageFiles;
}
function getPageFilesSorter(envIsClient, pageId) {
    const env = envIsClient ? 'CLIENT_ONLY' : 'SERVER_ONLY';
    const e1First = -1;
    const e2First = 1;
    const noOrder = 0;
    return (e1, e2) => {
        // `.page.js` files specific to `pageId` first
        if (!e1.isDefaultPageFile && e2.isDefaultPageFile) {
            return e1First;
        }
        if (!e2.isDefaultPageFile && e1.isDefaultPageFile) {
            return e2First;
        }
        // Non-renderer `_default.page.*` before `renderer/**/_default.page.*`
        {
            const e1_isRenderer = e1.isRendererPageFile;
            const e2_isRenderer = e2.isRendererPageFile;
            if (!e1_isRenderer && e2_isRenderer) {
                return e1First;
            }
            if (!e2_isRenderer && e1_isRenderer) {
                return e2First;
            }
            assert(e1_isRenderer === e2_isRenderer);
        }
        // Filesystem nearest first
        {
            const e1_distance = getPathDistance(pageId, e1.filePath);
            const e2_distance = getPathDistance(pageId, e2.filePath);
            if (e1_distance < e2_distance) {
                return e1First;
            }
            if (e2_distance < e1_distance) {
                return e2First;
            }
            assert(e1_distance === e2_distance);
        }
        // `.page.server.js`/`.page.client.js` before `.page.js`
        {
            if (e1.isEnv(env) && e2.isEnv('CLIENT_AND_SERVER')) {
                return e1First;
            }
            if (e2.isEnv(env) && e1.isEnv('CLIENT_AND_SERVER')) {
                return e2First;
            }
        }
        return noOrder;
    };
}
function getPathDistance(pathA, pathB) {
    // Index of first different character
    let idx = 0;
    for (; idx < pathA.length && idx < pathB.length; idx++) {
        if (pathA[idx] !== pathB[idx])
            break;
    }
    const pathAWithoutCommon = pathA.slice(idx);
    const pathBWithoutCommon = pathB.slice(idx);
    const distanceA = pathAWithoutCommon.split('/').length;
    const distanceB = pathBWithoutCommon.split('/').length;
    const distance = distanceA + distanceB;
    return distance;
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/utils/slice.js [vike:pluginModuleBanner] */
function slice(thing, from, to) {
    if (typeof thing === 'string') {
        return sliceArray(thing.split(''), from, to).join('');
    }
    else {
        return sliceArray(thing, from, to);
    }
}
function sliceArray(list, from, to) {
    const listSlice = [];
    let start = from >= 0 ? from : list.length + from;
    assert(start >= 0 && start <= list.length);
    let end = to >= 0 ? to : list.length + to;
    assert(end >= 0 && end <= list.length);
    while (true) {
        if (start === end) {
            break;
        }
        if (start === list.length) {
            start = 0;
        }
        if (start === end) {
            break;
        }
        const el = list[start];
        assert(el !== undefined);
        listSlice.push(el);
        start++;
    }
    return listSlice;
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/utils/parseUrl.js [vike:pluginModuleBanner] */
// We don't use new URL() as it doesn't exactly do what we need, for example:
//  - It loses the original URL parts (which we need to manipulate and recreate URLs)
//  - It doesn't support the tauri:// protocol
// Unit tests at ./parseUrl.spec.ts
function parseUrl(url, baseServer) {
    assert(isUrl(url), url);
    assert(baseServer.startsWith('/'));
    // Hash
    const { hashString: hashOriginal, withoutHash: urlWithoutHash } = extractHash(url);
    assert(hashOriginal === null || hashOriginal.startsWith('#'));
    const hash = hashOriginal === null ? '' : decodeSafe(hashOriginal.slice(1));
    // Search
    const { searchString: searchOriginal, withoutSearch: urlWithoutHashNorSearch } = extractSearch(urlWithoutHash);
    assert(searchOriginal === null || searchOriginal.startsWith('?'));
    let searchString = '';
    if (searchOriginal !== null) {
        searchString = searchOriginal;
    }
    else if (url.startsWith('#')) {
        const baseURI = getBaseURI();
        searchString = (baseURI && extractSearch(baseURI).searchString) || '';
    }
    const search = {};
    const searchAll = {};
    Array.from(new URLSearchParams(searchString)).forEach(([key, val]) => {
        search[key] = val;
        searchAll[key] = [...(searchAll.hasOwnProperty(key) ? searchAll[key] : []), val];
    });
    // Origin + pathname
    let { protocol, origin, pathnameAbsoluteWithBase } = getPathnameAbsoluteWithBase(urlWithoutHashNorSearch, baseServer);
    const pathnameOriginal = urlWithoutHashNorSearch.slice((origin || '').length);
    assertUrlComponents(url, origin, pathnameOriginal, searchOriginal, hashOriginal);
    // Base URL
    let { pathname, isBaseMissing } = removeBaseServer(pathnameAbsoluteWithBase, baseServer);
    // pageContext.urlParsed.href
    const href = createUrlFromComponents(origin, pathname, searchOriginal, hashOriginal);
    // pageContext.urlParsed.{hostname, port}
    const host = !origin ? null : origin.slice(protocol.length);
    const { hostname, port } = parseHost(host, url);
    // decode after setting href
    pathname = decodePathname(pathname);
    /* Should it be `pathname` or `pathnameOriginal`? https://github.com/vikejs/vike/pull/2770
    // pageContext.urlParsed.path
    const path = pathname + (searchOriginal || '') + (hashOriginal || '')
    */
    assert(pathname.startsWith('/'));
    return {
        href,
        protocol,
        hostname,
        port,
        origin,
        pathname,
        pathnameOriginal: pathnameOriginal,
        isBaseMissing,
        search,
        searchAll,
        searchOriginal,
        hash,
        hashOriginal,
    };
}
function extractHash(url) {
    const [withoutHash, ...parts] = url.split('#');
    const hashString = ['', ...parts].join('#') || null;
    return { hashString, withoutHash: withoutHash };
}
function extractSearch(url) {
    const [withoutSearch, ...parts] = url.split('?');
    const searchString = ['', ...parts].join('?') || null;
    return { searchString, withoutSearch: withoutSearch };
}
function decodeSafe(urlComponent) {
    try {
        return decodeURIComponent(urlComponent);
    }
    catch { }
    try {
        return decodeURI(urlComponent);
    }
    catch { }
    return urlComponent;
}
function decodePathname(urlPathname) {
    urlPathname = urlPathname.replace(/\s+$/, '');
    urlPathname = urlPathname
        .split('/')
        .map((dir) => decodeSafe(dir).split('/').join('%2F'))
        .join('/');
    return urlPathname;
}
function getPathnameAbsoluteWithBase(url, baseServer) {
    // Search and hash already extracted
    assert(!url.includes('?') && !url.includes('#'));
    // url has origin
    {
        const { protocol, origin, pathname } = parseOrigin(url);
        if (origin) {
            return { protocol, origin, pathnameAbsoluteWithBase: pathname };
        }
        assert(pathname === url);
    }
    // url doesn't have origin
    if (url.startsWith('/')) {
        return { protocol: null, origin: null, pathnameAbsoluteWithBase: url };
    }
    else {
        // url is a relative path
        const baseURI = getBaseURI();
        let base;
        if (baseURI) {
            base = parseOrigin(baseURI.split('?')[0].split('#')[0]).pathname;
        }
        else {
            base = baseServer;
        }
        const pathnameAbsoluteWithBase = resolveUrlPathnameRelative(url, base);
        return { protocol: null, origin: null, pathnameAbsoluteWithBase };
    }
}
function getBaseURI() {
    // In the browser, this is the Base URL of the current URL.
    // Safe access `window?.document?.baseURI` for users who shim `window` in Node.js
    const baseURI = typeof window !== 'undefined' ? window?.document?.baseURI : undefined;
    return baseURI;
}
function parseOrigin(url) {
    if (!isUrlWithWebProtocol(url)) {
        return { pathname: url, origin: null, protocol: null };
    }
    else {
        const { protocol, uriWithoutProtocol } = parseProtocol(url);
        assert(protocol);
        const [host, ...rest] = uriWithoutProtocol.split('/');
        const origin = protocol + host;
        const pathname = '/' + rest.join('/');
        return { pathname, origin, protocol };
    }
}
function parseHost(host, url) {
    const ret = { hostname: null, port: null };
    if (!host)
        return ret;
    // port
    const parts = host.split(':');
    if (parts.length > 1) {
        const port = parseInt(parts.pop(), 10);
        assert(port || port === 0, url);
        ret.port = port;
    }
    // hostname
    ret.hostname = parts.join(':');
    return ret;
}
function parseProtocol(uri) {
    const SEP = ':';
    const [before, ...after] = uri.split(SEP);
    if (after.length === 0 ||
        // https://github.com/vikejs/vike/commit/886a99ff21e86a8ca699a25cee7edc184aa058e4#r143308934
        // https://en.wikipedia.org/wiki/List_of_URI_schemes
        // https://www.rfc-editor.org/rfc/rfc7595
        !/^[a-z][a-z0-9\+\-]*$/i.test(before)) {
        return { protocol: null, uriWithoutProtocol: uri };
    }
    let protocol = before + SEP;
    let uriWithoutProtocol = after.join(SEP);
    const SEP2 = '//';
    if (uriWithoutProtocol.startsWith(SEP2)) {
        protocol = protocol + SEP2;
        uriWithoutProtocol = uriWithoutProtocol.slice(SEP2.length);
    }
    return { protocol, uriWithoutProtocol };
}
function isWebUrlProtocol(protocol) {
    // Is there an alternative to having a blocklist?
    // - If the blocklist becomes too big, maybe use a allowlist instead ['tauri://', 'file://', 'capacitor://', 'http://', 'https://']
    const blocklist = [
        // https://docs.ipfs.tech/how-to/address-ipfs-on-web
        'ipfs://',
        'ipns://',
    ];
    if (blocklist.includes(protocol))
        return false;
    return protocol.endsWith('://');
}
// Adapted from https://stackoverflow.com/questions/14780350/convert-relative-path-to-absolute-using-javascript/14780463#14780463
function resolveUrlPathnameRelative(pathnameRelative, base) {
    const stack = base.split('/');
    const parts = pathnameRelative.split('/');
    let baseRestoreTrailingSlash = base.endsWith('/');
    if (pathnameRelative.startsWith('.')) {
        // remove current file name
        stack.pop();
    }
    for (const i in parts) {
        const p = parts[i];
        if (p == '' && i === '0')
            continue;
        if (p == '.')
            continue;
        if (p == '..')
            stack.pop();
        else {
            baseRestoreTrailingSlash = false;
            stack.push(p);
        }
    }
    let pathnameAbsolute = stack.join('/');
    if (baseRestoreTrailingSlash && !pathnameAbsolute.endsWith('/'))
        pathnameAbsolute += '/';
    if (!pathnameAbsolute.startsWith('/'))
        pathnameAbsolute = '/' + pathnameAbsolute;
    return pathnameAbsolute;
}
function removeBaseServer(pathnameAbsoluteWithBase, baseServer) {
    assert(pathnameAbsoluteWithBase.startsWith('/'));
    assert(isBaseServer(baseServer));
    // Mutable
    let urlPathname = pathnameAbsoluteWithBase;
    assert(urlPathname.startsWith('/'));
    assert(baseServer.startsWith('/'));
    if (baseServer === '/') {
        const pathname = pathnameAbsoluteWithBase;
        return { pathname, isBaseMissing: false };
    }
    // Support `url === '/some-base-url' && baseServer === '/some-base-url/'`
    let baseServerNormalized = baseServer;
    if (baseServer.endsWith('/') && urlPathname === slice(baseServer, 0, -1)) {
        baseServerNormalized = slice(baseServer, 0, -1);
        assert(urlPathname === baseServerNormalized);
    }
    if (!urlPathname.startsWith(baseServerNormalized)) {
        const pathname = pathnameAbsoluteWithBase;
        return { pathname, isBaseMissing: true };
    }
    assert(urlPathname.startsWith('/') || urlPathname.startsWith('http'));
    assert(urlPathname.startsWith(baseServerNormalized));
    urlPathname = urlPathname.slice(baseServerNormalized.length);
    if (!urlPathname.startsWith('/'))
        urlPathname = '/' + urlPathname;
    assert(urlPathname.startsWith('/'));
    return { pathname: urlPathname, isBaseMissing: false };
}
function isBaseServer(baseServer) {
    return baseServer.startsWith('/');
}
function assertUrlComponents(url, origin, pathnameOriginal, searchOriginal, hashOriginal) {
    const urlRecreated = createUrlFromComponents(origin, pathnameOriginal, searchOriginal, hashOriginal);
    assert(url === urlRecreated);
}
function createUrlFromComponents(origin, pathname, search, hash) {
    const urlRecreated = `${origin || ''}${pathname}${search || ''}${hash || ''}`;
    return urlRecreated;
}
function isUrl(url) {
    // parseUrl() works with these URLs
    return isUrlAbsolute(url) || isUrlRelative(url);
}
function isUrlAbsolute(url) {
    return isUrlPathAbsolute(url) || isUrlWithWebProtocol(url);
}
function isUrlPathAbsolute(url) {
    return url.startsWith('/');
}
function isUrlRelative(url) {
    return ['.', '?', '#'].some((c) => url.startsWith(c)) || url === '';
}
function isUrlExternal(url) {
    return !url.startsWith('/') && !isUrlRelative(url);
}
/*
URL with protocol.

  http://example.com
  https://example.com
  tauri://localhost
  file://example.com
  capacitor://localhost/assets/chunks/chunk-DJBYDrsP.js

[Tauri](https://github.com/vikejs/vike/issues/808)
[Electron (`file://`)](https://github.com/vikejs/vike/issues/1557)
[Capacitor](https://github.com/vikejs/vike/issues/1706)
 */
function isUrlWithWebProtocol(url) {
    const { protocol } = parseProtocol(url);
    return !!protocol && isWebUrlProtocol(protocol);
}
function assertUsageUrlAbsolute(url, errPrefix) {
    assertUsage(isUrlAbsolute(url), getErrMsg(url, errPrefix));
}
function getErrMsg(url, errPrefix, allowProtocol, allowUri) {
    let errMsg = `${errPrefix} is ${pc.string(url)} but it should start with ${pc.string('/')}`;
    errMsg += ` or a protocol (e.g. ${pc.string('http://')})`;
    return errMsg;
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/utils/changeEnumerable.js [vike:pluginModuleBanner] */
/** Change enumerability of an object property. */
function changeEnumerable(obj, prop, enumerable) {
    const descriptor = Object.getOwnPropertyDescriptor(obj, prop);
    Object.defineProperty(obj, prop, { ...descriptor, enumerable });
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/shared-server-client/createPageContextShared.js [vike:pluginModuleBanner] */
function createPageContextShared(pageContextCreated, globalConfigPublic) {
    objectAssign(pageContextCreated, globalConfigPublic);
    return pageContextCreated;
}
function createPageContextObject() {
    const pageContext = {
        _isOriginalObject: true,
        isPageContext: true,
    };
    changeEnumerable(pageContext, '_isOriginalObject', false);
    return pageContext;
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/utils/objectDefineProperty.js [vike:pluginModuleBanner] */
// Same as Object.defineProperty() but with type inference
function objectDefineProperty(obj, prop, { get, ...args }) {
    Object.defineProperty(obj, prop, { ...args, get });
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/utils/objectReplace.js [vike:pluginModuleBanner] */
function objectReplace(objOld, objNew, except) {
    Object.keys(objOld)
        .filter((key) => true)
        .forEach((key) => delete objOld[key]);
    Object.defineProperties(objOld, Object.getOwnPropertyDescriptors(objNew));
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/shared-server-client/getPageFiles/assert_exports_old_design.js [vike:pluginModuleBanner] */
// TO-DO/next-major-release: remove this
const enforceTrue = ['clientRouting'];
function assertExportValues(pageFile) {
    enforceTrue.forEach((exportName) => {
        assert(pageFile.fileExports);
        if (!(exportName in pageFile.fileExports))
            return;
        const explainer = `The value of \`${exportName}\` is only allowed to be \`true\`.`;
        assertUsage(pageFile.fileExports[exportName] !== false, `${pageFile.filePath} has \`export { ${exportName} }\` with the value \`false\` which is prohibited: remove \`export { ${exportName} }\` instead. (${explainer})`);
        assertUsage(pageFile.fileExports[exportName] === true, `${pageFile.filePath} has \`export { ${exportName} }\` with a forbidden value. ${explainer}`);
    });
}
// Forbid exports such as `export default { render }`, because only `export { render }` can be statically analyzed by `es-module-lexer`.
const forbiddenDefaultExports = ['render', 'clientRouting', 'prerender', 'doNotPrerender'];
function assertDefaultExports(defaultExportName, filePath) {
    assertUsage(!forbiddenDefaultExports.includes(defaultExportName), `${filePath} has \`export default { ${defaultExportName} }\` which is prohibited, use \`export { ${defaultExportName} }\` instead.`);
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/shared-server-client/determinePageIdOld.js [vike:pluginModuleBanner] */
// TO-DO/next-major-release: remove
function determinePageIdOld(filePath) {
    const pageSuffix = '.page.';
    const pageId = slice(filePath.split(pageSuffix), 0, -1).join(pageSuffix);
    assert(!pageId.includes('\\'));
    return pageId;
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/shared-server-client/error-page.js [vike:pluginModuleBanner] */
// TO-DO/next-major-release: remove
function isErrorPageId(pageId, _isV1Design) {
    assert(!pageId.includes('\\'));
    return pageId.includes('/_error');
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/utils/isScriptFile.js [vike:pluginModuleBanner] */
// We can't use a RegExp:
//  - Needs to work with Micromatch: https://github.com/micromatch/micromatch because:
//    - Vite's `import.meta.glob()` uses Micromatch
//  - We need this to be a allowlist because:
//   - A pattern `*([a-zA-Z0-9]` doesn't work.
//     - Because of ReScript: `.res` are ReScript source files which need to be ignored. (The ReScript compiler generates `.js` files alongside `.res` files.)
//   - Block listing doesn't work.
//     - We cannot implement a blocklist with a glob pattern.
//     - A post `import.meta.glob()` blocklist filtering doesn't work because Vite would still process the files (e.g. including them in the bundle).
// prettier-ignore
// biome-ignore format:
const extJs = [
    'js',
    'cjs',
    'mjs',
];
// prettier-ignore
// biome-ignore format:
const extTs = [
    'ts',
    'cts',
    'mts',
];
const extJsOrTs = [...extJs, ...extTs];
// prettier-ignore
// biome-ignore format:
const extJsx = [
    'jsx',
    'cjsx',
    'mjsx',
];
// prettier-ignore
// biome-ignore format:
const extTsx = [
    'tsx',
    'ctsx',
    'mtsx'
];
const extJsxOrTsx = [...extJsx, ...extTsx];
// prettier-ignore
// biome-ignore format:
const extTemplates = [
    'vue',
    'svelte',
    'marko',
    'md',
    'mdx'
];
const scriptFileExtensionList = [...extJsOrTs, ...extJsxOrTsx, ...extTemplates];
function isScriptFile(filePath) {
    return scriptFileExtensionList.some((ext) => filePath.endsWith('.' + ext));
}
function isTemplateFile(filePath) {
    return extTemplates.some((ext) => filePath.endsWith('.' + ext));
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/shared-server-client/getPageFiles/fileTypes.js [vike:pluginModuleBanner] */
// TO-DO/next-major-release: remove
const fileTypes = [
    '.page',
    '.page.server',
    '.page.route',
    '.page.client',
    // New type `.page.css`/`.page.server.css`/`.page.client.css` for `extensions[number].pageFileDist`.
    //  - Extensions using `pageFileDist` are expected to use a bundler that generates a `.css` colocated next to the original `.page.js` file (e.g. `/renderer/_default.page.server.css` for `/renderer/_default.page.server.js`.
    //  - Since these `.page.css` files Bundlers We can therefore expect that there isn't any `.page.server.sass`/...
    '.css',
];
function determineFileType(filePath) {
    {
        const isCSS = filePath.endsWith('.css');
        if (isCSS) {
            /* This assert() is skipped to reduce client-side bundle size
            assert(isImportNpmPackage(filePath), filePath) // `.css` page files are only supported for npm packages
            */
            return '.css';
        }
    }
    assert(isScriptFile(filePath), filePath);
    const fileName = filePath.split('/').slice(-1)[0];
    const parts = fileName.split('.');
    const suffix1 = parts.slice(-3)[0];
    const suffix2 = parts.slice(-2)[0];
    if (suffix2 === 'page') {
        return '.page';
    }
    assert(suffix1 === 'page', filePath);
    if (suffix2 === 'server') {
        return '.page.server';
    }
    if (suffix2 === 'client') {
        return '.page.client';
    }
    if (suffix2 === 'route') {
        return '.page.route';
    }
    assert(false, filePath);
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/shared-server-client/getPageFiles/getPageFileObject.js [vike:pluginModuleBanner] */
// TO-DO/next-major-release: remove
function getPageFileObject(filePath) {
    const isRelevant = (pageId) => pageFile.pageId === pageId ||
        (pageFile.isDefaultPageFile &&
            (isRendererFilePath(pageFile.filePath) || isAncestorDefaultPage(pageId, pageFile.filePath)));
    const fileType = determineFileType(filePath);
    const isEnv = (env) => {
        assert(fileType !== '.page.route'); // We can't determine `.page.route.js`
        if (env === 'CLIENT_ONLY') {
            return fileType === '.page.client' || fileType === '.css';
        }
        if (env === 'SERVER_ONLY') {
            return fileType === '.page.server';
        }
        if (env === 'CLIENT_AND_SERVER') {
            return fileType === '.page';
        }
        assert(false);
    };
    const pageFile = {
        filePath,
        fileType,
        isEnv,
        isRelevant,
        isDefaultPageFile: isDefaultFilePath(filePath),
        isRendererPageFile: fileType !== '.css' && isDefaultFilePath(filePath) && isRendererFilePath(filePath),
        isErrorPageFile: isErrorPageId(filePath),
        pageId: determinePageIdOld(filePath),
    };
    return pageFile;
}
function isDefaultFilePath(filePath) {
    if (isErrorPageId(filePath)) {
        return false;
    }
    return filePath.includes('/_default');
}
function isRendererFilePath(filePath) {
    return filePath.includes('/renderer/');
}
function isAncestorDefaultPage(pageId, defaultPageFilePath) {
    assert(!pageId.endsWith('/'));
    assert(!defaultPageFilePath.endsWith('/'));
    assert(isDefaultFilePath(defaultPageFilePath));
    const defaultPageDir = slice(defaultPageFilePath.split('/'), 0, -1)
        .filter((filePathSegment) => filePathSegment !== '_default')
        .join('/');
    return pageId.startsWith(defaultPageDir);
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/shared-server-client/page-configs/assertPlusFileExport.js [vike:pluginModuleBanner] */
const SIDE_EXPORTS_TOLERATE = [
    // vite-plugin-solid adds `export { $$registrations }`
    '$$registrations',
    // @vitejs/plugin-vue adds `export { _rerender_only }`
    '_rerender_only',
];
// Tolerate `export { frontmatter }` in .mdx files
// Tolerate any exports from `+server.ts` for Cloudflare Durable Object
const SIDE_EXPORTS_DO_NOT_CHECK = ['.md', '.mdx'];
const SIDE_EXPORTS_DO_NOT_CHECK_CONFIG = ['server'];
function assertPlusFileExport(fileExports, filePathToShowToUser, configName) {
    const exportNames = Object.keys(fileExports);
    const isValid = (exportName) => exportName === 'default' || exportName === configName;
    // Error upon missing/ambiguous export
    const exportNamesValid = exportNames.filter(isValid);
    const exportDefault = pc.code('export default');
    const exportNamed = pc.code(`export { ${configName} }`);
    if (exportNamesValid.length === 0) {
        assertUsage(false, `${filePathToShowToUser} should define ${exportNamed} or ${exportDefault}`);
    }
    if (exportNamesValid.length === 2) {
        assertUsage(false, `${filePathToShowToUser} is ambiguous: remove ${exportDefault} or ${exportNamed}`);
    }
    assert(exportNamesValid.length === 1);
    // Warn upon side exports
    const skip = SIDE_EXPORTS_DO_NOT_CHECK_CONFIG.includes(configName) ||
        SIDE_EXPORTS_DO_NOT_CHECK.some((ext) => filePathToShowToUser.endsWith(ext));
    if (!skip) {
        const exportNamesInvalid = exportNames
            .filter((e) => !isValid(e))
            .filter((exportName) => !SIDE_EXPORTS_TOLERATE.includes(exportName));
        exportNamesInvalid.forEach((exportInvalid) => {
            assertWarning(false, `${filePathToShowToUser} unexpected ${pc.cyan(`export { ${exportInvalid} }`)}, see https://vike.dev/no-side-exports`, {
                onlyOnce: true,
            });
        });
    }
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/shared-server-client/page-configs/serialize/parsePageConfigsSerialized.js [vike:pluginModuleBanner] */
function parsePageConfigsSerialized(pageConfigsSerialized, pageConfigGlobalSerialized) {
    // pageConfigs
    const pageConfigs = pageConfigsSerialized.map((pageConfigSerialized) => {
        const configValues = parseConfigValuesSerialized(pageConfigSerialized.configValuesSerialized);
        assertRouteConfigValue(configValues);
        const pageConfig = { ...pageConfigSerialized, configValues };
        return pageConfig;
    });
    // pageConfigsGlobal
    const pageConfigGlobal = { configValues: {} };
    {
        const configValues = parseConfigValuesSerialized(pageConfigGlobalSerialized.configValuesSerialized);
        Object.assign(pageConfigGlobal.configValues, configValues);
    }
    return { pageConfigs, pageConfigGlobal };
}
function assertRouteConfigValue(configValues) {
    const configName = 'route';
    const configValue = configValues[configName];
    if (!configValue)
        return;
    const { value, definedAtData } = configValue;
    const configValueType = typeof value;
    assert(definedAtData);
    const configDefinedAt = getConfigDefinedAt('Config', configName, definedAtData);
    assertUsage(configValueType === 'string' || isCallable(value), `${configDefinedAt} has an invalid type '${configValueType}': it should be a string or a function instead, see https://vike.dev/route`);
    /* We don't use assertRouteString() in order to avoid unnecessarily bloating the client-side bundle when using Server Routing:
    * - When using Server Routing, this file is loaded => loading assertRouteString() would bloat the client bundle.
    * - assertRouteString() is already called on the server-side
    * - When using Server Routing, client-side validation is superfluous as Route Strings only need to be validated on the server-side
   if (typeof configValue === 'string') {
     assertRouteString(configValue, `${configElement.configDefinedAt} defines an`)
   }
   */
}
function parseConfigValuesSerialized(configValuesSerialized) {
    const configValues = {};
    Object.entries(configValuesSerialized).forEach(([configName, configValueSeriliazed]) => {
        let configValue;
        if (configValueSeriliazed.type === 'cumulative') {
            const { valueSerialized, ...common } = configValueSeriliazed;
            const value = valueSerialized.map((valueSerializedElement, i) => {
                const { value, sideExports } = parseValueSerialized(valueSerializedElement, configName, () => {
                    const definedAtFile = configValueSeriliazed.definedAtData[i];
                    assert(definedAtFile);
                    return definedAtFile;
                });
                addSideExports(sideExports);
                return value;
            });
            configValue = { value, ...common };
        }
        else {
            const { valueSerialized, ...common } = configValueSeriliazed;
            const { value, sideExports } = parseValueSerialized(valueSerialized, configName, () => {
                assert(configValueSeriliazed.type !== 'computed');
                const { definedAtData } = configValueSeriliazed;
                const definedAtFile = Array.isArray(definedAtData) ? definedAtData[0] : definedAtData;
                return definedAtFile;
            });
            addSideExports(sideExports);
            configValue = { value, ...common };
        }
        configValues[configName] = configValue;
    });
    return configValues;
    function addSideExports(sideExports) {
        sideExports.forEach((sideExport) => {
            const { configName, configValue } = sideExport;
            if (!configValues[configName]) {
                configValues[configName] = configValue;
            }
        });
    }
}
function parseValueSerialized(valueSerialized, configName, getDefinedAtFile) {
    if (valueSerialized.type === 'js-serialized') {
        let { value } = valueSerialized;
        value = parseTransform(value);
        return { value, sideExports: [] };
    }
    if (valueSerialized.type === 'pointer-import') {
        const { value } = valueSerialized;
        return { value, sideExports: [] };
    }
    if (valueSerialized.type === 'plus-file') {
        const definedAtFile = getDefinedAtFile();
        const { exportValues } = valueSerialized;
        assert(!definedAtFile.definedBy);
        assertPlusFileExport(exportValues, definedAtFile.filePathToShowToUser, configName);
        let value;
        let valueWasFound = false;
        const sideExports = [];
        Object.entries(exportValues).forEach(([exportName, exportValue]) => {
            const isSideExport = exportName !== 'default' && exportName !== configName;
            if (!isSideExport) {
                value = exportValue;
                // Already asserted by assertPlusFileExport() call above.
                assert(!valueWasFound);
                valueWasFound = true;
            }
            else {
                sideExports.push({
                    configName: exportName,
                    configValue: {
                        type: 'standard', // We don't support side exports for cumulative values. We could support it but it isn't trivial.
                        value: exportValue,
                        definedAtData: {
                            filePathToShowToUser: definedAtFile.filePathToShowToUser,
                            fileExportPathToShowToUser: [exportName],
                        },
                    },
                });
            }
        });
        // Already asserted by assertPlusFileExport() call above.
        assert(valueWasFound);
        return { value, sideExports };
    }
    assert(false);
}
/* [NULL_HANDLING] Do we really need this?
function assertIsNotNull(configValue: unknown, configName: string, filePathToShowToUser: string) {
  assert(!filePathToShowToUser.includes('+config.'))
  // Re-use this for:
  //  - upcoming config.requestPageContextOnNavigation
  //  - for cumulative values in the future: we don't need this for now because, currently, cumulative values are never imported.
  assertUsage(
    configValue !== null,
    `Set ${pc.cyan(configName)} to ${pc.cyan('null')} in a +config.js file instead of ${filePathToShowToUser}`
  )
}
*/

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/shared-server-client/assertVirtualFileExports.js [vike:pluginModuleBanner] */
// TO-DO/eventually: remove
function assertVirtualFileExports(moduleExports, test, moduleId) {
    assert(moduleExports, typeof moduleExports);
    if (!test(moduleExports)) {
        /* https://github.com/vikejs/vike/issues/2903#issuecomment-3642285811
        throw getProjectError('@cloudflare/vite-plugin error https://github.com/vikejs/vike/issues/2903#issuecomment-3642285811')
        /*/
        assert(false, { moduleExports, moduleExportsKeys: getKeys(moduleExports), moduleId });
        //*/
    }
}
function getKeys(obj) {
    return [...Object.getOwnPropertyNames(obj), ...Object.getOwnPropertySymbols(obj), ...Object.keys(obj)];
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/shared-server-client/getPageFiles/parseVirtualFileExportsGlobalEntry.js [vike:pluginModuleBanner] */
function parseVirtualFileExportsGlobalEntry(virtualFileExportsGlobalEntry) {
    assertVirtualFileExports(virtualFileExportsGlobalEntry, (moduleExports) => 'pageFilesLazy' in moduleExports);
    assert(hasProp(virtualFileExportsGlobalEntry, 'pageFilesLazy', 'object'));
    assert(hasProp(virtualFileExportsGlobalEntry, 'pageFilesEager', 'object'));
    assert(hasProp(virtualFileExportsGlobalEntry, 'pageFilesExportNamesLazy', 'object'));
    assert(hasProp(virtualFileExportsGlobalEntry, 'pageFilesExportNamesEager', 'object'));
    assert(hasProp(virtualFileExportsGlobalEntry.pageFilesLazy, '.page'));
    assert(hasProp(virtualFileExportsGlobalEntry.pageFilesLazy, '.page.client') ||
        hasProp(virtualFileExportsGlobalEntry.pageFilesLazy, '.page.server'));
    assert(hasProp(virtualFileExportsGlobalEntry, 'pageFilesList', 'string[]'));
    assert(hasProp(virtualFileExportsGlobalEntry, 'pageConfigsSerialized'));
    assert(hasProp(virtualFileExportsGlobalEntry, 'pageConfigGlobalSerialized'));
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
            if (!('fileExports' in pageFile)) {
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
            if (!('exportNames' in pageFile)) {
                const moduleExports = await loadModule();
                assert(hasProp(moduleExports, 'exportNames', 'string[]'), pageFile.filePath);
                pageFile.exportNames = moduleExports.exportNames;
            }
        };
    });
    // `pageFilesEager` contains `.page.route.js` files
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
        assert(hasProp(moduleExports, 'exportNames', 'string[]'), pageFile.filePath);
        pageFile.exportNames = moduleExports.exportNames;
    });
    virtualFileExportsGlobalEntry.pageFilesList.forEach((filePath) => {
        pageFilesMap[filePath] = pageFilesMap[filePath] ?? getPageFileObject(filePath);
    });
    const pageFilesAll = Object.values(pageFilesMap);
    pageFilesAll.forEach(({ filePath }) => {
        assert(!filePath.includes('\\'));
    });
    return { pageFilesAll, pageConfigs, pageConfigGlobal };
}
function parseGlobResult(globObject) {
    const ret = [];
    Object.entries(globObject).forEach(([fileType, globFiles]) => {
        assert(fileTypes.includes(fileType));
        assert(isObject(globFiles));
        Object.entries(globFiles).forEach(([filePath, globValue]) => {
            const pageFile = getPageFileObject(filePath);
            assert(pageFile.fileType === fileType);
            ret.push({ filePath, pageFile, globValue });
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
        assert(hasProp(pageConfigSerialized, 'pageId', 'string'));
        assert(hasProp(pageConfigSerialized, 'routeFilesystem'));
        assert(hasProp(pageConfigSerialized, 'configValuesSerialized'));
    });
}
function assertPageConfigGlobalSerialized(pageConfigGlobalSerialized) {
    assert(hasProp(pageConfigGlobalSerialized, 'configValuesSerialized'));
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/utils/sorter.js [vike:pluginModuleBanner] */
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
        if (val1 === val2) {
            return 0;
        }
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
        if (val1 === val2) {
            return 0;
        }
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
        assert([true, false, null].includes(val1));
        assert([true, false, null].includes(val2));
        if (val1 === val2) {
            return 0;
        }
        if (val1 === true || val2 === false) {
            return -1;
        }
        if (val2 === true || val1 === false) {
            return 1;
        }
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
        if (val === null) {
            return null;
        }
        else {
            return !val;
        }
    });
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/shared-server-client/page-configs/resolveVikeConfigPublic.js [vike:pluginModuleBanner] */
// TO-DO/soon/same-api: use public API internally?
// TO-DO/soon/flat-pageContext: rename definedAt => definedBy
function resolveGlobalConfigPublicPage(pageConfigGlobalValues, pageConfig, pageConfigValues) {
    const pageConfigPublic_ = resolvePageConfigPublic({ pageConfigGlobalValues, pageConfigValues });
    const pageConfigPublic = getPublicCopy(pageConfigPublic_);
    const page = (() => {
        if (!pageConfig.isErrorPage) {
            const route = pageConfigPublic.config.route ?? pageConfig.routeFilesystem.routeString;
            return {
                ...pageConfigPublic,
                route,
            };
        }
        else {
            return {
                ...pageConfigPublic,
                isErrorPage: true,
            };
        }
    })();
    return [pageConfig.pageId, page];
}
function getPublicCopy(configInternal) {
    const configPublic = {
        config: configInternal.config,
        // TO-DO/soon/flat-pageContext: expose publicly?
        _source: configInternal.source,
        _sources: configInternal.sources,
        _from: configInternal.from,
    };
    return configPublic;
}
function resolvePageConfigPublic({ pageConfigGlobalValues, pageConfigValues, }) {
    const configValues = { ...pageConfigGlobalValues, ...pageConfigValues };
    return resolveConfigPublic_V1Design({ configValues });
}
function resolvePageContextConfig(pageFiles, // V0.4 design
pageConfig, // V1 design
pageConfigGlobal) {
    const config = {};
    const configEntries = {}; // TO-DO/next-major-release: remove
    const exportsAll = {}; // TO-DO/next-major-release: remove
    // V0.4 design
    // TO-DO/next-major-release: remove
    pageFiles.forEach((pageFile) => {
        const exportValues = getExportValues(pageFile);
        exportValues.forEach(({ exportName, exportValue, isFromDefaultExport }) => {
            assert(exportName !== 'default');
            exportsAll[exportName] = exportsAll[exportName] ?? [];
            exportsAll[exportName].push({
                exportValue,
                exportSource: `${pageFile.filePath} > ${isFromDefaultExport ? `\`export default { ${exportName} }\`` : `\`export { ${exportName} }\``}`,
                filePath: pageFile.filePath,
                _filePath: pageFile.filePath, // TO-DO/next-major-release: remove
                _fileType: pageFile.fileType,
                _isFromDefaultExport: isFromDefaultExport,
            });
        });
    });
    let source;
    let sources;
    let from;
    if (pageConfig) {
        const res = resolvePageConfigPublic({
            pageConfigGlobalValues: pageConfigGlobal.configValues,
            pageConfigValues: pageConfig.configValues,
        });
        source = res.source;
        sources = res.sources;
        from = res.from;
        Object.assign(config, res.config);
        Object.assign(configEntries, res.configEntries);
        Object.assign(exportsAll, res.exportsAll);
    }
    else {
        source = {};
        sources = {};
        from = {
            configsStandard: {},
            configsCumulative: {},
            configsComputed: {},
        };
    }
    const pageExports = {};
    const exports = {};
    Object.entries(exportsAll).forEach(([exportName, values]) => {
        values.forEach(({ exportValue, _fileType, _isFromDefaultExport }) => {
            exports[exportName] = exports[exportName] ?? exportValue;
            // Legacy pageContext.pageExports
            if (_fileType === '.page' && !_isFromDefaultExport) {
                if (!(exportName in pageExports)) {
                    pageExports[exportName] = exportValue;
                }
            }
        });
    });
    assert(!('default' in exports));
    assert(!('default' in exportsAll));
    const pageContextAddendum = {
        config: config,
        from,
        source,
        sources,
        // TO-DO/soon/flat-pageContext: deprecate every prop below
        configEntries,
        exports,
        exportsAll,
    };
    // TO-DO/next-major-release: remove
    objectDefineProperty(pageContextAddendum, 'pageExports', {
        get: () => {
            // We only show the warning in Node.js because when using Client Routing Vue integration uses `Object.assign(pageContextReactive, pageContext)` which will wrongully trigger the warning. There is no cross-browser way to catch whether the property accessor was initiated by an `Object.assign()` call.
            if (!isBrowser()) {
                assertWarning(false, 'pageContext.pageExports is outdated, use pageContext.exports instead', {
                    onlyOnce: true,
                    showStackTrace: true,
                });
            }
            return pageExports;
        },
        enumerable: false,
        configurable: true,
    });
    return pageContextAddendum;
}
function resolveGlobalContextConfig(pageConfigs, pageConfigGlobal) {
    const globalContextAddendum = resolveGlobalConfigPublic(pageConfigs, pageConfigGlobal, (c) => c.configValues);
    return globalContextAddendum;
}
function resolveGlobalConfigPublic(pageConfigs, pageConfigGlobal, getConfigValues) {
    // global
    const pageConfigGlobalValues = getConfigValues(pageConfigGlobal, true);
    const globalConfigPublicBase_ = resolveConfigPublic_V1Design({ configValues: pageConfigGlobalValues });
    const globalConfigPublicBase = getPublicCopy(globalConfigPublicBase_);
    // pages
    const pages = Object.fromEntries(pageConfigs.map((pageConfig) => {
        const pageConfigValues = getConfigValues(pageConfig);
        return resolveGlobalConfigPublicPage(pageConfigGlobalValues, pageConfig, pageConfigValues);
    }));
    const globalConfigPublic = {
        ...globalConfigPublicBase,
        pages,
    };
    return {
        ...globalConfigPublic,
        _globalConfigPublic: globalConfigPublic,
    };
}
// V1 design
function resolveConfigPublic_V1Design(pageConfig) {
    const config = {};
    const configEntries = {};
    const exportsAll = {};
    const source = {};
    const sources = {};
    const from = {
        configsStandard: {},
        configsCumulative: {},
        configsComputed: {},
    };
    const addSrc = (src, configName) => {
        source[configName] = src;
        sources[configName] ?? (sources[configName] = []);
        sources[configName].push(src);
    };
    const addLegacy = (configName, value, definedAtData) => {
        const configValueFilePathToShowToUser = getConfigValueFilePathToShowToUser(definedAtData);
        const configDefinedAt = getConfigDefinedAtOptional('Config', configName, definedAtData);
        configEntries[configName] = configEntries[configName] ?? [];
        configEntries[configName].push({
            configValue: value,
            configDefinedAt,
            configDefinedByFile: configValueFilePathToShowToUser,
        });
        // TO-DO/next-major-release: remove
        const exportName = configName;
        exportsAll[exportName] = exportsAll[exportName] ?? [];
        exportsAll[exportName].push({
            exportValue: value,
            exportSource: configDefinedAt,
            filePath: configValueFilePathToShowToUser,
            _filePath: configValueFilePathToShowToUser,
            _fileType: null,
            _isFromDefaultExport: null,
        });
    };
    Object.entries(pageConfig.configValues).forEach(([configName, configValue]) => {
        const { value } = configValue;
        config[configName] = config[configName] ?? value;
        if (configValue.type === 'standard') {
            const src = {
                type: 'configsStandard',
                value: configValue.value,
                definedAt: getDefinedAtString(configValue.definedAtData, configName),
            };
            addSrc(src, configName);
            from.configsStandard[configName] = src;
            addLegacy(configName, value, configValue.definedAtData);
        }
        if (configValue.type === 'cumulative') {
            const src = {
                type: 'configsCumulative',
                definedAt: getDefinedAtString(configValue.definedAtData, configName),
                values: configValue.value.map((value, i) => {
                    const definedAtFile = configValue.definedAtData[i];
                    assert(definedAtFile);
                    const definedAt = getDefinedAtString(definedAtFile, configName);
                    addLegacy(configName, value, definedAtFile);
                    return {
                        value,
                        definedAt,
                    };
                }),
            };
            addSrc(src, configName);
            from.configsCumulative[configName] = src;
        }
        if (configValue.type === 'computed') {
            const src = {
                type: 'configsComputed',
                definedAt: 'Vike', // Vike currently doesn't support user-land computed configs => computed configs are always defined by Vike => there isn't any file path to show.
                value: configValue.value,
            };
            addSrc(src, configName);
            from.configsComputed[configName] = src;
            addLegacy(configName, value, configValue.definedAtData);
        }
    });
    return {
        config: config,
        configEntries,
        exportsAll,
        source,
        sources,
        from,
    };
}
// V0.4 design
// TO-DO/next-major-release: remove
function getExportValues(pageFile) {
    const { filePath, fileExports } = pageFile;
    assert(fileExports); // assume pageFile.loadFile() was called
    assert(isScriptFile(filePath));
    const exportValues = [];
    Object.entries(fileExports)
        .sort(makeLast(([exportName]) => exportName === 'default')) // `export { bla }` should override `export default { bla }`
        .forEach(([exportName, exportValue]) => {
        let isFromDefaultExport = exportName === 'default';
        if (isFromDefaultExport) {
            if (isTemplateFile(filePath)) {
                exportName = 'Page';
            }
            else {
                assertUsage(isObject(exportValue), `The ${pc.cyan('export default')} of ${filePath} should be an object.`);
                Object.entries(exportValue).forEach(([defaultExportName, defaultExportValue]) => {
                    assertDefaultExports(defaultExportName, filePath);
                    exportValues.push({
                        exportName: defaultExportName,
                        exportValue: defaultExportValue,
                        isFromDefaultExport,
                    });
                });
                return;
            }
        }
        exportValues.push({
            exportName,
            exportValue,
            isFromDefaultExport,
        });
    });
    exportValues.forEach(({ exportName, isFromDefaultExport }) => {
        assert(!(isFromDefaultExport && forbiddenDefaultExports.includes(exportName)));
    });
    return exportValues;
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/shared-server-client/createGlobalContextShared.js [vike:pluginModuleBanner] */
// TO-DO/eventually use flat globalContext — like flat pageContext
async function createGlobalContextShared(virtualFileExportsGlobalEntry, globalObject, addGlobalContext, 
// TO-DO/next-major-release: we'll be able to remove addGlobalContextTmp after loadPageRoutes() is sync (it will be sync after we remove the old design)
addGlobalContextTmp, addGlobalContextAsync) {
    const { previousCreateGlobalContextPromise } = globalObject;
    const { promise, resolve } = genPromise({
        // Avoid this Cloudflare Worker error:
        // ```console
        // Error: Disallowed operation called within global scope. Asynchronous I/O (ex: fetch() or connect()), setting a timeout, and generating random values are not allowed within global scope. To fix this error, perform this operation within a handler.
        // ```
        timeout: null,
    });
    globalObject.previousCreateGlobalContextPromise = promise;
    if (previousCreateGlobalContextPromise) {
        assert(globalObject.globalContext);
        await previousCreateGlobalContextPromise;
    }
    try {
        const globalContext = createGlobalContextBase(virtualFileExportsGlobalEntry);
        let isNewGlobalContext;
        if (!globalObject.globalContext) {
            // We set globalObject.globalContext early and before any async operations, so that getGlobalContextSync() can be used early.
            // - Required by vike-vercel
            globalObject.globalContext = globalContext;
            isNewGlobalContext = false;
        }
        else {
            isNewGlobalContext = true;
        }
        if (addGlobalContext &&
            // TO-DO/next-major-release: remove
            globalContext._pageConfigs.length > 0) {
            const globalContextAdded = addGlobalContext?.(globalContext);
            objectAssign(globalContext, globalContextAdded);
        }
        else {
            const globalContextAdded = await addGlobalContextTmp?.(globalContext);
            objectAssign(globalContext, globalContextAdded);
        }
        {
            const globalContextAddedAsync = await addGlobalContextAsync?.(globalContext);
            objectAssign(globalContext, globalContextAddedAsync);
        }
        const onCreateGlobalContextHooks = getHooksFromPageConfigGlobalCumulative(globalContext._pageConfigGlobal, 'onCreateGlobalContext');
        let hooksCalled = false;
        if (!hooksAreEqual(globalObject.onCreateGlobalContextHooks ?? [], onCreateGlobalContextHooks)) {
            globalObject.onCreateGlobalContextHooks = onCreateGlobalContextHooks;
            await execHookGlobal('onCreateGlobalContext', globalContext, getGlobalContextPublicShared);
            hooksCalled = true;
        }
        if (isNewGlobalContext) {
            // Singleton: ensure all `globalContext` user-land references are preserved & updated.
            if (hooksCalled) {
                objectReplace(globalObject.globalContext, globalContext);
            }
            else {
                // We don't use objectReplace() in order to keep user-land properties.
                objectAssign(globalObject.globalContext, globalContext, true);
            }
        }
        return globalObject.globalContext;
    }
    finally {
        resolve();
    }
}
function createGlobalContextBase(virtualFileExportsGlobalEntry) {
    const { pageFilesAll, pageConfigs, pageConfigGlobal } = parseVirtualFileExportsGlobalEntry(virtualFileExportsGlobalEntry);
    const allPageIds = getAllPageIds(pageFilesAll, pageConfigs);
    const globalContextAddendum = resolveGlobalContextConfig(pageConfigs, pageConfigGlobal);
    const globalContext = {
        /**
         * Useful for distinguishing `globalContext` from other objects and narrowing down TypeScript unions.
         *
         * https://vike.dev/globalContext#typescript
         */
        isGlobalContext: true,
        _isOriginalObject: true,
        _virtualFileExportsGlobalEntry: virtualFileExportsGlobalEntry,
        _pageFilesAll: pageFilesAll,
        _pageConfigs: pageConfigs,
        _pageConfigGlobal: pageConfigGlobal,
        _allPageIds: allPageIds,
        ...globalContextAddendum,
    };
    changeEnumerable(globalContext, '_isOriginalObject', false);
    return globalContext;
}
function getAllPageIds(pageFilesAll, pageConfigs) {
    const fileIds = pageFilesAll.filter(({ isDefaultPageFile }) => !isDefaultPageFile).map(({ pageId }) => pageId);
    const allPageIds = unique(fileIds);
    const allPageIds2 = pageConfigs.map((p) => p.pageId);
    return [...allPageIds, ...allPageIds2];
}
function hooksAreEqual(hooks1, hooks2) {
    const hooksFn1 = hooks1.map((hook) => hook.hookFn);
    const hooksFn2 = hooks2.map((hook) => hook.hookFn);
    return (hooksFn1.every((hook) => hooksFn2.includes(hook)) &&
        //
        hooksFn2.every((hook) => hooksFn1.includes(hook)));
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/client/shared/getGlobalContextClientInternalShared.js [vike:pluginModuleBanner] */
// Public usage
const globalObject = getGlobalObject('getGlobalContextClientInternalShared.ts', (() => {
    const { promise: globalContextInitialPromise, resolve: globalContextInitialPromiseResolve } = genPromise();
    return {
        globalContextInitialPromise,
        globalContextInitialPromiseResolve,
    };
})());
async function getGlobalContextClientInternalShared() {
    // Get
    if (globalObject.globalContextPromise) {
        const globalContext = await globalObject.globalContextPromise;
        return globalContext;
    }
    // Create
    const globalContextPromise = createGlobalContextShared(globalObject.virtualFileExportsGlobalEntry, globalObject, () => {
        const globalContextAddendum = {
            /**
             * Whether the environment is the client-side:
             * - In the browser, the value is `true`.
             * - Upon SSR and pre-rendering, the value is `false`.
             *
             * https://vike.dev/globalContext#isClientSide
             */
            isClientSide: true,
        };
        objectAssign(globalContextAddendum, getGlobalContextSerializedInHtml());
        return globalContextAddendum;
    });
    globalObject.globalContextPromise = globalContextPromise;
    const globalContext = await globalContextPromise;
    assert(globalObject.globalContext === globalContext);
    globalObject.globalContextInitialPromiseResolve();
    // Return
    return globalContext;
}
async function setVirtualFileExportsGlobalEntry(virtualFileExportsGlobalEntry) {
    // HMR => virtualFileExportsGlobalEntry differ
    if (globalObject.virtualFileExportsGlobalEntry !== virtualFileExportsGlobalEntry) {
        delete globalObject.globalContextPromise;
        globalObject.virtualFileExportsGlobalEntry = virtualFileExportsGlobalEntry;
        // Eagerly call +onCreateGlobalContext() hooks
        await getGlobalContextClientInternalShared();
    }
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/utils/assertRoutingType.js [vike:pluginModuleBanner] */
const state = getGlobalObject('utils/assertRouterType.ts', {});
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
    // If an assertion fails because of a wrong usage, then we assume that the user is trying to import from 'vike/client/router' while not setting `clientRouting` to `true`. Note that 'vike/client' only exports the type `PageContextBuiltInClient` and that the package.json#exports entry 'vike/client' will eventually be removed.
    assertUsage(isBrowser(), `${pc.cyan("import { something } from 'vike/client/router'")} is forbidden on the server-side`, { showStackTrace: true });
    assertWarning(noContradiction, "You shouldn't `import { something } from 'vike/client/router'` when using Server Routing. The 'vike/client/router' utilities work only with Client Routing. In particular, don't `import { navigate }` nor `import { prefetch }` as they unnecessarily bloat your client-side bundle sizes.", { showStackTrace: true, onlyOnce: true });
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/shared-server-client/page-configs/findPageConfig.js [vike:pluginModuleBanner] */
function findPageConfig(pageConfigs, pageId) {
    const result = pageConfigs.filter((p) => p.pageId === pageId);
    assert(result.length <= 1);
    const pageConfig = result[0] ?? null;
    return pageConfig;
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/shared-server-client/page-configs/loadAndParseVirtualFilePageEntry.js [vike:pluginModuleBanner] */
async function loadAndParseVirtualFilePageEntry(pageConfig, isDev) {
    if ('isPageEntryLoaded' in pageConfig &&
        // We don't need to cache in dev, since Vite already caches the virtual module
        true) {
        return pageConfig;
    }
    const { moduleId, moduleExportsPromise } = pageConfig.loadVirtualFilePageEntry();
    const moduleExports = await moduleExportsPromise;
    /* `moduleExports` is sometimes `undefined` https://github.com/vikejs/vike/discussions/2092
    assert(moduleExports)
    //*/
    // Catch @cloudflare/vite-plugin bug
    assertVirtualFileExports(moduleExports, () => 'configValuesSerialized' in moduleExports, moduleId);
    const virtualFileExportsPageEntry = moduleExports;
    let configValues;
    try {
        configValues = parseVirtualFileExportsPageEntry(virtualFileExportsPageEntry);
    }
    catch (e) {
        // Safari WebKit bug: dynamic import() may resolve before the module body executes.
        if (
        // Throwing ReferenceError (TDZ): https://github.com/vikejs/vike/issues/3121
        !(e instanceof ReferenceError) &&
            // Or TypeError (undefined exports) on some WebKit builds: https://github.com/vikejs/vike/issues/3199
            !(e instanceof TypeError))
            throw e;
        await new Promise((resolve) => setTimeout(resolve));
        configValues = parseVirtualFileExportsPageEntry(virtualFileExportsPageEntry);
    }
    Object.assign(pageConfig.configValues, configValues);
    objectAssign(pageConfig, { isPageEntryLoaded: true });
    return pageConfig;
}
function parseVirtualFileExportsPageEntry(virtualFileExportsPageEntry) {
    const configValues = parseConfigValuesSerialized(virtualFileExportsPageEntry.configValuesSerialized);
    return configValues;
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/client/shared/loadPageConfigsLazyClientSide.js [vike:pluginModuleBanner] */
const errStamp = "_isAssetsError";
async function loadPageConfigsLazyClientSide(pageId, pageFilesAll, pageConfigs, pageConfigGlobal) {
  const pageFilesClientSide = getPageFilesClientSide(pageFilesAll, pageId);
  const pageConfig = findPageConfig(pageConfigs, pageId);
  let pageConfigLoaded;
  try {
    const result = await Promise.all([
      pageConfig && loadAndParseVirtualFilePageEntry(pageConfig, false),
      ...pageFilesClientSide.map((p) => p.loadFile?.())
    ]);
    pageConfigLoaded = result[0];
  } catch (err) {
    if (isFetchError(err)) {
      Object.assign(err, { [errStamp]: true });
    }
    throw err;
  }
  const pageContextAddendum = {};
  objectAssign(pageContextAddendum, resolvePageContextConfig(pageFilesClientSide, pageConfigLoaded, pageConfigGlobal));
  objectAssign(pageContextAddendum, { _pageFilesLoaded: pageFilesClientSide });
  return pageContextAddendum;
}
function isErrorFetchingStaticAssets(err) {
  if (!err) {
    return false;
  }
  return err[errStamp] === true;
}
function isFetchError(err) {
  if (!(err instanceof Error))
    return false;
  const FAILED_TO_FETCH_MESSAGES = [
    // chromium
    "Failed to fetch dynamically imported module",
    // firefox
    "error loading dynamically imported module",
    // safari
    "Importing a module script failed",
    // ??
    "error resolving module specifier",
    // ??
    "failed to resolve module"
  ];
  return FAILED_TO_FETCH_MESSAGES.some((s) => err.message.toLowerCase().includes(s.toLowerCase()));
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/client/shared/normalizeClientSideUrl.js [vike:pluginModuleBanner] */
/** Resolves relative URLs */
function normalizeClientSideUrl(url, options) {
    // This function doesn't work for `url === '#some-hash'` because `searchOriginal` will be missing: if window.location.href has a search string then it's going to be missing in the returned `urlCurrent` value because `parseUrl(url)` returns `searchOriginal: null` since there isn't any search string in `url`.
    // - Maybe `const { searchOriginal } = parseUrl(window.location.href)` can be a fix. (Let's check how `normalizeClientSideUrl()` is being used.)
    assert(!url.startsWith('#'));
    const { searchOriginal, hashOriginal, pathname } = parseUrl(url, '/');
    let urlCurrent = `${pathname}${searchOriginal || ''}`;
    if (!options?.withoutHash)
        urlCurrent += hashOriginal || '';
    assert(urlCurrent.startsWith('/'));
    return urlCurrent;
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.258_react-streaming@0.4.3_react-dom@19.1.1_react@19.1.1__react@19.1.1__srvx@0._1d412c85be87ef02471ca3915f8bd95e/node_modules/vike/dist/client/shared/getCurrentUrl.js [vike:pluginModuleBanner] */
function getCurrentUrl(options) {
    return normalizeClientSideUrl(window.location.href, options);
}

export { getPageContextSerializedInHtml as $, isArray as A, isErrorPageId as B, getGlobalContextClientInternalShared as C, createPageContextShared as D, updateType as E, createPageContextObject as F, isBaseServer as G, isUrlExternal as H, isUrl as I, normalizeClientSideUrl as J, getPageFilesClientSide as K, findPageConfig as L, makeFirst as M, lowerFirst as N, assertUsageUrlAbsolute as O, assertClientRouting as P, loadPageConfigsLazyClientSide as Q, isErrorFetchingStaticAssets as R, getCurrentUrl as S, assertInfo as T, genPromise as U, providePageContext as V, getHookFromPageContext as W, execHookSingle as X, assertServerRouting as Y, assertSingleInstance_onClientEntryServerRouting as Z, setVirtualFileExportsGlobalEntry as _, assert as a, execHook as a0, assertUsage as b, getPageFilesServerSide as c, assertWarning as d, parseUrl as e, getGlobalObject as f, getConfigDefinedAtOptional as g, hasProp as h, isObject as i, parse as j, getProjectError as k, getPageConfig as l, assertPropertyGetters as m, objectDefineProperty as n, objectAssign as o, pc as p, isBrowser as q, changeEnumerable as r, higherFirst as s, slice as t, isCallable as u, execHookSingleSync as v, getPageContextPublicShared as w, getHookFromPageConfigGlobal as x, getHookTimeoutDefault as y, getDefinedAtString as z };
