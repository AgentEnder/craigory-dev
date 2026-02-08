/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/utils/unique.js [vike:pluginModuleBanner] */
function unique(arr) {
    return Array.from(new Set(arr));
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/utils/getGlobalObject.js [vike:pluginModuleBanner] */
/** Share information across module instances. */
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

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/@brillout+picocolors@1.0.28/node_modules/@brillout/picocolors/dist/esm/picocolors.browser.js [vike:pluginModuleBanner] */
const pc = new Proxy({}, {
    get: (_, p) => (s) => {
        if (p === 'code')
            return `\`${s}\``;
        if (p === 'string')
            return `'${s}'`;
        return s;
    }
});

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/utils/PROJECT_VERSION.js [vike:pluginModuleBanner] */
// Automatically updated by @brillout/release-me
const PROJECT_VERSION = '0.4.239-commit-9dcde6d';

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/utils/assertSingleInstance.js [vike:pluginModuleBanner] */
/* Use original assertWarning() after all CJS is removed from node_modules/vike/dist/
import { assertWarning } from './assert.js'
*/
let globalObject$3;
// getGlobalObjectSafe() can be called before this line
globalObject$3 ?? (globalObject$3 = genGlobalConfig());
function genGlobalConfig() {
    return getGlobalObject('utils/assertSingleInstance.ts', {
        instances: [],
        alreadyLogged: new Set(),
    });
}
// We need getGlobalObjectSafe() because globalObject is `undefined` when exported functions are called before globalObject is initialized
function getGlobalObjectSafe() {
    globalObject$3 ?? (globalObject$3 = genGlobalConfig());
    return globalObject$3;
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
        `vike@${pc.bold(versions[0])} and vike@${pc.bold(versions[1])} loaded which is highly discouraged, see ${pc.underline('https://vike.dev/warning/version-mismatch')}`, { onlyOnce: true, showStackTrace: false });
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
// Called by utils/assert.ts which is (most certainly) loaded by all entries. That way we don't have to call a callback for every entry. (There are a lot of entries: `client/router/`, `client/`, `node/runtime/`, `node/vite/`, `node/cli`.)
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

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/utils/isNodeJS.js [vike:pluginModuleBanner] */
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

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/utils/createErrorWithCleanStackTrace.js [vike:pluginModuleBanner] */
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

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/utils/isObject.js [vike:pluginModuleBanner] */
function isObject(value) {
    return typeof value === 'object' && value !== null;
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/utils/assert.js [vike:pluginModuleBanner] */
const globalObject$2 = getGlobalObject('utils/assert.ts', {
    alreadyLogged: new Set(),
    // Production logger. Overwritten by loggerNotProd.ts in non-production environments.
    logger(msg, logType) {
        if (logType === 'info') {
            console.log(msg);
        }
        else {
            console.warn(msg);
        }
    },
    showStackTraceList: new WeakSet(),
});
assertSingleInstance_onAssertModuleLoad();
const projectTag = `[vike]`;
const projectTagWithVersion = `[vike@${PROJECT_VERSION}]`;
const bugTag = 'Bug';
const numberOfStackTraceLinesToRemove = 2;
function assert(condition, debugInfo) {
    if (condition)
        return;
    const debugStr = (() => {
        if (!debugInfo) {
            return null;
        }
        const debugInfoSerialized = typeof debugInfo === 'string' ? debugInfo : JSON.stringify(debugInfo);
        return pc.dim(`Debug info for Vike maintainers (you can ignore this): ${debugInfoSerialized}`);
    })();
    const link = pc.underline('https://github.com/vikejs/vike/issues/new?template=bug.yml');
    let errMsg = [
        `You stumbled upon a Vike bug. Go to ${link} and copy-paste this error. A maintainer will fix the bug (usually within 24 hours).`,
        debugStr,
    ]
        .filter(Boolean)
        .join(' ');
    errMsg = addWhitespace(errMsg);
    errMsg = addPrefixAssertType(errMsg, bugTag);
    errMsg = addPrefixProjectName(errMsg, true);
    const internalError = createErrorWithCleanStackTrace(errMsg, numberOfStackTraceLinesToRemove);
    globalObject$2.onBeforeLog?.();
    throw internalError;
}
function assertUsage(condition, errMsg, { showStackTrace, exitOnError } = {}) {
    if (condition)
        return;
    showStackTrace = showStackTrace || globalObject$2.alwaysShowStackTrace;
    errMsg = addWhitespace(errMsg);
    errMsg = addPrefixAssertType(errMsg, 'Wrong Usage');
    errMsg = addPrefixProjectName(errMsg);
    const usageError = createErrorWithCleanStackTrace(errMsg, numberOfStackTraceLinesToRemove);
    if (showStackTrace) {
        globalObject$2.showStackTraceList.add(usageError);
    }
    globalObject$2.onBeforeLog?.();
    if (!exitOnError) {
        throw usageError;
    }
    else {
        console.error(showStackTrace ? usageError : errMsg);
        process.exit(1);
    }
}
function getProjectError(errMsg) {
    errMsg = addWhitespace(errMsg);
    errMsg = addPrefixAssertType(errMsg, 'Error');
    errMsg = addPrefixProjectName(errMsg);
    const projectError = createErrorWithCleanStackTrace(errMsg, numberOfStackTraceLinesToRemove);
    return projectError;
}
function assertWarning(condition, msg, { onlyOnce, showStackTrace }) {
    if (condition)
        return;
    showStackTrace = showStackTrace || globalObject$2.alwaysShowStackTrace;
    msg = addWhitespace(msg);
    msg = addPrefixAssertType(msg, 'Warning');
    msg = addPrefixProjectName(msg);
    if (onlyOnce) {
        const { alreadyLogged } = globalObject$2;
        const key = onlyOnce === true ? msg : onlyOnce;
        if (alreadyLogged.has(key))
            return;
        alreadyLogged.add(key);
    }
    globalObject$2.onBeforeLog?.();
    if (showStackTrace) {
        const err = createErrorWithCleanStackTrace(msg, numberOfStackTraceLinesToRemove);
        globalObject$2.showStackTraceList.add(err);
        globalObject$2.logger(err, 'warn');
    }
    else {
        globalObject$2.logger(msg, 'warn');
    }
}
function addPrefixAssertType(msg, tag) {
    let prefix = `[${tag}]`;
    const color = tag === 'Warning' ? 'yellow' : 'red';
    prefix = pc.bold(pc[color](prefix));
    return `${prefix}${msg}`;
}
function addWhitespace(msg) {
    if (msg.startsWith('[')) {
        return msg;
    }
    else {
        return ` ${msg}`;
    }
}
function addPrefixProjectName(msg, showProjectVersion = false) {
    const prefix = showProjectVersion ? projectTagWithVersion : projectTag;
    return `${prefix}${msg}`;
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/utils/humanizeTime.js [vike:pluginModuleBanner] */
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

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/utils/isCallable.js [vike:pluginModuleBanner] */
function isCallable(thing) {
    return thing instanceof Function || typeof thing === 'function';
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/utils/isArray.js [vike:pluginModuleBanner] */
// Same as Array.isArray() but typesafe: asserts unknown[] instead of any[]
function isArray(value) {
    return Array.isArray(value);
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/shared/page-configs/helpers.js [vike:pluginModuleBanner] */
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

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/shared/hooks/getHook.js [vike:pluginModuleBanner] */
const globalObject$1 = getGlobalObject('hooks/getHook.ts', {});
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
// TO-DO/eventually: remove getHookFromPageContext() in favor of getHookFromPageContextNew()
function getHookFromPageContextNew(hookName, pageContext) {
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
function getHookFromPageConfigGlobalCumulative(pageConfigGlobal, hookName) {
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
    if (globalObject$1.isPrerendering) {
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

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/shared/hooks/execHook.js [vike:pluginModuleBanner] */
const globalObject = getGlobalObject('utils/execHook.ts', {
    userHookErrors: new WeakMap(),
    pageContext: null,
});
async function execHook(hookName, pageContext, preparePageContextForPublicUsage) {
    const hooks = getHookFromPageContextNew(hookName, pageContext);
    return await execHookDirect(hooks, pageContext, preparePageContextForPublicUsage);
}
async function execHookGlobal(hookName, pageConfigGlobal, pageContext, hookArg, prepareForPublicUsage) {
    const hooks = getHookFromPageConfigGlobalCumulative(pageConfigGlobal, hookName);
    const hookArgForPublicUsage = prepareForPublicUsage(hookArg);
    await Promise.all(hooks.map(async (hook) => {
        await execHookDirectAsync(() => hook.hookFn(hookArgForPublicUsage), hook, pageContext);
    }));
}
async function execHookDirect(hooks, pageContext, preparePageContextForPublicUsage) {
    if (!hooks.length)
        return [];
    const pageContextForPublicUsage = preparePageContextForPublicUsage(pageContext);
    const hooksWithResult = await Promise.all(hooks.map(async (hook) => {
        const hookReturn = await execHookDirectAsync(() => hook.hookFn(pageContextForPublicUsage), hook, pageContextForPublicUsage);
        return { ...hook, hookReturn };
    }));
    return hooksWithResult;
}
async function execHookDirectSingle(hook, pageContext, preparePageContextForPublicUsage) {
    const hooksWithResult = await execHookDirect([hook], pageContext, preparePageContextForPublicUsage);
    const { hookReturn } = hooksWithResult[0];
    assertUsage(hookReturn === undefined, `The ${hook.hookName}() hook defined by ${hook.hookFilePath} isn't allowed to return a value`);
}
function execHookDirectAsync(hookFnCaller, hook, pageContextForPublicUsage) {
    const { hookName, hookFilePath, hookTimeout: { error: timeoutErr, warning: timeoutWarn }, } = hook;
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
    const currentTimeoutWarn = isNotDisabled(timeoutWarn) &&
        setTimeout(() => {
            assertWarning(false, `The ${hookName}() hook defined by ${hookFilePath} is slow: it's taking more than ${humanizeTime(timeoutWarn)} (https://vike.dev/hooksTimeout)`, { onlyOnce: false });
        }, timeoutWarn);
    const currentTimeoutErr = isNotDisabled(timeoutErr) &&
        setTimeout(() => {
            const err = getProjectError(`The ${hookName}() hook defined by ${hookFilePath} timed out: it didn't finish after ${humanizeTime(timeoutErr)} (https://vike.dev/hooksTimeout)`);
            reject(err);
        }, timeoutErr);
    (async () => {
        try {
            providePageContextInternal(pageContextForPublicUsage);
            const ret = await hookFnCaller();
            resolve(ret);
        }
        catch (err) {
            if (isObject(err)) {
                globalObject.userHookErrors.set(err, { hookName, hookFilePath });
            }
            reject(err);
        }
    })();
    return promise;
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
    globalObject.pageContext = pageContext;
    // Promise.resolve() is quicker than process.nextTick() and setImmediate()
    // https://stackoverflow.com/questions/67949576/process-nexttick-before-promise-resolve-then
    Promise.resolve().then(() => {
        globalObject.pageContext = null;
    });
}

export { assert as a, isObject as b, isCallable as c, assertWarning as d, pc as e, assertUsage as f, getGlobalObject as g, getConfigValueFilePathToShowToUser as h, isArray as i, getHookFromPageConfigGlobalCumulative as j, execHookGlobal as k, execHook as l, getHookFromPageContext as m, execHookDirectSingle as n, assertSingleInstance_onClientEntryServerRouting as o, providePageContext as p, unique as u };
