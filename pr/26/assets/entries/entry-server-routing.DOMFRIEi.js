const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/entries/pages_error.CeMuPWlk.js","assets/chunks/chunk-BiSMlUrc.js","assets/chunks/chunk-C_jR_L7K.js","assets/static/style-bf567ca8.BcWtY8Ol.css","assets/chunks/chunk-Cj1Pzm3x.js","assets/static/Layout.CM1M0hot.css","assets/static/PageShell.CHC_lA4_.css","assets/entries/pages_index.CJ-7yr7Y.js","assets/entries/pages_presentations_index.Dxa4l_qc.js","assets/chunks/chunk-CGzni5O_.js","assets/static/view-presentation.B8dU2LIX.css","assets/chunks/chunk-bNc2JGQN.js","assets/chunks/chunk-DI4sGg5h.js","assets/static/index.n5f9Fz8I.css","assets/entries/pages_privacy.BrM9dPrM.js","assets/static/privacy.BhwY7v_u.css","assets/entries/pages_projects.BPFBxU4j.js","assets/static/projects.B2Mz17FV.css","assets/entries/pages_blog_index.CcWptDXZ.js","assets/chunks/chunk-BVSxiK3S.js","assets/static/index.nOSVi-_M.css","assets/entries/pages_blog_view.BFRqoqzL.js","assets/static/view.Bt-1NU10.css","assets/entries/pages_presentations_view.Dp4qIrFq.js","assets/chunks/chunk-DxuxlC8X.js"])))=>i.map(i=>d[i]);
import { a as assert, i as isArray, b as isObject, c as isCallable, d as assertWarning, e as pc, f as assertUsage, g as getGlobalObject, h as getConfigValueFilePathToShowToUser, j as getHookFromPageConfigGlobalCumulative, k as execHookGlobal, u as unique, l as execHook, m as getHookFromPageContext, n as execHookDirectSingle, o as assertSingleInstance_onClientEntryServerRouting } from '../chunks/chunk-C_jR_L7K.js';
import { _ as __vitePreload } from '../chunks/chunk-DxuxlC8X.js';

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/utils/slice.js [vike:pluginModuleBanner] */
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

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/utils/parseUrl.js [vike:pluginModuleBanner] */
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
    if (!isUrlWithProtocol(url)) {
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
function isUrlProtocol(protocol) {
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
    {
        const pathname = pathnameAbsoluteWithBase;
        return { pathname, isBaseMissing: false };
    }
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
    return isUrlWithProtocol(url) || url.startsWith('/') || isUrlRelative(url);
}
function isUrlRelative(url) {
    return ['.', '?', '#'].some((c) => url.startsWith(c)) || url === '';
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
function isUrlWithProtocol(url) {
    const { protocol } = parseProtocol(url);
    return !!protocol && isUrlProtocol(protocol);
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/utils/objectAssign.js [vike:pluginModuleBanner] */
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

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/utils/objectReplace.js [vike:pluginModuleBanner] */
function objectReplace(objOld, objNew, except) {
    Object.keys(objOld)
        .filter((key) => true)
        .forEach((key) => delete objOld[key]);
    Object.defineProperties(objOld, Object.getOwnPropertyDescriptors(objNew));
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/utils/sorter.js [vike:pluginModuleBanner] */
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

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/utils/isBrowser.js [vike:pluginModuleBanner] */
function isBrowser() {
    // Using `typeof window !== 'undefined'` alone is not enough because some users use https://www.npmjs.com/package/ssr-window
    return typeof window !== 'undefined' && typeof window.scrollY === 'number';
    // Alternatively, test whether environment is a *real* browser: https://github.com/brillout/picocolors/blob/d59a33a0fd52a8a33e4158884069192a89ce0113/picocolors.js#L87-L89
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/utils/isArrayOfStrings.js [vike:pluginModuleBanner] */
function isArrayOfStrings(val) {
    return isArray(val) && val.every((v) => typeof v === 'string');
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/utils/isObjectOfStrings.js [vike:pluginModuleBanner] */
function isObjectOfStrings(val) {
    return isObject(val) && Object.values(val).every((v) => typeof v === 'string');
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/utils/hasProp.js [vike:pluginModuleBanner] */
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

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/utils/compareString.js [vike:pluginModuleBanner] */
function compareString(str1, str2) {
    if (str1.toLowerCase() < str2.toLowerCase())
        return -1;
    if (str1.toLowerCase() > str2.toLowerCase())
        return 1;
    return 0;
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/utils/isNullish.js [vike:pluginModuleBanner] */
function isNullish(val) {
    return val === null || val === undefined;
}
// someArray.filter(isNotNullish)
function isNotNullish(p) {
    return !isNullish(p);
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/utils/isPropertyGetter.js [vike:pluginModuleBanner] */
function isPropertyGetter(obj, prop) {
    const descriptor = Object.getOwnPropertyDescriptor(obj, prop);
    return !!descriptor && !('value' in descriptor) && !!descriptor.get;
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/utils/changeEnumerable.js [vike:pluginModuleBanner] */
/** Change enumerability of an object property. */
function changeEnumerable(obj, prop, enumerable) {
    const descriptor = Object.getOwnPropertyDescriptor(obj, prop);
    Object.defineProperty(obj, prop, { ...descriptor, enumerable });
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/utils/objectDefineProperty.js [vike:pluginModuleBanner] */
// Same as Object.defineProperty() but with type inference
function objectDefineProperty(obj, prop, { get, ...args }) {
    Object.defineProperty(obj, prop, { ...args, get });
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/utils/isScriptFile.js [vike:pluginModuleBanner] */
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

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/utils/getPropAccessNotation.js [vike:pluginModuleBanner] */
function getPropAccessNotation(key) {
    return typeof key === 'string' && isKeyDotNotationCompatible(key) ? `.${key}` : `[${JSON.stringify(key)}]`;
}
function isKeyDotNotationCompatible(key) {
    return /^[a-z0-9\$_]+$/i.test(key);
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/utils/genPromise.js [vike:pluginModuleBanner] */
const timeoutSecondsDefault = 25;
function genPromise({ timeout: timeoutSeconds = timeoutSecondsDefault, } = {}) {
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
    if (!timeoutSeconds) {
        promise = promise_internal;
    }
    else {
        promise = new Proxy(promise_internal, {
            get(target, prop) {
                if (prop === 'then' && !finished) {
                    const err = new Error(`Promise hasn't resolved after ${timeoutSeconds} seconds`);
                    timeouts.push(setTimeout(() => {
                        assert(err.stack);
                        assertWarning(false, removeStackErrorPrefix(err.stack), { onlyOnce: false });
                    }, timeoutSeconds * 1000));
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

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/shared/page-configs/getExportPath.js [vike:pluginModuleBanner] */
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

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/shared/page-configs/getConfigDefinedAt.js [vike:pluginModuleBanner] */
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

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/shared/addIs404ToPageProps.js [vike:pluginModuleBanner] */
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

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/shared/NOT_SERIALIZABLE.js [vike:pluginModuleBanner] */
const NOT_SERIALIZABLE = '__VIKE__NOT_SERIALIZABLE__';

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/shared/getProxyForPublicUsage.js [vike:pluginModuleBanner] */
function getProxyForPublicUsage(obj, objName, skipOnInternalProp, fallback) {
  return new Proxy(obj, {
    get: getTrapGet(obj, objName, skipOnInternalProp, fallback)
  });
}
function getTrapGet(obj, objName, skipOnInternalProp, fallback) {
  return function(_, prop) {
    const propStr = String(prop);
    if (prop === "_isProxyObject")
      return true;
    if (!skipOnInternalProp)
      onInternalProp(propStr, objName);
    if (fallback && !(prop in obj)) {
      return fallback(prop);
    }
    const val = obj[prop];
    onNotSerializable(propStr, val, objName);
    return val;
  };
}
function onNotSerializable(propStr, val, objName) {
  if (val !== NOT_SERIALIZABLE)
    return;
  const propName = getPropAccessNotation(propStr);
  assert(isBrowser());
  assertUsage(false, `Can't access ${objName}${propName} on the client side. Because it can't be serialized, see server logs.`);
}
function onInternalProp(propStr, objName) {
  if (isBrowser())
    return;
  if (propStr === "_configFromHook")
    return;
  if (propStr.startsWith("_")) {
    assertWarning(false, `Using internal ${objName}.${propStr} which may break in any minor version update. Reach out on GitHub to request official support for your use case.`, { onlyOnce: true, showStackTrace: true });
  }
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/shared/prepareGlobalContextForPublicUsage.js [vike:pluginModuleBanner] */
function prepareGlobalContextForPublicUsage(globalContext) {
    assert(globalContext._isOriginalObject); // ensure we preserve the original object reference
    const globalContextPublic = getProxyForPublicUsage(globalContext, 'globalContext');
    return globalContextPublic;
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/shared/preparePageContextForPublicUsage.js [vike:pluginModuleBanner] */
function preparePageContextForPublicUsage(pageContext) {
    assert(!pageContext._isProxyObject);
    assert(!pageContext.globalContext); // pageContext.globalContext should only be available to users — Vike itself should use pageContext._globalContext instead
    assert(pageContext._isOriginalObject); // ensure we preserve the original object reference
    addIs404ToPageProps(pageContext);
    // TO-DO/next-major-release: remove
    if (!('_pageId' in pageContext)) {
        Object.defineProperty(pageContext, '_pageId', {
            get() {
                assertWarning(false, 'pageContext._pageId has been renamed to pageContext.pageId', {
                    showStackTrace: true,
                    onlyOnce: true,
                });
                return pageContext.pageId;
            },
            enumerable: false,
        });
    }
    // For a more readable `console.log(pageContext)` output
    sortPageContext(pageContext);
    const globalContextPublic = prepareGlobalContextForPublicUsage(pageContext._globalContext);
    const pageContextPublic = getProxyForPublicUsage(pageContext, 'pageContext', 
    // We must skip it in the client-side because of the reactivity mechanism of UI frameworks like Solid.
    // - TO-DO/soon/proxy: double check whether that's true
    true, (prop) => {
        if (prop === 'globalContext') {
            return globalContextPublic;
        }
        if (prop in globalContextPublic) {
            return globalContextPublic[prop];
        }
    });
    return pageContextPublic;
}
// Sort `pageContext` keys alphabetically, in order to make reading the `console.log(pageContext)` output easier
function sortPageContext(pageContext) {
    let descriptors = Object.getOwnPropertyDescriptors(pageContext);
    for (const key of Object.keys(pageContext))
        delete pageContext[key];
    descriptors = Object.fromEntries(Object.entries(descriptors).sort(([key1], [key2]) => compareString(key1, key2)));
    Object.defineProperties(pageContext, descriptors);
}
function assertPropertyGetters(pageContext) {
    [
        'urlPathname',
        // TO-DO/next-major-release: remove
        'urlParsed',
        // TO-DO/next-major-release: remove
        'url',
        // TO-DO/next-major-release: remove
        'pageExports',
    ].forEach((prop) => {
        if (pageContext.prop)
            assert(isPropertyGetter(pageContext, prop));
    });
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/utils/assertRoutingType.js [vike:pluginModuleBanner] */
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

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/utils/assertIsBrowser.js [vike:pluginModuleBanner] */
function assertIsBrowser() {
    assert(isBrowser());
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/client/runtime-server-routing/onLoad.js [vike:pluginModuleBanner] */
function onLoad() {
    assertIsBrowser();
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/utils/updateType.js [vike:pluginModuleBanner] */
/** Help TypeScript update the type of dynamically modified objects. */
function updateType(thing, clone) {
    // @ts-ignore
    assert(thing === clone);
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/client/runtime-server-routing/utils.js [vike:pluginModuleBanner] */
// Utils needed by Vike's client runtime (with Server Routing)
// We call onLoad() here so that it's called even when only a subset of the runtime is loaded. (Making the assert() calls inside onLoad() a lot stronger.)
onLoad();

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/@brillout+json-serializer@0.5.20/node_modules/@brillout/json-serializer/dist/types.js [vike:pluginModuleBanner] */
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

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/@brillout+json-serializer@0.5.20/node_modules/@brillout/json-serializer/dist/parse.js [vike:pluginModuleBanner] */
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

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/shared/htmlElementIds.js [vike:pluginModuleBanner] */
const htmlElementId_pageContext = 'vike_pageContext';
const htmlElementId_globalContext = 'vike_globalContext';

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/client/shared/getJsonSerializedInHtml.js [vike:pluginModuleBanner] */
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

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/shared/getPageFiles/getAllPageIdFiles.js [vike:pluginModuleBanner] */
// TO-DO/next-major-release: remove this file
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
    // A page can load multiple `_default.page.*` files of the same `fileType`. In other words: non-renderer `_default.page.*` files are cumulative.
    // The exception being HTML-only pages because we pick a single page file as client entry. We handle that use case at `renderPage()`.
    const defaultFilesNonRenderer = pageFilesRelevant.filter((p) => p.isDefaultPageFile && !p.isRendererPageFile && (p.isEnv(env) || p.isEnv('CLIENT_AND_SERVER')));
    // Ordered by `pageContext.exports` precedence
    const pageFiles = [pageIdFileEnv, pageIdFileIso, ...defaultFilesNonRenderer, rendererFileEnv, rendererFileIso].filter(isNotNullish);
    return pageFiles;
}
function getPageFilesSorter(envIsClient, pageId) {
    const env = 'CLIENT_ONLY' ;
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

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/shared/getPageFiles/assert_exports_old_design.js [vike:pluginModuleBanner] */
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

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/shared/page-configs/resolveVikeConfigPublic.js [vike:pluginModuleBanner] */
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

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/shared/page-configs/findPageConfig.js [vike:pluginModuleBanner] */
function findPageConfig(pageConfigs, pageId) {
    const result = pageConfigs.filter((p) => p.pageId === pageId);
    assert(result.length <= 1);
    const pageConfig = result[0] ?? null;
    return pageConfig;
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/shared/page-configs/assertPlusFileExport.js [vike:pluginModuleBanner] */
const SIDE_EXPORTS_TOLERATE = [
    // vite-plugin-solid adds `export { $$registrations }`
    '$$registrations',
    // @vitejs/plugin-vue adds `export { _rerender_only }`
    '_rerender_only',
];
// Tolerate `export { frontmatter }` in .mdx files
const SIDE_EXPORTS_DO_NOT_CHECK = ['.md', '.mdx'];
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
    const exportNamesInvalid = exportNames
        .filter((e) => !isValid(e))
        .filter((exportName) => !SIDE_EXPORTS_TOLERATE.includes(exportName));
    if (!SIDE_EXPORTS_DO_NOT_CHECK.some((ext) => filePathToShowToUser.endsWith(ext))) {
        exportNamesInvalid.forEach((exportInvalid) => {
            assertWarning(false, `${filePathToShowToUser} unexpected ${pc.cyan(`export { ${exportInvalid} }`)}, see https://vike.dev/no-side-exports`, {
                onlyOnce: true,
            });
        });
    }
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/shared/page-configs/serialize/parsePageConfigsSerialized.js [vike:pluginModuleBanner] */
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

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/shared/page-configs/loadAndParseVirtualFilePageEntry.js [vike:pluginModuleBanner] */
async function loadAndParseVirtualFilePageEntry(pageConfig, isDev) {
    if ('isPageEntryLoaded' in pageConfig &&
        // We don't need to cache in dev, since Vite already caches the virtual module
        true) {
        return pageConfig;
    }
    const { moduleId, moduleExportsPromise } = pageConfig.loadVirtualFilePageEntry();
    const virtualFileExportsPageEntry = await moduleExportsPromise;
    // `configValuesLoaded` is sometimes `undefined` https://github.com/vikejs/vike/discussions/2092
    if (!virtualFileExportsPageEntry)
        assert(false, { moduleExportsPromise, virtualFileExportsPageEntry, moduleId });
    const configValues = parseVirtualFileExportsPageEntry(virtualFileExportsPageEntry);
    Object.assign(pageConfig.configValues, configValues);
    objectAssign(pageConfig, { isPageEntryLoaded: true });
    return pageConfig;
}
function parseVirtualFileExportsPageEntry(virtualFileExportsPageEntry) {
    const configValues = parseConfigValuesSerialized(virtualFileExportsPageEntry.configValuesSerialized);
    return configValues;
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/client/shared/loadPageConfigsLazyClientSide.js [vike:pluginModuleBanner] */
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

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/client/shared/normalizeClientSideUrl.js [vike:pluginModuleBanner] */
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

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/client/shared/getCurrentUrl.js [vike:pluginModuleBanner] */
function getCurrentUrl(options) {
    return normalizeClientSideUrl(window.location.href, options);
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/shared/createPageContextShared.js [vike:pluginModuleBanner] */
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

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/shared/determinePageIdOld.js [vike:pluginModuleBanner] */
// TO-DO/next-major-release: remove
function determinePageIdOld(filePath) {
    const pageSuffix = '.page.';
    const pageId = slice(filePath.split(pageSuffix), 0, -1).join(pageSuffix);
    assert(!pageId.includes('\\'));
    return pageId;
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/shared/error-page.js [vike:pluginModuleBanner] */
// TO-DO/next-major-release: remove
function isErrorPageId(pageId, _isV1Design) {
    assert(!pageId.includes('\\'));
    return pageId.includes('/_error');
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/shared/getPageFiles/fileTypes.js [vike:pluginModuleBanner] */
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
            assert(isImportPathNpmPackage(filePath), filePath) // `.css` page files are only supported for npm packages
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

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/shared/getPageFiles/getPageFileObject.js [vike:pluginModuleBanner] */
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

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/shared/getPageFiles/parseVirtualFileExportsGlobalEntry.js [vike:pluginModuleBanner] */
function parseVirtualFileExportsGlobalEntry(virtualFileExportsGlobalEntry) {
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

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/shared/createGlobalContextShared.js [vike:pluginModuleBanner] */
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
    const onCreateGlobalContextHooks = getHookFromPageConfigGlobalCumulative(globalContext._pageConfigGlobal, 'onCreateGlobalContext');
    let hooksCalled = false;
    if (!hooksAreEqual(globalObject.onCreateGlobalContextHooks ?? [], onCreateGlobalContextHooks)) {
        globalObject.onCreateGlobalContextHooks = onCreateGlobalContextHooks;
        await execHookGlobal('onCreateGlobalContext', globalContext._pageConfigGlobal, null, globalContext, prepareGlobalContextForPublicUsage);
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
    resolve();
    return globalObject.globalContext;
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

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/client/shared/getGlobalContextClientInternalShared.js [vike:pluginModuleBanner] */
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

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/client/runtime-server-routing/getGlobalContextClientInternal.js [vike:pluginModuleBanner] */
async function getGlobalContextClientInternal() {
    const globalContext = await getGlobalContextClientInternalShared();
    return globalContext;
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/client/shared/preparePageContextForPublicUsageClientShared.js [vike:pluginModuleBanner] */
function preparePageContextForPublicUsageClientShared(pageContext) {
    // TO-DO/soon/proxy: use proxy
    const Page = pageContext.config?.Page ||
        // TO-DO/next-major-release: remove
        pageContext.exports?.Page;
    objectAssign(pageContext, { Page });
    // TO-DO/next-major-release: after we remove supportVueReactiviy() we can call this later inside the agnostic preparePageContextForPublicUsage()
    assertPropertyGetters(pageContext);
    // TO-DO/next-major-release: remove
    // - Requires https://github.com/vikejs/vike-vue/issues/198
    // - Last time I tried to remove it (https://github.com/vikejs/vike/commit/705fd23598d9d69bf46a52c8550216cd7117ce71) the tests were failing as expected: only the Vue integrations that used shallowReactive() failed.
    supportVueReactiviy(pageContext);
    return preparePageContextForPublicUsageClientMinimal(pageContext);
}
function preparePageContextForPublicUsageClientMinimal(pageContext) {
    const pageContextPublic = preparePageContextForPublicUsage(pageContext);
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

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/client/runtime-server-routing/preparePageContextForPublicUsageClient.js [vike:pluginModuleBanner] */
function preparePageContextForPublicUsageClient(pageContext) {
    return preparePageContextForPublicUsageClientShared(pageContext);
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/client/runtime-server-routing/createPageContextClientSide.js [vike:pluginModuleBanner] */
const urlFirst = getCurrentUrl({ withoutHash: true });
async function createPageContextClientSide() {
    const globalContext = await getGlobalContextClientInternal();
    const pageContextCreated = createPageContextObject();
    objectAssign(pageContextCreated, {
        isClientSide: true,
        isPrerendering: false,
        isHydration: true,
        _globalContext: globalContext,
        _pageFilesAll: globalContext._pageFilesAll, // TO-DO/next-major-release: remove
        isBackwardNavigation: null,
        _hasPageContextFromServer: true,
    });
    objectAssign(pageContextCreated, getPageContextSerializedInHtml());
    // Sets pageContext.config to global configs
    updateType(pageContextCreated, createPageContextShared(pageContextCreated, globalContext._globalConfigPublic));
    // Sets pageContext.config to local configs (overrides the pageContext.config set above)
    updateType(pageContextCreated, await loadPageConfigsLazyClientSideAndExecHook(pageContextCreated));
    assertPristineUrl();
    return pageContextCreated;
}
function assertPristineUrl() {
    const urlCurrent = getCurrentUrl({ withoutHash: true });
    assertUsage(urlFirst === urlCurrent, `The URL was manipulated before the hydration finished ('${urlFirst}' to '${urlCurrent}'). Ensure the hydration has finished before manipulating the URL. Consider using the onHydrationEnd() hook.`);
}
async function loadPageConfigsLazyClientSideAndExecHook(pageContext) {
    const pageContextAddendum = await loadPageConfigsLazyClientSide(pageContext.pageId, pageContext._pageFilesAll, pageContext._globalContext._pageConfigs, pageContext._globalContext._pageConfigGlobal);
    objectAssign(pageContext, pageContextAddendum);
    await execHook('onCreatePageContext', pageContext, preparePageContextForPublicUsageClient);
    return pageContext;
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/client/shared/execHookOnRenderClient.js [vike:pluginModuleBanner] */
async function execHookOnRenderClient(pageContext, prepareForPublicUsage) {
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
    await execHookDirectSingle(hook, pageContext, prepareForPublicUsage);
}
function getUrlToShowToUser(pageContext) {
    let url;
    // try/catch to avoid passToClient assertUsage() (although: this may not be needed anymore, since we're now accessing pageContext and not pageContextForPublicUsage)
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

/*! virtual:vike:global-entry:client:server-routing [vike:pluginModuleBanner] */

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
    loadVirtualFilePageEntry: () => ({ moduleId: "virtual:vike:page-entry:client:/pages/_error", moduleExportsPromise: __vitePreload(() => import('./pages_error.CeMuPWlk.js'),true              ?__vite__mapDeps([0,1,2,3,4,5,6]):void 0) }),
    configValuesSerialized: {
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
    loadVirtualFilePageEntry: () => ({ moduleId: "virtual:vike:page-entry:client:/pages/index", moduleExportsPromise: __vitePreload(() => import('./pages_index.CJ-7yr7Y.js'),true              ?__vite__mapDeps([7,1,2,3,4,5,6]):void 0) }),
    configValuesSerialized: {
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
    loadVirtualFilePageEntry: () => ({ moduleId: "virtual:vike:page-entry:client:/pages/presentations/index", moduleExportsPromise: __vitePreload(() => import('./pages_presentations_index.Dxa4l_qc.js'),true              ?__vite__mapDeps([8,1,2,3,9,10,11,4,5,6,12,13]):void 0) }),
    configValuesSerialized: {
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
    pageId: "/pages/privacy",
    isErrorPage: undefined,
    routeFilesystem: {"routeString":"/privacy","definedAtLocation":"/pages/privacy/"},
    loadVirtualFilePageEntry: () => ({ moduleId: "virtual:vike:page-entry:client:/pages/privacy", moduleExportsPromise: __vitePreload(() => import('./pages_privacy.BrM9dPrM.js'),true              ?__vite__mapDeps([14,1,2,3,15,6]):void 0) }),
    configValuesSerialized: {
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
    loadVirtualFilePageEntry: () => ({ moduleId: "virtual:vike:page-entry:client:/pages/projects", moduleExportsPromise: __vitePreload(() => import('./pages_projects.BPFBxU4j.js'),true              ?__vite__mapDeps([16,1,2,3,4,5,6,11,12,17]):void 0) }),
    configValuesSerialized: {
      ["serverOnlyHooks"]: {
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
    loadVirtualFilePageEntry: () => ({ moduleId: "virtual:vike:page-entry:client:/pages/blog/index", moduleExportsPromise: __vitePreload(() => import('./pages_blog_index.CcWptDXZ.js'),true              ?__vite__mapDeps([18,1,2,3,19,4,5,6,12,20]):void 0) }),
    configValuesSerialized: {
      ["serverOnlyHooks"]: {
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
    loadVirtualFilePageEntry: () => ({ moduleId: "virtual:vike:page-entry:client:/pages/blog/view", moduleExportsPromise: __vitePreload(() => import('./pages_blog_view.BFRqoqzL.js'),true              ?__vite__mapDeps([21,1,2,3,19,11,4,5,6,12,22]):void 0) }),
    configValuesSerialized: {
      ["serverOnlyHooks"]: {
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
    loadVirtualFilePageEntry: () => ({ moduleId: "virtual:vike:page-entry:client:/pages/presentations/view", moduleExportsPromise: __vitePreload(() => import('./pages_presentations_view.Dp4qIrFq.js'),true              ?__vite__mapDeps([23,1,2,3,24,9,10]):void 0) }),
    configValuesSerialized: {
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

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike@0.4.239-commit-9dcde6d_patch_hash=glgnedzwnw5rvkijrtehacjmkm_react-streaming@0.4.3_react_27rdksrpiftuszd3qzcz2p7rem/node_modules/vike/dist/esm/client/runtime-server-routing/entry.js [vike:pluginModuleBanner] */
assertServerRouting();
assertSingleInstance_onClientEntryServerRouting();
setVirtualFileExportsGlobalEntry(virtualFileExportsGlobalEntry);
hydrate();
async function hydrate() {
  const pageContext = await createPageContextClientSide();
  await execHookOnRenderClient(pageContext, preparePageContextForPublicUsageClient);
  await execHook("onHydrationEnd", pageContext, preparePageContextForPublicUsageClient);
}
