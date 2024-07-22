const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/entries/pages_error.BG2u-iYF.js","assets/chunks/chunk-D5GMF5o4.js","assets/static/Layout.DPiU9c-V.css","assets/entries/pages_blog_index.Bn_QtP8n.js","assets/chunks/chunk-CfwY3ly5.js","assets/static/index.CM3M2hnW.css","assets/entries/pages_blog_view.-C0kqZO3.js","assets/chunks/chunk-R6vrXNZx.js","assets/static/view.CxJuleVu.css","assets/entries/pages_index.FeIhZ4Ig.js","assets/entries/pages_presentations_index.DGRWxHYD.js","assets/chunks/chunk-GvhJ67bf.js","assets/static/view-presentation.pnF2VRTw.css","assets/static/index.DBS14iC-.css","assets/entries/pages_presentations_view.DEVnx1jt.js","assets/chunks/chunk-CZ1xLuGe.js","assets/entries/pages_projects.7dItuqHz.js","assets/static/projects.5vpgQK3o.css"])))=>i.map(i=>d[i]);
import { _ as __vitePreload } from '../chunks/chunk-CZ1xLuGe.js';

function unique(arr) {
    return Array.from(new Set(arr));
}

const PROJECT_VERSION = '0.4.180';
const projectInfo = {
    projectName: 'Vike',
    projectVersion: PROJECT_VERSION
};

const projectKey = `_${projectInfo.projectName.toLowerCase()}`;
/** Share information across module instances. */
function getGlobalObject(
// We use the filename (or file path) as key. There should be only one getGlobalObject() usage per file. Thus the key should be unique, assuming the filename (or file path) is unique.
key, defaultValue) {
    const globalObjects = getGlobalObjects();
    const globalObject = (globalObjects[key] = globalObjects[key] || defaultValue);
    return globalObject;
}
function getGlobalObjects() {
    // @ts-ignore
    const globalObjects = (globalThis[projectKey] = globalThis[projectKey] || {});
    return globalObjects;
}

const pc = new Proxy(
  {},
  {
    get: (_, p) =>
      (s) => p !== 'code' ? s : `\`${s}\``
  }
);

/* Use original assertUsage() & assertWarning() after all CJS is removed from node_modules/vike/dist/
import { assertUsage, assertWarning } from './assert.js'
*/
const globalObject$5 = getGlobalObject('assertPackageInstances.ts', {
    instances: [],
    alreadyLogged: new Set()
});
const clientRuntimesClonflict = "The client runtime of Server Routing as well as the client runtime of Client Routing are both being loaded. Make sure they aren't loaded both at the same time for a given page. See https://vike.dev/client-runtimes-conflict";
const clientNotSingleInstance = "Two vike client runtime instances are being loaded. Make sure your client-side bundles don't include vike twice. (In order to reduce the size of your client-side JavaScript bundles.)";
function assertSingleInstance() {
    {
        const versions = unique(globalObject$5.instances);
        assertUsage$1(versions.length <= 1, 
        // DO *NOT* patch vike to remove this error: because of multiple conflicting versions, you *will* eventually encounter insidious issues that hard to debug and potentially a security hazard, see for example https://github.com/vikejs/vike/issues/1108
        `vike@${pc.bold(versions[0])} and vike@${pc.bold(versions[1])} loaded but only one version should be loaded`);
    }
    if (globalObject$5.checkSingleInstance && globalObject$5.instances.length > 1) {
        /*/ Not sure whether circular dependency can cause problems? In principle not since client-side code is ESM.
        console.warn(clientNotSingleInstance)
        /*/
        assertWarning$1(false, clientNotSingleInstance, { onlyOnce: true, showStackTrace: true });
        //*/
    }
}
function assertSingleInstance_onClientEntryServerRouting(isProduction) {
    assertWarning$1(globalObject$5.isClientRouting !== true, clientRuntimesClonflict, {
        onlyOnce: true,
        showStackTrace: true
    });
    assertWarning$1(globalObject$5.isClientRouting === undefined, clientNotSingleInstance, {
        onlyOnce: true,
        showStackTrace: true
    });
    globalObject$5.isClientRouting = false;
    globalObject$5.checkSingleInstance = true;
    assertSingleInstance();
}
// Called by utils/assert.ts which is (most certainly) loaded by all entries. That way we don't have to call a callback for every entry. (There are a lot of entries: `client/router/`, `client/`, `node/runtime/`, `node/plugin/`, `node/cli`.)
function assertSingleInstance_onAssertModuleLoad() {
    globalObject$5.instances.push(projectInfo.projectVersion);
    assertSingleInstance();
}
function assertUsage$1(condition, errorMessage) {
    if (condition) {
        return;
    }
    const errMsg = `[vike][Wrong Usage] ${errorMessage}`;
    throw new Error(errMsg);
}
function assertWarning$1(condition, errorMessage, { onlyOnce, showStackTrace }) {
    if (condition) {
        return;
    }
    const msg = `[vike][Warning] ${errorMessage}`;
    if (onlyOnce) {
        const { alreadyLogged } = globalObject$5;
        const key = onlyOnce === true ? msg : onlyOnce;
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

function isObject(value) {
    return typeof value === 'object' && value !== null;
}

const globalObject$4 = getGlobalObject('utils/assert.ts', {
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
    showStackTraceList: new WeakSet()
});
assertSingleInstance_onAssertModuleLoad();
const projectTag = `[vike]`;
const projectTagWithVersion = `[vike@${projectInfo.projectVersion}]`;
const numberOfStackTraceLinesToRemove = 2;
function assert(condition, debugInfo) {
    if (condition)
        return;
    const debugStr = (() => {
        if (!debugInfo) {
            return null;
        }
        const debugInfoSerialized = typeof debugInfo === 'string' ? debugInfo : JSON.stringify(debugInfo);
        return pc.dim(`Debug info (for Vike maintainers; you can ignore this): ${debugInfoSerialized}`);
    })();
    const link = pc.blue('https://github.com/vikejs/vike/issues/new');
    let errMsg = [
        `You stumbled upon a Vike bug. Go to ${link} and copy-paste this error. A maintainer will fix the bug (usually under 24 hours).`,
        debugStr
    ]
        .filter(Boolean)
        .join(' ');
    errMsg = addWhitespace(errMsg);
    errMsg = addPrefixAssertType(errMsg, 'Bug');
    errMsg = addPrefixProjctName(errMsg, true);
    const internalError = createErrorWithCleanStackTrace(errMsg, numberOfStackTraceLinesToRemove);
    globalObject$4.onBeforeLog?.();
    throw internalError;
}
function assertUsage(condition, errMsg, { showStackTrace } = {}) {
    if (condition)
        return;
    showStackTrace = showStackTrace || globalObject$4.alwaysShowStackTrace;
    errMsg = addWhitespace(errMsg);
    errMsg = addPrefixAssertType(errMsg, 'Wrong Usage');
    errMsg = addPrefixProjctName(errMsg);
    const usageError = createErrorWithCleanStackTrace(errMsg, numberOfStackTraceLinesToRemove);
    if (showStackTrace) {
        globalObject$4.showStackTraceList.add(usageError);
    }
    globalObject$4.onBeforeLog?.();
    throw usageError;
}
function getProjectError(errMsg) {
    errMsg = addWhitespace(errMsg);
    errMsg = addPrefixAssertType(errMsg, 'Error');
    errMsg = addPrefixProjctName(errMsg);
    const projectError = createErrorWithCleanStackTrace(errMsg, numberOfStackTraceLinesToRemove);
    return projectError;
}
function assertWarning(condition, msg, { onlyOnce, showStackTrace }) {
    if (condition)
        return;
    showStackTrace = showStackTrace || globalObject$4.alwaysShowStackTrace;
    msg = addWhitespace(msg);
    msg = addPrefixAssertType(msg, 'Warning');
    msg = addPrefixProjctName(msg);
    if (onlyOnce) {
        const { alreadyLogged } = globalObject$4;
        const key = onlyOnce === true ? msg : onlyOnce;
        if (alreadyLogged.has(key)) {
            return;
        }
        else {
            alreadyLogged.add(key);
        }
    }
    globalObject$4.onBeforeLog?.();
    if (showStackTrace) {
        const err = createErrorWithCleanStackTrace(msg, numberOfStackTraceLinesToRemove);
        globalObject$4.showStackTraceList.add(err);
        globalObject$4.logger(err, 'warn');
    }
    else {
        globalObject$4.logger(msg, 'warn');
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
function addPrefixProjctName(msg, showProjectVersion = false) {
    const prefix = showProjectVersion ? projectTagWithVersion : projectTag;
    return `${prefix}${msg}`;
}

function isBrowser() {
    // Using `typeof window !== 'undefined'` alone is not enough because some users use https://www.npmjs.com/package/ssr-window
    return typeof window !== 'undefined' && typeof window.scrollY === 'number';
    // Alternatively, test whether environment is a *real* browser: https://github.com/brillout/picocolors/blob/d59a33a0fd52a8a33e4158884069192a89ce0113/picocolors.js#L87-L89
}

const state = getGlobalObject('utils/assertRouterType.ts', {});
function assertServerRouting() {
    assertNoContradiction(state.isClientRouting !== true);
    state.isClientRouting = false;
}
function assertNoContradiction(noContradiction) {
    // If an assertion fails because of a wrong usage, then we assume that the user is trying to import from 'vike/client/router' while not setting `clientRouting` to `true`. Note that 'vike/client' only exports the type `PageContextBuiltInClient` and that the package.json#exports entry 'vike/client' will eventually be removed.
    assertUsage(isBrowser(), `${pc.cyan("import { something } from 'vike/client/router'")} is forbidden on the server-side`, { showStackTrace: true });
    assertWarning(noContradiction, "You shouldn't `import { something } from 'vike/client/router'` when using Server Routing. The 'vike/client/router' utilities work only with Client Routing. In particular, don't `import { navigate }` nor `import { prefetch }` as they unnecessarily bloat your client-side bundle sizes.", { showStackTrace: true, onlyOnce: true });
}

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
    let start = from ;
    assert(start >= 0 && start <= list.length);
    let end = list.length + to;
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

// We don't use new URL() as it doesn't exactly do what we need, for example:
//  - It loses the original URL parts (which we need to manipulate and recreate URLs)
//  - It doesn't support the tauri:// protocol
// Unit tests at ./parseUrl.spec.ts
function isParsable(url) {
    // `parseUrl()` works with these URLs
    return (isUrlWithProtocol(url) ||
        url.startsWith('/') ||
        url.startsWith('.') ||
        url.startsWith('?') ||
        url.startsWith('#') ||
        url === '');
}
function parseUrl(url, baseServer) {
    assert(isParsable(url));
    assert(baseServer.startsWith('/'));
    // Hash
    const [urlWithoutHash, ...hashList] = url.split('#');
    assert(urlWithoutHash !== undefined);
    const hashOriginal = ['', ...hashList].join('#') || null;
    assert(hashOriginal === null || hashOriginal.startsWith('#'));
    const hash = hashOriginal === null ? '' : decodeSafe(hashOriginal.slice(1));
    // Search
    const [urlWithoutHashNorSearch, ...searchList] = urlWithoutHash.split('?');
    assert(urlWithoutHashNorSearch !== undefined);
    const searchOriginal = ['', ...searchList].join('?') || null;
    assert(searchOriginal === null || searchOriginal.startsWith('?'));
    const search = {};
    const searchAll = {};
    Array.from(new URLSearchParams(searchOriginal || '')).forEach(([key, val]) => {
        search[key] = val;
        searchAll[key] = [...(searchAll.hasOwnProperty(key) ? searchAll[key] : []), val];
    });
    // Origin + pathname
    const { origin, pathname: pathnameResolved } = getPathname(urlWithoutHashNorSearch, baseServer);
    assert(origin === null || origin === decodeSafe(origin)); // AFAICT decoding the origin is useless
    assert(pathnameResolved.startsWith('/'));
    assert(origin === null || url.startsWith(origin));
    // `pathnameOriginal`
    const pathnameOriginal = urlWithoutHashNorSearch.slice((origin || '').length);
    assertUrlComponents(url, origin, pathnameOriginal, searchOriginal, hashOriginal);
    // Base URL
    let { pathname, hasBaseServer } = analyzeBaseServer(pathnameResolved, baseServer);
    pathname = decodePathname(pathname);
    assert(pathname.startsWith('/'));
    return {
        origin,
        pathname,
        pathnameOriginal: pathnameOriginal,
        hasBaseServer,
        search,
        searchAll,
        searchOriginal,
        hash,
        hashOriginal
    };
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
function getPathname(url, baseServer) {
    // Search and hash already extracted
    assert(!url.includes('?') && !url.includes('#'));
    // url has origin
    {
        const { origin, pathname } = parseOrigin(url);
        if (origin) {
            return { origin, pathname };
        }
        assert(pathname === url);
    }
    // url doesn't have origin
    if (url.startsWith('/')) {
        return { origin: null, pathname: url };
    }
    else {
        // url is a relative path
        // In the browser, this is the Base URL of the current URL.
        // Safe access `window?.document?.baseURI` for users who shim `window` in Node.js
        const baseURI = typeof window !== 'undefined' ? window?.document?.baseURI : undefined;
        let base;
        if (baseURI) {
            const baseURIPathaname = parseOrigin(baseURI.split('?')[0]).pathname;
            base = baseURIPathaname;
        }
        else {
            base = baseServer;
        }
        const pathname = resolveUrlPathnameRelative(url, base);
        return { origin: null, pathname };
    }
}
function parseOrigin(url) {
    if (!isUrlWithProtocol(url)) {
        assert(!isUriWithProtocol(url));
        return { pathname: url, origin: null };
    }
    else {
        const [originPart1, originPart2, originPart3, ...pathnameParts] = url.split('/');
        const origin = [originPart1, originPart2, originPart3].join('/');
        const pathname = ['', ...pathnameParts].join('/') || '/';
        return { origin, pathname };
    }
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
/* Not needed anymore?
function assertUsageBaseServer(baseServer: string, usageErrorMessagePrefix: string = '') {
  assertUsage(
    !baseServer.startsWith('http'),
    usageErrorMessagePrefix +
      '`base` is not allowed to start with `http`. Consider using `baseAssets` instead, see https://vike.dev/base-url'
  )
  assertUsage(
    baseServer.startsWith('/'),
    usageErrorMessagePrefix + 'Wrong `base` value `' + baseServer + '`; `base` should start with `/`.'
  )
  assert(isBaseServer(baseServer))
}
*/
function assertPathname(urlPathname) {
    assert(urlPathname.startsWith('/'));
    assert(!urlPathname.includes('?'));
    assert(!urlPathname.includes('#'));
}
function analyzeBaseServer(urlPathnameWithBase, baseServer) {
    assertPathname(urlPathnameWithBase);
    assert(isBaseServer(baseServer));
    // Mutable
    let urlPathname = urlPathnameWithBase;
    assert(urlPathname.startsWith('/'));
    assert(baseServer.startsWith('/'));
    {
        const pathname = urlPathnameWithBase;
        return { pathname, hasBaseServer: true };
    }
}
function isBaseServer(baseServer) {
    return baseServer.startsWith('/');
}
function assertUrlComponents(url, origin, pathname, searchOriginal, hashOriginal) {
    const urlRecreated = createUrlFromComponents(origin, pathname, searchOriginal, hashOriginal);
    assert(url === urlRecreated);
}
function createUrlFromComponents(origin, pathname, searchOriginal, hashOriginal) {
    const urlRecreated = `${origin || ''}${pathname}${searchOriginal || ''}${hashOriginal || ''}`;
    return urlRecreated;
}
function isUriWithProtocol(str) {
    // https://en.wikipedia.org/wiki/List_of_URI_schemes
    // https://www.rfc-editor.org/rfc/rfc7595
    // https://github.com/vikejs/vike/commit/886a99ff21e86a8ca699a25cee7edc184aa058e4#r143308934
    // Examples:
    //   http://
    //   https://
    //   tauri:// # [Tauri](https://tauri.app)
    //   file:// # [Electron](https://github.com/vikejs/vike/issues/1557)
    //   capacitor:// # [Capacitor](https://github.com/vikejs/vike/issues/1706)
    return /^[a-z][a-z0-9\+\-]*:/i.test(str);
}
// Same as isUriWithProtocol() but with trailing :// which is needed for parseOrigin()
function isUrlWithProtocol(str) {
    return /^[a-z][a-z0-9\+\-]*:\/\//i.test(str);
}

// Same as Object.assign() but:
//  - With type inference
//  - Preserves property descriptors, which we need for preserving the getters added by getPageContextUrlComputed()
function objectAssign(obj, objAddendum) {
    if (objAddendum) {
        assert(!('_isPageContextObject' in objAddendum));
        Object.defineProperties(obj, Object.getOwnPropertyDescriptors(objAddendum));
    }
}

function isCallable(thing) {
    return thing instanceof Function || typeof thing === 'function';
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

// Typesafe Array.isArray() — asserting unknown[] instead of any[]
function isArray(value) {
    return Array.isArray(value);
}

function isArrayOfStrings(val) {
    return isArray(val) && val.every((v) => typeof v === 'string');
}

function isObjectOfStrings(val) {
    return isObject(val) && Object.values(val).every((v) => typeof v === 'string');
}

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

function compareString(str1, str2) {
    if (str1.toLowerCase() < str2.toLowerCase())
        return -1;
    if (str1.toLowerCase() > str2.toLowerCase())
        return 1;
    return 0;
}

const isNotNullish = (p) => p !== null && p !== undefined;

function assertPosixPath(path) {
    const errMsg = (msg) => `Not a posix path: ${msg}`;
    assert(path !== null, errMsg('null'));
    assert(typeof path === 'string', errMsg(`typeof path === ${JSON.stringify(typeof path)}`));
    assert(path !== '', errMsg('(empty string)'));
    assert(path);
    assert(!path.includes('\\'), errMsg(path));
}

// TODO/v1-release: remove this
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

// TODO/v1-release: remove
function determinePageIdOld(filePath) {
    const pageSuffix = '.page.';
    const pageId = slice(filePath.split(pageSuffix), 0, -1).join(pageSuffix);
    assert(!pageId.includes('\\'));
    return pageId;
}

// TODO/v1-release: remove
function assertPageFilePath(filePath) {
    assertPosixPath(filePath);
    /* This assert() is skipped to reduce client-side bundle size
    assert(filePath.startsWith('/') || isNpmPackageImport(filePath), { filePath })
    */
}

// TODO/v1-release: remove
function isErrorPageId(pageId, _isV1Design) {
    assert(!pageId.includes('\\'));
    return pageId.includes('/_error');
}
function isErrorPage(pageId, pageConfigs) {
    if (pageConfigs.length > 0) {
        const pageConfig = pageConfigs.find((p) => p.pageId === pageId);
        assert(pageConfig);
        return !!pageConfig.isErrorPage;
    }
    else {
        return isErrorPageId(pageId);
    }
}

// We can't use a RegExp:
//  - Needs to work with Micromatch: https://github.com/micromatch/micromatch because:
//    - Vite's `import.meta.glob()` uses Micromatch
//  - We need this to be a whitelist because:
//   - A pattern `*([a-zA-Z0-9]` doesn't work.
//     - Because of ReScript: `.res` are ReScript source files which need to be ignored. (The ReScript compiler generates `.js` files alongside `.res` files.)
//   - Black listing doesn't work.
//     - We cannot implement a blacklist with a glob pattern.
//     - A post `import.meta.glob()` blacklist filtering doesn't work because Vite would still process the files (e.g. including them in the bundle).
// prettier-ignore
// biome-ignore format:
const extJavaScript = [
    'js',
    'ts',
    'cjs',
    'cts',
    'mjs',
    'mts',
];
// prettier-ignore
// biome-ignore format:
const extJsx = [
    'jsx',
    'tsx',
    'cjsx',
    'ctsx',
    'mjsx',
    'mtsx',
];
// prettier-ignore
// biome-ignore format:
const extTemplates = [
    'vue',
    'svelte',
    'marko',
    'md',
    'mdx'
];
const scriptFileExtensionList = [...extJavaScript, ...extJsx, ...extTemplates];
function isScriptFile(filePath) {
    const yes = scriptFileExtensionList.some((ext) => filePath.endsWith('.' + ext));
    if (isJavaScriptFile(filePath))
        assert(yes);
    return yes;
}
function isJavaScriptFile(filePath) {
    const yes1 = /\.(c|m)?(j|t)s$/.test(filePath);
    const yes2 = extJavaScript.some((ext) => filePath.endsWith('.' + ext));
    assert(yes1 === yes2);
    return yes1;
}
function isTemplateFile(filePath) {
    return extTemplates.some((ext) => filePath.endsWith('.' + ext));
}

// TODO/v1-release: remove
const fileTypes = [
    '.page',
    '.page.server',
    '.page.route',
    '.page.client',
    // New type `.page.css`/`.page.server.css`/`.page.client.css` for `extensions[number].pageFileDist`.
    //  - Extensions using `pageFileDist` are expected to use a bundler that generates a `.css` colocated next to the original `.page.js` file (e.g. `/renderer/_default.page.server.css` for `/renderer/_default.page.server.js`.
    //  - Since these `.page.css` files Bundlers We can therefore expect that there isn't any `.page.server.sass`/...
    '.css'
];
function determineFileType(filePath) {
    assertPosixPath(filePath);
    {
        const isCSS = filePath.endsWith('.css');
        if (isCSS) {
            /* This assert() is skipped to reduce client-side bundle size
            assert(isNpmPackageImport(filePath), filePath) // `.css` page files are only supported for npm packages
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

// TODO/v1-release: remove
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
        pageId: determinePageIdOld(filePath)
    };
    return pageFile;
}
function isDefaultFilePath(filePath) {
    assertPageFilePath(filePath);
    if (isErrorPageId(filePath)) {
        return false;
    }
    return filePath.includes('/_default');
}
function isRendererFilePath(filePath) {
    assertPageFilePath(filePath);
    return filePath.includes('/renderer/');
}
function isAncestorDefaultPage(pageId, defaultPageFilePath) {
    assertPageFilePath(pageId);
    assertPageFilePath(defaultPageFilePath);
    assert(!pageId.endsWith('/'));
    assert(!defaultPageFilePath.endsWith('/'));
    assert(isDefaultFilePath(defaultPageFilePath));
    const defaultPageDir = slice(defaultPageFilePath.split('/'), 0, -1)
        .filter((filePathSegment) => filePathSegment !== '_default')
        .join('/');
    return pageId.startsWith(defaultPageDir);
}

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
        .map((source) => {
        const { filePathToShowToUser, fileExportPathToShowToUser } = source;
        let s = filePathToShowToUser;
        const exportPath = getExportPath(fileExportPathToShowToUser, configName);
        if (exportPath) {
            s = `${s} > ${pc.cyan(exportPath)}`;
        }
        return s;
    })
        .join(' / ');
    return definedAtString;
}

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
        deserialize: (str, deserializer) => new Map(deserializer(str.slice('!Map:'.length))),
    }),
    ts({
        is: (val) => val instanceof Set,
        match: (str) => str.startsWith('!Set:'),
        serialize: (val, serializer) => '!Set:' + serializer(Array.from(val.values())),
        deserialize: (str, deserializer) => new Set(deserializer(str.slice('!Set:'.length))),
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

function parse(str) {
    // We don't use the reviver option in `JSON.parse(str, reviver)` because it doesn't support `undefined` values
    const value = JSON.parse(str);
    return parseTransform(value);
}
function parseTransform(value) {
    if (typeof value === 'string') {
        return reviver(value);
    }
    if (
    // Also matches arrays
    typeof value === 'object' &&
        value !== null) {
        Object.entries(value).forEach(([key, val]) => {
            value[key] = parseTransform(val);
        });
    }
    return value;
}
function reviver(value) {
    for (const { match, deserialize } of types) {
        if (match(value)) {
            return deserialize(value, parse);
        }
    }
    return value;
}

const EXPORTS_IGNORE = [
    // vite-plugin-solid adds `export { $$registrations }`
    '$$registrations',
    // @vitejs/plugin-vue adds `export { _rerender_only }`
    '_rerender_only'
];
// Tolerate `export { frontmatter }` in .mdx files
const TOLERATE_SIDE_EXPORTS = ['.md', '.mdx'];
function assertPlusFileExport(fileExports, filePathToShowToUser, configName) {
    const exportNames = Object.keys(fileExports).filter((exportName) => !EXPORTS_IGNORE.includes(exportName));
    const isValid = (exportName) => exportName === 'default' || exportName === configName;
    const exportNamesValid = exportNames.filter(isValid);
    const exportNamesInvalid = exportNames.filter((e) => !isValid(e));
    if (exportNamesValid.length === 1 && exportNamesInvalid.length === 0) {
        return;
    }
    const exportDefault = pc.code('export default');
    const exportNamed = pc.code(`export { ${configName} }`);
    if (exportNamesValid.length === 0) {
        assertUsage(false, `${filePathToShowToUser} should have a ${exportNamed} or ${exportDefault}`);
    }
    if (exportNamesValid.length === 2) {
        assertWarning(false, `${filePathToShowToUser} is ambiguous: remove ${exportDefault} or ${exportNamed}`, {
            onlyOnce: true
        });
    }
    assert(exportNamesValid.length === 1);
    assert(exportNamesInvalid.length > 0);
    if (!TOLERATE_SIDE_EXPORTS.some((ext) => filePathToShowToUser.endsWith(ext))) {
        exportNamesInvalid.forEach((exportInvalid) => {
            assertWarning(false, `${filePathToShowToUser} unexpected ${pc.cyan(`export { ${exportInvalid} }`)}`, {
                onlyOnce: true
            });
        });
    }
}

function parseConfigValuesSerialized(configValuesSerialized) {
    const configValues = parseConfigValuesSerialized_tmp(configValuesSerialized);
    return configValues;
}
function parsePageConfigs(pageConfigsSerialized, pageConfigGlobalSerialized) {
    // pageConfigs
    const pageConfigs = pageConfigsSerialized.map((pageConfigSerialized) => {
        const configValues = parseConfigValuesSerialized(pageConfigSerialized.configValuesSerialized);
        const { pageId, isErrorPage, routeFilesystem, loadConfigValuesAll } = pageConfigSerialized;
        assertRouteConfigValue(configValues);
        return {
            pageId,
            isErrorPage,
            routeFilesystem,
            configValues,
            loadConfigValuesAll
        };
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
function parseConfigValuesSerialized_tmp(configValuesSerialized) {
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
                return configValueSeriliazed.definedAtData;
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
        assertPlusFileExport(exportValues, definedAtFile.filePathToShowToUser, configName);
        let value;
        let valueWasFound = false;
        const sideExports = [];
        Object.entries(exportValues).forEach(([exportName, exportValue]) => {
            const isSideExport = exportName !== 'default' && exportName !== configName;
            if (!isSideExport) {
                value = exportValue;
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
                            fileExportPathToShowToUser: [exportName]
                        }
                    }
                });
            }
        });
        // Already validated by assertPlusFileExport() call above.
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

function parseGlobResults(pageFilesExports) {
    assert(hasProp(pageFilesExports, 'pageFilesLazy', 'object'));
    assert(hasProp(pageFilesExports, 'pageFilesEager', 'object'));
    assert(hasProp(pageFilesExports, 'pageFilesExportNamesLazy', 'object'));
    assert(hasProp(pageFilesExports, 'pageFilesExportNamesEager', 'object'));
    assert(hasProp(pageFilesExports.pageFilesLazy, '.page'));
    assert(hasProp(pageFilesExports.pageFilesLazy, '.page.client') || hasProp(pageFilesExports.pageFilesLazy, '.page.server'));
    assert(hasProp(pageFilesExports, 'pageFilesList', 'string[]'));
    assert(hasProp(pageFilesExports, 'pageConfigsSerialized'));
    assert(hasProp(pageFilesExports, 'pageConfigGlobalSerialized'));
    const { pageConfigsSerialized, pageConfigGlobalSerialized } = pageFilesExports;
    assertPageConfigsSerialized(pageConfigsSerialized);
    assertPageConfigGlobalSerialized(pageConfigGlobalSerialized);
    const { pageConfigs, pageConfigGlobal } = parsePageConfigs(pageConfigsSerialized, pageConfigGlobalSerialized);
    const pageFilesMap = {};
    parseGlobResult(pageFilesExports.pageFilesLazy).forEach(({ filePath, pageFile, globValue }) => {
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
    parseGlobResult(pageFilesExports.pageFilesExportNamesLazy).forEach(({ filePath, pageFile, globValue }) => {
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
    parseGlobResult(pageFilesExports.pageFilesEager).forEach(({ filePath, pageFile, globValue }) => {
        pageFile = pageFilesMap[filePath] = pageFilesMap[filePath] ?? pageFile;
        const moduleExports = globValue;
        assert(isObject(moduleExports));
        pageFile.fileExports = moduleExports;
    });
    parseGlobResult(pageFilesExports.pageFilesExportNamesEager).forEach(({ filePath, pageFile, globValue }) => {
        pageFile = pageFilesMap[filePath] = pageFilesMap[filePath] ?? pageFile;
        const moduleExports = globValue;
        assert(isObject(moduleExports));
        assert(hasProp(moduleExports, 'exportNames', 'string[]'), pageFile.filePath);
        pageFile.exportNames = moduleExports.exportNames;
    });
    pageFilesExports.pageFilesList.forEach((filePath) => {
        pageFilesMap[filePath] = pageFilesMap[filePath] ?? getPageFileObject(filePath);
    });
    const pageFiles = Object.values(pageFilesMap);
    pageFiles.forEach(({ filePath }) => {
        assert(!filePath.includes('\\'));
    });
    return { pageFiles, pageConfigs, pageConfigGlobal };
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

const globalObject$3 = getGlobalObject('setPageFiles.ts', {});
// TODO:v1-design-release: rename setPageFiles() getPageFilesAll() parseGlobResult()
function setPageFiles(pageFilesExports) {
    const { pageFiles, pageConfigs, pageConfigGlobal } = parseGlobResults(pageFilesExports);
    globalObject$3.pageFilesAll = pageFiles;
    globalObject$3.pageConfigs = pageConfigs;
    globalObject$3.pageConfigGlobal = pageConfigGlobal;
}
async function getPageFilesAll(isClientSide, isProduction) {
    {
        assert(!globalObject$3.pageFilesGetter);
        assert(isProduction === undefined);
    }
    const { pageFilesAll, pageConfigs, pageConfigGlobal } = globalObject$3;
    assert(pageFilesAll && pageConfigs && pageConfigGlobal);
    const allPageIds = getAllPageIds(pageFilesAll, pageConfigs);
    return { pageFilesAll, allPageIds, pageConfigs, pageConfigGlobal };
}
function getAllPageIds(allPageFiles, pageConfigs) {
    const fileIds = allPageFiles.filter(({ isDefaultPageFile }) => !isDefaultPageFile).map(({ pageId }) => pageId);
    const allPageIds = unique(fileIds);
    const allPageIds2 = pageConfigs.map((p) => p.pageId);
    return [...allPageIds, ...allPageIds2];
}

// TODO:v1-release: remove this file
function getPageFilesClientSide(pageFilesAll, pageId) {
    return determine(pageFilesAll, pageId, true);
}
function determine(pageFilesAll, pageId, envIsClient) {
    const env = 'CLIENT_ONLY' ;
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
    // A page can load multiple `_defaut.page.*` files of the same `fileType`. In other words: non-renderer `_default.page.*` files are cumulative.
    // The exception being HTML-only pages because we pick a single page file as client entry. We handle that use case at `renderPage()`.
    const defaultFilesNonRenderer = pageFilesRelevant.filter((p) => p.isDefaultPageFile && !p.isRendererPageFile && (p.isEnv(env) || p.isEnv('CLIENT_AND_SERVER')));
    // Ordered by `pageContext.exports` precendence
    const pageFiles = [pageIdFileEnv, pageIdFileIso, ...defaultFilesNonRenderer, rendererFileEnv, rendererFileIso].filter(isNotNullish);
    return pageFiles;
}
function getPageFilesSorter(envIsClient, pageId) {
    const env = 'CLIENT_ONLY' ;
    const e1First = -1;
    const e2First = +1;
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
    assertPageFilePath(pathA);
    assertPageFilePath(pathB);
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

function getConfigValueFilePathToShowToUser(definedAtData) {
    // A unique file path only exists if the config value isn't cumulative nor computed:
    //  - cumulative config values have multiple file paths
    //  - computed values don't have any file path
    if (!definedAtData || isArray(definedAtData))
        return null;
    const { filePathToShowToUser } = definedAtData;
    assert(filePathToShowToUser);
    return filePathToShowToUser;
}

function getPageContextExports(pageFiles, pageConfig) {
    const configEntries = {};
    const config = {};
    const exportsAll = {};
    // V0.4 design
    // TODO/v1-release: remove
    pageFiles.forEach((pageFile) => {
        const exportValues = getExportValues(pageFile);
        exportValues.forEach(({ exportName, exportValue, isFromDefaultExport }) => {
            assert(exportName !== 'default');
            exportsAll[exportName] = exportsAll[exportName] ?? [];
            exportsAll[exportName].push({
                exportValue,
                exportSource: `${pageFile.filePath} > ${isFromDefaultExport ? `\`export default { ${exportName} }\`` : `\`export { ${exportName} }\``}`,
                filePath: pageFile.filePath,
                _filePath: pageFile.filePath, // TODO/next-major-release: remove
                _fileType: pageFile.fileType,
                _isFromDefaultExport: isFromDefaultExport
            });
        });
    });
    // V1 design
    const source = {};
    const sources = {};
    const addSrc = (src, configName) => {
        source[configName] = src;
        sources[configName] ?? (sources[configName] = []);
        sources[configName].push(src);
    };
    const from = {
        configsStandard: {},
        configsCumulative: {},
        configsComputed: {}
    };
    if (pageConfig) {
        Object.entries(pageConfig.configValues).forEach(([configName, configValue]) => {
            const { value } = configValue;
            const configValueFilePathToShowToUser = getConfigValueFilePathToShowToUser(configValue.definedAtData);
            const configDefinedAt = getConfigDefinedAtOptional('Config', configName, configValue.definedAtData);
            config[configName] = config[configName] ?? value;
            configEntries[configName] = configEntries[configName] ?? [];
            // Currently each configName has only one entry. Adding an entry for each overriden config value isn't implemented yet. (This is an isomorphic file and it isn't clear whether this can/should be implemented on the client-side. We should load a minimum amount of code on the client-side.)
            assert(configEntries[configName].length === 0);
            configEntries[configName].push({
                configValue: value,
                configDefinedAt,
                configDefinedByFile: configValueFilePathToShowToUser
            });
            if (configValue.type === 'standard') {
                const src = {
                    type: 'configsStandard',
                    value: configValue.value,
                    definedAt: getDefinedAtString(configValue.definedAtData, configName)
                };
                addSrc(src, configName);
                from.configsStandard[configName] = src;
            }
            if (configValue.type === 'cumulative') {
                const src = {
                    type: 'configsCumulative',
                    values: configValue.value.map((value, i) => {
                        const definedAtFile = configValue.definedAtData[i];
                        assert(definedAtFile);
                        const definedAt = getDefinedAtString(definedAtFile, configName);
                        return {
                            value,
                            definedAt
                        };
                    })
                };
                addSrc(src, configName);
                from.configsCumulative[configName] = src;
            }
            if (configValue.type === 'computed') {
                const src = {
                    type: 'configsComputed',
                    value: configValue.value
                };
                addSrc(src, configName);
                from.configsComputed[configName] = src;
            }
            // TODO/v1-release: remove
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
        });
    }
    const pageExports = createObjectWithDeprecationWarning();
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
    const pageContextExports = {
        from,
        source,
        sources,
        // TODO/eventually: deprecate/remove every prop below
        config,
        configEntries,
        exports,
        exportsAll,
        pageExports
    };
    return pageContextExports;
}
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
                        isFromDefaultExport
                    });
                });
                return;
            }
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
// TODO/v1-release: remove
function createObjectWithDeprecationWarning() {
    return new Proxy({}, {
        get(...args) {
            // We only show the warning in Node.js because when using Client Routing Vue integration uses `Object.assign(pageContextReactive, pageContext)` which will wrongully trigger the warning. There is no cross-browser way to catch whether the property accessor was initiated by an `Object.assign()` call.
            if (!isBrowser()) {
                assertWarning(false, '`pageContext.pageExports` is outdated. Use `pageContext.exports` instead, see https://vike.dev/exports', { onlyOnce: true, showStackTrace: true });
            }
            return Reflect.get(...args);
        }
    });
}

const pageFilesLazy = {};
const pageFilesEager = {};
const pageFilesExportNamesLazy = {};
const pageFilesExportNamesEager = {};
const pageFilesList = [];
const neverLoaded = {};

const pageConfigsSerialized = [
  {
    pageId: "/pages/_error",
    isErrorPage: true,
    routeFilesystem: undefined,
    loadConfigValuesAll: () => __vitePreload(() => import('./pages_error.BG2u-iYF.js'),true?__vite__mapDeps([0,1,2]):void 0),
    configValuesSerialized: {
      ["clientEntryLoaded"]: {
        type: "computed",
        definedAtData: null,
        valueSerialized: {
          type: "js-serialized",
          value: true,
        },
      },
      ["clientRouting"]: {
        type: "standard",
        definedAtData: {"filePathToShowToUser":"/renderer/+config.ts","fileExportPathToShowToUser":["default","clientRouting"]},
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
    routeFilesystem: {"routeString":"/blog","definedBy":"/pages/blog/index/"},
    loadConfigValuesAll: () => __vitePreload(() => import('./pages_blog_index.Bn_QtP8n.js'),true?__vite__mapDeps([3,1,2,4,5]):void 0),
    configValuesSerialized: {
      ["clientEntryLoaded"]: {
        type: "computed",
        definedAtData: null,
        valueSerialized: {
          type: "js-serialized",
          value: true,
        },
      },
      ["clientRouting"]: {
        type: "standard",
        definedAtData: {"filePathToShowToUser":"/renderer/+config.ts","fileExportPathToShowToUser":["default","clientRouting"]},
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
    routeFilesystem: {"routeString":"/blog/view","definedBy":"/pages/blog/view/"},
    loadConfigValuesAll: () => __vitePreload(() => import('./pages_blog_view.-C0kqZO3.js'),true?__vite__mapDeps([6,1,2,7,8]):void 0),
    configValuesSerialized: {
      ["clientEntryLoaded"]: {
        type: "computed",
        definedAtData: null,
        valueSerialized: {
          type: "js-serialized",
          value: true,
        },
      },
      ["clientRouting"]: {
        type: "standard",
        definedAtData: {"filePathToShowToUser":"/renderer/+config.ts","fileExportPathToShowToUser":["default","clientRouting"]},
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
    routeFilesystem: {"routeString":"/","definedBy":"/pages/index/"},
    loadConfigValuesAll: () => __vitePreload(() => import('./pages_index.FeIhZ4Ig.js'),true?__vite__mapDeps([9,1,2]):void 0),
    configValuesSerialized: {
      ["clientEntryLoaded"]: {
        type: "computed",
        definedAtData: null,
        valueSerialized: {
          type: "js-serialized",
          value: true,
        },
      },
      ["clientRouting"]: {
        type: "standard",
        definedAtData: {"filePathToShowToUser":"/renderer/+config.ts","fileExportPathToShowToUser":["default","clientRouting"]},
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
    routeFilesystem: {"routeString":"/presentations","definedBy":"/pages/presentations/index/"},
    loadConfigValuesAll: () => __vitePreload(() => import('./pages_presentations_index.DGRWxHYD.js'),true?__vite__mapDeps([10,1,2,11,12,7,4,13]):void 0),
    configValuesSerialized: {
      ["clientEntryLoaded"]: {
        type: "computed",
        definedAtData: null,
        valueSerialized: {
          type: "js-serialized",
          value: true,
        },
      },
      ["clientRouting"]: {
        type: "standard",
        definedAtData: {"filePathToShowToUser":"/renderer/+config.ts","fileExportPathToShowToUser":["default","clientRouting"]},
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
    routeFilesystem: {"routeString":"/presentations/view","definedBy":"/pages/presentations/view/"},
    loadConfigValuesAll: () => __vitePreload(() => import('./pages_presentations_view.DEVnx1jt.js'),true?__vite__mapDeps([14,1,2,15,11,12]):void 0),
    configValuesSerialized: {
      ["clientEntryLoaded"]: {
        type: "computed",
        definedAtData: null,
        valueSerialized: {
          type: "js-serialized",
          value: true,
        },
      },
      ["clientRouting"]: {
        type: "standard",
        definedAtData: {"filePathToShowToUser":"/renderer/+config.ts","fileExportPathToShowToUser":["default","clientRouting"]},
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
    routeFilesystem: {"routeString":"/projects","definedBy":"/pages/projects/"},
    loadConfigValuesAll: () => __vitePreload(() => import('./pages_projects.7dItuqHz.js'),true?__vite__mapDeps([16,1,2,7,4,17]):void 0),
    configValuesSerialized: {
      ["clientEntryLoaded"]: {
        type: "computed",
        definedAtData: null,
        valueSerialized: {
          type: "js-serialized",
          value: true,
        },
      },
      ["clientRouting"]: {
        type: "standard",
        definedAtData: {"filePathToShowToUser":"/renderer/+config.ts","fileExportPathToShowToUser":["default","clientRouting"]},
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

const pageFilesExports = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
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

setPageFiles(pageFilesExports);

function assertIsBrowser() {
    assert(isBrowser());
}

function onLoad() {
    assertIsBrowser();
}

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

const globalObject$2 = getGlobalObject('utils/executeHook.ts', {
    userHookErrors: new WeakMap(),
    pageContext: null
});
function executeHook(hookFnCaller, hook, pageContext) {
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
            providePageContext(pageContext);
            const ret = await hookFnCaller();
            resolve(ret);
        }
        catch (err) {
            if (isObject(err)) {
                globalObject$2.userHookErrors.set(err, { hookName, hookFilePath });
            }
            reject(err);
        }
    })();
    return promise;
}
function isNotDisabled(timeout) {
    return !!timeout && timeout !== Infinity;
}
function providePageContext(pageContext) {
    globalObject$2.pageContext = pageContext;
    // Promise.resolve() is quicker than process.nextTick() and setImmediate()
    // https://stackoverflow.com/questions/67949576/process-nexttick-before-promise-resolve-then
    Promise.resolve().then(() => {
        globalObject$2.pageContext = null;
    });
}

function getCurrentUrl(options) {
    const url = window.location.href;
    const { searchOriginal, hashOriginal, pathname } = parseUrl(url, '/');
    let urlCurrent;
    if (options?.withoutHash) {
        urlCurrent = `${pathname}${searchOriginal || ''}`;
    }
    else {
        urlCurrent = `${pathname}${searchOriginal || ''}${hashOriginal || ''}`;
    }
    assert(urlCurrent.startsWith('/'));
    return urlCurrent;
}

function getPropAccessNotation(key) {
    return typeof key === 'string' && isKeyDotNotationCompatible(key) ? `.${key}` : `[${JSON.stringify(key)}]`;
}
function isKeyDotNotationCompatible(key) {
    return /^[a-z0-9\$_]+$/i.test(key);
}

// Utils needed by Server Routing.
// We assume all runtime entries will load this utils.ts file
onLoad();

function getPageContextSerializedInHtml() {
    // elem should exist because:
    // 1. <script id="vike_pageContext" type="application/json"> appears before the <script> that loads Vike's client runtime (which includes this file)
    // 2. <script id="vike_pageContext" type="application/json"> is neither async nor defer
    // See https://github.com/vikejs/vike/pull/1271
    const id = 'vike_pageContext';
    const elem = document.getElementById(id);
    assertUsage(elem, 
    // It seems like it can be missing because of malformed HTML: https://github.com/vikejs/vike/issues/913
    `Couldn't find #${id} (which Vike automatically injects in the HTML): make sure it exists (i.e. don't remove it and make sure your HTML isn't malformed)`);
    const pageContextJson = elem.textContent;
    assert(pageContextJson);
    const pageContextSerializedInHtml = parse(pageContextJson);
    assert(hasProp(pageContextSerializedInHtml, '_pageId', 'string'));
    assert(hasProp(pageContextSerializedInHtml, 'routeParams', 'string{}'));
    return pageContextSerializedInHtml;
}

function findPageConfig(pageConfigs, pageId) {
    const result = pageConfigs.filter((p) => p.pageId === pageId);
    assert(result.length <= 1);
    const pageConfig = result[0] ?? null;
    return pageConfig;
}

async function loadConfigValues(pageConfig, isDev) {
    if ('isAllLoaded' in pageConfig &&
        // We don't need to cache in dev, since Vite already caches the virtual module
        !isDev) {
        return pageConfig;
    }
    const configValuesLoaded = await pageConfig.loadConfigValuesAll();
    const configValues = parseConfigValuesSerialized(configValuesLoaded.configValuesSerialized);
    Object.assign(pageConfig.configValues, configValues);
    objectAssign(pageConfig, { isAllLoaded: true });
    return pageConfig;
}

const stamp = "__whileFetchingAssets";
async function loadUserFilesClientSide(pageId, pageFilesAll, pageConfigs) {
  const pageFilesClientSide = getPageFilesClientSide(pageFilesAll, pageId);
  const pageConfig = findPageConfig(pageConfigs, pageId);
  let pageConfigLoaded;
  const isDev = false;
  try {
    const result = await Promise.all([
      pageConfig && loadConfigValues(pageConfig, isDev),
      ...pageFilesClientSide.map((p) => p.loadFile?.())
    ]);
    pageConfigLoaded = result[0];
  } catch (err) {
    if (isFetchError(err)) {
      Object.assign(err, { [stamp]: true });
    }
    throw err;
  }
  const pageContextExports = getPageContextExports(pageFilesClientSide, pageConfigLoaded);
  const pageContextAddendum = {};
  objectAssign(pageContextAddendum, pageContextExports);
  objectAssign(pageContextAddendum, { _pageFilesLoaded: pageFilesClientSide });
  return pageContextAddendum;
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

const urlFirst = getCurrentUrl({ withoutHash: true });
async function getPageContext() {
    const pageContext = getPageContextSerializedInHtml();
    objectAssign(pageContext, {
        isHydration: true,
        isBackwardNavigation: null,
        _hasPageContextFromServer: true,
        _hasPageContextFromClient: false
    });
    objectAssign(pageContext, await loadPageUserFiles(pageContext._pageId));
    assertPristineUrl();
    return pageContext;
}
function assertPristineUrl() {
    const urlCurrent = getCurrentUrl({ withoutHash: true });
    assertUsage(urlFirst === urlCurrent, `The URL was manipulated before the hydration finished ('${urlFirst}' to '${urlCurrent}'). Ensure the hydration has finished before manipulating the URL. Consider using the onHydrationEnd() hook.`);
}
async function loadPageUserFiles(pageId) {
    const pageContextAddendum = {};
    const { pageFilesAll, pageConfigs } = await getPageFilesAll();
    objectAssign(pageContextAddendum, {
        _pageFilesAll: pageFilesAll,
        _pageConfigs: pageConfigs
    });
    objectAssign(pageContextAddendum, await loadUserFilesClientSide(pageId, pageContextAddendum._pageFilesAll, pageContextAddendum._pageConfigs));
    pageFilesAll
        .filter((p) => p.fileType !== '.page.server')
        .forEach((p) => {
        assertWarning(!p.fileExports?.onBeforeRender, `export { onBeforeRender } of ${p.filePath} is loaded in the browser but never executed (because you are using Server-side Routing). In order to reduce the size of you browser-side JavaScript, define onBeforeRender() in a .page.server.js file instead, see https://vike.dev/onBeforeRender-isomorphic#server-routing`, { onlyOnce: true });
    });
    return pageContextAddendum;
}

const globalObject$1 = getGlobalObject('getHook.ts', {
    isPrerendering: false
});
function getHook(pageContext, hookName) {
    if (!(hookName in pageContext.exports)) {
        return null;
    }
    const { hooksTimeout } = pageContext.config;
    const hookTimeout = getHookTimeout(hooksTimeout, hookName);
    const hookFn = pageContext.exports[hookName];
    const file = pageContext.exportsAll[hookName][0];
    assert(file.exportValue === hookFn);
    if (hookFn === null)
        return null;
    const hookFilePath = file.filePath;
    assert(hookFilePath);
    assert(!hookFilePath.endsWith(' '));
    assertHookFn(hookFn, { hookName, hookFilePath });
    return { hookFn, hookName, hookFilePath, hookTimeout };
}
function assertHook(pageContext, hookName) {
    getHook(pageContext, hookName);
}
function assertHookFn(hookFn, { hookName, hookFilePath }) {
    assert(hookName && hookFilePath);
    assert(!hookName.endsWith(')'));
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
// Ideally this should be called only once and at build-time (to avoid bloating the client-side bundle), but we didn't implement any mechanism to valide config values at build-time yet
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
            warning: 1 * 1000
        };
    }
    if (globalObject$1.isPrerendering) {
        return {
            error: 2 * 60 * 1000,
            warning: 30 * 1000
        };
    }
    else {
        assert(!hookName.toLowerCase().includes('prerender'));
    }
    return {
        error: 30 * 1000,
        warning: 4 * 1000
    };
}

// Sort `pageContext` keys alphabetically, in order to make reading `console.log(pageContext)` easier
function sortPageContext(pageContext) {
    let descriptors = Object.getOwnPropertyDescriptors(pageContext);
    for (const key of Object.keys(pageContext))
        delete pageContext[key];
    descriptors = Object.fromEntries(Object.entries(descriptors).sort(([key1], [key2]) => compareString(key1, key2)));
    Object.defineProperties(pageContext, descriptors);
}

function addIs404ToPageProps(pageContext) {
    assertIs404(pageContext);
    addIs404(pageContext);
}
function assertIs404(pageContext) {
    if (isErrorPage(pageContext._pageId, pageContext._pageConfigs)) {
        assert(hasProp(pageContext, 'is404', 'boolean'));
    }
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

// TODO: move to ../node/runtime/html/notSerializable.ts once code is distributed as ESM
const notSerializable = 'not-serializable';

const globalObject = getGlobalObject('getPageContextProxyForUser.ts', {});
/**
 * Throw error when pageContext value isn't:
 * - serializable, or
 * - defined.
 */
function getPageContextProxyForUser(pageContext) {
    assert([true, false].includes(pageContext._hasPageContextFromServer));
    assert([true, false].includes(pageContext._hasPageContextFromClient));
    return new Proxy(pageContext, {
        get(_, prop) {
            const val = pageContext[prop];
            const propName = getPropAccessNotation(prop);
            assertUsage(val !== notSerializable, `Can't access pageContext${propName} on the client side. Because it can't be serialized, see server logs.`);
            passToClientHint(pageContext, prop, propName);
            return val;
        }
    });
}
function passToClientHint(pageContext, prop, propName) {
    if (handleVueReactivity(prop))
        return;
    // `prop in pageContext` is the trick we use to know the passToClient value on the client-side, as we set a value to all passToClient props, even `undefined` ones:
    // ```html
    // <script id="vike_pageContext" type="application/json">{"pageProps":"!undefined"}</script>
    // ```
    if (prop in pageContext)
        return;
    if (isWhitelisted(prop))
        return;
    // The trick described above (`prop in pageContext`) doesn't work if Vike doesn't fetch any pageContext from the server.
    // - There would still be some value to show a warning, but it isn't worth it because of the confusion that the first recommendation (adding `prop` to `passToClient`) wouldn't actually remove the warning, and only the second recommendation (using `prop in pageContext` instead of `pageContext[prop]`) would work.
    if (!pageContext._hasPageContextFromServer)
        return;
    const errMsg = `pageContext${propName} isn't defined on the client-side, see https://vike.dev/passToClient#error`;
    if (
    // TODO/next-major-release always make it an error.
    // - Remove pageContext._hasPageContextFromClient logic (IIRC this is its only use case).
    pageContext._hasPageContextFromClient) {
        assertWarning(false, errMsg, { onlyOnce: false, showStackTrace: true });
    }
    else {
        assertUsage(false, errMsg);
    }
}
const WHITELIST = [
    'then',
    'toJSON' // Vue triggers `toJSON`
];
function isWhitelisted(prop) {
    if (WHITELIST.includes(prop))
        return true;
    if (typeof prop === 'symbol')
        return true; // Vue tries to access some symbols
    if (typeof prop !== 'string')
        return true;
    if (prop.startsWith('__v_'))
        return true; // Vue internals upon `reactive(pageContext)`
    return false;
}
// Handle Vue's reactivity.
// When changing a reactive object:
// - Vue tries to read its old value first. This triggers a `assertIsDefined()` failure if e.g. `pageContextReactive.routeParams = pageContextNew.routeParams` and `pageContextReactive` has no `routeParams`.
// - Vue seems to read __v_raw before reading the property.
function handleVueReactivity(prop) {
    if (globalObject.prev === prop || globalObject.prev === '__v_raw')
        return true;
    globalObject.prev = prop;
    window.setTimeout(() => {
        globalObject.prev = undefined;
    }, 0);
    return false;
}

// Release `pageContext` for user consumption.
//
// This adds `assertPassToClient()`.
//
// With Vue support (when `pageContext` is made reactive with Vue).
//
// For Vue + Cient Routing, the `pageContext` needs to be made reactive:
// ```js
// import { reactive } from 'vue'
// // See entire example at `/examples/vue-full/`
// const pageContextReactive = reactive(pageContext)
// ```
function preparePageContextForUserConsumptionClientSide(pageContext, isClientRouting) {
    {
        const pageContextTyped = pageContext;
        assert(pageContextTyped.isHydration === true);
        assert(pageContextTyped.isBackwardNavigation === null);
    }
    assert('config' in pageContext);
    assert('configEntries' in pageContext);
    // TODO/v1-release: remove
    assert('exports' in pageContext);
    assert('exportsAll' in pageContext);
    assert('pageExports' in pageContext);
    assert(isObject(pageContext.pageExports));
    const Page = pageContext.exports.Page;
    objectAssign(pageContext, { Page });
    // For Vue's reactivity
    resolveGetters(pageContext);
    // For prettier `console.log(pageContext)`
    sortPageContext(pageContext);
    const pageContextForUserConsumption = getPageContextProxyForUser(pageContext);
    addIs404ToPageProps(pageContext);
    return pageContextForUserConsumption;
}
// Remove propery descriptor getters because they break Vue's reactivity.
// E.g. resolve the `pageContext.urlPathname` getter.
function resolveGetters(pageContext) {
    Object.entries(pageContext).forEach(([key, val]) => {
        delete pageContext[key];
        pageContext[key] = val;
    });
}

async function executeOnRenderClientHook(pageContext, isClientRouting) {
    const pageContextForUserConsumption = preparePageContextForUserConsumptionClientSide(pageContext);
    let hook = null;
    let hookName;
    {
        const renderHook = getHook(pageContext, 'render');
        hook = renderHook;
        hookName = 'render';
    }
    {
        const renderHook = getHook(pageContext, 'onRenderClient');
        if (renderHook) {
            hook = renderHook;
            hookName = 'onRenderClient';
        }
    }
    if (!hook) {
        const urlToShowToUser = getUrlToShowToUser(pageContext);
        assert(urlToShowToUser);
        if (pageContext._pageConfigs.length > 0) {
            // V1 design
            assertUsage(false, `No onRenderClient() hook defined for URL '${urlToShowToUser}', but it's needed, see https://vike.dev/onRenderClient`);
        }
        else {
            // TODO/v1-release: remove
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
    assert(hook);
    const renderHook = hook.hookFn;
    assert(hookName);
    // We don't use a try-catch wrapper because rendering errors are usually handled by the UI framework. (E.g. React's Error Boundaries.)
    const hookResult = await executeHook(() => renderHook(pageContextForUserConsumption), hook, pageContext);
    assertUsage(hookResult === undefined, `The ${hookName}() hook defined by ${hook.hookFilePath} isn't allowed to return a value`);
}
function getUrlToShowToUser(pageContext) {
    let url;
    // try/catch to avoid passToClient assertUsage() (although: this may not be needed anymore, since we're now accessing pageContext and not pageContextForUserConsumption)
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

assertServerRouting();
assertSingleInstance_onClientEntryServerRouting();
hydrate();
async function hydrate() {
  const pageContext = await getPageContext();
  await executeOnRenderClientHook(pageContext);
  assertHook(pageContext, "onHydrationEnd");
  await pageContext.exports.onHydrationEnd?.(pageContext);
}
