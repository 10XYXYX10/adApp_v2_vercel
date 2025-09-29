
import {Buffer} from "node:buffer";
globalThis.Buffer = Buffer;

import {AsyncLocalStorage} from "node:async_hooks";
globalThis.AsyncLocalStorage = AsyncLocalStorage;


const defaultDefineProperty = Object.defineProperty;
Object.defineProperty = function(o, p, a) {
  if(p=== '__import_unsupported' && Boolean(globalThis.__import_unsupported)) {
    return;
  }
  return defaultDefineProperty(o, p, a);
};

  
  
  globalThis.openNextDebug = false;globalThis.openNextVersion = "3.7.7";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/@opennextjs/aws/dist/utils/error.js
function isOpenNextError(e) {
  try {
    return "__openNextInternal" in e;
  } catch {
    return false;
  }
}
var init_error = __esm({
  "node_modules/@opennextjs/aws/dist/utils/error.js"() {
  }
});

// node_modules/@opennextjs/aws/dist/adapters/logger.js
function debug(...args) {
  if (globalThis.openNextDebug) {
    console.log(...args);
  }
}
function warn(...args) {
  console.warn(...args);
}
function error(...args) {
  if (args.some((arg) => isDownplayedErrorLog(arg))) {
    return debug(...args);
  }
  if (args.some((arg) => isOpenNextError(arg))) {
    const error2 = args.find((arg) => isOpenNextError(arg));
    if (error2.logLevel < getOpenNextErrorLogLevel()) {
      return;
    }
    if (error2.logLevel === 0) {
      return console.log(...args.map((arg) => isOpenNextError(arg) ? `${arg.name}: ${arg.message}` : arg));
    }
    if (error2.logLevel === 1) {
      return warn(...args.map((arg) => isOpenNextError(arg) ? `${arg.name}: ${arg.message}` : arg));
    }
    return console.error(...args);
  }
  console.error(...args);
}
function getOpenNextErrorLogLevel() {
  const strLevel = process.env.OPEN_NEXT_ERROR_LOG_LEVEL ?? "1";
  switch (strLevel.toLowerCase()) {
    case "debug":
    case "0":
      return 0;
    case "error":
    case "2":
      return 2;
    default:
      return 1;
  }
}
var DOWNPLAYED_ERROR_LOGS, isDownplayedErrorLog;
var init_logger = __esm({
  "node_modules/@opennextjs/aws/dist/adapters/logger.js"() {
    init_error();
    DOWNPLAYED_ERROR_LOGS = [
      {
        clientName: "S3Client",
        commandName: "GetObjectCommand",
        errorName: "NoSuchKey"
      }
    ];
    isDownplayedErrorLog = (errorLog) => DOWNPLAYED_ERROR_LOGS.some((downplayedInput) => downplayedInput.clientName === errorLog?.clientName && downplayedInput.commandName === errorLog?.commandName && (downplayedInput.errorName === errorLog?.error?.name || downplayedInput.errorName === errorLog?.error?.Code));
  }
});

// node_modules/cookie/dist/index.js
var require_dist = __commonJS({
  "node_modules/cookie/dist/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parse = parse3;
    exports.serialize = serialize;
    var cookieNameRegExp = /^[\u0021-\u003A\u003C\u003E-\u007E]+$/;
    var cookieValueRegExp = /^[\u0021-\u003A\u003C-\u007E]*$/;
    var domainValueRegExp = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i;
    var pathValueRegExp = /^[\u0020-\u003A\u003D-\u007E]*$/;
    var __toString = Object.prototype.toString;
    var NullObject = /* @__PURE__ */ (() => {
      const C = function() {
      };
      C.prototype = /* @__PURE__ */ Object.create(null);
      return C;
    })();
    function parse3(str, options) {
      const obj = new NullObject();
      const len = str.length;
      if (len < 2)
        return obj;
      const dec = options?.decode || decode;
      let index = 0;
      do {
        const eqIdx = str.indexOf("=", index);
        if (eqIdx === -1)
          break;
        const colonIdx = str.indexOf(";", index);
        const endIdx = colonIdx === -1 ? len : colonIdx;
        if (eqIdx > endIdx) {
          index = str.lastIndexOf(";", eqIdx - 1) + 1;
          continue;
        }
        const keyStartIdx = startIndex(str, index, eqIdx);
        const keyEndIdx = endIndex(str, eqIdx, keyStartIdx);
        const key = str.slice(keyStartIdx, keyEndIdx);
        if (obj[key] === void 0) {
          let valStartIdx = startIndex(str, eqIdx + 1, endIdx);
          let valEndIdx = endIndex(str, endIdx, valStartIdx);
          const value = dec(str.slice(valStartIdx, valEndIdx));
          obj[key] = value;
        }
        index = endIdx + 1;
      } while (index < len);
      return obj;
    }
    function startIndex(str, index, max) {
      do {
        const code = str.charCodeAt(index);
        if (code !== 32 && code !== 9)
          return index;
      } while (++index < max);
      return max;
    }
    function endIndex(str, index, min) {
      while (index > min) {
        const code = str.charCodeAt(--index);
        if (code !== 32 && code !== 9)
          return index + 1;
      }
      return min;
    }
    function serialize(name, val, options) {
      const enc = options?.encode || encodeURIComponent;
      if (!cookieNameRegExp.test(name)) {
        throw new TypeError(`argument name is invalid: ${name}`);
      }
      const value = enc(val);
      if (!cookieValueRegExp.test(value)) {
        throw new TypeError(`argument val is invalid: ${val}`);
      }
      let str = name + "=" + value;
      if (!options)
        return str;
      if (options.maxAge !== void 0) {
        if (!Number.isInteger(options.maxAge)) {
          throw new TypeError(`option maxAge is invalid: ${options.maxAge}`);
        }
        str += "; Max-Age=" + options.maxAge;
      }
      if (options.domain) {
        if (!domainValueRegExp.test(options.domain)) {
          throw new TypeError(`option domain is invalid: ${options.domain}`);
        }
        str += "; Domain=" + options.domain;
      }
      if (options.path) {
        if (!pathValueRegExp.test(options.path)) {
          throw new TypeError(`option path is invalid: ${options.path}`);
        }
        str += "; Path=" + options.path;
      }
      if (options.expires) {
        if (!isDate(options.expires) || !Number.isFinite(options.expires.valueOf())) {
          throw new TypeError(`option expires is invalid: ${options.expires}`);
        }
        str += "; Expires=" + options.expires.toUTCString();
      }
      if (options.httpOnly) {
        str += "; HttpOnly";
      }
      if (options.secure) {
        str += "; Secure";
      }
      if (options.partitioned) {
        str += "; Partitioned";
      }
      if (options.priority) {
        const priority = typeof options.priority === "string" ? options.priority.toLowerCase() : void 0;
        switch (priority) {
          case "low":
            str += "; Priority=Low";
            break;
          case "medium":
            str += "; Priority=Medium";
            break;
          case "high":
            str += "; Priority=High";
            break;
          default:
            throw new TypeError(`option priority is invalid: ${options.priority}`);
        }
      }
      if (options.sameSite) {
        const sameSite = typeof options.sameSite === "string" ? options.sameSite.toLowerCase() : options.sameSite;
        switch (sameSite) {
          case true:
          case "strict":
            str += "; SameSite=Strict";
            break;
          case "lax":
            str += "; SameSite=Lax";
            break;
          case "none":
            str += "; SameSite=None";
            break;
          default:
            throw new TypeError(`option sameSite is invalid: ${options.sameSite}`);
        }
      }
      return str;
    }
    function decode(str) {
      if (str.indexOf("%") === -1)
        return str;
      try {
        return decodeURIComponent(str);
      } catch (e) {
        return str;
      }
    }
    function isDate(val) {
      return __toString.call(val) === "[object Date]";
    }
  }
});

// node_modules/@opennextjs/aws/dist/http/util.js
function parseSetCookieHeader(cookies) {
  if (!cookies) {
    return [];
  }
  if (typeof cookies === "string") {
    return cookies.split(/(?<!Expires=\w+),/i).map((c) => c.trim());
  }
  return cookies;
}
function getQueryFromIterator(it) {
  const query = {};
  for (const [key, value] of it) {
    if (key in query) {
      if (Array.isArray(query[key])) {
        query[key].push(value);
      } else {
        query[key] = [query[key], value];
      }
    } else {
      query[key] = value;
    }
  }
  return query;
}
var init_util = __esm({
  "node_modules/@opennextjs/aws/dist/http/util.js"() {
  }
});

// node_modules/@opennextjs/aws/dist/overrides/converters/utils.js
function getQueryFromSearchParams(searchParams) {
  return getQueryFromIterator(searchParams.entries());
}
var init_utils = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/converters/utils.js"() {
    init_util();
  }
});

// node_modules/@opennextjs/aws/dist/overrides/converters/edge.js
var edge_exports = {};
__export(edge_exports, {
  default: () => edge_default
});
import { Buffer as Buffer2 } from "node:buffer";
var import_cookie, NULL_BODY_STATUSES, converter, edge_default;
var init_edge = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/converters/edge.js"() {
    import_cookie = __toESM(require_dist(), 1);
    init_util();
    init_utils();
    NULL_BODY_STATUSES = /* @__PURE__ */ new Set([101, 103, 204, 205, 304]);
    converter = {
      convertFrom: async (event) => {
        const url = new URL(event.url);
        const searchParams = url.searchParams;
        const query = getQueryFromSearchParams(searchParams);
        const body = await event.arrayBuffer();
        const headers = {};
        event.headers.forEach((value, key) => {
          headers[key] = value;
        });
        const rawPath = url.pathname;
        const method = event.method;
        const shouldHaveBody = method !== "GET" && method !== "HEAD";
        const cookieHeader = event.headers.get("cookie");
        const cookies = cookieHeader ? import_cookie.default.parse(cookieHeader) : {};
        return {
          type: "core",
          method,
          rawPath,
          url: event.url,
          body: shouldHaveBody ? Buffer2.from(body) : void 0,
          headers,
          remoteAddress: event.headers.get("x-forwarded-for") ?? "::1",
          query,
          cookies
        };
      },
      convertTo: async (result) => {
        if ("internalEvent" in result) {
          const request = new Request(result.internalEvent.url, {
            body: result.internalEvent.body,
            method: result.internalEvent.method,
            headers: {
              ...result.internalEvent.headers,
              "x-forwarded-host": result.internalEvent.headers.host
            }
          });
          if (globalThis.__dangerous_ON_edge_converter_returns_request === true) {
            return request;
          }
          const cfCache = (result.isISR || result.internalEvent.rawPath.startsWith("/_next/image")) && process.env.DISABLE_CACHE !== "true" ? { cacheEverything: true } : {};
          return fetch(request, {
            // This is a hack to make sure that the response is cached by Cloudflare
            // See https://developers.cloudflare.com/workers/examples/cache-using-fetch/#caching-html-resources
            // @ts-expect-error - This is a Cloudflare specific option
            cf: cfCache
          });
        }
        const headers = new Headers();
        for (const [key, value] of Object.entries(result.headers)) {
          if (key === "set-cookie" && typeof value === "string") {
            const cookies = parseSetCookieHeader(value);
            for (const cookie of cookies) {
              headers.append(key, cookie);
            }
            continue;
          }
          if (Array.isArray(value)) {
            for (const v of value) {
              headers.append(key, v);
            }
          } else {
            headers.set(key, value);
          }
        }
        const body = NULL_BODY_STATUSES.has(result.statusCode) ? null : result.body;
        return new Response(body, {
          status: result.statusCode,
          headers
        });
      },
      name: "edge"
    };
    edge_default = converter;
  }
});

// node_modules/@opennextjs/aws/dist/overrides/wrappers/cloudflare-edge.js
var cloudflare_edge_exports = {};
__export(cloudflare_edge_exports, {
  default: () => cloudflare_edge_default
});
var cfPropNameMapping, handler, cloudflare_edge_default;
var init_cloudflare_edge = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/wrappers/cloudflare-edge.js"() {
    cfPropNameMapping = {
      // The city name is percent-encoded.
      // See https://github.com/vercel/vercel/blob/4cb6143/packages/functions/src/headers.ts#L94C19-L94C37
      city: [encodeURIComponent, "x-open-next-city"],
      country: "x-open-next-country",
      regionCode: "x-open-next-region",
      latitude: "x-open-next-latitude",
      longitude: "x-open-next-longitude"
    };
    handler = async (handler3, converter2) => async (request, env, ctx) => {
      globalThis.process = process;
      for (const [key, value] of Object.entries(env)) {
        if (typeof value === "string") {
          process.env[key] = value;
        }
      }
      const internalEvent = await converter2.convertFrom(request);
      const cfProperties = request.cf;
      for (const [propName, mapping] of Object.entries(cfPropNameMapping)) {
        const propValue = cfProperties?.[propName];
        if (propValue != null) {
          const [encode, headerName] = Array.isArray(mapping) ? mapping : [null, mapping];
          internalEvent.headers[headerName] = encode ? encode(propValue) : propValue;
        }
      }
      const response = await handler3(internalEvent, {
        waitUntil: ctx.waitUntil.bind(ctx)
      });
      const result = await converter2.convertTo(response);
      return result;
    };
    cloudflare_edge_default = {
      wrapper: handler,
      name: "cloudflare-edge",
      supportStreaming: true,
      edgeRuntime: true
    };
  }
});

// node_modules/@opennextjs/aws/dist/overrides/originResolver/pattern-env.js
var pattern_env_exports = {};
__export(pattern_env_exports, {
  default: () => pattern_env_default
});
var envLoader, pattern_env_default;
var init_pattern_env = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/originResolver/pattern-env.js"() {
    init_logger();
    envLoader = {
      name: "env",
      resolve: async (_path) => {
        try {
          const origin = JSON.parse(process.env.OPEN_NEXT_ORIGIN ?? "{}");
          for (const [key, value] of Object.entries(globalThis.openNextConfig.functions ?? {}).filter(([key2]) => key2 !== "default")) {
            if (value.patterns.some((pattern) => {
              return new RegExp(
                // transform glob pattern to regex
                `/${pattern.replace(/\*\*/g, "(.*)").replace(/\*/g, "([^/]*)").replace(/\//g, "\\/").replace(/\?/g, ".")}`
              ).test(_path);
            })) {
              debug("Using origin", key, value.patterns);
              return origin[key];
            }
          }
          if (_path.startsWith("/_next/image") && origin.imageOptimizer) {
            debug("Using origin", "imageOptimizer", _path);
            return origin.imageOptimizer;
          }
          if (origin.default) {
            debug("Using default origin", origin.default, _path);
            return origin.default;
          }
          return false;
        } catch (e) {
          error("Error while resolving origin", e);
          return false;
        }
      }
    };
    pattern_env_default = envLoader;
  }
});

// node_modules/@opennextjs/aws/dist/overrides/assetResolver/dummy.js
var dummy_exports = {};
__export(dummy_exports, {
  default: () => dummy_default
});
var resolver, dummy_default;
var init_dummy = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/assetResolver/dummy.js"() {
    resolver = {
      name: "dummy"
    };
    dummy_default = resolver;
  }
});

// node_modules/@opennextjs/aws/dist/utils/stream.js
import { Readable } from "node:stream";
function toReadableStream(value, isBase64) {
  return Readable.toWeb(Readable.from(Buffer.from(value, isBase64 ? "base64" : "utf8")));
}
function emptyReadableStream() {
  if (process.env.OPEN_NEXT_FORCE_NON_EMPTY_RESPONSE === "true") {
    return Readable.toWeb(Readable.from([Buffer.from("SOMETHING")]));
  }
  return Readable.toWeb(Readable.from([]));
}
var init_stream = __esm({
  "node_modules/@opennextjs/aws/dist/utils/stream.js"() {
  }
});

// node_modules/@opennextjs/aws/dist/overrides/proxyExternalRequest/fetch.js
var fetch_exports = {};
__export(fetch_exports, {
  default: () => fetch_default
});
var fetchProxy, fetch_default;
var init_fetch = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/proxyExternalRequest/fetch.js"() {
    init_stream();
    fetchProxy = {
      name: "fetch-proxy",
      // @ts-ignore
      proxy: async (internalEvent) => {
        const { url, headers: eventHeaders, method, body } = internalEvent;
        const headers = Object.fromEntries(Object.entries(eventHeaders).filter(([key]) => key.toLowerCase() !== "cf-connecting-ip"));
        const response = await fetch(url, {
          method,
          headers,
          body
        });
        const responseHeaders = {};
        response.headers.forEach((value, key) => {
          responseHeaders[key] = value;
        });
        return {
          type: "core",
          headers: responseHeaders,
          statusCode: response.status,
          isBase64Encoded: true,
          body: response.body ?? emptyReadableStream()
        };
      }
    };
    fetch_default = fetchProxy;
  }
});

// node-built-in-modules:node:buffer
var node_buffer_exports = {};
import * as node_buffer_star from "node:buffer";
var init_node_buffer = __esm({
  "node-built-in-modules:node:buffer"() {
    __reExport(node_buffer_exports, node_buffer_star);
  }
});

// .next/server/edge/chunks/[root-of-the-server]__09ade3a5._.js
var require_root_of_the_server_09ade3a5 = __commonJS({
  ".next/server/edge/chunks/[root-of-the-server]__09ade3a5._.js"() {
    "use strict";
    (globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__09ade3a5._.js", 951615, (e, t, r) => {
      t.exports = e.x("node:buffer", () => (init_node_buffer(), __toCommonJS(node_buffer_exports)));
    }, 406124, (e) => {
      "use strict";
      e.s(["default", () => t]);
      let t = Promise.resolve().then(() => e.i(362781));
    }, 280938, (e) => {
      e.v("chunks/node_modules__prisma_client_query_engine_bg_23ace1ce.wasm");
    }, 362781, (e) => e.a(async (t, r) => {
      try {
        e.s(["default", () => t2]);
        var a = e.i(280938);
        let t2 = await e.u(a.default, () => wasm_2f49a330183a3ca1);
        r();
      } catch (e2) {
        r(e2);
      }
    }, true), 888912, (e, t, r) => {
      self._ENTRIES ||= {};
      let a = Promise.resolve().then(() => e.i(558217));
      a.catch(() => {
      }), self._ENTRIES.middleware_middleware = new Proxy(a, { get(e2, t2) {
        if ("then" === t2) return (t3, r3) => e2.then(t3, r3);
        let r2 = (...r3) => e2.then((e3) => (0, e3[t2])(...r3));
        return r2.then = (r3, a2) => e2.then((e3) => e3[t2]).then(r3, a2), r2;
      } });
    }]);
  }
});

// node-built-in-modules:node:async_hooks
var node_async_hooks_exports = {};
import * as node_async_hooks_star from "node:async_hooks";
var init_node_async_hooks = __esm({
  "node-built-in-modules:node:async_hooks"() {
    __reExport(node_async_hooks_exports, node_async_hooks_star);
  }
});

// .next/server/edge/chunks/[root-of-the-server]__73965b5f._.js
var require_root_of_the_server_73965b5f = __commonJS({
  ".next/server/edge/chunks/[root-of-the-server]__73965b5f._.js"() {
    "use strict";
    (globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__73965b5f._.js", 828042, (e, t, r) => {
      "use strict";
      var n = Object.defineProperty, i = Object.getOwnPropertyDescriptor, a = Object.getOwnPropertyNames, s = Object.prototype.hasOwnProperty, o = {};
      function l(e2) {
        var t2;
        let r2 = ["path" in e2 && e2.path && `Path=${e2.path}`, "expires" in e2 && (e2.expires || 0 === e2.expires) && `Expires=${("number" == typeof e2.expires ? new Date(e2.expires) : e2.expires).toUTCString()}`, "maxAge" in e2 && "number" == typeof e2.maxAge && `Max-Age=${e2.maxAge}`, "domain" in e2 && e2.domain && `Domain=${e2.domain}`, "secure" in e2 && e2.secure && "Secure", "httpOnly" in e2 && e2.httpOnly && "HttpOnly", "sameSite" in e2 && e2.sameSite && `SameSite=${e2.sameSite}`, "partitioned" in e2 && e2.partitioned && "Partitioned", "priority" in e2 && e2.priority && `Priority=${e2.priority}`].filter(Boolean), n2 = `${e2.name}=${encodeURIComponent(null != (t2 = e2.value) ? t2 : "")}`;
        return 0 === r2.length ? n2 : `${n2}; ${r2.join("; ")}`;
      }
      function u(e2) {
        let t2 = /* @__PURE__ */ new Map();
        for (let r2 of e2.split(/; */)) {
          if (!r2) continue;
          let e3 = r2.indexOf("=");
          if (-1 === e3) {
            t2.set(r2, "true");
            continue;
          }
          let [n2, i2] = [r2.slice(0, e3), r2.slice(e3 + 1)];
          try {
            t2.set(n2, decodeURIComponent(null != i2 ? i2 : "true"));
          } catch {
          }
        }
        return t2;
      }
      function c(e2) {
        if (!e2) return;
        let [[t2, r2], ...n2] = u(e2), { domain: i2, expires: a2, httponly: s2, maxage: o2, path: l2, samesite: c2, secure: h2, partitioned: f2, priority: g } = Object.fromEntries(n2.map(([e3, t3]) => [e3.toLowerCase().replace(/-/g, ""), t3]));
        {
          var m, y, b = { name: t2, value: decodeURIComponent(r2), domain: i2, ...a2 && { expires: new Date(a2) }, ...s2 && { httpOnly: true }, ..."string" == typeof o2 && { maxAge: Number(o2) }, path: l2, ...c2 && { sameSite: d.includes(m = (m = c2).toLowerCase()) ? m : void 0 }, ...h2 && { secure: true }, ...g && { priority: p.includes(y = (y = g).toLowerCase()) ? y : void 0 }, ...f2 && { partitioned: true } };
          let e3 = {};
          for (let t3 in b) b[t3] && (e3[t3] = b[t3]);
          return e3;
        }
      }
      ((e2, t2) => {
        for (var r2 in t2) n(e2, r2, { get: t2[r2], enumerable: true });
      })(o, { RequestCookies: () => h, ResponseCookies: () => f, parseCookie: () => u, parseSetCookie: () => c, stringifyCookie: () => l }), t.exports = ((e2, t2, r2, o2) => {
        if (t2 && "object" == typeof t2 || "function" == typeof t2) for (let l2 of a(t2)) s.call(e2, l2) || l2 === r2 || n(e2, l2, { get: () => t2[l2], enumerable: !(o2 = i(t2, l2)) || o2.enumerable });
        return e2;
      })(n({}, "__esModule", { value: true }), o);
      var d = ["strict", "lax", "none"], p = ["low", "medium", "high"], h = class {
        constructor(e2) {
          this._parsed = /* @__PURE__ */ new Map(), this._headers = e2;
          let t2 = e2.get("cookie");
          if (t2) for (let [e3, r2] of u(t2)) this._parsed.set(e3, { name: e3, value: r2 });
        }
        [Symbol.iterator]() {
          return this._parsed[Symbol.iterator]();
        }
        get size() {
          return this._parsed.size;
        }
        get(...e2) {
          let t2 = "string" == typeof e2[0] ? e2[0] : e2[0].name;
          return this._parsed.get(t2);
        }
        getAll(...e2) {
          var t2;
          let r2 = Array.from(this._parsed);
          if (!e2.length) return r2.map(([e3, t3]) => t3);
          let n2 = "string" == typeof e2[0] ? e2[0] : null == (t2 = e2[0]) ? void 0 : t2.name;
          return r2.filter(([e3]) => e3 === n2).map(([e3, t3]) => t3);
        }
        has(e2) {
          return this._parsed.has(e2);
        }
        set(...e2) {
          let [t2, r2] = 1 === e2.length ? [e2[0].name, e2[0].value] : e2, n2 = this._parsed;
          return n2.set(t2, { name: t2, value: r2 }), this._headers.set("cookie", Array.from(n2).map(([e3, t3]) => l(t3)).join("; ")), this;
        }
        delete(e2) {
          let t2 = this._parsed, r2 = Array.isArray(e2) ? e2.map((e3) => t2.delete(e3)) : t2.delete(e2);
          return this._headers.set("cookie", Array.from(t2).map(([e3, t3]) => l(t3)).join("; ")), r2;
        }
        clear() {
          return this.delete(Array.from(this._parsed.keys())), this;
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return `RequestCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`;
        }
        toString() {
          return [...this._parsed.values()].map((e2) => `${e2.name}=${encodeURIComponent(e2.value)}`).join("; ");
        }
      }, f = class {
        constructor(e2) {
          var t2, r2, n2;
          this._parsed = /* @__PURE__ */ new Map(), this._headers = e2;
          let i2 = null != (n2 = null != (r2 = null == (t2 = e2.getSetCookie) ? void 0 : t2.call(e2)) ? r2 : e2.get("set-cookie")) ? n2 : [];
          for (let e3 of Array.isArray(i2) ? i2 : function(e4) {
            if (!e4) return [];
            var t3, r3, n3, i3, a2, s2 = [], o2 = 0;
            function l2() {
              for (; o2 < e4.length && /\s/.test(e4.charAt(o2)); ) o2 += 1;
              return o2 < e4.length;
            }
            for (; o2 < e4.length; ) {
              for (t3 = o2, a2 = false; l2(); ) if ("," === (r3 = e4.charAt(o2))) {
                for (n3 = o2, o2 += 1, l2(), i3 = o2; o2 < e4.length && "=" !== (r3 = e4.charAt(o2)) && ";" !== r3 && "," !== r3; ) o2 += 1;
                o2 < e4.length && "=" === e4.charAt(o2) ? (a2 = true, o2 = i3, s2.push(e4.substring(t3, n3)), t3 = o2) : o2 = n3 + 1;
              } else o2 += 1;
              (!a2 || o2 >= e4.length) && s2.push(e4.substring(t3, e4.length));
            }
            return s2;
          }(i2)) {
            let t3 = c(e3);
            t3 && this._parsed.set(t3.name, t3);
          }
        }
        get(...e2) {
          let t2 = "string" == typeof e2[0] ? e2[0] : e2[0].name;
          return this._parsed.get(t2);
        }
        getAll(...e2) {
          var t2;
          let r2 = Array.from(this._parsed.values());
          if (!e2.length) return r2;
          let n2 = "string" == typeof e2[0] ? e2[0] : null == (t2 = e2[0]) ? void 0 : t2.name;
          return r2.filter((e3) => e3.name === n2);
        }
        has(e2) {
          return this._parsed.has(e2);
        }
        set(...e2) {
          let [t2, r2, n2] = 1 === e2.length ? [e2[0].name, e2[0].value, e2[0]] : e2, i2 = this._parsed;
          return i2.set(t2, function(e3 = { name: "", value: "" }) {
            return "number" == typeof e3.expires && (e3.expires = new Date(e3.expires)), e3.maxAge && (e3.expires = new Date(Date.now() + 1e3 * e3.maxAge)), (null === e3.path || void 0 === e3.path) && (e3.path = "/"), e3;
          }({ name: t2, value: r2, ...n2 })), function(e3, t3) {
            for (let [, r3] of (t3.delete("set-cookie"), e3)) {
              let e4 = l(r3);
              t3.append("set-cookie", e4);
            }
          }(i2, this._headers), this;
        }
        delete(...e2) {
          let [t2, r2] = "string" == typeof e2[0] ? [e2[0]] : [e2[0].name, e2[0]];
          return this.set({ ...r2, name: t2, value: "", expires: /* @__PURE__ */ new Date(0) });
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return `ResponseCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`;
        }
        toString() {
          return [...this._parsed.values()].map(l).join("; ");
        }
      };
    }, 459110, (e, t, r) => {
      (() => {
        "use strict";
        var r2 = { 491: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.ContextAPI = void 0;
          let n2 = r3(223), i2 = r3(172), a2 = r3(930), s = "context", o = new n2.NoopContextManager();
          class l {
            constructor() {
            }
            static getInstance() {
              return this._instance || (this._instance = new l()), this._instance;
            }
            setGlobalContextManager(e3) {
              return (0, i2.registerGlobal)(s, e3, a2.DiagAPI.instance());
            }
            active() {
              return this._getContextManager().active();
            }
            with(e3, t3, r4, ...n3) {
              return this._getContextManager().with(e3, t3, r4, ...n3);
            }
            bind(e3, t3) {
              return this._getContextManager().bind(e3, t3);
            }
            _getContextManager() {
              return (0, i2.getGlobal)(s) || o;
            }
            disable() {
              this._getContextManager().disable(), (0, i2.unregisterGlobal)(s, a2.DiagAPI.instance());
            }
          }
          t2.ContextAPI = l;
        }, 930: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.DiagAPI = void 0;
          let n2 = r3(56), i2 = r3(912), a2 = r3(957), s = r3(172);
          class o {
            constructor() {
              function e3(e4) {
                return function(...t4) {
                  let r4 = (0, s.getGlobal)("diag");
                  if (r4) return r4[e4](...t4);
                };
              }
              let t3 = this;
              t3.setLogger = (e4, r4 = { logLevel: a2.DiagLogLevel.INFO }) => {
                var n3, o2, l;
                if (e4 === t3) {
                  let e5 = Error("Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation");
                  return t3.error(null != (n3 = e5.stack) ? n3 : e5.message), false;
                }
                "number" == typeof r4 && (r4 = { logLevel: r4 });
                let u = (0, s.getGlobal)("diag"), c = (0, i2.createLogLevelDiagLogger)(null != (o2 = r4.logLevel) ? o2 : a2.DiagLogLevel.INFO, e4);
                if (u && !r4.suppressOverrideMessage) {
                  let e5 = null != (l = Error().stack) ? l : "<failed to generate stacktrace>";
                  u.warn(`Current logger will be overwritten from ${e5}`), c.warn(`Current logger will overwrite one already registered from ${e5}`);
                }
                return (0, s.registerGlobal)("diag", c, t3, true);
              }, t3.disable = () => {
                (0, s.unregisterGlobal)("diag", t3);
              }, t3.createComponentLogger = (e4) => new n2.DiagComponentLogger(e4), t3.verbose = e3("verbose"), t3.debug = e3("debug"), t3.info = e3("info"), t3.warn = e3("warn"), t3.error = e3("error");
            }
            static instance() {
              return this._instance || (this._instance = new o()), this._instance;
            }
          }
          t2.DiagAPI = o;
        }, 653: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.MetricsAPI = void 0;
          let n2 = r3(660), i2 = r3(172), a2 = r3(930), s = "metrics";
          class o {
            constructor() {
            }
            static getInstance() {
              return this._instance || (this._instance = new o()), this._instance;
            }
            setGlobalMeterProvider(e3) {
              return (0, i2.registerGlobal)(s, e3, a2.DiagAPI.instance());
            }
            getMeterProvider() {
              return (0, i2.getGlobal)(s) || n2.NOOP_METER_PROVIDER;
            }
            getMeter(e3, t3, r4) {
              return this.getMeterProvider().getMeter(e3, t3, r4);
            }
            disable() {
              (0, i2.unregisterGlobal)(s, a2.DiagAPI.instance());
            }
          }
          t2.MetricsAPI = o;
        }, 181: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.PropagationAPI = void 0;
          let n2 = r3(172), i2 = r3(874), a2 = r3(194), s = r3(277), o = r3(369), l = r3(930), u = "propagation", c = new i2.NoopTextMapPropagator();
          class d {
            constructor() {
              this.createBaggage = o.createBaggage, this.getBaggage = s.getBaggage, this.getActiveBaggage = s.getActiveBaggage, this.setBaggage = s.setBaggage, this.deleteBaggage = s.deleteBaggage;
            }
            static getInstance() {
              return this._instance || (this._instance = new d()), this._instance;
            }
            setGlobalPropagator(e3) {
              return (0, n2.registerGlobal)(u, e3, l.DiagAPI.instance());
            }
            inject(e3, t3, r4 = a2.defaultTextMapSetter) {
              return this._getGlobalPropagator().inject(e3, t3, r4);
            }
            extract(e3, t3, r4 = a2.defaultTextMapGetter) {
              return this._getGlobalPropagator().extract(e3, t3, r4);
            }
            fields() {
              return this._getGlobalPropagator().fields();
            }
            disable() {
              (0, n2.unregisterGlobal)(u, l.DiagAPI.instance());
            }
            _getGlobalPropagator() {
              return (0, n2.getGlobal)(u) || c;
            }
          }
          t2.PropagationAPI = d;
        }, 997: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.TraceAPI = void 0;
          let n2 = r3(172), i2 = r3(846), a2 = r3(139), s = r3(607), o = r3(930), l = "trace";
          class u {
            constructor() {
              this._proxyTracerProvider = new i2.ProxyTracerProvider(), this.wrapSpanContext = a2.wrapSpanContext, this.isSpanContextValid = a2.isSpanContextValid, this.deleteSpan = s.deleteSpan, this.getSpan = s.getSpan, this.getActiveSpan = s.getActiveSpan, this.getSpanContext = s.getSpanContext, this.setSpan = s.setSpan, this.setSpanContext = s.setSpanContext;
            }
            static getInstance() {
              return this._instance || (this._instance = new u()), this._instance;
            }
            setGlobalTracerProvider(e3) {
              let t3 = (0, n2.registerGlobal)(l, this._proxyTracerProvider, o.DiagAPI.instance());
              return t3 && this._proxyTracerProvider.setDelegate(e3), t3;
            }
            getTracerProvider() {
              return (0, n2.getGlobal)(l) || this._proxyTracerProvider;
            }
            getTracer(e3, t3) {
              return this.getTracerProvider().getTracer(e3, t3);
            }
            disable() {
              (0, n2.unregisterGlobal)(l, o.DiagAPI.instance()), this._proxyTracerProvider = new i2.ProxyTracerProvider();
            }
          }
          t2.TraceAPI = u;
        }, 277: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.deleteBaggage = t2.setBaggage = t2.getActiveBaggage = t2.getBaggage = void 0;
          let n2 = r3(491), i2 = (0, r3(780).createContextKey)("OpenTelemetry Baggage Key");
          function a2(e3) {
            return e3.getValue(i2) || void 0;
          }
          t2.getBaggage = a2, t2.getActiveBaggage = function() {
            return a2(n2.ContextAPI.getInstance().active());
          }, t2.setBaggage = function(e3, t3) {
            return e3.setValue(i2, t3);
          }, t2.deleteBaggage = function(e3) {
            return e3.deleteValue(i2);
          };
        }, 993: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.BaggageImpl = void 0;
          class r3 {
            constructor(e3) {
              this._entries = e3 ? new Map(e3) : /* @__PURE__ */ new Map();
            }
            getEntry(e3) {
              let t3 = this._entries.get(e3);
              if (t3) return Object.assign({}, t3);
            }
            getAllEntries() {
              return Array.from(this._entries.entries()).map(([e3, t3]) => [e3, t3]);
            }
            setEntry(e3, t3) {
              let n2 = new r3(this._entries);
              return n2._entries.set(e3, t3), n2;
            }
            removeEntry(e3) {
              let t3 = new r3(this._entries);
              return t3._entries.delete(e3), t3;
            }
            removeEntries(...e3) {
              let t3 = new r3(this._entries);
              for (let r4 of e3) t3._entries.delete(r4);
              return t3;
            }
            clear() {
              return new r3();
            }
          }
          t2.BaggageImpl = r3;
        }, 830: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.baggageEntryMetadataSymbol = void 0, t2.baggageEntryMetadataSymbol = Symbol("BaggageEntryMetadata");
        }, 369: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.baggageEntryMetadataFromString = t2.createBaggage = void 0;
          let n2 = r3(930), i2 = r3(993), a2 = r3(830), s = n2.DiagAPI.instance();
          t2.createBaggage = function(e3 = {}) {
            return new i2.BaggageImpl(new Map(Object.entries(e3)));
          }, t2.baggageEntryMetadataFromString = function(e3) {
            return "string" != typeof e3 && (s.error(`Cannot create baggage metadata from unknown type: ${typeof e3}`), e3 = ""), { __TYPE__: a2.baggageEntryMetadataSymbol, toString: () => e3 };
          };
        }, 67: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.context = void 0, t2.context = r3(491).ContextAPI.getInstance();
        }, 223: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.NoopContextManager = void 0;
          let n2 = r3(780);
          t2.NoopContextManager = class {
            active() {
              return n2.ROOT_CONTEXT;
            }
            with(e3, t3, r4, ...n3) {
              return t3.call(r4, ...n3);
            }
            bind(e3, t3) {
              return t3;
            }
            enable() {
              return this;
            }
            disable() {
              return this;
            }
          };
        }, 780: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.ROOT_CONTEXT = t2.createContextKey = void 0, t2.createContextKey = function(e3) {
            return Symbol.for(e3);
          };
          class r3 {
            constructor(e3) {
              let t3 = this;
              t3._currentContext = e3 ? new Map(e3) : /* @__PURE__ */ new Map(), t3.getValue = (e4) => t3._currentContext.get(e4), t3.setValue = (e4, n2) => {
                let i2 = new r3(t3._currentContext);
                return i2._currentContext.set(e4, n2), i2;
              }, t3.deleteValue = (e4) => {
                let n2 = new r3(t3._currentContext);
                return n2._currentContext.delete(e4), n2;
              };
            }
          }
          t2.ROOT_CONTEXT = new r3();
        }, 506: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.diag = void 0, t2.diag = r3(930).DiagAPI.instance();
        }, 56: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.DiagComponentLogger = void 0;
          let n2 = r3(172);
          function i2(e3, t3, r4) {
            let i3 = (0, n2.getGlobal)("diag");
            if (i3) return r4.unshift(t3), i3[e3](...r4);
          }
          t2.DiagComponentLogger = class {
            constructor(e3) {
              this._namespace = e3.namespace || "DiagComponentLogger";
            }
            debug(...e3) {
              return i2("debug", this._namespace, e3);
            }
            error(...e3) {
              return i2("error", this._namespace, e3);
            }
            info(...e3) {
              return i2("info", this._namespace, e3);
            }
            warn(...e3) {
              return i2("warn", this._namespace, e3);
            }
            verbose(...e3) {
              return i2("verbose", this._namespace, e3);
            }
          };
        }, 972: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.DiagConsoleLogger = void 0;
          let r3 = [{ n: "error", c: "error" }, { n: "warn", c: "warn" }, { n: "info", c: "info" }, { n: "debug", c: "debug" }, { n: "verbose", c: "trace" }];
          t2.DiagConsoleLogger = class {
            constructor() {
              for (let e3 = 0; e3 < r3.length; e3++) this[r3[e3].n] = /* @__PURE__ */ function(e4) {
                return function(...t3) {
                  if (console) {
                    let r4 = console[e4];
                    if ("function" != typeof r4 && (r4 = console.log), "function" == typeof r4) return r4.apply(console, t3);
                  }
                };
              }(r3[e3].c);
            }
          };
        }, 912: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.createLogLevelDiagLogger = void 0;
          let n2 = r3(957);
          t2.createLogLevelDiagLogger = function(e3, t3) {
            function r4(r5, n3) {
              let i2 = t3[r5];
              return "function" == typeof i2 && e3 >= n3 ? i2.bind(t3) : function() {
              };
            }
            return e3 < n2.DiagLogLevel.NONE ? e3 = n2.DiagLogLevel.NONE : e3 > n2.DiagLogLevel.ALL && (e3 = n2.DiagLogLevel.ALL), t3 = t3 || {}, { error: r4("error", n2.DiagLogLevel.ERROR), warn: r4("warn", n2.DiagLogLevel.WARN), info: r4("info", n2.DiagLogLevel.INFO), debug: r4("debug", n2.DiagLogLevel.DEBUG), verbose: r4("verbose", n2.DiagLogLevel.VERBOSE) };
          };
        }, 957: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.DiagLogLevel = void 0, function(e3) {
            e3[e3.NONE = 0] = "NONE", e3[e3.ERROR = 30] = "ERROR", e3[e3.WARN = 50] = "WARN", e3[e3.INFO = 60] = "INFO", e3[e3.DEBUG = 70] = "DEBUG", e3[e3.VERBOSE = 80] = "VERBOSE", e3[e3.ALL = 9999] = "ALL";
          }(t2.DiagLogLevel || (t2.DiagLogLevel = {}));
        }, 172: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.unregisterGlobal = t2.getGlobal = t2.registerGlobal = void 0;
          let n2 = r3(200), i2 = r3(521), a2 = r3(130), s = i2.VERSION.split(".")[0], o = Symbol.for(`opentelemetry.js.api.${s}`), l = n2._globalThis;
          t2.registerGlobal = function(e3, t3, r4, n3 = false) {
            var a3;
            let s2 = l[o] = null != (a3 = l[o]) ? a3 : { version: i2.VERSION };
            if (!n3 && s2[e3]) {
              let t4 = Error(`@opentelemetry/api: Attempted duplicate registration of API: ${e3}`);
              return r4.error(t4.stack || t4.message), false;
            }
            if (s2.version !== i2.VERSION) {
              let t4 = Error(`@opentelemetry/api: Registration of version v${s2.version} for ${e3} does not match previously registered API v${i2.VERSION}`);
              return r4.error(t4.stack || t4.message), false;
            }
            return s2[e3] = t3, r4.debug(`@opentelemetry/api: Registered a global for ${e3} v${i2.VERSION}.`), true;
          }, t2.getGlobal = function(e3) {
            var t3, r4;
            let n3 = null == (t3 = l[o]) ? void 0 : t3.version;
            if (n3 && (0, a2.isCompatible)(n3)) return null == (r4 = l[o]) ? void 0 : r4[e3];
          }, t2.unregisterGlobal = function(e3, t3) {
            t3.debug(`@opentelemetry/api: Unregistering a global for ${e3} v${i2.VERSION}.`);
            let r4 = l[o];
            r4 && delete r4[e3];
          };
        }, 130: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.isCompatible = t2._makeCompatibilityCheck = void 0;
          let n2 = r3(521), i2 = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/;
          function a2(e3) {
            let t3 = /* @__PURE__ */ new Set([e3]), r4 = /* @__PURE__ */ new Set(), n3 = e3.match(i2);
            if (!n3) return () => false;
            let a3 = { major: +n3[1], minor: +n3[2], patch: +n3[3], prerelease: n3[4] };
            if (null != a3.prerelease) return function(t4) {
              return t4 === e3;
            };
            function s(e4) {
              return r4.add(e4), false;
            }
            return function(e4) {
              if (t3.has(e4)) return true;
              if (r4.has(e4)) return false;
              let n4 = e4.match(i2);
              if (!n4) return s(e4);
              let o = { major: +n4[1], minor: +n4[2], patch: +n4[3], prerelease: n4[4] };
              if (null != o.prerelease || a3.major !== o.major) return s(e4);
              if (0 === a3.major) return a3.minor === o.minor && a3.patch <= o.patch ? (t3.add(e4), true) : s(e4);
              return a3.minor <= o.minor ? (t3.add(e4), true) : s(e4);
            };
          }
          t2._makeCompatibilityCheck = a2, t2.isCompatible = a2(n2.VERSION);
        }, 886: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.metrics = void 0, t2.metrics = r3(653).MetricsAPI.getInstance();
        }, 901: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.ValueType = void 0, function(e3) {
            e3[e3.INT = 0] = "INT", e3[e3.DOUBLE = 1] = "DOUBLE";
          }(t2.ValueType || (t2.ValueType = {}));
        }, 102: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.createNoopMeter = t2.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = t2.NOOP_OBSERVABLE_GAUGE_METRIC = t2.NOOP_OBSERVABLE_COUNTER_METRIC = t2.NOOP_UP_DOWN_COUNTER_METRIC = t2.NOOP_HISTOGRAM_METRIC = t2.NOOP_COUNTER_METRIC = t2.NOOP_METER = t2.NoopObservableUpDownCounterMetric = t2.NoopObservableGaugeMetric = t2.NoopObservableCounterMetric = t2.NoopObservableMetric = t2.NoopHistogramMetric = t2.NoopUpDownCounterMetric = t2.NoopCounterMetric = t2.NoopMetric = t2.NoopMeter = void 0;
          class r3 {
            constructor() {
            }
            createHistogram(e3, r4) {
              return t2.NOOP_HISTOGRAM_METRIC;
            }
            createCounter(e3, r4) {
              return t2.NOOP_COUNTER_METRIC;
            }
            createUpDownCounter(e3, r4) {
              return t2.NOOP_UP_DOWN_COUNTER_METRIC;
            }
            createObservableGauge(e3, r4) {
              return t2.NOOP_OBSERVABLE_GAUGE_METRIC;
            }
            createObservableCounter(e3, r4) {
              return t2.NOOP_OBSERVABLE_COUNTER_METRIC;
            }
            createObservableUpDownCounter(e3, r4) {
              return t2.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC;
            }
            addBatchObservableCallback(e3, t3) {
            }
            removeBatchObservableCallback(e3) {
            }
          }
          t2.NoopMeter = r3;
          class n2 {
          }
          t2.NoopMetric = n2;
          class i2 extends n2 {
            add(e3, t3) {
            }
          }
          t2.NoopCounterMetric = i2;
          class a2 extends n2 {
            add(e3, t3) {
            }
          }
          t2.NoopUpDownCounterMetric = a2;
          class s extends n2 {
            record(e3, t3) {
            }
          }
          t2.NoopHistogramMetric = s;
          class o {
            addCallback(e3) {
            }
            removeCallback(e3) {
            }
          }
          t2.NoopObservableMetric = o;
          class l extends o {
          }
          t2.NoopObservableCounterMetric = l;
          class u extends o {
          }
          t2.NoopObservableGaugeMetric = u;
          class c extends o {
          }
          t2.NoopObservableUpDownCounterMetric = c, t2.NOOP_METER = new r3(), t2.NOOP_COUNTER_METRIC = new i2(), t2.NOOP_HISTOGRAM_METRIC = new s(), t2.NOOP_UP_DOWN_COUNTER_METRIC = new a2(), t2.NOOP_OBSERVABLE_COUNTER_METRIC = new l(), t2.NOOP_OBSERVABLE_GAUGE_METRIC = new u(), t2.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = new c(), t2.createNoopMeter = function() {
            return t2.NOOP_METER;
          };
        }, 660: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.NOOP_METER_PROVIDER = t2.NoopMeterProvider = void 0;
          let n2 = r3(102);
          class i2 {
            getMeter(e3, t3, r4) {
              return n2.NOOP_METER;
            }
          }
          t2.NoopMeterProvider = i2, t2.NOOP_METER_PROVIDER = new i2();
        }, 200: function(e2, t2, r3) {
          var n2 = this && this.__createBinding || (Object.create ? function(e3, t3, r4, n3) {
            void 0 === n3 && (n3 = r4), Object.defineProperty(e3, n3, { enumerable: true, get: function() {
              return t3[r4];
            } });
          } : function(e3, t3, r4, n3) {
            void 0 === n3 && (n3 = r4), e3[n3] = t3[r4];
          }), i2 = this && this.__exportStar || function(e3, t3) {
            for (var r4 in e3) "default" === r4 || Object.prototype.hasOwnProperty.call(t3, r4) || n2(t3, e3, r4);
          };
          Object.defineProperty(t2, "__esModule", { value: true }), i2(r3(46), t2);
        }, 651: (t2, r3) => {
          Object.defineProperty(r3, "__esModule", { value: true }), r3._globalThis = void 0, r3._globalThis = "object" == typeof globalThis ? globalThis : e.g;
        }, 46: function(e2, t2, r3) {
          var n2 = this && this.__createBinding || (Object.create ? function(e3, t3, r4, n3) {
            void 0 === n3 && (n3 = r4), Object.defineProperty(e3, n3, { enumerable: true, get: function() {
              return t3[r4];
            } });
          } : function(e3, t3, r4, n3) {
            void 0 === n3 && (n3 = r4), e3[n3] = t3[r4];
          }), i2 = this && this.__exportStar || function(e3, t3) {
            for (var r4 in e3) "default" === r4 || Object.prototype.hasOwnProperty.call(t3, r4) || n2(t3, e3, r4);
          };
          Object.defineProperty(t2, "__esModule", { value: true }), i2(r3(651), t2);
        }, 939: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.propagation = void 0, t2.propagation = r3(181).PropagationAPI.getInstance();
        }, 874: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.NoopTextMapPropagator = void 0, t2.NoopTextMapPropagator = class {
            inject(e3, t3) {
            }
            extract(e3, t3) {
              return e3;
            }
            fields() {
              return [];
            }
          };
        }, 194: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.defaultTextMapSetter = t2.defaultTextMapGetter = void 0, t2.defaultTextMapGetter = { get(e3, t3) {
            if (null != e3) return e3[t3];
          }, keys: (e3) => null == e3 ? [] : Object.keys(e3) }, t2.defaultTextMapSetter = { set(e3, t3, r3) {
            null != e3 && (e3[t3] = r3);
          } };
        }, 845: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.trace = void 0, t2.trace = r3(997).TraceAPI.getInstance();
        }, 403: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.NonRecordingSpan = void 0;
          let n2 = r3(476);
          t2.NonRecordingSpan = class {
            constructor(e3 = n2.INVALID_SPAN_CONTEXT) {
              this._spanContext = e3;
            }
            spanContext() {
              return this._spanContext;
            }
            setAttribute(e3, t3) {
              return this;
            }
            setAttributes(e3) {
              return this;
            }
            addEvent(e3, t3) {
              return this;
            }
            setStatus(e3) {
              return this;
            }
            updateName(e3) {
              return this;
            }
            end(e3) {
            }
            isRecording() {
              return false;
            }
            recordException(e3, t3) {
            }
          };
        }, 614: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.NoopTracer = void 0;
          let n2 = r3(491), i2 = r3(607), a2 = r3(403), s = r3(139), o = n2.ContextAPI.getInstance();
          t2.NoopTracer = class {
            startSpan(e3, t3, r4 = o.active()) {
              var n3;
              if (null == t3 ? void 0 : t3.root) return new a2.NonRecordingSpan();
              let l = r4 && (0, i2.getSpanContext)(r4);
              return "object" == typeof (n3 = l) && "string" == typeof n3.spanId && "string" == typeof n3.traceId && "number" == typeof n3.traceFlags && (0, s.isSpanContextValid)(l) ? new a2.NonRecordingSpan(l) : new a2.NonRecordingSpan();
            }
            startActiveSpan(e3, t3, r4, n3) {
              let a3, s2, l;
              if (arguments.length < 2) return;
              2 == arguments.length ? l = t3 : 3 == arguments.length ? (a3 = t3, l = r4) : (a3 = t3, s2 = r4, l = n3);
              let u = null != s2 ? s2 : o.active(), c = this.startSpan(e3, a3, u), d = (0, i2.setSpan)(u, c);
              return o.with(d, l, void 0, c);
            }
          };
        }, 124: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.NoopTracerProvider = void 0;
          let n2 = r3(614);
          t2.NoopTracerProvider = class {
            getTracer(e3, t3, r4) {
              return new n2.NoopTracer();
            }
          };
        }, 125: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.ProxyTracer = void 0;
          let n2 = new (r3(614)).NoopTracer();
          t2.ProxyTracer = class {
            constructor(e3, t3, r4, n3) {
              this._provider = e3, this.name = t3, this.version = r4, this.options = n3;
            }
            startSpan(e3, t3, r4) {
              return this._getTracer().startSpan(e3, t3, r4);
            }
            startActiveSpan(e3, t3, r4, n3) {
              let i2 = this._getTracer();
              return Reflect.apply(i2.startActiveSpan, i2, arguments);
            }
            _getTracer() {
              if (this._delegate) return this._delegate;
              let e3 = this._provider.getDelegateTracer(this.name, this.version, this.options);
              return e3 ? (this._delegate = e3, this._delegate) : n2;
            }
          };
        }, 846: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.ProxyTracerProvider = void 0;
          let n2 = r3(125), i2 = new (r3(124)).NoopTracerProvider();
          t2.ProxyTracerProvider = class {
            getTracer(e3, t3, r4) {
              var i3;
              return null != (i3 = this.getDelegateTracer(e3, t3, r4)) ? i3 : new n2.ProxyTracer(this, e3, t3, r4);
            }
            getDelegate() {
              var e3;
              return null != (e3 = this._delegate) ? e3 : i2;
            }
            setDelegate(e3) {
              this._delegate = e3;
            }
            getDelegateTracer(e3, t3, r4) {
              var n3;
              return null == (n3 = this._delegate) ? void 0 : n3.getTracer(e3, t3, r4);
            }
          };
        }, 996: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.SamplingDecision = void 0, function(e3) {
            e3[e3.NOT_RECORD = 0] = "NOT_RECORD", e3[e3.RECORD = 1] = "RECORD", e3[e3.RECORD_AND_SAMPLED = 2] = "RECORD_AND_SAMPLED";
          }(t2.SamplingDecision || (t2.SamplingDecision = {}));
        }, 607: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.getSpanContext = t2.setSpanContext = t2.deleteSpan = t2.setSpan = t2.getActiveSpan = t2.getSpan = void 0;
          let n2 = r3(780), i2 = r3(403), a2 = r3(491), s = (0, n2.createContextKey)("OpenTelemetry Context Key SPAN");
          function o(e3) {
            return e3.getValue(s) || void 0;
          }
          function l(e3, t3) {
            return e3.setValue(s, t3);
          }
          t2.getSpan = o, t2.getActiveSpan = function() {
            return o(a2.ContextAPI.getInstance().active());
          }, t2.setSpan = l, t2.deleteSpan = function(e3) {
            return e3.deleteValue(s);
          }, t2.setSpanContext = function(e3, t3) {
            return l(e3, new i2.NonRecordingSpan(t3));
          }, t2.getSpanContext = function(e3) {
            var t3;
            return null == (t3 = o(e3)) ? void 0 : t3.spanContext();
          };
        }, 325: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.TraceStateImpl = void 0;
          let n2 = r3(564);
          class i2 {
            constructor(e3) {
              this._internalState = /* @__PURE__ */ new Map(), e3 && this._parse(e3);
            }
            set(e3, t3) {
              let r4 = this._clone();
              return r4._internalState.has(e3) && r4._internalState.delete(e3), r4._internalState.set(e3, t3), r4;
            }
            unset(e3) {
              let t3 = this._clone();
              return t3._internalState.delete(e3), t3;
            }
            get(e3) {
              return this._internalState.get(e3);
            }
            serialize() {
              return this._keys().reduce((e3, t3) => (e3.push(t3 + "=" + this.get(t3)), e3), []).join(",");
            }
            _parse(e3) {
              !(e3.length > 512) && (this._internalState = e3.split(",").reverse().reduce((e4, t3) => {
                let r4 = t3.trim(), i3 = r4.indexOf("=");
                if (-1 !== i3) {
                  let a2 = r4.slice(0, i3), s = r4.slice(i3 + 1, t3.length);
                  (0, n2.validateKey)(a2) && (0, n2.validateValue)(s) && e4.set(a2, s);
                }
                return e4;
              }, /* @__PURE__ */ new Map()), this._internalState.size > 32 && (this._internalState = new Map(Array.from(this._internalState.entries()).reverse().slice(0, 32))));
            }
            _keys() {
              return Array.from(this._internalState.keys()).reverse();
            }
            _clone() {
              let e3 = new i2();
              return e3._internalState = new Map(this._internalState), e3;
            }
          }
          t2.TraceStateImpl = i2;
        }, 564: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.validateValue = t2.validateKey = void 0;
          let r3 = "[_0-9a-z-*/]", n2 = `[a-z]${r3}{0,255}`, i2 = `[a-z0-9]${r3}{0,240}@[a-z]${r3}{0,13}`, a2 = RegExp(`^(?:${n2}|${i2})$`), s = /^[ -~]{0,255}[!-~]$/, o = /,|=/;
          t2.validateKey = function(e3) {
            return a2.test(e3);
          }, t2.validateValue = function(e3) {
            return s.test(e3) && !o.test(e3);
          };
        }, 98: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.createTraceState = void 0;
          let n2 = r3(325);
          t2.createTraceState = function(e3) {
            return new n2.TraceStateImpl(e3);
          };
        }, 476: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.INVALID_SPAN_CONTEXT = t2.INVALID_TRACEID = t2.INVALID_SPANID = void 0;
          let n2 = r3(475);
          t2.INVALID_SPANID = "0000000000000000", t2.INVALID_TRACEID = "00000000000000000000000000000000", t2.INVALID_SPAN_CONTEXT = { traceId: t2.INVALID_TRACEID, spanId: t2.INVALID_SPANID, traceFlags: n2.TraceFlags.NONE };
        }, 357: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.SpanKind = void 0, function(e3) {
            e3[e3.INTERNAL = 0] = "INTERNAL", e3[e3.SERVER = 1] = "SERVER", e3[e3.CLIENT = 2] = "CLIENT", e3[e3.PRODUCER = 3] = "PRODUCER", e3[e3.CONSUMER = 4] = "CONSUMER";
          }(t2.SpanKind || (t2.SpanKind = {}));
        }, 139: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.wrapSpanContext = t2.isSpanContextValid = t2.isValidSpanId = t2.isValidTraceId = void 0;
          let n2 = r3(476), i2 = r3(403), a2 = /^([0-9a-f]{32})$/i, s = /^[0-9a-f]{16}$/i;
          function o(e3) {
            return a2.test(e3) && e3 !== n2.INVALID_TRACEID;
          }
          function l(e3) {
            return s.test(e3) && e3 !== n2.INVALID_SPANID;
          }
          t2.isValidTraceId = o, t2.isValidSpanId = l, t2.isSpanContextValid = function(e3) {
            return o(e3.traceId) && l(e3.spanId);
          }, t2.wrapSpanContext = function(e3) {
            return new i2.NonRecordingSpan(e3);
          };
        }, 847: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.SpanStatusCode = void 0, function(e3) {
            e3[e3.UNSET = 0] = "UNSET", e3[e3.OK = 1] = "OK", e3[e3.ERROR = 2] = "ERROR";
          }(t2.SpanStatusCode || (t2.SpanStatusCode = {}));
        }, 475: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.TraceFlags = void 0, function(e3) {
            e3[e3.NONE = 0] = "NONE", e3[e3.SAMPLED = 1] = "SAMPLED";
          }(t2.TraceFlags || (t2.TraceFlags = {}));
        }, 521: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.VERSION = void 0, t2.VERSION = "1.6.0";
        } }, n = {};
        function i(e2) {
          var t2 = n[e2];
          if (void 0 !== t2) return t2.exports;
          var a2 = n[e2] = { exports: {} }, s = true;
          try {
            r2[e2].call(a2.exports, a2, a2.exports, i), s = false;
          } finally {
            s && delete n[e2];
          }
          return a2.exports;
        }
        i.ab = "/ROOT/node_modules/next/dist/compiled/@opentelemetry/api/";
        var a = {};
        (() => {
          Object.defineProperty(a, "__esModule", { value: true }), a.trace = a.propagation = a.metrics = a.diag = a.context = a.INVALID_SPAN_CONTEXT = a.INVALID_TRACEID = a.INVALID_SPANID = a.isValidSpanId = a.isValidTraceId = a.isSpanContextValid = a.createTraceState = a.TraceFlags = a.SpanStatusCode = a.SpanKind = a.SamplingDecision = a.ProxyTracerProvider = a.ProxyTracer = a.defaultTextMapSetter = a.defaultTextMapGetter = a.ValueType = a.createNoopMeter = a.DiagLogLevel = a.DiagConsoleLogger = a.ROOT_CONTEXT = a.createContextKey = a.baggageEntryMetadataFromString = void 0;
          var e2 = i(369);
          Object.defineProperty(a, "baggageEntryMetadataFromString", { enumerable: true, get: function() {
            return e2.baggageEntryMetadataFromString;
          } });
          var t2 = i(780);
          Object.defineProperty(a, "createContextKey", { enumerable: true, get: function() {
            return t2.createContextKey;
          } }), Object.defineProperty(a, "ROOT_CONTEXT", { enumerable: true, get: function() {
            return t2.ROOT_CONTEXT;
          } });
          var r3 = i(972);
          Object.defineProperty(a, "DiagConsoleLogger", { enumerable: true, get: function() {
            return r3.DiagConsoleLogger;
          } });
          var n2 = i(957);
          Object.defineProperty(a, "DiagLogLevel", { enumerable: true, get: function() {
            return n2.DiagLogLevel;
          } });
          var s = i(102);
          Object.defineProperty(a, "createNoopMeter", { enumerable: true, get: function() {
            return s.createNoopMeter;
          } });
          var o = i(901);
          Object.defineProperty(a, "ValueType", { enumerable: true, get: function() {
            return o.ValueType;
          } });
          var l = i(194);
          Object.defineProperty(a, "defaultTextMapGetter", { enumerable: true, get: function() {
            return l.defaultTextMapGetter;
          } }), Object.defineProperty(a, "defaultTextMapSetter", { enumerable: true, get: function() {
            return l.defaultTextMapSetter;
          } });
          var u = i(125);
          Object.defineProperty(a, "ProxyTracer", { enumerable: true, get: function() {
            return u.ProxyTracer;
          } });
          var c = i(846);
          Object.defineProperty(a, "ProxyTracerProvider", { enumerable: true, get: function() {
            return c.ProxyTracerProvider;
          } });
          var d = i(996);
          Object.defineProperty(a, "SamplingDecision", { enumerable: true, get: function() {
            return d.SamplingDecision;
          } });
          var p = i(357);
          Object.defineProperty(a, "SpanKind", { enumerable: true, get: function() {
            return p.SpanKind;
          } });
          var h = i(847);
          Object.defineProperty(a, "SpanStatusCode", { enumerable: true, get: function() {
            return h.SpanStatusCode;
          } });
          var f = i(475);
          Object.defineProperty(a, "TraceFlags", { enumerable: true, get: function() {
            return f.TraceFlags;
          } });
          var g = i(98);
          Object.defineProperty(a, "createTraceState", { enumerable: true, get: function() {
            return g.createTraceState;
          } });
          var m = i(139);
          Object.defineProperty(a, "isSpanContextValid", { enumerable: true, get: function() {
            return m.isSpanContextValid;
          } }), Object.defineProperty(a, "isValidTraceId", { enumerable: true, get: function() {
            return m.isValidTraceId;
          } }), Object.defineProperty(a, "isValidSpanId", { enumerable: true, get: function() {
            return m.isValidSpanId;
          } });
          var y = i(476);
          Object.defineProperty(a, "INVALID_SPANID", { enumerable: true, get: function() {
            return y.INVALID_SPANID;
          } }), Object.defineProperty(a, "INVALID_TRACEID", { enumerable: true, get: function() {
            return y.INVALID_TRACEID;
          } }), Object.defineProperty(a, "INVALID_SPAN_CONTEXT", { enumerable: true, get: function() {
            return y.INVALID_SPAN_CONTEXT;
          } });
          let b = i(67);
          Object.defineProperty(a, "context", { enumerable: true, get: function() {
            return b.context;
          } });
          let w = i(506);
          Object.defineProperty(a, "diag", { enumerable: true, get: function() {
            return w.diag;
          } });
          let v = i(886);
          Object.defineProperty(a, "metrics", { enumerable: true, get: function() {
            return v.metrics;
          } });
          let _ = i(939);
          Object.defineProperty(a, "propagation", { enumerable: true, get: function() {
            return _.propagation;
          } });
          let E = i(845);
          Object.defineProperty(a, "trace", { enumerable: true, get: function() {
            return E.trace;
          } }), a.default = { context: b.context, diag: w.diag, metrics: v.metrics, propagation: _.propagation, trace: E.trace };
        })(), t.exports = a;
      })();
    }, 871498, (e, t, r) => {
      (() => {
        "use strict";
        "undefined" != typeof __nccwpck_require__ && (__nccwpck_require__.ab = "/ROOT/node_modules/next/dist/compiled/cookie/");
        var e2 = {};
        (() => {
          e2.parse = function(e3, r3) {
            if ("string" != typeof e3) throw TypeError("argument str must be a string");
            for (var i2 = {}, a = e3.split(n), s = (r3 || {}).decode || t2, o = 0; o < a.length; o++) {
              var l = a[o], u = l.indexOf("=");
              if (!(u < 0)) {
                var c = l.substr(0, u).trim(), d = l.substr(++u, l.length).trim();
                '"' == d[0] && (d = d.slice(1, -1)), void 0 == i2[c] && (i2[c] = function(e4, t3) {
                  try {
                    return t3(e4);
                  } catch (t4) {
                    return e4;
                  }
                }(d, s));
              }
            }
            return i2;
          }, e2.serialize = function(e3, t3, n2) {
            var a = n2 || {}, s = a.encode || r2;
            if ("function" != typeof s) throw TypeError("option encode is invalid");
            if (!i.test(e3)) throw TypeError("argument name is invalid");
            var o = s(t3);
            if (o && !i.test(o)) throw TypeError("argument val is invalid");
            var l = e3 + "=" + o;
            if (null != a.maxAge) {
              var u = a.maxAge - 0;
              if (isNaN(u) || !isFinite(u)) throw TypeError("option maxAge is invalid");
              l += "; Max-Age=" + Math.floor(u);
            }
            if (a.domain) {
              if (!i.test(a.domain)) throw TypeError("option domain is invalid");
              l += "; Domain=" + a.domain;
            }
            if (a.path) {
              if (!i.test(a.path)) throw TypeError("option path is invalid");
              l += "; Path=" + a.path;
            }
            if (a.expires) {
              if ("function" != typeof a.expires.toUTCString) throw TypeError("option expires is invalid");
              l += "; Expires=" + a.expires.toUTCString();
            }
            if (a.httpOnly && (l += "; HttpOnly"), a.secure && (l += "; Secure"), a.sameSite) switch ("string" == typeof a.sameSite ? a.sameSite.toLowerCase() : a.sameSite) {
              case true:
              case "strict":
                l += "; SameSite=Strict";
                break;
              case "lax":
                l += "; SameSite=Lax";
                break;
              case "none":
                l += "; SameSite=None";
                break;
              default:
                throw TypeError("option sameSite is invalid");
            }
            return l;
          };
          var t2 = decodeURIComponent, r2 = encodeURIComponent, n = /; */, i = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
        })(), t.exports = e2;
      })();
    }, 299734, (e, t, r) => {
      (() => {
        "use strict";
        var e2 = { 993: (e3) => {
          var t2 = Object.prototype.hasOwnProperty, r3 = "~";
          function n2() {
          }
          function i2(e4, t3, r4) {
            this.fn = e4, this.context = t3, this.once = r4 || false;
          }
          function a(e4, t3, n3, a2, s2) {
            if ("function" != typeof n3) throw TypeError("The listener must be a function");
            var o2 = new i2(n3, a2 || e4, s2), l = r3 ? r3 + t3 : t3;
            return e4._events[l] ? e4._events[l].fn ? e4._events[l] = [e4._events[l], o2] : e4._events[l].push(o2) : (e4._events[l] = o2, e4._eventsCount++), e4;
          }
          function s(e4, t3) {
            0 == --e4._eventsCount ? e4._events = new n2() : delete e4._events[t3];
          }
          function o() {
            this._events = new n2(), this._eventsCount = 0;
          }
          Object.create && (n2.prototype = /* @__PURE__ */ Object.create(null), new n2().__proto__ || (r3 = false)), o.prototype.eventNames = function() {
            var e4, n3, i3 = [];
            if (0 === this._eventsCount) return i3;
            for (n3 in e4 = this._events) t2.call(e4, n3) && i3.push(r3 ? n3.slice(1) : n3);
            return Object.getOwnPropertySymbols ? i3.concat(Object.getOwnPropertySymbols(e4)) : i3;
          }, o.prototype.listeners = function(e4) {
            var t3 = r3 ? r3 + e4 : e4, n3 = this._events[t3];
            if (!n3) return [];
            if (n3.fn) return [n3.fn];
            for (var i3 = 0, a2 = n3.length, s2 = Array(a2); i3 < a2; i3++) s2[i3] = n3[i3].fn;
            return s2;
          }, o.prototype.listenerCount = function(e4) {
            var t3 = r3 ? r3 + e4 : e4, n3 = this._events[t3];
            return n3 ? n3.fn ? 1 : n3.length : 0;
          }, o.prototype.emit = function(e4, t3, n3, i3, a2, s2) {
            var o2 = r3 ? r3 + e4 : e4;
            if (!this._events[o2]) return false;
            var l, u, c = this._events[o2], d = arguments.length;
            if (c.fn) {
              switch (c.once && this.removeListener(e4, c.fn, void 0, true), d) {
                case 1:
                  return c.fn.call(c.context), true;
                case 2:
                  return c.fn.call(c.context, t3), true;
                case 3:
                  return c.fn.call(c.context, t3, n3), true;
                case 4:
                  return c.fn.call(c.context, t3, n3, i3), true;
                case 5:
                  return c.fn.call(c.context, t3, n3, i3, a2), true;
                case 6:
                  return c.fn.call(c.context, t3, n3, i3, a2, s2), true;
              }
              for (u = 1, l = Array(d - 1); u < d; u++) l[u - 1] = arguments[u];
              c.fn.apply(c.context, l);
            } else {
              var p, h = c.length;
              for (u = 0; u < h; u++) switch (c[u].once && this.removeListener(e4, c[u].fn, void 0, true), d) {
                case 1:
                  c[u].fn.call(c[u].context);
                  break;
                case 2:
                  c[u].fn.call(c[u].context, t3);
                  break;
                case 3:
                  c[u].fn.call(c[u].context, t3, n3);
                  break;
                case 4:
                  c[u].fn.call(c[u].context, t3, n3, i3);
                  break;
                default:
                  if (!l) for (p = 1, l = Array(d - 1); p < d; p++) l[p - 1] = arguments[p];
                  c[u].fn.apply(c[u].context, l);
              }
            }
            return true;
          }, o.prototype.on = function(e4, t3, r4) {
            return a(this, e4, t3, r4, false);
          }, o.prototype.once = function(e4, t3, r4) {
            return a(this, e4, t3, r4, true);
          }, o.prototype.removeListener = function(e4, t3, n3, i3) {
            var a2 = r3 ? r3 + e4 : e4;
            if (!this._events[a2]) return this;
            if (!t3) return s(this, a2), this;
            var o2 = this._events[a2];
            if (o2.fn) o2.fn !== t3 || i3 && !o2.once || n3 && o2.context !== n3 || s(this, a2);
            else {
              for (var l = 0, u = [], c = o2.length; l < c; l++) (o2[l].fn !== t3 || i3 && !o2[l].once || n3 && o2[l].context !== n3) && u.push(o2[l]);
              u.length ? this._events[a2] = 1 === u.length ? u[0] : u : s(this, a2);
            }
            return this;
          }, o.prototype.removeAllListeners = function(e4) {
            var t3;
            return e4 ? (t3 = r3 ? r3 + e4 : e4, this._events[t3] && s(this, t3)) : (this._events = new n2(), this._eventsCount = 0), this;
          }, o.prototype.off = o.prototype.removeListener, o.prototype.addListener = o.prototype.on, o.prefixed = r3, o.EventEmitter = o, e3.exports = o;
        }, 213: (e3) => {
          e3.exports = (e4, t2) => (t2 = t2 || (() => {
          }), e4.then((e5) => new Promise((e6) => {
            e6(t2());
          }).then(() => e5), (e5) => new Promise((e6) => {
            e6(t2());
          }).then(() => {
            throw e5;
          })));
        }, 574: (e3, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.default = function(e4, t3, r3) {
            let n2 = 0, i2 = e4.length;
            for (; i2 > 0; ) {
              let a = i2 / 2 | 0, s = n2 + a;
              0 >= r3(e4[s], t3) ? (n2 = ++s, i2 -= a + 1) : i2 = a;
            }
            return n2;
          };
        }, 821: (e3, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true });
          let n2 = r3(574);
          t2.default = class {
            constructor() {
              this._queue = [];
            }
            enqueue(e4, t3) {
              let r4 = { priority: (t3 = Object.assign({ priority: 0 }, t3)).priority, run: e4 };
              if (this.size && this._queue[this.size - 1].priority >= t3.priority) return void this._queue.push(r4);
              let i2 = n2.default(this._queue, r4, (e5, t4) => t4.priority - e5.priority);
              this._queue.splice(i2, 0, r4);
            }
            dequeue() {
              let e4 = this._queue.shift();
              return null == e4 ? void 0 : e4.run;
            }
            filter(e4) {
              return this._queue.filter((t3) => t3.priority === e4.priority).map((e5) => e5.run);
            }
            get size() {
              return this._queue.length;
            }
          };
        }, 816: (e3, t2, r3) => {
          let n2 = r3(213);
          class i2 extends Error {
            constructor(e4) {
              super(e4), this.name = "TimeoutError";
            }
          }
          let a = (e4, t3, r4) => new Promise((a2, s) => {
            if ("number" != typeof t3 || t3 < 0) throw TypeError("Expected `milliseconds` to be a positive number");
            if (t3 === 1 / 0) return void a2(e4);
            let o = setTimeout(() => {
              if ("function" == typeof r4) {
                try {
                  a2(r4());
                } catch (e5) {
                  s(e5);
                }
                return;
              }
              let n3 = "string" == typeof r4 ? r4 : `Promise timed out after ${t3} milliseconds`, o2 = r4 instanceof Error ? r4 : new i2(n3);
              "function" == typeof e4.cancel && e4.cancel(), s(o2);
            }, t3);
            n2(e4.then(a2, s), () => {
              clearTimeout(o);
            });
          });
          e3.exports = a, e3.exports.default = a, e3.exports.TimeoutError = i2;
        } }, r2 = {};
        function n(t2) {
          var i2 = r2[t2];
          if (void 0 !== i2) return i2.exports;
          var a = r2[t2] = { exports: {} }, s = true;
          try {
            e2[t2](a, a.exports, n), s = false;
          } finally {
            s && delete r2[t2];
          }
          return a.exports;
        }
        n.ab = "/ROOT/node_modules/next/dist/compiled/p-queue/";
        var i = {};
        (() => {
          Object.defineProperty(i, "__esModule", { value: true });
          let e3 = n(993), t2 = n(816), r3 = n(821), a = () => {
          }, s = new t2.TimeoutError();
          i.default = class extends e3 {
            constructor(e4) {
              var t3, n2, i2, s2;
              if (super(), this._intervalCount = 0, this._intervalEnd = 0, this._pendingCount = 0, this._resolveEmpty = a, this._resolveIdle = a, !("number" == typeof (e4 = Object.assign({ carryoverConcurrencyCount: false, intervalCap: 1 / 0, interval: 0, concurrency: 1 / 0, autoStart: true, queueClass: r3.default }, e4)).intervalCap && e4.intervalCap >= 1)) throw TypeError(`Expected \`intervalCap\` to be a number from 1 and up, got \`${null != (n2 = null == (t3 = e4.intervalCap) ? void 0 : t3.toString()) ? n2 : ""}\` (${typeof e4.intervalCap})`);
              if (void 0 === e4.interval || !(Number.isFinite(e4.interval) && e4.interval >= 0)) throw TypeError(`Expected \`interval\` to be a finite number >= 0, got \`${null != (s2 = null == (i2 = e4.interval) ? void 0 : i2.toString()) ? s2 : ""}\` (${typeof e4.interval})`);
              this._carryoverConcurrencyCount = e4.carryoverConcurrencyCount, this._isIntervalIgnored = e4.intervalCap === 1 / 0 || 0 === e4.interval, this._intervalCap = e4.intervalCap, this._interval = e4.interval, this._queue = new e4.queueClass(), this._queueClass = e4.queueClass, this.concurrency = e4.concurrency, this._timeout = e4.timeout, this._throwOnTimeout = true === e4.throwOnTimeout, this._isPaused = false === e4.autoStart;
            }
            get _doesIntervalAllowAnother() {
              return this._isIntervalIgnored || this._intervalCount < this._intervalCap;
            }
            get _doesConcurrentAllowAnother() {
              return this._pendingCount < this._concurrency;
            }
            _next() {
              this._pendingCount--, this._tryToStartAnother(), this.emit("next");
            }
            _resolvePromises() {
              this._resolveEmpty(), this._resolveEmpty = a, 0 === this._pendingCount && (this._resolveIdle(), this._resolveIdle = a, this.emit("idle"));
            }
            _onResumeInterval() {
              this._onInterval(), this._initializeIntervalIfNeeded(), this._timeoutId = void 0;
            }
            _isIntervalPaused() {
              let e4 = Date.now();
              if (void 0 === this._intervalId) {
                let t3 = this._intervalEnd - e4;
                if (!(t3 < 0)) return void 0 === this._timeoutId && (this._timeoutId = setTimeout(() => {
                  this._onResumeInterval();
                }, t3)), true;
                this._intervalCount = this._carryoverConcurrencyCount ? this._pendingCount : 0;
              }
              return false;
            }
            _tryToStartAnother() {
              if (0 === this._queue.size) return this._intervalId && clearInterval(this._intervalId), this._intervalId = void 0, this._resolvePromises(), false;
              if (!this._isPaused) {
                let e4 = !this._isIntervalPaused();
                if (this._doesIntervalAllowAnother && this._doesConcurrentAllowAnother) {
                  let t3 = this._queue.dequeue();
                  return !!t3 && (this.emit("active"), t3(), e4 && this._initializeIntervalIfNeeded(), true);
                }
              }
              return false;
            }
            _initializeIntervalIfNeeded() {
              this._isIntervalIgnored || void 0 !== this._intervalId || (this._intervalId = setInterval(() => {
                this._onInterval();
              }, this._interval), this._intervalEnd = Date.now() + this._interval);
            }
            _onInterval() {
              0 === this._intervalCount && 0 === this._pendingCount && this._intervalId && (clearInterval(this._intervalId), this._intervalId = void 0), this._intervalCount = this._carryoverConcurrencyCount ? this._pendingCount : 0, this._processQueue();
            }
            _processQueue() {
              for (; this._tryToStartAnother(); ) ;
            }
            get concurrency() {
              return this._concurrency;
            }
            set concurrency(e4) {
              if (!("number" == typeof e4 && e4 >= 1)) throw TypeError(`Expected \`concurrency\` to be a number from 1 and up, got \`${e4}\` (${typeof e4})`);
              this._concurrency = e4, this._processQueue();
            }
            async add(e4, r4 = {}) {
              return new Promise((n2, i2) => {
                let a2 = async () => {
                  this._pendingCount++, this._intervalCount++;
                  try {
                    let a3 = void 0 === this._timeout && void 0 === r4.timeout ? e4() : t2.default(Promise.resolve(e4()), void 0 === r4.timeout ? this._timeout : r4.timeout, () => {
                      (void 0 === r4.throwOnTimeout ? this._throwOnTimeout : r4.throwOnTimeout) && i2(s);
                    });
                    n2(await a3);
                  } catch (e5) {
                    i2(e5);
                  }
                  this._next();
                };
                this._queue.enqueue(a2, r4), this._tryToStartAnother(), this.emit("add");
              });
            }
            async addAll(e4, t3) {
              return Promise.all(e4.map(async (e5) => this.add(e5, t3)));
            }
            start() {
              return this._isPaused && (this._isPaused = false, this._processQueue()), this;
            }
            pause() {
              this._isPaused = true;
            }
            clear() {
              this._queue = new this._queueClass();
            }
            async onEmpty() {
              if (0 !== this._queue.size) return new Promise((e4) => {
                let t3 = this._resolveEmpty;
                this._resolveEmpty = () => {
                  t3(), e4();
                };
              });
            }
            async onIdle() {
              if (0 !== this._pendingCount || 0 !== this._queue.size) return new Promise((e4) => {
                let t3 = this._resolveIdle;
                this._resolveIdle = () => {
                  t3(), e4();
                };
              });
            }
            get size() {
              return this._queue.size;
            }
            sizeBy(e4) {
              return this._queue.filter(e4).length;
            }
            get pending() {
              return this._pendingCount;
            }
            get isPaused() {
              return this._isPaused;
            }
            get timeout() {
              return this._timeout;
            }
            set timeout(e4) {
              this._timeout = e4;
            }
          };
        })(), t.exports = i;
      })();
    }, 478500, (e, t, r) => {
      t.exports = e.x("node:async_hooks", () => (init_node_async_hooks(), __toCommonJS(node_async_hooks_exports)));
    }, 369307, (e, t, r) => {
      "use strict";
      Object.defineProperty(r, "__esModule", { value: true }), !function(e2, t2) {
        for (var r2 in t2) Object.defineProperty(e2, r2, { enumerable: true, get: t2[r2] });
      }(r, { getTestReqInfo: function() {
        return s;
      }, withRequest: function() {
        return a;
      } });
      let n = new (e.r(478500)).AsyncLocalStorage();
      function i(e2, t2) {
        let r2 = t2.header(e2, "next-test-proxy-port");
        if (!r2) return;
        let n2 = t2.url(e2);
        return { url: n2, proxyPort: Number(r2), testData: t2.header(e2, "next-test-data") || "" };
      }
      function a(e2, t2, r2) {
        let a2 = i(e2, t2);
        return a2 ? n.run(a2, r2) : r2();
      }
      function s(e2, t2) {
        let r2 = n.getStore();
        return r2 || (e2 && t2 ? i(e2, t2) : void 0);
      }
    }, 928325, (e, t, r) => {
      "use strict";
      var n = e.i(951615);
      Object.defineProperty(r, "__esModule", { value: true }), !function(e2, t2) {
        for (var r2 in t2) Object.defineProperty(e2, r2, { enumerable: true, get: t2[r2] });
      }(r, { handleFetch: function() {
        return o;
      }, interceptFetch: function() {
        return l;
      }, reader: function() {
        return a;
      } });
      let i = e.r(369307), a = { url: (e2) => e2.url, header: (e2, t2) => e2.headers.get(t2) };
      async function s(e2, t2) {
        let { url: r2, method: i2, headers: a2, body: s2, cache: o2, credentials: l2, integrity: u, mode: c, redirect: d, referrer: p, referrerPolicy: h } = t2;
        return { testData: e2, api: "fetch", request: { url: r2, method: i2, headers: [...Array.from(a2), ["next-test-stack", function() {
          let e3 = (Error().stack ?? "").split("\n");
          for (let t3 = 1; t3 < e3.length; t3++) if (e3[t3].length > 0) {
            e3 = e3.slice(t3);
            break;
          }
          return (e3 = (e3 = (e3 = e3.filter((e4) => !e4.includes("/next/dist/"))).slice(0, 5)).map((e4) => e4.replace("webpack-internal:///(rsc)/", "").trim())).join("    ");
        }()]], body: s2 ? n.Buffer.from(await t2.arrayBuffer()).toString("base64") : null, cache: o2, credentials: l2, integrity: u, mode: c, redirect: d, referrer: p, referrerPolicy: h } };
      }
      async function o(e2, t2) {
        let r2 = (0, i.getTestReqInfo)(t2, a);
        if (!r2) return e2(t2);
        let { testData: o2, proxyPort: l2 } = r2, u = await s(o2, t2), c = await e2(`http://localhost:${l2}`, { method: "POST", body: JSON.stringify(u), next: { internal: true } });
        if (!c.ok) throw Object.defineProperty(Error(`Proxy request failed: ${c.status}`), "__NEXT_ERROR_CODE", { value: "E146", enumerable: false, configurable: true });
        let d = await c.json(), { api: p } = d;
        switch (p) {
          case "continue":
            return e2(t2);
          case "abort":
          case "unhandled":
            throw Object.defineProperty(Error(`Proxy request aborted [${t2.method} ${t2.url}]`), "__NEXT_ERROR_CODE", { value: "E145", enumerable: false, configurable: true });
          case "fetch":
            let { status: h, headers: f, body: g } = d.response;
            return new Response(g ? n.Buffer.from(g, "base64") : null, { status: h, headers: new Headers(f) });
          default:
            return p;
        }
      }
      function l(t2) {
        return e.g.fetch = function(e2, r2) {
          var n2;
          return (null == r2 || null == (n2 = r2.next) ? void 0 : n2.internal) ? t2(e2, r2) : o(t2, new Request(e2, r2));
        }, () => {
          e.g.fetch = t2;
        };
      }
    }, 494165, (e, t, r) => {
      "use strict";
      Object.defineProperty(r, "__esModule", { value: true }), !function(e2, t2) {
        for (var r2 in t2) Object.defineProperty(e2, r2, { enumerable: true, get: t2[r2] });
      }(r, { interceptTestApis: function() {
        return a;
      }, wrapRequestHandler: function() {
        return s;
      } });
      let n = e.r(369307), i = e.r(928325);
      function a() {
        return (0, i.interceptFetch)(e.g.fetch);
      }
      function s(e2) {
        return (t2, r2) => (0, n.withRequest)(t2, i.reader, () => e2(t2, r2));
      }
    }, 164445, (e, t, r) => {
      (() => {
        var r2 = { 226: function(t2, r3) {
          !function(n2, i2) {
            "use strict";
            var a = "function", s = "undefined", o = "object", l = "string", u = "major", c = "model", d = "name", p = "type", h = "vendor", f = "version", g = "architecture", m = "console", y = "mobile", b = "tablet", w = "smarttv", v = "wearable", _ = "embedded", E = "Amazon", S = "Apple", P = "ASUS", x = "BlackBerry", A = "Browser", T = "Chrome", O = "Firefox", R = "Google", C = "Huawei", k = "Microsoft", N = "Motorola", I = "Opera", D = "Samsung", M = "Sharp", j = "Sony", $ = "Xiaomi", L = "Zebra", q = "Facebook", U = "Chromium OS", V = "Mac OS", F = function(e2, t3) {
              var r4 = {};
              for (var n3 in e2) t3[n3] && t3[n3].length % 2 == 0 ? r4[n3] = t3[n3].concat(e2[n3]) : r4[n3] = e2[n3];
              return r4;
            }, B = function(e2) {
              for (var t3 = {}, r4 = 0; r4 < e2.length; r4++) t3[e2[r4].toUpperCase()] = e2[r4];
              return t3;
            }, W = function(e2, t3) {
              return typeof e2 === l && -1 !== H(t3).indexOf(H(e2));
            }, H = function(e2) {
              return e2.toLowerCase();
            }, K = function(e2, t3) {
              if (typeof e2 === l) return e2 = e2.replace(/^\s\s*/, ""), typeof t3 === s ? e2 : e2.substring(0, 350);
            }, J = function(e2, t3) {
              for (var r4, n3, s2, l2, u2, c2, d2 = 0; d2 < t3.length && !u2; ) {
                var p2 = t3[d2], h2 = t3[d2 + 1];
                for (r4 = n3 = 0; r4 < p2.length && !u2 && p2[r4]; ) if (u2 = p2[r4++].exec(e2)) for (s2 = 0; s2 < h2.length; s2++) c2 = u2[++n3], typeof (l2 = h2[s2]) === o && l2.length > 0 ? 2 === l2.length ? typeof l2[1] == a ? this[l2[0]] = l2[1].call(this, c2) : this[l2[0]] = l2[1] : 3 === l2.length ? typeof l2[1] !== a || l2[1].exec && l2[1].test ? this[l2[0]] = c2 ? c2.replace(l2[1], l2[2]) : void 0 : this[l2[0]] = c2 ? l2[1].call(this, c2, l2[2]) : void 0 : 4 === l2.length && (this[l2[0]] = c2 ? l2[3].call(this, c2.replace(l2[1], l2[2])) : i2) : this[l2] = c2 || i2;
                d2 += 2;
              }
            }, G = function(e2, t3) {
              for (var r4 in t3) if (typeof t3[r4] === o && t3[r4].length > 0) {
                for (var n3 = 0; n3 < t3[r4].length; n3++) if (W(t3[r4][n3], e2)) return "?" === r4 ? i2 : r4;
              } else if (W(t3[r4], e2)) return "?" === r4 ? i2 : r4;
              return e2;
            }, z = { ME: "4.90", "NT 3.11": "NT3.51", "NT 4.0": "NT4.0", 2e3: "NT 5.0", XP: ["NT 5.1", "NT 5.2"], Vista: "NT 6.0", 7: "NT 6.1", 8: "NT 6.2", 8.1: "NT 6.3", 10: ["NT 6.4", "NT 10.0"], RT: "ARM" }, Q = { browser: [[/\b(?:crmo|crios)\/([\w\.]+)/i], [f, [d, "Chrome"]], [/edg(?:e|ios|a)?\/([\w\.]+)/i], [f, [d, "Edge"]], [/(opera mini)\/([-\w\.]+)/i, /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i, /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i], [d, f], [/opios[\/ ]+([\w\.]+)/i], [f, [d, I + " Mini"]], [/\bopr\/([\w\.]+)/i], [f, [d, I]], [/(kindle)\/([\w\.]+)/i, /(lunascape|maxthon|netfront|jasmine|blazer)[\/ ]?([\w\.]*)/i, /(avant |iemobile|slim)(?:browser)?[\/ ]?([\w\.]*)/i, /(ba?idubrowser)[\/ ]?([\w\.]+)/i, /(?:ms|\()(ie) ([\w\.]+)/i, /(flock|rockmelt|midori|epiphany|silk|skyfire|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon|rekonq|puffin|brave|whale(?!.+naver)|qqbrowserlite|qq|duckduckgo)\/([-\w\.]+)/i, /(heytap|ovi)browser\/([\d\.]+)/i, /(weibo)__([\d\.]+)/i], [d, f], [/(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i], [f, [d, "UC" + A]], [/microm.+\bqbcore\/([\w\.]+)/i, /\bqbcore\/([\w\.]+).+microm/i], [f, [d, "WeChat(Win) Desktop"]], [/micromessenger\/([\w\.]+)/i], [f, [d, "WeChat"]], [/konqueror\/([\w\.]+)/i], [f, [d, "Konqueror"]], [/trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i], [f, [d, "IE"]], [/ya(?:search)?browser\/([\w\.]+)/i], [f, [d, "Yandex"]], [/(avast|avg)\/([\w\.]+)/i], [[d, /(.+)/, "$1 Secure " + A], f], [/\bfocus\/([\w\.]+)/i], [f, [d, O + " Focus"]], [/\bopt\/([\w\.]+)/i], [f, [d, I + " Touch"]], [/coc_coc\w+\/([\w\.]+)/i], [f, [d, "Coc Coc"]], [/dolfin\/([\w\.]+)/i], [f, [d, "Dolphin"]], [/coast\/([\w\.]+)/i], [f, [d, I + " Coast"]], [/miuibrowser\/([\w\.]+)/i], [f, [d, "MIUI " + A]], [/fxios\/([-\w\.]+)/i], [f, [d, O]], [/\bqihu|(qi?ho?o?|360)browser/i], [[d, "360 " + A]], [/(oculus|samsung|sailfish|huawei)browser\/([\w\.]+)/i], [[d, /(.+)/, "$1 " + A], f], [/(comodo_dragon)\/([\w\.]+)/i], [[d, /_/g, " "], f], [/(electron)\/([\w\.]+) safari/i, /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i, /m?(qqbrowser|baiduboxapp|2345Explorer)[\/ ]?([\w\.]+)/i], [d, f], [/(metasr)[\/ ]?([\w\.]+)/i, /(lbbrowser)/i, /\[(linkedin)app\]/i], [d], [/((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i], [[d, q], f], [/(kakao(?:talk|story))[\/ ]([\w\.]+)/i, /(naver)\(.*?(\d+\.[\w\.]+).*\)/i, /safari (line)\/([\w\.]+)/i, /\b(line)\/([\w\.]+)\/iab/i, /(chromium|instagram)[\/ ]([-\w\.]+)/i], [d, f], [/\bgsa\/([\w\.]+) .*safari\//i], [f, [d, "GSA"]], [/musical_ly(?:.+app_?version\/|_)([\w\.]+)/i], [f, [d, "TikTok"]], [/headlesschrome(?:\/([\w\.]+)| )/i], [f, [d, T + " Headless"]], [/ wv\).+(chrome)\/([\w\.]+)/i], [[d, T + " WebView"], f], [/droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i], [f, [d, "Android " + A]], [/(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i], [d, f], [/version\/([\w\.\,]+) .*mobile\/\w+ (safari)/i], [f, [d, "Mobile Safari"]], [/version\/([\w(\.|\,)]+) .*(mobile ?safari|safari)/i], [f, d], [/webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i], [d, [f, G, { "1.0": "/8", 1.2: "/1", 1.3: "/3", "2.0": "/412", "2.0.2": "/416", "2.0.3": "/417", "2.0.4": "/419", "?": "/" }]], [/(webkit|khtml)\/([\w\.]+)/i], [d, f], [/(navigator|netscape\d?)\/([-\w\.]+)/i], [[d, "Netscape"], f], [/mobile vr; rv:([\w\.]+)\).+firefox/i], [f, [d, O + " Reality"]], [/ekiohf.+(flow)\/([\w\.]+)/i, /(swiftfox)/i, /(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror|klar)[\/ ]?([\w\.\+]+)/i, /(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i, /(firefox)\/([\w\.]+)/i, /(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i, /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir|obigo|mosaic|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i, /(links) \(([\w\.]+)/i, /panasonic;(viera)/i], [d, f], [/(cobalt)\/([\w\.]+)/i], [d, [f, /master.|lts./, ""]]], cpu: [[/(?:(amd|x(?:(?:86|64)[-_])?|wow|win)64)[;\)]/i], [[g, "amd64"]], [/(ia32(?=;))/i], [[g, H]], [/((?:i[346]|x)86)[;\)]/i], [[g, "ia32"]], [/\b(aarch64|arm(v?8e?l?|_?64))\b/i], [[g, "arm64"]], [/\b(arm(?:v[67])?ht?n?[fl]p?)\b/i], [[g, "armhf"]], [/windows (ce|mobile); ppc;/i], [[g, "arm"]], [/((?:ppc|powerpc)(?:64)?)(?: mac|;|\))/i], [[g, /ower/, "", H]], [/(sun4\w)[;\)]/i], [[g, "sparc"]], [/((?:avr32|ia64(?=;))|68k(?=\))|\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i], [[g, H]]], device: [[/\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i], [c, [h, D], [p, b]], [/\b((?:s[cgp]h|gt|sm)-\w+|sc[g-]?[\d]+a?|galaxy nexus)/i, /samsung[- ]([-\w]+)/i, /sec-(sgh\w+)/i], [c, [h, D], [p, y]], [/(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i], [c, [h, S], [p, y]], [/\((ipad);[-\w\),; ]+apple/i, /applecoremedia\/[\w\.]+ \((ipad)/i, /\b(ipad)\d\d?,\d\d?[;\]].+ios/i], [c, [h, S], [p, b]], [/(macintosh);/i], [c, [h, S]], [/\b(sh-?[altvz]?\d\d[a-ekm]?)/i], [c, [h, M], [p, y]], [/\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i], [c, [h, C], [p, b]], [/(?:huawei|honor)([-\w ]+)[;\)]/i, /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i], [c, [h, C], [p, y]], [/\b(poco[\w ]+)(?: bui|\))/i, /\b; (\w+) build\/hm\1/i, /\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i, /\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i, /\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite)?)(?: bui|\))/i], [[c, /_/g, " "], [h, $], [p, y]], [/\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i], [[c, /_/g, " "], [h, $], [p, b]], [/; (\w+) bui.+ oppo/i, /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i], [c, [h, "OPPO"], [p, y]], [/vivo (\w+)(?: bui|\))/i, /\b(v[12]\d{3}\w?[at])(?: bui|;)/i], [c, [h, "Vivo"], [p, y]], [/\b(rmx[12]\d{3})(?: bui|;|\))/i], [c, [h, "Realme"], [p, y]], [/\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i, /\bmot(?:orola)?[- ](\w*)/i, /((?:moto[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i], [c, [h, N], [p, y]], [/\b(mz60\d|xoom[2 ]{0,2}) build\//i], [c, [h, N], [p, b]], [/((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i], [c, [h, "LG"], [p, b]], [/(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i, /\blg[-e;\/ ]+((?!browser|netcast|android tv)\w+)/i, /\blg-?([\d\w]+) bui/i], [c, [h, "LG"], [p, y]], [/(ideatab[-\w ]+)/i, /lenovo ?(s[56]000[-\w]+|tab(?:[\w ]+)|yt[-\d\w]{6}|tb[-\d\w]{6})/i], [c, [h, "Lenovo"], [p, b]], [/(?:maemo|nokia).*(n900|lumia \d+)/i, /nokia[-_ ]?([-\w\.]*)/i], [[c, /_/g, " "], [h, "Nokia"], [p, y]], [/(pixel c)\b/i], [c, [h, R], [p, b]], [/droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i], [c, [h, R], [p, y]], [/droid.+ (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i], [c, [h, j], [p, y]], [/sony tablet [ps]/i, /\b(?:sony)?sgp\w+(?: bui|\))/i], [[c, "Xperia Tablet"], [h, j], [p, b]], [/ (kb2005|in20[12]5|be20[12][59])\b/i, /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i], [c, [h, "OnePlus"], [p, y]], [/(alexa)webm/i, /(kf[a-z]{2}wi|aeo[c-r]{2})( bui|\))/i, /(kf[a-z]+)( bui|\)).+silk\//i], [c, [h, E], [p, b]], [/((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i], [[c, /(.+)/g, "Fire Phone $1"], [h, E], [p, y]], [/(playbook);[-\w\),; ]+(rim)/i], [c, h, [p, b]], [/\b((?:bb[a-f]|st[hv])100-\d)/i, /\(bb10; (\w+)/i], [c, [h, x], [p, y]], [/(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i], [c, [h, P], [p, b]], [/ (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i], [c, [h, P], [p, y]], [/(nexus 9)/i], [c, [h, "HTC"], [p, b]], [/(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i, /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i, /(alcatel|geeksphone|nexian|panasonic(?!(?:;|\.))|sony(?!-bra))[-_ ]?([-\w]*)/i], [h, [c, /_/g, " "], [p, y]], [/droid.+; ([ab][1-7]-?[0178a]\d\d?)/i], [c, [h, "Acer"], [p, b]], [/droid.+; (m[1-5] note) bui/i, /\bmz-([-\w]{2,})/i], [c, [h, "Meizu"], [p, y]], [/(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[-_ ]?([-\w]*)/i, /(hp) ([\w ]+\w)/i, /(asus)-?(\w+)/i, /(microsoft); (lumia[\w ]+)/i, /(lenovo)[-_ ]?([-\w]+)/i, /(jolla)/i, /(oppo) ?([\w ]+) bui/i], [h, c, [p, y]], [/(kobo)\s(ereader|touch)/i, /(archos) (gamepad2?)/i, /(hp).+(touchpad(?!.+tablet)|tablet)/i, /(kindle)\/([\w\.]+)/i, /(nook)[\w ]+build\/(\w+)/i, /(dell) (strea[kpr\d ]*[\dko])/i, /(le[- ]+pan)[- ]+(\w{1,9}) bui/i, /(trinity)[- ]*(t\d{3}) bui/i, /(gigaset)[- ]+(q\w{1,9}) bui/i, /(vodafone) ([\w ]+)(?:\)| bui)/i], [h, c, [p, b]], [/(surface duo)/i], [c, [h, k], [p, b]], [/droid [\d\.]+; (fp\du?)(?: b|\))/i], [c, [h, "Fairphone"], [p, y]], [/(u304aa)/i], [c, [h, "AT&T"], [p, y]], [/\bsie-(\w*)/i], [c, [h, "Siemens"], [p, y]], [/\b(rct\w+) b/i], [c, [h, "RCA"], [p, b]], [/\b(venue[\d ]{2,7}) b/i], [c, [h, "Dell"], [p, b]], [/\b(q(?:mv|ta)\w+) b/i], [c, [h, "Verizon"], [p, b]], [/\b(?:barnes[& ]+noble |bn[rt])([\w\+ ]*) b/i], [c, [h, "Barnes & Noble"], [p, b]], [/\b(tm\d{3}\w+) b/i], [c, [h, "NuVision"], [p, b]], [/\b(k88) b/i], [c, [h, "ZTE"], [p, b]], [/\b(nx\d{3}j) b/i], [c, [h, "ZTE"], [p, y]], [/\b(gen\d{3}) b.+49h/i], [c, [h, "Swiss"], [p, y]], [/\b(zur\d{3}) b/i], [c, [h, "Swiss"], [p, b]], [/\b((zeki)?tb.*\b) b/i], [c, [h, "Zeki"], [p, b]], [/\b([yr]\d{2}) b/i, /\b(dragon[- ]+touch |dt)(\w{5}) b/i], [[h, "Dragon Touch"], c, [p, b]], [/\b(ns-?\w{0,9}) b/i], [c, [h, "Insignia"], [p, b]], [/\b((nxa|next)-?\w{0,9}) b/i], [c, [h, "NextBook"], [p, b]], [/\b(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i], [[h, "Voice"], c, [p, y]], [/\b(lvtel\-)?(v1[12]) b/i], [[h, "LvTel"], c, [p, y]], [/\b(ph-1) /i], [c, [h, "Essential"], [p, y]], [/\b(v(100md|700na|7011|917g).*\b) b/i], [c, [h, "Envizen"], [p, b]], [/\b(trio[-\w\. ]+) b/i], [c, [h, "MachSpeed"], [p, b]], [/\btu_(1491) b/i], [c, [h, "Rotor"], [p, b]], [/(shield[\w ]+) b/i], [c, [h, "Nvidia"], [p, b]], [/(sprint) (\w+)/i], [h, c, [p, y]], [/(kin\.[onetw]{3})/i], [[c, /\./g, " "], [h, k], [p, y]], [/droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i], [c, [h, L], [p, b]], [/droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i], [c, [h, L], [p, y]], [/smart-tv.+(samsung)/i], [h, [p, w]], [/hbbtv.+maple;(\d+)/i], [[c, /^/, "SmartTV"], [h, D], [p, w]], [/(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i], [[h, "LG"], [p, w]], [/(apple) ?tv/i], [h, [c, S + " TV"], [p, w]], [/crkey/i], [[c, T + "cast"], [h, R], [p, w]], [/droid.+aft(\w)( bui|\))/i], [c, [h, E], [p, w]], [/\(dtv[\);].+(aquos)/i, /(aquos-tv[\w ]+)\)/i], [c, [h, M], [p, w]], [/(bravia[\w ]+)( bui|\))/i], [c, [h, j], [p, w]], [/(mitv-\w{5}) bui/i], [c, [h, $], [p, w]], [/Hbbtv.*(technisat) (.*);/i], [h, c, [p, w]], [/\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i, /hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i], [[h, K], [c, K], [p, w]], [/\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i], [[p, w]], [/(ouya)/i, /(nintendo) ([wids3utch]+)/i], [h, c, [p, m]], [/droid.+; (shield) bui/i], [c, [h, "Nvidia"], [p, m]], [/(playstation [345portablevi]+)/i], [c, [h, j], [p, m]], [/\b(xbox(?: one)?(?!; xbox))[\); ]/i], [c, [h, k], [p, m]], [/((pebble))app/i], [h, c, [p, v]], [/(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i], [c, [h, S], [p, v]], [/droid.+; (glass) \d/i], [c, [h, R], [p, v]], [/droid.+; (wt63?0{2,3})\)/i], [c, [h, L], [p, v]], [/(quest( 2| pro)?)/i], [c, [h, q], [p, v]], [/(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i], [h, [p, _]], [/(aeobc)\b/i], [c, [h, E], [p, _]], [/droid .+?; ([^;]+?)(?: bui|\) applew).+? mobile safari/i], [c, [p, y]], [/droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i], [c, [p, b]], [/\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i], [[p, b]], [/(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i], [[p, y]], [/(android[-\w\. ]{0,9});.+buil/i], [c, [h, "Generic"]]], engine: [[/windows.+ edge\/([\w\.]+)/i], [f, [d, "EdgeHTML"]], [/webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i], [f, [d, "Blink"]], [/(presto)\/([\w\.]+)/i, /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i, /ekioh(flow)\/([\w\.]+)/i, /(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i, /(icab)[\/ ]([23]\.[\d\.]+)/i, /\b(libweb)/i], [d, f], [/rv\:([\w\.]{1,9})\b.+(gecko)/i], [f, d]], os: [[/microsoft (windows) (vista|xp)/i], [d, f], [/(windows) nt 6\.2; (arm)/i, /(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i, /(windows)[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i], [d, [f, G, z]], [/(win(?=3|9|n)|win 9x )([nt\d\.]+)/i], [[d, "Windows"], [f, G, z]], [/ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i, /ios;fbsv\/([\d\.]+)/i, /cfnetwork\/.+darwin/i], [[f, /_/g, "."], [d, "iOS"]], [/(mac os x) ?([\w\. ]*)/i, /(macintosh|mac_powerpc\b)(?!.+haiku)/i], [[d, V], [f, /_/g, "."]], [/droid ([\w\.]+)\b.+(android[- ]x86|harmonyos)/i], [f, d], [/(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish)[-\/ ]?([\w\.]*)/i, /(blackberry)\w*\/([\w\.]*)/i, /(tizen|kaios)[\/ ]([\w\.]+)/i, /\((series40);/i], [d, f], [/\(bb(10);/i], [f, [d, x]], [/(?:symbian ?os|symbos|s60(?=;)|series60)[-\/ ]?([\w\.]*)/i], [f, [d, "Symbian"]], [/mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i], [f, [d, O + " OS"]], [/web0s;.+rt(tv)/i, /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i], [f, [d, "webOS"]], [/watch(?: ?os[,\/]|\d,\d\/)([\d\.]+)/i], [f, [d, "watchOS"]], [/crkey\/([\d\.]+)/i], [f, [d, T + "cast"]], [/(cros) [\w]+(?:\)| ([\w\.]+)\b)/i], [[d, U], f], [/panasonic;(viera)/i, /(netrange)mmh/i, /(nettv)\/(\d+\.[\w\.]+)/i, /(nintendo|playstation) ([wids345portablevuch]+)/i, /(xbox); +xbox ([^\);]+)/i, /\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i, /(mint)[\/\(\) ]?(\w*)/i, /(mageia|vectorlinux)[; ]/i, /([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i, /(hurd|linux) ?([\w\.]*)/i, /(gnu) ?([\w\.]*)/i, /\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i, /(haiku) (\w+)/i], [d, f], [/(sunos) ?([\w\.\d]*)/i], [[d, "Solaris"], f], [/((?:open)?solaris)[-\/ ]?([\w\.]*)/i, /(aix) ((\d)(?=\.|\)| )[\w\.])*/i, /\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux|serenityos)/i, /(unix) ?([\w\.]*)/i], [d, f]] }, X = function(e2, t3) {
              if (typeof e2 === o && (t3 = e2, e2 = i2), !(this instanceof X)) return new X(e2, t3).getResult();
              var r4 = typeof n2 !== s && n2.navigator ? n2.navigator : i2, m2 = e2 || (r4 && r4.userAgent ? r4.userAgent : ""), w2 = r4 && r4.userAgentData ? r4.userAgentData : i2, v2 = t3 ? F(Q, t3) : Q, _2 = r4 && r4.userAgent == m2;
              return this.getBrowser = function() {
                var e3, t4 = {};
                return t4[d] = i2, t4[f] = i2, J.call(t4, m2, v2.browser), t4[u] = typeof (e3 = t4[f]) === l ? e3.replace(/[^\d\.]/g, "").split(".")[0] : i2, _2 && r4 && r4.brave && typeof r4.brave.isBrave == a && (t4[d] = "Brave"), t4;
              }, this.getCPU = function() {
                var e3 = {};
                return e3[g] = i2, J.call(e3, m2, v2.cpu), e3;
              }, this.getDevice = function() {
                var e3 = {};
                return e3[h] = i2, e3[c] = i2, e3[p] = i2, J.call(e3, m2, v2.device), _2 && !e3[p] && w2 && w2.mobile && (e3[p] = y), _2 && "Macintosh" == e3[c] && r4 && typeof r4.standalone !== s && r4.maxTouchPoints && r4.maxTouchPoints > 2 && (e3[c] = "iPad", e3[p] = b), e3;
              }, this.getEngine = function() {
                var e3 = {};
                return e3[d] = i2, e3[f] = i2, J.call(e3, m2, v2.engine), e3;
              }, this.getOS = function() {
                var e3 = {};
                return e3[d] = i2, e3[f] = i2, J.call(e3, m2, v2.os), _2 && !e3[d] && w2 && "Unknown" != w2.platform && (e3[d] = w2.platform.replace(/chrome os/i, U).replace(/macos/i, V)), e3;
              }, this.getResult = function() {
                return { ua: this.getUA(), browser: this.getBrowser(), engine: this.getEngine(), os: this.getOS(), device: this.getDevice(), cpu: this.getCPU() };
              }, this.getUA = function() {
                return m2;
              }, this.setUA = function(e3) {
                return m2 = typeof e3 === l && e3.length > 350 ? K(e3, 350) : e3, this;
              }, this.setUA(m2), this;
            };
            if (X.VERSION = "1.0.35", X.BROWSER = B([d, f, u]), X.CPU = B([g]), X.DEVICE = B([c, h, p, m, y, w, b, v, _]), X.ENGINE = X.OS = B([d, f]), typeof r3 !== s) t2.exports && (r3 = t2.exports = X), r3.UAParser = X;
            else if (typeof define === a && define.amd) e.r, void 0 !== X && e.v(X);
            else typeof n2 !== s && (n2.UAParser = X);
            var Y = typeof n2 !== s && (n2.jQuery || n2.Zepto);
            if (Y && !Y.ua) {
              var Z = new X();
              Y.ua = Z.getResult(), Y.ua.get = function() {
                return Z.getUA();
              }, Y.ua.set = function(e2) {
                Z.setUA(e2);
                var t3 = Z.getResult();
                for (var r4 in t3) Y.ua[r4] = t3[r4];
              };
            }
          }(this);
        } }, n = {};
        function i(e2) {
          var t2 = n[e2];
          if (void 0 !== t2) return t2.exports;
          var a = n[e2] = { exports: {} }, s = true;
          try {
            r2[e2].call(a.exports, a, a.exports, i), s = false;
          } finally {
            s && delete n[e2];
          }
          return a.exports;
        }
        i.ab = "/ROOT/node_modules/next/dist/compiled/ua-parser-js/", t.exports = i(226);
      })();
    }, 708946, (e, t, r) => {
      "use strict";
      var n = { H: null, A: null };
      function i(e2) {
        var t2 = "https://react.dev/errors/" + e2;
        if (1 < arguments.length) {
          t2 += "?args[]=" + encodeURIComponent(arguments[1]);
          for (var r2 = 2; r2 < arguments.length; r2++) t2 += "&args[]=" + encodeURIComponent(arguments[r2]);
        }
        return "Minified React error #" + e2 + "; visit " + t2 + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
      }
      var a = Array.isArray;
      function s() {
      }
      var o = Symbol.for("react.transitional.element"), l = Symbol.for("react.portal"), u = Symbol.for("react.fragment"), c = Symbol.for("react.strict_mode"), d = Symbol.for("react.profiler"), p = Symbol.for("react.forward_ref"), h = Symbol.for("react.suspense"), f = Symbol.for("react.memo"), g = Symbol.for("react.lazy"), m = Symbol.iterator, y = Object.prototype.hasOwnProperty, b = Object.assign;
      function w(e2, t2, r2) {
        var n2 = r2.ref;
        return { $$typeof: o, type: e2, key: t2, ref: void 0 !== n2 ? n2 : null, props: r2 };
      }
      function v(e2) {
        return "object" == typeof e2 && null !== e2 && e2.$$typeof === o;
      }
      var _ = /\/+/g;
      function E(e2, t2) {
        var r2, n2;
        return "object" == typeof e2 && null !== e2 && null != e2.key ? (r2 = "" + e2.key, n2 = { "=": "=0", ":": "=2" }, "$" + r2.replace(/[=:]/g, function(e3) {
          return n2[e3];
        })) : t2.toString(36);
      }
      function S(e2, t2, r2) {
        if (null == e2) return e2;
        var n2 = [], u2 = 0;
        return !function e3(t3, r3, n3, u3, c2) {
          var d2, p2, h2, f2 = typeof t3;
          ("undefined" === f2 || "boolean" === f2) && (t3 = null);
          var y2 = false;
          if (null === t3) y2 = true;
          else switch (f2) {
            case "bigint":
            case "string":
            case "number":
              y2 = true;
              break;
            case "object":
              switch (t3.$$typeof) {
                case o:
                case l:
                  y2 = true;
                  break;
                case g:
                  return e3((y2 = t3._init)(t3._payload), r3, n3, u3, c2);
              }
          }
          if (y2) return c2 = c2(t3), y2 = "" === u3 ? "." + E(t3, 0) : u3, a(c2) ? (n3 = "", null != y2 && (n3 = y2.replace(_, "$&/") + "/"), e3(c2, r3, n3, "", function(e4) {
            return e4;
          })) : null != c2 && (v(c2) && (d2 = c2, p2 = n3 + (null == c2.key || t3 && t3.key === c2.key ? "" : ("" + c2.key).replace(_, "$&/") + "/") + y2, c2 = w(d2.type, p2, d2.props)), r3.push(c2)), 1;
          y2 = 0;
          var b2 = "" === u3 ? "." : u3 + ":";
          if (a(t3)) for (var S2 = 0; S2 < t3.length; S2++) f2 = b2 + E(u3 = t3[S2], S2), y2 += e3(u3, r3, n3, f2, c2);
          else if ("function" == typeof (S2 = null === (h2 = t3) || "object" != typeof h2 ? null : "function" == typeof (h2 = m && h2[m] || h2["@@iterator"]) ? h2 : null)) for (t3 = S2.call(t3), S2 = 0; !(u3 = t3.next()).done; ) f2 = b2 + E(u3 = u3.value, S2++), y2 += e3(u3, r3, n3, f2, c2);
          else if ("object" === f2) {
            if ("function" == typeof t3.then) return e3(function(e4) {
              switch (e4.status) {
                case "fulfilled":
                  return e4.value;
                case "rejected":
                  throw e4.reason;
                default:
                  switch ("string" == typeof e4.status ? e4.then(s, s) : (e4.status = "pending", e4.then(function(t4) {
                    "pending" === e4.status && (e4.status = "fulfilled", e4.value = t4);
                  }, function(t4) {
                    "pending" === e4.status && (e4.status = "rejected", e4.reason = t4);
                  })), e4.status) {
                    case "fulfilled":
                      return e4.value;
                    case "rejected":
                      throw e4.reason;
                  }
              }
              throw e4;
            }(t3), r3, n3, u3, c2);
            throw Error(i(31, "[object Object]" === (r3 = String(t3)) ? "object with keys {" + Object.keys(t3).join(", ") + "}" : r3));
          }
          return y2;
        }(e2, n2, "", "", function(e3) {
          return t2.call(r2, e3, u2++);
        }), n2;
      }
      function P(e2) {
        if (-1 === e2._status) {
          var t2 = e2._result;
          (t2 = t2()).then(function(t3) {
            (0 === e2._status || -1 === e2._status) && (e2._status = 1, e2._result = t3);
          }, function(t3) {
            (0 === e2._status || -1 === e2._status) && (e2._status = 2, e2._result = t3);
          }), -1 === e2._status && (e2._status = 0, e2._result = t2);
        }
        if (1 === e2._status) return e2._result.default;
        throw e2._result;
      }
      function x() {
        return /* @__PURE__ */ new WeakMap();
      }
      function A() {
        return { s: 0, v: void 0, o: null, p: null };
      }
      r.Children = { map: S, forEach: function(e2, t2, r2) {
        S(e2, function() {
          t2.apply(this, arguments);
        }, r2);
      }, count: function(e2) {
        var t2 = 0;
        return S(e2, function() {
          t2++;
        }), t2;
      }, toArray: function(e2) {
        return S(e2, function(e3) {
          return e3;
        }) || [];
      }, only: function(e2) {
        if (!v(e2)) throw Error(i(143));
        return e2;
      } }, r.Fragment = u, r.Profiler = d, r.StrictMode = c, r.Suspense = h, r.__SERVER_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = n, r.cache = function(e2) {
        return function() {
          var t2 = n.A;
          if (!t2) return e2.apply(null, arguments);
          var r2 = t2.getCacheForType(x);
          void 0 === (t2 = r2.get(e2)) && (t2 = A(), r2.set(e2, t2)), r2 = 0;
          for (var i2 = arguments.length; r2 < i2; r2++) {
            var a2 = arguments[r2];
            if ("function" == typeof a2 || "object" == typeof a2 && null !== a2) {
              var s2 = t2.o;
              null === s2 && (t2.o = s2 = /* @__PURE__ */ new WeakMap()), void 0 === (t2 = s2.get(a2)) && (t2 = A(), s2.set(a2, t2));
            } else null === (s2 = t2.p) && (t2.p = s2 = /* @__PURE__ */ new Map()), void 0 === (t2 = s2.get(a2)) && (t2 = A(), s2.set(a2, t2));
          }
          if (1 === t2.s) return t2.v;
          if (2 === t2.s) throw t2.v;
          try {
            var o2 = e2.apply(null, arguments);
            return (r2 = t2).s = 1, r2.v = o2;
          } catch (e3) {
            throw (o2 = t2).s = 2, o2.v = e3, e3;
          }
        };
      }, r.cacheSignal = function() {
        var e2 = n.A;
        return e2 ? e2.cacheSignal() : null;
      }, r.captureOwnerStack = function() {
        return null;
      }, r.cloneElement = function(e2, t2, r2) {
        if (null == e2) throw Error(i(267, e2));
        var n2 = b({}, e2.props), a2 = e2.key;
        if (null != t2) for (s2 in void 0 !== t2.key && (a2 = "" + t2.key), t2) y.call(t2, s2) && "key" !== s2 && "__self" !== s2 && "__source" !== s2 && ("ref" !== s2 || void 0 !== t2.ref) && (n2[s2] = t2[s2]);
        var s2 = arguments.length - 2;
        if (1 === s2) n2.children = r2;
        else if (1 < s2) {
          for (var o2 = Array(s2), l2 = 0; l2 < s2; l2++) o2[l2] = arguments[l2 + 2];
          n2.children = o2;
        }
        return w(e2.type, a2, n2);
      }, r.createElement = function(e2, t2, r2) {
        var n2, i2 = {}, a2 = null;
        if (null != t2) for (n2 in void 0 !== t2.key && (a2 = "" + t2.key), t2) y.call(t2, n2) && "key" !== n2 && "__self" !== n2 && "__source" !== n2 && (i2[n2] = t2[n2]);
        var s2 = arguments.length - 2;
        if (1 === s2) i2.children = r2;
        else if (1 < s2) {
          for (var o2 = Array(s2), l2 = 0; l2 < s2; l2++) o2[l2] = arguments[l2 + 2];
          i2.children = o2;
        }
        if (e2 && e2.defaultProps) for (n2 in s2 = e2.defaultProps) void 0 === i2[n2] && (i2[n2] = s2[n2]);
        return w(e2, a2, i2);
      }, r.createRef = function() {
        return { current: null };
      }, r.forwardRef = function(e2) {
        return { $$typeof: p, render: e2 };
      }, r.isValidElement = v, r.lazy = function(e2) {
        return { $$typeof: g, _payload: { _status: -1, _result: e2 }, _init: P };
      }, r.memo = function(e2, t2) {
        return { $$typeof: f, type: e2, compare: void 0 === t2 ? null : t2 };
      }, r.use = function(e2) {
        return n.H.use(e2);
      }, r.useCallback = function(e2, t2) {
        return n.H.useCallback(e2, t2);
      }, r.useDebugValue = function() {
      }, r.useId = function() {
        return n.H.useId();
      }, r.useMemo = function(e2, t2) {
        return n.H.useMemo(e2, t2);
      }, r.version = "19.2.0-canary-0bdb9206-20250818";
    }, 40049, (e, t, r) => {
      "use strict";
      t.exports = e.r(708946);
    }, 904589, (e, t, r) => {
      "use strict";
      var n = Object.create, i = Object.defineProperty, a = Object.getOwnPropertyDescriptor, s = Object.getOwnPropertyNames, o = Object.getPrototypeOf, l = Object.prototype.hasOwnProperty, u = (e10, t10) => () => (e10 && (t10 = e10(e10 = 0)), t10), c = (e10, t10) => () => (t10 || e10((t10 = { exports: {} }).exports, t10), t10.exports), d = (e10, t10) => {
        for (var r10 in t10) i(e10, r10, { get: t10[r10], enumerable: true });
      }, p = (e10, t10, r10, n10) => {
        if (t10 && "object" == typeof t10 || "function" == typeof t10) for (let o2 of s(t10)) l.call(e10, o2) || o2 === r10 || i(e10, o2, { get: () => t10[o2], enumerable: !(n10 = a(t10, o2)) || n10.enumerable });
        return e10;
      }, h = (e10, t10, r10) => (r10 = null != e10 ? n(o(e10)) : {}, p(!t10 && e10 && e10.__esModule ? r10 : i(r10, "default", { value: e10, enumerable: true }), e10));
      function f(e10, t10) {
        if ("utf8" === (t10 = t10.toLowerCase()) || "utf-8" === t10) return new E(P.encode(e10));
        if ("base64" === t10 || "base64url" === t10) return e10 = (e10 = e10.replace(/-/g, "+").replace(/_/g, "/")).replace(/[^A-Za-z0-9+/]/g, ""), new E([...atob(e10)].map((e11) => e11.charCodeAt(0)));
        if ("binary" === t10 || "ascii" === t10 || "latin1" === t10 || "latin-1" === t10) return new E([...e10].map((e11) => e11.charCodeAt(0)));
        if ("ucs2" === t10 || "ucs-2" === t10 || "utf16le" === t10 || "utf-16le" === t10) {
          let t11 = new E(2 * e10.length), r10 = new DataView(t11.buffer);
          for (let t12 = 0; t12 < e10.length; t12++) r10.setUint16(2 * t12, e10.charCodeAt(t12), true);
          return t11;
        }
        if ("hex" === t10) {
          let t11 = new E(e10.length / 2);
          for (let r10 = 0, n10 = 0; n10 < e10.length; n10 += 2, r10++) t11[r10] = parseInt(e10.slice(n10, n10 + 2), 16);
          return t11;
        }
        g(`encoding "${t10}"`);
      }
      function g(e10) {
        throw Error(`Buffer polyfill does not implement "${e10}"`);
      }
      function m(e10, t10) {
        if (!(e10 instanceof Uint8Array)) throw TypeError(`The "${t10}" argument must be an instance of Buffer or Uint8Array`);
      }
      function y(e10, t10, r10 = T + 1) {
        if (e10 < 0 || e10 > r10) {
          let n10 = RangeError(`The value of "${t10}" is out of range. It must be >= 0 && <= ${r10}. Received ${e10}`);
          throw n10.code = "ERR_OUT_OF_RANGE", n10;
        }
      }
      function b(e10, t10) {
        if ("number" != typeof e10) {
          let r10 = TypeError(`The "${t10}" argument must be of type number. Received type ${typeof e10}.`);
          throw r10.code = "ERR_INVALID_ARG_TYPE", r10;
        }
      }
      function w(e10, t10) {
        if (!Number.isInteger(e10) || Number.isNaN(e10)) {
          let r10 = RangeError(`The value of "${t10}" is out of range. It must be an integer. Received ${e10}`);
          throw r10.code = "ERR_OUT_OF_RANGE", r10;
        }
      }
      function v(e10, t10) {
        if ("string" != typeof e10) {
          let r10 = TypeError(`The "${t10}" argument must be of type string. Received type ${typeof e10}`);
          throw r10.code = "ERR_INVALID_ARG_TYPE", r10;
        }
      }
      function _(e10, t10 = "utf8") {
        return E.from(e10, t10);
      }
      var E, S, P, x, A, T, O, R, C, k, N, I, D = u(() => {
        E = class e10 extends Uint8Array {
          _isBuffer = true;
          get offset() {
            return this.byteOffset;
          }
          static alloc(t10, r10 = 0, n10 = "utf8") {
            return v(n10, "encoding"), e10.allocUnsafe(t10).fill(r10, n10);
          }
          static allocUnsafe(t10) {
            return e10.from(t10);
          }
          static allocUnsafeSlow(t10) {
            return e10.from(t10);
          }
          static isBuffer(e11) {
            return e11 && !!e11._isBuffer;
          }
          static byteLength(e11, t10 = "utf8") {
            if ("string" == typeof e11) return f(e11, t10).byteLength;
            if (e11 && e11.byteLength) return e11.byteLength;
            let r10 = TypeError('The "string" argument must be of type string or an instance of Buffer or ArrayBuffer.');
            throw r10.code = "ERR_INVALID_ARG_TYPE", r10;
          }
          static isEncoding(e11) {
            return A.includes(e11);
          }
          static compare(e11, t10) {
            m(e11, "buff1"), m(t10, "buff2");
            for (let r10 = 0; r10 < e11.length; r10++) {
              if (e11[r10] < t10[r10]) return -1;
              if (e11[r10] > t10[r10]) return 1;
            }
            return e11.length === t10.length ? 0 : e11.length > t10.length ? 1 : -1;
          }
          static from(t10, r10 = "utf8") {
            if (t10 && "object" == typeof t10 && "Buffer" === t10.type) return new e10(t10.data);
            if ("number" == typeof t10) return new e10(new Uint8Array(t10));
            if ("string" == typeof t10) return f(t10, r10);
            if (ArrayBuffer.isView(t10)) {
              let { byteOffset: r11, byteLength: n10, buffer: i2 } = t10;
              return "map" in t10 && "function" == typeof t10.map ? new e10(t10.map((e11) => e11 % 256), r11, n10) : new e10(i2, r11, n10);
            }
            if (t10 && "object" == typeof t10 && ("length" in t10 || "byteLength" in t10 || "buffer" in t10)) return new e10(t10);
            throw TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.");
          }
          static concat(t10, r10) {
            if (0 === t10.length) return e10.alloc(0);
            let n10 = [].concat(...t10.map((e11) => [...e11])), i2 = e10.alloc(void 0 !== r10 ? r10 : n10.length);
            return i2.set(void 0 !== r10 ? n10.slice(0, r10) : n10), i2;
          }
          slice(e11 = 0, t10 = this.length) {
            return this.subarray(e11, t10);
          }
          subarray(t10 = 0, r10 = this.length) {
            return Object.setPrototypeOf(super.subarray(t10, r10), e10.prototype);
          }
          reverse() {
            return super.reverse(), this;
          }
          readIntBE(e11, t10) {
            b(e11, "offset"), w(e11, "offset"), y(e11, "offset", this.length - 1), b(t10, "byteLength"), w(t10, "byteLength");
            let r10 = new DataView(this.buffer, e11, t10), n10 = 0;
            for (let e12 = 0; e12 < t10; e12++) n10 = 256 * n10 + r10.getUint8(e12);
            return 128 & r10.getUint8(0) && (n10 -= Math.pow(256, t10)), n10;
          }
          readIntLE(e11, t10) {
            b(e11, "offset"), w(e11, "offset"), y(e11, "offset", this.length - 1), b(t10, "byteLength"), w(t10, "byteLength");
            let r10 = new DataView(this.buffer, e11, t10), n10 = 0;
            for (let e12 = 0; e12 < t10; e12++) n10 += r10.getUint8(e12) * Math.pow(256, e12);
            return 128 & r10.getUint8(t10 - 1) && (n10 -= Math.pow(256, t10)), n10;
          }
          readUIntBE(e11, t10) {
            b(e11, "offset"), w(e11, "offset"), y(e11, "offset", this.length - 1), b(t10, "byteLength"), w(t10, "byteLength");
            let r10 = new DataView(this.buffer, e11, t10), n10 = 0;
            for (let e12 = 0; e12 < t10; e12++) n10 = 256 * n10 + r10.getUint8(e12);
            return n10;
          }
          readUintBE(e11, t10) {
            return this.readUIntBE(e11, t10);
          }
          readUIntLE(e11, t10) {
            b(e11, "offset"), w(e11, "offset"), y(e11, "offset", this.length - 1), b(t10, "byteLength"), w(t10, "byteLength");
            let r10 = new DataView(this.buffer, e11, t10), n10 = 0;
            for (let e12 = 0; e12 < t10; e12++) n10 += r10.getUint8(e12) * Math.pow(256, e12);
            return n10;
          }
          readUintLE(e11, t10) {
            return this.readUIntLE(e11, t10);
          }
          writeIntBE(e11, t10, r10) {
            return e11 = e11 < 0 ? e11 + Math.pow(256, r10) : e11, this.writeUIntBE(e11, t10, r10);
          }
          writeIntLE(e11, t10, r10) {
            return e11 = e11 < 0 ? e11 + Math.pow(256, r10) : e11, this.writeUIntLE(e11, t10, r10);
          }
          writeUIntBE(e11, t10, r10) {
            b(t10, "offset"), w(t10, "offset"), y(t10, "offset", this.length - 1), b(r10, "byteLength"), w(r10, "byteLength");
            let n10 = new DataView(this.buffer, t10, r10);
            for (let t11 = r10 - 1; t11 >= 0; t11--) n10.setUint8(t11, 255 & e11), e11 /= 256;
            return t10 + r10;
          }
          writeUintBE(e11, t10, r10) {
            return this.writeUIntBE(e11, t10, r10);
          }
          writeUIntLE(e11, t10, r10) {
            b(t10, "offset"), w(t10, "offset"), y(t10, "offset", this.length - 1), b(r10, "byteLength"), w(r10, "byteLength");
            let n10 = new DataView(this.buffer, t10, r10);
            for (let t11 = 0; t11 < r10; t11++) n10.setUint8(t11, 255 & e11), e11 /= 256;
            return t10 + r10;
          }
          writeUintLE(e11, t10, r10) {
            return this.writeUIntLE(e11, t10, r10);
          }
          toJSON() {
            return { type: "Buffer", data: Array.from(this) };
          }
          swap16() {
            let e11 = new DataView(this.buffer, this.byteOffset, this.byteLength);
            for (let t10 = 0; t10 < this.length; t10 += 2) e11.setUint16(t10, e11.getUint16(t10, true), false);
            return this;
          }
          swap32() {
            let e11 = new DataView(this.buffer, this.byteOffset, this.byteLength);
            for (let t10 = 0; t10 < this.length; t10 += 4) e11.setUint32(t10, e11.getUint32(t10, true), false);
            return this;
          }
          swap64() {
            let e11 = new DataView(this.buffer, this.byteOffset, this.byteLength);
            for (let t10 = 0; t10 < this.length; t10 += 8) e11.setBigUint64(t10, e11.getBigUint64(t10, true), false);
            return this;
          }
          compare(t10, r10 = 0, n10 = t10.length, i2 = 0, a2 = this.length) {
            return m(t10, "target"), b(r10, "targetStart"), b(n10, "targetEnd"), b(i2, "sourceStart"), b(a2, "sourceEnd"), y(r10, "targetStart"), y(n10, "targetEnd", t10.length), y(i2, "sourceStart"), y(a2, "sourceEnd", this.length), e10.compare(this.slice(i2, a2), t10.slice(r10, n10));
          }
          equals(e11) {
            return m(e11, "otherBuffer"), this.length === e11.length && this.every((t10, r10) => t10 === e11[r10]);
          }
          copy(e11, t10 = 0, r10 = 0, n10 = this.length) {
            y(t10, "targetStart"), y(r10, "sourceStart", this.length), y(n10, "sourceEnd"), t10 >>>= 0, r10 >>>= 0, n10 >>>= 0;
            let i2 = 0;
            for (; r10 < n10 && void 0 !== this[r10] && void 0 !== e11[t10]; ) e11[t10] = this[r10], i2++, r10++, t10++;
            return i2;
          }
          write(e11, t10, r10, n10 = "utf8") {
            let i2 = "string" == typeof t10 ? 0 : t10 ?? 0, a2 = "string" == typeof r10 ? this.length - i2 : r10 ?? this.length - i2;
            return n10 = "string" == typeof t10 ? t10 : "string" == typeof r10 ? r10 : n10, b(i2, "offset"), b(a2, "length"), y(i2, "offset", this.length), y(a2, "length", this.length), ("ucs2" === n10 || "ucs-2" === n10 || "utf16le" === n10 || "utf-16le" === n10) && (a2 -= a2 % 2), f(e11, n10).copy(this, i2, 0, a2);
          }
          fill(t10 = 0, r10 = 0, n10 = this.length, i2 = "utf-8") {
            let a2 = "string" == typeof r10 ? 0 : r10, s2 = "string" == typeof n10 ? this.length : n10;
            if (i2 = "string" == typeof r10 ? r10 : "string" == typeof n10 ? n10 : i2, t10 = e10.from("number" == typeof t10 ? [t10] : t10 ?? [], i2), v(i2, "encoding"), y(a2, "offset", this.length), y(s2, "end", this.length), 0 !== t10.length) for (let e11 = a2; e11 < s2; e11 += t10.length) super.set(t10.slice(0, t10.length + e11 >= this.length ? this.length - e11 : t10.length), e11);
            return this;
          }
          includes(e11, t10 = null, r10 = "utf-8") {
            return -1 !== this.indexOf(e11, t10, r10);
          }
          lastIndexOf(e11, t10 = null, r10 = "utf-8") {
            return this.indexOf(e11, t10, r10, true);
          }
          indexOf(t10, r10 = null, n10 = "utf-8", i2 = false) {
            let a2 = i2 ? this.findLastIndex.bind(this) : this.findIndex.bind(this);
            n10 = "string" == typeof r10 ? r10 : n10;
            let s2 = e10.from("number" == typeof t10 ? [t10] : t10, n10), o2 = "string" == typeof r10 ? 0 : r10;
            return o2 = Number.isNaN(o2 = "number" == typeof r10 ? o2 : null) ? null : o2, o2 ??= i2 ? this.length : 0, o2 = o2 < 0 ? this.length + o2 : o2, 0 === s2.length && false === i2 ? o2 >= this.length ? this.length : o2 : 0 === s2.length && true === i2 ? (o2 >= this.length ? this.length : o2) || this.length : a2((e11, t11) => (i2 ? t11 <= o2 : t11 >= o2) && this[t11] === s2[0] && s2.every((e12, r11) => this[t11 + r11] === e12));
          }
          toString(e11 = "utf8", t10 = 0, r10 = this.length) {
            if (t10 = t10 < 0 ? 0 : t10, e11 = e11.toString().toLowerCase(), r10 <= 0) return "";
            if ("utf8" === e11 || "utf-8" === e11) return x.decode(this.slice(t10, r10));
            if ("base64" === e11 || "base64url" === e11) {
              let t11 = btoa(this.reduce((e12, t12) => e12 + R(t12), ""));
              return "base64url" === e11 ? t11.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "") : t11;
            }
            if ("binary" === e11 || "ascii" === e11 || "latin1" === e11 || "latin-1" === e11) return this.slice(t10, r10).reduce((t11, r11) => t11 + R(r11 & ("ascii" === e11 ? 127 : 255)), "");
            if ("ucs2" === e11 || "ucs-2" === e11 || "utf16le" === e11 || "utf-16le" === e11) {
              let e12 = new DataView(this.buffer.slice(t10, r10));
              return Array.from({ length: e12.byteLength / 2 }, (t11, r11) => 2 * r11 + 1 < e12.byteLength ? R(e12.getUint16(2 * r11, true)) : "").join("");
            }
            if ("hex" === e11) return this.slice(t10, r10).reduce((e12, t11) => e12 + t11.toString(16).padStart(2, "0"), "");
            g(`encoding "${e11}"`);
          }
          toLocaleString() {
            return this.toString();
          }
          inspect() {
            return `<Buffer ${this.toString("hex").match(/.{1,2}/g).join(" ")}>`;
          }
        }, S = { int8: [-128, 127], int16: [-32768, 32767], int32: [-2147483648, 2147483647], uint8: [0, 255], uint16: [0, 65535], uint32: [0, 4294967295], float32: [-1 / 0, 1 / 0], float64: [-1 / 0, 1 / 0], bigint64: [-0x8000000000000000n, 0x7fffffffffffffffn], biguint64: [0n, 0xffffffffffffffffn] }, P = new TextEncoder(), x = new TextDecoder(), A = ["utf8", "utf-8", "hex", "base64", "ascii", "binary", "base64url", "ucs2", "ucs-2", "utf16le", "utf-16le", "latin1", "latin-1"], T = 4294967295, function(e10) {
          let t10 = Object.getOwnPropertyNames(DataView.prototype).filter((e11) => e11.startsWith("get") || e11.startsWith("set")), r10 = t10.map((e11) => e11.replace("get", "read").replace("set", "write")), n10 = (e11, r11) => function(n11 = 0) {
            return b(n11, "offset"), w(n11, "offset"), y(n11, "offset", this.length - 1), new DataView(this.buffer)[t10[e11]](n11, r11);
          }, i2 = (e11, r11) => function(n11, i3 = 0) {
            let a2 = S[t10[e11].match(/set(\w+\d+)/)[1].toLowerCase()];
            return b(i3, "offset"), w(i3, "offset"), y(i3, "offset", this.length - 1), function(e12, t11, r12, n12) {
              if (e12 < r12 || e12 > n12) {
                let i4 = RangeError(`The value of "${t11}" is out of range. It must be >= ${r12} and <= ${n12}. Received ${e12}`);
                throw i4.code = "ERR_OUT_OF_RANGE", i4;
              }
            }(n11, "value", a2[0], a2[1]), new DataView(this.buffer)[t10[e11]](i3, n11, r11), i3 + parseInt(t10[e11].match(/\d+/)[0]) / 8;
          };
          r10.forEach((t11, r11) => {
            t11.startsWith("read") && (e10[t11] = n10(r11, false), e10[t11 + "LE"] = n10(r11, true), e10[t11 + "BE"] = n10(r11, false)), t11.startsWith("write") && (e10[t11] = i2(r11, false), e10[t11 + "LE"] = i2(r11, true), e10[t11 + "BE"] = i2(r11, false)), [t11, t11 + "LE", t11 + "BE"].forEach((t12) => {
              t12.includes("Uint") && (e10[t12.replace("Uint", "UInt")] = e10[t12]), t12.includes("Float64") && (e10[t12.replace("Float64", "Double")] = e10[t12]), t12.includes("Float32") && (e10[t12.replace("Float32", "Float")] = e10[t12]);
            });
          });
        }(E.prototype), O = new Proxy(_, { construct: (e10, [t10, r10]) => E.from(t10, r10), get: (e10, t10) => E[t10] }), R = String.fromCodePoint;
      }), M = u(() => {
        C = { nextTick: (e10, ...t10) => {
          setTimeout(() => {
            e10(...t10);
          }, 0);
        }, env: {}, version: "", cwd: () => "/", stderr: {}, argv: ["/bin/node"], pid: 1e4 }, { cwd: k } = C;
      }), j = u(() => {
        globalThis.performance ?? (() => {
          let e10 = Date.now();
          return { now: () => Date.now() - e10 };
        })();
      }), $ = u(() => {
        (N = () => {
        }).prototype = N;
      }), L = u(() => {
        I = class {
          value;
          constructor(e10) {
            this.value = e10;
          }
          deref() {
            return this.value;
          }
        };
      });
      function q(e10, t10) {
        var r10, n10, i2, a2, s2, o2, l2, u2, c2 = e10.constructor, d2 = c2.precision;
        if (!e10.s || !t10.s) return t10.s || (t10 = new c2(e10)), er ? G(t10, d2) : t10;
        if (l2 = e10.d, u2 = t10.d, s2 = e10.e, i2 = t10.e, l2 = l2.slice(), a2 = s2 - i2) {
          for (a2 < 0 ? (n10 = l2, a2 = -a2, o2 = u2.length) : (n10 = u2, i2 = s2, o2 = l2.length), a2 > (o2 = (s2 = Math.ceil(d2 / ed)) > o2 ? s2 + 1 : o2 + 1) && (a2 = o2, n10.length = 1), n10.reverse(); a2--; ) n10.push(0);
          n10.reverse();
        }
        for ((o2 = l2.length) - (a2 = u2.length) < 0 && (a2 = o2, n10 = u2, u2 = l2, l2 = n10), r10 = 0; a2; ) r10 = (l2[--a2] = l2[a2] + u2[a2] + r10) / ec | 0, l2[a2] %= ec;
        for (r10 && (l2.unshift(r10), ++i2), o2 = l2.length; 0 == l2[--o2]; ) l2.pop();
        return t10.d = l2, t10.e = i2, er ? G(t10, d2) : t10;
      }
      function U(e10, t10, r10) {
        if (e10 !== ~~e10 || e10 < t10 || e10 > r10) throw Error(ei + e10);
      }
      function V(e10) {
        var t10, r10, n10, i2 = e10.length - 1, a2 = "", s2 = e10[0];
        if (i2 > 0) {
          for (a2 += s2, t10 = 1; t10 < i2; t10++) n10 = e10[t10] + "", (r10 = ed - n10.length) && (a2 += H(r10)), a2 += n10;
          n10 = (s2 = e10[t10]) + "", (r10 = ed - n10.length) && (a2 += H(r10));
        } else if (0 === s2) return "0";
        for (; s2 % 10 == 0; ) s2 /= 10;
        return a2 + s2;
      }
      function F(e10, t10) {
        var r10, n10, i2, a2, s2, o2 = 0, l2 = 0, u2 = e10.constructor, c2 = u2.precision;
        if (B(e10) > 16) throw Error(ea + B(e10));
        if (!e10.s) return new u2(eu);
        for (null == t10 ? (er = false, s2 = c2) : s2 = t10, a2 = new u2(0.03125); e10.abs().gte(0.1); ) e10 = e10.times(a2), l2 += 5;
        for (s2 += Math.log(eo(2, l2)) / Math.LN10 * 2 + 5 | 0, r10 = n10 = i2 = new u2(eu), u2.precision = s2; ; ) {
          if (n10 = G(n10.times(e10), s2), r10 = r10.times(++o2), V((a2 = i2.plus(ef(n10, r10, s2))).d).slice(0, s2) === V(i2.d).slice(0, s2)) {
            for (; l2--; ) i2 = G(i2.times(i2), s2);
            return u2.precision = c2, null == t10 ? (er = true, G(i2, c2)) : i2;
          }
          i2 = a2;
        }
      }
      function B(e10) {
        for (var t10 = e10.e * ed, r10 = e10.d[0]; r10 >= 10; r10 /= 10) t10++;
        return t10;
      }
      function W(e10, t10, r10) {
        if (t10 > e10.LN10.sd()) throw er = true, r10 && (e10.precision = r10), Error(en + "LN10 precision limit exceeded");
        return G(new e10(e10.LN10), t10);
      }
      function H(e10) {
        for (var t10 = ""; e10--; ) t10 += "0";
        return t10;
      }
      function K(e10, t10) {
        var r10, n10, i2, a2, s2, o2, l2, u2, c2, d2 = 1, p2 = e10, h2 = p2.d, f2 = p2.constructor, g2 = f2.precision;
        if (p2.s < 1) throw Error(en + (p2.s ? "NaN" : "-Infinity"));
        if (p2.eq(eu)) return new f2(0);
        if (null == t10 ? (er = false, u2 = g2) : u2 = t10, p2.eq(10)) return null == t10 && (er = true), W(f2, u2);
        if (f2.precision = u2 += 10, n10 = (r10 = V(h2)).charAt(0), !(15e14 > Math.abs(a2 = B(p2)))) return l2 = W(f2, u2 + 2, g2).times(a2 + ""), p2 = K(new f2(n10 + "." + r10.slice(1)), u2 - 10).plus(l2), f2.precision = g2, null == t10 ? (er = true, G(p2, g2)) : p2;
        for (; n10 < 7 && 1 != n10 || 1 == n10 && r10.charAt(1) > 3; ) n10 = (r10 = V((p2 = p2.times(e10)).d)).charAt(0), d2++;
        for (a2 = B(p2), n10 > 1 ? (p2 = new f2("0." + r10), a2++) : p2 = new f2(n10 + "." + r10.slice(1)), o2 = s2 = p2 = ef(p2.minus(eu), p2.plus(eu), u2), c2 = G(p2.times(p2), u2), i2 = 3; ; ) {
          if (s2 = G(s2.times(c2), u2), V((l2 = o2.plus(ef(s2, new f2(i2), u2))).d).slice(0, u2) === V(o2.d).slice(0, u2)) return o2 = o2.times(2), 0 !== a2 && (o2 = o2.plus(W(f2, u2 + 2, g2).times(a2 + ""))), o2 = ef(o2, new f2(d2), u2), f2.precision = g2, null == t10 ? (er = true, G(o2, g2)) : o2;
          o2 = l2, i2 += 2;
        }
      }
      function J(e10, t10) {
        var r10, n10, i2;
        for ((r10 = t10.indexOf(".")) > -1 && (t10 = t10.replace(".", "")), (n10 = t10.search(/e/i)) > 0 ? (r10 < 0 && (r10 = n10), r10 += +t10.slice(n10 + 1), t10 = t10.substring(0, n10)) : r10 < 0 && (r10 = t10.length), n10 = 0; 48 === t10.charCodeAt(n10); ) ++n10;
        for (i2 = t10.length; 48 === t10.charCodeAt(i2 - 1); ) --i2;
        if (t10 = t10.slice(n10, i2)) {
          if (i2 -= n10, e10.e = es((r10 = r10 - n10 - 1) / ed), e10.d = [], n10 = (r10 + 1) % ed, r10 < 0 && (n10 += ed), n10 < i2) {
            for (n10 && e10.d.push(+t10.slice(0, n10)), i2 -= ed; n10 < i2; ) e10.d.push(+t10.slice(n10, n10 += ed));
            t10 = t10.slice(n10), n10 = ed - t10.length;
          } else n10 -= i2;
          for (; n10--; ) t10 += "0";
          if (e10.d.push(+t10), er && (e10.e > ep || e10.e < -ep)) throw Error(ea + r10);
        } else e10.s = 0, e10.e = 0, e10.d = [0];
        return e10;
      }
      function G(e10, t10, r10) {
        var n10, i2, a2, s2, o2, l2, u2, c2, d2 = e10.d;
        for (s2 = 1, a2 = d2[0]; a2 >= 10; a2 /= 10) s2++;
        if ((n10 = t10 - s2) < 0) n10 += ed, i2 = t10, u2 = d2[c2 = 0];
        else {
          if ((c2 = Math.ceil((n10 + 1) / ed)) >= (a2 = d2.length)) return e10;
          for (u2 = a2 = d2[c2], s2 = 1; a2 >= 10; a2 /= 10) s2++;
          n10 %= ed, i2 = n10 - ed + s2;
        }
        if (void 0 !== r10 && (o2 = u2 / (a2 = eo(10, s2 - i2 - 1)) % 10 | 0, l2 = t10 < 0 || void 0 !== d2[c2 + 1] || u2 % a2, l2 = r10 < 4 ? (o2 || l2) && (0 == r10 || r10 == (e10.s < 0 ? 3 : 2)) : o2 > 5 || 5 == o2 && (4 == r10 || l2 || 6 == r10 && (n10 > 0 ? i2 > 0 ? u2 / eo(10, s2 - i2) : 0 : d2[c2 - 1]) % 10 & 1 || r10 == (e10.s < 0 ? 8 : 7))), t10 < 1 || !d2[0]) return l2 ? (a2 = B(e10), d2.length = 1, t10 = t10 - a2 - 1, d2[0] = eo(10, (ed - t10 % ed) % ed), e10.e = es(-t10 / ed) || 0) : (d2.length = 1, d2[0] = e10.e = e10.s = 0), e10;
        if (0 == n10 ? (d2.length = c2, a2 = 1, c2--) : (d2.length = c2 + 1, a2 = eo(10, ed - n10), d2[c2] = i2 > 0 ? (u2 / eo(10, s2 - i2) % eo(10, i2) | 0) * a2 : 0), l2) for (; ; ) if (0 == c2) {
          (d2[0] += a2) == ec && (d2[0] = 1, ++e10.e);
          break;
        } else {
          if (d2[c2] += a2, d2[c2] != ec) break;
          d2[c2--] = 0, a2 = 1;
        }
        for (n10 = d2.length; 0 === d2[--n10]; ) d2.pop();
        if (er && (e10.e > ep || e10.e < -ep)) throw Error(ea + B(e10));
        return e10;
      }
      function z(e10, t10) {
        var r10, n10, i2, a2, s2, o2, l2, u2, c2, d2, p2 = e10.constructor, h2 = p2.precision;
        if (!e10.s || !t10.s) return t10.s ? t10.s = -t10.s : t10 = new p2(e10), er ? G(t10, h2) : t10;
        if (l2 = e10.d, d2 = t10.d, n10 = t10.e, u2 = e10.e, l2 = l2.slice(), s2 = u2 - n10) {
          for ((c2 = s2 < 0) ? (r10 = l2, s2 = -s2, o2 = d2.length) : (r10 = d2, n10 = u2, o2 = l2.length), s2 > (i2 = Math.max(Math.ceil(h2 / ed), o2) + 2) && (s2 = i2, r10.length = 1), r10.reverse(), i2 = s2; i2--; ) r10.push(0);
          r10.reverse();
        } else {
          for ((c2 = (i2 = l2.length) < (o2 = d2.length)) && (o2 = i2), i2 = 0; i2 < o2; i2++) if (l2[i2] != d2[i2]) {
            c2 = l2[i2] < d2[i2];
            break;
          }
          s2 = 0;
        }
        for (c2 && (r10 = l2, l2 = d2, d2 = r10, t10.s = -t10.s), o2 = l2.length, i2 = d2.length - o2; i2 > 0; --i2) l2[o2++] = 0;
        for (i2 = d2.length; i2 > s2; ) {
          if (l2[--i2] < d2[i2]) {
            for (a2 = i2; a2 && 0 === l2[--a2]; ) l2[a2] = ec - 1;
            --l2[a2], l2[i2] += ec;
          }
          l2[i2] -= d2[i2];
        }
        for (; 0 === l2[--o2]; ) l2.pop();
        for (; 0 === l2[0]; l2.shift()) --n10;
        return l2[0] ? (t10.d = l2, t10.e = n10, er ? G(t10, h2) : t10) : new p2(0);
      }
      function Q(e10, t10, r10) {
        var n10, i2 = B(e10), a2 = V(e10.d), s2 = a2.length;
        return t10 ? (r10 && (n10 = r10 - s2) > 0 ? a2 = a2.charAt(0) + "." + a2.slice(1) + H(n10) : s2 > 1 && (a2 = a2.charAt(0) + "." + a2.slice(1)), a2 = a2 + (i2 < 0 ? "e" : "e+") + i2) : i2 < 0 ? (a2 = "0." + H(-i2 - 1) + a2, r10 && (n10 = r10 - s2) > 0 && (a2 += H(n10))) : i2 >= s2 ? (a2 += H(i2 + 1 - s2), r10 && (n10 = r10 - i2 - 1) > 0 && (a2 = a2 + "." + H(n10))) : ((n10 = i2 + 1) < s2 && (a2 = a2.slice(0, n10) + "." + a2.slice(n10)), r10 && (n10 = r10 - s2) > 0 && (i2 + 1 === s2 && (a2 += "."), a2 += H(n10))), e10.s < 0 ? "-" + a2 : a2;
      }
      function X(e10, t10) {
        if (e10.length > t10) return e10.length = t10, true;
      }
      function Y(e10) {
        if (!e10 || "object" != typeof e10) throw Error(en + "Object expected");
        var t10, r10, n10, i2 = ["precision", 1, Z, "rounding", 0, 8, "toExpNeg", -1 / 0, 0, "toExpPos", 0, 1 / 0];
        for (t10 = 0; t10 < i2.length; t10 += 3) if (void 0 !== (n10 = e10[r10 = i2[t10]])) if (es(n10) === n10 && n10 >= i2[t10 + 1] && n10 <= i2[t10 + 2]) this[r10] = n10;
        else throw Error(ei + r10 + ": " + n10);
        if (void 0 !== (n10 = e10[r10 = "LN10"])) if (n10 == Math.LN10) this[r10] = new this(n10);
        else throw Error(ei + r10 + ": " + n10);
        return this;
      }
      var Z, ee, et, er, en, ei, ea, es, eo, el, eu, ec, ed, ep, eh, ef, eg, em, ey, eb = u(() => {
        D(), M(), j(), $(), L(), ew(), Z = 1e9, ee = { precision: 20, rounding: 4, toExpNeg: -7, toExpPos: 21, LN10: "2.302585092994045684017991454684364207601101488628772976033327900967572609677352480235997205089598298341967784042286" }, er = true, ei = (en = "[DecimalError] ") + "Invalid argument: ", ea = en + "Exponent out of range: ", es = Math.floor, eo = Math.pow, el = /^(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i, ec = 1e7, ep = es(9007199254740991 / (ed = 7)), (eh = {}).absoluteValue = eh.abs = function() {
          var e10 = new this.constructor(this);
          return e10.s && (e10.s = 1), e10;
        }, eh.comparedTo = eh.cmp = function(e10) {
          var t10, r10, n10, i2;
          if (e10 = new this.constructor(e10), this.s !== e10.s) return this.s || -e10.s;
          if (this.e !== e10.e) return this.e > e10.e ^ this.s < 0 ? 1 : -1;
          for (n10 = this.d.length, i2 = e10.d.length, t10 = 0, r10 = n10 < i2 ? n10 : i2; t10 < r10; ++t10) if (this.d[t10] !== e10.d[t10]) return this.d[t10] > e10.d[t10] ^ this.s < 0 ? 1 : -1;
          return n10 === i2 ? 0 : n10 > i2 ^ this.s < 0 ? 1 : -1;
        }, eh.decimalPlaces = eh.dp = function() {
          var e10 = this.d.length - 1, t10 = (e10 - this.e) * ed;
          if (e10 = this.d[e10]) for (; e10 % 10 == 0; e10 /= 10) t10--;
          return t10 < 0 ? 0 : t10;
        }, eh.dividedBy = eh.div = function(e10) {
          return ef(this, new this.constructor(e10));
        }, eh.dividedToIntegerBy = eh.idiv = function(e10) {
          var t10 = this.constructor;
          return G(ef(this, new t10(e10), 0, 1), t10.precision);
        }, eh.equals = eh.eq = function(e10) {
          return !this.cmp(e10);
        }, eh.exponent = function() {
          return B(this);
        }, eh.greaterThan = eh.gt = function(e10) {
          return this.cmp(e10) > 0;
        }, eh.greaterThanOrEqualTo = eh.gte = function(e10) {
          return this.cmp(e10) >= 0;
        }, eh.isInteger = eh.isint = function() {
          return this.e > this.d.length - 2;
        }, eh.isNegative = eh.isneg = function() {
          return this.s < 0;
        }, eh.isPositive = eh.ispos = function() {
          return this.s > 0;
        }, eh.isZero = function() {
          return 0 === this.s;
        }, eh.lessThan = eh.lt = function(e10) {
          return 0 > this.cmp(e10);
        }, eh.lessThanOrEqualTo = eh.lte = function(e10) {
          return 1 > this.cmp(e10);
        }, eh.logarithm = eh.log = function(e10) {
          var t10, r10 = this.constructor, n10 = r10.precision, i2 = n10 + 5;
          if (void 0 === e10) e10 = new r10(10);
          else if ((e10 = new r10(e10)).s < 1 || e10.eq(eu)) throw Error(en + "NaN");
          if (this.s < 1) throw Error(en + (this.s ? "NaN" : "-Infinity"));
          return this.eq(eu) ? new r10(0) : (er = false, t10 = ef(K(this, i2), K(e10, i2), i2), er = true, G(t10, n10));
        }, eh.minus = eh.sub = function(e10) {
          return e10 = new this.constructor(e10), this.s == e10.s ? z(this, e10) : q(this, (e10.s = -e10.s, e10));
        }, eh.modulo = eh.mod = function(e10) {
          var t10, r10 = this.constructor, n10 = r10.precision;
          if (!(e10 = new r10(e10)).s) throw Error(en + "NaN");
          return this.s ? (er = false, t10 = ef(this, e10, 0, 1).times(e10), er = true, this.minus(t10)) : G(new r10(this), n10);
        }, eh.naturalExponential = eh.exp = function() {
          return F(this);
        }, eh.naturalLogarithm = eh.ln = function() {
          return K(this);
        }, eh.negated = eh.neg = function() {
          var e10 = new this.constructor(this);
          return e10.s = -e10.s || 0, e10;
        }, eh.plus = eh.add = function(e10) {
          return e10 = new this.constructor(e10), this.s == e10.s ? q(this, e10) : z(this, (e10.s = -e10.s, e10));
        }, eh.precision = eh.sd = function(e10) {
          var t10, r10, n10;
          if (void 0 !== e10 && !!e10 !== e10 && 1 !== e10 && 0 !== e10) throw Error(ei + e10);
          if (t10 = B(this) + 1, r10 = (n10 = this.d.length - 1) * ed + 1, n10 = this.d[n10]) {
            for (; n10 % 10 == 0; n10 /= 10) r10--;
            for (n10 = this.d[0]; n10 >= 10; n10 /= 10) r10++;
          }
          return e10 && t10 > r10 ? t10 : r10;
        }, eh.squareRoot = eh.sqrt = function() {
          var e10, t10, r10, n10, i2, a2, s2, o2 = this.constructor;
          if (this.s < 1) {
            if (!this.s) return new o2(0);
            throw Error(en + "NaN");
          }
          for (e10 = B(this), er = false, 0 == (i2 = Math.sqrt(+this)) || i2 == 1 / 0 ? (((t10 = V(this.d)).length + e10) % 2 == 0 && (t10 += "0"), i2 = Math.sqrt(t10), e10 = es((e10 + 1) / 2) - (e10 < 0 || e10 % 2), n10 = new o2(t10 = i2 == 1 / 0 ? "5e" + e10 : (t10 = i2.toExponential()).slice(0, t10.indexOf("e") + 1) + e10)) : n10 = new o2(i2.toString()), i2 = s2 = (r10 = o2.precision) + 3; ; ) if (n10 = (a2 = n10).plus(ef(this, a2, s2 + 2)).times(0.5), V(a2.d).slice(0, s2) === (t10 = V(n10.d)).slice(0, s2)) {
            if (t10 = t10.slice(s2 - 3, s2 + 1), i2 == s2 && "4999" == t10) {
              if (G(a2, r10 + 1, 0), a2.times(a2).eq(this)) {
                n10 = a2;
                break;
              }
            } else if ("9999" != t10) break;
            s2 += 4;
          }
          return er = true, G(n10, r10);
        }, eh.times = eh.mul = function(e10) {
          var t10, r10, n10, i2, a2, s2, o2, l2, u2, c2 = this.constructor, d2 = this.d, p2 = (e10 = new c2(e10)).d;
          if (!this.s || !e10.s) return new c2(0);
          for (e10.s *= this.s, r10 = this.e + e10.e, (l2 = d2.length) < (u2 = p2.length) && (a2 = d2, d2 = p2, p2 = a2, s2 = l2, l2 = u2, u2 = s2), a2 = [], n10 = s2 = l2 + u2; n10--; ) a2.push(0);
          for (n10 = u2; --n10 >= 0; ) {
            for (t10 = 0, i2 = l2 + n10; i2 > n10; ) o2 = a2[i2] + p2[n10] * d2[i2 - n10 - 1] + t10, a2[i2--] = o2 % ec | 0, t10 = o2 / ec | 0;
            a2[i2] = (a2[i2] + t10) % ec | 0;
          }
          for (; !a2[--s2]; ) a2.pop();
          return t10 ? ++r10 : a2.shift(), e10.d = a2, e10.e = r10, er ? G(e10, c2.precision) : e10;
        }, eh.toDecimalPlaces = eh.todp = function(e10, t10) {
          var r10 = this, n10 = r10.constructor;
          return r10 = new n10(r10), void 0 === e10 ? r10 : (U(e10, 0, Z), void 0 === t10 ? t10 = n10.rounding : U(t10, 0, 8), G(r10, e10 + B(r10) + 1, t10));
        }, eh.toExponential = function(e10, t10) {
          var r10, n10 = this, i2 = n10.constructor;
          return void 0 === e10 ? r10 = Q(n10, true) : (U(e10, 0, Z), void 0 === t10 ? t10 = i2.rounding : U(t10, 0, 8), r10 = Q(n10 = G(new i2(n10), e10 + 1, t10), true, e10 + 1)), r10;
        }, eh.toFixed = function(e10, t10) {
          var r10, n10, i2 = this.constructor;
          return void 0 === e10 ? Q(this) : (U(e10, 0, Z), void 0 === t10 ? t10 = i2.rounding : U(t10, 0, 8), r10 = Q((n10 = G(new i2(this), e10 + B(this) + 1, t10)).abs(), false, e10 + B(n10) + 1), this.isneg() && !this.isZero() ? "-" + r10 : r10);
        }, eh.toInteger = eh.toint = function() {
          var e10 = this.constructor;
          return G(new e10(this), B(this) + 1, e10.rounding);
        }, eh.toNumber = function() {
          return +this;
        }, eh.toPower = eh.pow = function(e10) {
          var t10, r10, n10, i2, a2, s2, o2 = this, l2 = o2.constructor, u2 = +(e10 = new l2(e10));
          if (!e10.s) return new l2(eu);
          if (!(o2 = new l2(o2)).s) {
            if (e10.s < 1) throw Error(en + "Infinity");
            return o2;
          }
          if (o2.eq(eu)) return o2;
          if (n10 = l2.precision, e10.eq(eu)) return G(o2, n10);
          if (s2 = (t10 = e10.e) >= (r10 = e10.d.length - 1), a2 = o2.s, s2) {
            if ((r10 = u2 < 0 ? -u2 : u2) <= 9007199254740991) {
              for (i2 = new l2(eu), t10 = Math.ceil(n10 / ed + 4), er = false; r10 % 2 && X((i2 = i2.times(o2)).d, t10), 0 !== (r10 = es(r10 / 2)); ) X((o2 = o2.times(o2)).d, t10);
              return er = true, e10.s < 0 ? new l2(eu).div(i2) : G(i2, n10);
            }
          } else if (a2 < 0) throw Error(en + "NaN");
          return a2 = a2 < 0 && 1 & e10.d[Math.max(t10, r10)] ? -1 : 1, o2.s = 1, er = false, i2 = e10.times(K(o2, n10 + 12)), er = true, (i2 = F(i2)).s = a2, i2;
        }, eh.toPrecision = function(e10, t10) {
          var r10, n10, i2 = this, a2 = i2.constructor;
          return void 0 === e10 ? (r10 = B(i2), n10 = Q(i2, r10 <= a2.toExpNeg || r10 >= a2.toExpPos)) : (U(e10, 1, Z), void 0 === t10 ? t10 = a2.rounding : U(t10, 0, 8), r10 = B(i2 = G(new a2(i2), e10, t10)), n10 = Q(i2, e10 <= r10 || r10 <= a2.toExpNeg, e10)), n10;
        }, eh.toSignificantDigits = eh.tosd = function(e10, t10) {
          var r10 = this.constructor;
          return void 0 === e10 ? (e10 = r10.precision, t10 = r10.rounding) : (U(e10, 1, Z), void 0 === t10 ? t10 = r10.rounding : U(t10, 0, 8)), G(new r10(this), e10, t10);
        }, eh.toString = eh.valueOf = eh.val = eh.toJSON = eh[Symbol.for("nodejs.util.inspect.custom")] = function() {
          var e10 = B(this), t10 = this.constructor;
          return Q(this, e10 <= t10.toExpNeg || e10 >= t10.toExpPos);
        }, ef = /* @__PURE__ */ function() {
          function e10(e11, t11) {
            var r11, n10 = 0, i2 = e11.length;
            for (e11 = e11.slice(); i2--; ) r11 = e11[i2] * t11 + n10, e11[i2] = r11 % ec | 0, n10 = r11 / ec | 0;
            return n10 && e11.unshift(n10), e11;
          }
          function t10(e11, t11, r11, n10) {
            var i2, a2;
            if (r11 != n10) a2 = r11 > n10 ? 1 : -1;
            else for (i2 = a2 = 0; i2 < r11; i2++) if (e11[i2] != t11[i2]) {
              a2 = e11[i2] > t11[i2] ? 1 : -1;
              break;
            }
            return a2;
          }
          function r10(e11, t11, r11) {
            for (var n10 = 0; r11--; ) e11[r11] -= n10, n10 = +(e11[r11] < t11[r11]), e11[r11] = n10 * ec + e11[r11] - t11[r11];
            for (; !e11[0] && e11.length > 1; ) e11.shift();
          }
          return function(n10, i2, a2, s2) {
            var o2, l2, u2, c2, d2, p2, h2, f2, g2, m2, y2, b2, w2, v2, _2, E2, S2, P2, x2 = n10.constructor, A2 = n10.s == i2.s ? 1 : -1, T2 = n10.d, O2 = i2.d;
            if (!n10.s) return new x2(n10);
            if (!i2.s) throw Error(en + "Division by zero");
            for (l2 = n10.e - i2.e, S2 = O2.length, _2 = T2.length, f2 = (h2 = new x2(A2)).d = [], u2 = 0; O2[u2] == (T2[u2] || 0); ) ++u2;
            if (O2[u2] > (T2[u2] || 0) && --l2, (b2 = null == a2 ? a2 = x2.precision : s2 ? a2 + (B(n10) - B(i2)) + 1 : a2) < 0) return new x2(0);
            if (b2 = b2 / ed + 2 | 0, u2 = 0, 1 == S2) for (c2 = 0, O2 = O2[0], b2++; (u2 < _2 || c2) && b2--; u2++) w2 = c2 * ec + (T2[u2] || 0), f2[u2] = w2 / O2 | 0, c2 = w2 % O2 | 0;
            else {
              for ((c2 = ec / (O2[0] + 1) | 0) > 1 && (O2 = e10(O2, c2), T2 = e10(T2, c2), S2 = O2.length, _2 = T2.length), v2 = S2, m2 = (g2 = T2.slice(0, S2)).length; m2 < S2; ) g2[m2++] = 0;
              (P2 = O2.slice()).unshift(0), E2 = O2[0], O2[1] >= ec / 2 && ++E2;
              do
                c2 = 0, (o2 = t10(O2, g2, S2, m2)) < 0 ? (y2 = g2[0], S2 != m2 && (y2 = y2 * ec + (g2[1] || 0)), (c2 = y2 / E2 | 0) > 1 ? (c2 >= ec && (c2 = ec - 1), p2 = (d2 = e10(O2, c2)).length, m2 = g2.length, 1 == (o2 = t10(d2, g2, p2, m2)) && (c2--, r10(d2, S2 < p2 ? P2 : O2, p2))) : (0 == c2 && (o2 = c2 = 1), d2 = O2.slice()), (p2 = d2.length) < m2 && d2.unshift(0), r10(g2, d2, m2), -1 == o2 && (m2 = g2.length, (o2 = t10(O2, g2, S2, m2)) < 1 && (c2++, r10(g2, S2 < m2 ? P2 : O2, m2))), m2 = g2.length) : 0 === o2 && (c2++, g2 = [0]), f2[u2++] = c2, o2 && g2[0] ? g2[m2++] = T2[v2] || 0 : (g2 = [T2[v2]], m2 = 1);
              while ((v2++ < _2 || void 0 !== g2[0]) && b2--);
            }
            return f2[0] || f2.shift(), h2.e = l2, G(h2, s2 ? a2 + B(h2) + 1 : a2);
          };
        }(), eu = new (et = function e10(t10) {
          var r10, n10, i2;
          function a2(e11) {
            if (!(this instanceof a2)) return new a2(e11);
            if (this.constructor = a2, e11 instanceof a2) {
              this.s = e11.s, this.e = e11.e, this.d = (e11 = e11.d) ? e11.slice() : e11;
              return;
            }
            if ("number" == typeof e11) {
              if (0 * e11 != 0) throw Error(ei + e11);
              if (e11 > 0) this.s = 1;
              else if (e11 < 0) e11 = -e11, this.s = -1;
              else {
                this.s = 0, this.e = 0, this.d = [0];
                return;
              }
              if (e11 === ~~e11 && e11 < 1e7) {
                this.e = 0, this.d = [e11];
                return;
              }
              return J(this, e11.toString());
            }
            if ("string" != typeof e11) throw Error(ei + e11);
            if (45 === e11.charCodeAt(0) ? (e11 = e11.slice(1), this.s = -1) : this.s = 1, el.test(e11)) J(this, e11);
            else throw Error(ei + e11);
          }
          if (a2.prototype = eh, a2.ROUND_UP = 0, a2.ROUND_DOWN = 1, a2.ROUND_CEIL = 2, a2.ROUND_FLOOR = 3, a2.ROUND_HALF_UP = 4, a2.ROUND_HALF_DOWN = 5, a2.ROUND_HALF_EVEN = 6, a2.ROUND_HALF_CEIL = 7, a2.ROUND_HALF_FLOOR = 8, a2.clone = e10, a2.config = a2.set = Y, void 0 === t10 && (t10 = {}), t10) for (i2 = ["precision", "rounding", "toExpNeg", "toExpPos", "LN10"], r10 = 0; r10 < i2.length; ) t10.hasOwnProperty(n10 = i2[r10++]) || (t10[n10] = this[n10]);
          return a2.config(t10), a2;
        }(ee))(1), eg = et;
      }), ew = u(() => {
        eb(), ey = em = class extends eg {
          static isDecimal(e10) {
            return e10 instanceof eg;
          }
          static random(e10 = 20) {
            {
              let t10 = globalThis.crypto.getRandomValues(new Uint8Array(e10)).reduce((e11, t11) => e11 + t11, "");
              return new eg(`0.${t10.slice(0, e10)}`);
            }
          }
        };
      });
      function ev() {
        return false;
      }
      function e_() {
        return { dev: 0, ino: 0, mode: 0, nlink: 0, uid: 0, gid: 0, rdev: 0, size: 0, blksize: 0, blocks: 0, atimeMs: 0, mtimeMs: 0, ctimeMs: 0, birthtimeMs: 0, atime: /* @__PURE__ */ new Date(), mtime: /* @__PURE__ */ new Date(), ctime: /* @__PURE__ */ new Date(), birthtime: /* @__PURE__ */ new Date() };
      }
      function eE() {
        return e_();
      }
      function eS() {
        return [];
      }
      function eP(e10) {
        e10(null, []);
      }
      function ex() {
        return "";
      }
      function eA() {
        return "";
      }
      function eT() {
      }
      function eO() {
      }
      function eR() {
      }
      function eC() {
      }
      function ek() {
      }
      function eN() {
      }
      function eI() {
      }
      function eD() {
      }
      function eM() {
        return { close: () => {
        }, on: () => {
        }, removeAllListeners: () => {
        } };
      }
      function ej(e10, t10) {
        t10(null, e_());
      }
      var e$, eL = u(() => {
        D(), M(), j(), $(), L(), ew(), e$ = { existsSync: ev, lstatSync: e_, stat: ej, statSync: eE, readdirSync: eS, readdir: eP, readlinkSync: ex, realpathSync: eA, chmodSync: eT, renameSync: eO, mkdirSync: eR, rmdirSync: eC, rmSync: ek, unlinkSync: eN, watchFile: eI, unwatchFile: eD, watch: eM, promises: {} };
      });
      function eq(...e10) {
        return e10.join("/");
      }
      function eU(...e10) {
        return e10.join("/");
      }
      function eV(e10) {
        let t10 = eF(e10), r10 = eB(e10), [n10, i2] = t10.split(".");
        return { root: "/", dir: r10, base: t10, ext: i2, name: n10 };
      }
      function eF(e10) {
        let t10 = e10.split("/");
        return t10[t10.length - 1];
      }
      function eB(e10) {
        return e10.split("/").slice(0, -1).join("/");
      }
      function eW(e10) {
        let t10 = e10.split("/").filter((e11) => "" !== e11 && "." !== e11), r10 = [];
        for (let e11 of t10) ".." === e11 ? r10.pop() : r10.push(e11);
        let n10 = r10.join("/");
        return e10.startsWith("/") ? "/" + n10 : n10;
      }
      var eH, eK, eJ = u(() => {
        D(), M(), j(), $(), L(), ew(), eH = { basename: eF, delimiter: ":", dirname: eB, join: eU, normalize: eW, parse: eV, posix: { sep: "/" }, resolve: eq, sep: "/" };
      }), eG = c((e10, t10) => {
        t10.exports = { name: "@prisma/internals", version: "6.16.2", description: "This package is intended for Prisma's internal use", main: "dist/index.js", types: "dist/index.d.ts", repository: { type: "git", url: "https://github.com/prisma/prisma.git", directory: "packages/internals" }, homepage: "https://www.prisma.io", author: "Tim Suchanek <suchanek@prisma.io>", bugs: "https://github.com/prisma/prisma/issues", license: "Apache-2.0", scripts: { dev: "DEV=true tsx helpers/build.ts", build: "tsx helpers/build.ts", test: "dotenv -e ../../.db.env -- jest --silent", prepublishOnly: "pnpm run build" }, files: ["README.md", "dist", "!**/libquery_engine*", "!dist/get-generators/engines/*", "scripts"], devDependencies: { "@babel/helper-validator-identifier": "7.25.9", "@opentelemetry/api": "1.9.0", "@swc/core": "1.11.5", "@swc/jest": "0.2.37", "@types/babel__helper-validator-identifier": "7.15.2", "@types/jest": "29.5.14", "@types/node": "18.19.76", "@types/resolve": "1.20.6", archiver: "6.0.2", "checkpoint-client": "1.1.33", "cli-truncate": "4.0.0", dotenv: "16.5.0", empathic: "2.0.0", "escape-string-regexp": "5.0.0", execa: "5.1.1", "fast-glob": "3.3.3", "find-up": "7.0.0", "fp-ts": "2.16.9", "fs-extra": "11.3.0", "fs-jetpack": "5.1.0", "global-directory": "4.0.0", globby: "11.1.0", "identifier-regex": "1.0.0", "indent-string": "4.0.0", "is-windows": "1.0.2", "is-wsl": "3.1.0", jest: "29.7.0", "jest-junit": "16.0.0", kleur: "4.1.5", "mock-stdin": "1.0.0", "new-github-issue-url": "0.2.1", "node-fetch": "3.3.2", "npm-packlist": "5.1.3", open: "7.4.2", "p-map": "4.0.0", resolve: "1.22.10", "string-width": "7.2.0", "strip-indent": "4.0.0", "temp-dir": "2.0.0", tempy: "1.0.1", "terminal-link": "4.0.0", tmp: "0.2.3", "ts-pattern": "5.6.2", "ts-toolbelt": "9.6.0", typescript: "5.4.5", yarn: "1.22.22" }, dependencies: { "@prisma/config": "workspace:*", "@prisma/debug": "workspace:*", "@prisma/dmmf": "workspace:*", "@prisma/driver-adapter-utils": "workspace:*", "@prisma/engines": "workspace:*", "@prisma/fetch-engine": "workspace:*", "@prisma/generator": "workspace:*", "@prisma/generator-helper": "workspace:*", "@prisma/get-platform": "workspace:*", "@prisma/prisma-schema-wasm": "6.16.0-7.1c57fdcd7e44b29b9313256c76699e91c3ac3c43", "@prisma/schema-engine-wasm": "6.16.0-7.1c57fdcd7e44b29b9313256c76699e91c3ac3c43", "@prisma/schema-files-loader": "workspace:*", arg: "5.0.2", prompts: "2.4.2" }, peerDependencies: { typescript: ">=5.1.0" }, peerDependenciesMeta: { typescript: { optional: true } }, sideEffects: false };
      }), ez = c((e10, t10) => {
        D(), M(), j(), $(), L(), ew(), t10.exports = (e11, t11 = 1, r10) => {
          if (r10 = { indent: " ", includeEmptyLines: false, ...r10 }, "string" != typeof e11) throw TypeError(`Expected \`input\` to be a \`string\`, got \`${typeof e11}\``);
          if ("number" != typeof t11) throw TypeError(`Expected \`count\` to be a \`number\`, got \`${typeof t11}\``);
          if ("string" != typeof r10.indent) throw TypeError(`Expected \`options.indent\` to be a \`string\`, got \`${typeof r10.indent}\``);
          if (0 === t11) return e11;
          let n10 = r10.includeEmptyLines ? /^/gm : /^(?!\s*$)/gm;
          return e11.replace(n10, r10.indent.repeat(t11));
        };
      }), eQ = c((e10, t10) => {
        D(), M(), j(), $(), L(), ew(), t10.exports = /* @__PURE__ */ function() {
          function e11(e12, t11, r10, n10, i2) {
            return e12 < t11 || r10 < t11 ? e12 > r10 ? r10 + 1 : e12 + 1 : n10 === i2 ? t11 : t11 + 1;
          }
          return function(t11, r10) {
            if (t11 === r10) return 0;
            if (t11.length > r10.length) {
              var n10 = t11;
              t11 = r10, r10 = n10;
            }
            for (var i2 = t11.length, a2 = r10.length; i2 > 0 && t11.charCodeAt(i2 - 1) === r10.charCodeAt(a2 - 1); ) i2--, a2--;
            for (var s2 = 0; s2 < i2 && t11.charCodeAt(s2) === r10.charCodeAt(s2); ) s2++;
            if (i2 -= s2, a2 -= s2, 0 === i2 || a2 < 3) return a2;
            var o2, l2, u2, c2, d2, p2, h2, f2, g2, m2, y2, b2, w2 = 0, v2 = [];
            for (o2 = 0; o2 < i2; o2++) v2.push(o2 + 1), v2.push(t11.charCodeAt(s2 + o2));
            for (var _2 = v2.length - 1; w2 < a2 - 3; ) for (g2 = r10.charCodeAt(s2 + (l2 = w2)), m2 = r10.charCodeAt(s2 + (u2 = w2 + 1)), y2 = r10.charCodeAt(s2 + (c2 = w2 + 2)), b2 = r10.charCodeAt(s2 + (d2 = w2 + 3)), p2 = w2 += 4, o2 = 0; o2 < _2; o2 += 2) l2 = e11(h2 = v2[o2], l2, u2, g2, f2 = v2[o2 + 1]), u2 = e11(l2, u2, c2, m2, f2), c2 = e11(u2, c2, d2, y2, f2), p2 = e11(c2, d2, p2, b2, f2), v2[o2] = p2, d2 = c2, c2 = u2, u2 = l2, l2 = h2;
            for (; w2 < a2; ) for (g2 = r10.charCodeAt(s2 + (l2 = w2)), p2 = ++w2, o2 = 0; o2 < _2; o2 += 2) h2 = v2[o2], v2[o2] = p2 = e11(h2, l2, p2, g2, v2[o2 + 1]), l2 = h2;
            return p2;
          };
        }();
      }), eX = u(() => {
        D(), M(), j(), $(), L(), ew();
      }), eY = u(() => {
        D(), M(), j(), $(), L(), ew();
      }), eZ = c((e10, t10) => {
        t10.exports = { name: "@prisma/engines-version", version: "6.16.0-7.1c57fdcd7e44b29b9313256c76699e91c3ac3c43", main: "index.js", types: "index.d.ts", license: "Apache-2.0", author: "Tim Suchanek <suchanek@prisma.io>", prisma: { enginesVersion: "1c57fdcd7e44b29b9313256c76699e91c3ac3c43" }, repository: { type: "git", url: "https://github.com/prisma/engines-wrapper.git", directory: "packages/engines-version" }, devDependencies: { "@types/node": "18.19.76", typescript: "4.9.5" }, files: ["index.js", "index.d.ts"], scripts: { build: "tsc -d" } };
      }), e0 = u(() => {
        D(), M(), j(), $(), L(), ew(), eK = class {
          events = {};
          on(e10, t10) {
            return this.events[e10] || (this.events[e10] = []), this.events[e10].push(t10), this;
          }
          emit(e10, ...t10) {
            return !!this.events[e10] && (this.events[e10].forEach((e11) => {
              e11(...t10);
            }), true);
          }
        };
      }), e1 = {};
      d(e1, { DMMF: () => t3, Debug: () => tw, Decimal: () => ey, Extensions: () => e2, MetricsClient: () => r4, PrismaClientInitializationError: () => tH, PrismaClientKnownRequestError: () => tK, PrismaClientRustPanicError: () => tJ, PrismaClientUnknownRequestError: () => tG, PrismaClientValidationError: () => tz, Public: () => e6, Sql: () => nt, createParam: () => rH, defineDmmfProperty: () => r3, deserializeJsonResponse: () => nU, deserializeRawResult: () => im, dmmfToRuntimeDataModel: () => tZ, empty: () => ni, getPrismaClient: () => iN, getRuntime: () => nG, join: () => nr, makeStrictEnum: () => iM, makeTypedQueryFactory: () => r8, objectEnumValues: () => rN, raw: () => nn, serializeJsonQuery: () => rY, skip: () => rG, sqltag: () => na, warnEnvConflicts: () => void 0, warnOnce: () => tW }), t.exports = p(i({}, "__esModule", { value: true }), e1), D(), M(), j(), $(), L(), ew();
      var e2 = {};
      function e4(e10) {
        return "function" == typeof e10 ? e10 : (t10) => t10.$extends(e10);
      }
      function e3(e10) {
        return e10;
      }
      d(e2, { defineExtension: () => e4, getExtensionContext: () => e3 }), D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew();
      var e6 = {};
      function e5() {
        return (e10) => e10;
      }
      d(e6, { validator: () => e5 }), D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew();
      var e9, e8, e7, te, tt = true;
      "u" > typeof C && ({ FORCE_COLOR: e9, NODE_DISABLE_COLORS: e8, NO_COLOR: e7, TERM: te } = C.env || {}, tt = C.stdout && C.stdout.isTTY);
      var tr = { enabled: !e8 && null == e7 && "dumb" !== te && (null != e9 && "0" !== e9 || tt) };
      function tn(e10, t10) {
        let r10 = RegExp(`\\x1b\\[${t10}m`, "g"), n10 = `\x1B[${e10}m`, i2 = `\x1B[${t10}m`;
        return function(e11) {
          return tr.enabled && null != e11 ? n10 + (~("" + e11).indexOf(i2) ? e11.replace(r10, i2 + n10) : e11) + i2 : e11;
        };
      }
      tn(0, 0);
      var ti = tn(1, 22), ta = tn(2, 22), ts = (tn(3, 23), tn(4, 24)), to = (tn(7, 27), tn(8, 28), tn(9, 29), tn(30, 39), tn(31, 39)), tl = tn(32, 39), tu = tn(33, 39), tc = tn(34, 39), td = (tn(35, 39), tn(36, 39)), tp = (tn(37, 39), tn(90, 39));
      tn(90, 39), tn(40, 49), tn(41, 49), tn(42, 49), tn(43, 49), tn(44, 49), tn(45, 49), tn(46, 49), tn(47, 49), D(), M(), j(), $(), L(), ew();
      var th = ["green", "yellow", "blue", "magenta", "cyan", "red"], tf = [], tg = Date.now(), tm = 0, ty = "u" > typeof C ? C.env : {};
      globalThis.DEBUG ??= ty.DEBUG ?? "", globalThis.DEBUG_COLORS ??= !ty.DEBUG_COLORS || "true" === ty.DEBUG_COLORS;
      var tb = { enable(e10) {
        "string" == typeof e10 && (globalThis.DEBUG = e10);
      }, disable() {
        let e10 = globalThis.DEBUG;
        return globalThis.DEBUG = "", e10;
      }, enabled(e10) {
        let t10 = globalThis.DEBUG.split(",").map((e11) => e11.replace(/[.+?^${}()|[\]\\]/g, "\\$&")), r10 = t10.some((t11) => "" !== t11 && "-" !== t11[0] && e10.match(RegExp(t11.split("*").join(".*") + "$"))), n10 = t10.some((t11) => "" !== t11 && "-" === t11[0] && e10.match(RegExp(t11.slice(1).split("*").join(".*") + "$")));
        return r10 && !n10;
      }, log: (...e10) => {
        let [t10, r10, ...n10] = e10;
        (console.warn ?? console.log)(`${t10} ${r10}`, ...n10);
      }, formatters: {} }, tw = new Proxy(function(e10) {
        let t10 = { color: th[tm++ % th.length], enabled: tb.enabled(e10), namespace: e10, log: tb.log, extend: () => {
        } };
        return new Proxy((...e11) => {
          let { enabled: r10, namespace: n10, color: i2, log: a2 } = t10;
          if (0 !== e11.length && tf.push([n10, ...e11]), tf.length > 100 && tf.shift(), tb.enabled(n10) || r10) {
            let t11 = e11.map((e12) => "string" == typeof e12 ? e12 : function(e13, t12 = 2) {
              let r12 = /* @__PURE__ */ new Set();
              return JSON.stringify(e13, (e14, t13) => {
                if ("object" == typeof t13 && null !== t13) {
                  if (r12.has(t13)) return "[Circular *]";
                  r12.add(t13);
                } else if ("bigint" == typeof t13) return t13.toString();
                return t13;
              }, t12);
            }(e12)), r11 = `+${Date.now() - tg}ms`;
            tg = Date.now(), a2(n10, ...t11, r11);
          }
        }, { get: (e11, r10) => t10[r10], set: (e11, r10, n10) => t10[r10] = n10 });
      }, { get: (e10, t10) => tb[t10], set: (e10, t10, r10) => tb[t10] = r10 });
      D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew();
      var tv = eG().version;
      function t_(e10) {
        let t10;
        return ("library" === (t10 = C.env.PRISMA_CLIENT_ENGINE_TYPE) ? "library" : "binary" === t10 ? "binary" : "client" === t10 ? "client" : void 0) || (e10?.config.engineType === "library" ? "library" : e10?.config.engineType === "binary" ? "binary" : e10?.config.engineType === "client" ? "client" : "library");
      }
      function tE(e10) {
        return "DriverAdapterError" === e10.name && "object" == typeof e10.cause;
      }
      function tS(e10) {
        return { ok: true, value: e10, map: (t10) => tS(t10(e10)), flatMap: (t10) => t10(e10) };
      }
      function tP(e10) {
        return { ok: false, error: e10, map: () => tP(e10), flatMap: () => tP(e10) };
      }
      D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew();
      var tx = tw("driver-adapter-utils"), tA = class {
        registeredErrors = [];
        consumeError(e10) {
          return this.registeredErrors[e10];
        }
        registerNewError(e10) {
          let t10 = 0;
          for (; void 0 !== this.registeredErrors[t10]; ) t10++;
          return this.registeredErrors[t10] = { error: e10 }, t10;
        }
      }, tT = (e10, t10 = new tA()) => {
        var r10, n10;
        let i2 = { adapterName: e10.adapterName, errorRegistry: t10, queryRaw: tR(t10, e10.queryRaw.bind(e10)), executeRaw: tR(t10, e10.executeRaw.bind(e10)), executeScript: tR(t10, e10.executeScript.bind(e10)), dispose: tR(t10, e10.dispose.bind(e10)), provider: e10.provider, startTransaction: async (...r11) => (await tR(t10, e10.startTransaction.bind(e10))(...r11)).map((e11) => tO(t10, e11)) };
        return e10.getConnectionInfo && (r10 = t10, n10 = e10.getConnectionInfo.bind(e10), i2.getConnectionInfo = (...e11) => {
          try {
            return tS(n10(...e11));
          } catch (e12) {
            if (tx("[error@wrapSync]", e12), tE(e12)) return tP(e12.cause);
            return tP({ kind: "GenericJs", id: r10.registerNewError(e12) });
          }
        }), i2;
      }, tO = (e10, t10) => ({ adapterName: t10.adapterName, provider: t10.provider, options: t10.options, queryRaw: tR(e10, t10.queryRaw.bind(t10)), executeRaw: tR(e10, t10.executeRaw.bind(t10)), commit: tR(e10, t10.commit.bind(t10)), rollback: tR(e10, t10.rollback.bind(t10)) });
      function tR(e10, t10) {
        return async (...r10) => {
          try {
            return tS(await t10(...r10));
          } catch (t11) {
            if (tx("[error@wrapAsync]", t11), tE(t11)) return tP(t11.cause);
            return tP({ kind: "GenericJs", id: e10.registerNewError(t11) });
          }
        };
      }
      D(), M(), j(), $(), L(), ew();
      var tC = {};
      d(tC, { error: () => tj, info: () => tM, log: () => tI, query: () => t$, should: () => tN, tags: () => tk, warn: () => tD }), D(), M(), j(), $(), L(), ew();
      var tk = { error: to("prisma:error"), warn: tu("prisma:warn"), info: td("prisma:info"), query: tc("prisma:query") }, tN = { warn: () => !C.env.PRISMA_DISABLE_WARNINGS };
      function tI(...e10) {
        console.log(...e10);
      }
      function tD(e10, ...t10) {
        tN.warn() && console.warn(`${tk.warn} ${e10}`, ...t10);
      }
      function tM(e10, ...t10) {
        console.info(`${tk.info} ${e10}`, ...t10);
      }
      function tj(e10, ...t10) {
        console.error(`${tk.error} ${e10}`, ...t10);
      }
      function t$(e10, ...t10) {
        console.log(`${tk.query} ${e10}`, ...t10);
      }
      function tL(e10, t10) {
        if (!e10) throw Error(`${t10}. This should never happen. If you see this error, please, open an issue at https://pris.ly/prisma-prisma-bug-report`);
      }
      function tq(e10, t10) {
        throw Error(t10);
      }
      D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew();
      var tU = function({ onlyFirst: e10 = false } = {}) {
        return RegExp("[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?(?:\\u0007|\\u001B\\u005C|\\u009C))|(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))", e10 ? void 0 : "g");
      }();
      function tV(e10, t10) {
        let r10 = {};
        for (let n10 of Object.keys(e10)) r10[n10] = t10(e10[n10], n10);
        return r10;
      }
      function tF(e10, t10) {
        Object.defineProperty(e10, "name", { value: t10, configurable: true });
      }
      D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew();
      var tB = /* @__PURE__ */ new Set(), tW = (e10, t10, ...r10) => {
        tB.has(e10) || (tB.add(e10), tD(t10, ...r10));
      }, tH = class e10 extends Error {
        clientVersion;
        errorCode;
        retryable;
        constructor(t10, r10, n10) {
          super(t10), this.name = "PrismaClientInitializationError", this.clientVersion = r10, this.errorCode = n10, Error.captureStackTrace(e10);
        }
        get [Symbol.toStringTag]() {
          return "PrismaClientInitializationError";
        }
      };
      tF(tH, "PrismaClientInitializationError"), D(), M(), j(), $(), L(), ew();
      var tK = class extends Error {
        code;
        meta;
        clientVersion;
        batchRequestIdx;
        constructor(e10, { code: t10, clientVersion: r10, meta: n10, batchRequestIdx: i2 }) {
          super(e10), this.name = "PrismaClientKnownRequestError", this.code = t10, this.clientVersion = r10, this.meta = n10, Object.defineProperty(this, "batchRequestIdx", { value: i2, enumerable: false, writable: true });
        }
        get [Symbol.toStringTag]() {
          return "PrismaClientKnownRequestError";
        }
      };
      tF(tK, "PrismaClientKnownRequestError"), D(), M(), j(), $(), L(), ew();
      var tJ = class extends Error {
        clientVersion;
        constructor(e10, t10) {
          super(e10), this.name = "PrismaClientRustPanicError", this.clientVersion = t10;
        }
        get [Symbol.toStringTag]() {
          return "PrismaClientRustPanicError";
        }
      };
      tF(tJ, "PrismaClientRustPanicError"), D(), M(), j(), $(), L(), ew();
      var tG = class extends Error {
        clientVersion;
        batchRequestIdx;
        constructor(e10, { clientVersion: t10, batchRequestIdx: r10 }) {
          super(e10), this.name = "PrismaClientUnknownRequestError", this.clientVersion = t10, Object.defineProperty(this, "batchRequestIdx", { value: r10, writable: true, enumerable: false });
        }
        get [Symbol.toStringTag]() {
          return "PrismaClientUnknownRequestError";
        }
      };
      tF(tG, "PrismaClientUnknownRequestError"), D(), M(), j(), $(), L(), ew();
      var tz = class extends Error {
        name = "PrismaClientValidationError";
        clientVersion;
        constructor(e10, { clientVersion: t10 }) {
          super(e10), this.clientVersion = t10;
        }
        get [Symbol.toStringTag]() {
          return "PrismaClientValidationError";
        }
      };
      tF(tz, "PrismaClientValidationError"), D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew();
      var tQ = class {
        _map = /* @__PURE__ */ new Map();
        get(e10) {
          return this._map.get(e10)?.value;
        }
        set(e10, t10) {
          this._map.set(e10, { value: t10 });
        }
        getOrCreate(e10, t10) {
          let r10 = this._map.get(e10);
          if (r10) return r10.value;
          let n10 = t10();
          return this.set(e10, n10), n10;
        }
      };
      function tX(e10) {
        return e10.substring(0, 1).toLowerCase() + e10.substring(1);
      }
      function tY(e10) {
        let t10;
        return { get: () => (t10 || (t10 = { value: e10() }), t10.value) };
      }
      function tZ(e10) {
        return { models: t0(e10.models), enums: t0(e10.enums), types: t0(e10.types) };
      }
      function t0(e10) {
        let t10 = {};
        for (let { name: r10, ...n10 } of e10) t10[r10] = n10;
        return t10;
      }
      function t1(e10) {
        return e10 instanceof Date || "[object Date]" === Object.prototype.toString.call(e10);
      }
      function t2(e10) {
        return "Invalid Date" !== e10.toString();
      }
      function t4(e10) {
        return !!em.isDecimal(e10) || null !== e10 && "object" == typeof e10 && "number" == typeof e10.s && "number" == typeof e10.e && "function" == typeof e10.toFixed && Array.isArray(e10.d);
      }
      D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew(), ew(), D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew();
      var t3 = {};
      function t6(e10) {
        return { name: e10.name, values: e10.values.map((e11) => e11.name) };
      }
      d(t3, { ModelAction: () => t5, datamodelEnumToSchemaEnum: () => t6 }), D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew();
      var t5 = ((e10) => (e10.findUnique = "findUnique", e10.findUniqueOrThrow = "findUniqueOrThrow", e10.findFirst = "findFirst", e10.findFirstOrThrow = "findFirstOrThrow", e10.findMany = "findMany", e10.create = "create", e10.createMany = "createMany", e10.createManyAndReturn = "createManyAndReturn", e10.update = "update", e10.updateMany = "updateMany", e10.updateManyAndReturn = "updateManyAndReturn", e10.upsert = "upsert", e10.delete = "delete", e10.deleteMany = "deleteMany", e10.groupBy = "groupBy", e10.count = "count", e10.aggregate = "aggregate", e10.findRaw = "findRaw", e10.aggregateRaw = "aggregateRaw", e10))(t5 || {});
      h(ez());
      var t9 = { red: to, gray: tp, dim: ta, bold: ti, underline: ts, highlightSource: (e10) => e10.highlight() }, t8 = { red: (e10) => e10, gray: (e10) => e10, dim: (e10) => e10, bold: (e10) => e10, underline: (e10) => e10, highlightSource: (e10) => e10 };
      function t7(e10) {
        let t10 = e10.showColors ? t9 : t8;
        return function({ functionName: e11, location: t11, message: r10, isPanic: n10, contextLines: i2, callArguments: a2 }, s2) {
          var o2;
          let l2, u2 = [""], c2 = t11 ? " in" : ":";
          if (n10 ? (u2.push(s2.red(`Oops, an unknown error occurred! This is ${s2.bold("on us")}, you did nothing wrong.`)), u2.push(s2.red(`It occurred in the ${s2.bold(`\`${e11}\``)} invocation${c2}`))) : u2.push(s2.red(`Invalid ${s2.bold(`\`${e11}\``)} invocation${c2}`)), t11 && u2.push(s2.underline((l2 = [(o2 = t11).fileName], o2.lineNumber && l2.push(String(o2.lineNumber)), o2.columnNumber && l2.push(String(o2.columnNumber)), l2.join(":")))), i2) {
            u2.push("");
            let e12 = [i2.toString()];
            a2 && (e12.push(a2), e12.push(s2.dim(")"))), u2.push(e12.join("")), a2 && u2.push("");
          } else u2.push(""), a2 && u2.push(a2), u2.push("");
          return u2.push(r10), u2.join(`
`);
        }("u" > typeof $getTemplateParameters ? $getTemplateParameters(e10, t10) : function({ message: e11, originalMethod: t11, isPanic: r10, callArguments: n10 }) {
          return { functionName: `prisma.${t11}()`, message: e11, isPanic: r10 ?? false, callArguments: n10 };
        }(e10), t10);
      }
      D(), M(), j(), $(), L(), ew();
      var re = h(eQ());
      function rt(e10) {
        let t10 = 0;
        return Array.isArray(e10.selectionPath) && (t10 += e10.selectionPath.length), Array.isArray(e10.argumentPath) && (t10 += e10.argumentPath.length), t10;
      }
      function rr(e10) {
        switch (e10.kind) {
          case "InvalidArgumentValue":
          case "ValueTooLarge":
            return 20;
          case "InvalidArgumentType":
            return 10;
          case "RequiredArgumentMissing":
            return -10;
          default:
            return 0;
        }
      }
      D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew();
      var rn = class {
        constructor(e10, t10) {
          this.name = e10, this.value = t10;
        }
        isRequired = false;
        makeRequired() {
          return this.isRequired = true, this;
        }
        write(e10) {
          let { colors: { green: t10 } } = e10.context;
          e10.addMarginSymbol(t10(this.isRequired ? "+" : "?")), e10.write(t10(this.name)), this.isRequired || e10.write(t10("?")), e10.write(t10(": ")), "string" == typeof this.value ? e10.write(t10(this.value)) : e10.write(this.value);
        }
      };
      D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew(), eY(), D(), M(), j(), $(), L(), ew();
      var ri = class {
        constructor(e10 = 0, t10) {
          this.context = t10, this.currentIndent = e10;
        }
        lines = [];
        currentLine = "";
        currentIndent = 0;
        marginSymbol;
        afterNextNewLineCallback;
        write(e10) {
          return "string" == typeof e10 ? this.currentLine += e10 : e10.write(this), this;
        }
        writeJoined(e10, t10, r10 = (e11, t11) => t11.write(e11)) {
          let n10 = t10.length - 1;
          for (let i2 = 0; i2 < t10.length; i2++) r10(t10[i2], this), i2 !== n10 && this.write(e10);
          return this;
        }
        writeLine(e10) {
          return this.write(e10).newLine();
        }
        newLine() {
          this.lines.push(this.indentedCurrentLine()), this.currentLine = "", this.marginSymbol = void 0;
          let e10 = this.afterNextNewLineCallback;
          return this.afterNextNewLineCallback = void 0, e10?.(), this;
        }
        withIndent(e10) {
          return this.indent(), e10(this), this.unindent(), this;
        }
        afterNextNewline(e10) {
          return this.afterNextNewLineCallback = e10, this;
        }
        indent() {
          return this.currentIndent++, this;
        }
        unindent() {
          return this.currentIndent > 0 && this.currentIndent--, this;
        }
        addMarginSymbol(e10) {
          return this.marginSymbol = e10, this;
        }
        toString() {
          return this.lines.concat(this.indentedCurrentLine()).join(`
`);
        }
        getCurrentLineLength() {
          return this.currentLine.length;
        }
        indentedCurrentLine() {
          let e10 = this.currentLine.padStart(this.currentLine.length + 2 * this.currentIndent);
          return this.marginSymbol ? this.marginSymbol + e10.slice(1) : e10;
        }
      };
      eX(), D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew();
      var ra = class {
        constructor(e10) {
          this.value = e10;
        }
        write(e10) {
          e10.write(this.value);
        }
        markAsError() {
          this.value.markAsError();
        }
      };
      D(), M(), j(), $(), L(), ew();
      var rs = (e10) => e10, ro = { bold: rs, red: rs, green: rs, dim: rs, enabled: false }, rl = { bold: ti, red: to, green: tl, dim: ta, enabled: true }, ru = { write(e10) {
        e10.writeLine(",");
      } };
      D(), M(), j(), $(), L(), ew();
      var rc = class {
        constructor(e10) {
          this.contents = e10;
        }
        isUnderlined = false;
        color = (e10) => e10;
        underline() {
          return this.isUnderlined = true, this;
        }
        setColor(e10) {
          return this.color = e10, this;
        }
        write(e10) {
          let t10 = e10.getCurrentLineLength();
          e10.write(this.color(this.contents)), this.isUnderlined && e10.afterNextNewline(() => {
            e10.write(" ".repeat(t10)).writeLine(this.color("~".repeat(this.contents.length)));
          });
        }
      };
      D(), M(), j(), $(), L(), ew();
      var rd = class {
        hasError = false;
        markAsError() {
          return this.hasError = true, this;
        }
      }, rp = class extends rd {
        items = [];
        addItem(e10) {
          return this.items.push(new ra(e10)), this;
        }
        getField(e10) {
          return this.items[e10];
        }
        getPrintWidth() {
          return 0 === this.items.length ? 2 : Math.max(...this.items.map((e10) => e10.value.getPrintWidth())) + 2;
        }
        write(e10) {
          if (0 === this.items.length) return void this.writeEmpty(e10);
          this.writeWithItems(e10);
        }
        writeEmpty(e10) {
          let t10 = new rc("[]");
          this.hasError && t10.setColor(e10.context.colors.red).underline(), e10.write(t10);
        }
        writeWithItems(e10) {
          let { colors: t10 } = e10.context;
          e10.writeLine("[").withIndent(() => e10.writeJoined(ru, this.items).newLine()).write("]"), this.hasError && e10.afterNextNewline(() => {
            e10.writeLine(t10.red("~".repeat(this.getPrintWidth())));
          });
        }
        asObject() {
        }
      }, rh = class e10 extends rd {
        fields = {};
        suggestions = [];
        addField(e11) {
          this.fields[e11.name] = e11;
        }
        addSuggestion(e11) {
          this.suggestions.push(e11);
        }
        getField(e11) {
          return this.fields[e11];
        }
        getDeepField(t10) {
          let [r10, ...n10] = t10, i2 = this.getField(r10);
          if (!i2) return;
          let a2 = i2;
          for (let t11 of n10) {
            let r11;
            if (a2.value instanceof e10 ? r11 = a2.value.getField(t11) : a2.value instanceof rp && (r11 = a2.value.getField(Number(t11))), !r11) return;
            a2 = r11;
          }
          return a2;
        }
        getDeepFieldValue(e11) {
          return 0 === e11.length ? this : this.getDeepField(e11)?.value;
        }
        hasField(e11) {
          return !!this.getField(e11);
        }
        removeAllFields() {
          this.fields = {};
        }
        removeField(e11) {
          delete this.fields[e11];
        }
        getFields() {
          return this.fields;
        }
        isEmpty() {
          return 0 === Object.keys(this.fields).length;
        }
        getFieldValue(e11) {
          return this.getField(e11)?.value;
        }
        getDeepSubSelectionValue(t10) {
          let r10 = this;
          for (let n10 of t10) {
            if (!(r10 instanceof e10)) return;
            let t11 = r10.getSubSelectionValue(n10);
            if (!t11) return;
            r10 = t11;
          }
          return r10;
        }
        getDeepSelectionParent(t10) {
          let r10 = this.getSelectionParent();
          if (!r10) return;
          let n10 = r10;
          for (let r11 of t10) {
            let t11 = n10.value.getFieldValue(r11);
            if (!t11 || !(t11 instanceof e10)) return;
            let i2 = t11.getSelectionParent();
            if (!i2) return;
            n10 = i2;
          }
          return n10;
        }
        getSelectionParent() {
          let e11 = this.getField("select")?.value.asObject();
          if (e11) return { kind: "select", value: e11 };
          let t10 = this.getField("include")?.value.asObject();
          if (t10) return { kind: "include", value: t10 };
        }
        getSubSelectionValue(e11) {
          return this.getSelectionParent()?.value.fields[e11].value;
        }
        getPrintWidth() {
          let e11 = Object.values(this.fields);
          return 0 == e11.length ? 2 : Math.max(...e11.map((e12) => e12.getPrintWidth())) + 2;
        }
        write(e11) {
          let t10 = Object.values(this.fields);
          if (0 === t10.length && 0 === this.suggestions.length) return void this.writeEmpty(e11);
          this.writeWithContents(e11, t10);
        }
        asObject() {
          return this;
        }
        writeEmpty(e11) {
          let t10 = new rc("{}");
          this.hasError && t10.setColor(e11.context.colors.red).underline(), e11.write(t10);
        }
        writeWithContents(e11, t10) {
          e11.writeLine("{").withIndent(() => {
            e11.writeJoined(ru, [...t10, ...this.suggestions]).newLine();
          }), e11.write("}"), this.hasError && e11.afterNextNewline(() => {
            e11.writeLine(e11.context.colors.red("~".repeat(this.getPrintWidth())));
          });
        }
      };
      D(), M(), j(), $(), L(), ew();
      var rf = class extends rd {
        constructor(e10) {
          super(), this.text = e10;
        }
        getPrintWidth() {
          return this.text.length;
        }
        write(e10) {
          let t10 = new rc(this.text);
          this.hasError && t10.underline().setColor(e10.context.colors.red), e10.write(t10);
        }
        asObject() {
        }
      };
      D(), M(), j(), $(), L(), ew();
      var rg = class {
        fields = [];
        addField(e10, t10) {
          return this.fields.push({ write(r10) {
            let { green: n10, dim: i2 } = r10.context.colors;
            r10.write(n10(i2(`${e10}: ${t10}`))).addMarginSymbol(n10(i2("+")));
          } }), this;
        }
        write(e10) {
          let { colors: { green: t10 } } = e10.context;
          e10.writeLine(t10("{")).withIndent(() => {
            e10.writeJoined(ru, this.fields).newLine();
          }).write(t10("}")).addMarginSymbol(t10("+"));
        }
      };
      function rm(e10, t10, r10) {
        let n10 = [`Unknown argument \`${e10.red(t10)}\`.`], i2 = function(e11, t11) {
          let r11 = 1 / 0, n11;
          for (let i3 of t11) {
            let t12 = (0, re.default)(e11, i3);
            t12 > 3 || t12 < r11 && (r11 = t12, n11 = i3);
          }
          return n11;
        }(t10, r10);
        return i2 && n10.push(`Did you mean \`${e10.green(i2)}\`?`), r10.length > 0 && n10.push(r_(e10)), n10.join(" ");
      }
      function ry(e10, t10) {
        for (let r10 of t10.fields) e10.hasField(r10.name) || e10.addSuggestion(new rn(r10.name, "true"));
      }
      function rb(e10, t10) {
        let [r10, n10] = rv(e10), i2 = t10.arguments.getDeepSubSelectionValue(r10)?.asObject();
        if (!i2) return { parentKind: "unknown", fieldName: n10 };
        let a2 = i2.getFieldValue("select")?.asObject(), s2 = i2.getFieldValue("include")?.asObject(), o2 = i2.getFieldValue("omit")?.asObject(), l2 = a2?.getField(n10);
        return a2 && l2 ? { parentKind: "select", parent: a2, field: l2, fieldName: n10 } : (l2 = s2?.getField(n10), s2 && l2 ? { parentKind: "include", field: l2, parent: s2, fieldName: n10 } : (l2 = o2?.getField(n10), o2 && l2 ? { parentKind: "omit", field: l2, parent: o2, fieldName: n10 } : { parentKind: "unknown", fieldName: n10 }));
      }
      function rw(e10, t10) {
        if ("object" === t10.kind) for (let r10 of t10.fields) e10.hasField(r10.name) || e10.addSuggestion(new rn(r10.name, r10.typeNames.join(" | ")));
      }
      function rv(e10) {
        let t10 = [...e10], r10 = t10.pop();
        if (!r10) throw Error("unexpected empty path");
        return [t10, r10];
      }
      function r_({ green: e10, enabled: t10 }) {
        return "Available options are " + (t10 ? `listed in ${e10("green")}` : "marked with ?") + ".";
      }
      function rE(e10, t10) {
        if (1 === t10.length) return t10[0];
        let r10 = [...t10], n10 = r10.pop();
        return `${r10.join(", ")} ${e10} ${n10}`;
      }
      D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew();
      var rS = class {
        modelName;
        name;
        typeName;
        isList;
        isEnum;
        constructor(e10, t10, r10, n10, i2) {
          this.modelName = e10, this.name = t10, this.typeName = r10, this.isList = n10, this.isEnum = i2;
        }
        _toGraphQLInputType() {
          let e10 = this.isList ? "List" : "", t10 = this.isEnum ? "Enum" : "";
          return `${e10}${t10}${this.typeName}FieldRefInput<${this.modelName}>`;
        }
      };
      function rP(e10) {
        return e10 instanceof rS;
      }
      D(), M(), j(), $(), L(), ew();
      var rx = Symbol(), rA = /* @__PURE__ */ new WeakMap(), rT = class {
        constructor(e10) {
          e10 === rx ? rA.set(this, `Prisma.${this._getName()}`) : rA.set(this, `new Prisma.${this._getNamespace()}.${this._getName()}()`);
        }
        _getName() {
          return this.constructor.name;
        }
        toString() {
          return rA.get(this);
        }
      }, rO = class extends rT {
        _getNamespace() {
          return "NullTypes";
        }
      }, rR = class extends rO {
        #e;
      };
      rI(rR, "DbNull");
      var rC = class extends rO {
        #e;
      };
      rI(rC, "JsonNull");
      var rk = class extends rO {
        #e;
      };
      rI(rk, "AnyNull");
      var rN = { classes: { DbNull: rR, JsonNull: rC, AnyNull: rk }, instances: { DbNull: new rR(rx), JsonNull: new rC(rx), AnyNull: new rk(rx) } };
      function rI(e10, t10) {
        Object.defineProperty(e10, "name", { value: t10, configurable: true });
      }
      D(), M(), j(), $(), L(), ew();
      var rD = class {
        constructor(e10, t10) {
          this.name = e10, this.value = t10;
        }
        hasError = false;
        markAsError() {
          this.hasError = true;
        }
        getPrintWidth() {
          return this.name.length + this.value.getPrintWidth() + 2;
        }
        write(e10) {
          let t10 = new rc(this.name);
          this.hasError && t10.underline().setColor(e10.context.colors.red), e10.write(t10).write(": ").write(this.value);
        }
      }, rM = class {
        arguments;
        errorMessages = [];
        constructor(e10) {
          this.arguments = e10;
        }
        write(e10) {
          e10.write(this.arguments);
        }
        addErrorMessage(e10) {
          this.errorMessages.push(e10);
        }
        renderAllMessages(e10) {
          return this.errorMessages.map((t10) => t10(e10)).join(`
`);
        }
      };
      function rj(e10) {
        return new rM(r$(e10));
      }
      function r$(e10) {
        let t10 = new rh();
        for (let [r10, n10] of Object.entries(e10)) {
          let e11 = new rD(r10, function e12(t11) {
            if ("string" == typeof t11) return new rf(JSON.stringify(t11));
            if ("number" == typeof t11 || "boolean" == typeof t11) return new rf(String(t11));
            if ("bigint" == typeof t11) return new rf(`${t11}n`);
            if (null === t11) return new rf("null");
            if (void 0 === t11) return new rf("undefined");
            if (t4(t11)) return new rf(`new Prisma.Decimal("${t11.toFixed()}")`);
            if (t11 instanceof Uint8Array) return new rf(O.isBuffer(t11) ? `Buffer.alloc(${t11.byteLength})` : `new Uint8Array(${t11.byteLength})`);
            if (t11 instanceof Date) {
              let e13 = t2(t11) ? t11.toISOString() : "Invalid Date";
              return new rf(`new Date("${e13}")`);
            }
            return t11 instanceof rT ? new rf(`Prisma.${t11._getName()}`) : rP(t11) ? new rf(`prisma.${tX(t11.modelName)}.$fields.${t11.name}`) : Array.isArray(t11) ? function(t12) {
              let r11 = new rp();
              for (let n11 of t12) r11.addItem(e12(n11));
              return r11;
            }(t11) : "object" == typeof t11 ? r$(t11) : new rf(Object.prototype.toString.call(t11));
          }(n10));
          t10.addField(e11);
        }
        return t10;
      }
      function rL(e10, t10) {
        let r10 = "pretty" === t10 ? rl : ro;
        return { message: e10.renderAllMessages(r10), args: new ri(0, { colors: r10 }).write(e10).toString() };
      }
      function rq({ args: e10, errors: t10, errorFormat: r10, callsite: n10, originalMethod: i2, clientVersion: a2, globalOmit: s2 }) {
        let o2 = rj(e10);
        for (let e11 of t10) !function e12(t11, r11, n11) {
          switch (t11.kind) {
            case "MutuallyExclusiveFields":
              let i3;
              p2 = t11, h2 = r11, (i3 = h2.arguments.getDeepSubSelectionValue(p2.selectionPath)?.asObject()) && (i3.getField(p2.firstField)?.markAsError(), i3.getField(p2.secondField)?.markAsError()), h2.addErrorMessage((e13) => `Please ${e13.bold("either")} use ${e13.green(`\`${p2.firstField}\``)} or ${e13.green(`\`${p2.secondField}\``)}, but ${e13.red("not both")} at the same time.`);
              break;
            case "IncludeOnScalar":
              !function(e13, t12) {
                let [r12, n12] = rv(e13.selectionPath), i4 = e13.outputType, a4 = t12.arguments.getDeepSelectionParent(r12)?.value;
                if (a4 && (a4.getField(n12)?.markAsError(), i4)) for (let e14 of i4.fields) e14.isRelation && a4.addSuggestion(new rn(e14.name, "true"));
                t12.addErrorMessage((e14) => {
                  let t13 = `Invalid scalar field ${e14.red(`\`${n12}\``)} for ${e14.bold("include")} statement`;
                  return i4 ? t13 += ` on model ${e14.bold(i4.name)}. ${r_(e14)}` : t13 += ".", t13 += `
Note that ${e14.bold("include")} statements only accept relation fields.`;
                });
              }(t11, r11);
              break;
            case "EmptySelection":
              !function(e13, t12, r12) {
                let n12 = t12.arguments.getDeepSubSelectionValue(e13.selectionPath)?.asObject();
                if (n12) {
                  let r13 = n12.getField("omit")?.value.asObject();
                  if (r13) {
                    var i4, a4, s4 = e13, o4 = t12, l4 = r13;
                    for (let e14 of (l4.removeAllFields(), s4.outputType.fields)) l4.addSuggestion(new rn(e14.name, "false"));
                    o4.addErrorMessage((e14) => `The ${e14.red("omit")} statement includes every field of the model ${e14.bold(s4.outputType.name)}. At least one field must be included in the result`);
                    return;
                  }
                  if (n12.hasField("select")) {
                    let r14, n13, s5;
                    return i4 = e13, a4 = t12, r14 = i4.outputType, n13 = a4.arguments.getDeepSelectionParent(i4.selectionPath)?.value, s5 = n13?.isEmpty() ?? false, n13 && (n13.removeAllFields(), ry(n13, r14)), a4.addErrorMessage((e14) => s5 ? `The ${e14.red("`select`")} statement for type ${e14.bold(r14.name)} must not be empty. ${r_(e14)}` : `The ${e14.red("`select`")} statement for type ${e14.bold(r14.name)} needs ${e14.bold("at least one truthy value")}.`);
                  }
                }
                if (r12?.[tX(e13.outputType.name)]) return function(e14, t13) {
                  let r13 = new rg();
                  for (let t14 of e14.outputType.fields) t14.isRelation || r13.addField(t14.name, "false");
                  let n13 = new rn("omit", r13).makeRequired();
                  if (0 === e14.selectionPath.length) t13.arguments.addSuggestion(n13);
                  else {
                    let [r14, i5] = rv(e14.selectionPath), a5 = t13.arguments.getDeepSelectionParent(r14)?.value.asObject()?.getField(i5);
                    if (a5) {
                      let e15 = a5?.value.asObject() ?? new rh();
                      e15.addSuggestion(n13), a5.value = e15;
                    }
                  }
                  t13.addErrorMessage((t14) => `The global ${t14.red("omit")} configuration excludes every field of the model ${t14.bold(e14.outputType.name)}. At least one field must be included in the result`);
                }(e13, t12);
                t12.addErrorMessage(() => `Unknown field at "${e13.selectionPath.join(".")} selection"`);
              }(t11, r11, n11);
              break;
            case "UnknownSelectionField":
              !function(e13, t12) {
                let r12 = rb(e13.selectionPath, t12);
                if ("unknown" !== r12.parentKind) {
                  r12.field.markAsError();
                  let t13 = r12.parent;
                  switch (r12.parentKind) {
                    case "select":
                      ry(t13, e13.outputType);
                      break;
                    case "include":
                      var n12 = t13, i4 = e13.outputType;
                      for (let e14 of i4.fields) e14.isRelation && !n12.hasField(e14.name) && n12.addSuggestion(new rn(e14.name, "true"));
                      break;
                    case "omit":
                      var a4 = t13, s4 = e13.outputType;
                      for (let e14 of s4.fields) a4.hasField(e14.name) || e14.isRelation || a4.addSuggestion(new rn(e14.name, "true"));
                  }
                }
                t12.addErrorMessage((t13) => {
                  let n13 = [`Unknown field ${t13.red(`\`${r12.fieldName}\``)}`];
                  return "unknown" !== r12.parentKind && n13.push(`for ${t13.bold(r12.parentKind)} statement`), n13.push(`on model ${t13.bold(`\`${e13.outputType.name}\``)}.`), n13.push(r_(t13)), n13.join(" ");
                });
              }(t11, r11);
              break;
            case "InvalidSelectionValue":
              let a3;
              f2 = t11, g2 = r11, "unknown" !== (a3 = rb(f2.selectionPath, g2)).parentKind && a3.field.value.markAsError(), g2.addErrorMessage((e13) => `Invalid value for selection field \`${e13.red(a3.fieldName)}\`: ${f2.underlyingError}`);
              break;
            case "UnknownArgument":
              let s3, o3;
              m2 = t11, y2 = r11, s3 = m2.argumentPath[0], (o3 = y2.arguments.getDeepSubSelectionValue(m2.selectionPath)?.asObject()) && (o3.getField(s3)?.markAsError(), function(e13, t12) {
                for (let r12 of t12) e13.hasField(r12.name) || e13.addSuggestion(new rn(r12.name, r12.typeNames.join(" | ")));
              }(o3, m2.arguments)), y2.addErrorMessage((e13) => rm(e13, s3, m2.arguments.map((e14) => e14.name)));
              break;
            case "UnknownInputField":
              !function(e13, t12) {
                let [r12, n12] = rv(e13.argumentPath), i4 = t12.arguments.getDeepSubSelectionValue(e13.selectionPath)?.asObject();
                if (i4) {
                  i4.getDeepField(e13.argumentPath)?.markAsError();
                  let t13 = i4.getDeepFieldValue(r12)?.asObject();
                  t13 && rw(t13, e13.inputType);
                }
                t12.addErrorMessage((t13) => rm(t13, n12, e13.inputType.fields.map((e14) => e14.name)));
              }(t11, r11);
              break;
            case "RequiredArgumentMissing":
              !function(e13, t12) {
                let r12;
                t12.addErrorMessage((e14) => r12?.value instanceof rf && "null" === r12.value.text ? `Argument \`${e14.green(a4)}\` must not be ${e14.red("null")}.` : `Argument \`${e14.green(a4)}\` is missing.`);
                let n12 = t12.arguments.getDeepSubSelectionValue(e13.selectionPath)?.asObject();
                if (!n12) return;
                let [i4, a4] = rv(e13.argumentPath), s4 = new rg(), o4 = n12.getDeepFieldValue(i4)?.asObject();
                if (o4) {
                  if ((r12 = o4.getField(a4)) && o4.removeField(a4), 1 === e13.inputTypes.length && "object" === e13.inputTypes[0].kind) {
                    for (let t13 of e13.inputTypes[0].fields) s4.addField(t13.name, t13.typeNames.join(" | "));
                    o4.addSuggestion(new rn(a4, s4).makeRequired());
                  } else {
                    let t13 = e13.inputTypes.map(function e14(t14) {
                      return "list" === t14.kind ? `${e14(t14.elementType)}[]` : t14.name;
                    }).join(" | ");
                    o4.addSuggestion(new rn(a4, t13).makeRequired());
                  }
                  if (e13.dependentArgumentPath) {
                    n12.getDeepField(e13.dependentArgumentPath)?.markAsError();
                    let [, r13] = rv(e13.dependentArgumentPath);
                    t12.addErrorMessage((e14) => `Argument \`${e14.green(a4)}\` is required because argument \`${e14.green(r13)}\` was provided.`);
                  }
                }
              }(t11, r11);
              break;
            case "InvalidArgumentType":
              let l3, u3;
              b2 = t11, w2 = r11, l3 = b2.argument.name, (u3 = w2.arguments.getDeepSubSelectionValue(b2.selectionPath)?.asObject()) && u3.getDeepFieldValue(b2.argumentPath)?.markAsError(), w2.addErrorMessage((e13) => {
                let t12 = rE("or", b2.argument.typeNames.map((t13) => e13.green(t13)));
                return `Argument \`${e13.bold(l3)}\`: Invalid value provided. Expected ${t12}, provided ${e13.red(b2.inferredType)}.`;
              });
              break;
            case "InvalidArgumentValue":
              let c2, d2;
              v2 = t11, _2 = r11, c2 = v2.argument.name, (d2 = _2.arguments.getDeepSubSelectionValue(v2.selectionPath)?.asObject()) && d2.getDeepFieldValue(v2.argumentPath)?.markAsError(), _2.addErrorMessage((e13) => {
                let t12 = [`Invalid value for argument \`${e13.bold(c2)}\``];
                if (v2.underlyingError && t12.push(`: ${v2.underlyingError}`), t12.push("."), v2.argument.typeNames.length > 0) {
                  let r12 = rE("or", v2.argument.typeNames.map((t13) => e13.green(t13)));
                  t12.push(` Expected ${r12}.`);
                }
                return t12.join("");
              });
              break;
            case "ValueTooLarge":
              var p2, h2, f2, g2, m2, y2, b2, w2, v2, _2, E2 = t11, S2 = r11;
              let P2 = E2.argument.name, x2 = S2.arguments.getDeepSubSelectionValue(E2.selectionPath)?.asObject(), A2;
              if (x2) {
                let e13 = x2.getDeepField(E2.argumentPath)?.value;
                e13?.markAsError(), e13 instanceof rf && (A2 = e13.text);
              }
              S2.addErrorMessage((e13) => {
                let t12 = ["Unable to fit value"];
                return A2 && t12.push(e13.red(A2)), t12.push(`into a 64-bit signed integer for field \`${e13.bold(P2)}\``), t12.join(" ");
              });
              break;
            case "SomeFieldsMissing":
              var T2 = t11, O2 = r11;
              let R2 = T2.argumentPath[T2.argumentPath.length - 1], C2 = O2.arguments.getDeepSubSelectionValue(T2.selectionPath)?.asObject();
              if (C2) {
                let e13 = C2.getDeepFieldValue(T2.argumentPath)?.asObject();
                e13 && rw(e13, T2.inputType);
              }
              O2.addErrorMessage((e13) => {
                let t12 = [`Argument \`${e13.bold(R2)}\` of type ${e13.bold(T2.inputType.name)} needs`];
                return 1 === T2.constraints.minFieldCount ? T2.constraints.requiredFields ? t12.push(`${e13.green("at least one of")} ${rE("or", T2.constraints.requiredFields.map((t13) => `\`${e13.bold(t13)}\``))} arguments.`) : t12.push(`${e13.green("at least one")} argument.`) : t12.push(`${e13.green(`at least ${T2.constraints.minFieldCount}`)} arguments.`), t12.push(r_(e13)), t12.join(" ");
              });
              break;
            case "TooManyFieldsGiven":
              var k2 = t11, N2 = r11;
              let I2 = k2.argumentPath[k2.argumentPath.length - 1], D2 = N2.arguments.getDeepSubSelectionValue(k2.selectionPath)?.asObject(), M2 = [];
              if (D2) {
                let e13 = D2.getDeepFieldValue(k2.argumentPath)?.asObject();
                e13 && (e13.markAsError(), M2 = Object.keys(e13.getFields()));
              }
              N2.addErrorMessage((e13) => {
                let t12 = [`Argument \`${e13.bold(I2)}\` of type ${e13.bold(k2.inputType.name)} needs`];
                return 1 === k2.constraints.minFieldCount && 1 == k2.constraints.maxFieldCount ? t12.push(`${e13.green("exactly one")} argument,`) : 1 == k2.constraints.maxFieldCount ? t12.push(`${e13.green("at most one")} argument,`) : t12.push(`${e13.green(`at most ${k2.constraints.maxFieldCount}`)} arguments,`), t12.push(`but you provided ${rE("and", M2.map((t13) => e13.red(t13)))}. Please choose`), 1 === k2.constraints.maxFieldCount ? t12.push("one.") : t12.push(`${k2.constraints.maxFieldCount}.`), t12.join(" ");
              });
              break;
            case "Union":
              let j2;
              (j2 = function(e13) {
                var t12 = (e14, t13) => {
                  let r13 = rt(e14), n12 = rt(t13);
                  return r13 !== n12 ? r13 - n12 : rr(e14) - rr(t13);
                };
                if (0 === e13.length) return;
                let r12 = e13[0];
                for (let n12 = 1; n12 < e13.length; n12++) 0 > t12(r12, e13[n12]) && (r12 = e13[n12]);
                return r12;
              }(function(e13) {
                let t12 = /* @__PURE__ */ new Map(), r12 = [];
                for (let a4 of e13) {
                  var n12, i4;
                  if ("InvalidArgumentType" !== a4.kind) {
                    r12.push(a4);
                    continue;
                  }
                  let e14 = `${a4.selectionPath.join(".")}:${a4.argumentPath.join(".")}`, s4 = t12.get(e14);
                  s4 ? t12.set(e14, { ...a4, argument: { ...a4.argument, typeNames: (n12 = s4.argument.typeNames, i4 = a4.argument.typeNames, [...new Set(n12.concat(i4))]) } }) : t12.set(e14, a4);
                }
                return r12.push(...t12.values()), r12;
              }(function e13(t12) {
                return t12.errors.flatMap((t13) => "Union" === t13.kind ? e13(t13) : [t13]);
              }(t11)))) ? e12(j2, r11, n11) : r11.addErrorMessage(() => "Unknown error");
              break;
            default:
              throw Error("not implemented: " + t11.kind);
          }
        }(e11, o2, s2);
        let { message: l2, args: u2 } = rL(o2, r10);
        throw new tz(t7({ message: l2, callsite: n10, originalMethod: i2, showColors: "pretty" === r10, callArguments: u2 }), { clientVersion: a2 });
      }
      function rU(e10) {
        return e10.replace(/^./, (e11) => e11.toLowerCase());
      }
      function rV(e10, t10, r10) {
        return r10 ? tV(r10, ({ needs: e11, compute: r11 }, n10) => {
          var i2, a2, s2;
          let o2;
          return { name: n10, needs: e11 ? Object.keys(e11).filter((t11) => e11[t11]) : [], compute: (i2 = t10, a2 = n10, s2 = r11, (o2 = i2?.[a2]?.compute) ? (e12) => s2({ ...e12, [a2]: o2(e12) }) : s2) };
        }) : {};
      }
      D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew();
      var rF = class {
        constructor(e10, t10) {
          this.extension = e10, this.previous = t10;
        }
        computedFieldsCache = new tQ();
        modelExtensionsCache = new tQ();
        queryCallbacksCache = new tQ();
        clientExtensions = tY(() => this.extension.client ? { ...this.previous?.getAllClientExtensions(), ...this.extension.client } : this.previous?.getAllClientExtensions());
        batchCallbacks = tY(() => {
          let e10 = this.previous?.getAllBatchQueryCallbacks() ?? [], t10 = this.extension.query?.$__internalBatch;
          return t10 ? e10.concat(t10) : e10;
        });
        getAllComputedFields(e10) {
          return this.computedFieldsCache.getOrCreate(e10, () => {
            var t10, r10, n10;
            let i2, a2, s2;
            return t10 = this.previous?.getAllComputedFields(e10), r10 = this.extension, i2 = rU(e10), r10.result && (r10.result.$allModels || r10.result[i2]) ? (n10 = { ...t10, ...rV(r10.name, t10, r10.result.$allModels), ...rV(r10.name, t10, r10.result[i2]) }, a2 = new tQ(), s2 = (e11, t11) => a2.getOrCreate(e11, () => t11.has(e11) ? [e11] : (t11.add(e11), n10[e11] ? n10[e11].needs.flatMap((e12) => s2(e12, t11)) : [e11])), tV(n10, (e11) => ({ ...e11, needs: s2(e11.name, /* @__PURE__ */ new Set()) }))) : t10;
          });
        }
        getAllClientExtensions() {
          return this.clientExtensions.get();
        }
        getAllModelExtensions(e10) {
          return this.modelExtensionsCache.getOrCreate(e10, () => {
            let t10 = rU(e10);
            return this.extension.model && (this.extension.model[t10] || this.extension.model.$allModels) ? { ...this.previous?.getAllModelExtensions(e10), ...this.extension.model.$allModels, ...this.extension.model[t10] } : this.previous?.getAllModelExtensions(e10);
          });
        }
        getAllQueryCallbacks(e10, t10) {
          return this.queryCallbacksCache.getOrCreate(`${e10}:${t10}`, () => {
            let r10 = this.previous?.getAllQueryCallbacks(e10, t10) ?? [], n10 = [], i2 = this.extension.query;
            return i2 && (i2[e10] || i2.$allModels || i2[t10] || i2.$allOperations) ? (void 0 !== i2[e10] && (void 0 !== i2[e10][t10] && n10.push(i2[e10][t10]), void 0 !== i2[e10].$allOperations && n10.push(i2[e10].$allOperations)), "$none" !== e10 && void 0 !== i2.$allModels && (void 0 !== i2.$allModels[t10] && n10.push(i2.$allModels[t10]), void 0 !== i2.$allModels.$allOperations && n10.push(i2.$allModels.$allOperations)), void 0 !== i2[t10] && n10.push(i2[t10]), void 0 !== i2.$allOperations && n10.push(i2.$allOperations), r10.concat(n10)) : r10;
          });
        }
        getAllBatchQueryCallbacks() {
          return this.batchCallbacks.get();
        }
      }, rB = class e10 {
        constructor(e11) {
          this.head = e11;
        }
        static empty() {
          return new e10();
        }
        static single(t10) {
          return new e10(new rF(t10));
        }
        isEmpty() {
          return void 0 === this.head;
        }
        append(t10) {
          return new e10(new rF(t10, this.head));
        }
        getAllComputedFields(e11) {
          return this.head?.getAllComputedFields(e11);
        }
        getAllClientExtensions() {
          return this.head?.getAllClientExtensions();
        }
        getAllModelExtensions(e11) {
          return this.head?.getAllModelExtensions(e11);
        }
        getAllQueryCallbacks(e11, t10) {
          return this.head?.getAllQueryCallbacks(e11, t10) ?? [];
        }
        getAllBatchQueryCallbacks() {
          return this.head?.getAllBatchQueryCallbacks() ?? [];
        }
      };
      D(), M(), j(), $(), L(), ew();
      var rW = class {
        constructor(e10) {
          this.name = e10;
        }
      };
      function rH(e10) {
        return new rW(e10);
      }
      D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew();
      var rK = Symbol(), rJ = class {
        constructor(e10) {
          if (e10 !== rK) throw Error("Skip instance can not be constructed directly");
        }
        ifUndefined(e10) {
          return void 0 === e10 ? rG : e10;
        }
      }, rG = new rJ(rK);
      function rz(e10) {
        return e10 instanceof rJ;
      }
      var rQ = { findUnique: "findUnique", findUniqueOrThrow: "findUniqueOrThrow", findFirst: "findFirst", findFirstOrThrow: "findFirstOrThrow", findMany: "findMany", count: "aggregate", create: "createOne", createMany: "createMany", createManyAndReturn: "createManyAndReturn", update: "updateOne", updateMany: "updateMany", updateManyAndReturn: "updateManyAndReturn", upsert: "upsertOne", delete: "deleteOne", deleteMany: "deleteMany", executeRaw: "executeRaw", queryRaw: "queryRaw", aggregate: "aggregate", groupBy: "groupBy", runCommandRaw: "runCommandRaw", findRaw: "findRaw", aggregateRaw: "aggregateRaw" }, rX = "explicitly `undefined` values are not allowed";
      function rY({ modelName: e10, action: t10, args: r10, runtimeDataModel: n10, extensions: i2 = rB.empty(), callsite: a2, clientMethod: s2, errorFormat: o2, clientVersion: l2, previewFeatures: u2, globalOmit: c2 }) {
        let d2 = new r1({ runtimeDataModel: n10, modelName: e10, action: t10, rootArgs: r10, callsite: a2, extensions: i2, selectionPath: [], argumentPath: [], originalMethod: s2, errorFormat: o2, clientVersion: l2, previewFeatures: u2, globalOmit: c2 });
        return { modelName: e10, action: rQ[t10], query: function e11({ select: t11, include: r11, ...n11 } = {}, i3) {
          var a3, s3, o3, l3, u3, c3, d3;
          let p2, h2 = n11.omit;
          return delete n11.omit, { arguments: rZ(n11, i3), selection: (a3 = t11, s3 = r11, o3 = h2, l3 = i3, a3 ? (s3 ? l3.throwValidationError({ kind: "MutuallyExclusiveFields", firstField: "include", secondField: "select", selectionPath: l3.getSelectionPath() }) : o3 && l3.throwValidationError({ kind: "MutuallyExclusiveFields", firstField: "omit", secondField: "select", selectionPath: l3.getSelectionPath() }), function(t12, r12) {
            let n12 = {}, i4 = r12.getComputedFields();
            for (let [a4, s4] of Object.entries(function(e12, t13) {
              if (!t13) return e12;
              let r13 = { ...e12 };
              for (let n13 of Object.values(t13)) if (e12[n13.name]) for (let e13 of n13.needs) r13[e13] = true;
              return r13;
            }(t12, i4))) {
              if (rz(s4)) continue;
              let t13 = r12.nestSelection(a4);
              r0(s4, t13);
              let o4 = r12.findField(a4);
              if (!(i4?.[a4] && !o4)) {
                if (false === s4 || void 0 === s4 || rz(s4)) {
                  n12[a4] = false;
                  continue;
                }
                if (true === s4) {
                  o4?.kind === "object" ? n12[a4] = e11({}, t13) : n12[a4] = true;
                  continue;
                }
                n12[a4] = e11(s4, t13);
              }
            }
            return n12;
          }(a3, l3)) : (u3 = l3, c3 = s3, d3 = o3, p2 = {}, u3.modelOrType && !u3.isRawAction() && (p2.$composites = true, p2.$scalars = true), c3 && function(t12, r12, n12) {
            for (let [i4, a4] of Object.entries(r12)) {
              if (rz(a4)) continue;
              let r13 = n12.nestSelection(i4);
              if (r0(a4, r13), false === a4 || void 0 === a4) {
                t12[i4] = false;
                continue;
              }
              let s4 = n12.findField(i4);
              if (s4 && "object" !== s4.kind && n12.throwValidationError({ kind: "IncludeOnScalar", selectionPath: n12.getSelectionPath().concat(i4), outputType: n12.getOutputTypeDescription() }), s4) {
                t12[i4] = e11(true === a4 ? {} : a4, r13);
                continue;
              }
              if (true === a4) {
                t12[i4] = true;
                continue;
              }
              t12[i4] = e11(a4, r13);
            }
          }(p2, c3, u3), function(e12, t12, r12) {
            let n12 = r12.getComputedFields();
            for (let [i4, a4] of Object.entries(function(e13, t13) {
              if (!t13) return e13;
              let r13 = { ...e13 };
              for (let n13 of Object.values(t13)) if (!e13[n13.name]) for (let e14 of n13.needs) delete r13[e14];
              return r13;
            }({ ...r12.getGlobalOmit(), ...t12 }, n12))) {
              if (rz(a4)) continue;
              r0(a4, r12.nestSelection(i4));
              let t13 = r12.findField(i4);
              n12?.[i4] && !t13 || (e12[i4] = !a4);
            }
          }(p2, d3, u3), p2)) };
        }(r10, d2) };
      }
      function rZ(e10, t10) {
        if (e10.$type) return { $type: "Raw", value: e10 };
        let r10 = {};
        for (let n10 in e10) {
          let i2 = e10[n10], a2 = t10.nestArgument(n10);
          rz(i2) || (void 0 !== i2 ? r10[n10] = function e11(t11, r11) {
            var n11, i3;
            if (null === t11) return null;
            if ("string" == typeof t11 || "number" == typeof t11 || "boolean" == typeof t11) return t11;
            if ("bigint" == typeof t11) return { $type: "BigInt", value: String(t11) };
            if (t1(t11)) {
              if (t2(t11)) return { $type: "DateTime", value: t11.toISOString() };
              r11.throwValidationError({ kind: "InvalidArgumentValue", selectionPath: r11.getSelectionPath(), argumentPath: r11.getArgumentPath(), argument: { name: r11.getArgumentName(), typeNames: ["Date"] }, underlyingError: "Provided Date object is invalid" });
            }
            if (t11 instanceof rW) return { $type: "Param", value: t11.name };
            if (rP(t11)) return { $type: "FieldRef", value: { _ref: t11.name, _container: t11.modelName } };
            if (Array.isArray(t11)) return function(t12, r12) {
              let n12 = [];
              for (let i4 = 0; i4 < t12.length; i4++) {
                let a3 = r12.nestArgument(String(i4)), s2 = t12[i4];
                if (void 0 === s2 || rz(s2)) {
                  let e12 = void 0 === s2 ? "undefined" : "Prisma.skip";
                  r12.throwValidationError({ kind: "InvalidArgumentValue", selectionPath: a3.getSelectionPath(), argumentPath: a3.getArgumentPath(), argument: { name: `${r12.getArgumentName()}[${i4}]`, typeNames: [] }, underlyingError: `Can not use \`${e12}\` value within array. Use \`null\` or filter out \`${e12}\` values` });
                }
                n12.push(e11(s2, a3));
              }
              return n12;
            }(t11, r11);
            if (ArrayBuffer.isView(t11)) {
              let { buffer: e12, byteOffset: r12, byteLength: n12 } = t11;
              return { $type: "Bytes", value: O.from(e12, r12, n12).toString("base64") };
            }
            if ("object" == typeof (n11 = t11) && null !== n11 && true === n11.__prismaRawParameters__) return t11.values;
            if (t4(t11)) return { $type: "Decimal", value: t11.toFixed() };
            if (t11 instanceof rT) {
              if (t11 !== rN.instances[t11._getName()]) throw Error("Invalid ObjectEnumValue");
              return { $type: "Enum", value: t11._getName() };
            }
            return "object" == typeof (i3 = t11) && null !== i3 && "function" == typeof i3.toJSON ? t11.toJSON() : "object" == typeof t11 ? rZ(t11, r11) : void r11.throwValidationError({ kind: "InvalidArgumentValue", selectionPath: r11.getSelectionPath(), argumentPath: r11.getArgumentPath(), argument: { name: r11.getArgumentName(), typeNames: [] }, underlyingError: `We could not serialize ${Object.prototype.toString.call(t11)} value. Serialize the object to JSON or implement a ".toJSON()" method on it` });
          }(i2, a2) : t10.isPreviewFeatureOn("strictUndefinedChecks") && t10.throwValidationError({ kind: "InvalidArgumentValue", argumentPath: a2.getArgumentPath(), selectionPath: t10.getSelectionPath(), argument: { name: t10.getArgumentName(), typeNames: [] }, underlyingError: rX }));
        }
        return r10;
      }
      function r0(e10, t10) {
        void 0 === e10 && t10.isPreviewFeatureOn("strictUndefinedChecks") && t10.throwValidationError({ kind: "InvalidSelectionValue", selectionPath: t10.getSelectionPath(), underlyingError: rX });
      }
      var r1 = class e10 {
        constructor(e11) {
          this.params = e11, this.params.modelName && (this.modelOrType = this.params.runtimeDataModel.models[this.params.modelName] ?? this.params.runtimeDataModel.types[this.params.modelName]);
        }
        modelOrType;
        throwValidationError(e11) {
          rq({ errors: [e11], originalMethod: this.params.originalMethod, args: this.params.rootArgs ?? {}, callsite: this.params.callsite, errorFormat: this.params.errorFormat, clientVersion: this.params.clientVersion, globalOmit: this.params.globalOmit });
        }
        getSelectionPath() {
          return this.params.selectionPath;
        }
        getArgumentPath() {
          return this.params.argumentPath;
        }
        getArgumentName() {
          return this.params.argumentPath[this.params.argumentPath.length - 1];
        }
        getOutputTypeDescription() {
          if (!(!this.params.modelName || !this.modelOrType)) return { name: this.params.modelName, fields: this.modelOrType.fields.map((e11) => ({ name: e11.name, typeName: "boolean", isRelation: "object" === e11.kind })) };
        }
        isRawAction() {
          return ["executeRaw", "queryRaw", "runCommandRaw", "findRaw", "aggregateRaw"].includes(this.params.action);
        }
        isPreviewFeatureOn(e11) {
          return this.params.previewFeatures.includes(e11);
        }
        getComputedFields() {
          if (this.params.modelName) return this.params.extensions.getAllComputedFields(this.params.modelName);
        }
        findField(e11) {
          return this.modelOrType?.fields.find((t10) => t10.name === e11);
        }
        nestSelection(t10) {
          let r10 = this.findField(t10), n10 = r10?.kind === "object" ? r10.type : void 0;
          return new e10({ ...this.params, modelName: n10, selectionPath: this.params.selectionPath.concat(t10) });
        }
        getGlobalOmit() {
          return this.params.modelName && this.shouldApplyGlobalOmit() ? this.params.globalOmit?.[tX(this.params.modelName)] ?? {} : {};
        }
        shouldApplyGlobalOmit() {
          switch (this.params.action) {
            case "findFirst":
            case "findFirstOrThrow":
            case "findUniqueOrThrow":
            case "findMany":
            case "upsert":
            case "findUnique":
            case "createManyAndReturn":
            case "create":
            case "update":
            case "updateManyAndReturn":
            case "delete":
              return true;
            case "executeRaw":
            case "aggregateRaw":
            case "runCommandRaw":
            case "findRaw":
            case "createMany":
            case "deleteMany":
            case "groupBy":
            case "updateMany":
            case "count":
            case "aggregate":
            case "queryRaw":
              return false;
            default:
              tq(this.params.action, "Unknown action");
          }
        }
        nestArgument(t10) {
          return new e10({ ...this.params, argumentPath: this.params.argumentPath.concat(t10) });
        }
      };
      function r2(e10) {
        if (!e10._hasPreviewFlag("metrics")) throw new tz("`metrics` preview feature must be enabled in order to access metrics API", { clientVersion: e10._clientVersion });
      }
      D(), M(), j(), $(), L(), ew();
      var r4 = class {
        _client;
        constructor(e10) {
          this._client = e10;
        }
        prometheus(e10) {
          return r2(this._client), this._client._engine.metrics({ format: "prometheus", ...e10 });
        }
        json(e10) {
          return r2(this._client), this._client._engine.metrics({ format: "json", ...e10 });
        }
      };
      function r3(e10, t10) {
        let r10 = tY(() => function(e11) {
          throw Error("Prisma.dmmf is not available when running in edge runtimes.");
        }(0));
        Object.defineProperty(e10, "dmmf", { get: () => r10.get() });
      }
      D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew();
      var r6 = /* @__PURE__ */ new WeakMap(), r5 = "$$PrismaTypedSql", r9 = class {
        constructor(e10, t10) {
          r6.set(this, { sql: e10, values: t10 }), Object.defineProperty(this, r5, { value: r5 });
        }
        get sql() {
          return r6.get(this).sql;
        }
        get values() {
          return r6.get(this).values;
        }
      };
      function r8(e10) {
        return (...t10) => new r9(e10, t10);
      }
      function r7(e10) {
        return null != e10 && e10[r5] === r5;
      }
      D(), M(), j(), $(), L(), ew();
      var ne = h(eZ());
      D(), M(), j(), $(), L(), ew(), e0(), eL(), eJ(), D(), M(), j(), $(), L(), ew();
      var nt = class e10 {
        constructor(t10, r10) {
          if (t10.length - 1 !== r10.length) throw 0 === t10.length ? TypeError("Expected at least 1 string") : TypeError(`Expected ${t10.length} strings to have ${t10.length - 1} values`);
          let n10 = r10.reduce((t11, r11) => t11 + (r11 instanceof e10 ? r11.values.length : 1), 0);
          this.values = Array(n10), this.strings = Array(n10 + 1), this.strings[0] = t10[0];
          let i2 = 0, a2 = 0;
          for (; i2 < r10.length; ) {
            let n11 = r10[i2++], s2 = t10[i2];
            if (n11 instanceof e10) {
              this.strings[a2] += n11.strings[0];
              let e11 = 0;
              for (; e11 < n11.values.length; ) this.values[a2++] = n11.values[e11++], this.strings[a2] = n11.strings[e11];
              this.strings[a2] += s2;
            } else this.values[a2++] = n11, this.strings[a2] = s2;
          }
        }
        get sql() {
          let e11 = this.strings.length, t10 = 1, r10 = this.strings[0];
          for (; t10 < e11; ) r10 += `?${this.strings[t10++]}`;
          return r10;
        }
        get statement() {
          let e11 = this.strings.length, t10 = 1, r10 = this.strings[0];
          for (; t10 < e11; ) r10 += `:${t10}${this.strings[t10++]}`;
          return r10;
        }
        get text() {
          let e11 = this.strings.length, t10 = 1, r10 = this.strings[0];
          for (; t10 < e11; ) r10 += `$${t10}${this.strings[t10++]}`;
          return r10;
        }
        inspect() {
          return { sql: this.sql, statement: this.statement, text: this.text, values: this.values };
        }
      };
      function nr(e10, t10 = ",", r10 = "", n10 = "") {
        if (0 === e10.length) throw TypeError("Expected `join([])` to be called with an array of multiple elements, but got an empty array");
        return new nt([r10, ...Array(e10.length - 1).fill(t10), n10], e10);
      }
      function nn(e10) {
        return new nt([e10], []);
      }
      var ni = nn("");
      function na(e10, ...t10) {
        return new nt(e10, t10);
      }
      function ns(e10) {
        return { getKeys: () => Object.keys(e10), getPropertyValue: (t10) => e10[t10] };
      }
      function no(e10, t10) {
        return { getKeys: () => [e10], getPropertyValue: () => t10() };
      }
      function nl(e10) {
        let t10 = new tQ();
        return { getKeys: () => e10.getKeys(), getPropertyValue: (r10) => t10.getOrCreate(r10, () => e10.getPropertyValue(r10)), getPropertyDescriptor: (t11) => e10.getPropertyDescriptor?.(t11) };
      }
      D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew();
      var nu = { enumerable: true, configurable: true, writable: true };
      function nc(e10) {
        let t10 = new Set(e10);
        return { getPrototypeOf: () => Object.prototype, getOwnPropertyDescriptor: () => nu, has: (e11, r10) => t10.has(r10), set: (e11, r10, n10) => t10.add(r10) && Reflect.set(e11, r10, n10), ownKeys: () => [...t10] };
      }
      var nd = Symbol.for("nodejs.util.inspect.custom");
      function np(e10, t10) {
        let r10 = function(e11) {
          let t11 = /* @__PURE__ */ new Map();
          for (let r11 of e11) for (let e12 of r11.getKeys()) t11.set(e12, r11);
          return t11;
        }(t10), n10 = /* @__PURE__ */ new Set(), i2 = new Proxy(e10, { get(e11, t11) {
          if (n10.has(t11)) return e11[t11];
          let i3 = r10.get(t11);
          return i3 ? i3.getPropertyValue(t11) : e11[t11];
        }, has(e11, t11) {
          if (n10.has(t11)) return true;
          let i3 = r10.get(t11);
          return i3 ? i3.has?.(t11) ?? true : Reflect.has(e11, t11);
        }, ownKeys: (e11) => [.../* @__PURE__ */ new Set([...nh(Reflect.ownKeys(e11), r10), ...nh(Array.from(r10.keys()), r10), ...n10])], set: (e11, t11, i3) => r10.get(t11)?.getPropertyDescriptor?.(t11)?.writable !== false && (n10.add(t11), Reflect.set(e11, t11, i3)), getOwnPropertyDescriptor(e11, t11) {
          let n11 = Reflect.getOwnPropertyDescriptor(e11, t11);
          if (n11 && !n11.configurable) return n11;
          let i3 = r10.get(t11);
          return i3 ? i3.getPropertyDescriptor ? { ...nu, ...i3?.getPropertyDescriptor(t11) } : nu : n11;
        }, defineProperty: (e11, t11, r11) => (n10.add(t11), Reflect.defineProperty(e11, t11, r11)), getPrototypeOf: () => Object.prototype });
        return i2[nd] = function() {
          let e11 = { ...this };
          return delete e11[nd], e11;
        }, i2;
      }
      function nh(e10, t10) {
        return e10.filter((e11) => t10.get(e11)?.has?.(e11) ?? true);
      }
      function nf(e10) {
        return { getKeys: () => e10, has: () => false, getPropertyValue() {
        } };
      }
      function ng(e10, t10) {
        return { batch: e10, transaction: t10?.kind === "batch" ? { isolationLevel: t10.options.isolationLevel } : void 0 };
      }
      function nm({ error: e10, user_facing_error: t10 }, r10, n10) {
        var i2, a2;
        let s2;
        return t10.error_code ? new tK((i2 = t10, a2 = n10, s2 = i2.message, ("postgresql" === a2 || "postgres" === a2 || "mysql" === a2) && "P2037" === i2.error_code && (s2 += `
Prisma Accelerate has built-in connection pooling to prevent such errors: https://pris.ly/client/error-accelerate`), s2), { code: t10.error_code, clientVersion: r10, meta: t10.meta, batchRequestIdx: t10.batch_request_idx }) : new tG(e10, { clientVersion: r10, batchRequestIdx: t10.batch_request_idx });
      }
      D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew();
      var ny = class {
        getLocation() {
          return null;
        }
      };
      function nb(e10) {
        return "function" == typeof $EnabledCallSite && "minimal" !== e10 ? new $EnabledCallSite() : new ny();
      }
      D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew();
      var nw = { _avg: true, _count: true, _sum: true, _min: true, _max: true };
      function nv(e10 = {}) {
        return Object.entries(function(e11 = {}) {
          return "boolean" == typeof e11._count ? { ...e11, _count: { _all: e11._count } } : e11;
        }(e10)).reduce((e11, [t10, r10]) => (void 0 !== nw[t10] ? e11.select[t10] = { select: r10 } : e11[t10] = r10, e11), { select: {} });
      }
      function n_(e10 = {}) {
        return (t10) => ("boolean" == typeof e10._count && (t10._count = t10._count._all), t10);
      }
      function nE(e10 = {}) {
        let { select: t10, ...r10 } = e10;
        return "object" == typeof t10 ? nv({ ...r10, _count: t10 }) : nv({ ...r10, _count: { _all: true } });
      }
      function nS(e10 = {}) {
        let t10 = nv(e10);
        if (Array.isArray(t10.by)) for (let e11 of t10.by) "string" == typeof e11 && (t10.select[e11] = true);
        else "string" == typeof t10.by && (t10.select[t10.by] = true);
        return t10;
      }
      D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew();
      var nP = (e10) => Array.isArray(e10) ? e10 : e10.split("."), nx = (e10, t10) => nP(t10).reduce((e11, t11) => e11 && e11[t11], e10), nA = ["findUnique", "findUniqueOrThrow", "findFirst", "findFirstOrThrow", "create", "update", "upsert", "delete"], nT = ["aggregate", "count", "groupBy"];
      function nO(e10, t10) {
        var r10, n10, i2, a2;
        let s2, o2, l2 = e10._extensions.getAllModelExtensions(t10) ?? {};
        return np({}, [(r10 = e10, s2 = rU(n10 = t10), o2 = Object.keys(t5).concat("count"), { getKeys: () => o2, getPropertyValue(e11) {
          var t11;
          let i3 = (t12) => (i4) => {
            let a3 = nb(r10._errorFormat);
            return r10._createPrismaPromise((o3) => {
              let l3 = { args: i4, dataPath: [], action: e11, model: n10, clientMethod: `${s2}.${e11}`, jsModelName: s2, transaction: o3, callsite: a3 };
              return r10._request({ ...l3, ...t12 });
            }, { action: e11, args: i4, model: n10 });
          };
          return nA.includes(e11) ? function e12(t12, r11, n11, i4, a3, s3) {
            let o3 = t12._runtimeDataModel.models[r11].fields.reduce((e13, t13) => ({ ...e13, [t13.name]: t13 }), {});
            return (l3) => {
              var u2, c2;
              let d2, p2 = nb(t12._errorFormat), h2 = void 0 === i4 || void 0 === a3 ? [] : [...a3, "select", i4], f2 = void 0 === s3 ? l3 ?? {} : (d2 = l3 || true, nP(h2).reduceRight((e13, t13, r12, n12) => Object.assign({}, nx(s3, n12.slice(0, r12)), { [t13]: e13 }), d2)), g2 = n11({ dataPath: h2, callsite: p2 })(f2), m2 = (u2 = t12, c2 = r11, u2._runtimeDataModel.models[c2].fields.filter((e13) => "object" === e13.kind).map((e13) => e13.name));
              return new Proxy(g2, { get: (r12, i5) => m2.includes(i5) ? e12(t12, o3[i5].type, n11, i5, h2, f2) : r12[i5], ...nc([...m2, ...Object.getOwnPropertyNames(g2)]) });
            };
          }(r10, n10, i3) : (t11 = e11, nT.includes(t11)) ? "aggregate" === e11 ? (e12) => i3({ action: "aggregate", unpacker: n_(e12), argsMapper: nv })(e12) : "count" === e11 ? (e12) => i3({ action: "count", unpacker: function(e13 = {}) {
            return "object" == typeof e13.select ? (t12) => n_(e13)(t12)._count : (t12) => n_(e13)(t12)._count._all;
          }(e12), argsMapper: nE })(e12) : "groupBy" === e11 ? (e12) => i3({ action: "groupBy", unpacker: /* @__PURE__ */ function(e13 = {}) {
            return (t12) => ("boolean" == typeof e13?._count && t12.forEach((e14) => {
              e14._count = e14._count._all;
            }), t12);
          }(e12), argsMapper: nS })(e12) : void 0 : i3({});
        } }), (i2 = e10, a2 = t10, nl(no("fields", () => {
          let e11, t11 = i2._runtimeDataModel.models[a2];
          return new Proxy({}, { get(t12, r11) {
            if (r11 in t12 || "symbol" == typeof r11) return t12[r11];
            let n11 = e11[r11];
            if (n11) return new rS(a2, r11, n11.type, n11.isList, "enum" === n11.kind);
          }, ...nc(Object.keys(e11 = function(e12, t12) {
            let r11 = {};
            for (let n11 of e12) r11[n11[t12]] = n11;
            return r11;
          }(t11.fields.filter((e12) => !e12.relationName), "name"))) });
        }))), ns(l2), no("name", () => t10), no("$name", () => t10), no("$parent", () => e10._appliedParent)]);
      }
      D(), M(), j(), $(), L(), ew();
      var nR = Symbol();
      function nC(e10) {
        var t10, r10;
        let n10, i2, a2, s2, o2 = [(n10 = [...new Set(Object.getOwnPropertyNames(Object.getPrototypeOf((t10 = e10)._originalClient)))], { getKeys: () => n10, getPropertyValue: (e11) => t10[e11] }), (a2 = (i2 = Object.keys((r10 = e10)._runtimeDataModel.models)).map(rU), s2 = [...new Set(i2.concat(a2))], nl({ getKeys: () => s2, getPropertyValue(e11) {
          let t11 = e11.replace(/^./, (e12) => e12.toUpperCase());
          return void 0 !== r10._runtimeDataModel.models[t11] ? nO(r10, t11) : void 0 !== r10._runtimeDataModel.models[e11] ? nO(r10, e11) : void 0;
        }, getPropertyDescriptor(e11) {
          if (!a2.includes(e11)) return { enumerable: false };
        } })), no(nR, () => e10), no("$parent", () => e10._appliedParent)], l2 = e10._extensions.getAllClientExtensions();
        return l2 && o2.push(ns(l2)), np(e10, o2);
      }
      function nk(e10) {
        if ("function" == typeof e10) return e10(this);
        if (e10.client?.__AccelerateEngine) {
          let t10 = e10.client.__AccelerateEngine;
          this._originalClient._engine = new t10(this._originalClient._accelerateEngineConfig);
        }
        return nC(Object.create(this._originalClient, { _extensions: { value: this._extensions.append(e10) }, _appliedParent: { value: this, configurable: true }, $on: { value: void 0 } }));
      }
      function nN({ visitor: e10, result: t10, args: r10, runtimeDataModel: n10, modelName: i2 }) {
        if (Array.isArray(t10)) {
          for (let a3 = 0; a3 < t10.length; a3++) t10[a3] = nN({ result: t10[a3], args: r10, modelName: i2, runtimeDataModel: n10, visitor: e10 });
          return t10;
        }
        let a2 = e10(t10, i2, r10) ?? t10;
        return r10.include && nI({ includeOrSelect: r10.include, result: a2, parentModelName: i2, runtimeDataModel: n10, visitor: e10 }), r10.select && nI({ includeOrSelect: r10.select, result: a2, parentModelName: i2, runtimeDataModel: n10, visitor: e10 }), a2;
      }
      function nI({ includeOrSelect: e10, result: t10, parentModelName: r10, runtimeDataModel: n10, visitor: i2 }) {
        for (let [a2, s2] of Object.entries(e10)) {
          if (!s2 || null == t10[a2] || rz(s2)) continue;
          let e11 = n10.models[r10].fields.find((e12) => e12.name === a2);
          if (!e11 || "object" !== e11.kind || !e11.relationName) continue;
          let o2 = "object" == typeof s2 ? s2 : {};
          t10[a2] = nN({ visitor: i2, result: t10[a2], args: o2, modelName: e11.type, runtimeDataModel: n10 });
        }
      }
      D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew(), ew(), D(), M(), j(), $(), L(), ew();
      var nD = ["$connect", "$disconnect", "$on", "$transaction", "$extends"];
      function nM(e10) {
        if ("object" != typeof e10 || null == e10 || e10 instanceof rT || rP(e10)) return e10;
        if (t4(e10)) return new ey(e10.toFixed());
        if (t1(e10)) return /* @__PURE__ */ new Date(+e10);
        if (ArrayBuffer.isView(e10)) return e10.slice(0);
        if (Array.isArray(e10)) {
          let t10 = e10.length, r10;
          for (r10 = Array(t10); t10--; ) r10[t10] = nM(e10[t10]);
          return r10;
        }
        if ("object" == typeof e10) {
          let t10 = {};
          for (let r10 in e10) "__proto__" === r10 ? Object.defineProperty(t10, r10, { value: nM(e10[r10]), configurable: true, enumerable: true, writable: true }) : t10[r10] = nM(e10[r10]);
          return t10;
        }
        tq(e10, "Unknown value");
      }
      var nj = (e10) => e10;
      function n$(e10 = nj, t10 = nj) {
        return (r10) => e10(t10(r10));
      }
      D(), M(), j(), $(), L(), ew();
      var nL = tw("prisma:client"), nq = { Vercel: "vercel", "Netlify CI": "netlify" };
      function nU(e10) {
        return null === e10 ? e10 : Array.isArray(e10) ? e10.map(nU) : "object" == typeof e10 ? null !== e10 && "object" == typeof e10 && "string" == typeof e10.$type ? function({ $type: e11, value: t10 }) {
          switch (e11) {
            case "BigInt":
              return BigInt(t10);
            case "Bytes": {
              let { buffer: e12, byteOffset: r10, byteLength: n10 } = O.from(t10, "base64");
              return new Uint8Array(e12, r10, n10);
            }
            case "DateTime":
              return new Date(t10);
            case "Decimal":
              return new em(t10);
            case "Json":
              return JSON.parse(t10);
            default:
              throw Error("Unknown tagged value");
          }
        }(e10) : null !== e10.constructor && "Object" !== e10.constructor.name ? e10 : function(e11, t10) {
          let r10 = {};
          for (let n10 of Object.keys(e11)) r10[n10] = t10(e11[n10], n10);
          return r10;
        }(e10, nU) : e10;
      }
      D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew(), ew(), D(), M(), j(), $(), L(), ew(), ew(), D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew();
      var nV = () => globalThis.process?.release?.name === "node", nF = () => !!globalThis.Bun || !!globalThis.process?.versions?.bun, nB = () => !!globalThis.Deno, nW = () => "object" == typeof globalThis.Netlify, nH = () => "object" == typeof globalThis.EdgeRuntime, nK = () => globalThis.navigator?.userAgent === "Cloudflare-Workers", nJ = { node: "Node.js", workerd: "Cloudflare Workers", deno: "Deno and Deno Deploy", netlify: "Netlify Edge Functions", "edge-light": "Edge Runtime (Vercel Edge Functions, Vercel Edge Middleware, Next.js (Pages Router) Edge API Routes, Next.js (App Router) Edge Route Handlers or Next.js Middleware)" };
      function nG() {
        let e10 = [[nW, "netlify"], [nH, "edge-light"], [nK, "workerd"], [nB, "deno"], [nF, "bun"], [nV, "node"]].flatMap((e11) => e11[0]() ? [e11[1]] : []).at(0) ?? "";
        return { id: e10, prettyName: nJ[e10] || e10, isEdge: ["workerd", "deno", "netlify", "edge-light"].includes(e10) };
      }
      function nz({ inlineDatasources: e10, overrideDatasources: t10, env: r10, clientVersion: n10 }) {
        let i2, a2 = Object.keys(e10)[0], s2 = e10[a2]?.url, o2 = t10[a2]?.url;
        if (void 0 === a2 ? i2 = void 0 : o2 ? i2 = o2 : s2?.value ? i2 = s2.value : s2?.fromEnvVar && (i2 = r10[s2.fromEnvVar]), s2?.fromEnvVar !== void 0 && void 0 === i2) throw "workerd" === nG().id ? new tH(`error: Environment variable not found: ${s2.fromEnvVar}.

In Cloudflare module Workers, environment variables are available only in the Worker's \`env\` parameter of \`fetch\`.
To solve this, provide the connection string directly: https://pris.ly/d/cloudflare-datasource-url`, n10) : new tH(`error: Environment variable not found: ${s2.fromEnvVar}.`, n10);
        if (void 0 === i2) throw new tH("error: Missing URL environment variable, value, or override.", n10);
        return i2;
      }
      D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew();
      var nQ, nX = { async loadLibrary(e10) {
        let { clientVersion: t10, adapter: r10, engineWasm: n10 } = e10;
        if (void 0 === r10) throw new tH(`The \`adapter\` option for \`PrismaClient\` is required in this context (${nG().prettyName})`, t10);
        if (void 0 === n10) throw new tH("WASM engine was unexpectedly `undefined`", t10);
        return void 0 === nQ && (nQ = (async () => {
          let e11 = await n10.getRuntime(), r11 = await n10.getQueryEngineWasmModule();
          if (null == r11) throw new tH("The loaded wasm module was unexpectedly `undefined` or `null` once loaded", t10);
          let i2 = new WebAssembly.Instance(r11, { "./query_engine_bg.js": e11 }), a2 = i2.exports.__wbindgen_start;
          return e11.__wbg_set_wasm(i2.exports), a2(), e11.QueryEngine;
        })()), { debugPanic: () => Promise.reject("{}"), dmmf: () => Promise.resolve("{}"), version: () => ({ commit: "unknown", version: "unknown" }), QueryEngine: await nQ };
      } }, nY = tw("prisma:client:libraryEngine"), nZ = 1n, n0 = class {
        name = "LibraryEngine";
        engine;
        libraryInstantiationPromise;
        libraryStartingPromise;
        libraryStoppingPromise;
        libraryStarted;
        executingQueryPromise;
        config;
        QueryEngineConstructor;
        libraryLoader;
        library;
        logEmitter;
        libQueryEnginePath;
        binaryTarget;
        datasourceOverrides;
        datamodel;
        logQueries;
        logLevel;
        lastQuery;
        loggerRustPanic;
        tracingHelper;
        adapterPromise;
        versionInfo;
        constructor(e10, t10) {
          this.libraryLoader = t10 ?? nX, this.config = e10, this.libraryStarted = false, this.logQueries = e10.logQueries ?? false, this.logLevel = e10.logLevel ?? "error", this.logEmitter = e10.logEmitter, this.datamodel = e10.inlineSchema, this.tracingHelper = e10.tracingHelper, e10.enableDebugLogs && (this.logLevel = "debug");
          let r10 = Object.keys(e10.overrideDatasources)[0], n10 = e10.overrideDatasources[r10]?.url;
          void 0 !== r10 && void 0 !== n10 && (this.datasourceOverrides = { [r10]: n10 }), this.libraryInstantiationPromise = this.instantiateLibrary();
        }
        wrapEngine(e10) {
          return { applyPendingMigrations: e10.applyPendingMigrations?.bind(e10), commitTransaction: this.withRequestId(e10.commitTransaction.bind(e10)), connect: this.withRequestId(e10.connect.bind(e10)), disconnect: this.withRequestId(e10.disconnect.bind(e10)), metrics: e10.metrics?.bind(e10), query: this.withRequestId(e10.query.bind(e10)), rollbackTransaction: this.withRequestId(e10.rollbackTransaction.bind(e10)), sdlSchema: e10.sdlSchema?.bind(e10), startTransaction: this.withRequestId(e10.startTransaction.bind(e10)), trace: e10.trace.bind(e10), free: e10.free?.bind(e10) };
        }
        withRequestId(e10) {
          return async (...t10) => {
            let r10, n10 = (r10 = nZ++, nZ > 0xffffffffffffffffn && (nZ = 1n), r10).toString();
            try {
              return await e10(...t10, n10);
            } finally {
              if (this.tracingHelper.isEnabled()) {
                let e11 = await this.engine?.trace(n10);
                if (e11) {
                  let t11 = JSON.parse(e11);
                  this.tracingHelper.dispatchEngineSpans(t11.spans);
                }
              }
            }
          };
        }
        async applyPendingMigrations() {
          throw Error("Cannot call this method from this type of engine instance");
        }
        async transaction(e10, t10, r10) {
          var n10;
          await this.start();
          let i2 = await this.adapterPromise, a2 = JSON.stringify(t10), s2;
          if ("start" === e10) {
            let e11 = JSON.stringify({ max_wait: r10.maxWait, timeout: r10.timeout, isolation_level: r10.isolationLevel });
            s2 = await this.engine?.startTransaction(e11, a2);
          } else "commit" === e10 ? s2 = await this.engine?.commitTransaction(r10.id, a2) : "rollback" === e10 && (s2 = await this.engine?.rollbackTransaction(r10.id, a2));
          let o2 = this.parseEngineResponse(s2);
          if ("object" == typeof (n10 = o2) && null !== n10 && void 0 !== n10.error_code) {
            let e11 = this.getExternalAdapterError(o2, i2?.errorRegistry);
            throw e11 ? e11.error : new tK(o2.message, { code: o2.error_code, clientVersion: this.config.clientVersion, meta: o2.meta });
          }
          if ("string" == typeof o2.message) throw new tG(o2.message, { clientVersion: this.config.clientVersion });
          return o2;
        }
        async instantiateLibrary() {
          if (nY("internalSetup"), this.libraryInstantiationPromise) return this.libraryInstantiationPromise;
          this.binaryTarget = await this.getCurrentBinaryTarget(), await this.tracingHelper.runInChildSpan("load_engine", () => this.loadEngine()), this.version();
        }
        async getCurrentBinaryTarget() {
        }
        parseEngineResponse(e10) {
          if (!e10) throw new tG("Response from the Engine was empty", { clientVersion: this.config.clientVersion });
          try {
            return JSON.parse(e10);
          } catch {
            throw new tG("Unable to JSON.parse response from engine", { clientVersion: this.config.clientVersion });
          }
        }
        async loadEngine() {
          if (!this.engine) {
            this.QueryEngineConstructor || (this.library = await this.libraryLoader.loadLibrary(this.config), this.QueryEngineConstructor = this.library.QueryEngine);
            try {
              let e10 = new I(this);
              this.adapterPromise || (this.adapterPromise = this.config.adapter?.connect()?.then(tT));
              let t10 = await this.adapterPromise;
              t10 && nY("Using driver adapter: %O", t10), this.engine = this.wrapEngine(new this.QueryEngineConstructor({ datamodel: this.datamodel, env: C.env, logQueries: this.config.logQueries ?? false, ignoreEnvVarErrors: true, datasourceOverrides: this.datasourceOverrides ?? {}, logLevel: this.logLevel, configDir: this.config.cwd, engineProtocol: "json", enableTracing: this.tracingHelper.isEnabled() }, (t11) => {
                e10.deref()?.logger(t11);
              }, t10));
            } catch (t10) {
              let e10 = this.parseInitError(t10.message);
              throw "string" == typeof e10 ? t10 : new tH(e10.message, this.config.clientVersion, e10.error_code);
            }
          }
        }
        logger(e10) {
          let t10 = this.parseEngineResponse(e10);
          t10 && (t10.level = t10?.level.toLowerCase() ?? "unknown", "query" === t10.item_type && "query" in t10 ? this.logEmitter.emit("query", { timestamp: /* @__PURE__ */ new Date(), query: t10.query, params: t10.params, duration: Number(t10.duration_ms), target: t10.module_path }) : ("level" in t10 && "error" === t10.level && t10.message, this.logEmitter.emit(t10.level, { timestamp: /* @__PURE__ */ new Date(), message: t10.message, target: t10.module_path })));
        }
        parseInitError(e10) {
          try {
            return JSON.parse(e10);
          } catch {
          }
          return e10;
        }
        parseRequestError(e10) {
          try {
            return JSON.parse(e10);
          } catch {
          }
          return e10;
        }
        onBeforeExit() {
          throw Error('"beforeExit" hook is not applicable to the library engine since Prisma 5.0.0, it is only relevant and implemented for the binary engine. Please add your event listener to the `process` object directly instead.');
        }
        async start() {
          if (this.libraryInstantiationPromise || (this.libraryInstantiationPromise = this.instantiateLibrary()), await this.libraryInstantiationPromise, await this.libraryStoppingPromise, this.libraryStartingPromise) return nY(`library already starting, this.libraryStarted: ${this.libraryStarted}`), this.libraryStartingPromise;
          if (this.libraryStarted) return;
          let e10 = async () => {
            nY("library starting");
            try {
              let e11 = { traceparent: this.tracingHelper.getTraceParent() };
              await this.engine?.connect(JSON.stringify(e11)), this.libraryStarted = true, this.adapterPromise || (this.adapterPromise = this.config.adapter?.connect()?.then(tT)), await this.adapterPromise, nY("library started");
            } catch (t10) {
              let e11 = this.parseInitError(t10.message);
              throw "string" == typeof e11 ? t10 : new tH(e11.message, this.config.clientVersion, e11.error_code);
            } finally {
              this.libraryStartingPromise = void 0;
            }
          };
          return this.libraryStartingPromise = this.tracingHelper.runInChildSpan("connect", e10), this.libraryStartingPromise;
        }
        async stop() {
          if (await this.libraryInstantiationPromise, await this.libraryStartingPromise, await this.executingQueryPromise, this.libraryStoppingPromise) return nY("library is already stopping"), this.libraryStoppingPromise;
          if (!this.libraryStarted) {
            await (await this.adapterPromise)?.dispose(), this.adapterPromise = void 0;
            return;
          }
          let e10 = async () => {
            await new Promise((e12) => setImmediate(e12)), nY("library stopping");
            let e11 = { traceparent: this.tracingHelper.getTraceParent() };
            await this.engine?.disconnect(JSON.stringify(e11)), this.engine?.free && this.engine.free(), this.engine = void 0, this.libraryStarted = false, this.libraryStoppingPromise = void 0, this.libraryInstantiationPromise = void 0, await (await this.adapterPromise)?.dispose(), this.adapterPromise = void 0, nY("library stopped");
          };
          return this.libraryStoppingPromise = this.tracingHelper.runInChildSpan("disconnect", e10), this.libraryStoppingPromise;
        }
        version() {
          return this.versionInfo = this.library?.version(), this.versionInfo?.version ?? "unknown";
        }
        debugPanic(e10) {
          return this.library?.debugPanic(e10);
        }
        async request(e10, { traceparent: t10, interactiveTransaction: r10 }) {
          nY(`sending request, this.libraryStarted: ${this.libraryStarted}`);
          let n10 = JSON.stringify({ traceparent: t10 }), i2 = JSON.stringify(e10);
          try {
            await this.start();
            let e11 = await this.adapterPromise;
            this.executingQueryPromise = this.engine?.query(i2, n10, r10?.id), this.lastQuery = i2;
            let t11 = this.parseEngineResponse(await this.executingQueryPromise);
            if (t11.errors) throw 1 === t11.errors.length ? this.buildQueryError(t11.errors[0], e11?.errorRegistry) : new tG(JSON.stringify(t11.errors), { clientVersion: this.config.clientVersion });
            if (this.loggerRustPanic) throw this.loggerRustPanic;
            return { data: t11 };
          } catch (t11) {
            if (t11 instanceof tH) throw t11;
            "GenericFailure" === t11.code && t11.message?.startsWith("PANIC:");
            let e11 = this.parseRequestError(t11.message);
            throw "string" == typeof e11 ? t11 : new tG(`${e11.message}
${e11.backtrace}`, { clientVersion: this.config.clientVersion });
          }
        }
        async requestBatch(e10, { transaction: t10, traceparent: r10 }) {
          nY("requestBatch");
          let n10 = ng(e10, t10);
          await this.start();
          let i2 = await this.adapterPromise;
          this.lastQuery = JSON.stringify(n10), this.executingQueryPromise = this.engine?.query(this.lastQuery, JSON.stringify({ traceparent: r10 }), function(e11) {
            if (e11?.kind === "itx") return e11.options.id;
          }(t10));
          let a2 = await this.executingQueryPromise, s2 = this.parseEngineResponse(a2);
          if (s2.errors) throw 1 === s2.errors.length ? this.buildQueryError(s2.errors[0], i2?.errorRegistry) : new tG(JSON.stringify(s2.errors), { clientVersion: this.config.clientVersion });
          let { batchResult: o2, errors: l2 } = s2;
          if (Array.isArray(o2)) return o2.map((e11) => e11.errors && e11.errors.length > 0 ? this.loggerRustPanic ?? this.buildQueryError(e11.errors[0], i2?.errorRegistry) : { data: e11 });
          throw l2 && 1 === l2.length ? Error(l2[0].error) : Error(JSON.stringify(s2));
        }
        buildQueryError(e10, t10) {
          e10.user_facing_error.is_panic;
          let r10 = this.getExternalAdapterError(e10.user_facing_error, t10);
          return r10 ? r10.error : nm(e10, this.config.clientVersion, this.config.activeProvider);
        }
        getExternalAdapterError(e10, t10) {
          if ("P2036" === e10.error_code && t10) {
            let r10 = e10.meta?.id;
            tL("number" == typeof r10, "Malformed external JS error received from the engine");
            let n10 = t10.consumeError(r10);
            return tL(n10, "External error with reported id was not registered"), n10;
          }
        }
        async metrics(e10) {
          await this.start();
          let t10 = await this.engine.metrics(JSON.stringify(e10));
          return "prometheus" === e10.format ? t10 : this.parseEngineResponse(t10);
        }
      };
      D(), M(), j(), $(), L(), ew();
      var n1 = "Accelerate has not been setup correctly. Make sure your client is using `.$extends(withAccelerate())`. See https://pris.ly/d/accelerate-getting-started", n2 = class {
        constructor(e10) {
          this.config = e10, this.resolveDatasourceUrl = this.config.accelerateUtils?.resolveDatasourceUrl, this.getBatchRequestPayload = this.config.accelerateUtils?.getBatchRequestPayload, this.prismaGraphQLToJSError = this.config.accelerateUtils?.prismaGraphQLToJSError, this.PrismaClientUnknownRequestError = this.config.accelerateUtils?.PrismaClientUnknownRequestError, this.PrismaClientInitializationError = this.config.accelerateUtils?.PrismaClientInitializationError, this.PrismaClientKnownRequestError = this.config.accelerateUtils?.PrismaClientKnownRequestError, this.debug = this.config.accelerateUtils?.debug, this.engineVersion = this.config.accelerateUtils?.engineVersion, this.clientVersion = this.config.accelerateUtils?.clientVersion;
        }
        name = "AccelerateEngine";
        resolveDatasourceUrl;
        getBatchRequestPayload;
        prismaGraphQLToJSError;
        PrismaClientUnknownRequestError;
        PrismaClientInitializationError;
        PrismaClientKnownRequestError;
        debug;
        engineVersion;
        clientVersion;
        onBeforeExit(e10) {
        }
        async start() {
        }
        async stop() {
        }
        version(e10) {
          return "unknown";
        }
        transaction(e10, t10, r10) {
          throw new tH(n1, this.config.clientVersion);
        }
        metrics(e10) {
          throw new tH(n1, this.config.clientVersion);
        }
        request(e10, t10) {
          throw new tH(n1, this.config.clientVersion);
        }
        requestBatch(e10, t10) {
          throw new tH(n1, this.config.clientVersion);
        }
        applyPendingMigrations() {
          throw new tH(n1, this.config.clientVersion);
        }
      };
      D(), M(), j(), $(), L(), ew();
      var n4 = class {
        constructor(e10) {
          return new Proxy(this, { get(t10, r10) {
            throw new tz(`In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters`, e10);
          } });
        }
      };
      D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew();
      var n3 = (e10) => ({ command: e10 });
      function n6(e10) {
        try {
          return n5(e10, "fast");
        } catch {
          return n5(e10, "slow");
        }
      }
      function n5(e10, t10) {
        return JSON.stringify(e10.map((e11) => function e12(t11, r10) {
          var n10;
          if (Array.isArray(t11)) return t11.map((t12) => e12(t12, r10));
          if ("bigint" == typeof t11) return { prisma__type: "bigint", prisma__value: t11.toString() };
          if (t1(t11)) return { prisma__type: "date", prisma__value: t11.toJSON() };
          if (ey.isDecimal(t11)) return { prisma__type: "decimal", prisma__value: t11.toJSON() };
          if (O.isBuffer(t11)) return { prisma__type: "bytes", prisma__value: t11.toString("base64") };
          if ((n10 = t11) instanceof ArrayBuffer || n10 instanceof SharedArrayBuffer || "object" == typeof n10 && null !== n10 && ("ArrayBuffer" === n10[Symbol.toStringTag] || "SharedArrayBuffer" === n10[Symbol.toStringTag])) return { prisma__type: "bytes", prisma__value: O.from(t11).toString("base64") };
          if (ArrayBuffer.isView(t11)) {
            let { buffer: e13, byteOffset: r11, byteLength: n11 } = t11;
            return { prisma__type: "bytes", prisma__value: O.from(e13, r11, n11).toString("base64") };
          }
          return "object" == typeof t11 && "slow" === r10 ? n9(t11) : t11;
        }(e11, t10)));
      }
      function n9(e10) {
        if ("object" != typeof e10 || null === e10) return e10;
        if ("function" == typeof e10.toJSON) return e10.toJSON();
        if (Array.isArray(e10)) return e10.map(n8);
        let t10 = {};
        for (let r10 of Object.keys(e10)) t10[r10] = n8(e10[r10]);
        return t10;
      }
      function n8(e10) {
        return "bigint" == typeof e10 ? e10.toString() : n9(e10);
      }
      D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew(), ew();
      var n7 = /^(\s*alter\s)/i, ie = tw("prisma:client");
      function it(e10, t10, r10, n10) {
        if (("postgresql" === e10 || "cockroachdb" === e10) && r10.length > 0 && n7.exec(t10)) throw Error(`Running ALTER using ${n10} is not supported
Using the example below you can still execute your query with Prisma, but please note that it is vulnerable to SQL injection attacks and requires you to take care of input sanitization.

Example:
  await prisma.$executeRawUnsafe(\`ALTER USER prisma WITH PASSWORD '\${password}'\`)

More Information: https://pris.ly/d/execute-raw
`);
      }
      var ir = ({ clientMethod: e10, activeProvider: t10 }) => (r10) => {
        let n10 = "", i2;
        if (r7(r10)) n10 = r10.sql, i2 = { values: n6(r10.values), __prismaRawParameters__: true };
        else if (Array.isArray(r10)) {
          let [e11, ...t11] = r10;
          n10 = e11, i2 = { values: n6(t11 || []), __prismaRawParameters__: true };
        } else switch (t10) {
          case "sqlite":
          case "mysql":
            n10 = r10.sql, i2 = { values: n6(r10.values), __prismaRawParameters__: true };
            break;
          case "cockroachdb":
          case "postgresql":
          case "postgres":
            n10 = r10.text, i2 = { values: n6(r10.values), __prismaRawParameters__: true };
            break;
          case "sqlserver":
            n10 = r10.strings.reduce((e11, t11, r11) => `${e11}@P${r11}${t11}`), i2 = { values: n6(r10.values), __prismaRawParameters__: true };
            break;
          default:
            throw Error(`The ${t10} provider does not support ${e10}`);
        }
        return i2?.values ? ie(`prisma.${e10}(${n10}, ${i2.values})`) : ie(`prisma.${e10}(${n10})`), { query: n10, parameters: i2 };
      }, ii = { requestArgsToMiddlewareArgs: (e10) => [e10.strings, ...e10.values], middlewareArgsToRequestArgs(e10) {
        let [t10, ...r10] = e10;
        return new nt(t10, r10);
      } }, ia = { requestArgsToMiddlewareArgs: (e10) => [e10], middlewareArgsToRequestArgs: (e10) => e10[0] };
      function is(e10) {
        return function(t10, r10) {
          let n10, i2 = (r11 = e10) => {
            try {
              return void 0 === r11 || r11?.kind === "itx" ? n10 ??= io(t10(r11)) : io(t10(r11));
            } catch (e11) {
              return Promise.reject(e11);
            }
          };
          return { get spec() {
            return r10;
          }, then: (e11, t11) => i2().then(e11, t11), catch: (e11) => i2().catch(e11), finally: (e11) => i2().finally(e11), requestTransaction(e11) {
            let t11 = i2(e11);
            return t11.requestTransaction ? t11.requestTransaction(e11) : t11;
          }, [Symbol.toStringTag]: "PrismaPromise" };
        };
      }
      function io(e10) {
        return "function" == typeof e10.then ? e10 : Promise.resolve(e10);
      }
      D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew();
      var il = tv.split(".")[0], iu = { isEnabled: () => false, getTraceParent: () => "00-10-10-00", dispatchEngineSpans() {
      }, getActiveContext() {
      }, runInChildSpan: (e10, t10) => t10() }, ic = class {
        isEnabled() {
          return this.getGlobalTracingHelper().isEnabled();
        }
        getTraceParent(e10) {
          return this.getGlobalTracingHelper().getTraceParent(e10);
        }
        dispatchEngineSpans(e10) {
          return this.getGlobalTracingHelper().dispatchEngineSpans(e10);
        }
        getActiveContext() {
          return this.getGlobalTracingHelper().getActiveContext();
        }
        runInChildSpan(e10, t10) {
          return this.getGlobalTracingHelper().runInChildSpan(e10, t10);
        }
        getGlobalTracingHelper() {
          let e10 = globalThis[`V${il}_PRISMA_INSTRUMENTATION`], t10 = globalThis.PRISMA_INSTRUMENTATION;
          return e10?.helper ?? t10?.helper ?? iu;
        }
      };
      function id(e10) {
        return "number" == typeof e10.batchRequestIdx;
      }
      function ip(e10) {
        return `(${Object.keys(e10).sort().map((t10) => {
          let r10 = e10[t10];
          return "object" == typeof r10 && null !== r10 ? `(${t10} ${ip(r10)})` : t10;
        }).join(" ")})`;
      }
      D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew();
      var ih = { aggregate: false, aggregateRaw: false, createMany: true, createManyAndReturn: true, createOne: true, deleteMany: true, deleteOne: true, executeRaw: true, findFirst: false, findFirstOrThrow: false, findMany: false, findRaw: false, findUnique: false, findUniqueOrThrow: false, groupBy: false, queryRaw: false, runCommandRaw: true, updateMany: true, updateManyAndReturn: true, updateOne: true, upsertOne: true };
      D(), M(), j(), $(), L(), ew();
      var ig = class {
        constructor(e10) {
          this.options = e10, this.batches = {};
        }
        batches;
        tickActive = false;
        request(e10) {
          let t10 = this.options.batchBy(e10);
          return t10 ? (this.batches[t10] || (this.batches[t10] = [], this.tickActive || (this.tickActive = true, C.nextTick(() => {
            this.dispatchBatches(), this.tickActive = false;
          }))), new Promise((r10, n10) => {
            this.batches[t10].push({ request: e10, resolve: r10, reject: n10 });
          })) : this.options.singleLoader(e10);
        }
        dispatchBatches() {
          for (let e10 in this.batches) {
            let t10 = this.batches[e10];
            delete this.batches[e10], 1 === t10.length ? this.options.singleLoader(t10[0].request).then((e11) => {
              e11 instanceof Error ? t10[0].reject(e11) : t10[0].resolve(e11);
            }).catch((e11) => {
              t10[0].reject(e11);
            }) : (t10.sort((e11, t11) => this.options.batchOrder(e11.request, t11.request)), this.options.batchLoader(t10.map((e11) => e11.request)).then((e11) => {
              if (e11 instanceof Error) for (let r10 = 0; r10 < t10.length; r10++) t10[r10].reject(e11);
              else for (let r10 = 0; r10 < t10.length; r10++) {
                let n10 = e11[r10];
                n10 instanceof Error ? t10[r10].reject(n10) : t10[r10].resolve(n10);
              }
            }).catch((e11) => {
              for (let r10 = 0; r10 < t10.length; r10++) t10[r10].reject(e11);
            }));
          }
        }
        get [Symbol.toStringTag]() {
          return "DataLoader";
        }
      };
      function im(e10) {
        let t10 = [], r10 = function(e11) {
          let t11 = {};
          for (let r11 = 0; r11 < e11.columns.length; r11++) t11[e11.columns[r11]] = null;
          return t11;
        }(e10);
        for (let n10 = 0; n10 < e10.rows.length; n10++) {
          let i2 = e10.rows[n10], a2 = { ...r10 };
          for (let t11 = 0; t11 < i2.length; t11++) a2[e10.columns[t11]] = function e11(t12, r11) {
            if (null === r11) return r11;
            switch (t12) {
              case "bigint":
                return BigInt(r11);
              case "bytes": {
                let { buffer: e12, byteOffset: t13, byteLength: n11 } = O.from(r11, "base64");
                return new Uint8Array(e12, t13, n11);
              }
              case "decimal":
                return new ey(r11);
              case "datetime":
              case "date":
                return new Date(r11);
              case "time":
                return /* @__PURE__ */ new Date(`1970-01-01T${r11}Z`);
              case "bigint-array":
                return r11.map((t13) => e11("bigint", t13));
              case "bytes-array":
                return r11.map((t13) => e11("bytes", t13));
              case "decimal-array":
                return r11.map((t13) => e11("decimal", t13));
              case "datetime-array":
                return r11.map((t13) => e11("datetime", t13));
              case "date-array":
                return r11.map((t13) => e11("date", t13));
              case "time-array":
                return r11.map((t13) => e11("time", t13));
              default:
                return r11;
            }
          }(e10.types[t11], i2[t11]);
          t10.push(a2);
        }
        return t10;
      }
      D(), M(), j(), $(), L(), ew(), ew();
      var iy = tw("prisma:client:request_handler"), ib = class {
        client;
        dataloader;
        logEmitter;
        constructor(e10, t10) {
          this.logEmitter = t10, this.client = e10, this.dataloader = new ig({ batchLoader: /* @__PURE__ */ function(e11) {
            return (t11) => {
              let r10 = { requests: t11 }, n10 = t11[0].extensions.getAllBatchQueryCallbacks();
              return n10.length ? function e12(t12, r11, n11, i2) {
                if (n11 === r11.length) return i2(t12);
                let a2 = t12.customDataProxyFetch, s2 = t12.requests[0].transaction;
                return r11[n11]({ args: { queries: t12.requests.map((e13) => ({ model: e13.modelName, operation: e13.action, args: e13.args })), transaction: s2 ? { isolationLevel: "batch" === s2.kind ? s2.isolationLevel : void 0 } : void 0 }, __internalParams: t12, query(s3, o2 = t12) {
                  let l2 = o2.customDataProxyFetch;
                  return o2.customDataProxyFetch = n$(a2, l2), e12(o2, r11, n11 + 1, i2);
                } });
              }(r10, n10, 0, e11) : e11(r10);
            };
          }(async ({ requests: e11, customDataProxyFetch: t11 }) => {
            let { transaction: r10, otelParentCtx: n10 } = e11[0], i2 = e11.map((e12) => e12.protocolQuery), a2 = this.client._tracingHelper.getTraceParent(n10), s2 = e11.some((e12) => ih[e12.protocolQuery.action]);
            return (await this.client._engine.requestBatch(i2, { traceparent: a2, transaction: function(e12) {
              if (e12) {
                if ("batch" === e12.kind) return { kind: "batch", options: { isolationLevel: e12.isolationLevel } };
                if ("itx" === e12.kind) return { kind: "itx", options: iw(e12) };
                tq(e12, "Unknown transaction kind");
              }
            }(r10), containsWrite: s2, customDataProxyFetch: t11 })).map((t12, r11) => {
              if (t12 instanceof Error) return t12;
              try {
                return this.mapQueryEngineResult(e11[r11], t12);
              } catch (e12) {
                return e12;
              }
            });
          }), singleLoader: async (e11) => {
            let t11 = e11.transaction?.kind === "itx" ? iw(e11.transaction) : void 0, r10 = await this.client._engine.request(e11.protocolQuery, { traceparent: this.client._tracingHelper.getTraceParent(), interactiveTransaction: t11, isWrite: ih[e11.protocolQuery.action], customDataProxyFetch: e11.customDataProxyFetch });
            return this.mapQueryEngineResult(e11, r10);
          }, batchBy: (e11) => e11.transaction?.id ? `transaction-${e11.transaction.id}` : function(e12) {
            if ("findUnique" !== e12.action && "findUniqueOrThrow" !== e12.action) return;
            let t11 = [];
            return e12.modelName && t11.push(e12.modelName), e12.query.arguments && t11.push(ip(e12.query.arguments)), t11.push(ip(e12.query.selection)), t11.join("");
          }(e11.protocolQuery), batchOrder: (e11, t11) => e11.transaction?.kind === "batch" && t11.transaction?.kind === "batch" ? e11.transaction.index - t11.transaction.index : 0 });
        }
        async request(e10) {
          try {
            return await this.dataloader.request(e10);
          } catch (s2) {
            let { clientMethod: t10, callsite: r10, transaction: n10, args: i2, modelName: a2 } = e10;
            this.handleAndLogRequestError({ error: s2, clientMethod: t10, callsite: r10, transaction: n10, args: i2, modelName: a2, globalOmit: e10.globalOmit });
          }
        }
        mapQueryEngineResult({ dataPath: e10, unpacker: t10 }, r10) {
          let n10 = r10?.data, i2 = this.unpack(n10, e10, t10);
          return C.env.PRISMA_CLIENT_GET_TIME ? { data: i2 } : i2;
        }
        handleAndLogRequestError(e10) {
          try {
            this.handleRequestError(e10);
          } catch (t10) {
            throw this.logEmitter && this.logEmitter.emit("error", { message: t10.message, target: e10.clientMethod, timestamp: /* @__PURE__ */ new Date() }), t10;
          }
        }
        handleRequestError({ error: e10, clientMethod: t10, callsite: r10, transaction: n10, args: i2, modelName: a2, globalOmit: s2 }) {
          var o2, l2, u2;
          if (iy(e10), o2 = e10, l2 = n10, id(o2) && l2?.kind === "batch" && o2.batchRequestIdx !== l2.index) throw e10;
          e10 instanceof tK && ("P2009" === (u2 = e10).code || "P2012" === u2.code) && rq({ args: i2, errors: [function e11(t11) {
            if ("Union" === t11.kind) return { kind: "Union", errors: t11.errors.map(e11) };
            if (Array.isArray(t11.selectionPath)) {
              let [, ...e12] = t11.selectionPath;
              return { ...t11, selectionPath: e12 };
            }
            return t11;
          }(e10.meta)], callsite: r10, errorFormat: this.client._errorFormat, originalMethod: t10, clientVersion: this.client._clientVersion, globalOmit: s2 });
          let c2 = e10.message;
          if (r10 && (c2 = t7({ callsite: r10, originalMethod: t10, isPanic: e10.isPanic, showColors: "pretty" === this.client._errorFormat, message: c2 })), c2 = this.sanitizeMessage(c2), e10.code) {
            let t11 = a2 ? { modelName: a2, ...e10.meta } : e10.meta;
            throw new tK(c2, { code: e10.code, clientVersion: this.client._clientVersion, meta: t11, batchRequestIdx: e10.batchRequestIdx });
          }
          if (e10.isPanic) throw new tJ(c2, this.client._clientVersion);
          if (e10 instanceof tG) throw new tG(c2, { clientVersion: this.client._clientVersion, batchRequestIdx: e10.batchRequestIdx });
          if (e10 instanceof tH) throw new tH(c2, this.client._clientVersion);
          if (e10 instanceof tJ) throw new tJ(c2, this.client._clientVersion);
          throw e10.clientVersion = this.client._clientVersion, e10;
        }
        sanitizeMessage(e10) {
          return this.client._errorFormat && "pretty" !== this.client._errorFormat ? function(e11) {
            if ("string" != typeof e11) throw TypeError(`Expected a \`string\`, got \`${typeof e11}\``);
            return e11.replace(tU, "");
          }(e10) : e10;
        }
        unpack(e10, t10, r10) {
          if (!e10 || (e10.data && (e10 = e10.data), !e10)) return e10;
          let n10 = Object.keys(e10)[0], i2 = nx(Object.values(e10)[0], t10.filter((e11) => "select" !== e11 && "include" !== e11)), a2 = "queryRaw" === n10 ? im(i2) : nU(i2);
          return r10 ? r10(a2) : a2;
        }
        get [Symbol.toStringTag]() {
          return "RequestHandler";
        }
      };
      function iw(e10) {
        return { id: e10.id, payload: e10.payload };
      }
      D(), M(), j(), $(), L(), ew(), D(), M(), j(), $(), L(), ew();
      var iv = h(eQ());
      D(), M(), j(), $(), L(), ew();
      var i_ = class extends Error {
        constructor(e10) {
          super(e10 + `
Read more at https://pris.ly/d/client-constructor`), this.name = "PrismaClientConstructorValidationError";
        }
        get [Symbol.toStringTag]() {
          return "PrismaClientConstructorValidationError";
        }
      };
      tF(i_, "PrismaClientConstructorValidationError");
      var iE = ["datasources", "datasourceUrl", "errorFormat", "adapter", "log", "transactionOptions", "omit", "__internal"], iS = ["pretty", "colorless", "minimal"], iP = ["info", "query", "warn", "error"], ix = { datasources: (e10, { datasourceNames: t10 }) => {
        if (e10) {
          if ("object" != typeof e10 || Array.isArray(e10)) throw new i_(`Invalid value ${JSON.stringify(e10)} for "datasources" provided to PrismaClient constructor`);
          for (let [r10, n10] of Object.entries(e10)) {
            if (!t10.includes(r10)) {
              let e11 = iA(r10, t10) || ` Available datasources: ${t10.join(", ")}`;
              throw new i_(`Unknown datasource ${r10} provided to PrismaClient constructor.${e11}`);
            }
            if ("object" != typeof n10 || Array.isArray(n10)) throw new i_(`Invalid value ${JSON.stringify(e10)} for datasource "${r10}" provided to PrismaClient constructor.
It should have this form: { url: "CONNECTION_STRING" }`);
            if (n10 && "object" == typeof n10) for (let [t11, i2] of Object.entries(n10)) {
              if ("url" !== t11) throw new i_(`Invalid value ${JSON.stringify(e10)} for datasource "${r10}" provided to PrismaClient constructor.
It should have this form: { url: "CONNECTION_STRING" }`);
              if ("string" != typeof i2) throw new i_(`Invalid value ${JSON.stringify(i2)} for datasource "${r10}" provided to PrismaClient constructor.
It should have this form: { url: "CONNECTION_STRING" }`);
            }
          }
        }
      }, adapter: (e10, t10) => {
        if (!e10 && "client" === t_(t10.generator)) throw new i_('Using engine type "client" requires a driver adapter to be provided to PrismaClient constructor.');
        if (null !== e10) {
          if (void 0 === e10) throw new i_('"adapter" property must not be undefined, use null to conditionally disable driver adapters.');
          if ("binary" === t_(t10.generator)) throw new i_('Cannot use a driver adapter with the "binary" Query Engine. Please use the "library" Query Engine.');
        }
      }, datasourceUrl: (e10) => {
        if ("u" > typeof e10 && "string" != typeof e10) throw new i_(`Invalid value ${JSON.stringify(e10)} for "datasourceUrl" provided to PrismaClient constructor.
Expected string or undefined.`);
      }, errorFormat: (e10) => {
        if (e10) {
          if ("string" != typeof e10) throw new i_(`Invalid value ${JSON.stringify(e10)} for "errorFormat" provided to PrismaClient constructor.`);
          if (!iS.includes(e10)) {
            let t10 = iA(e10, iS);
            throw new i_(`Invalid errorFormat ${e10} provided to PrismaClient constructor.${t10}`);
          }
        }
      }, log: (e10) => {
        if (e10) {
          if (!Array.isArray(e10)) throw new i_(`Invalid value ${JSON.stringify(e10)} for "log" provided to PrismaClient constructor.`);
          for (let r10 of e10) {
            t10(r10);
            let e11 = { level: t10, emit: (e12) => {
              let t11 = ["stdout", "event"];
              if (!t11.includes(e12)) {
                let r11 = iA(e12, t11);
                throw new i_(`Invalid value ${JSON.stringify(e12)} for "emit" in logLevel provided to PrismaClient constructor.${r11}`);
              }
            } };
            if (r10 && "object" == typeof r10) for (let [t11, n10] of Object.entries(r10)) if (e11[t11]) e11[t11](n10);
            else throw new i_(`Invalid property ${t11} for "log" provided to PrismaClient constructor`);
          }
        }
        function t10(e11) {
          if ("string" == typeof e11 && !iP.includes(e11)) {
            let t11 = iA(e11, iP);
            throw new i_(`Invalid log level "${e11}" provided to PrismaClient constructor.${t11}`);
          }
        }
      }, transactionOptions: (e10) => {
        if (!e10) return;
        let t10 = e10.maxWait;
        if (null != t10 && t10 <= 0) throw new i_(`Invalid value ${t10} for maxWait in "transactionOptions" provided to PrismaClient constructor. maxWait needs to be greater than 0`);
        let r10 = e10.timeout;
        if (null != r10 && r10 <= 0) throw new i_(`Invalid value ${r10} for timeout in "transactionOptions" provided to PrismaClient constructor. timeout needs to be greater than 0`);
      }, omit: (e10, t10) => {
        if ("object" != typeof e10) throw new i_('"omit" option is expected to be an object.');
        if (null === e10) throw new i_('"omit" option can not be `null`');
        let r10 = [];
        for (let [n10, i2] of Object.entries(e10)) {
          let e11 = function(e12, t11) {
            return iT(t11.models, e12) ?? iT(t11.types, e12);
          }(n10, t10.runtimeDataModel);
          if (!e11) {
            r10.push({ kind: "UnknownModel", modelKey: n10 });
            continue;
          }
          for (let [t11, a2] of Object.entries(i2)) {
            let i3 = e11.fields.find((e12) => e12.name === t11);
            if (!i3) {
              r10.push({ kind: "UnknownField", modelKey: n10, fieldName: t11 });
              continue;
            }
            if (i3.relationName) {
              r10.push({ kind: "RelationInOmit", modelKey: n10, fieldName: t11 });
              continue;
            }
            "boolean" != typeof a2 && r10.push({ kind: "InvalidFieldValue", modelKey: n10, fieldName: t11 });
          }
        }
        if (r10.length > 0) throw new i_(function(e11, t11) {
          let r11 = rj(e11);
          for (let e12 of t11) switch (e12.kind) {
            case "UnknownModel":
              r11.arguments.getField(e12.modelKey)?.markAsError(), r11.addErrorMessage(() => `Unknown model name: ${e12.modelKey}.`);
              break;
            case "UnknownField":
              r11.arguments.getDeepField([e12.modelKey, e12.fieldName])?.markAsError(), r11.addErrorMessage(() => `Model "${e12.modelKey}" does not have a field named "${e12.fieldName}".`);
              break;
            case "RelationInOmit":
              r11.arguments.getDeepField([e12.modelKey, e12.fieldName])?.markAsError(), r11.addErrorMessage(() => 'Relations are already excluded by default and can not be specified in "omit".');
              break;
            case "InvalidFieldValue":
              r11.arguments.getDeepFieldValue([e12.modelKey, e12.fieldName])?.markAsError(), r11.addErrorMessage(() => "Omit field option value must be a boolean.");
          }
          let { message: n10, args: i2 } = rL(r11, "colorless");
          return `Error validating "omit" option:

${i2}

${n10}`;
        }(e10, r10));
      }, __internal: (e10) => {
        if (!e10) return;
        let t10 = ["debug", "engine", "configOverride"];
        if ("object" != typeof e10) throw new i_(`Invalid value ${JSON.stringify(e10)} for "__internal" to PrismaClient constructor`);
        for (let [r10] of Object.entries(e10)) if (!t10.includes(r10)) {
          let e11 = iA(r10, t10);
          throw new i_(`Invalid property ${JSON.stringify(r10)} for "__internal" provided to PrismaClient constructor.${e11}`);
        }
      } };
      function iA(e10, t10) {
        if (0 === t10.length || "string" != typeof e10) return "";
        let r10 = function(e11, t11) {
          if (0 === t11.length) return null;
          let r11 = t11.map((t12) => ({ value: t12, distance: (0, iv.default)(e11, t12) }));
          r11.sort((e12, t12) => e12.distance < t12.distance ? -1 : 1);
          let n10 = r11[0];
          return n10.distance < 3 ? n10.value : null;
        }(e10, t10);
        return r10 ? ` Did you mean "${r10}"?` : "";
      }
      function iT(e10, t10) {
        let r10 = Object.keys(e10).find((e11) => tX(e11) === t10);
        if (r10) return e10[r10];
      }
      D(), M(), j(), $(), L(), ew();
      var iO = tw("prisma:client");
      "object" == typeof globalThis && (globalThis.NODE_CLIENT = true);
      var iR = { requestArgsToMiddlewareArgs: (e10) => e10, middlewareArgsToRequestArgs: (e10) => e10 }, iC = Symbol.for("prisma.client.transaction.id"), ik = { id: 0, nextId() {
        return ++this.id;
      } };
      function iN(e10) {
        class t10 {
          _originalClient = this;
          _runtimeDataModel;
          _requestHandler;
          _connectionPromise;
          _disconnectionPromise;
          _engineConfig;
          _accelerateEngineConfig;
          _clientVersion;
          _errorFormat;
          _tracingHelper;
          _previewFeatures;
          _activeProvider;
          _globalOmit;
          _extensions;
          _engine;
          _appliedParent;
          _createPrismaPromise = is();
          constructor(t11) {
            let r10;
            (function({ postinstall: e11, ciName: t12, clientVersion: r11, generator: n11 }) {
              if (nL("checkPlatformCaching:postinstall", e11), nL("checkPlatformCaching:ciName", t12), true === e11 && !(n11?.output && "string" == typeof (n11.output.fromEnvVar ?? n11.output.value)) && t12 && t12 in nq) {
                let e12 = `Prisma has detected that this project was built on ${t12}, which caches dependencies. This leads to an outdated Prisma Client because Prisma's auto-generation isn't triggered. To fix this, make sure to run the \`prisma generate\` command during the build process.

Learn how: https://pris.ly/d/${nq[t12]}-build`;
                throw console.error(e12), new tH(e12, r11);
              }
            })(e10 = t11?.__internal?.configOverride?.(e10) ?? e10), t11 && function(e11, t12) {
              for (let [r11, n11] of Object.entries(e11)) {
                if (!iE.includes(r11)) {
                  let e12 = iA(r11, iE);
                  throw new i_(`Unknown property ${r11} provided to PrismaClient constructor.${e12}`);
                }
                ix[r11](n11, t12);
              }
              if (e11.datasourceUrl && e11.datasources) throw new i_('Can not use "datasourceUrl" and "datasources" options at the same time. Pick one of them');
            }(t11, e10);
            let n10 = new eK().on("error", () => {
            });
            if (this._extensions = rB.empty(), this._previewFeatures = function({ generator: e11 }) {
              return e11?.previewFeatures ?? [];
            }(e10), this._clientVersion = e10.clientVersion ?? "6.16.2", this._activeProvider = e10.activeProvider, this._globalOmit = t11?.omit, this._tracingHelper = new ic(), e10.relativeEnvPaths && (e10.relativeEnvPaths.rootEnvPath && eH.resolve(e10.dirname, e10.relativeEnvPaths.rootEnvPath), e10.relativeEnvPaths.schemaEnvPath && eH.resolve(e10.dirname, e10.relativeEnvPaths.schemaEnvPath)), t11?.adapter) {
              r10 = t11.adapter;
              let n11 = "postgresql" === e10.activeProvider || "cockroachdb" === e10.activeProvider ? "postgres" : e10.activeProvider;
              if (r10.provider !== n11) throw new tH(`The Driver Adapter \`${r10.adapterName}\`, based on \`${r10.provider}\`, is not compatible with the provider \`${n11}\` specified in the Prisma schema.`, this._clientVersion);
              if (t11.datasources || void 0 !== t11.datasourceUrl) throw new tH("Custom datasource configuration is not compatible with Prisma Driver Adapters. Please define the database connection string directly in the Driver Adapter configuration.", this._clientVersion);
            }
            let i2 = e10.injectableEdgeEnv?.();
            try {
              let a2 = t11 ?? {}, s2 = a2.__internal ?? {}, o2 = true === s2.debug;
              o2 && tw.enable("prisma:client");
              let l2 = eH.resolve(e10.dirname, e10.relativePath);
              e$.existsSync(l2) || (l2 = e10.dirname), iO("dirname", e10.dirname), iO("relativePath", e10.relativePath), iO("cwd", l2);
              let u2 = s2.engine || {};
              if (a2.errorFormat ? this._errorFormat = a2.errorFormat : "production" === C.env.NODE_ENV ? this._errorFormat = "minimal" : (C.env.NO_COLOR, this._errorFormat = "colorless"), this._runtimeDataModel = e10.runtimeDataModel, this._engineConfig = { cwd: l2, dirname: e10.dirname, enableDebugLogs: o2, allowTriggerPanic: u2.allowTriggerPanic, prismaPath: u2.binaryPath ?? void 0, engineEndpoint: u2.endpoint, generator: e10.generator, showColors: "pretty" === this._errorFormat, logLevel: a2.log && function(e11) {
                return "string" == typeof e11 ? e11 : e11.reduce((e12, t12) => {
                  let r11 = "string" == typeof t12 ? t12 : t12.level;
                  return "query" === r11 ? e12 : e12 && ("info" === t12 || "info" === e12) ? "info" : r11;
                }, void 0);
              }(a2.log), logQueries: a2.log && !!("string" == typeof a2.log ? "query" === a2.log : a2.log.find((e11) => "string" == typeof e11 ? "query" === e11 : "query" === e11.level)), env: i2?.parsed ?? {}, flags: [], engineWasm: e10.engineWasm, compilerWasm: e10.compilerWasm, clientVersion: e10.clientVersion, engineVersion: e10.engineVersion, previewFeatures: this._previewFeatures, activeProvider: e10.activeProvider, inlineSchema: e10.inlineSchema, overrideDatasources: function(e11, t12) {
                return e11 ? e11.datasources ? e11.datasources : e11.datasourceUrl ? { [t12[0]]: { url: e11.datasourceUrl } } : {} : {};
              }(a2, e10.datasourceNames), inlineDatasources: e10.inlineDatasources, inlineSchemaHash: e10.inlineSchemaHash, tracingHelper: this._tracingHelper, transactionOptions: { maxWait: a2.transactionOptions?.maxWait ?? 2e3, timeout: a2.transactionOptions?.timeout ?? 5e3, isolationLevel: a2.transactionOptions?.isolationLevel }, logEmitter: n10, isBundled: e10.isBundled, adapter: r10 }, this._accelerateEngineConfig = { ...this._engineConfig, accelerateUtils: { resolveDatasourceUrl: nz, getBatchRequestPayload: ng, prismaGraphQLToJSError: nm, PrismaClientUnknownRequestError: tG, PrismaClientInitializationError: tH, PrismaClientKnownRequestError: tK, debug: tw("prisma:client:accelerateEngine"), engineVersion: ne.version, clientVersion: e10.clientVersion } }, iO("clientVersion", e10.clientVersion), this._engine = function({ copyEngine: e11 = true }, t12) {
                let r11;
                try {
                  r11 = nz({ inlineDatasources: t12.inlineDatasources, overrideDatasources: t12.overrideDatasources, env: { ...t12.env, ...C.env }, clientVersion: t12.clientVersion });
                } catch {
                }
                let { ok: n11, isUsing: i3, diagnostics: a3 } = function({ url: e12, adapter: t13, copyEngine: r12, targetBuildType: n12 }) {
                  let i4 = [], a4 = [], s3 = (e13) => {
                    let t14 = e13.join(`
`);
                    a4.push({ _tag: "error", value: t14 });
                  }, o3 = !!e12?.startsWith("prisma://"), l3 = e12?.toString().startsWith("prisma+postgres://") ?? false, u3 = !!t13, c2 = o3 || l3;
                  !u3 && r12 && c2 && "client" !== n12 && "wasm-compiler-edge" !== n12 && i4.push({ _tag: "warning", value: ["recommend--no-engine", "In production, we recommend using `prisma generate --no-engine` (See: `prisma generate --help`)"] });
                  let d2 = c2 || !r12;
                  u3 && (d2 || "edge" === n12) && ("edge" === n12 ? s3(["Prisma Client was configured to use the `adapter` option but it was imported via its `/edge` endpoint.", "Please either remove the `/edge` endpoint or remove the `adapter` from the Prisma Client constructor."]) : c2 ? s3(["You've provided both a driver adapter and an Accelerate database URL. Driver adapters currently cannot connect to Accelerate.", "Please provide either a driver adapter with a direct database URL or an Accelerate URL and no driver adapter."]) : r12 || s3(["Prisma Client was configured to use the `adapter` option but `prisma generate` was run with `--no-engine`.", "Please run `prisma generate` without `--no-engine` to be able to use Prisma Client with the adapter."]));
                  let p2 = { accelerate: d2, ppg: l3, driverAdapters: u3 };
                  return a4.length > 0 ? { ok: false, diagnostics: { warnings: i4, errors: a4 }, isUsing: p2 } : { ok: true, diagnostics: { warnings: i4 }, isUsing: p2 };
                }({ url: r11, adapter: t12.adapter, copyEngine: e11, targetBuildType: "wasm-engine-edge" });
                for (let e12 of a3.warnings) tW(...e12.value);
                if (!n11) throw new tz(a3.errors[0].value, { clientVersion: t12.clientVersion });
                return t_(t12.generator), (i3.accelerate || i3.ppg) && i3.driverAdapters, i3.accelerate, i3.driverAdapters ? new n0(t12) : i3.accelerate ? new n2(t12) : new n4({ clientVersion: t12.clientVersion });
              }(e10, this._engineConfig), this._requestHandler = new ib(this, n10), a2.log) for (let e11 of a2.log) {
                let t12 = "string" == typeof e11 ? e11 : "stdout" === e11.emit ? e11.level : null;
                t12 && this.$on(t12, (e12) => {
                  tC.log(`${tC.tags[t12] ?? ""}`, e12.message || e12.query);
                });
              }
            } catch (e11) {
              throw e11.clientVersion = this._clientVersion, e11;
            }
            return this._appliedParent = nC(this);
          }
          get [Symbol.toStringTag]() {
            return "PrismaClient";
          }
          $on(e11, t11) {
            return "beforeExit" === e11 ? this._engine.onBeforeExit(t11) : e11 && this._engineConfig.logEmitter.on(e11, t11), this;
          }
          $connect() {
            try {
              return this._engine.start();
            } catch (e11) {
              throw e11.clientVersion = this._clientVersion, e11;
            }
          }
          async $disconnect() {
            try {
              await this._engine.stop();
            } catch (e11) {
              throw e11.clientVersion = this._clientVersion, e11;
            } finally {
              tf.length = 0;
            }
          }
          $executeRawInternal(e11, t11, r10, n10) {
            let i2 = this._activeProvider;
            return this._request({ action: "executeRaw", args: r10, transaction: e11, clientMethod: t11, argsMapper: ir({ clientMethod: t11, activeProvider: i2 }), callsite: nb(this._errorFormat), dataPath: [], middlewareArgsMapper: n10 });
          }
          $executeRaw(e11, ...t11) {
            return this._createPrismaPromise((r10) => {
              if (void 0 !== e11.raw || void 0 !== e11.sql) {
                let [n10, i2] = iI(e11, t11);
                return it(this._activeProvider, n10.text, n10.values, Array.isArray(e11) ? "prisma.$executeRaw`<SQL>`" : "prisma.$executeRaw(sql`<SQL>`)"), this.$executeRawInternal(r10, "$executeRaw", n10, i2);
              }
              throw new tz("`$executeRaw` is a tag function, please use it like the following:\n```\nconst result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`\n```\n\nOr read our docs at https://www.prisma.io/docs/concepts/components/prisma-client/raw-database-access#executeraw\n", { clientVersion: this._clientVersion });
            });
          }
          $executeRawUnsafe(e11, ...t11) {
            return this._createPrismaPromise((r10) => (it(this._activeProvider, e11, t11, "prisma.$executeRawUnsafe(<SQL>, [...values])"), this.$executeRawInternal(r10, "$executeRawUnsafe", [e11, ...t11])));
          }
          $runCommandRaw(t11) {
            if ("mongodb" !== e10.activeProvider) throw new tz(`The ${e10.activeProvider} provider does not support $runCommandRaw. Use the mongodb provider.`, { clientVersion: this._clientVersion });
            return this._createPrismaPromise((e11) => this._request({ args: t11, clientMethod: "$runCommandRaw", dataPath: [], action: "runCommandRaw", argsMapper: n3, callsite: nb(this._errorFormat), transaction: e11 }));
          }
          async $queryRawInternal(e11, t11, r10, n10) {
            let i2 = this._activeProvider;
            return this._request({ action: "queryRaw", args: r10, transaction: e11, clientMethod: t11, argsMapper: ir({ clientMethod: t11, activeProvider: i2 }), callsite: nb(this._errorFormat), dataPath: [], middlewareArgsMapper: n10 });
          }
          $queryRaw(e11, ...t11) {
            return this._createPrismaPromise((r10) => {
              if (void 0 !== e11.raw || void 0 !== e11.sql) return this.$queryRawInternal(r10, "$queryRaw", ...iI(e11, t11));
              throw new tz("`$queryRaw` is a tag function, please use it like the following:\n```\nconst result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`\n```\n\nOr read our docs at https://www.prisma.io/docs/concepts/components/prisma-client/raw-database-access#queryraw\n", { clientVersion: this._clientVersion });
            });
          }
          $queryRawTyped(e11) {
            return this._createPrismaPromise((t11) => {
              if (!this._hasPreviewFlag("typedSql")) throw new tz("`typedSql` preview feature must be enabled in order to access $queryRawTyped API", { clientVersion: this._clientVersion });
              return this.$queryRawInternal(t11, "$queryRawTyped", e11);
            });
          }
          $queryRawUnsafe(e11, ...t11) {
            return this._createPrismaPromise((r10) => this.$queryRawInternal(r10, "$queryRawUnsafe", [e11, ...t11]));
          }
          _transactionWithArray({ promises: e11, options: t11 }) {
            var r10;
            let n10 = ik.nextId(), i2 = function(e12, t12 = () => {
            }) {
              let r11, n11 = new Promise((e13) => r11 = e13);
              return { then: (i3) => (0 == --e12 && r11(t12()), i3?.(n11)) };
            }(e11.length);
            return 0 === (r10 = e11.map((e12, r11) => {
              if (e12?.[Symbol.toStringTag] !== "PrismaPromise") throw Error("All elements of the array need to be Prisma Client promises. Hint: Please make sure you are not awaiting the Prisma client calls you intended to pass in the $transaction function.");
              let a2 = t11?.isolationLevel ?? this._engineConfig.transactionOptions.isolationLevel;
              return e12.requestTransaction?.({ kind: "batch", id: n10, index: r11, isolationLevel: a2, lock: i2 }) ?? e12;
            })).length ? Promise.resolve([]) : new Promise((e12, t12) => {
              let n11 = Array(r10.length), i3 = null, a2 = false, s2 = 0, o2 = () => {
                a2 || ++s2 === r10.length && (a2 = true, i3 ? t12(i3) : e12(n11));
              }, l2 = (e13) => {
                a2 || (a2 = true, t12(e13));
              };
              for (let e13 = 0; e13 < r10.length; e13++) r10[e13].then((t13) => {
                n11[e13] = t13, o2();
              }, (t13) => {
                if (!id(t13)) return void l2(t13);
                t13.batchRequestIdx === e13 ? l2(t13) : (i3 || (i3 = t13), o2());
              });
            });
          }
          async _transactionWithCallback({ callback: e11, options: t11 }) {
            let r10 = { traceparent: this._tracingHelper.getTraceParent() }, n10 = { maxWait: t11?.maxWait ?? this._engineConfig.transactionOptions.maxWait, timeout: t11?.timeout ?? this._engineConfig.transactionOptions.timeout, isolationLevel: t11?.isolationLevel ?? this._engineConfig.transactionOptions.isolationLevel }, i2 = await this._engine.transaction("start", r10, n10), a2;
            try {
              let t12 = { kind: "itx", ...i2 };
              a2 = await e11(this._createItxClient(t12)), await this._engine.transaction("commit", r10, i2);
            } catch (e12) {
              throw await this._engine.transaction("rollback", r10, i2).catch(() => {
              }), e12;
            }
            return a2;
          }
          _createItxClient(e11) {
            return np(nC(np(this[nR] ? this[nR] : this, [no("_appliedParent", () => this._appliedParent._createItxClient(e11)), no("_createPrismaPromise", () => is(e11)), no(iC, () => e11.id)])), [nf(nD)]);
          }
          $transaction(e11, t11) {
            let r10;
            return r10 = "function" == typeof e11 ? this._engineConfig.adapter?.adapterName === "@prisma/adapter-d1" ? () => {
              throw Error("Cloudflare D1 does not support interactive transactions. We recommend you to refactor your queries with that limitation in mind, and use batch transactions with `prisma.$transactions([])` where applicable.");
            } : () => this._transactionWithCallback({ callback: e11, options: t11 }) : () => this._transactionWithArray({ promises: e11, options: t11 }), this._tracingHelper.runInChildSpan({ name: "transaction", attributes: { method: "$transaction" } }, r10);
          }
          _request(e11) {
            e11.otelParentCtx = this._tracingHelper.getActiveContext();
            let t11 = e11.middlewareArgsMapper ?? iR, r10 = { args: t11.requestArgsToMiddlewareArgs(e11.args), dataPath: e11.dataPath, runInTransaction: !!e11.transaction, action: e11.action, model: e11.model }, n10 = { operation: { name: "operation", attributes: { method: r10.action, model: r10.model, name: r10.model ? `${r10.model}.${r10.action}` : r10.action } } }, i2 = async (r11) => {
              let { runInTransaction: n11, args: i3, ...a2 } = r11, s2 = { ...e11, ...a2 };
              i3 && (s2.args = t11.middlewareArgsToRequestArgs(i3)), void 0 !== e11.transaction && false === n11 && delete s2.transaction;
              let o2 = await function(e12, t12) {
                let { jsModelName: r12, action: n12, clientMethod: i4 } = t12;
                if (e12._extensions.isEmpty()) return e12._executeRequest(t12);
                let a3 = e12._extensions.getAllQueryCallbacks(r12 ?? "$none", r12 ? n12 : i4);
                return function e13(t13, r13, n13, i5 = 0) {
                  return t13._createPrismaPromise((a4) => {
                    let s3 = r13.customDataProxyFetch;
                    return "transaction" in r13 && void 0 !== a4 && (r13.transaction?.kind === "batch" && r13.transaction.lock.then(), r13.transaction = a4), i5 === n13.length ? t13._executeRequest(r13) : n13[i5]({ model: r13.model, operation: r13.model ? r13.action : r13.clientMethod, args: function(e14) {
                      var t14, r14;
                      if (e14 instanceof nt) {
                        return new nt((t14 = e14).strings, t14.values);
                      }
                      if (r7(e14)) {
                        return new r9((r14 = e14).sql, r14.values);
                      }
                      if (Array.isArray(e14)) {
                        let t15 = [e14[0]];
                        for (let r15 = 1; r15 < e14.length; r15++) t15[r15] = nM(e14[r15]);
                        return t15;
                      }
                      let n14 = {};
                      for (let t15 in e14) n14[t15] = nM(e14[t15]);
                      return n14;
                    }(r13.args ?? {}), __internalParams: r13, query: (a5, o3 = r13) => {
                      let l2 = o3.customDataProxyFetch;
                      return o3.customDataProxyFetch = n$(s3, l2), o3.args = a5, e13(t13, o3, n13, i5 + 1);
                    } });
                  });
                }(e12, t12, a3);
              }(this, s2);
              return s2.model ? function({ result: e12, modelName: t12, args: r12, extensions: n12, runtimeDataModel: i4, globalOmit: a3 }) {
                return n12.isEmpty() || null == e12 || "object" != typeof e12 || !i4.models[t12] ? e12 : nN({ result: e12, args: r12 ?? {}, modelName: t12, runtimeDataModel: i4, visitor: (e13, t13, r13) => {
                  let i5 = rU(t13);
                  return function({ result: e14, modelName: t14, select: r14, omit: n13, extensions: i6 }) {
                    let a4 = i6.getAllComputedFields(t14);
                    if (!a4) return e14;
                    let s3 = [], o3 = [];
                    for (let t15 of Object.values(a4)) {
                      if (n13) {
                        if (n13[t15.name]) continue;
                        let e15 = t15.needs.filter((e16) => n13[e16]);
                        e15.length > 0 && o3.push(nf(e15));
                      } else if (r14) {
                        if (!r14[t15.name]) continue;
                        let e15 = t15.needs.filter((e16) => !r14[e16]);
                        e15.length > 0 && o3.push(nf(e15));
                      }
                      (function(e15, t16) {
                        return t16.every((t17) => Object.prototype.hasOwnProperty.call(e15, t17));
                      })(e14, t15.needs) && s3.push(function(e15, t16) {
                        return nl(no(e15.name, () => e15.compute(t16)));
                      }(t15, np(e14, s3)));
                    }
                    return s3.length > 0 || o3.length > 0 ? np(e14, [...s3, ...o3]) : e14;
                  }({ result: e13, modelName: i5, select: r13.select, omit: r13.select ? void 0 : { ...a3?.[i5], ...r13.omit }, extensions: n12 });
                } });
              }({ result: o2, modelName: s2.model, args: s2.args, extensions: this._extensions, runtimeDataModel: this._runtimeDataModel, globalOmit: this._globalOmit }) : o2;
            };
            return this._tracingHelper.runInChildSpan(n10.operation, () => i2(r10));
          }
          async _executeRequest({ args: e11, clientMethod: t11, dataPath: r10, callsite: n10, action: i2, model: a2, argsMapper: s2, transaction: o2, unpacker: l2, otelParentCtx: u2, customDataProxyFetch: c2 }) {
            try {
              e11 = s2 ? s2(e11) : e11;
              let d2 = this._tracingHelper.runInChildSpan({ name: "serialize" }, () => rY({ modelName: a2, runtimeDataModel: this._runtimeDataModel, action: i2, args: e11, clientMethod: t11, callsite: n10, extensions: this._extensions, errorFormat: this._errorFormat, clientVersion: this._clientVersion, previewFeatures: this._previewFeatures, globalOmit: this._globalOmit }));
              return tw.enabled("prisma:client") && (iO("Prisma Client call:"), iO(`prisma.${t11}(${function(e12) {
                if (void 0 === e12) return "";
                let t12 = rj(e12);
                return new ri(0, { colors: ro }).write(t12).toString();
              }(e11)})`), iO("Generated request:"), iO(JSON.stringify(d2, null, 2) + `
`)), o2?.kind === "batch" && await o2.lock, this._requestHandler.request({ protocolQuery: d2, modelName: a2, action: i2, clientMethod: t11, dataPath: r10, callsite: n10, args: e11, extensions: this._extensions, transaction: o2, unpacker: l2, otelParentCtx: u2, otelChildCtx: this._tracingHelper.getActiveContext(), globalOmit: this._globalOmit, customDataProxyFetch: c2 });
            } catch (e12) {
              throw e12.clientVersion = this._clientVersion, e12;
            }
          }
          $metrics = new r4(this);
          _hasPreviewFlag(e11) {
            return !!this._engineConfig.previewFeatures?.includes(e11);
          }
          $applyPendingMigrations() {
            return this._engine.applyPendingMigrations();
          }
          $extends = nk;
        }
        return t10;
      }
      function iI(e10, t10) {
        var r10;
        return Array.isArray(r10 = e10) && Array.isArray(r10.raw) ? [new nt(e10, t10), ii] : [e10, ia];
      }
      D(), M(), j(), $(), L(), ew();
      var iD = /* @__PURE__ */ new Set(["toJSON", "$$typeof", "asymmetricMatch", Symbol.iterator, Symbol.toStringTag, Symbol.isConcatSpreadable, Symbol.toPrimitive]);
      function iM(e10) {
        return new Proxy(e10, { get(e11, t10) {
          if (t10 in e11) return e11[t10];
          if (!iD.has(t10)) throw TypeError(`Invalid enum value: ${String(t10)}`);
        } });
      }
      D(), M(), j(), $(), L(), ew(), ew();
    }, 54998, (e, t, r) => {
      "use strict";
      let n;
      var i = Object.defineProperty, a = Object.getOwnPropertyDescriptor, s = Object.getOwnPropertyNames, o = Object.prototype.hasOwnProperty, l = {};
      ((e10, t2) => {
        for (var r2 in t2) i(e10, r2, { get: t2[r2], enumerable: true });
      })(l, { QueryEngine: () => C, __wbg_String_8f0eb39a4a4c2f66: () => k, __wbg_buffer_609cc3eee51ed158: () => N, __wbg_call_672a4d21634d4a24: () => I, __wbg_call_7cccdd69e0791ae2: () => D, __wbg_crypto_805be4ce92f1e370: () => M, __wbg_done_769e5ede4b31c67b: () => j, __wbg_entries_3265d4158b33e5dc: () => $, __wbg_exec_3e2d2d0644c927df: () => L, __wbg_getRandomValues_f6a868620c8bab49: () => q, __wbg_getTime_46267b1c24877e30: () => U, __wbg_get_67b2ba62fc30de12: () => V, __wbg_get_b9b93047fe3cf45b: () => F, __wbg_get_ece95cf6585650d9: () => B, __wbg_getwithrefkey_1dc361bd10053bfe: () => W, __wbg_has_a5ea9117f258a0ec: () => H, __wbg_instanceof_ArrayBuffer_e14585432e3737fc: () => K, __wbg_instanceof_Map_f3469ce2244d2430: () => J, __wbg_instanceof_Promise_935168b8f4b49db3: () => G, __wbg_instanceof_Uint8Array_17156bcf118086a9: () => z, __wbg_isArray_a1eab7e0d067391b: () => Q, __wbg_isSafeInteger_343e2beeeece1bb0: () => X, __wbg_iterator_9a24c88df860dc65: () => Y, __wbg_keys_5c77a08ddc2fb8a6: () => Z, __wbg_length_a446193dc22c12f8: () => ee, __wbg_length_e2d2a49132c1b256: () => et, __wbg_msCrypto_2ac4d17c4748234a: () => er, __wbg_new0_f788a2397c7ca929: () => en, __wbg_new_23a2665fac83c611: () => ei, __wbg_new_405e22f390576ce2: () => ea, __wbg_new_5e0be73521bc8c17: () => es, __wbg_new_63847613cde5d4bc: () => eo, __wbg_new_78feb108b6472713: () => el, __wbg_new_a12002a7f91c75be: () => eu, __wbg_newnoargs_105ed471475aaf50: () => ec, __wbg_newwithbyteoffsetandlength_d97e637ebe145a9a: () => ed, __wbg_newwithlength_a381634e90c276d4: () => ep, __wbg_next_25feadfc0913fea9: () => eh, __wbg_next_6574e1a8a62d1055: () => ef, __wbg_node_ecc8306b9857f33d: () => eg, __wbg_now_7fd00a794a07d388: () => em, __wbg_now_807e54c39636c349: () => ey, __wbg_now_b3f7572f6ef3d3a9: () => eb, __wbg_process_5cff2739921be718: () => ew, __wbg_push_737cfc8c1432c2c6: () => ev, __wbg_queueMicrotask_5a8a9131f3f0b37b: () => e_, __wbg_queueMicrotask_6d79674585219521: () => eE, __wbg_randomFillSync_d3c85af7e31cf1f8: () => eS, __wbg_require_0c566c6f2eef6c79: () => eP, __wbg_resolve_4851785c9c5f573d: () => ex, __wbg_setTimeout_5d6a1d4fc51ea450: () => eA, __wbg_set_37837023f3d740e8: () => eT, __wbg_set_3f1d0b984ed272ed: () => eO, __wbg_set_65595bdd868b3009: () => eR, __wbg_set_8fc6bf8a5b1071d1: () => eC, __wbg_set_bb8cecf6a62b9f46: () => ek, __wbg_set_wasm: () => c, __wbg_static_accessor_GLOBAL_88a902d13a557d07: () => eN, __wbg_static_accessor_GLOBAL_THIS_56578be7e9f832b0: () => eI, __wbg_static_accessor_SELF_37c5d418e4bf5819: () => eD, __wbg_static_accessor_WINDOW_5de37043a91a9c40: () => eM, __wbg_subarray_aa9065fa9dc5df96: () => ej, __wbg_then_44b73946d2fb3e7d: () => e$, __wbg_then_48b406749878a531: () => eL, __wbg_valueOf_7392193dd78c6b97: () => eq, __wbg_value_cd1ffa7b1ab794f1: () => eU, __wbg_versions_a8e5a362e1f16442: () => eV, __wbindgen_as_number: () => eF, __wbindgen_bigint_from_i64: () => eB, __wbindgen_bigint_from_u64: () => eW, __wbindgen_bigint_get_as_i64: () => eH, __wbindgen_boolean_get: () => eK, __wbindgen_cb_drop: () => eJ, __wbindgen_closure_wrapper7729: () => eG, __wbindgen_debug_string: () => ez, __wbindgen_error_new: () => eQ, __wbindgen_in: () => eX, __wbindgen_init_externref_table: () => eY, __wbindgen_is_bigint: () => eZ, __wbindgen_is_function: () => e0, __wbindgen_is_object: () => e1, __wbindgen_is_string: () => e2, __wbindgen_is_undefined: () => e4, __wbindgen_jsval_eq: () => e3, __wbindgen_jsval_loose_eq: () => e6, __wbindgen_memory: () => e5, __wbindgen_number_get: () => e9, __wbindgen_number_new: () => e8, __wbindgen_string_get: () => e7, __wbindgen_string_new: () => te, __wbindgen_throw: () => tt, debug_panic: () => T, getBuildTimeInfo: () => A }), t.exports = ((e10, t2, r2, n2) => {
        if (t2 && "object" == typeof t2 || "function" == typeof t2) for (let l2 of s(t2)) o.call(e10, l2) || l2 === r2 || i(e10, l2, { get: () => t2[l2], enumerable: !(n2 = a(t2, l2)) || n2.enumerable });
        return e10;
      })(i({}, "__esModule", { value: true }), l);
      var u = () => {
      };
      function c(e10) {
        n = e10;
      }
      u.prototype = u;
      let d = 0, p = null;
      function h() {
        return (null === p || 0 === p.byteLength) && (p = new Uint8Array(n.memory.buffer)), p;
      }
      let f = new (typeof TextEncoder > "u" ? (0, t.require)("util").TextEncoder : TextEncoder)("utf-8"), g = "function" == typeof f.encodeInto ? function(e10, t2) {
        return f.encodeInto(e10, t2);
      } : function(e10, t2) {
        let r2 = f.encode(e10);
        return t2.set(r2), { read: e10.length, written: r2.length };
      };
      function m(e10, t2, r2) {
        if (void 0 === r2) {
          let r3 = f.encode(e10), n3 = t2(r3.length, 1) >>> 0;
          return h().subarray(n3, n3 + r3.length).set(r3), d = r3.length, n3;
        }
        let n2 = e10.length, i2 = t2(n2, 1) >>> 0, a2 = h(), s2 = 0;
        for (; s2 < n2; s2++) {
          let t3 = e10.charCodeAt(s2);
          if (t3 > 127) break;
          a2[i2 + s2] = t3;
        }
        if (s2 !== n2) {
          0 !== s2 && (e10 = e10.slice(s2)), i2 = r2(i2, n2, n2 = s2 + 3 * e10.length, 1) >>> 0;
          let t3 = g(e10, h().subarray(i2 + s2, i2 + n2));
          s2 += t3.written, i2 = r2(i2, n2, s2, 1) >>> 0;
        }
        return d = s2, i2;
      }
      let y = null;
      function b() {
        return (null === y || true === y.buffer.detached || void 0 === y.buffer.detached && y.buffer !== n.memory.buffer) && (y = new DataView(n.memory.buffer)), y;
      }
      function w(e10) {
        let t2 = n.__externref_table_alloc();
        return n.__wbindgen_export_4.set(t2, e10), t2;
      }
      function v(e10, t2) {
        try {
          return e10.apply(this, t2);
        } catch (t3) {
          let e11 = w(t3);
          n.__wbindgen_exn_store(e11);
        }
      }
      let _ = new (typeof TextDecoder > "u" ? (0, t.require)("util").TextDecoder : TextDecoder)("utf-8", { ignoreBOM: true, fatal: true });
      function E(e10, t2) {
        return e10 >>>= 0, _.decode(h().subarray(e10, e10 + t2));
      }
      function S(e10) {
        return null == e10;
      }
      _.decode();
      let P = typeof FinalizationRegistry > "u" ? { register: () => {
      }, unregister: () => {
      } } : new FinalizationRegistry((e10) => {
        n.__wbindgen_export_5.get(e10.dtor)(e10.a, e10.b);
      });
      function x(e10) {
        let t2 = n.__wbindgen_export_4.get(e10);
        return n.__externref_table_dealloc(e10), t2;
      }
      function A() {
        return n.getBuildTimeInfo();
      }
      function T(e10) {
        var t2 = S(e10) ? 0 : m(e10, n.__wbindgen_malloc, n.__wbindgen_realloc), r2 = d;
        let i2 = n.debug_panic(t2, r2);
        if (i2[1]) throw x(i2[0]);
      }
      function O(e10, t2, r2) {
        n.closure589_externref_shim(e10, t2, r2);
      }
      let R = typeof FinalizationRegistry > "u" ? { register: () => {
      }, unregister: () => {
      } } : new FinalizationRegistry((e10) => n.__wbg_queryengine_free(e10 >>> 0, 1));
      class C {
        __destroy_into_raw() {
          let e10 = this.__wbg_ptr;
          return this.__wbg_ptr = 0, R.unregister(this), e10;
        }
        free() {
          let e10 = this.__destroy_into_raw();
          n.__wbg_queryengine_free(e10, 0);
        }
        constructor(e10, t2, r2) {
          let i2 = n.queryengine_new(e10, t2, r2);
          if (i2[2]) throw x(i2[1]);
          return this.__wbg_ptr = i2[0] >>> 0, R.register(this, this.__wbg_ptr, this), this;
        }
        connect(e10, t2) {
          let r2 = m(e10, n.__wbindgen_malloc, n.__wbindgen_realloc), i2 = d, a2 = m(t2, n.__wbindgen_malloc, n.__wbindgen_realloc), s2 = d;
          return n.queryengine_connect(this.__wbg_ptr, r2, i2, a2, s2);
        }
        disconnect(e10, t2) {
          let r2 = m(e10, n.__wbindgen_malloc, n.__wbindgen_realloc), i2 = d, a2 = m(t2, n.__wbindgen_malloc, n.__wbindgen_realloc), s2 = d;
          return n.queryengine_disconnect(this.__wbg_ptr, r2, i2, a2, s2);
        }
        query(e10, t2, r2, i2) {
          let a2 = m(e10, n.__wbindgen_malloc, n.__wbindgen_realloc), s2 = d, o2 = m(t2, n.__wbindgen_malloc, n.__wbindgen_realloc), l2 = d;
          var u2 = S(r2) ? 0 : m(r2, n.__wbindgen_malloc, n.__wbindgen_realloc), c2 = d;
          let p2 = m(i2, n.__wbindgen_malloc, n.__wbindgen_realloc), h2 = d;
          return n.queryengine_query(this.__wbg_ptr, a2, s2, o2, l2, u2, c2, p2, h2);
        }
        startTransaction(e10, t2, r2) {
          let i2 = m(e10, n.__wbindgen_malloc, n.__wbindgen_realloc), a2 = d, s2 = m(t2, n.__wbindgen_malloc, n.__wbindgen_realloc), o2 = d, l2 = m(r2, n.__wbindgen_malloc, n.__wbindgen_realloc), u2 = d;
          return n.queryengine_startTransaction(this.__wbg_ptr, i2, a2, s2, o2, l2, u2);
        }
        commitTransaction(e10, t2, r2) {
          let i2 = m(e10, n.__wbindgen_malloc, n.__wbindgen_realloc), a2 = d, s2 = m(t2, n.__wbindgen_malloc, n.__wbindgen_realloc), o2 = d, l2 = m(r2, n.__wbindgen_malloc, n.__wbindgen_realloc), u2 = d;
          return n.queryengine_commitTransaction(this.__wbg_ptr, i2, a2, s2, o2, l2, u2);
        }
        rollbackTransaction(e10, t2, r2) {
          let i2 = m(e10, n.__wbindgen_malloc, n.__wbindgen_realloc), a2 = d, s2 = m(t2, n.__wbindgen_malloc, n.__wbindgen_realloc), o2 = d, l2 = m(r2, n.__wbindgen_malloc, n.__wbindgen_realloc), u2 = d;
          return n.queryengine_rollbackTransaction(this.__wbg_ptr, i2, a2, s2, o2, l2, u2);
        }
        metrics(e10) {
          let t2 = m(e10, n.__wbindgen_malloc, n.__wbindgen_realloc), r2 = d;
          return n.queryengine_metrics(this.__wbg_ptr, t2, r2);
        }
        trace(e10) {
          let t2 = m(e10, n.__wbindgen_malloc, n.__wbindgen_realloc), r2 = d;
          return n.queryengine_trace(this.__wbg_ptr, t2, r2);
        }
      }
      function k(e10, t2) {
        let r2 = m(String(t2), n.__wbindgen_malloc, n.__wbindgen_realloc), i2 = d;
        b().setInt32(e10 + 4, i2, true), b().setInt32(e10 + 0, r2, true);
      }
      function N(e10) {
        return e10.buffer;
      }
      function I() {
        return v(function(e10, t2) {
          return e10.call(t2);
        }, arguments);
      }
      function D() {
        return v(function(e10, t2, r2) {
          return e10.call(t2, r2);
        }, arguments);
      }
      function M(e10) {
        return e10.crypto;
      }
      function j(e10) {
        return e10.done;
      }
      function $(e10) {
        return Object.entries(e10);
      }
      function L(e10, t2, r2) {
        let n2 = e10.exec(E(t2, r2));
        return S(n2) ? 0 : w(n2);
      }
      function q() {
        return v(function(e10, t2) {
          e10.getRandomValues(t2);
        }, arguments);
      }
      function U(e10) {
        return e10.getTime();
      }
      function V() {
        return v(function(e10, t2) {
          return Reflect.get(e10, t2);
        }, arguments);
      }
      function F(e10, t2) {
        return e10[t2 >>> 0];
      }
      function B() {
        return v(function(e10, t2) {
          return e10[t2];
        }, arguments);
      }
      function W(e10, t2) {
        return e10[t2];
      }
      function H() {
        return v(function(e10, t2) {
          return Reflect.has(e10, t2);
        }, arguments);
      }
      function K(e10) {
        let t2;
        try {
          t2 = e10 instanceof ArrayBuffer;
        } catch {
          t2 = false;
        }
        return t2;
      }
      function J(e10) {
        let t2;
        try {
          t2 = e10 instanceof Map;
        } catch {
          t2 = false;
        }
        return t2;
      }
      function G(e10) {
        let t2;
        try {
          t2 = e10 instanceof Promise;
        } catch {
          t2 = false;
        }
        return t2;
      }
      function z(e10) {
        let t2;
        try {
          t2 = e10 instanceof Uint8Array;
        } catch {
          t2 = false;
        }
        return t2;
      }
      function Q(e10) {
        return Array.isArray(e10);
      }
      function X(e10) {
        return Number.isSafeInteger(e10);
      }
      function Y() {
        return Symbol.iterator;
      }
      function Z(e10) {
        return Object.keys(e10);
      }
      function ee(e10) {
        return e10.length;
      }
      function et(e10) {
        return e10.length;
      }
      function er(e10) {
        return e10.msCrypto;
      }
      function en() {
        return /* @__PURE__ */ new Date();
      }
      function ei(e10, t2) {
        try {
          var r2 = { a: e10, b: t2 };
          return new Promise((e11, t3) => {
            let i2 = r2.a;
            r2.a = 0;
            try {
              var a2;
              return a2 = r2.b, void n.closure129_externref_shim(i2, a2, e11, t3);
            } finally {
              r2.a = i2;
            }
          });
        } finally {
          r2.a = r2.b = 0;
        }
      }
      function ea() {
        return {};
      }
      function es() {
        return /* @__PURE__ */ new Map();
      }
      function eo(e10, t2, r2, n2) {
        return new RegExp(E(e10, t2), E(r2, n2));
      }
      function el() {
        return [];
      }
      function eu(e10) {
        return new Uint8Array(e10);
      }
      function ec(e10, t2) {
        return new u(E(e10, t2));
      }
      function ed(e10, t2, r2) {
        return new Uint8Array(e10, t2 >>> 0, r2 >>> 0);
      }
      function ep(e10) {
        return new Uint8Array(e10 >>> 0);
      }
      function eh(e10) {
        return e10.next;
      }
      function ef() {
        return v(function(e10) {
          return e10.next();
        }, arguments);
      }
      function eg(e10) {
        return e10.node;
      }
      function em(e10) {
        return e10.now();
      }
      function ey() {
        return Date.now();
      }
      function eb() {
        return v(function() {
          return Date.now();
        }, arguments);
      }
      function ew(e10) {
        return e10.process;
      }
      function ev(e10, t2) {
        return e10.push(t2);
      }
      function e_(e10) {
        return e10.queueMicrotask;
      }
      function eE(e10) {
        queueMicrotask(e10);
      }
      function eS() {
        return v(function(e10, t2) {
          e10.randomFillSync(t2);
        }, arguments);
      }
      function eP() {
        return v(function() {
          return t.require;
        }, arguments);
      }
      function ex(e10) {
        return Promise.resolve(e10);
      }
      function eA(e10, t2) {
        return setTimeout(e10, t2 >>> 0);
      }
      function eT(e10, t2, r2) {
        e10[t2 >>> 0] = r2;
      }
      function eO(e10, t2, r2) {
        e10[t2] = r2;
      }
      function eR(e10, t2, r2) {
        e10.set(t2, r2 >>> 0);
      }
      function eC(e10, t2, r2) {
        return e10.set(t2, r2);
      }
      function ek() {
        return v(function(e10, t2, r2) {
          return Reflect.set(e10, t2, r2);
        }, arguments);
      }
      function eN() {
        let t2 = e.g;
        return S(t2) ? 0 : w(t2);
      }
      function eI() {
        let e10 = typeof globalThis > "u" ? null : globalThis;
        return S(e10) ? 0 : w(e10);
      }
      function eD() {
        let e10 = typeof self > "u" ? null : self;
        return S(e10) ? 0 : w(e10);
      }
      function eM() {
        return S(null) ? 0 : w(null);
      }
      function ej(e10, t2, r2) {
        return e10.subarray(t2 >>> 0, r2 >>> 0);
      }
      function e$(e10, t2) {
        return e10.then(t2);
      }
      function eL(e10, t2, r2) {
        return e10.then(t2, r2);
      }
      function eq(e10) {
        return e10.valueOf();
      }
      function eU(e10) {
        return e10.value;
      }
      function eV(e10) {
        return e10.versions;
      }
      function eF(e10) {
        return +e10;
      }
      function eB(e10) {
        return e10;
      }
      function eW(e10) {
        return BigInt.asUintN(64, e10);
      }
      function eH(e10, t2) {
        let r2 = "bigint" == typeof t2 ? t2 : void 0;
        b().setBigInt64(e10 + 8, S(r2) ? BigInt(0) : r2, true), b().setInt32(e10 + 0, !S(r2), true);
      }
      function eK(e10) {
        return "boolean" == typeof e10 ? +!!e10 : 2;
      }
      function eJ(e10) {
        let t2 = e10.original;
        return 1 == t2.cnt-- && (t2.a = 0, true);
      }
      function eG(e10, t2, r2) {
        let i2 = { a: e10, b: t2, cnt: 1, dtor: 590 }, a2 = (...e11) => {
          i2.cnt++;
          let t3 = i2.a;
          i2.a = 0;
          try {
            return O(t3, i2.b, ...e11);
          } finally {
            0 == --i2.cnt ? (n.__wbindgen_export_5.get(i2.dtor)(t3, i2.b), P.unregister(i2)) : i2.a = t3;
          }
        };
        return a2.original = i2, P.register(a2, i2, i2), a2;
      }
      function ez(e10, t2) {
        let r2 = m(function e11(t3) {
          let r3, n2 = typeof t3;
          if ("number" == n2 || "boolean" == n2 || null == t3) return `${t3}`;
          if ("string" == n2) return `"${t3}"`;
          if ("symbol" == n2) {
            let e12 = t3.description;
            return null == e12 ? "Symbol" : `Symbol(${e12})`;
          }
          if ("function" == n2) {
            let e12 = t3.name;
            return "string" == typeof e12 && e12.length > 0 ? `Function(${e12})` : "Function";
          }
          if (Array.isArray(t3)) {
            let r4 = t3.length, n3 = "[";
            r4 > 0 && (n3 += e11(t3[0]));
            for (let i4 = 1; i4 < r4; i4++) n3 += ", " + e11(t3[i4]);
            return n3 + "]";
          }
          let i3 = /\[object ([^\]]+)\]/.exec(toString.call(t3));
          if (!i3 || !(i3.length > 1)) return toString.call(t3);
          if ("Object" == (r3 = i3[1])) try {
            return "Object(" + JSON.stringify(t3) + ")";
          } catch {
            return "Object";
          }
          return t3 instanceof Error ? `${t3.name}: ${t3.message}
${t3.stack}` : r3;
        }(t2), n.__wbindgen_malloc, n.__wbindgen_realloc), i2 = d;
        b().setInt32(e10 + 4, i2, true), b().setInt32(e10 + 0, r2, true);
      }
      function eQ(e10, t2) {
        return Error(E(e10, t2));
      }
      function eX(e10, t2) {
        return e10 in t2;
      }
      function eY() {
        let e10 = n.__wbindgen_export_4, t2 = e10.grow(4);
        e10.set(0, void 0), e10.set(t2 + 0, void 0), e10.set(t2 + 1, null), e10.set(t2 + 2, true), e10.set(t2 + 3, false);
      }
      function eZ(e10) {
        return "bigint" == typeof e10;
      }
      function e0(e10) {
        return "function" == typeof e10;
      }
      function e1(e10) {
        return "object" == typeof e10 && null !== e10;
      }
      function e2(e10) {
        return "string" == typeof e10;
      }
      function e4(e10) {
        return void 0 === e10;
      }
      function e3(e10, t2) {
        return e10 === t2;
      }
      function e6(e10, t2) {
        return e10 == t2;
      }
      function e5() {
        return n.memory;
      }
      function e9(e10, t2) {
        let r2 = "number" == typeof t2 ? t2 : void 0;
        b().setFloat64(e10 + 8, S(r2) ? 0 : r2, true), b().setInt32(e10 + 0, !S(r2), true);
      }
      function e8(e10) {
        return e10;
      }
      function e7(e10, t2) {
        let r2 = "string" == typeof t2 ? t2 : void 0;
        var i2 = S(r2) ? 0 : m(r2, n.__wbindgen_malloc, n.__wbindgen_realloc), a2 = d;
        b().setInt32(e10 + 4, a2, true), b().setInt32(e10 + 0, i2, true);
      }
      function te(e10, t2) {
        return E(e10, t2);
      }
      function tt(e10, t2) {
        throw Error(E(e10, t2));
      }
    }, 697391, (e, t, r) => {
      Object.defineProperty(r, "__esModule", { value: true });
      let { PrismaClientKnownRequestError: n, PrismaClientUnknownRequestError: i, PrismaClientRustPanicError: a, PrismaClientInitializationError: s, PrismaClientValidationError: o, getPrismaClient: l, sqltag: u, empty: c, join: d, raw: p, skip: h, Decimal: f, Debug: g, objectEnumValues: m, makeStrictEnum: y, Extensions: b, warnOnce: w, defineDmmfProperty: v, Public: _, getRuntime: E, createParam: S } = e.r(904589), P = {};
      r.Prisma = P, r.$Enums = {}, P.prismaVersion = { client: "6.16.2", engine: "1c57fdcd7e44b29b9313256c76699e91c3ac3c43" }, P.PrismaClientKnownRequestError = n, P.PrismaClientUnknownRequestError = i, P.PrismaClientRustPanicError = a, P.PrismaClientInitializationError = s, P.PrismaClientValidationError = o, P.Decimal = f, P.sql = u, P.empty = c, P.join = d, P.raw = p, P.validator = _.validator, P.getExtensionContext = b.getExtensionContext, P.defineExtension = b.defineExtension, P.DbNull = m.instances.DbNull, P.JsonNull = m.instances.JsonNull, P.AnyNull = m.instances.AnyNull, P.NullTypes = { DbNull: m.classes.DbNull, JsonNull: m.classes.JsonNull, AnyNull: m.classes.AnyNull }, r.Prisma.TransactionIsolationLevel = y({ ReadUncommitted: "ReadUncommitted", ReadCommitted: "ReadCommitted", RepeatableRead: "RepeatableRead", Serializable: "Serializable" }), r.Prisma.UserScalarFieldEnum = { id: "id", userType: "userType", name: "name", birthDate: "birthDate", hashedPassword: "hashedPassword", email: "email", verifiedEmail: "verifiedEmail", authenticationPassword: "authenticationPassword", businessType: "businessType", companyName: "companyName", representativeName: "representativeName", businessNumber: "businessNumber", isActive: "isActive", lastLoginAt: "lastLoginAt", amount: "amount", createdAt: "createdAt", updatedAt: "updatedAt" }, r.Prisma.AddressScalarFieldEnum = { id: "id", country: "country", postalCode: "postalCode", state: "state", city: "city", addressLine1: "addressLine1", addressLine2: "addressLine2", userId: "userId", createdAt: "createdAt", updatedAt: "updatedAt" }, r.Prisma.PhoneScalarFieldEnum = { id: "id", hashedPhoneNumber: "hashedPhoneNumber", userId: "userId", createdAt: "createdAt", updatedAt: "updatedAt" }, r.Prisma.SupportScalarFieldEnum = { id: "id", title: "title", status: "status", priority: "priority", category: "category", respondedAt: "respondedAt", respondedBy: "respondedBy", createdAt: "createdAt", updatedAt: "updatedAt", userId: "userId" }, r.Prisma.SupportMessageScalarFieldEnum = { id: "id", content: "content", senderType: "senderType", senderId: "senderId", createdAt: "createdAt", supportId: "supportId" }, r.Prisma.PointScalarFieldEnum = { id: "id", type: "type", amount: "amount", description: "description", uniqueKey: "uniqueKey", userId: "userId", paymentId: "paymentId", updatedAt: "updatedAt", createdAt: "createdAt" }, r.Prisma.AdvertisementScalarFieldEnum = { id: "id", adType: "adType", status: "status", verified: "verified", budget: "budget", remainingBudget: "remainingBudget", targetId: "targetId", destinationUrl: "destinationUrl", verifiedAt: "verifiedAt", ytVideoCheckedAt: "ytVideoCheckedAt", createdAt: "createdAt", updatedAt: "updatedAt", userId: "userId", mediaFileId: "mediaFileId" }, r.Prisma.MediaFileScalarFieldEnum = { id: "id", filePath: "filePath", filePathV2: "filePathV2", mimeType: "mimeType", fileSize: "fileSize", destination: "destination", createdAt: "createdAt", userId: "userId" }, r.Prisma.PaymentScalarFieldEnum = { id: "id", orderId: "orderId", provider: "provider", paymentMethod: "paymentMethod", transactionId: "transactionId", purchaseAmount: "purchaseAmount", totalAmount: "totalAmount", currency: "currency", status: "status", expiredAt: "expiredAt", metadata: "metadata", createdAt: "createdAt", updatedAt: "updatedAt", userId: "userId" }, r.Prisma.NotificationScalarFieldEnum = { id: "id", title: "title", description: "description", isRead: "isRead", type: "type", createdAt: "createdAt", updatedAt: "updatedAt", userId: "userId" }, r.Prisma.AdStatsScalarFieldEnum = { id: "id", date: "date", impressions: "impressions", clicks: "clicks", spentPoints: "spentPoints", createdAt: "createdAt", updatedAt: "updatedAt", advertisementId: "advertisementId", userId: "userId" }, r.Prisma.SortOrder = { asc: "asc", desc: "desc" }, r.Prisma.NullableJsonNullValueInput = { DbNull: P.DbNull, JsonNull: P.JsonNull }, r.Prisma.QueryMode = { default: "default", insensitive: "insensitive" }, r.Prisma.NullsOrder = { first: "first", last: "last" }, r.Prisma.JsonNullValueFilter = { DbNull: P.DbNull, JsonNull: P.JsonNull, AnyNull: P.AnyNull }, r.Prisma.ModelName = { User: "User", Address: "Address", Phone: "Phone", Support: "Support", SupportMessage: "SupportMessage", Point: "Point", Advertisement: "Advertisement", MediaFile: "MediaFile", Payment: "Payment", Notification: "Notification", AdStats: "AdStats" };
      let x = { generator: { name: "client", provider: { fromEnvVar: null, value: "prisma-client-js" }, output: { value: "C:\\Users\\lmcr1\\practice\\adAppEnv\\v2\\node_modules\\@prisma\\client", fromEnvVar: null }, config: { engineType: "library" }, binaryTargets: [{ fromEnvVar: null, value: "windows", native: true }], previewFeatures: [], sourceFilePath: "C:\\Users\\lmcr1\\practice\\adAppEnv\\v2\\prisma\\schema.prisma" }, relativeEnvPaths: { rootEnvPath: null, schemaEnvPath: "../../../.env" }, relativePath: "../../../prisma", clientVersion: "6.16.2", engineVersion: "1c57fdcd7e44b29b9313256c76699e91c3ac3c43", datasourceNames: ["db"], activeProvider: "postgresql", postinstall: false, inlineDatasources: { db: { url: { fromEnvVar: "DATABASE_URL", value: null } } }, inlineSchema: 'generator client {\n  provider = "prisma-client-js"\n  //\u25A0[ prisma\u95A2\u4FC2\u306E\u578B\u63A8\u8AD6\u304C\u4E00\u5207\u6A5F\u80FD\u3057\u306A\u304F\u306A\u308B\u30A8\u30E9\u30FC ]\n  //\u30FB\u4EE5\u4E0B\u3092\u30B3\u30E1\u30F3\u30C8\u30A2\u30A6\u30C8\u3057\u3066\u300Cnpx prisma migrate dev\u300D\u3092\u5B9F\u884C\u3057\u305F\u3089\u89E3\u6C7A\u3057\u305F\n  //output   = "../src/generated/prisma" \n}\n\ndatasource db {\n  provider = "postgresql"\n  url      = env("DATABASE_URL")\n}\n\n// \u30E6\u30FC\u30B6\u30FC\uFF08\u5E83\u544A\u4E3B\uFF09\nmodel User {\n  id                     Int      @id @default(autoincrement())\n  userType               String // admin or advertiser\n  name                   String   @unique //\u6C0F\u540D\n  birthDate              DateTime // \u751F\u5E74\u6708\u65E5\uFF08\u5E74\u9F62\u78BA\u8A8D\u7528\uFF09\n  hashedPassword         String\n  email                  String   @unique\n  verifiedEmail          Boolean  @default(false)\n  authenticationPassword String\n\n  // \u4E8B\u696D\u8005\u60C5\u5831\n  businessType       String? // individual/corporate/null\n  companyName        String? // \u793E\u540D/\u5C4B\u53F7\n  representativeName String? // \u4EE3\u8868\u8005\u6C0F\u540D\n  businessNumber     String? // \u4E8B\u696D\u8005\u767B\u9332\u756A\u53F7(optional)\n\n  // \u30A2\u30AB\u30A6\u30F3\u30C8\u72B6\u614B\n  isActive    Boolean   @default(false)\n  lastLoginAt DateTime?\n  amount      Decimal   @default(0) @db.Decimal(10, 2) // \u7DCF\u30DD\u30A4\u30F3\u30C8\u6B8B\u9AD8\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  // \u30EA\u30EC\u30FC\u30B7\u30E7\u30F3\n  points         Point[]\n  advertisements Advertisement[]\n  mediaFiles     MediaFile[]\n  payments       Payment[]\n  notifications  Notification[]\n  supports       Support[]\n  Address        Address[]\n  Phone          Phone?\n  AdStats        AdStats[]\n\n  @@map("users")\n}\n\nmodel Address {\n  id Int @id @default(autoincrement())\n\n  // \u4F4F\u6240\u60C5\u5831\uFF08\u56FD\u969B\u5BFE\u5FDC\uFF09\n  // \u25A0[ Address Validation Strategy ]\n  // \u30FBPhase1: \u65E5\u672C\u56FD\u5185\u9650\u5B9A - \u7121\u6599\u306E\u65E5\u672C\u90F5\u4FBF\u756A\u53F7API\u5229\u7528\n  // \u30FBPhase2: \u6D77\u5916\u5C55\u958B\u6642 - \u6709\u6599\u306EGoogle Places API\u8FFD\u52A0\n  // \u30FBSchema: \u56FD\u969B\u5BFE\u5FDC\u6E08\u307F\uFF08\u5C06\u6765\u62E1\u5F35\u53EF\u80FD\uFF09\n  country      String? // \u56FD\uFF08Phase1: "\u65E5\u672C"\u56FA\u5B9A, Phase2: \u9078\u629E\u5F0F\uFF09\n  postalCode   String? // \u90F5\u4FBF\u756A\u53F7\uFF08Phase1: \u65E5\u672C\u5F62\u5F0F, Phase2: \u56FD\u5225\u5F62\u5F0F\uFF09\n  state        String? // \u90FD\u9053\u5E9C\u770C/\u5DDE\n  city         String? // \u5E02\u533A\u753A\u6751\n  addressLine1 String? // \u4F4F\u62401\u884C\u76EE\n  addressLine2 String? // \u4F4F\u62402\u884C\u76EE(optional)\n\n  userId Int\n  user   User @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel Phone {\n  id                Int      @id @default(autoincrement())\n  hashedPhoneNumber String //\u672B\u5C3E4\u5B57\u4EE5\u5916\u30CF\u30C3\u30B7\u30E5\u5316\n  userId            Int      @unique\n  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n  createdAt         DateTime @default(now())\n  updatedAt         DateTime @updatedAt\n}\n\n// \u30E6\u30FC\u30B6\u30FC\u30B5\u30DD\u30FC\u30C8\u30FB\u554F\u3044\u5408\u308F\u305B\uFF08\u30E1\u30A4\u30F3\u30C1\u30B1\u30C3\u30C8\uFF09\nmodel Support {\n  id          Int       @id @default(autoincrement())\n  title       String\n  status      String    @default("open") // open/in_progress/closed\n  priority    String    @default("medium") // low/medium/high\n  category    String // payment/advertisement/technical/other\n  respondedAt DateTime? // admin\u304C\u8FD4\u4FE1\u3057\u305F\u3089\u73FE\u5728\u6642\u523B\u3001advertiser\u304C\u8FD4\u4FE1\u3057\u305F\u3089null\n  respondedBy Int? // \u8FD4\u4FE1\u3057\u305F\u7BA1\u7406\u8005ID\uFF08nullable\uFF09\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  // \u30EA\u30EC\u30FC\u30B7\u30E7\u30F3\n  userId   Int\n  user     User             @relation(fields: [userId], references: [id], onDelete: Cascade)\n  messages SupportMessage[]\n\n  @@map("supports")\n}\n\n// \u30B5\u30DD\u30FC\u30C8\u30E1\u30C3\u30BB\u30FC\u30B8\uFF08\u30C1\u30E3\u30C3\u30C8\u5C65\u6B74\uFF09\nmodel SupportMessage {\n  id         Int    @id @default(autoincrement())\n  content    String @db.Text\n  senderType String // user/admin\n  senderId   Int // userId or adminId\n\n  createdAt DateTime @default(now())\n\n  // \u30EA\u30EC\u30FC\u30B7\u30E7\u30F3\n  supportId Int\n  support   Support @relation(fields: [supportId], references: [id], onDelete: Cascade)\n\n  @@index([supportId, createdAt]) // \u6642\u7CFB\u5217\u9806\u53D6\u5F97\u7528\n  @@map("support_messages")\n}\n\n// \u30DD\u30A4\u30F3\u30C8\u8CFC\u5165\u30FB\u6D88\u8CBB\u30FB\u8FD4\u91D1\u5C65\u6B74\nmodel Point {\n  id          Int     @id @default(autoincrement())\n  type        String // purchase/consume/refund\n  amount      Decimal @db.Decimal(10, 2) // \u52A0\u6E1B\u7B97\u30DD\u30A4\u30F3\u30C8\u6570\n  description String // \u53D6\u5F15\u5185\u5BB9\n  //ipn_callback_url\u3067\u306E\u51E6\u7406\u5931\u6557\u6642\u3001\u6574\u5408\u6027\u3092\u4FDD\u3064\u3079\u304F\u3001checkCryptoPaymentStatus\u3067\u3082DB\u66F4\u65B0\u51E6\u7406\u3092\u5B9F\u88C5\u3002\n  //\u305D\u306E\u969B\u306E\u3001\u51E6\u7406\u30BF\u30A4\u30DF\u30F3\u30B0\u304C\u30D0\u30C3\u30C6\u30A3\u30F3\u30B0\u3057\u3066\u3001ipn_callback_url \u3068 checkCryptoPaymentStatus \u3067\u66F4\u65B0\u51E6\u7406\u304C2\u5EA6\u8D70\u308B\u306E\u3092\u56DE\u907F\u3059\u308B\u70BA\u306B\u4F7F\u7528\u3002\n  //\u300CpaymentId\u300D\u304Cuuid\u3067\u306A\u3044\u3068\u3001\u7834\u7DBB\u3059\u308B\u3001\u3001\u3001\u3044\u3084\u3001Payment.id\u306Fautoincrement\uFF1D\u4E00\u610F\u306B\u306A\u308B\n  uniqueKey   String  @unique // payment-{paymentId}, consume-{datetime+random}, refund-{datetime+random}\n\n  // \u30EA\u30EC\u30FC\u30B7\u30E7\u30F3\n  userId    Int\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n  paymentId Int? // nullable, \u8CFC\u5165\u6642\u306E\u307F\n  payment   Payment? @relation(fields: [paymentId], references: [id])\n\n  updatedAt DateTime @updatedAt\n  createdAt DateTime @default(now())\n\n  @@map("points")\n}\n\n// \u5E83\u544A\u60C5\u5831\nmodel Advertisement {\n  id              Int     @id @default(autoincrement())\n  adType          String // priority/overlay/preroll/youtube-short/youtube-long\n  status          String  @default("draft") // draft/pending/approved/rejected/active/paused\n  verified        Boolean @default(false)\n  budget          Decimal @db.Decimal(10, 2) // \u8A2D\u5B9A\u4E88\u7B97\n  remainingBudget Decimal @db.Decimal(10, 2) // \u6B8B\u308A\u4E88\u7B97\n  targetId        String? // \u8A18\u4E8BID or YouTubeID\n  destinationUrl  String? // \u9077\u79FB\u5148URL(nullable)\n\n  verifiedAt       DateTime?\n  ytVideoCheckedAt DateTime? //12\u6642\u9593\u304A\u304D\u306B\u691C\u95B2\n  createdAt        DateTime  @default(now())\n  updatedAt        DateTime  @updatedAt\n\n  // \u30EA\u30EC\u30FC\u30B7\u30E7\u30F3\n  userId      Int\n  user        User       @relation(fields: [userId], references: [id], onDelete: Cascade)\n  mediaFileId Int? // nullable\n  mediaFile   MediaFile? @relation(fields: [mediaFileId], references: [id])\n  adStats     AdStats[]\n\n  @@map("advertisements")\n}\n\n// \u753B\u50CF\u30FB\u52D5\u753B\u7D20\u6750\u7BA1\u7406\nmodel MediaFile {\n  id          Int     @id @default(autoincrement())\n  filePath    String //\u307E\u305A\u306F\u8A66\u3057\u306BR2\u3067\u904B\u7528 \n  filePathV2  String? //\u5C06\u6765\u7684\u306B\u3001\u30B3\u30B9\u30C8\u304C\u5D69\u3080\u3088\u3046\u306A\u3089\u3001\u30EC\u30F3\u30BF\u30EB\u30B5\u30FC\u30D0\u30FC\u3092\u501F\u308A\u3001Wordpress\u3092\u30B9\u30C8\u30EC\u30FC\u30B8\u30B5\u30FC\u30D0\u30FC\u4EE3\u308F\u308A\u306B\n  mimeType    String // image/video\n  fileSize    Int\n  destination String // wp,r2\n\n  createdAt DateTime @default(now())\n\n  // \u30EA\u30EC\u30FC\u30B7\u30E7\u30F3\n  userId         Int\n  user           User            @relation(fields: [userId], references: [id], onDelete: Cascade)\n  advertisements Advertisement[]\n\n  @@map("media_files")\n}\n\n// \u6C7A\u6E08\u5C65\u6B74\nmodel Payment {\n  id             Int       @id @default(autoincrement())\n  orderId        String    @unique // \u30A2\u30D7\u30EA\u751F\u6210\u306E\u4E00\u610FID\n  provider       String // ccbill/nowpayments\n  paymentMethod  String // creditcard/bitcoin/ethereum/Litecoin\n  transactionId  String?   @unique // \u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u5074\u306EID            -------\u8FFD\u52A0\uFF1A\u672A\u53CD\u6620\uFF01\uFF01\uFF01\uFF01\uFF01\uFF01----------\n  purchaseAmount Decimal   @db.Decimal(10, 2) //\u8CFC\u5165\u91D1\u984D\n  totalAmount    Decimal   @db.Decimal(10, 2) //\u624B\u6570\u6599\u8FBC\n  currency       String // BTC/ETH/Litecoin\n  status         String    @default("pending") // pending/completed/failed/expired\n  expiredAt      DateTime? // \u6C7A\u6E08\u6709\u52B9\u671F\u9650\n  metadata       Json? // \u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u56FA\u6709\u30C7\u30FC\u30BF\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  // \u30EA\u30EC\u30FC\u30B7\u30E7\u30F3\n  userId Int\n  user   User    @relation(fields: [userId], references: [id], onDelete: Cascade)\n  points Point[]\n\n  @@map("payments")\n}\n\n// \u30E6\u30FC\u30B6\u30FC\u901A\u77E5\nmodel Notification {\n  id          Int     @id @default(autoincrement())\n  title       String\n  description String  @db.Text\n  isRead      Boolean @default(false)\n  type        String? // payment/advertisement/system/other\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  // \u30EA\u30EC\u30FC\u30B7\u30E7\u30F3\n  userId Int\n  user   User @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@map("notifications")\n}\n\nmodel AdStats {\n  id          Int      @id @default(autoincrement())\n  date        DateTime @db.Date // \u7D71\u8A08\u65E5\u4ED8\n  impressions Int      @default(0) // \u8868\u793A\u6570\n  clicks      Int      @default(0) // \u30AF\u30EA\u30C3\u30AF\u6570\n  spentPoints Decimal  @default(0) @db.Decimal(10, 2) // \u6D88\u8CBB\u30DD\u30A4\u30F3\u30C8\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  // \u30EA\u30EC\u30FC\u30B7\u30E7\u30F3\n  advertisementId Int\n  advertisement   Advertisement @relation(fields: [advertisementId], references: [id], onDelete: Cascade)\n\n  userId Int // \u8FFD\u52A0\uFF1A\u52B9\u7387\u5316\u306E\u305F\u3081\n  user   User @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  // \u30A4\u30F3\u30C7\u30C3\u30AF\u30B9\u6700\u9069\u5316\n  @@unique([advertisementId, date])\n  @@index([userId, date]) // \u30E6\u30FC\u30B6\u30FC\u5225\u7D71\u8A08\u7528\n  @@map("ad_stats")\n}\n', inlineSchemaHash: "c744663fdaea09ec416842fc971343f9d56a820eff093d51e1a912e64fc8a71b", copyEngine: true };
      x.dirname = "/", x.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"userType","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"birthDate","kind":"scalar","type":"DateTime"},{"name":"hashedPassword","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"verifiedEmail","kind":"scalar","type":"Boolean"},{"name":"authenticationPassword","kind":"scalar","type":"String"},{"name":"businessType","kind":"scalar","type":"String"},{"name":"companyName","kind":"scalar","type":"String"},{"name":"representativeName","kind":"scalar","type":"String"},{"name":"businessNumber","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"lastLoginAt","kind":"scalar","type":"DateTime"},{"name":"amount","kind":"scalar","type":"Decimal"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"points","kind":"object","type":"Point","relationName":"PointToUser"},{"name":"advertisements","kind":"object","type":"Advertisement","relationName":"AdvertisementToUser"},{"name":"mediaFiles","kind":"object","type":"MediaFile","relationName":"MediaFileToUser"},{"name":"payments","kind":"object","type":"Payment","relationName":"PaymentToUser"},{"name":"notifications","kind":"object","type":"Notification","relationName":"NotificationToUser"},{"name":"supports","kind":"object","type":"Support","relationName":"SupportToUser"},{"name":"Address","kind":"object","type":"Address","relationName":"AddressToUser"},{"name":"Phone","kind":"object","type":"Phone","relationName":"PhoneToUser"},{"name":"AdStats","kind":"object","type":"AdStats","relationName":"AdStatsToUser"}],"dbName":"users"},"Address":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"country","kind":"scalar","type":"String"},{"name":"postalCode","kind":"scalar","type":"String"},{"name":"state","kind":"scalar","type":"String"},{"name":"city","kind":"scalar","type":"String"},{"name":"addressLine1","kind":"scalar","type":"String"},{"name":"addressLine2","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"Int"},{"name":"user","kind":"object","type":"User","relationName":"AddressToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Phone":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"hashedPhoneNumber","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"Int"},{"name":"user","kind":"object","type":"User","relationName":"PhoneToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Support":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"title","kind":"scalar","type":"String"},{"name":"status","kind":"scalar","type":"String"},{"name":"priority","kind":"scalar","type":"String"},{"name":"category","kind":"scalar","type":"String"},{"name":"respondedAt","kind":"scalar","type":"DateTime"},{"name":"respondedBy","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"userId","kind":"scalar","type":"Int"},{"name":"user","kind":"object","type":"User","relationName":"SupportToUser"},{"name":"messages","kind":"object","type":"SupportMessage","relationName":"SupportToSupportMessage"}],"dbName":"supports"},"SupportMessage":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"content","kind":"scalar","type":"String"},{"name":"senderType","kind":"scalar","type":"String"},{"name":"senderId","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"supportId","kind":"scalar","type":"Int"},{"name":"support","kind":"object","type":"Support","relationName":"SupportToSupportMessage"}],"dbName":"support_messages"},"Point":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"type","kind":"scalar","type":"String"},{"name":"amount","kind":"scalar","type":"Decimal"},{"name":"description","kind":"scalar","type":"String"},{"name":"uniqueKey","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"Int"},{"name":"user","kind":"object","type":"User","relationName":"PointToUser"},{"name":"paymentId","kind":"scalar","type":"Int"},{"name":"payment","kind":"object","type":"Payment","relationName":"PaymentToPoint"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"points"},"Advertisement":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"adType","kind":"scalar","type":"String"},{"name":"status","kind":"scalar","type":"String"},{"name":"verified","kind":"scalar","type":"Boolean"},{"name":"budget","kind":"scalar","type":"Decimal"},{"name":"remainingBudget","kind":"scalar","type":"Decimal"},{"name":"targetId","kind":"scalar","type":"String"},{"name":"destinationUrl","kind":"scalar","type":"String"},{"name":"verifiedAt","kind":"scalar","type":"DateTime"},{"name":"ytVideoCheckedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"userId","kind":"scalar","type":"Int"},{"name":"user","kind":"object","type":"User","relationName":"AdvertisementToUser"},{"name":"mediaFileId","kind":"scalar","type":"Int"},{"name":"mediaFile","kind":"object","type":"MediaFile","relationName":"AdvertisementToMediaFile"},{"name":"adStats","kind":"object","type":"AdStats","relationName":"AdStatsToAdvertisement"}],"dbName":"advertisements"},"MediaFile":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"filePath","kind":"scalar","type":"String"},{"name":"filePathV2","kind":"scalar","type":"String"},{"name":"mimeType","kind":"scalar","type":"String"},{"name":"fileSize","kind":"scalar","type":"Int"},{"name":"destination","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"userId","kind":"scalar","type":"Int"},{"name":"user","kind":"object","type":"User","relationName":"MediaFileToUser"},{"name":"advertisements","kind":"object","type":"Advertisement","relationName":"AdvertisementToMediaFile"}],"dbName":"media_files"},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"provider","kind":"scalar","type":"String"},{"name":"paymentMethod","kind":"scalar","type":"String"},{"name":"transactionId","kind":"scalar","type":"String"},{"name":"purchaseAmount","kind":"scalar","type":"Decimal"},{"name":"totalAmount","kind":"scalar","type":"Decimal"},{"name":"currency","kind":"scalar","type":"String"},{"name":"status","kind":"scalar","type":"String"},{"name":"expiredAt","kind":"scalar","type":"DateTime"},{"name":"metadata","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"userId","kind":"scalar","type":"Int"},{"name":"user","kind":"object","type":"User","relationName":"PaymentToUser"},{"name":"points","kind":"object","type":"Point","relationName":"PaymentToPoint"}],"dbName":"payments"},"Notification":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"isRead","kind":"scalar","type":"Boolean"},{"name":"type","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"userId","kind":"scalar","type":"Int"},{"name":"user","kind":"object","type":"User","relationName":"NotificationToUser"}],"dbName":"notifications"},"AdStats":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"date","kind":"scalar","type":"DateTime"},{"name":"impressions","kind":"scalar","type":"Int"},{"name":"clicks","kind":"scalar","type":"Int"},{"name":"spentPoints","kind":"scalar","type":"Decimal"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"advertisementId","kind":"scalar","type":"Int"},{"name":"advertisement","kind":"object","type":"Advertisement","relationName":"AdStatsToAdvertisement"},{"name":"userId","kind":"scalar","type":"Int"},{"name":"user","kind":"object","type":"User","relationName":"AdStatsToUser"}],"dbName":"ad_stats"}},"enums":{},"types":{}}'), v(r.Prisma, x.runtimeDataModel), x.engineWasm = { getRuntime: async () => e.r(54998), getQueryEngineWasmModule: async () => {
        let t2 = (await Promise.resolve().then(() => e.i(406124))).default;
        return (await t2).default;
      } }, x.compilerWasm = void 0, x.injectableEdgeEnv = () => ({ parsed: { DATABASE_URL: "undefined" != typeof globalThis && globalThis.DATABASE_URL || "undefined" != typeof process && process.env && process.env.DATABASE_URL || void 0 } }), ("undefined" != typeof globalThis && globalThis.DEBUG || "undefined" != typeof process && process.env && process.env.DEBUG) && g.enable("undefined" != typeof globalThis && globalThis.DEBUG || "undefined" != typeof process && process.env && process.env.DEBUG || void 0), r.PrismaClient = l(x), Object.assign(r, P);
    }, 107565, (e, t, r) => {
      t.exports = { ...e.r(697391) };
    }, 303466, (e, t, r) => {
      t.exports = { ...e.r(107565) };
    }, 558217, (e) => {
      "use strict";
      let t, r;
      async function n() {
        return "_ENTRIES" in globalThis && _ENTRIES.middleware_instrumentation && await _ENTRIES.middleware_instrumentation;
      }
      e.s(["default", () => rh], 558217);
      let i = null;
      async function a() {
        if ("phase-production-build" === process.env.NEXT_PHASE) return;
        i || (i = n());
        let e10 = await i;
        if (null == e10 ? void 0 : e10.register) try {
          await e10.register();
        } catch (e11) {
          throw e11.message = `An error occurred while loading instrumentation hook: ${e11.message}`, e11;
        }
      }
      async function s(...e10) {
        let t10 = await n();
        try {
          var r2;
          await (null == t10 || null == (r2 = t10.onRequestError) ? void 0 : r2.call(t10, ...e10));
        } catch (e11) {
          console.error("Error in instrumentation.onRequestError:", e11);
        }
      }
      let o = null;
      function l() {
        return o || (o = a()), o;
      }
      function u(e10) {
        return `The edge runtime does not support Node.js '${e10}' module.
Learn More: https://nextjs.org/docs/messages/node-module-in-edge-runtime`;
      }
      process !== e.g.process && (process.env = e.g.process.env, e.g.process = process);
      try {
        Object.defineProperty(globalThis, "__import_unsupported", { value: function(e10) {
          let t10 = new Proxy(function() {
          }, { get(t11, r2) {
            if ("then" === r2) return {};
            throw Object.defineProperty(Error(u(e10)), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
          }, construct() {
            throw Object.defineProperty(Error(u(e10)), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
          }, apply(r2, n2, i2) {
            if ("function" == typeof i2[0]) return i2[0](t10);
            throw Object.defineProperty(Error(u(e10)), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
          } });
          return new Proxy({}, { get: () => t10 });
        }, enumerable: false, configurable: false });
      } catch {
      }
      l();
      class c extends Error {
        constructor({ page: e10 }) {
          super(`The middleware "${e10}" accepts an async API directly with the form:
  
  export function middleware(request, event) {
    return NextResponse.redirect('/new-location')
  }
  
  Read more: https://nextjs.org/docs/messages/middleware-new-signature
  `);
        }
      }
      class d extends Error {
        constructor() {
          super(`The request.page has been deprecated in favour of \`URLPattern\`.
  Read more: https://nextjs.org/docs/messages/middleware-request-page
  `);
        }
      }
      class p extends Error {
        constructor() {
          super(`The request.ua has been removed in favour of \`userAgent\` function.
  Read more: https://nextjs.org/docs/messages/middleware-parse-user-agent
  `);
        }
      }
      let h = "_N_T_", f = { shared: "shared", reactServerComponents: "rsc", serverSideRendering: "ssr", actionBrowser: "action-browser", apiNode: "api-node", apiEdge: "api-edge", middleware: "middleware", instrument: "instrument", edgeAsset: "edge-asset", appPagesBrowser: "app-pages-browser", pagesDirBrowser: "pages-dir-browser", pagesDirEdge: "pages-dir-edge", pagesDirNode: "pages-dir-node" };
      function g(e10) {
        var t10, r2, n2, i2, a2, s2 = [], o2 = 0;
        function l2() {
          for (; o2 < e10.length && /\s/.test(e10.charAt(o2)); ) o2 += 1;
          return o2 < e10.length;
        }
        for (; o2 < e10.length; ) {
          for (t10 = o2, a2 = false; l2(); ) if ("," === (r2 = e10.charAt(o2))) {
            for (n2 = o2, o2 += 1, l2(), i2 = o2; o2 < e10.length && "=" !== (r2 = e10.charAt(o2)) && ";" !== r2 && "," !== r2; ) o2 += 1;
            o2 < e10.length && "=" === e10.charAt(o2) ? (a2 = true, o2 = i2, s2.push(e10.substring(t10, n2)), t10 = o2) : o2 = n2 + 1;
          } else o2 += 1;
          (!a2 || o2 >= e10.length) && s2.push(e10.substring(t10, e10.length));
        }
        return s2;
      }
      function m(e10) {
        let t10 = {}, r2 = [];
        if (e10) for (let [n2, i2] of e10.entries()) "set-cookie" === n2.toLowerCase() ? (r2.push(...g(i2)), t10[n2] = 1 === r2.length ? r2[0] : r2) : t10[n2] = i2;
        return t10;
      }
      function y(e10) {
        try {
          return String(new URL(String(e10)));
        } catch (t10) {
          throw Object.defineProperty(Error(`URL is malformed "${String(e10)}". Please use only absolute URLs - https://nextjs.org/docs/messages/middleware-relative-urls`, { cause: t10 }), "__NEXT_ERROR_CODE", { value: "E61", enumerable: false, configurable: true });
        }
      }
      ({ ...f, GROUP: { builtinReact: [f.reactServerComponents, f.actionBrowser], serverOnly: [f.reactServerComponents, f.actionBrowser, f.instrument, f.middleware], neutralTarget: [f.apiNode, f.apiEdge], clientOnly: [f.serverSideRendering, f.appPagesBrowser], bundled: [f.reactServerComponents, f.actionBrowser, f.serverSideRendering, f.appPagesBrowser, f.shared, f.instrument, f.middleware], appPages: [f.reactServerComponents, f.serverSideRendering, f.appPagesBrowser, f.actionBrowser] } });
      let b = Symbol("response"), w = Symbol("passThrough"), v = Symbol("waitUntil");
      class _ {
        constructor(e10, t10) {
          this[w] = false, this[v] = t10 ? { kind: "external", function: t10 } : { kind: "internal", promises: [] };
        }
        respondWith(e10) {
          this[b] || (this[b] = Promise.resolve(e10));
        }
        passThroughOnException() {
          this[w] = true;
        }
        waitUntil(e10) {
          if ("external" === this[v].kind) return (0, this[v].function)(e10);
          this[v].promises.push(e10);
        }
      }
      class E extends _ {
        constructor(e10) {
          var t10;
          super(e10.request, null == (t10 = e10.context) ? void 0 : t10.waitUntil), this.sourcePage = e10.page;
        }
        get request() {
          throw Object.defineProperty(new c({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
        respondWith() {
          throw Object.defineProperty(new c({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
      }
      function S(e10) {
        return e10.replace(/\/$/, "") || "/";
      }
      function P(e10) {
        let t10 = e10.indexOf("#"), r2 = e10.indexOf("?"), n2 = r2 > -1 && (t10 < 0 || r2 < t10);
        return n2 || t10 > -1 ? { pathname: e10.substring(0, n2 ? r2 : t10), query: n2 ? e10.substring(r2, t10 > -1 ? t10 : void 0) : "", hash: t10 > -1 ? e10.slice(t10) : "" } : { pathname: e10, query: "", hash: "" };
      }
      function x(e10, t10) {
        if (!e10.startsWith("/") || !t10) return e10;
        let { pathname: r2, query: n2, hash: i2 } = P(e10);
        return "" + t10 + r2 + n2 + i2;
      }
      function A(e10, t10) {
        if (!e10.startsWith("/") || !t10) return e10;
        let { pathname: r2, query: n2, hash: i2 } = P(e10);
        return "" + r2 + t10 + n2 + i2;
      }
      function T(e10, t10) {
        if ("string" != typeof e10) return false;
        let { pathname: r2 } = P(e10);
        return r2 === t10 || r2.startsWith(t10 + "/");
      }
      let O = /* @__PURE__ */ new WeakMap();
      function R(e10, t10) {
        let r2;
        if (!t10) return { pathname: e10 };
        let n2 = O.get(t10);
        n2 || (n2 = t10.map((e11) => e11.toLowerCase()), O.set(t10, n2));
        let i2 = e10.split("/", 2);
        if (!i2[1]) return { pathname: e10 };
        let a2 = i2[1].toLowerCase(), s2 = n2.indexOf(a2);
        return s2 < 0 ? { pathname: e10 } : (r2 = t10[s2], { pathname: e10 = e10.slice(r2.length + 1) || "/", detectedLocale: r2 });
      }
      let C = /(?!^https?:\/\/)(127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}|\[::1\]|localhost)/;
      function k(e10, t10) {
        return new URL(String(e10).replace(C, "localhost"), t10 && String(t10).replace(C, "localhost"));
      }
      let N = Symbol("NextURLInternal");
      class I {
        constructor(e10, t10, r2) {
          let n2, i2;
          "object" == typeof t10 && "pathname" in t10 || "string" == typeof t10 ? (n2 = t10, i2 = r2 || {}) : i2 = r2 || t10 || {}, this[N] = { url: k(e10, n2 ?? i2.base), options: i2, basePath: "" }, this.analyze();
        }
        analyze() {
          var e10, t10, r2, n2, i2;
          let a2 = function(e11, t11) {
            var r3, n3;
            let { basePath: i3, i18n: a3, trailingSlash: s3 } = null != (r3 = t11.nextConfig) ? r3 : {}, o3 = { pathname: e11, trailingSlash: "/" !== e11 ? e11.endsWith("/") : s3 };
            i3 && T(o3.pathname, i3) && (o3.pathname = function(e12, t12) {
              if (!T(e12, t12)) return e12;
              let r4 = e12.slice(t12.length);
              return r4.startsWith("/") ? r4 : "/" + r4;
            }(o3.pathname, i3), o3.basePath = i3);
            let l2 = o3.pathname;
            if (o3.pathname.startsWith("/_next/data/") && o3.pathname.endsWith(".json")) {
              let e12 = o3.pathname.replace(/^\/_next\/data\//, "").replace(/\.json$/, "").split("/");
              o3.buildId = e12[0], l2 = "index" !== e12[1] ? "/" + e12.slice(1).join("/") : "/", true === t11.parseData && (o3.pathname = l2);
            }
            if (a3) {
              let e12 = t11.i18nProvider ? t11.i18nProvider.analyze(o3.pathname) : R(o3.pathname, a3.locales);
              o3.locale = e12.detectedLocale, o3.pathname = null != (n3 = e12.pathname) ? n3 : o3.pathname, !e12.detectedLocale && o3.buildId && (e12 = t11.i18nProvider ? t11.i18nProvider.analyze(l2) : R(l2, a3.locales)).detectedLocale && (o3.locale = e12.detectedLocale);
            }
            return o3;
          }(this[N].url.pathname, { nextConfig: this[N].options.nextConfig, parseData: true, i18nProvider: this[N].options.i18nProvider }), s2 = function(e11, t11) {
            let r3;
            if ((null == t11 ? void 0 : t11.host) && !Array.isArray(t11.host)) r3 = t11.host.toString().split(":", 1)[0];
            else {
              if (!e11.hostname) return;
              r3 = e11.hostname;
            }
            return r3.toLowerCase();
          }(this[N].url, this[N].options.headers);
          this[N].domainLocale = this[N].options.i18nProvider ? this[N].options.i18nProvider.detectDomainLocale(s2) : function(e11, t11, r3) {
            if (e11) for (let a3 of (r3 && (r3 = r3.toLowerCase()), e11)) {
              var n3, i3;
              if (t11 === (null == (n3 = a3.domain) ? void 0 : n3.split(":", 1)[0].toLowerCase()) || r3 === a3.defaultLocale.toLowerCase() || (null == (i3 = a3.locales) ? void 0 : i3.some((e12) => e12.toLowerCase() === r3))) return a3;
            }
          }(null == (t10 = this[N].options.nextConfig) || null == (e10 = t10.i18n) ? void 0 : e10.domains, s2);
          let o2 = (null == (r2 = this[N].domainLocale) ? void 0 : r2.defaultLocale) || (null == (i2 = this[N].options.nextConfig) || null == (n2 = i2.i18n) ? void 0 : n2.defaultLocale);
          this[N].url.pathname = a2.pathname, this[N].defaultLocale = o2, this[N].basePath = a2.basePath ?? "", this[N].buildId = a2.buildId, this[N].locale = a2.locale ?? o2, this[N].trailingSlash = a2.trailingSlash;
        }
        formatPathname() {
          var e10;
          let t10;
          return t10 = function(e11, t11, r2, n2) {
            if (!t11 || t11 === r2) return e11;
            let i2 = e11.toLowerCase();
            return !n2 && (T(i2, "/api") || T(i2, "/" + t11.toLowerCase())) ? e11 : x(e11, "/" + t11);
          }((e10 = { basePath: this[N].basePath, buildId: this[N].buildId, defaultLocale: this[N].options.forceLocale ? void 0 : this[N].defaultLocale, locale: this[N].locale, pathname: this[N].url.pathname, trailingSlash: this[N].trailingSlash }).pathname, e10.locale, e10.buildId ? void 0 : e10.defaultLocale, e10.ignorePrefix), (e10.buildId || !e10.trailingSlash) && (t10 = S(t10)), e10.buildId && (t10 = A(x(t10, "/_next/data/" + e10.buildId), "/" === e10.pathname ? "index.json" : ".json")), t10 = x(t10, e10.basePath), !e10.buildId && e10.trailingSlash ? t10.endsWith("/") ? t10 : A(t10, "/") : S(t10);
        }
        formatSearch() {
          return this[N].url.search;
        }
        get buildId() {
          return this[N].buildId;
        }
        set buildId(e10) {
          this[N].buildId = e10;
        }
        get locale() {
          return this[N].locale ?? "";
        }
        set locale(e10) {
          var t10, r2;
          if (!this[N].locale || !(null == (r2 = this[N].options.nextConfig) || null == (t10 = r2.i18n) ? void 0 : t10.locales.includes(e10))) throw Object.defineProperty(TypeError(`The NextURL configuration includes no locale "${e10}"`), "__NEXT_ERROR_CODE", { value: "E597", enumerable: false, configurable: true });
          this[N].locale = e10;
        }
        get defaultLocale() {
          return this[N].defaultLocale;
        }
        get domainLocale() {
          return this[N].domainLocale;
        }
        get searchParams() {
          return this[N].url.searchParams;
        }
        get host() {
          return this[N].url.host;
        }
        set host(e10) {
          this[N].url.host = e10;
        }
        get hostname() {
          return this[N].url.hostname;
        }
        set hostname(e10) {
          this[N].url.hostname = e10;
        }
        get port() {
          return this[N].url.port;
        }
        set port(e10) {
          this[N].url.port = e10;
        }
        get protocol() {
          return this[N].url.protocol;
        }
        set protocol(e10) {
          this[N].url.protocol = e10;
        }
        get href() {
          let e10 = this.formatPathname(), t10 = this.formatSearch();
          return `${this.protocol}//${this.host}${e10}${t10}${this.hash}`;
        }
        set href(e10) {
          this[N].url = k(e10), this.analyze();
        }
        get origin() {
          return this[N].url.origin;
        }
        get pathname() {
          return this[N].url.pathname;
        }
        set pathname(e10) {
          this[N].url.pathname = e10;
        }
        get hash() {
          return this[N].url.hash;
        }
        set hash(e10) {
          this[N].url.hash = e10;
        }
        get search() {
          return this[N].url.search;
        }
        set search(e10) {
          this[N].url.search = e10;
        }
        get password() {
          return this[N].url.password;
        }
        set password(e10) {
          this[N].url.password = e10;
        }
        get username() {
          return this[N].url.username;
        }
        set username(e10) {
          this[N].url.username = e10;
        }
        get basePath() {
          return this[N].basePath;
        }
        set basePath(e10) {
          this[N].basePath = e10.startsWith("/") ? e10 : `/${e10}`;
        }
        toString() {
          return this.href;
        }
        toJSON() {
          return this.href;
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { href: this.href, origin: this.origin, protocol: this.protocol, username: this.username, password: this.password, host: this.host, hostname: this.hostname, port: this.port, pathname: this.pathname, search: this.search, searchParams: this.searchParams, hash: this.hash };
        }
        clone() {
          return new I(String(this), this[N].options);
        }
      }
      var D, M = e.i(828042);
      let j = Symbol("internal request");
      class $ extends Request {
        constructor(e10, t10 = {}) {
          let r2 = "string" != typeof e10 && "url" in e10 ? e10.url : String(e10);
          y(r2), e10 instanceof Request ? super(e10, t10) : super(r2, t10);
          let n2 = new I(r2, { headers: m(this.headers), nextConfig: t10.nextConfig });
          this[j] = { cookies: new M.RequestCookies(this.headers), nextUrl: n2, url: n2.toString() };
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { cookies: this.cookies, nextUrl: this.nextUrl, url: this.url, bodyUsed: this.bodyUsed, cache: this.cache, credentials: this.credentials, destination: this.destination, headers: Object.fromEntries(this.headers), integrity: this.integrity, keepalive: this.keepalive, method: this.method, mode: this.mode, redirect: this.redirect, referrer: this.referrer, referrerPolicy: this.referrerPolicy, signal: this.signal };
        }
        get cookies() {
          return this[j].cookies;
        }
        get nextUrl() {
          return this[j].nextUrl;
        }
        get page() {
          throw new d();
        }
        get ua() {
          throw new p();
        }
        get url() {
          return this[j].url;
        }
      }
      class L {
        static get(e10, t10, r2) {
          let n2 = Reflect.get(e10, t10, r2);
          return "function" == typeof n2 ? n2.bind(e10) : n2;
        }
        static set(e10, t10, r2, n2) {
          return Reflect.set(e10, t10, r2, n2);
        }
        static has(e10, t10) {
          return Reflect.has(e10, t10);
        }
        static deleteProperty(e10, t10) {
          return Reflect.deleteProperty(e10, t10);
        }
      }
      let q = Symbol("internal response"), U = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
      function V(e10, t10) {
        var r2;
        if (null == e10 || null == (r2 = e10.request) ? void 0 : r2.headers) {
          if (!(e10.request.headers instanceof Headers)) throw Object.defineProperty(Error("request.headers must be an instance of Headers"), "__NEXT_ERROR_CODE", { value: "E119", enumerable: false, configurable: true });
          let r3 = [];
          for (let [n2, i2] of e10.request.headers) t10.set("x-middleware-request-" + n2, i2), r3.push(n2);
          t10.set("x-middleware-override-headers", r3.join(","));
        }
      }
      class F extends Response {
        constructor(e10, t10 = {}) {
          super(e10, t10);
          let r2 = this.headers, n2 = new Proxy(new M.ResponseCookies(r2), { get(e11, n3, i2) {
            switch (n3) {
              case "delete":
              case "set":
                return (...i3) => {
                  let a2 = Reflect.apply(e11[n3], e11, i3), s2 = new Headers(r2);
                  return a2 instanceof M.ResponseCookies && r2.set("x-middleware-set-cookie", a2.getAll().map((e12) => (0, M.stringifyCookie)(e12)).join(",")), V(t10, s2), a2;
                };
              default:
                return L.get(e11, n3, i2);
            }
          } });
          this[q] = { cookies: n2, url: t10.url ? new I(t10.url, { headers: m(r2), nextConfig: t10.nextConfig }) : void 0 };
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { cookies: this.cookies, url: this.url, body: this.body, bodyUsed: this.bodyUsed, headers: Object.fromEntries(this.headers), ok: this.ok, redirected: this.redirected, status: this.status, statusText: this.statusText, type: this.type };
        }
        get cookies() {
          return this[q].cookies;
        }
        static json(e10, t10) {
          let r2 = Response.json(e10, t10);
          return new F(r2.body, r2);
        }
        static redirect(e10, t10) {
          let r2 = "number" == typeof t10 ? t10 : (null == t10 ? void 0 : t10.status) ?? 307;
          if (!U.has(r2)) throw Object.defineProperty(RangeError('Failed to execute "redirect" on "response": Invalid status code'), "__NEXT_ERROR_CODE", { value: "E529", enumerable: false, configurable: true });
          let n2 = "object" == typeof t10 ? t10 : {}, i2 = new Headers(null == n2 ? void 0 : n2.headers);
          return i2.set("Location", y(e10)), new F(null, { ...n2, headers: i2, status: r2 });
        }
        static rewrite(e10, t10) {
          let r2 = new Headers(null == t10 ? void 0 : t10.headers);
          return r2.set("x-middleware-rewrite", y(e10)), V(t10, r2), new F(null, { ...t10, headers: r2 });
        }
        static next(e10) {
          let t10 = new Headers(null == e10 ? void 0 : e10.headers);
          return t10.set("x-middleware-next", "1"), V(e10, t10), new F(null, { ...e10, headers: t10 });
        }
      }
      function B(e10, t10) {
        let r2 = "string" == typeof t10 ? new URL(t10) : t10, n2 = new URL(e10, t10), i2 = n2.origin === r2.origin;
        return { url: i2 ? n2.toString().slice(r2.origin.length) : n2.toString(), isRelative: i2 };
      }
      let W = "next-router-prefetch", H = ["rsc", "next-router-state-tree", W, "next-hmr-refresh", "next-router-segment-prefetch"], K = "_rsc";
      class J extends Error {
        constructor() {
          super("Headers cannot be modified. Read more: https://nextjs.org/docs/app/api-reference/functions/headers");
        }
        static callable() {
          throw new J();
        }
      }
      class G extends Headers {
        constructor(e10) {
          super(), this.headers = new Proxy(e10, { get(t10, r2, n2) {
            if ("symbol" == typeof r2) return L.get(t10, r2, n2);
            let i2 = r2.toLowerCase(), a2 = Object.keys(e10).find((e11) => e11.toLowerCase() === i2);
            if (void 0 !== a2) return L.get(t10, a2, n2);
          }, set(t10, r2, n2, i2) {
            if ("symbol" == typeof r2) return L.set(t10, r2, n2, i2);
            let a2 = r2.toLowerCase(), s2 = Object.keys(e10).find((e11) => e11.toLowerCase() === a2);
            return L.set(t10, s2 ?? r2, n2, i2);
          }, has(t10, r2) {
            if ("symbol" == typeof r2) return L.has(t10, r2);
            let n2 = r2.toLowerCase(), i2 = Object.keys(e10).find((e11) => e11.toLowerCase() === n2);
            return void 0 !== i2 && L.has(t10, i2);
          }, deleteProperty(t10, r2) {
            if ("symbol" == typeof r2) return L.deleteProperty(t10, r2);
            let n2 = r2.toLowerCase(), i2 = Object.keys(e10).find((e11) => e11.toLowerCase() === n2);
            return void 0 === i2 || L.deleteProperty(t10, i2);
          } });
        }
        static seal(e10) {
          return new Proxy(e10, { get(e11, t10, r2) {
            switch (t10) {
              case "append":
              case "delete":
              case "set":
                return J.callable;
              default:
                return L.get(e11, t10, r2);
            }
          } });
        }
        merge(e10) {
          return Array.isArray(e10) ? e10.join(", ") : e10;
        }
        static from(e10) {
          return e10 instanceof Headers ? e10 : new G(e10);
        }
        append(e10, t10) {
          let r2 = this.headers[e10];
          "string" == typeof r2 ? this.headers[e10] = [r2, t10] : Array.isArray(r2) ? r2.push(t10) : this.headers[e10] = t10;
        }
        delete(e10) {
          delete this.headers[e10];
        }
        get(e10) {
          let t10 = this.headers[e10];
          return void 0 !== t10 ? this.merge(t10) : null;
        }
        has(e10) {
          return void 0 !== this.headers[e10];
        }
        set(e10, t10) {
          this.headers[e10] = t10;
        }
        forEach(e10, t10) {
          for (let [r2, n2] of this.entries()) e10.call(t10, n2, r2, this);
        }
        *entries() {
          for (let e10 of Object.keys(this.headers)) {
            let t10 = e10.toLowerCase(), r2 = this.get(t10);
            yield [t10, r2];
          }
        }
        *keys() {
          for (let e10 of Object.keys(this.headers)) {
            let t10 = e10.toLowerCase();
            yield t10;
          }
        }
        *values() {
          for (let e10 of Object.keys(this.headers)) {
            let t10 = this.get(e10);
            yield t10;
          }
        }
        [Symbol.iterator]() {
          return this.entries();
        }
      }
      let z = Object.defineProperty(Error("Invariant: AsyncLocalStorage accessed in runtime where it is not available"), "__NEXT_ERROR_CODE", { value: "E504", enumerable: false, configurable: true });
      class Q {
        disable() {
          throw z;
        }
        getStore() {
        }
        run() {
          throw z;
        }
        exit() {
          throw z;
        }
        enterWith() {
          throw z;
        }
        static bind(e10) {
          return e10;
        }
      }
      let X = "undefined" != typeof globalThis && globalThis.AsyncLocalStorage;
      function Y() {
        return X ? new X() : new Q();
      }
      let Z = Y();
      class ee extends Error {
        constructor() {
          super("Cookies can only be modified in a Server Action or Route Handler. Read more: https://nextjs.org/docs/app/api-reference/functions/cookies#options");
        }
        static callable() {
          throw new ee();
        }
      }
      class et {
        static seal(e10) {
          return new Proxy(e10, { get(e11, t10, r2) {
            switch (t10) {
              case "clear":
              case "delete":
              case "set":
                return ee.callable;
              default:
                return L.get(e11, t10, r2);
            }
          } });
        }
      }
      let er = Symbol.for("next.mutated.cookies");
      class en {
        static wrap(e10, t10) {
          let r2 = new M.ResponseCookies(new Headers());
          for (let t11 of e10.getAll()) r2.set(t11);
          let n2 = [], i2 = /* @__PURE__ */ new Set(), a2 = () => {
            let e11 = Z.getStore();
            if (e11 && (e11.pathWasRevalidated = true), n2 = r2.getAll().filter((e12) => i2.has(e12.name)), t10) {
              let e12 = [];
              for (let t11 of n2) {
                let r3 = new M.ResponseCookies(new Headers());
                r3.set(t11), e12.push(r3.toString());
              }
              t10(e12);
            }
          }, s2 = new Proxy(r2, { get(e11, t11, r3) {
            switch (t11) {
              case er:
                return n2;
              case "delete":
                return function(...t12) {
                  i2.add("string" == typeof t12[0] ? t12[0] : t12[0].name);
                  try {
                    return e11.delete(...t12), s2;
                  } finally {
                    a2();
                  }
                };
              case "set":
                return function(...t12) {
                  i2.add("string" == typeof t12[0] ? t12[0] : t12[0].name);
                  try {
                    return e11.set(...t12), s2;
                  } finally {
                    a2();
                  }
                };
              default:
                return L.get(e11, t11, r3);
            }
          } });
          return s2;
        }
      }
      function ei(e10) {
        return "action" === e10.phase;
      }
      function ea(e10, t10) {
        if (!ei(e10)) throw new ee();
      }
      var es = function(e10) {
        return e10.handleRequest = "BaseServer.handleRequest", e10.run = "BaseServer.run", e10.pipe = "BaseServer.pipe", e10.getStaticHTML = "BaseServer.getStaticHTML", e10.render = "BaseServer.render", e10.renderToResponseWithComponents = "BaseServer.renderToResponseWithComponents", e10.renderToResponse = "BaseServer.renderToResponse", e10.renderToHTML = "BaseServer.renderToHTML", e10.renderError = "BaseServer.renderError", e10.renderErrorToResponse = "BaseServer.renderErrorToResponse", e10.renderErrorToHTML = "BaseServer.renderErrorToHTML", e10.render404 = "BaseServer.render404", e10;
      }(es || {}), eo = function(e10) {
        return e10.loadDefaultErrorComponents = "LoadComponents.loadDefaultErrorComponents", e10.loadComponents = "LoadComponents.loadComponents", e10;
      }(eo || {}), el = function(e10) {
        return e10.getRequestHandler = "NextServer.getRequestHandler", e10.getServer = "NextServer.getServer", e10.getServerRequestHandler = "NextServer.getServerRequestHandler", e10.createServer = "createServer.createServer", e10;
      }(el || {}), eu = function(e10) {
        return e10.compression = "NextNodeServer.compression", e10.getBuildId = "NextNodeServer.getBuildId", e10.createComponentTree = "NextNodeServer.createComponentTree", e10.clientComponentLoading = "NextNodeServer.clientComponentLoading", e10.getLayoutOrPageModule = "NextNodeServer.getLayoutOrPageModule", e10.generateStaticRoutes = "NextNodeServer.generateStaticRoutes", e10.generateFsStaticRoutes = "NextNodeServer.generateFsStaticRoutes", e10.generatePublicRoutes = "NextNodeServer.generatePublicRoutes", e10.generateImageRoutes = "NextNodeServer.generateImageRoutes.route", e10.sendRenderResult = "NextNodeServer.sendRenderResult", e10.proxyRequest = "NextNodeServer.proxyRequest", e10.runApi = "NextNodeServer.runApi", e10.render = "NextNodeServer.render", e10.renderHTML = "NextNodeServer.renderHTML", e10.imageOptimizer = "NextNodeServer.imageOptimizer", e10.getPagePath = "NextNodeServer.getPagePath", e10.getRoutesManifest = "NextNodeServer.getRoutesManifest", e10.findPageComponents = "NextNodeServer.findPageComponents", e10.getFontManifest = "NextNodeServer.getFontManifest", e10.getServerComponentManifest = "NextNodeServer.getServerComponentManifest", e10.getRequestHandler = "NextNodeServer.getRequestHandler", e10.renderToHTML = "NextNodeServer.renderToHTML", e10.renderError = "NextNodeServer.renderError", e10.renderErrorToHTML = "NextNodeServer.renderErrorToHTML", e10.render404 = "NextNodeServer.render404", e10.startResponse = "NextNodeServer.startResponse", e10.route = "route", e10.onProxyReq = "onProxyReq", e10.apiResolver = "apiResolver", e10.internalFetch = "internalFetch", e10;
      }(eu || {}), ec = function(e10) {
        return e10.startServer = "startServer.startServer", e10;
      }(ec || {}), ed = function(e10) {
        return e10.getServerSideProps = "Render.getServerSideProps", e10.getStaticProps = "Render.getStaticProps", e10.renderToString = "Render.renderToString", e10.renderDocument = "Render.renderDocument", e10.createBodyResult = "Render.createBodyResult", e10;
      }(ed || {}), ep = function(e10) {
        return e10.renderToString = "AppRender.renderToString", e10.renderToReadableStream = "AppRender.renderToReadableStream", e10.getBodyResult = "AppRender.getBodyResult", e10.fetch = "AppRender.fetch", e10;
      }(ep || {}), eh = function(e10) {
        return e10.executeRoute = "Router.executeRoute", e10;
      }(eh || {}), ef = function(e10) {
        return e10.runHandler = "Node.runHandler", e10;
      }(ef || {}), eg = function(e10) {
        return e10.runHandler = "AppRouteRouteHandlers.runHandler", e10;
      }(eg || {}), em = function(e10) {
        return e10.generateMetadata = "ResolveMetadata.generateMetadata", e10.generateViewport = "ResolveMetadata.generateViewport", e10;
      }(em || {}), ey = function(e10) {
        return e10.execute = "Middleware.execute", e10;
      }(ey || {});
      let eb = ["Middleware.execute", "BaseServer.handleRequest", "Render.getServerSideProps", "Render.getStaticProps", "AppRender.fetch", "AppRender.getBodyResult", "Render.renderDocument", "Node.runHandler", "AppRouteRouteHandlers.runHandler", "ResolveMetadata.generateMetadata", "ResolveMetadata.generateViewport", "NextNodeServer.createComponentTree", "NextNodeServer.findPageComponents", "NextNodeServer.getLayoutOrPageModule", "NextNodeServer.startResponse", "NextNodeServer.clientComponentLoading"], ew = ["NextNodeServer.findPageComponents", "NextNodeServer.createComponentTree", "NextNodeServer.clientComponentLoading"];
      function ev(e10) {
        return null !== e10 && "object" == typeof e10 && "then" in e10 && "function" == typeof e10.then;
      }
      let { context: e_, propagation: eE, trace: eS, SpanStatusCode: eP, SpanKind: ex, ROOT_CONTEXT: eA } = t = e.r(459110);
      class eT extends Error {
        constructor(e10, t10) {
          super(), this.bubble = e10, this.result = t10;
        }
      }
      let eO = (e10, t10) => {
        (function(e11) {
          return "object" == typeof e11 && null !== e11 && e11 instanceof eT;
        })(t10) && t10.bubble ? e10.setAttribute("next.bubble", true) : (t10 && (e10.recordException(t10), e10.setAttribute("error.type", t10.name)), e10.setStatus({ code: eP.ERROR, message: null == t10 ? void 0 : t10.message })), e10.end();
      }, eR = /* @__PURE__ */ new Map(), eC = t.createContextKey("next.rootSpanId"), ek = 0, eN = { set(e10, t10, r2) {
        e10.push({ key: t10, value: r2 });
      } };
      class eI {
        getTracerInstance() {
          return eS.getTracer("next.js", "0.0.1");
        }
        getContext() {
          return e_;
        }
        getTracePropagationData() {
          let e10 = e_.active(), t10 = [];
          return eE.inject(e10, t10, eN), t10;
        }
        getActiveScopeSpan() {
          return eS.getSpan(null == e_ ? void 0 : e_.active());
        }
        withPropagatedContext(e10, t10, r2) {
          let n2 = e_.active();
          if (eS.getSpanContext(n2)) return t10();
          let i2 = eE.extract(n2, e10, r2);
          return e_.with(i2, t10);
        }
        trace(...e10) {
          var t10;
          let [r2, n2, i2] = e10, { fn: a2, options: s2 } = "function" == typeof n2 ? { fn: n2, options: {} } : { fn: i2, options: { ...n2 } }, o2 = s2.spanName ?? r2;
          if (!eb.includes(r2) && "1" !== process.env.NEXT_OTEL_VERBOSE || s2.hideSpan) return a2();
          let l2 = this.getSpanContext((null == s2 ? void 0 : s2.parentSpan) ?? this.getActiveScopeSpan()), u2 = false;
          l2 ? (null == (t10 = eS.getSpanContext(l2)) ? void 0 : t10.isRemote) && (u2 = true) : (l2 = (null == e_ ? void 0 : e_.active()) ?? eA, u2 = true);
          let c2 = ek++;
          return s2.attributes = { "next.span_name": o2, "next.span_type": r2, ...s2.attributes }, e_.with(l2.setValue(eC, c2), () => this.getTracerInstance().startActiveSpan(o2, s2, (e11) => {
            let t11 = "performance" in globalThis && "measure" in performance ? globalThis.performance.now() : void 0, n3 = () => {
              eR.delete(c2), t11 && process.env.NEXT_OTEL_PERFORMANCE_PREFIX && ew.includes(r2 || "") && performance.measure(`${process.env.NEXT_OTEL_PERFORMANCE_PREFIX}:next-${(r2.split(".").pop() || "").replace(/[A-Z]/g, (e12) => "-" + e12.toLowerCase())}`, { start: t11, end: performance.now() });
            };
            u2 && eR.set(c2, new Map(Object.entries(s2.attributes ?? {})));
            try {
              if (a2.length > 1) return a2(e11, (t13) => eO(e11, t13));
              let t12 = a2(e11);
              if (ev(t12)) return t12.then((t13) => (e11.end(), t13)).catch((t13) => {
                throw eO(e11, t13), t13;
              }).finally(n3);
              return e11.end(), n3(), t12;
            } catch (t12) {
              throw eO(e11, t12), n3(), t12;
            }
          }));
        }
        wrap(...e10) {
          let t10 = this, [r2, n2, i2] = 3 === e10.length ? e10 : [e10[0], {}, e10[1]];
          return eb.includes(r2) || "1" === process.env.NEXT_OTEL_VERBOSE ? function() {
            let e11 = n2;
            "function" == typeof e11 && "function" == typeof i2 && (e11 = e11.apply(this, arguments));
            let a2 = arguments.length - 1, s2 = arguments[a2];
            if ("function" != typeof s2) return t10.trace(r2, e11, () => i2.apply(this, arguments));
            {
              let n3 = t10.getContext().bind(e_.active(), s2);
              return t10.trace(r2, e11, (e12, t11) => (arguments[a2] = function(e13) {
                return null == t11 || t11(e13), n3.apply(this, arguments);
              }, i2.apply(this, arguments)));
            }
          } : i2;
        }
        startSpan(...e10) {
          let [t10, r2] = e10, n2 = this.getSpanContext((null == r2 ? void 0 : r2.parentSpan) ?? this.getActiveScopeSpan());
          return this.getTracerInstance().startSpan(t10, r2, n2);
        }
        getSpanContext(e10) {
          return e10 ? eS.setSpan(e_.active(), e10) : void 0;
        }
        getRootSpanAttributes() {
          let e10 = e_.active().getValue(eC);
          return eR.get(e10);
        }
        setRootSpanAttribute(e10, t10) {
          let r2 = e_.active().getValue(eC), n2 = eR.get(r2);
          n2 && n2.set(e10, t10);
        }
      }
      let eD = (() => {
        let e10 = new eI();
        return () => e10;
      })(), eM = "__prerender_bypass";
      Symbol("__next_preview_data"), Symbol(eM);
      class ej {
        constructor(e10, t10, r2, n2) {
          var i2;
          let a2 = e10 && function(e11, t11) {
            let r3 = G.from(e11.headers);
            return { isOnDemandRevalidate: r3.get("x-prerender-revalidate") === t11.previewModeId, revalidateOnlyGenerated: r3.has("x-prerender-revalidate-if-generated") };
          }(t10, e10).isOnDemandRevalidate, s2 = null == (i2 = r2.get(eM)) ? void 0 : i2.value;
          this._isEnabled = !!(!a2 && s2 && e10 && s2 === e10.previewModeId), this._previewModeId = null == e10 ? void 0 : e10.previewModeId, this._mutableCookies = n2;
        }
        get isEnabled() {
          return this._isEnabled;
        }
        enable() {
          if (!this._previewModeId) throw Object.defineProperty(Error("Invariant: previewProps missing previewModeId this should never happen"), "__NEXT_ERROR_CODE", { value: "E93", enumerable: false, configurable: true });
          this._mutableCookies.set({ name: eM, value: this._previewModeId, httpOnly: true, sameSite: "none", secure: true, path: "/" }), this._isEnabled = true;
        }
        disable() {
          this._mutableCookies.set({ name: eM, value: "", httpOnly: true, sameSite: "none", secure: true, path: "/", expires: /* @__PURE__ */ new Date(0) }), this._isEnabled = false;
        }
      }
      function e$(e10, t10) {
        if ("x-middleware-set-cookie" in e10.headers && "string" == typeof e10.headers["x-middleware-set-cookie"]) {
          let r2 = e10.headers["x-middleware-set-cookie"], n2 = new Headers();
          for (let e11 of g(r2)) n2.append("set-cookie", e11);
          for (let e11 of new M.ResponseCookies(n2).getAll()) t10.set(e11);
        }
      }
      let eL = Y();
      class eq extends Error {
        constructor(e10, t10) {
          super("Invariant: " + (e10.endsWith(".") ? e10 : e10 + ".") + " This is a bug in Next.js.", t10), this.name = "InvariantError";
        }
      }
      var eU = e.i(299734);
      e.i(951615);
      class eV {
        constructor(e10, t10, r2) {
          this.prev = null, this.next = null, this.key = e10, this.data = t10, this.size = r2;
        }
      }
      class eF {
        constructor() {
          this.prev = null, this.next = null;
        }
      }
      class eB {
        constructor(e10, t10) {
          this.cache = /* @__PURE__ */ new Map(), this.totalSize = 0, this.maxSize = e10, this.calculateSize = t10, this.head = new eF(), this.tail = new eF(), this.head.next = this.tail, this.tail.prev = this.head;
        }
        addToHead(e10) {
          e10.prev = this.head, e10.next = this.head.next, this.head.next.prev = e10, this.head.next = e10;
        }
        removeNode(e10) {
          e10.prev.next = e10.next, e10.next.prev = e10.prev;
        }
        moveToHead(e10) {
          this.removeNode(e10), this.addToHead(e10);
        }
        removeTail() {
          let e10 = this.tail.prev;
          return this.removeNode(e10), e10;
        }
        set(e10, t10) {
          let r2 = (null == this.calculateSize ? void 0 : this.calculateSize.call(this, t10)) ?? 1;
          if (r2 > this.maxSize) return void console.warn("Single item size exceeds maxSize");
          let n2 = this.cache.get(e10);
          if (n2) n2.data = t10, this.totalSize = this.totalSize - n2.size + r2, n2.size = r2, this.moveToHead(n2);
          else {
            let n3 = new eV(e10, t10, r2);
            this.cache.set(e10, n3), this.addToHead(n3), this.totalSize += r2;
          }
          for (; this.totalSize > this.maxSize && this.cache.size > 0; ) {
            let e11 = this.removeTail();
            this.cache.delete(e11.key), this.totalSize -= e11.size;
          }
        }
        has(e10) {
          return this.cache.has(e10);
        }
        get(e10) {
          let t10 = this.cache.get(e10);
          if (t10) return this.moveToHead(t10), t10.data;
        }
        *[Symbol.iterator]() {
          let e10 = this.head.next;
          for (; e10 && e10 !== this.tail; ) {
            let t10 = e10;
            yield [t10.key, t10.data], e10 = e10.next;
          }
        }
        remove(e10) {
          let t10 = this.cache.get(e10);
          t10 && (this.removeNode(t10), this.cache.delete(e10), this.totalSize -= t10.size);
        }
        get size() {
          return this.cache.size;
        }
        get currentSize() {
          return this.totalSize;
        }
      }
      new eB(52428800, (e10) => e10.size), process.env.NEXT_PRIVATE_DEBUG_CACHE && console.debug.bind(console, "DefaultCacheHandler:"), process.env.NEXT_PRIVATE_DEBUG_CACHE && ((e10, ...t10) => {
        console.log(`use-cache: ${e10}`, ...t10);
      }), Symbol.for("@next/cache-handlers");
      let eW = Symbol.for("@next/cache-handlers-map"), eH = Symbol.for("@next/cache-handlers-set"), eK = globalThis;
      function eJ() {
        if (eK[eW]) return eK[eW].entries();
      }
      async function eG(e10, t10) {
        if (!e10) return t10();
        let r2 = ez(e10);
        try {
          return await t10();
        } finally {
          let t11 = function(e11, t12) {
            let r3 = new Set(e11.pendingRevalidatedTags), n2 = new Set(e11.pendingRevalidateWrites);
            return { pendingRevalidatedTags: t12.pendingRevalidatedTags.filter((e12) => !r3.has(e12)), pendingRevalidates: Object.fromEntries(Object.entries(t12.pendingRevalidates).filter(([t13]) => !(t13 in e11.pendingRevalidates))), pendingRevalidateWrites: t12.pendingRevalidateWrites.filter((e12) => !n2.has(e12)) };
          }(r2, ez(e10));
          await eX(e10, t11);
        }
      }
      function ez(e10) {
        return { pendingRevalidatedTags: e10.pendingRevalidatedTags ? [...e10.pendingRevalidatedTags] : [], pendingRevalidates: { ...e10.pendingRevalidates }, pendingRevalidateWrites: e10.pendingRevalidateWrites ? [...e10.pendingRevalidateWrites] : [] };
      }
      async function eQ(e10, t10) {
        if (0 === e10.length) return;
        let r2 = [];
        t10 && r2.push(t10.revalidateTag(e10));
        let n2 = function() {
          if (eK[eH]) return eK[eH].values();
        }();
        if (n2) for (let t11 of n2) r2.push(t11.expireTags(...e10));
        await Promise.all(r2);
      }
      async function eX(e10, t10) {
        let r2 = (null == t10 ? void 0 : t10.pendingRevalidatedTags) ?? e10.pendingRevalidatedTags ?? [], n2 = (null == t10 ? void 0 : t10.pendingRevalidates) ?? e10.pendingRevalidates ?? {}, i2 = (null == t10 ? void 0 : t10.pendingRevalidateWrites) ?? e10.pendingRevalidateWrites ?? [];
        return Promise.all([eQ(r2, e10.incrementalCache), ...Object.values(n2), ...i2]);
      }
      let eY = Y();
      class eZ {
        constructor({ waitUntil: e10, onClose: t10, onTaskError: r2 }) {
          this.workUnitStores = /* @__PURE__ */ new Set(), this.waitUntil = e10, this.onClose = t10, this.onTaskError = r2, this.callbackQueue = new eU.default(), this.callbackQueue.pause();
        }
        after(e10) {
          if (ev(e10)) this.waitUntil || e0(), this.waitUntil(e10.catch((e11) => this.reportTaskError("promise", e11)));
          else if ("function" == typeof e10) this.addCallback(e10);
          else throw Object.defineProperty(Error("`after()`: Argument must be a promise or a function"), "__NEXT_ERROR_CODE", { value: "E50", enumerable: false, configurable: true });
        }
        addCallback(e10) {
          var t10;
          this.waitUntil || e0();
          let r2 = eL.getStore();
          r2 && this.workUnitStores.add(r2);
          let n2 = eY.getStore(), i2 = n2 ? n2.rootTaskSpawnPhase : null == r2 ? void 0 : r2.phase;
          this.runCallbacksOnClosePromise || (this.runCallbacksOnClosePromise = this.runCallbacksOnClose(), this.waitUntil(this.runCallbacksOnClosePromise));
          let a2 = (t10 = async () => {
            try {
              await eY.run({ rootTaskSpawnPhase: i2 }, () => e10());
            } catch (e11) {
              this.reportTaskError("function", e11);
            }
          }, X ? X.bind(t10) : Q.bind(t10));
          this.callbackQueue.add(a2);
        }
        async runCallbacksOnClose() {
          return await new Promise((e10) => this.onClose(e10)), this.runCallbacks();
        }
        async runCallbacks() {
          if (0 === this.callbackQueue.size) return;
          for (let e11 of this.workUnitStores) e11.phase = "after";
          let e10 = Z.getStore();
          if (!e10) throw Object.defineProperty(new eq("Missing workStore in AfterContext.runCallbacks"), "__NEXT_ERROR_CODE", { value: "E547", enumerable: false, configurable: true });
          return eG(e10, () => (this.callbackQueue.start(), this.callbackQueue.onIdle()));
        }
        reportTaskError(e10, t10) {
          if (console.error("promise" === e10 ? "A promise passed to `after()` rejected:" : "An error occurred in a function passed to `after()`:", t10), this.onTaskError) try {
            null == this.onTaskError || this.onTaskError.call(this, t10);
          } catch (e11) {
            console.error(Object.defineProperty(new eq("`onTaskError` threw while handling an error thrown from an `after` task", { cause: e11 }), "__NEXT_ERROR_CODE", { value: "E569", enumerable: false, configurable: true }));
          }
        }
      }
      function e0() {
        throw Object.defineProperty(Error("`after()` will not work correctly, because `waitUntil` is not available in the current environment."), "__NEXT_ERROR_CODE", { value: "E91", enumerable: false, configurable: true });
      }
      function e1(e10) {
        let t10, r2 = { then: (n2, i2) => (t10 || (t10 = e10()), t10.then((e11) => {
          r2.value = e11;
        }).catch(() => {
        }), t10.then(n2, i2)) };
        return r2;
      }
      class e2 {
        onClose(e10) {
          if (this.isClosed) throw Object.defineProperty(Error("Cannot subscribe to a closed CloseController"), "__NEXT_ERROR_CODE", { value: "E365", enumerable: false, configurable: true });
          this.target.addEventListener("close", e10), this.listeners++;
        }
        dispatchClose() {
          if (this.isClosed) throw Object.defineProperty(Error("Cannot close a CloseController multiple times"), "__NEXT_ERROR_CODE", { value: "E229", enumerable: false, configurable: true });
          this.listeners > 0 && this.target.dispatchEvent(new Event("close")), this.isClosed = true;
        }
        constructor() {
          this.target = new EventTarget(), this.listeners = 0, this.isClosed = false;
        }
      }
      function e4() {
        return { previewModeId: process.env.__NEXT_PREVIEW_MODE_ID || "", previewModeSigningKey: process.env.__NEXT_PREVIEW_MODE_SIGNING_KEY || "", previewModeEncryptionKey: process.env.__NEXT_PREVIEW_MODE_ENCRYPTION_KEY || "" };
      }
      let e3 = Symbol.for("@next/request-context");
      async function e6(e10, t10, r2) {
        let n2 = [], i2 = r2 && r2.size > 0;
        for (let t11 of ((e11) => {
          let t12 = ["/layout"];
          if (e11.startsWith("/")) {
            let r3 = e11.split("/");
            for (let e12 = 1; e12 < r3.length + 1; e12++) {
              let n3 = r3.slice(0, e12).join("/");
              n3 && (n3.endsWith("/page") || n3.endsWith("/route") || (n3 = `${n3}${!n3.endsWith("/") ? "/" : ""}layout`), t12.push(n3));
            }
          }
          return t12;
        })(e10)) t11 = `${h}${t11}`, n2.push(t11);
        if (t10.pathname && !i2) {
          let e11 = `${h}${t10.pathname}`;
          n2.push(e11);
        }
        return { tags: n2, expirationsByCacheKind: function(e11) {
          let t11 = /* @__PURE__ */ new Map(), r3 = eJ();
          if (r3) for (let [n3, i3] of r3) "getExpiration" in i3 && t11.set(n3, e1(async () => i3.getExpiration(...e11)));
          return t11;
        }(n2) };
      }
      class e5 extends $ {
        constructor(e10) {
          super(e10.input, e10.init), this.sourcePage = e10.page;
        }
        get request() {
          throw Object.defineProperty(new c({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
        respondWith() {
          throw Object.defineProperty(new c({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
        waitUntil() {
          throw Object.defineProperty(new c({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
      }
      let e9 = { keys: (e10) => Array.from(e10.keys()), get: (e10, t10) => e10.get(t10) ?? void 0 }, e8 = (e10, t10) => eD().withPropagatedContext(e10.headers, t10, e9), e7 = false;
      async function te(t10) {
        var r2;
        let n2, i2;
        if (!e7 && (e7 = true, "true" === process.env.NEXT_PRIVATE_TEST_PROXY)) {
          let { interceptTestApis: t11, wrapRequestHandler: r3 } = e.r(494165);
          t11(), e8 = r3(e8);
        }
        await l();
        let a2 = void 0 !== globalThis.__BUILD_MANIFEST;
        t10.request.url = t10.request.url.replace(/\.rsc($|\?)/, "$1");
        let s2 = t10.bypassNextUrl ? new URL(t10.request.url) : new I(t10.request.url, { headers: t10.request.headers, nextConfig: t10.request.nextConfig });
        for (let e10 of [...s2.searchParams.keys()]) {
          let t11 = s2.searchParams.getAll(e10), r3 = function(e11) {
            for (let t12 of ["nxtP", "nxtI"]) if (e11 !== t12 && e11.startsWith(t12)) return e11.substring(t12.length);
            return null;
          }(e10);
          if (r3) {
            for (let e11 of (s2.searchParams.delete(r3), t11)) s2.searchParams.append(r3, e11);
            s2.searchParams.delete(e10);
          }
        }
        let o2 = process.env.__NEXT_BUILD_ID || "";
        "buildId" in s2 && (o2 = s2.buildId || "", s2.buildId = "");
        let u2 = function(e10) {
          let t11 = new Headers();
          for (let [r3, n3] of Object.entries(e10)) for (let e11 of Array.isArray(n3) ? n3 : [n3]) void 0 !== e11 && ("number" == typeof e11 && (e11 = e11.toString()), t11.append(r3, e11));
          return t11;
        }(t10.request.headers), c2 = u2.has("x-nextjs-data"), d2 = "1" === u2.get("rsc");
        c2 && "/index" === s2.pathname && (s2.pathname = "/");
        let p2 = /* @__PURE__ */ new Map();
        if (!a2) for (let e10 of H) {
          let t11 = u2.get(e10);
          null !== t11 && (p2.set(e10, t11), u2.delete(e10));
        }
        let h2 = s2.searchParams.get(K), f2 = new e5({ page: t10.page, input: function(e10) {
          let t11 = "string" == typeof e10, r3 = t11 ? new URL(e10) : e10;
          return r3.searchParams.delete(K), t11 ? r3.toString() : r3;
        }(s2).toString(), init: { body: t10.request.body, headers: u2, method: t10.request.method, nextConfig: t10.request.nextConfig, signal: t10.request.signal } });
        c2 && Object.defineProperty(f2, "__isData", { enumerable: false, value: true }), !globalThis.__incrementalCacheShared && t10.IncrementalCache && (globalThis.__incrementalCache = new t10.IncrementalCache({ CurCacheHandler: t10.incrementalCacheHandler, minimalMode: true, fetchCacheKeyPrefix: "", dev: false, requestHeaders: t10.request.headers, getPrerenderManifest: () => ({ version: -1, routes: {}, dynamicRoutes: {}, notFoundRoutes: [], preview: e4() }) }));
        let g2 = t10.request.waitUntil ?? (null == (r2 = function() {
          let e10 = globalThis[e3];
          return null == e10 ? void 0 : e10.get();
        }()) ? void 0 : r2.waitUntil), m2 = new E({ request: f2, page: t10.page, context: g2 ? { waitUntil: g2 } : void 0 });
        if ((n2 = await e8(f2, () => {
          if ("/middleware" === t10.page || "/src/middleware" === t10.page) {
            let e10 = m2.waitUntil.bind(m2), r3 = new e2();
            return eD().trace(ey.execute, { spanName: `middleware ${f2.method} ${f2.nextUrl.pathname}`, attributes: { "http.target": f2.nextUrl.pathname, "http.method": f2.method } }, async () => {
              try {
                var n3, a3, s3, l2, u3, c3;
                let d3 = e4(), p3 = await e6("/", f2.nextUrl, null), h3 = (u3 = f2.nextUrl, c3 = (e11) => {
                  i2 = e11;
                }, function(e11, t11, r4, n4, i3, a4, s4, o3, l3, u4, c4, d4) {
                  function p4(e12) {
                    r4 && r4.setHeader("Set-Cookie", e12);
                  }
                  let h4 = {};
                  return { type: "request", phase: e11, implicitTags: a4, url: { pathname: n4.pathname, search: n4.search ?? "" }, rootParams: i3, get headers() {
                    return h4.headers || (h4.headers = function(e12) {
                      let t12 = G.from(e12);
                      for (let e13 of H) t12.delete(e13);
                      return G.seal(t12);
                    }(t11.headers)), h4.headers;
                  }, get cookies() {
                    if (!h4.cookies) {
                      let e12 = new M.RequestCookies(G.from(t11.headers));
                      e$(t11, e12), h4.cookies = et.seal(e12);
                    }
                    return h4.cookies;
                  }, set cookies(value) {
                    h4.cookies = value;
                  }, get mutableCookies() {
                    if (!h4.mutableCookies) {
                      let e12 = function(e13, t12) {
                        let r5 = new M.RequestCookies(G.from(e13));
                        return en.wrap(r5, t12);
                      }(t11.headers, s4 || (r4 ? p4 : void 0));
                      e$(t11, e12), h4.mutableCookies = e12;
                    }
                    return h4.mutableCookies;
                  }, get userspaceMutableCookies() {
                    return h4.userspaceMutableCookies || (h4.userspaceMutableCookies = function(e12) {
                      let t12 = new Proxy(e12.mutableCookies, { get(r5, n5, i4) {
                        switch (n5) {
                          case "delete":
                            return function(...n6) {
                              return ea(e12, "cookies().delete"), r5.delete(...n6), t12;
                            };
                          case "set":
                            return function(...n6) {
                              return ea(e12, "cookies().set"), r5.set(...n6), t12;
                            };
                          default:
                            return L.get(r5, n5, i4);
                        }
                      } });
                      return t12;
                    }(this)), h4.userspaceMutableCookies;
                  }, get draftMode() {
                    return h4.draftMode || (h4.draftMode = new ej(l3, t11, this.cookies, this.mutableCookies)), h4.draftMode;
                  }, renderResumeDataCache: o3 ?? null, isHmrRefresh: u4, serverComponentsHmrCache: c4 || globalThis.__serverComponentsHmrCache, devFallbackParams: null };
                }("action", f2, void 0, u3, {}, p3, c3, void 0, d3, false, void 0, null)), g3 = function({ page: e11, renderOpts: t11, isPrefetchRequest: r4, buildId: n4, previouslyRevalidatedTags: i3 }) {
                  var a4;
                  let s4 = !t11.shouldWaitOnAllReady && !t11.supportsDynamicResponse && !t11.isDraftMode && !t11.isPossibleServerAction, o3 = t11.dev ?? false, l3 = o3 || s4 && (!!process.env.NEXT_DEBUG_BUILD || "1" === process.env.NEXT_SSG_FETCH_METRICS), u4 = { isStaticGeneration: s4, page: e11, route: (a4 = e11.split("/").reduce((e12, t12, r5, n5) => t12 ? "(" === t12[0] && t12.endsWith(")") || "@" === t12[0] || ("page" === t12 || "route" === t12) && r5 === n5.length - 1 ? e12 : e12 + "/" + t12 : e12, "")).startsWith("/") ? a4 : "/" + a4, incrementalCache: t11.incrementalCache || globalThis.__incrementalCache, cacheLifeProfiles: t11.cacheLifeProfiles, isRevalidate: t11.isRevalidate, isBuildTimePrerendering: t11.nextExport, hasReadableErrorStacks: t11.hasReadableErrorStacks, fetchCache: t11.fetchCache, isOnDemandRevalidate: t11.isOnDemandRevalidate, isDraftMode: t11.isDraftMode, isPrefetchRequest: r4, buildId: n4, reactLoadableManifest: (null == t11 ? void 0 : t11.reactLoadableManifest) || {}, assetPrefix: (null == t11 ? void 0 : t11.assetPrefix) || "", afterContext: function(e12) {
                    let { waitUntil: t12, onClose: r5, onAfterTaskError: n5 } = e12;
                    return new eZ({ waitUntil: t12, onClose: r5, onTaskError: n5 });
                  }(t11), cacheComponentsEnabled: t11.experimental.cacheComponents, dev: o3, previouslyRevalidatedTags: i3, refreshTagsByCacheKind: function() {
                    let e12 = /* @__PURE__ */ new Map(), t12 = eJ();
                    if (t12) for (let [r5, n5] of t12) "refreshTags" in n5 && e12.set(r5, e1(async () => n5.refreshTags()));
                    return e12;
                  }(), runInCleanSnapshot: X ? X.snapshot() : function(e12, ...t12) {
                    return e12(...t12);
                  }, shouldTrackFetchMetrics: l3 };
                  return t11.store = u4, u4;
                }({ page: "/", renderOpts: { cacheLifeProfiles: null == (a3 = t10.request.nextConfig) || null == (n3 = a3.experimental) ? void 0 : n3.cacheLife, experimental: { isRoutePPREnabled: false, cacheComponents: false, authInterrupts: !!(null == (l2 = t10.request.nextConfig) || null == (s3 = l2.experimental) ? void 0 : s3.authInterrupts) }, supportsDynamicResponse: true, waitUntil: e10, onClose: r3.onClose.bind(r3), onAfterTaskError: void 0 }, isPrefetchRequest: "1" === f2.headers.get(W), buildId: o2 ?? "", previouslyRevalidatedTags: [] });
                return await Z.run(g3, () => eL.run(h3, t10.handler, f2, m2));
              } finally {
                setTimeout(() => {
                  r3.dispatchClose();
                }, 0);
              }
            });
          }
          return t10.handler(f2, m2);
        })) && !(n2 instanceof Response)) throw Object.defineProperty(TypeError("Expected an instance of Response to be returned"), "__NEXT_ERROR_CODE", { value: "E567", enumerable: false, configurable: true });
        n2 && i2 && n2.headers.set("set-cookie", i2);
        let y2 = null == n2 ? void 0 : n2.headers.get("x-middleware-rewrite");
        if (n2 && y2 && (d2 || !a2)) {
          let e10 = new I(y2, { forceLocale: true, headers: t10.request.headers, nextConfig: t10.request.nextConfig });
          a2 || e10.host !== f2.nextUrl.host || (e10.buildId = o2 || e10.buildId, n2.headers.set("x-middleware-rewrite", String(e10)));
          let { url: r3, isRelative: i3 } = B(e10.toString(), s2.toString());
          !a2 && c2 && n2.headers.set("x-nextjs-rewrite", r3), d2 && i3 && (s2.pathname !== e10.pathname && n2.headers.set("x-nextjs-rewritten-path", e10.pathname), s2.search !== e10.search && n2.headers.set("x-nextjs-rewritten-query", e10.search.slice(1)));
        }
        if (n2 && y2 && d2 && h2) {
          let e10 = new URL(y2);
          e10.searchParams.has(K) || (e10.searchParams.set(K, h2), n2.headers.set("x-middleware-rewrite", e10.toString()));
        }
        let b2 = null == n2 ? void 0 : n2.headers.get("Location");
        if (n2 && b2 && !a2) {
          let e10 = new I(b2, { forceLocale: false, headers: t10.request.headers, nextConfig: t10.request.nextConfig });
          n2 = new Response(n2.body, n2), e10.host === s2.host && (e10.buildId = o2 || e10.buildId, n2.headers.set("Location", e10.toString())), c2 && (n2.headers.delete("Location"), n2.headers.set("x-nextjs-redirect", B(e10.toString(), s2.toString()).url));
        }
        let w2 = n2 || F.next(), _2 = w2.headers.get("x-middleware-override-headers"), S2 = [];
        if (_2) {
          for (let [e10, t11] of p2) w2.headers.set(`x-middleware-request-${e10}`, t11), S2.push(e10);
          S2.length > 0 && w2.headers.set("x-middleware-override-headers", _2 + "," + S2.join(","));
        }
        return { response: w2, waitUntil: ("internal" === m2[v].kind ? Promise.all(m2[v].promises).then(() => {
        }) : void 0) ?? Promise.resolve(), fetchMetrics: f2.fetchMetrics };
      }
      e.s(["config", () => rl, "middleware", () => ro], 196592), e.s([], 985835), e.i(164445), "undefined" == typeof URLPattern || URLPattern;
      var tt = e.i(40049);
      class tr extends Error {
        constructor(e10) {
          super("Dynamic server usage: " + e10), this.description = e10, this.digest = "DYNAMIC_SERVER_USAGE";
        }
      }
      class tn extends Error {
        constructor(...e10) {
          super(...e10), this.code = "NEXT_STATIC_GEN_BAILOUT";
        }
      }
      class ti extends Error {
        constructor(e10, t10) {
          super(`During prerendering, ${t10} rejects when the prerender is complete. Typically these errors are handled by React but if you move ${t10} to a different context by using \`setTimeout\`, \`after\`, or similar functions you may observe this error and you should handle it in that context. This occurred at route "${e10}".`), this.route = e10, this.expression = t10, this.digest = "HANGING_PROMISE_REJECTION";
        }
      }
      let ta = /* @__PURE__ */ new WeakMap();
      function ts() {
      }
      let to = "function" == typeof tt.default.unstable_postpone;
      function tl(e10, t10) {
        return `Route ${e10} needs to bail out of prerendering at this point because it used ${t10}. React throws this special object to indicate where. It should not be caught by your own try/catch. Learn more: https://nextjs.org/docs/messages/ppr-caught-error`;
      }
      if (false === function(e10) {
        return e10.includes("needs to bail out of prerendering at this point because it used") && e10.includes("Learn more: https://nextjs.org/docs/messages/ppr-caught-error");
      }(tl("%%%", "^^^"))) throw Object.defineProperty(Error("Invariant: isDynamicPostpone misidentified a postpone reason. This is a bug in Next.js"), "__NEXT_ERROR_CODE", { value: "E296", enumerable: false, configurable: true });
      RegExp(`\\n\\s+at Suspense \\(<anonymous>\\)(?:(?!\\n\\s+at (?:body|div|main|section|article|aside|header|footer|nav|form|p|span|h1|h2|h3|h4|h5|h6) \\(<anonymous>\\))[\\s\\S])*?\\n\\s+at __next_root_layout_boundary__ \\([^\\n]*\\)`), RegExp(`\\n\\s+at __next_metadata_boundary__[\\n\\s]`), RegExp(`\\n\\s+at __next_viewport_boundary__[\\n\\s]`), RegExp(`\\n\\s+at __next_outlet_boundary__[\\n\\s]`), Y();
      let { env: tu, stdout: tc } = (null == (D = globalThis) ? void 0 : D.process) ?? {}, td = tu && !tu.NO_COLOR && (tu.FORCE_COLOR || (null == tc ? void 0 : tc.isTTY) && !tu.CI && "dumb" !== tu.TERM), tp = (e10, t10, r2, n2) => {
        let i2 = e10.substring(0, n2) + r2, a2 = e10.substring(n2 + t10.length), s2 = a2.indexOf(t10);
        return ~s2 ? i2 + tp(a2, t10, r2, s2) : i2 + a2;
      }, th = (e10, t10, r2 = e10) => td ? (n2) => {
        let i2 = "" + n2, a2 = i2.indexOf(t10, e10.length);
        return ~a2 ? e10 + tp(i2, t10, r2, a2) + t10 : e10 + i2 + t10;
      } : String, tf = th("\x1B[1m", "\x1B[22m", "\x1B[22m\x1B[1m");
      th("\x1B[2m", "\x1B[22m", "\x1B[22m\x1B[2m"), th("\x1B[3m", "\x1B[23m"), th("\x1B[4m", "\x1B[24m"), th("\x1B[7m", "\x1B[27m"), th("\x1B[8m", "\x1B[28m"), th("\x1B[9m", "\x1B[29m"), th("\x1B[30m", "\x1B[39m");
      let tg = th("\x1B[31m", "\x1B[39m"), tm = th("\x1B[32m", "\x1B[39m"), ty = th("\x1B[33m", "\x1B[39m");
      th("\x1B[34m", "\x1B[39m");
      let tb = th("\x1B[35m", "\x1B[39m");
      th("\x1B[38;2;173;127;168m", "\x1B[39m"), th("\x1B[36m", "\x1B[39m");
      let tw = th("\x1B[37m", "\x1B[39m");
      th("\x1B[90m", "\x1B[39m"), th("\x1B[40m", "\x1B[49m"), th("\x1B[41m", "\x1B[49m"), th("\x1B[42m", "\x1B[49m"), th("\x1B[43m", "\x1B[49m"), th("\x1B[44m", "\x1B[49m"), th("\x1B[45m", "\x1B[49m"), th("\x1B[46m", "\x1B[49m"), th("\x1B[47m", "\x1B[49m"), tw(tf("\u25CB")), tg(tf("\u2A2F")), ty(tf("\u26A0")), tw(tf(" ")), tm(tf("\u2713")), tb(tf("\xBB")), new eB(1e4, (e10) => e10.length), /* @__PURE__ */ new WeakMap(), e.i(985835);
      let tv = { current: null }, t_ = "function" == typeof tt.cache ? tt.cache : (e10) => e10, tE = console.warn;
      function tS(e10) {
        return function(...t10) {
          tE(e10(...t10));
        };
      }
      function tP() {
        let e10 = "cookies", t10 = Z.getStore(), r2 = eL.getStore();
        if (t10) {
          if (r2 && "after" === r2.phase && !function() {
            let e11 = eY.getStore();
            return (null == e11 ? void 0 : e11.rootTaskSpawnPhase) === "action";
          }()) throw Object.defineProperty(Error(`Route ${t10.route} used "cookies" inside "after(...)". This is not supported. If you need this data inside an "after" callback, use "cookies" outside of the callback. See more info here: https://nextjs.org/docs/canary/app/api-reference/functions/after`), "__NEXT_ERROR_CODE", { value: "E88", enumerable: false, configurable: true });
          if (t10.forceStatic) return tA(et.seal(new M.RequestCookies(new Headers({}))));
          if (t10.dynamicShouldError) throw Object.defineProperty(new tn(`Route ${t10.route} with \`dynamic = "error"\` couldn't be rendered statically because it used \`cookies\`. See more info here: https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic#dynamic-rendering`), "__NEXT_ERROR_CODE", { value: "E549", enumerable: false, configurable: true });
          if (r2) switch (r2.type) {
            case "cache":
              let l2 = Object.defineProperty(Error(`Route ${t10.route} used "cookies" inside "use cache". Accessing Dynamic data sources inside a cache scope is not supported. If you need this data inside a cached function use "cookies" outside of the cached function and pass the required dynamic data in as an argument. See more info here: https://nextjs.org/docs/messages/next-request-in-use-cache`), "__NEXT_ERROR_CODE", { value: "E398", enumerable: false, configurable: true });
              throw Error.captureStackTrace(l2, tP), t10.invalidDynamicUsageError ??= l2, l2;
            case "unstable-cache":
              throw Object.defineProperty(Error(`Route ${t10.route} used "cookies" inside a function cached with "unstable_cache(...)". Accessing Dynamic data sources inside a cache scope is not supported. If you need this data inside a cached function use "cookies" outside of the cached function and pass the required dynamic data in as an argument. See more info here: https://nextjs.org/docs/app/api-reference/functions/unstable_cache`), "__NEXT_ERROR_CODE", { value: "E157", enumerable: false, configurable: true });
            case "prerender":
              var n2, i2, a2, s2 = t10, o2 = r2;
              let u2 = tx.get(o2);
              if (u2) return u2;
              let c2 = function(e11, t11, r3) {
                if (e11.aborted) return Promise.reject(new ti(t11, r3));
                {
                  let n3 = new Promise((n4, i3) => {
                    let a3 = i3.bind(null, new ti(t11, r3)), s3 = ta.get(e11);
                    if (s3) s3.push(a3);
                    else {
                      let t12 = [a3];
                      ta.set(e11, t12), e11.addEventListener("abort", () => {
                        for (let e12 = 0; e12 < t12.length; e12++) t12[e12]();
                      }, { once: true });
                    }
                  });
                  return n3.catch(ts), n3;
                }
              }(o2.renderSignal, s2.route, "`cookies()`");
              return tx.set(o2, c2), c2;
            case "prerender-client":
              let d2 = "`cookies`";
              throw Object.defineProperty(new eq(`${d2} must not be used within a client component. Next.js should be preventing ${d2} from being included in client components statically, but did not in this case.`), "__NEXT_ERROR_CODE", { value: "E693", enumerable: false, configurable: true });
            case "prerender-ppr":
              return n2 = t10.route, i2 = r2.dynamicTracking, void (function() {
                if (!to) throw Object.defineProperty(Error("Invariant: React.unstable_postpone is not defined. This suggests the wrong version of React was loaded. This is a bug in Next.js"), "__NEXT_ERROR_CODE", { value: "E224", enumerable: false, configurable: true });
              }(), i2 && i2.dynamicAccesses.push({ stack: i2.isDebugDynamicAccesses ? Error().stack : void 0, expression: e10 }), tt.default.unstable_postpone(tl(n2, e10)));
            case "prerender-legacy":
              let p2 = Object.defineProperty(new tr(`Route ${t10.route} couldn't be rendered statically because it used \`${e10}\`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error`), "__NEXT_ERROR_CODE", { value: "E558", enumerable: false, configurable: true });
              throw r2.revalidate = 0, t10.dynamicUsageDescription = e10, t10.dynamicUsageStack = p2.stack, p2;
            case "prerender-runtime":
              return a2 = function(e11) {
                let t11 = tx.get(e11);
                if (t11) return t11;
                let r3 = Promise.resolve(e11);
                return tx.set(e11, r3), r3;
              }(r2.cookies), r2.runtimeStagePromise ? r2.runtimeStagePromise.then(() => a2) : a2;
            case "private-cache":
              return tA(r2.cookies);
            case "request":
              return !function(e11) {
                switch (e11.type) {
                  case "cache":
                  case "unstable-cache":
                  case "private-cache":
                    return;
                }
              }(r2), tA(ei(r2) ? r2.userspaceMutableCookies : r2.cookies);
          }
        }
        throw Object.defineProperty(Error(`\`${e10}\` was called outside a request scope. Read more: https://nextjs.org/docs/messages/next-dynamic-api-wrong-context`), "__NEXT_ERROR_CODE", { value: "E251", enumerable: false, configurable: true });
      }
      t_((e10) => {
        try {
          tE(tv.current);
        } finally {
          tv.current = null;
        }
      });
      let tx = /* @__PURE__ */ new WeakMap();
      function tA(e10) {
        let t10 = tx.get(e10);
        if (t10) return t10;
        let r2 = Promise.resolve(e10);
        return tx.set(e10, r2), Object.defineProperties(r2, { [Symbol.iterator]: { value: e10[Symbol.iterator] ? e10[Symbol.iterator].bind(e10) : tT.bind(e10) }, size: { get: () => e10.size }, get: { value: e10.get.bind(e10) }, getAll: { value: e10.getAll.bind(e10) }, has: { value: e10.has.bind(e10) }, set: { value: e10.set.bind(e10) }, delete: { value: e10.delete.bind(e10) }, clear: { value: "function" == typeof e10.clear ? e10.clear.bind(e10) : tO.bind(e10, r2) }, toString: { value: e10.toString.bind(e10) } }), r2;
      }
      function tT() {
        return this.getAll().map((e10) => [e10.name, e10]).values();
      }
      function tO(e10) {
        for (let e11 of this.getAll()) this.delete(e11.name);
        return e10;
      }
      tS(function(e10, t10) {
        let r2 = e10 ? `Route "${e10}" ` : "This route ";
        return Object.defineProperty(Error(`${r2}used ${t10}. \`cookies()\` should be awaited before using its value. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis`), "__NEXT_ERROR_CODE", { value: "E223", enumerable: false, configurable: true });
      }), /* @__PURE__ */ new WeakMap(), tS(function(e10, t10) {
        let r2 = e10 ? `Route "${e10}" ` : "This route ";
        return Object.defineProperty(Error(`${r2}used ${t10}. \`headers()\` should be awaited before using its value. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis`), "__NEXT_ERROR_CODE", { value: "E277", enumerable: false, configurable: true });
      }), /* @__PURE__ */ new WeakMap(), tS(function(e10, t10) {
        let r2 = e10 ? `Route "${e10}" ` : "This route ";
        return Object.defineProperty(Error(`${r2}used ${t10}. \`draftMode()\` should be awaited before using its value. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis`), "__NEXT_ERROR_CODE", { value: "E377", enumerable: false, configurable: true });
      });
      var tR = e.i(303466);
      let tC = globalThis.prismaGlobal ?? new tR.PrismaClient(), tk = new TextEncoder(), tN = new TextDecoder();
      function tI(e10) {
        if (Uint8Array.fromBase64) return Uint8Array.fromBase64("string" == typeof e10 ? e10 : tN.decode(e10), { alphabet: "base64url" });
        let t10 = e10;
        t10 instanceof Uint8Array && (t10 = tN.decode(t10)), t10 = t10.replace(/-/g, "+").replace(/_/g, "/").replace(/\s/g, "");
        try {
          var r2 = t10;
          if (Uint8Array.fromBase64) return Uint8Array.fromBase64(r2);
          let e11 = atob(r2), n2 = new Uint8Array(e11.length);
          for (let t11 = 0; t11 < e11.length; t11++) n2[t11] = e11.charCodeAt(t11);
          return n2;
        } catch {
          throw TypeError("The input to be decoded is not correctly encoded.");
        }
      }
      class tD extends Error {
        static code = "ERR_JOSE_GENERIC";
        code = "ERR_JOSE_GENERIC";
        constructor(e10, t10) {
          super(e10, t10), this.name = this.constructor.name, Error.captureStackTrace?.(this, this.constructor);
        }
      }
      class tM extends tD {
        static code = "ERR_JWT_CLAIM_VALIDATION_FAILED";
        code = "ERR_JWT_CLAIM_VALIDATION_FAILED";
        claim;
        reason;
        payload;
        constructor(e10, t10, r2 = "unspecified", n2 = "unspecified") {
          super(e10, { cause: { claim: r2, reason: n2, payload: t10 } }), this.claim = r2, this.reason = n2, this.payload = t10;
        }
      }
      class tj extends tD {
        static code = "ERR_JWT_EXPIRED";
        code = "ERR_JWT_EXPIRED";
        claim;
        reason;
        payload;
        constructor(e10, t10, r2 = "unspecified", n2 = "unspecified") {
          super(e10, { cause: { claim: r2, reason: n2, payload: t10 } }), this.claim = r2, this.reason = n2, this.payload = t10;
        }
      }
      class t$ extends tD {
        static code = "ERR_JOSE_ALG_NOT_ALLOWED";
        code = "ERR_JOSE_ALG_NOT_ALLOWED";
      }
      class tL extends tD {
        static code = "ERR_JOSE_NOT_SUPPORTED";
        code = "ERR_JOSE_NOT_SUPPORTED";
      }
      class tq extends tD {
        static code = "ERR_JWS_INVALID";
        code = "ERR_JWS_INVALID";
      }
      class tU extends tD {
        static code = "ERR_JWT_INVALID";
        code = "ERR_JWT_INVALID";
      }
      class tV extends tD {
        [Symbol.asyncIterator];
        static code = "ERR_JWKS_MULTIPLE_MATCHING_KEYS";
        code = "ERR_JWKS_MULTIPLE_MATCHING_KEYS";
        constructor(e10 = "multiple matching keys found in the JSON Web Key Set", t10) {
          super(e10, t10);
        }
      }
      class tF extends tD {
        static code = "ERR_JWS_SIGNATURE_VERIFICATION_FAILED";
        code = "ERR_JWS_SIGNATURE_VERIFICATION_FAILED";
        constructor(e10 = "signature verification failed", t10) {
          super(e10, t10);
        }
      }
      function tB(e10, t10 = "algorithm.name") {
        return TypeError(`CryptoKey does not support this operation, its ${t10} must be ${e10}`);
      }
      function tW(e10, t10) {
        return e10.name === t10;
      }
      function tH(e10) {
        return parseInt(e10.name.slice(4), 10);
      }
      function tK(e10, t10, ...r2) {
        if ((r2 = r2.filter(Boolean)).length > 2) {
          let t11 = r2.pop();
          e10 += `one of type ${r2.join(", ")}, or ${t11}.`;
        } else 2 === r2.length ? e10 += `one of type ${r2[0]} or ${r2[1]}.` : e10 += `of type ${r2[0]}.`;
        return null == t10 ? e10 += ` Received ${t10}` : "function" == typeof t10 && t10.name ? e10 += ` Received function ${t10.name}` : "object" == typeof t10 && null != t10 && t10.constructor?.name && (e10 += ` Received an instance of ${t10.constructor.name}`), e10;
      }
      function tJ(e10, t10, ...r2) {
        return tK(`Key for the ${e10} algorithm must be `, t10, ...r2);
      }
      let tG = async (e10, t10, r2) => {
        if (t10 instanceof Uint8Array) {
          if (!e10.startsWith("HS")) throw TypeError(((e11, ...t11) => tK("Key must be ", e11, ...t11))(t10, "CryptoKey", "KeyObject", "JSON Web Key"));
          return crypto.subtle.importKey("raw", t10, { hash: `SHA-${e10.slice(-3)}`, name: "HMAC" }, false, [r2]);
        }
        return !function(e11, t11, r3) {
          switch (t11) {
            case "HS256":
            case "HS384":
            case "HS512": {
              if (!tW(e11.algorithm, "HMAC")) throw tB("HMAC");
              let r4 = parseInt(t11.slice(2), 10);
              if (tH(e11.algorithm.hash) !== r4) throw tB(`SHA-${r4}`, "algorithm.hash");
              break;
            }
            case "RS256":
            case "RS384":
            case "RS512": {
              if (!tW(e11.algorithm, "RSASSA-PKCS1-v1_5")) throw tB("RSASSA-PKCS1-v1_5");
              let r4 = parseInt(t11.slice(2), 10);
              if (tH(e11.algorithm.hash) !== r4) throw tB(`SHA-${r4}`, "algorithm.hash");
              break;
            }
            case "PS256":
            case "PS384":
            case "PS512": {
              if (!tW(e11.algorithm, "RSA-PSS")) throw tB("RSA-PSS");
              let r4 = parseInt(t11.slice(2), 10);
              if (tH(e11.algorithm.hash) !== r4) throw tB(`SHA-${r4}`, "algorithm.hash");
              break;
            }
            case "Ed25519":
            case "EdDSA":
              if (!tW(e11.algorithm, "Ed25519")) throw tB("Ed25519");
              break;
            case "ML-DSA-44":
            case "ML-DSA-65":
            case "ML-DSA-87":
              if (!tW(e11.algorithm, t11)) throw tB(t11);
              break;
            case "ES256":
            case "ES384":
            case "ES512": {
              if (!tW(e11.algorithm, "ECDSA")) throw tB("ECDSA");
              let r4 = function(e12) {
                switch (e12) {
                  case "ES256":
                    return "P-256";
                  case "ES384":
                    return "P-384";
                  case "ES512":
                    return "P-521";
                  default:
                    throw Error("unreachable");
                }
              }(t11);
              if (e11.algorithm.namedCurve !== r4) throw tB(r4, "algorithm.namedCurve");
              break;
            }
            default:
              throw TypeError("CryptoKey does not support this operation");
          }
          if (r3 && !e11.usages.includes(r3)) throw TypeError(`CryptoKey does not support this operation, its usages must include ${r3}.`);
        }(t10, e10, r2), t10;
      };
      function tz(e10) {
        return e10?.[Symbol.toStringTag] === "CryptoKey";
      }
      function tQ(e10) {
        return e10?.[Symbol.toStringTag] === "KeyObject";
      }
      let tX = (e10) => tz(e10) || tQ(e10), tY = (e10) => {
        if (!/* @__PURE__ */ function(e11) {
          return "object" == typeof e11 && null !== e11;
        }(e10) || "[object Object]" !== Object.prototype.toString.call(e10)) return false;
        if (null === Object.getPrototypeOf(e10)) return true;
        let t10 = e10;
        for (; null !== Object.getPrototypeOf(t10); ) t10 = Object.getPrototypeOf(t10);
        return Object.getPrototypeOf(e10) === t10;
      };
      function tZ(e10) {
        return tY(e10) && "string" == typeof e10.kty;
      }
      let t0 = (e10) => e10?.[Symbol.toStringTag], t1 = (e10, t10, r2) => {
        if (void 0 !== t10.use) {
          let e11;
          switch (r2) {
            case "sign":
            case "verify":
              e11 = "sig";
              break;
            case "encrypt":
            case "decrypt":
              e11 = "enc";
          }
          if (t10.use !== e11) throw TypeError(`Invalid key for this operation, its "use" must be "${e11}" when present`);
        }
        if (void 0 !== t10.alg && t10.alg !== e10) throw TypeError(`Invalid key for this operation, its "alg" must be "${e10}" when present`);
        if (Array.isArray(t10.key_ops)) {
          let n2;
          switch (true) {
            case ("sign" === r2 || "verify" === r2):
            case "dir" === e10:
            case e10.includes("CBC-HS"):
              n2 = r2;
              break;
            case e10.startsWith("PBES2"):
              n2 = "deriveBits";
              break;
            case /^A\d{3}(?:GCM)?(?:KW)?$/.test(e10):
              n2 = !e10.includes("GCM") && e10.endsWith("KW") ? "encrypt" === r2 ? "wrapKey" : "unwrapKey" : r2;
              break;
            case ("encrypt" === r2 && e10.startsWith("RSA")):
              n2 = "wrapKey";
              break;
            case "decrypt" === r2:
              n2 = e10.startsWith("RSA") ? "unwrapKey" : "deriveBits";
          }
          if (n2 && t10.key_ops?.includes?.(n2) === false) throw TypeError(`Invalid key for this operation, its "key_ops" must include "${n2}" when present`);
        }
        return true;
      }, t2 = async (e10) => {
        if (!e10.alg) throw TypeError('"alg" argument is required when "jwk.alg" is not present');
        let { algorithm: t10, keyUsages: r2 } = function(e11) {
          let t11, r3;
          switch (e11.kty) {
            case "AKP":
              switch (e11.alg) {
                case "ML-DSA-44":
                case "ML-DSA-65":
                case "ML-DSA-87":
                  t11 = { name: e11.alg }, r3 = e11.priv ? ["sign"] : ["verify"];
                  break;
                default:
                  throw new tL('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
              }
              break;
            case "RSA":
              switch (e11.alg) {
                case "PS256":
                case "PS384":
                case "PS512":
                  t11 = { name: "RSA-PSS", hash: `SHA-${e11.alg.slice(-3)}` }, r3 = e11.d ? ["sign"] : ["verify"];
                  break;
                case "RS256":
                case "RS384":
                case "RS512":
                  t11 = { name: "RSASSA-PKCS1-v1_5", hash: `SHA-${e11.alg.slice(-3)}` }, r3 = e11.d ? ["sign"] : ["verify"];
                  break;
                case "RSA-OAEP":
                case "RSA-OAEP-256":
                case "RSA-OAEP-384":
                case "RSA-OAEP-512":
                  t11 = { name: "RSA-OAEP", hash: `SHA-${parseInt(e11.alg.slice(-3), 10) || 1}` }, r3 = e11.d ? ["decrypt", "unwrapKey"] : ["encrypt", "wrapKey"];
                  break;
                default:
                  throw new tL('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
              }
              break;
            case "EC":
              switch (e11.alg) {
                case "ES256":
                  t11 = { name: "ECDSA", namedCurve: "P-256" }, r3 = e11.d ? ["sign"] : ["verify"];
                  break;
                case "ES384":
                  t11 = { name: "ECDSA", namedCurve: "P-384" }, r3 = e11.d ? ["sign"] : ["verify"];
                  break;
                case "ES512":
                  t11 = { name: "ECDSA", namedCurve: "P-521" }, r3 = e11.d ? ["sign"] : ["verify"];
                  break;
                case "ECDH-ES":
                case "ECDH-ES+A128KW":
                case "ECDH-ES+A192KW":
                case "ECDH-ES+A256KW":
                  t11 = { name: "ECDH", namedCurve: e11.crv }, r3 = e11.d ? ["deriveBits"] : [];
                  break;
                default:
                  throw new tL('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
              }
              break;
            case "OKP":
              switch (e11.alg) {
                case "Ed25519":
                case "EdDSA":
                  t11 = { name: "Ed25519" }, r3 = e11.d ? ["sign"] : ["verify"];
                  break;
                case "ECDH-ES":
                case "ECDH-ES+A128KW":
                case "ECDH-ES+A192KW":
                case "ECDH-ES+A256KW":
                  t11 = { name: e11.crv }, r3 = e11.d ? ["deriveBits"] : [];
                  break;
                default:
                  throw new tL('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
              }
              break;
            default:
              throw new tL('Invalid or unsupported JWK "kty" (Key Type) Parameter value');
          }
          return { algorithm: t11, keyUsages: r3 };
        }(e10), n2 = { ...e10 };
        return "AKP" !== n2.kty && delete n2.alg, delete n2.use, crypto.subtle.importKey("jwk", n2, t10, e10.ext ?? (!e10.d && !e10.priv), e10.key_ops ?? r2);
      }, t4 = async (e10, t10, n2, i2 = false) => {
        let a2 = (r ||= /* @__PURE__ */ new WeakMap()).get(e10);
        if (a2?.[n2]) return a2[n2];
        let s2 = await t2({ ...t10, alg: n2 });
        return i2 && Object.freeze(e10), a2 ? a2[n2] = s2 : r.set(e10, { [n2]: s2 }), s2;
      }, t3 = async (e10, t10) => {
        if (e10 instanceof Uint8Array || tz(e10)) return e10;
        if (tQ(e10)) {
          if ("secret" === e10.type) return e10.export();
          if ("toCryptoKey" in e10 && "function" == typeof e10.toCryptoKey) try {
            return ((e11, t11) => {
              let n3, i2 = (r ||= /* @__PURE__ */ new WeakMap()).get(e11);
              if (i2?.[t11]) return i2[t11];
              let a2 = "public" === e11.type, s2 = !!a2;
              if ("x25519" === e11.asymmetricKeyType) {
                switch (t11) {
                  case "ECDH-ES":
                  case "ECDH-ES+A128KW":
                  case "ECDH-ES+A192KW":
                  case "ECDH-ES+A256KW":
                    break;
                  default:
                    throw TypeError("given KeyObject instance cannot be used for this algorithm");
                }
                n3 = e11.toCryptoKey(e11.asymmetricKeyType, s2, a2 ? [] : ["deriveBits"]);
              }
              if ("ed25519" === e11.asymmetricKeyType) {
                if ("EdDSA" !== t11 && "Ed25519" !== t11) throw TypeError("given KeyObject instance cannot be used for this algorithm");
                n3 = e11.toCryptoKey(e11.asymmetricKeyType, s2, [a2 ? "verify" : "sign"]);
              }
              switch (e11.asymmetricKeyType) {
                case "ml-dsa-44":
                case "ml-dsa-65":
                case "ml-dsa-87":
                  if (t11 !== e11.asymmetricKeyType.toUpperCase()) throw TypeError("given KeyObject instance cannot be used for this algorithm");
                  n3 = e11.toCryptoKey(e11.asymmetricKeyType, s2, [a2 ? "verify" : "sign"]);
              }
              if ("rsa" === e11.asymmetricKeyType) {
                let r2;
                switch (t11) {
                  case "RSA-OAEP":
                    r2 = "SHA-1";
                    break;
                  case "RS256":
                  case "PS256":
                  case "RSA-OAEP-256":
                    r2 = "SHA-256";
                    break;
                  case "RS384":
                  case "PS384":
                  case "RSA-OAEP-384":
                    r2 = "SHA-384";
                    break;
                  case "RS512":
                  case "PS512":
                  case "RSA-OAEP-512":
                    r2 = "SHA-512";
                    break;
                  default:
                    throw TypeError("given KeyObject instance cannot be used for this algorithm");
                }
                if (t11.startsWith("RSA-OAEP")) return e11.toCryptoKey({ name: "RSA-OAEP", hash: r2 }, s2, a2 ? ["encrypt"] : ["decrypt"]);
                n3 = e11.toCryptoKey({ name: t11.startsWith("PS") ? "RSA-PSS" : "RSASSA-PKCS1-v1_5", hash: r2 }, s2, [a2 ? "verify" : "sign"]);
              }
              if ("ec" === e11.asymmetricKeyType) {
                let r2 = (/* @__PURE__ */ new Map([["prime256v1", "P-256"], ["secp384r1", "P-384"], ["secp521r1", "P-521"]])).get(e11.asymmetricKeyDetails?.namedCurve);
                if (!r2) throw TypeError("given KeyObject instance cannot be used for this algorithm");
                "ES256" === t11 && "P-256" === r2 && (n3 = e11.toCryptoKey({ name: "ECDSA", namedCurve: r2 }, s2, [a2 ? "verify" : "sign"])), "ES384" === t11 && "P-384" === r2 && (n3 = e11.toCryptoKey({ name: "ECDSA", namedCurve: r2 }, s2, [a2 ? "verify" : "sign"])), "ES512" === t11 && "P-521" === r2 && (n3 = e11.toCryptoKey({ name: "ECDSA", namedCurve: r2 }, s2, [a2 ? "verify" : "sign"])), t11.startsWith("ECDH-ES") && (n3 = e11.toCryptoKey({ name: "ECDH", namedCurve: r2 }, s2, a2 ? [] : ["deriveBits"]));
              }
              if (!n3) throw TypeError("given KeyObject instance cannot be used for this algorithm");
              return i2 ? i2[t11] = n3 : r.set(e11, { [t11]: n3 }), n3;
            })(e10, t10);
          } catch (e11) {
            if (e11 instanceof TypeError) throw e11;
          }
          let n2 = e10.export({ format: "jwk" });
          return t4(e10, n2, t10);
        }
        if (tZ(e10)) return e10.k ? tI(e10.k) : t4(e10, e10, t10, true);
        throw Error("unreachable");
      }, t6 = /^(\+|\-)? ?(\d+|\d+\.\d+) ?(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)(?: (ago|from now))?$/i, t5 = (e10) => {
        let t10, r2 = t6.exec(e10);
        if (!r2 || r2[4] && r2[1]) throw TypeError("Invalid time period format");
        let n2 = parseFloat(r2[2]);
        switch (r2[3].toLowerCase()) {
          case "sec":
          case "secs":
          case "second":
          case "seconds":
          case "s":
            t10 = Math.round(n2);
            break;
          case "minute":
          case "minutes":
          case "min":
          case "mins":
          case "m":
            t10 = Math.round(60 * n2);
            break;
          case "hour":
          case "hours":
          case "hr":
          case "hrs":
          case "h":
            t10 = Math.round(3600 * n2);
            break;
          case "day":
          case "days":
          case "d":
            t10 = Math.round(86400 * n2);
            break;
          case "week":
          case "weeks":
          case "w":
            t10 = Math.round(604800 * n2);
            break;
          default:
            t10 = Math.round(31557600 * n2);
        }
        return "-" === r2[1] || "ago" === r2[4] ? -t10 : t10;
      }, t9 = (e10) => e10.includes("/") ? e10.toLowerCase() : `application/${e10.toLowerCase()}`, t8 = async (e10, t10, r2, n2) => {
        let i2 = await tG(e10, t10, "verify");
        ((e11, t11) => {
          if (e11.startsWith("RS") || e11.startsWith("PS")) {
            let { modulusLength: r3 } = t11.algorithm;
            if ("number" != typeof r3 || r3 < 2048) throw TypeError(`${e11} requires key modulusLength to be 2048 bits or larger`);
          }
        })(e10, i2);
        let a2 = ((e11, t11) => {
          let r3 = `SHA-${e11.slice(-3)}`;
          switch (e11) {
            case "HS256":
            case "HS384":
            case "HS512":
              return { hash: r3, name: "HMAC" };
            case "PS256":
            case "PS384":
            case "PS512":
              return { hash: r3, name: "RSA-PSS", saltLength: parseInt(e11.slice(-3), 10) >> 3 };
            case "RS256":
            case "RS384":
            case "RS512":
              return { hash: r3, name: "RSASSA-PKCS1-v1_5" };
            case "ES256":
            case "ES384":
            case "ES512":
              return { hash: r3, name: "ECDSA", namedCurve: t11.namedCurve };
            case "Ed25519":
            case "EdDSA":
              return { name: "Ed25519" };
            case "ML-DSA-44":
            case "ML-DSA-65":
            case "ML-DSA-87":
              return { name: e11 };
            default:
              throw new tL(`alg ${e11} is not supported either by JOSE or your javascript runtime`);
          }
        })(e10, i2.algorithm);
        try {
          return await crypto.subtle.verify(a2, i2, r2, n2);
        } catch {
          return false;
        }
      };
      async function t7(e10, t10, r2) {
        var n2;
        let i2, a2;
        if (!tY(e10)) throw new tq("Flattened JWS must be an object");
        if (void 0 === e10.protected && void 0 === e10.header) throw new tq('Flattened JWS must have either of the "protected" or "header" members');
        if (void 0 !== e10.protected && "string" != typeof e10.protected) throw new tq("JWS Protected Header incorrect type");
        if (void 0 === e10.payload) throw new tq("JWS Payload missing");
        if ("string" != typeof e10.signature) throw new tq("JWS Signature missing or incorrect type");
        if (void 0 !== e10.header && !tY(e10.header)) throw new tq("JWS Unprotected Header incorrect type");
        let s2 = {};
        if (e10.protected) try {
          let t11 = tI(e10.protected);
          s2 = JSON.parse(tN.decode(t11));
        } catch {
          throw new tq("JWS Protected Header is invalid");
        }
        if (!((...e11) => {
          let t11, r3 = e11.filter(Boolean);
          if (0 === r3.length || 1 === r3.length) return true;
          for (let e12 of r3) {
            let r4 = Object.keys(e12);
            if (!t11 || 0 === t11.size) {
              t11 = new Set(r4);
              continue;
            }
            for (let e13 of r4) {
              if (t11.has(e13)) return false;
              t11.add(e13);
            }
          }
          return true;
        })(s2, e10.header)) throw new tq("JWS Protected and JWS Unprotected Header Parameter names must be disjoint");
        let o2 = { ...s2, ...e10.header }, l2 = ((e11, t11, r3, n3, i3) => {
          let a3;
          if (void 0 !== i3.crit && n3?.crit === void 0) throw new e11('"crit" (Critical) Header Parameter MUST be integrity protected');
          if (!n3 || void 0 === n3.crit) return /* @__PURE__ */ new Set();
          if (!Array.isArray(n3.crit) || 0 === n3.crit.length || n3.crit.some((e12) => "string" != typeof e12 || 0 === e12.length)) throw new e11('"crit" (Critical) Header Parameter MUST be an array of non-empty strings when present');
          for (let s3 of (a3 = void 0 !== r3 ? new Map([...Object.entries(r3), ...t11.entries()]) : t11, n3.crit)) {
            if (!a3.has(s3)) throw new tL(`Extension Header Parameter "${s3}" is not recognized`);
            if (void 0 === i3[s3]) throw new e11(`Extension Header Parameter "${s3}" is missing`);
            if (a3.get(s3) && void 0 === n3[s3]) throw new e11(`Extension Header Parameter "${s3}" MUST be integrity protected`);
          }
          return new Set(n3.crit);
        })(tq, /* @__PURE__ */ new Map([["b64", true]]), r2?.crit, s2, o2), u2 = true;
        if (l2.has("b64") && "boolean" != typeof (u2 = s2.b64)) throw new tq('The "b64" (base64url-encode payload) Header Parameter must be a boolean');
        let { alg: c2 } = o2;
        if ("string" != typeof c2 || !c2) throw new tq('JWS "alg" (Algorithm) Header Parameter missing or invalid');
        let d2 = r2 && ((e11, t11) => {
          if (void 0 !== t11 && (!Array.isArray(t11) || t11.some((e12) => "string" != typeof e12))) throw TypeError(`"${e11}" option must be an array of strings`);
          if (t11) return new Set(t11);
        })("algorithms", r2.algorithms);
        if (d2 && !d2.has(c2)) throw new t$('"alg" (Algorithm) Header Parameter value not allowed');
        if (u2) {
          if ("string" != typeof e10.payload) throw new tq("JWS Payload must be a string");
        } else if ("string" != typeof e10.payload && !(e10.payload instanceof Uint8Array)) throw new tq("JWS Payload must be a string or an Uint8Array instance");
        let p2 = false;
        "function" == typeof t10 && (t10 = await t10(s2, e10), p2 = true), n2 = t10, c2.startsWith("HS") || "dir" === c2 || c2.startsWith("PBES2") || /^A(?:128|192|256)(?:GCM)?(?:KW)?$/.test(c2) || /^A(?:128|192|256)CBC-HS(?:256|384|512)$/.test(c2) ? ((e11, t11, r3) => {
          if (!(t11 instanceof Uint8Array)) {
            if (tZ(t11)) {
              var n3;
              if ("oct" === (n3 = t11).kty && "string" == typeof n3.k && t1(e11, t11, r3)) return;
              throw TypeError('JSON Web Key for symmetric algorithms must have JWK "kty" (Key Type) equal to "oct" and the JWK "k" (Key Value) present');
            }
            if (!tX(t11)) throw TypeError(tJ(e11, t11, "CryptoKey", "KeyObject", "JSON Web Key", "Uint8Array"));
            if ("secret" !== t11.type) throw TypeError(`${t0(t11)} instances for symmetric algorithms must be of type "secret"`);
          }
        })(c2, n2, "verify") : ((e11, t11, r3) => {
          var n3, i3;
          if (tZ(t11)) switch (r3) {
            case "decrypt":
            case "sign":
              if ("oct" !== (n3 = t11).kty && ("AKP" === n3.kty && "string" == typeof n3.priv || "string" == typeof n3.d) && t1(e11, t11, r3)) return;
              throw TypeError("JSON Web Key for this operation be a private JWK");
            case "encrypt":
            case "verify":
              if ("oct" !== (i3 = t11).kty && void 0 === i3.d && void 0 === i3.priv && t1(e11, t11, r3)) return;
              throw TypeError("JSON Web Key for this operation be a public JWK");
          }
          if (!tX(t11)) throw TypeError(tJ(e11, t11, "CryptoKey", "KeyObject", "JSON Web Key"));
          if ("secret" === t11.type) throw TypeError(`${t0(t11)} instances for asymmetric algorithms must not be of type "secret"`);
          if ("public" === t11.type) switch (r3) {
            case "sign":
              throw TypeError(`${t0(t11)} instances for asymmetric algorithm signing must be of type "private"`);
            case "decrypt":
              throw TypeError(`${t0(t11)} instances for asymmetric algorithm decryption must be of type "private"`);
          }
          if ("private" === t11.type) switch (r3) {
            case "verify":
              throw TypeError(`${t0(t11)} instances for asymmetric algorithm verifying must be of type "public"`);
            case "encrypt":
              throw TypeError(`${t0(t11)} instances for asymmetric algorithm encryption must be of type "public"`);
          }
        })(c2, n2, "verify");
        let h2 = function(...e11) {
          let t11 = new Uint8Array(e11.reduce((e12, { length: t12 }) => e12 + t12, 0)), r3 = 0;
          for (let n3 of e11) t11.set(n3, r3), r3 += n3.length;
          return t11;
        }(tk.encode(e10.protected ?? ""), tk.encode("."), "string" == typeof e10.payload ? tk.encode(e10.payload) : e10.payload);
        try {
          i2 = tI(e10.signature);
        } catch {
          throw new tq("Failed to base64url decode the signature");
        }
        let f2 = await t3(t10, c2);
        if (!await t8(c2, f2, i2, h2)) throw new tF();
        if (u2) try {
          a2 = tI(e10.payload);
        } catch {
          throw new tq("Failed to base64url decode the payload");
        }
        else a2 = "string" == typeof e10.payload ? tk.encode(e10.payload) : e10.payload;
        let g2 = { payload: a2 };
        return (void 0 !== e10.protected && (g2.protectedHeader = s2), void 0 !== e10.header && (g2.unprotectedHeader = e10.header), p2) ? { ...g2, key: f2 } : g2;
      }
      async function re(e10, t10, r2) {
        if (e10 instanceof Uint8Array && (e10 = tN.decode(e10)), "string" != typeof e10) throw new tq("Compact JWS must be a string or Uint8Array");
        let { 0: n2, 1: i2, 2: a2, length: s2 } = e10.split(".");
        if (3 !== s2) throw new tq("Invalid Compact JWS");
        let o2 = await t7({ payload: i2, protected: n2, signature: a2 }, t10, r2), l2 = { payload: o2.payload, protectedHeader: o2.protectedHeader };
        return "function" == typeof t10 ? { ...l2, key: o2.key } : l2;
      }
      async function rt(e10, t10, r2) {
        let n2 = await re(e10, t10, r2);
        if (n2.protectedHeader.crit?.includes("b64") && false === n2.protectedHeader.b64) throw new tU("JWTs MUST NOT use unencoded payload");
        let i2 = { payload: function(e11, t11, r3 = {}) {
          var n3, i3;
          let a2, s2;
          try {
            a2 = JSON.parse(tN.decode(t11));
          } catch {
          }
          if (!tY(a2)) throw new tU("JWT Claims Set must be a top-level JSON object");
          let { typ: o2 } = r3;
          if (o2 && ("string" != typeof e11.typ || t9(e11.typ) !== t9(o2))) throw new tM('unexpected "typ" JWT header value', a2, "typ", "check_failed");
          let { requiredClaims: l2 = [], issuer: u2, subject: c2, audience: d2, maxTokenAge: p2 } = r3, h2 = [...l2];
          for (let e12 of (void 0 !== p2 && h2.push("iat"), void 0 !== d2 && h2.push("aud"), void 0 !== c2 && h2.push("sub"), void 0 !== u2 && h2.push("iss"), new Set(h2.reverse()))) if (!(e12 in a2)) throw new tM(`missing required "${e12}" claim`, a2, e12, "missing");
          if (u2 && !(Array.isArray(u2) ? u2 : [u2]).includes(a2.iss)) throw new tM('unexpected "iss" claim value', a2, "iss", "check_failed");
          if (c2 && a2.sub !== c2) throw new tM('unexpected "sub" claim value', a2, "sub", "check_failed");
          if (d2 && (n3 = a2.aud, i3 = "string" == typeof d2 ? [d2] : d2, "string" == typeof n3 ? !i3.includes(n3) : !(Array.isArray(n3) && i3.some(Set.prototype.has.bind(new Set(n3)))))) throw new tM('unexpected "aud" claim value', a2, "aud", "check_failed");
          switch (typeof r3.clockTolerance) {
            case "string":
              s2 = t5(r3.clockTolerance);
              break;
            case "number":
              s2 = r3.clockTolerance;
              break;
            case "undefined":
              s2 = 0;
              break;
            default:
              throw TypeError("Invalid clockTolerance option type");
          }
          let { currentDate: f2 } = r3, g2 = Math.floor((f2 || /* @__PURE__ */ new Date()).getTime() / 1e3);
          if ((void 0 !== a2.iat || p2) && "number" != typeof a2.iat) throw new tM('"iat" claim must be a number', a2, "iat", "invalid");
          if (void 0 !== a2.nbf) {
            if ("number" != typeof a2.nbf) throw new tM('"nbf" claim must be a number', a2, "nbf", "invalid");
            if (a2.nbf > g2 + s2) throw new tM('"nbf" claim timestamp check failed', a2, "nbf", "check_failed");
          }
          if (void 0 !== a2.exp) {
            if ("number" != typeof a2.exp) throw new tM('"exp" claim must be a number', a2, "exp", "invalid");
            if (a2.exp <= g2 - s2) throw new tj('"exp" claim timestamp check failed', a2, "exp", "check_failed");
          }
          if (p2) {
            let e12 = g2 - a2.iat;
            if (e12 - s2 > ("number" == typeof p2 ? p2 : t5(p2))) throw new tj('"iat" claim timestamp check failed (too far in the past)', a2, "iat", "check_failed");
            if (e12 < 0 - s2) throw new tM('"iat" claim timestamp check failed (it should be in the past)', a2, "iat", "check_failed");
          }
          return a2;
        }(n2.protectedHeader, n2.payload, r2), protectedHeader: n2.protectedHeader };
        return "function" == typeof t10 ? { ...i2, key: n2.key } : i2;
      }
      let rr = process.env.JWT_HASH_KEY, rn = new TextEncoder().encode(rr), ri = process.env.ADMIN_NAMES.split(","), ra = async ({ jwtEncoded: e10 }) => {
        try {
          if (!e10 || "string" != typeof e10) throw Error("Internal Server Error.");
          let t10 = e10.split(".");
          if (3 !== t10.length) throw Error("Internal Server Error.");
          let { payload: r2 } = await rt(e10, rn);
          if (!r2 || "object" != typeof r2) throw Error("Invalid JWT payload structure.");
          if (!r2.id || !r2.name || !r2.userType) throw Error("Missing required JWT claims.");
          return { result: true, messag: "success", data: r2 };
        } catch (e11) {
          return { result: false, messag: e11 instanceof Error ? `decoded err.${e11.message}` : "Internal Server Error.", data: "" };
        }
      }, rs = async ({ jwtEncodedStr: e10, readOnly: t10 }) => {
        try {
          let r2;
          if (e10 && false === t10) throw Error("Authentication flag mismatch.");
          try {
            r2 = e10 || (await tP()).get("accessToken")?.value || "";
          } catch (e11) {
            throw console.error(e11), Error("Authentication error.");
          }
          if (!r2) throw Error("Authentication error.");
          let n2 = await ra({ jwtEncoded: r2 });
          if (!n2.result) {
            if (!t10 && r2 && !e10) try {
              (await tP()).delete("accessToken");
            } catch (e11) {
              console.warn("Failed to delete access token cookie:", e11);
            }
            throw Error("Authentication error." + n2.messag);
          }
          let i2 = n2.data;
          if ("object" != typeof i2 || null === i2) {
            if (!t10 && r2 && !e10) try {
              (await tP()).delete("accessToken");
            } catch (e11) {
              console.warn("Failed to delete access token cookie:", e11);
            }
            throw Error("Authentication error.");
          }
          let a2 = "number" == typeof i2.id ? i2.id : null, s2 = "string" == typeof i2.name ? i2.name : null, o2 = "string" == typeof i2.userType ? i2.userType : null, l2 = "number" == typeof i2.amount ? i2.amount : null;
          if (!a2 || !s2 || !o2 || "admin" !== o2 && "advertiser" !== o2 || null === l2) {
            if (!t10 && r2 && !e10) try {
              (await tP()).delete("accessToken");
            } catch (e11) {
              console.warn("Failed to delete access token cookie:", e11);
            }
            throw Error("Authentication error.");
          }
          if ("admin" === o2 && !ri.includes(s2)) throw Error("Authentication error.");
          if (!t10 && !e10 && !await tC.user.findUnique({ where: { id: a2, name: s2, userType: o2, isActive: true } })) {
            if (!t10 && r2 && !e10) try {
              (await tP()).delete("accessToken");
            } catch (e11) {
              console.warn("Failed to delete access token cookie:", e11);
            }
            throw Error("Authentication error.");
          }
          return { result: true, data: { id: a2, name: s2, userType: o2, amount: l2 }, message: "success" };
        } catch (e11) {
          return { result: false, data: null, message: e11 instanceof Error ? e11.message : "Internal Server Error." };
        }
      }, ro = async (e10) => {
        let t10 = F.next(), r2 = e10.nextUrl.pathname, n2 = r2.split("/")[1], i2 = Number(r2.split("/")[2]), a2 = e10.cookies.get("accessToken")?.value, s2 = false, o2 = null;
        if (a2) {
          let e11 = await rs({ jwtEncodedStr: a2, readOnly: true });
          s2 = e11.result, o2 = e11.data;
        }
        if (!s2 || i2 != o2?.id || n2 != o2.userType) {
          let t11 = e10.nextUrl.clone();
          t11.pathname = `/auth/${n2}`;
          let r3 = F.redirect(t11);
          return e10.cookies.has("accessToken") && r3.cookies.delete("accessToken"), r3;
        }
        return t10;
      }, rl = { matcher: ["/advertiser/:path*", "/admin/:path*"] };
      var ru = e.i(196592);
      Object.values({ NOT_FOUND: 404, FORBIDDEN: 403, UNAUTHORIZED: 401 });
      let rc = { ...ru }, rd = rc.middleware || rc.default, rp = "/middleware";
      if ("function" != typeof rd) throw Object.defineProperty(Error(`The Middleware "${rp}" must export a \`middleware\` or a \`default\` function`), "__NEXT_ERROR_CODE", { value: "E120", enumerable: false, configurable: true });
      function rh(e10) {
        return te({ ...e10, page: rp, handler: async (...e11) => {
          try {
            return await rd(...e11);
          } catch (i2) {
            let t10 = e11[0], r2 = new URL(t10.url), n2 = r2.pathname + r2.search;
            throw await s(i2, { path: n2, method: t10.method, headers: Object.fromEntries(t10.headers.entries()) }, { routerKind: "Pages Router", routePath: "/middleware", routeType: "middleware", revalidateReason: void 0 }), i2;
          }
        } });
      }
    }]);
  }
});

// .next/server/edge/chunks/turbopack-edge-wrapper_1b27dae0.js
var require_turbopack_edge_wrapper_1b27dae0 = __commonJS({
  ".next/server/edge/chunks/turbopack-edge-wrapper_1b27dae0.js"() {
    "use strict";
    (globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/turbopack-edge-wrapper_1b27dae0.js", { otherChunks: ["chunks/[root-of-the-server]__09ade3a5._.js", "chunks/[root-of-the-server]__73965b5f._.js"], runtimeModuleIds: [888912] }]), (() => {
      let e;
      if (!Array.isArray(globalThis.TURBOPACK)) return;
      let t = /* @__PURE__ */ new WeakMap();
      function r(e2, t2) {
        this.m = e2, this.e = t2;
      }
      let n = r.prototype, o = Object.prototype.hasOwnProperty, u = "undefined" != typeof Symbol && Symbol.toStringTag;
      function i(e2, t2, r2) {
        o.call(e2, t2) || Object.defineProperty(e2, t2, r2);
      }
      function l(e2, t2) {
        let r2 = e2[t2];
        return r2 || (r2 = a(t2), e2[t2] = r2), r2;
      }
      function a(e2) {
        return { exports: {}, error: void 0, id: e2, namespaceObject: void 0 };
      }
      function s(e2, t2) {
        i(e2, "__esModule", { value: true }), u && i(e2, u, { value: "Module" });
        let r2 = 0;
        for (; r2 < t2.length; ) {
          let n2 = t2[r2++], o2 = t2[r2++];
          "function" == typeof t2[r2] ? i(e2, n2, { get: o2, set: t2[r2++], enumerable: true }) : i(e2, n2, { get: o2, enumerable: true });
        }
        Object.seal(e2);
      }
      n.s = function(e2, t2) {
        let r2, n2;
        null != t2 ? n2 = (r2 = l(this.c, t2)).exports : (r2 = this.m, n2 = this.e), r2.namespaceObject = n2, s(n2, e2);
      }, n.j = function(e2, r2) {
        var n2, u2;
        let i2, a2, s2;
        null != r2 ? a2 = (i2 = l(this.c, r2)).exports : (i2 = this.m, a2 = this.e);
        let c2 = (n2 = i2, u2 = a2, (s2 = t.get(n2)) || (t.set(n2, s2 = []), n2.exports = n2.namespaceObject = new Proxy(u2, { get(e3, t2) {
          if (o.call(e3, t2) || "default" === t2 || "__esModule" === t2) return Reflect.get(e3, t2);
          for (let e4 of s2) {
            let r3 = Reflect.get(e4, t2);
            if (void 0 !== r3) return r3;
          }
        }, ownKeys(e3) {
          let t2 = Reflect.ownKeys(e3);
          for (let e4 of s2) for (let r3 of Reflect.ownKeys(e4)) "default" === r3 || t2.includes(r3) || t2.push(r3);
          return t2;
        } })), s2);
        "object" == typeof e2 && null !== e2 && c2.push(e2);
      }, n.v = function(e2, t2) {
        (null != t2 ? l(this.c, t2) : this.m).exports = e2;
      }, n.n = function(e2, t2) {
        let r2;
        (r2 = null != t2 ? l(this.c, t2) : this.m).exports = r2.namespaceObject = e2;
      };
      let c = Object.getPrototypeOf ? (e2) => Object.getPrototypeOf(e2) : (e2) => e2.__proto__, f = [null, c({}), c([]), c(c)];
      function d(e2, t2, r2) {
        let n2 = [], o2 = -1;
        for (let t3 = e2; ("object" == typeof t3 || "function" == typeof t3) && !f.includes(t3); t3 = c(t3)) for (let r3 of Object.getOwnPropertyNames(t3)) n2.push(r3, /* @__PURE__ */ function(e3, t4) {
          return () => e3[t4];
        }(e2, r3)), -1 === o2 && "default" === r3 && (o2 = n2.length - 1);
        return r2 && o2 >= 0 || (o2 >= 0 ? n2[o2] = () => e2 : n2.push("default", () => e2)), s(t2, n2), t2;
      }
      function h(e2) {
        return "function" == typeof e2 ? function(...t2) {
          return e2.apply(this, t2);
        } : /* @__PURE__ */ Object.create(null);
      }
      function p(e2) {
        return "string" == typeof e2 ? e2 : e2.path;
      }
      function m() {
        let e2, t2;
        return { promise: new Promise((r2, n2) => {
          t2 = n2, e2 = r2;
        }), resolve: e2, reject: t2 };
      }
      n.i = function(e2) {
        let t2 = x(e2, this.m);
        if (t2.namespaceObject) return t2.namespaceObject;
        let r2 = t2.exports;
        return t2.namespaceObject = d(r2, h(r2), r2 && r2.__esModule);
      }, n.A = function(e2) {
        return this.r(e2)(this.i.bind(this));
      }, n.t = "function" == typeof __require ? __require : function() {
        throw Error("Unexpected use of runtime require");
      }, n.r = function(e2) {
        return x(e2, this.m).exports;
      }, n.f = function(e2) {
        function t2(t3) {
          if (o.call(e2, t3)) return e2[t3].module();
          let r2 = Error(`Cannot find module '${t3}'`);
          throw r2.code = "MODULE_NOT_FOUND", r2;
        }
        return t2.keys = () => Object.keys(e2), t2.resolve = (t3) => {
          if (o.call(e2, t3)) return e2[t3].id();
          let r2 = Error(`Cannot find module '${t3}'`);
          throw r2.code = "MODULE_NOT_FOUND", r2;
        }, t2.import = async (e3) => await t2(e3), t2;
      };
      let b = Symbol("turbopack queues"), y = Symbol("turbopack exports"), O = Symbol("turbopack error");
      function g(e2) {
        e2 && 1 !== e2.status && (e2.status = 1, e2.forEach((e3) => e3.queueCount--), e2.forEach((e3) => e3.queueCount-- ? e3.queueCount++ : e3()));
      }
      n.a = function(e2, t2) {
        let r2 = this.m, n2 = t2 ? Object.assign([], { status: -1 }) : void 0, o2 = /* @__PURE__ */ new Set(), { resolve: u2, reject: i2, promise: l2 } = m(), a2 = Object.assign(l2, { [y]: r2.exports, [b]: (e3) => {
          n2 && e3(n2), o2.forEach(e3), a2.catch(() => {
          });
        } }), s2 = { get: () => a2, set(e3) {
          e3 !== a2 && (a2[y] = e3);
        } };
        Object.defineProperty(r2, "exports", s2), Object.defineProperty(r2, "namespaceObject", s2), e2(function(e3) {
          let t3 = e3.map((e4) => {
            if (null !== e4 && "object" == typeof e4) {
              if (b in e4) return e4;
              if (null != e4 && "object" == typeof e4 && "then" in e4 && "function" == typeof e4.then) {
                let t4 = Object.assign([], { status: 0 }), r4 = { [y]: {}, [b]: (e5) => e5(t4) };
                return e4.then((e5) => {
                  r4[y] = e5, g(t4);
                }, (e5) => {
                  r4[O] = e5, g(t4);
                }), r4;
              }
            }
            return { [y]: e4, [b]: () => {
            } };
          }), r3 = () => t3.map((e4) => {
            if (e4[O]) throw e4[O];
            return e4[y];
          }), { promise: u3, resolve: i3 } = m(), l3 = Object.assign(() => i3(r3), { queueCount: 0 });
          function a3(e4) {
            e4 !== n2 && !o2.has(e4) && (o2.add(e4), e4 && 0 === e4.status && (l3.queueCount++, e4.push(l3)));
          }
          return t3.map((e4) => e4[b](a3)), l3.queueCount ? u3 : r3();
        }, function(e3) {
          e3 ? i2(a2[O] = e3) : u2(a2[y]), g(n2);
        }), n2 && -1 === n2.status && (n2.status = 0);
      };
      let w = function(e2) {
        let t2 = new URL(e2, "x:/"), r2 = {};
        for (let e3 in t2) r2[e3] = t2[e3];
        for (let t3 in r2.href = e2, r2.pathname = e2.replace(/[?#].*/, ""), r2.origin = r2.protocol = "", r2.toString = r2.toJSON = (...t4) => e2, r2) Object.defineProperty(this, t3, { enumerable: true, configurable: true, value: r2[t3] });
      };
      function _(e2, t2) {
        throw Error(`Invariant: ${t2(e2)}`);
      }
      w.prototype = URL.prototype, n.U = w, n.z = function(e2) {
        throw Error("dynamic usage of require is not supported");
      }, n.g = globalThis;
      let j = r.prototype;
      var C = function(e2) {
        return e2[e2.Runtime = 0] = "Runtime", e2[e2.Parent = 1] = "Parent", e2[e2.Update = 2] = "Update", e2;
      }(C || {});
      let k = /* @__PURE__ */ new Map();
      n.M = k;
      let R = /* @__PURE__ */ new Map(), U = /* @__PURE__ */ new Map();
      async function v(e2, t2, r2) {
        let n2;
        if ("string" == typeof r2) return M(e2, t2, $(r2));
        let o2 = r2.included || [], u2 = o2.map((e3) => !!k.has(e3) || R.get(e3));
        if (u2.length > 0 && u2.every((e3) => e3)) return void await Promise.all(u2);
        let i2 = r2.moduleChunks || [], l2 = i2.map((e3) => U.get(e3)).filter((e3) => e3);
        if (l2.length > 0) {
          if (l2.length === i2.length) return void await Promise.all(l2);
          let r3 = /* @__PURE__ */ new Set();
          for (let e3 of i2) U.has(e3) || r3.add(e3);
          for (let n3 of r3) {
            let r4 = M(e2, t2, $(n3));
            U.set(n3, r4), l2.push(r4);
          }
          n2 = Promise.all(l2);
        } else {
          for (let o3 of (n2 = M(e2, t2, $(r2.path)), i2)) U.has(o3) || U.set(o3, n2);
        }
        for (let e3 of o2) R.has(e3) || R.set(e3, n2);
        await n2;
      }
      j.l = function(e2) {
        return v(1, this.m.id, e2);
      };
      let P = Promise.resolve(void 0), T = /* @__PURE__ */ new WeakMap();
      function M(t2, r2, n2) {
        let o2 = e.loadChunkCached(t2, n2), u2 = T.get(o2);
        if (void 0 === u2) {
          let e2 = T.set.bind(T, o2, P);
          u2 = o2.then(e2).catch((e3) => {
            let o3;
            switch (t2) {
              case 0:
                o3 = `as a runtime dependency of chunk ${r2}`;
                break;
              case 1:
                o3 = `from module ${r2}`;
                break;
              case 2:
                o3 = "from an HMR update";
                break;
              default:
                _(t2, (e4) => `Unknown source type: ${e4}`);
            }
            throw Error(`Failed to load chunk ${n2} ${o3}${e3 ? `: ${e3}` : ""}`, e3 ? { cause: e3 } : void 0);
          }), T.set(o2, u2);
        }
        return u2;
      }
      function $(e2) {
        return `${e2.split("/").map((e3) => encodeURIComponent(e3)).join("/")}`;
      }
      j.L = function(e2) {
        return M(1, this.m.id, e2);
      }, j.R = function(e2) {
        let t2 = this.r(e2);
        return t2?.default ?? t2;
      }, j.P = function(e2) {
        return `/ROOT/${e2 ?? ""}`;
      }, j.b = function(e2) {
        let t2 = new Blob([`self.TURBOPACK_WORKER_LOCATION = ${JSON.stringify(location.origin)};
self.TURBOPACK_NEXT_CHUNK_URLS = ${JSON.stringify(e2.reverse().map($), null, 2)};
importScripts(...self.TURBOPACK_NEXT_CHUNK_URLS.map(c => self.TURBOPACK_WORKER_LOCATION + c).reverse());`], { type: "text/javascript" });
        return URL.createObjectURL(t2);
      };
      let A = /\.js(?:\?[^#]*)?(?:#.*)?$/;
      n.w = function(t2, r2, n2) {
        return e.loadWebAssembly(1, this.m.id, t2, r2, n2);
      }, n.u = function(t2, r2) {
        return e.loadWebAssemblyModule(1, this.m.id, t2, r2);
      };
      let E = {};
      n.c = E;
      let x = (e2, t2) => {
        let r2 = E[e2];
        if (r2) {
          if (r2.error) throw r2.error;
          return r2;
        }
        return K(e2, C.Parent, t2.id);
      };
      function K(e2, t2, n2) {
        let o2 = k.get(e2);
        "function" != typeof o2 && function(e3, t3, r2) {
          let n3;
          switch (t3) {
            case 0:
              n3 = `as a runtime entry of chunk ${r2}`;
              break;
            case 1:
              n3 = `because it was required from module ${r2}`;
              break;
            case 2:
              n3 = "because of an HMR update";
              break;
            default:
              _(t3, (e4) => `Unknown source type: ${e4}`);
          }
          throw Error(`Module ${e3} was instantiated ${n3}, but the module factory is not available. It might have been deleted in an HMR update.`);
        }(e2, t2, n2);
        let u2 = a(e2), i2 = u2.exports;
        E[e2] = u2;
        let l2 = new r(u2, i2);
        try {
          o2(l2, u2, i2);
        } catch (e3) {
          throw u2.error = e3, e3;
        }
        return u2.namespaceObject && u2.exports !== u2.namespaceObject && d(u2.exports, u2.namespaceObject), u2;
      }
      function S(t2) {
        let r2, n2 = function(e2) {
          if ("string" == typeof e2) return e2;
          let t3 = decodeURIComponent(("undefined" != typeof TURBOPACK_NEXT_CHUNK_URLS ? TURBOPACK_NEXT_CHUNK_URLS.pop() : e2.getAttribute("src")).replace(/[?#].*$/, ""));
          return t3.startsWith("") ? t3.slice(0) : t3;
        }(t2[0]);
        return 2 === t2.length ? r2 = t2[1] : (r2 = void 0, !function(e2, t3, r3, n3) {
          let o2 = 1;
          for (; o2 < e2.length; ) {
            let t4 = e2[o2], n4 = o2 + 1;
            for (; n4 < e2.length && "function" != typeof e2[n4]; ) n4++;
            if (n4 === e2.length) throw Error("malformed chunk format, expected a factory function");
            if (!r3.has(t4)) {
              let u2 = e2[n4];
              for (Object.defineProperty(u2, "name", { value: "__TURBOPACK__module__evaluation__" }); o2 < n4; o2++) t4 = e2[o2], r3.set(t4, u2);
            }
            o2 = n4 + 1;
          }
        }(t2, 0, k)), e.registerChunk(n2, r2);
      }
      function N(e2, t2, r2 = false) {
        let n2;
        try {
          n2 = t2();
        } catch (t3) {
          throw Error(`Failed to load external module ${e2}: ${t3}`);
        }
        return !r2 || n2.__esModule ? n2 : d(n2, h(n2), true);
      }
      n.y = async function(e2) {
        let t2;
        try {
          t2 = await import(e2);
        } catch (t3) {
          throw Error(`Failed to load external module ${e2}: ${t3}`);
        }
        return t2 && t2.__esModule && t2.default && "default" in t2.default ? d(t2.default, h(t2), true) : t2;
      }, N.resolve = (e2, t2) => __require.resolve(e2, t2), n.x = N, (() => {
        e = { registerChunk(e2, o3) {
          t2.add(e2), function(e3) {
            let t3 = r2.get(e3);
            if (null != t3) {
              for (let r3 of t3) r3.requiredChunks.delete(e3), 0 === r3.requiredChunks.size && n2(r3.runtimeModuleIds, r3.chunkPath);
              r2.delete(e3);
            }
          }(e2), null != o3 && (0 === o3.otherChunks.length ? n2(o3.runtimeModuleIds, e2) : function(e3, o4, u2) {
            let i2 = /* @__PURE__ */ new Set(), l2 = { runtimeModuleIds: u2, chunkPath: e3, requiredChunks: i2 };
            for (let e4 of o4) {
              let n3 = p(e4);
              if (t2.has(n3)) continue;
              i2.add(n3);
              let o5 = r2.get(n3);
              null == o5 && (o5 = /* @__PURE__ */ new Set(), r2.set(n3, o5)), o5.add(l2);
            }
            0 === l2.requiredChunks.size && n2(l2.runtimeModuleIds, l2.chunkPath);
          }(e2, o3.otherChunks.filter((e3) => {
            var t3;
            return t3 = p(e3), A.test(t3);
          }), o3.runtimeModuleIds));
        }, loadChunkCached(e2, t3) {
          throw Error("chunk loading is not supported");
        }, async loadWebAssembly(e2, t3, r3, n3, u2) {
          let i2 = await o2(r3, n3);
          return await WebAssembly.instantiate(i2, u2);
        }, loadWebAssemblyModule: async (e2, t3, r3, n3) => o2(r3, n3) };
        let t2 = /* @__PURE__ */ new Set(), r2 = /* @__PURE__ */ new Map();
        function n2(e2, t3) {
          for (let r3 of e2) !function(e3, t4) {
            let r4 = E[t4];
            if (r4) {
              if (r4.error) throw r4.error;
              return;
            }
            K(t4, C.Runtime, e3);
          }(t3, r3);
        }
        async function o2(e2, t3) {
          let r3;
          try {
            r3 = t3();
          } catch (e3) {
          }
          if (!r3) throw Error(`dynamically loading WebAssembly is not supported in this runtime as global was not injected for chunk '${e2}'`);
          return r3;
        }
      })();
      let q = globalThis.TURBOPACK;
      globalThis.TURBOPACK = { push: S }, q.forEach(S);
    })();
  }
});

// node_modules/@opennextjs/aws/dist/core/edgeFunctionHandler.js
var edgeFunctionHandler_exports = {};
__export(edgeFunctionHandler_exports, {
  default: () => edgeFunctionHandler
});
import __onw_wasm_2f49a330183a3ca1__ from "./wasm/wasm_2f49a330183a3ca1.wasm";
async function edgeFunctionHandler(request) {
  const path3 = new URL(request.url).pathname;
  const routes = globalThis._ROUTES;
  const correspondingRoute = routes.find((route) => route.regex.some((r) => new RegExp(r).test(path3)));
  if (!correspondingRoute) {
    throw new Error(`No route found for ${request.url}`);
  }
  const entry = await self._ENTRIES[`middleware_${correspondingRoute.name}`];
  const result = await entry.default({
    page: correspondingRoute.page,
    request: {
      ...request,
      page: {
        name: correspondingRoute.name
      }
    }
  });
  globalThis.__openNextAls.getStore()?.pendingPromiseRunner.add(result.waitUntil);
  const response = result.response;
  return response;
}
var init_edgeFunctionHandler = __esm({
  "node_modules/@opennextjs/aws/dist/core/edgeFunctionHandler.js"() {
    globalThis._ENTRIES = {};
    globalThis.self = globalThis;
    globalThis._ROUTES = [{ "name": "middleware", "page": "/", "regex": ["^(?:\\/(_next\\/data\\/[^/]{1,}))?\\/advertiser(?:\\/((?:[^\\/#\\?]+?)(?:\\/(?:[^\\/#\\?]+?))*))?(\\\\.json)?[\\/#\\?]?$", "^(?:\\/(_next\\/data\\/[^/]{1,}))?\\/admin(?:\\/((?:[^\\/#\\?]+?)(?:\\/(?:[^\\/#\\?]+?))*))?(\\\\.json)?[\\/#\\?]?$"] }];
    globalThis.wasm_2f49a330183a3ca1 = __onw_wasm_2f49a330183a3ca1__;
    require_root_of_the_server_09ade3a5();
    require_root_of_the_server_73965b5f();
    require_turbopack_edge_wrapper_1b27dae0();
  }
});

// node_modules/@opennextjs/aws/dist/utils/promise.js
init_logger();
var DetachedPromise = class {
  resolve;
  reject;
  promise;
  constructor() {
    let resolve;
    let reject;
    this.promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    this.resolve = resolve;
    this.reject = reject;
  }
};
var DetachedPromiseRunner = class {
  promises = [];
  withResolvers() {
    const detachedPromise = new DetachedPromise();
    this.promises.push(detachedPromise);
    return detachedPromise;
  }
  add(promise) {
    const detachedPromise = new DetachedPromise();
    this.promises.push(detachedPromise);
    promise.then(detachedPromise.resolve, detachedPromise.reject);
  }
  async await() {
    debug(`Awaiting ${this.promises.length} detached promises`);
    const results = await Promise.allSettled(this.promises.map((p) => p.promise));
    const rejectedPromises = results.filter((r) => r.status === "rejected");
    rejectedPromises.forEach((r) => {
      error(r.reason);
    });
  }
};
async function awaitAllDetachedPromise() {
  const store = globalThis.__openNextAls.getStore();
  const promisesToAwait = store?.pendingPromiseRunner.await() ?? Promise.resolve();
  if (store?.waitUntil) {
    store.waitUntil(promisesToAwait);
    return;
  }
  await promisesToAwait;
}
function provideNextAfterProvider() {
  const NEXT_REQUEST_CONTEXT_SYMBOL = Symbol.for("@next/request-context");
  const VERCEL_REQUEST_CONTEXT_SYMBOL = Symbol.for("@vercel/request-context");
  const store = globalThis.__openNextAls.getStore();
  const waitUntil = store?.waitUntil ?? ((promise) => store?.pendingPromiseRunner.add(promise));
  const nextAfterContext = {
    get: () => ({
      waitUntil
    })
  };
  globalThis[NEXT_REQUEST_CONTEXT_SYMBOL] = nextAfterContext;
  if (process.env.EMULATE_VERCEL_REQUEST_CONTEXT) {
    globalThis[VERCEL_REQUEST_CONTEXT_SYMBOL] = nextAfterContext;
  }
}
function runWithOpenNextRequestContext({ isISRRevalidation, waitUntil, requestId = Math.random().toString(36) }, fn) {
  return globalThis.__openNextAls.run({
    requestId,
    pendingPromiseRunner: new DetachedPromiseRunner(),
    isISRRevalidation,
    waitUntil,
    writtenTags: /* @__PURE__ */ new Set()
  }, async () => {
    provideNextAfterProvider();
    let result;
    try {
      result = await fn();
    } finally {
      await awaitAllDetachedPromise();
    }
    return result;
  });
}

// node_modules/@opennextjs/aws/dist/adapters/middleware.js
init_logger();

// node_modules/@opennextjs/aws/dist/core/createGenericHandler.js
init_logger();

// node_modules/@opennextjs/aws/dist/core/resolve.js
async function resolveConverter(converter2) {
  if (typeof converter2 === "function") {
    return converter2();
  }
  const m_1 = await Promise.resolve().then(() => (init_edge(), edge_exports));
  return m_1.default;
}
async function resolveWrapper(wrapper) {
  if (typeof wrapper === "function") {
    return wrapper();
  }
  const m_1 = await Promise.resolve().then(() => (init_cloudflare_edge(), cloudflare_edge_exports));
  return m_1.default;
}
async function resolveOriginResolver(originResolver) {
  if (typeof originResolver === "function") {
    return originResolver();
  }
  const m_1 = await Promise.resolve().then(() => (init_pattern_env(), pattern_env_exports));
  return m_1.default;
}
async function resolveAssetResolver(assetResolver) {
  if (typeof assetResolver === "function") {
    return assetResolver();
  }
  const m_1 = await Promise.resolve().then(() => (init_dummy(), dummy_exports));
  return m_1.default;
}
async function resolveProxyRequest(proxyRequest) {
  if (typeof proxyRequest === "function") {
    return proxyRequest();
  }
  const m_1 = await Promise.resolve().then(() => (init_fetch(), fetch_exports));
  return m_1.default;
}

// node_modules/@opennextjs/aws/dist/core/createGenericHandler.js
async function createGenericHandler(handler3) {
  const config = await import("./open-next.config.mjs").then((m) => m.default);
  globalThis.openNextConfig = config;
  const handlerConfig = config[handler3.type];
  const override = handlerConfig && "override" in handlerConfig ? handlerConfig.override : void 0;
  const converter2 = await resolveConverter(override?.converter);
  const { name, wrapper } = await resolveWrapper(override?.wrapper);
  debug("Using wrapper", name);
  return wrapper(handler3.handler, converter2);
}

// node_modules/@opennextjs/aws/dist/core/routing/util.js
import crypto2 from "node:crypto";
import { parse as parseQs, stringify as stringifyQs } from "node:querystring";
import { Readable as Readable2 } from "node:stream";

// node_modules/@opennextjs/aws/dist/adapters/config/index.js
init_logger();
import path from "node:path";
globalThis.__dirname ??= "";
var NEXT_DIR = path.join(__dirname, ".next");
var OPEN_NEXT_DIR = path.join(__dirname, ".open-next");
debug({ NEXT_DIR, OPEN_NEXT_DIR });
var NextConfig = { "env": {}, "webpack": null, "eslint": { "ignoreDuringBuilds": false }, "typescript": { "ignoreBuildErrors": false, "tsconfigPath": "tsconfig.json" }, "typedRoutes": false, "distDir": ".next", "cleanDistDir": true, "assetPrefix": "", "cacheMaxMemorySize": 52428800, "configOrigin": "next.config.ts", "useFileSystemPublicRoutes": true, "generateEtags": true, "pageExtensions": ["tsx", "ts", "jsx", "js"], "poweredByHeader": true, "compress": true, "images": { "deviceSizes": [640, 750, 828, 1080, 1200, 1920, 2048, 3840], "imageSizes": [16, 32, 48, 64, 96, 128, 256, 384], "path": "/_next/image", "loader": "default", "loaderFile": "", "domains": [], "disableStaticImages": false, "minimumCacheTTL": 60, "formats": ["image/webp"], "dangerouslyAllowSVG": false, "contentSecurityPolicy": "script-src 'none'; frame-src 'none'; sandbox;", "contentDispositionType": "attachment", "remotePatterns": [{ "protocol": "https", "hostname": "pub-7414a177cb1243efaa1f1d269e3df215.r2.dev", "port": "", "pathname": "/**" }], "unoptimized": false }, "devIndicators": { "position": "bottom-left" }, "onDemandEntries": { "maxInactiveAge": 6e4, "pagesBufferLength": 5 }, "amp": { "canonicalBase": "" }, "basePath": "", "sassOptions": {}, "trailingSlash": false, "i18n": null, "productionBrowserSourceMaps": false, "excludeDefaultMomentLocales": true, "serverRuntimeConfig": {}, "publicRuntimeConfig": {}, "reactProductionProfiling": false, "reactStrictMode": false, "reactMaxHeadersLength": 6e3, "httpAgentOptions": { "keepAlive": true }, "logging": {}, "compiler": {}, "expireTime": 31536e3, "staticPageGenerationTimeout": 60, "output": "standalone", "modularizeImports": { "@mui/icons-material": { "transform": "@mui/icons-material/{{member}}" }, "lodash": { "transform": "lodash/{{member}}" } }, "outputFileTracingRoot": "C:\\Users\\lmcr1\\practice\\adAppEnv\\v2", "experimental": { "useSkewCookie": false, "cacheLife": { "default": { "stale": 300, "revalidate": 900, "expire": 4294967294 }, "seconds": { "stale": 30, "revalidate": 1, "expire": 60 }, "minutes": { "stale": 300, "revalidate": 60, "expire": 3600 }, "hours": { "stale": 300, "revalidate": 3600, "expire": 86400 }, "days": { "stale": 300, "revalidate": 86400, "expire": 604800 }, "weeks": { "stale": 300, "revalidate": 604800, "expire": 2592e3 }, "max": { "stale": 300, "revalidate": 2592e3, "expire": 4294967294 } }, "cacheHandlers": {}, "cssChunking": true, "multiZoneDraftMode": false, "appNavFailHandling": false, "prerenderEarlyExit": true, "serverMinification": true, "serverSourceMaps": false, "linkNoTouchStart": false, "caseSensitiveRoutes": false, "clientSegmentCache": false, "clientParamParsing": false, "dynamicOnHover": false, "preloadEntriesOnStart": true, "clientRouterFilter": true, "clientRouterFilterRedirects": false, "fetchCacheKeyPrefix": "", "middlewarePrefetch": "flexible", "optimisticClientCache": true, "manualClientBasePath": false, "cpus": 11, "memoryBasedWorkersCount": false, "imgOptConcurrency": null, "imgOptTimeoutInSeconds": 7, "imgOptMaxInputPixels": 268402689, "imgOptSequentialRead": null, "imgOptSkipMetadata": null, "isrFlushToDisk": true, "workerThreads": false, "optimizeCss": false, "nextScriptWorkers": false, "scrollRestoration": false, "externalDir": false, "disableOptimizedLoading": false, "gzipSize": true, "craCompat": false, "esmExternals": true, "fullySpecified": false, "swcTraceProfiling": false, "forceSwcTransforms": false, "largePageDataBytes": 128e3, "typedEnv": false, "parallelServerCompiles": false, "parallelServerBuildTraces": false, "ppr": false, "authInterrupts": false, "webpackMemoryOptimizations": false, "optimizeServerReact": true, "viewTransition": false, "routerBFCache": false, "removeUncaughtErrorAndRejectionListeners": false, "validateRSCRequestHeaders": false, "staleTimes": { "dynamic": 0, "static": 300 }, "serverComponentsHmrCache": true, "staticGenerationMaxConcurrency": 8, "staticGenerationMinPagesPerWorker": 25, "cacheComponents": false, "inlineCss": false, "useCache": false, "globalNotFound": false, "devtoolSegmentExplorer": true, "browserDebugInfoInTerminal": false, "optimizeRouterScrolling": false, "serverActions": { "bodySizeLimit": "5mb" }, "optimizePackageImports": ["lucide-react", "date-fns", "lodash-es", "ramda", "antd", "react-bootstrap", "ahooks", "@ant-design/icons", "@headlessui/react", "@headlessui-float/react", "@heroicons/react/20/solid", "@heroicons/react/24/solid", "@heroicons/react/24/outline", "@visx/visx", "@tremor/react", "rxjs", "@mui/material", "@mui/icons-material", "recharts", "react-use", "effect", "@effect/schema", "@effect/platform", "@effect/platform-node", "@effect/platform-browser", "@effect/platform-bun", "@effect/sql", "@effect/sql-mssql", "@effect/sql-mysql2", "@effect/sql-pg", "@effect/sql-sqlite-node", "@effect/sql-sqlite-bun", "@effect/sql-sqlite-wasm", "@effect/sql-sqlite-react-native", "@effect/rpc", "@effect/rpc-http", "@effect/typeclass", "@effect/experimental", "@effect/opentelemetry", "@material-ui/core", "@material-ui/icons", "@tabler/icons-react", "mui-core", "react-icons/ai", "react-icons/bi", "react-icons/bs", "react-icons/cg", "react-icons/ci", "react-icons/di", "react-icons/fa", "react-icons/fa6", "react-icons/fc", "react-icons/fi", "react-icons/gi", "react-icons/go", "react-icons/gr", "react-icons/hi", "react-icons/hi2", "react-icons/im", "react-icons/io", "react-icons/io5", "react-icons/lia", "react-icons/lib", "react-icons/lu", "react-icons/md", "react-icons/pi", "react-icons/ri", "react-icons/rx", "react-icons/si", "react-icons/sl", "react-icons/tb", "react-icons/tfi", "react-icons/ti", "react-icons/vsc", "react-icons/wi"], "trustHostHeader": false, "isExperimentalCompile": false }, "htmlLimitedBots": "[\\w-]+-Google|Google-[\\w-]+|Chrome-Lighthouse|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti|googleweblight", "bundlePagesRouterDependencies": false, "configFileName": "next.config.ts", "turbopack": { "root": "C:\\Users\\lmcr1\\practice\\adAppEnv\\v2" } };
var BuildId = "pnJFYmFSdU1P5tKNJWZQF";
var RoutesManifest = { "basePath": "", "rewrites": { "beforeFiles": [], "afterFiles": [], "fallback": [] }, "redirects": [{ "source": "/:path+/", "destination": "/:path+", "internal": true, "statusCode": 308, "regex": "^(?:/((?:[^/]+?)(?:/(?:[^/]+?))*))/$" }], "routes": { "static": [{ "page": "/", "regex": "^/(?:/)?$", "routeKeys": {}, "namedRegex": "^/(?:/)?$" }, { "page": "/_not-found", "regex": "^/_not\\-found(?:/)?$", "routeKeys": {}, "namedRegex": "^/_not\\-found(?:/)?$" }, { "page": "/auth/admin", "regex": "^/auth/admin(?:/)?$", "routeKeys": {}, "namedRegex": "^/auth/admin(?:/)?$" }, { "page": "/auth/advertiser", "regex": "^/auth/advertiser(?:/)?$", "routeKeys": {}, "namedRegex": "^/auth/advertiser(?:/)?$" }, { "page": "/auth/resetPass", "regex": "^/auth/resetPass(?:/)?$", "routeKeys": {}, "namedRegex": "^/auth/resetPass(?:/)?$" }, { "page": "/contact", "regex": "^/contact(?:/)?$", "routeKeys": {}, "namedRegex": "^/contact(?:/)?$" }, { "page": "/legal/privacy", "regex": "^/legal/privacy(?:/)?$", "routeKeys": {}, "namedRegex": "^/legal/privacy(?:/)?$" }, { "page": "/legal/terms", "regex": "^/legal/terms(?:/)?$", "routeKeys": {}, "namedRegex": "^/legal/terms(?:/)?$" }], "dynamic": [{ "page": "/admin/[adminId]", "regex": "^/admin/([^/]+?)(?:/)?$", "routeKeys": { "nxtPadminId": "nxtPadminId" }, "namedRegex": "^/admin/(?<nxtPadminId>[^/]+?)(?:/)?$" }, { "page": "/admin/[adminId]/notification", "regex": "^/admin/([^/]+?)/notification(?:/)?$", "routeKeys": { "nxtPadminId": "nxtPadminId" }, "namedRegex": "^/admin/(?<nxtPadminId>[^/]+?)/notification(?:/)?$" }, { "page": "/admin/[adminId]/notification/create", "regex": "^/admin/([^/]+?)/notification/create(?:/)?$", "routeKeys": { "nxtPadminId": "nxtPadminId" }, "namedRegex": "^/admin/(?<nxtPadminId>[^/]+?)/notification/create(?:/)?$" }, { "page": "/admin/[adminId]/notification/[notificationId]", "regex": "^/admin/([^/]+?)/notification/([^/]+?)(?:/)?$", "routeKeys": { "nxtPadminId": "nxtPadminId", "nxtPnotificationId": "nxtPnotificationId" }, "namedRegex": "^/admin/(?<nxtPadminId>[^/]+?)/notification/(?<nxtPnotificationId>[^/]+?)(?:/)?$" }, { "page": "/admin/[adminId]/payment", "regex": "^/admin/([^/]+?)/payment(?:/)?$", "routeKeys": { "nxtPadminId": "nxtPadminId" }, "namedRegex": "^/admin/(?<nxtPadminId>[^/]+?)/payment(?:/)?$" }, { "page": "/admin/[adminId]/review", "regex": "^/admin/([^/]+?)/review(?:/)?$", "routeKeys": { "nxtPadminId": "nxtPadminId" }, "namedRegex": "^/admin/(?<nxtPadminId>[^/]+?)/review(?:/)?$" }, { "page": "/admin/[adminId]/review/adStats", "regex": "^/admin/([^/]+?)/review/adStats(?:/)?$", "routeKeys": { "nxtPadminId": "nxtPadminId" }, "namedRegex": "^/admin/(?<nxtPadminId>[^/]+?)/review/adStats(?:/)?$" }, { "page": "/admin/[adminId]/review/[adId]", "regex": "^/admin/([^/]+?)/review/([^/]+?)(?:/)?$", "routeKeys": { "nxtPadminId": "nxtPadminId", "nxtPadId": "nxtPadId" }, "namedRegex": "^/admin/(?<nxtPadminId>[^/]+?)/review/(?<nxtPadId>[^/]+?)(?:/)?$" }, { "page": "/admin/[adminId]/support", "regex": "^/admin/([^/]+?)/support(?:/)?$", "routeKeys": { "nxtPadminId": "nxtPadminId" }, "namedRegex": "^/admin/(?<nxtPadminId>[^/]+?)/support(?:/)?$" }, { "page": "/admin/[adminId]/support/[supportId]", "regex": "^/admin/([^/]+?)/support/([^/]+?)(?:/)?$", "routeKeys": { "nxtPadminId": "nxtPadminId", "nxtPsupportId": "nxtPsupportId" }, "namedRegex": "^/admin/(?<nxtPadminId>[^/]+?)/support/(?<nxtPsupportId>[^/]+?)(?:/)?$" }, { "page": "/admin/[adminId]/user", "regex": "^/admin/([^/]+?)/user(?:/)?$", "routeKeys": { "nxtPadminId": "nxtPadminId" }, "namedRegex": "^/admin/(?<nxtPadminId>[^/]+?)/user(?:/)?$" }, { "page": "/admin/[adminId]/user/[userId]", "regex": "^/admin/([^/]+?)/user/([^/]+?)(?:/)?$", "routeKeys": { "nxtPadminId": "nxtPadminId", "nxtPuserId": "nxtPuserId" }, "namedRegex": "^/admin/(?<nxtPadminId>[^/]+?)/user/(?<nxtPuserId>[^/]+?)(?:/)?$" }, { "page": "/advertiser/[advertiserId]", "regex": "^/advertiser/([^/]+?)(?:/)?$", "routeKeys": { "nxtPadvertiserId": "nxtPadvertiserId" }, "namedRegex": "^/advertiser/(?<nxtPadvertiserId>[^/]+?)(?:/)?$" }, { "page": "/advertiser/[advertiserId]/ad", "regex": "^/advertiser/([^/]+?)/ad(?:/)?$", "routeKeys": { "nxtPadvertiserId": "nxtPadvertiserId" }, "namedRegex": "^/advertiser/(?<nxtPadvertiserId>[^/]+?)/ad(?:/)?$" }, { "page": "/advertiser/[advertiserId]/ad/create", "regex": "^/advertiser/([^/]+?)/ad/create(?:/)?$", "routeKeys": { "nxtPadvertiserId": "nxtPadvertiserId" }, "namedRegex": "^/advertiser/(?<nxtPadvertiserId>[^/]+?)/ad/create(?:/)?$" }, { "page": "/advertiser/[advertiserId]/ad/create/form/[adType]", "regex": "^/advertiser/([^/]+?)/ad/create/form/([^/]+?)(?:/)?$", "routeKeys": { "nxtPadvertiserId": "nxtPadvertiserId", "nxtPadType": "nxtPadType" }, "namedRegex": "^/advertiser/(?<nxtPadvertiserId>[^/]+?)/ad/create/form/(?<nxtPadType>[^/]+?)(?:/)?$" }, { "page": "/advertiser/[advertiserId]/ad/stats", "regex": "^/advertiser/([^/]+?)/ad/stats(?:/)?$", "routeKeys": { "nxtPadvertiserId": "nxtPadvertiserId" }, "namedRegex": "^/advertiser/(?<nxtPadvertiserId>[^/]+?)/ad/stats(?:/)?$" }, { "page": "/advertiser/[advertiserId]/ad/[adId]", "regex": "^/advertiser/([^/]+?)/ad/([^/]+?)(?:/)?$", "routeKeys": { "nxtPadvertiserId": "nxtPadvertiserId", "nxtPadId": "nxtPadId" }, "namedRegex": "^/advertiser/(?<nxtPadvertiserId>[^/]+?)/ad/(?<nxtPadId>[^/]+?)(?:/)?$" }, { "page": "/advertiser/[advertiserId]/notification", "regex": "^/advertiser/([^/]+?)/notification(?:/)?$", "routeKeys": { "nxtPadvertiserId": "nxtPadvertiserId" }, "namedRegex": "^/advertiser/(?<nxtPadvertiserId>[^/]+?)/notification(?:/)?$" }, { "page": "/advertiser/[advertiserId]/notification/[notificationId]", "regex": "^/advertiser/([^/]+?)/notification/([^/]+?)(?:/)?$", "routeKeys": { "nxtPadvertiserId": "nxtPadvertiserId", "nxtPnotificationId": "nxtPnotificationId" }, "namedRegex": "^/advertiser/(?<nxtPadvertiserId>[^/]+?)/notification/(?<nxtPnotificationId>[^/]+?)(?:/)?$" }, { "page": "/advertiser/[advertiserId]/point", "regex": "^/advertiser/([^/]+?)/point(?:/)?$", "routeKeys": { "nxtPadvertiserId": "nxtPadvertiserId" }, "namedRegex": "^/advertiser/(?<nxtPadvertiserId>[^/]+?)/point(?:/)?$" }, { "page": "/advertiser/[advertiserId]/point/purchase", "regex": "^/advertiser/([^/]+?)/point/purchase(?:/)?$", "routeKeys": { "nxtPadvertiserId": "nxtPadvertiserId" }, "namedRegex": "^/advertiser/(?<nxtPadvertiserId>[^/]+?)/point/purchase(?:/)?$" }, { "page": "/advertiser/[advertiserId]/point/purchase/credit", "regex": "^/advertiser/([^/]+?)/point/purchase/credit(?:/)?$", "routeKeys": { "nxtPadvertiserId": "nxtPadvertiserId" }, "namedRegex": "^/advertiser/(?<nxtPadvertiserId>[^/]+?)/point/purchase/credit(?:/)?$" }, { "page": "/advertiser/[advertiserId]/point/purchase/crypt", "regex": "^/advertiser/([^/]+?)/point/purchase/crypt(?:/)?$", "routeKeys": { "nxtPadvertiserId": "nxtPadvertiserId" }, "namedRegex": "^/advertiser/(?<nxtPadvertiserId>[^/]+?)/point/purchase/crypt(?:/)?$" }, { "page": "/advertiser/[advertiserId]/point/purchase/success", "regex": "^/advertiser/([^/]+?)/point/purchase/success(?:/)?$", "routeKeys": { "nxtPadvertiserId": "nxtPadvertiserId" }, "namedRegex": "^/advertiser/(?<nxtPadvertiserId>[^/]+?)/point/purchase/success(?:/)?$" }, { "page": "/advertiser/[advertiserId]/point/[pointId]", "regex": "^/advertiser/([^/]+?)/point/([^/]+?)(?:/)?$", "routeKeys": { "nxtPadvertiserId": "nxtPadvertiserId", "nxtPpointId": "nxtPpointId" }, "namedRegex": "^/advertiser/(?<nxtPadvertiserId>[^/]+?)/point/(?<nxtPpointId>[^/]+?)(?:/)?$" }, { "page": "/advertiser/[advertiserId]/profile", "regex": "^/advertiser/([^/]+?)/profile(?:/)?$", "routeKeys": { "nxtPadvertiserId": "nxtPadvertiserId" }, "namedRegex": "^/advertiser/(?<nxtPadvertiserId>[^/]+?)/profile(?:/)?$" }, { "page": "/advertiser/[advertiserId]/support", "regex": "^/advertiser/([^/]+?)/support(?:/)?$", "routeKeys": { "nxtPadvertiserId": "nxtPadvertiserId" }, "namedRegex": "^/advertiser/(?<nxtPadvertiserId>[^/]+?)/support(?:/)?$" }, { "page": "/advertiser/[advertiserId]/support/create", "regex": "^/advertiser/([^/]+?)/support/create(?:/)?$", "routeKeys": { "nxtPadvertiserId": "nxtPadvertiserId" }, "namedRegex": "^/advertiser/(?<nxtPadvertiserId>[^/]+?)/support/create(?:/)?$" }, { "page": "/advertiser/[advertiserId]/support/[supportId]", "regex": "^/advertiser/([^/]+?)/support/([^/]+?)(?:/)?$", "routeKeys": { "nxtPadvertiserId": "nxtPadvertiserId", "nxtPsupportId": "nxtPsupportId" }, "namedRegex": "^/advertiser/(?<nxtPadvertiserId>[^/]+?)/support/(?<nxtPsupportId>[^/]+?)(?:/)?$" }], "data": { "static": [], "dynamic": [] } }, "locales": [] };
var ConfigHeaders = [];
var PrerenderManifest = { "version": 4, "routes": { "/_not-found": { "initialStatus": 404, "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/_not-found", "dataRoute": "/_not-found.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/auth/advertiser": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/auth/advertiser", "dataRoute": "/auth/advertiser.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/auth/admin": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/auth/admin", "dataRoute": "/auth/admin.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/auth/resetPass": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/auth/resetPass", "dataRoute": "/auth/resetPass.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] } }, "dynamicRoutes": {}, "notFoundRoutes": [], "preview": { "previewModeId": "8db3b8c6f3feca2debd4981ec723a48a", "previewModeSigningKey": "3e5524c850ae74bc6355b697a26f2dbb12a1cc17933c73a8f436e03eb84f9d51", "previewModeEncryptionKey": "bd591de008e88701e3ef6b87226b054c80e870a35e79f2038c87ddaf4dccc807" } };
var MiddlewareManifest = { "version": 3, "middleware": { "/": { "files": ["server/edge/chunks/[root-of-the-server]__09ade3a5._.js", "server/edge/chunks/[root-of-the-server]__73965b5f._.js", "server/edge/chunks/turbopack-edge-wrapper_1b27dae0.js"], "name": "middleware", "page": "/", "matchers": [{ "regexp": "^(?:\\/(_next\\/data\\/[^/]{1,}))?\\/advertiser(?:\\/((?:[^\\/#\\?]+?)(?:\\/(?:[^\\/#\\?]+?))*))?(\\\\.json)?[\\/#\\?]?$", "originalSource": "/advertiser/:path*" }, { "regexp": "^(?:\\/(_next\\/data\\/[^/]{1,}))?\\/admin(?:\\/((?:[^\\/#\\?]+?)(?:\\/(?:[^\\/#\\?]+?))*))?(\\\\.json)?[\\/#\\?]?$", "originalSource": "/admin/:path*" }], "wasm": [{ "name": "wasm_2f49a330183a3ca1", "filePath": "server/edge/chunks/node_modules__prisma_client_query_engine_bg_23ace1ce.wasm" }], "assets": [], "env": { "__NEXT_BUILD_ID": "pnJFYmFSdU1P5tKNJWZQF", "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY": "1kjSZd5EXxyj4vEK45y+mVgnbGj43WVhuLFBNzNLsW4=", "__NEXT_PREVIEW_MODE_ID": "8db3b8c6f3feca2debd4981ec723a48a", "__NEXT_PREVIEW_MODE_ENCRYPTION_KEY": "bd591de008e88701e3ef6b87226b054c80e870a35e79f2038c87ddaf4dccc807", "__NEXT_PREVIEW_MODE_SIGNING_KEY": "3e5524c850ae74bc6355b697a26f2dbb12a1cc17933c73a8f436e03eb84f9d51" } } }, "sortedMiddleware": ["/"], "functions": {} };
var AppPathRoutesManifest = { "/(auth)/auth/admin/page": "/auth/admin", "/(auth)/auth/advertiser/page": "/auth/advertiser", "/(auth)/auth/resetPass/page": "/auth/resetPass", "/(main)/admin/[adminId]/notification/[notificationId]/page": "/admin/[adminId]/notification/[notificationId]", "/(main)/admin/[adminId]/notification/create/page": "/admin/[adminId]/notification/create", "/(main)/admin/[adminId]/notification/page": "/admin/[adminId]/notification", "/(main)/admin/[adminId]/page": "/admin/[adminId]", "/(main)/admin/[adminId]/payment/page": "/admin/[adminId]/payment", "/(main)/admin/[adminId]/review/[adId]/page": "/admin/[adminId]/review/[adId]", "/(main)/admin/[adminId]/review/adStats/page": "/admin/[adminId]/review/adStats", "/(main)/admin/[adminId]/review/page": "/admin/[adminId]/review", "/(main)/admin/[adminId]/support/[supportId]/page": "/admin/[adminId]/support/[supportId]", "/(main)/admin/[adminId]/support/page": "/admin/[adminId]/support", "/(main)/admin/[adminId]/user/[userId]/page": "/admin/[adminId]/user/[userId]", "/(main)/admin/[adminId]/user/page": "/admin/[adminId]/user", "/(main)/advertiser/[advertiserId]/ad/[adId]/page": "/advertiser/[advertiserId]/ad/[adId]", "/(main)/advertiser/[advertiserId]/ad/create/form/[adType]/page": "/advertiser/[advertiserId]/ad/create/form/[adType]", "/(main)/advertiser/[advertiserId]/ad/create/page": "/advertiser/[advertiserId]/ad/create", "/(main)/advertiser/[advertiserId]/ad/page": "/advertiser/[advertiserId]/ad", "/(main)/advertiser/[advertiserId]/ad/stats/page": "/advertiser/[advertiserId]/ad/stats", "/(main)/advertiser/[advertiserId]/notification/[notificationId]/page": "/advertiser/[advertiserId]/notification/[notificationId]", "/(main)/advertiser/[advertiserId]/notification/page": "/advertiser/[advertiserId]/notification", "/(main)/advertiser/[advertiserId]/page": "/advertiser/[advertiserId]", "/(main)/advertiser/[advertiserId]/point/[pointId]/page": "/advertiser/[advertiserId]/point/[pointId]", "/(main)/advertiser/[advertiserId]/point/page": "/advertiser/[advertiserId]/point", "/(main)/advertiser/[advertiserId]/point/purchase/credit/page": "/advertiser/[advertiserId]/point/purchase/credit", "/(main)/advertiser/[advertiserId]/point/purchase/crypt/page": "/advertiser/[advertiserId]/point/purchase/crypt", "/(main)/advertiser/[advertiserId]/point/purchase/page": "/advertiser/[advertiserId]/point/purchase", "/(main)/advertiser/[advertiserId]/point/purchase/success/page": "/advertiser/[advertiserId]/point/purchase/success", "/(main)/advertiser/[advertiserId]/profile/page": "/advertiser/[advertiserId]/profile", "/(main)/advertiser/[advertiserId]/support/[supportId]/page": "/advertiser/[advertiserId]/support/[supportId]", "/(main)/advertiser/[advertiserId]/support/create/page": "/advertiser/[advertiserId]/support/create", "/(main)/advertiser/[advertiserId]/support/page": "/advertiser/[advertiserId]/support", "/(main)/contact/page": "/contact", "/(main)/legal/privacy/page": "/legal/privacy", "/(main)/legal/terms/page": "/legal/terms", "/(main)/page": "/", "/_not-found/page": "/_not-found", "/api/ads/youtube/route": "/api/ads/youtube" };
var FunctionsConfigManifest = { "version": 1, "functions": {} };
var PagesManifest = { "/_app": "pages/_app.js", "/_document": "pages/_document.js", "/_error": "pages/_error.js", "/404": "pages/404.html" };
process.env.NEXT_BUILD_ID = BuildId;

// node_modules/@opennextjs/aws/dist/http/openNextResponse.js
init_logger();
init_util();
import { Transform } from "node:stream";

// node_modules/@opennextjs/aws/dist/core/routing/util.js
init_util();
init_logger();

// node_modules/@opennextjs/aws/dist/utils/binary.js
var commonBinaryMimeTypes = /* @__PURE__ */ new Set([
  "application/octet-stream",
  // Docs
  "application/epub+zip",
  "application/msword",
  "application/pdf",
  "application/rtf",
  "application/vnd.amazon.ebook",
  "application/vnd.ms-excel",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  // Fonts
  "font/otf",
  "font/woff",
  "font/woff2",
  // Images
  "image/bmp",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/tiff",
  "image/vnd.microsoft.icon",
  "image/webp",
  // Audio
  "audio/3gpp",
  "audio/aac",
  "audio/basic",
  "audio/flac",
  "audio/mpeg",
  "audio/ogg",
  "audio/wavaudio/webm",
  "audio/x-aiff",
  "audio/x-midi",
  "audio/x-wav",
  // Video
  "video/3gpp",
  "video/mp2t",
  "video/mpeg",
  "video/ogg",
  "video/quicktime",
  "video/webm",
  "video/x-msvideo",
  // Archives
  "application/java-archive",
  "application/vnd.apple.installer+xml",
  "application/x-7z-compressed",
  "application/x-apple-diskimage",
  "application/x-bzip",
  "application/x-bzip2",
  "application/x-gzip",
  "application/x-java-archive",
  "application/x-rar-compressed",
  "application/x-tar",
  "application/x-zip",
  "application/zip",
  // Serialized data
  "application/x-protobuf"
]);
function isBinaryContentType(contentType) {
  if (!contentType)
    return false;
  const value = contentType?.split(";")[0] ?? "";
  return commonBinaryMimeTypes.has(value);
}

// node_modules/@opennextjs/aws/dist/core/routing/i18n/index.js
init_stream();
init_logger();

// node_modules/@opennextjs/aws/dist/core/routing/i18n/accept-header.js
function parse(raw, preferences, options) {
  const lowers = /* @__PURE__ */ new Map();
  const header = raw.replace(/[ \t]/g, "");
  if (preferences) {
    let pos = 0;
    for (const preference of preferences) {
      const lower = preference.toLowerCase();
      lowers.set(lower, { orig: preference, pos: pos++ });
      if (options.prefixMatch) {
        const parts2 = lower.split("-");
        while (parts2.pop(), parts2.length > 0) {
          const joined = parts2.join("-");
          if (!lowers.has(joined)) {
            lowers.set(joined, { orig: preference, pos: pos++ });
          }
        }
      }
    }
  }
  const parts = header.split(",");
  const selections = [];
  const map = /* @__PURE__ */ new Set();
  for (let i = 0; i < parts.length; ++i) {
    const part = parts[i];
    if (!part) {
      continue;
    }
    const params = part.split(";");
    if (params.length > 2) {
      throw new Error(`Invalid ${options.type} header`);
    }
    const token = params[0].toLowerCase();
    if (!token) {
      throw new Error(`Invalid ${options.type} header`);
    }
    const selection = { token, pos: i, q: 1 };
    if (preferences && lowers.has(token)) {
      selection.pref = lowers.get(token).pos;
    }
    map.add(selection.token);
    if (params.length === 2) {
      const q = params[1];
      const [key, value] = q.split("=");
      if (!value || key !== "q" && key !== "Q") {
        throw new Error(`Invalid ${options.type} header`);
      }
      const score = Number.parseFloat(value);
      if (score === 0) {
        continue;
      }
      if (Number.isFinite(score) && score <= 1 && score >= 1e-3) {
        selection.q = score;
      }
    }
    selections.push(selection);
  }
  selections.sort((a, b) => {
    if (b.q !== a.q) {
      return b.q - a.q;
    }
    if (b.pref !== a.pref) {
      if (a.pref === void 0) {
        return 1;
      }
      if (b.pref === void 0) {
        return -1;
      }
      return a.pref - b.pref;
    }
    return a.pos - b.pos;
  });
  const values = selections.map((selection) => selection.token);
  if (!preferences || !preferences.length) {
    return values;
  }
  const preferred = [];
  for (const selection of values) {
    if (selection === "*") {
      for (const [preference, value] of lowers) {
        if (!map.has(preference)) {
          preferred.push(value.orig);
        }
      }
    } else {
      const lower = selection.toLowerCase();
      if (lowers.has(lower)) {
        preferred.push(lowers.get(lower).orig);
      }
    }
  }
  return preferred;
}
function acceptLanguage(header = "", preferences) {
  return parse(header, preferences, {
    type: "accept-language",
    prefixMatch: true
  })[0] || void 0;
}

// node_modules/@opennextjs/aws/dist/core/routing/i18n/index.js
function isLocalizedPath(path3) {
  return NextConfig.i18n?.locales.includes(path3.split("/")[1].toLowerCase()) ?? false;
}
function getLocaleFromCookie(cookies) {
  const i18n = NextConfig.i18n;
  const nextLocale = cookies.NEXT_LOCALE?.toLowerCase();
  return nextLocale ? i18n?.locales.find((locale) => nextLocale === locale.toLowerCase()) : void 0;
}
function detectDomainLocale({ hostname, detectedLocale }) {
  const i18n = NextConfig.i18n;
  const domains = i18n?.domains;
  if (!domains) {
    return;
  }
  const lowercasedLocale = detectedLocale?.toLowerCase();
  for (const domain of domains) {
    const domainHostname = domain.domain.split(":", 1)[0].toLowerCase();
    if (hostname === domainHostname || lowercasedLocale === domain.defaultLocale.toLowerCase() || domain.locales?.some((locale) => lowercasedLocale === locale.toLowerCase())) {
      return domain;
    }
  }
}
function detectLocale(internalEvent, i18n) {
  const domainLocale = detectDomainLocale({
    hostname: internalEvent.headers.host
  });
  if (i18n.localeDetection === false) {
    return domainLocale?.defaultLocale ?? i18n.defaultLocale;
  }
  const cookiesLocale = getLocaleFromCookie(internalEvent.cookies);
  const preferredLocale = acceptLanguage(internalEvent.headers["accept-language"], i18n?.locales);
  debug({
    cookiesLocale,
    preferredLocale,
    defaultLocale: i18n.defaultLocale,
    domainLocale
  });
  return domainLocale?.defaultLocale ?? cookiesLocale ?? preferredLocale ?? i18n.defaultLocale;
}
function localizePath(internalEvent) {
  const i18n = NextConfig.i18n;
  if (!i18n) {
    return internalEvent.rawPath;
  }
  if (isLocalizedPath(internalEvent.rawPath)) {
    return internalEvent.rawPath;
  }
  const detectedLocale = detectLocale(internalEvent, i18n);
  return `/${detectedLocale}${internalEvent.rawPath}`;
}
function handleLocaleRedirect(internalEvent) {
  const i18n = NextConfig.i18n;
  if (!i18n || i18n.localeDetection === false || internalEvent.rawPath !== "/") {
    return false;
  }
  const preferredLocale = acceptLanguage(internalEvent.headers["accept-language"], i18n?.locales);
  const detectedLocale = detectLocale(internalEvent, i18n);
  const domainLocale = detectDomainLocale({
    hostname: internalEvent.headers.host
  });
  const preferredDomain = detectDomainLocale({
    detectedLocale: preferredLocale
  });
  if (domainLocale && preferredDomain) {
    const isPDomain = preferredDomain.domain === domainLocale.domain;
    const isPLocale = preferredDomain.defaultLocale === preferredLocale;
    if (!isPDomain || !isPLocale) {
      const scheme = `http${preferredDomain.http ? "" : "s"}`;
      const rlocale = isPLocale ? "" : preferredLocale;
      return {
        type: "core",
        statusCode: 307,
        headers: {
          Location: `${scheme}://${preferredDomain.domain}/${rlocale}`
        },
        body: emptyReadableStream(),
        isBase64Encoded: false
      };
    }
  }
  const defaultLocale = domainLocale?.defaultLocale ?? i18n.defaultLocale;
  if (detectedLocale.toLowerCase() !== defaultLocale.toLowerCase()) {
    return {
      type: "core",
      statusCode: 307,
      headers: {
        Location: constructNextUrl(internalEvent.url, `/${detectedLocale}`)
      },
      body: emptyReadableStream(),
      isBase64Encoded: false
    };
  }
  return false;
}

// node_modules/@opennextjs/aws/dist/core/routing/queue.js
function generateShardId(rawPath, maxConcurrency, prefix) {
  let a = cyrb128(rawPath);
  let t = a += 1831565813;
  t = Math.imul(t ^ t >>> 15, t | 1);
  t ^= t + Math.imul(t ^ t >>> 7, t | 61);
  const randomFloat = ((t ^ t >>> 14) >>> 0) / 4294967296;
  const randomInt = Math.floor(randomFloat * maxConcurrency);
  return `${prefix}-${randomInt}`;
}
function generateMessageGroupId(rawPath) {
  const maxConcurrency = Number.parseInt(process.env.MAX_REVALIDATE_CONCURRENCY ?? "10");
  return generateShardId(rawPath, maxConcurrency, "revalidate");
}
function cyrb128(str) {
  let h1 = 1779033703;
  let h2 = 3144134277;
  let h3 = 1013904242;
  let h4 = 2773480762;
  for (let i = 0, k; i < str.length; i++) {
    k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ h1 >>> 18, 597399067);
  h2 = Math.imul(h4 ^ h2 >>> 22, 2869860233);
  h3 = Math.imul(h1 ^ h3 >>> 17, 951274213);
  h4 = Math.imul(h2 ^ h4 >>> 19, 2716044179);
  h1 ^= h2 ^ h3 ^ h4, h2 ^= h1, h3 ^= h1, h4 ^= h1;
  return h1 >>> 0;
}

// node_modules/@opennextjs/aws/dist/core/routing/util.js
function isExternal(url, host) {
  if (!url)
    return false;
  const pattern = /^https?:\/\//;
  if (host) {
    return pattern.test(url) && !url.includes(host);
  }
  return pattern.test(url);
}
function convertFromQueryString(query) {
  if (query === "")
    return {};
  const queryParts = query.split("&");
  return getQueryFromIterator(queryParts.map((p) => {
    const [key, value] = p.split("=");
    return [key, value];
  }));
}
function getUrlParts(url, isExternal2) {
  if (!isExternal2) {
    const regex2 = /\/([^?]*)\??(.*)/;
    const match3 = url.match(regex2);
    return {
      hostname: "",
      pathname: match3?.[1] ? `/${match3[1]}` : url,
      protocol: "",
      queryString: match3?.[2] ?? ""
    };
  }
  const regex = /^(https?:)\/\/?([^\/\s]+)(\/[^?]*)?(\?.*)?/;
  const match2 = url.match(regex);
  if (!match2) {
    throw new Error(`Invalid external URL: ${url}`);
  }
  return {
    protocol: match2[1] ?? "https:",
    hostname: match2[2],
    pathname: match2[3] ?? "",
    queryString: match2[4]?.slice(1) ?? ""
  };
}
function constructNextUrl(baseUrl, path3) {
  const nextBasePath = NextConfig.basePath ?? "";
  const url = new URL(`${nextBasePath}${path3}`, baseUrl);
  return url.href;
}
function convertToQueryString(query) {
  const queryStrings = [];
  Object.entries(query).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((entry) => queryStrings.push(`${key}=${entry}`));
    } else {
      queryStrings.push(`${key}=${value}`);
    }
  });
  return queryStrings.length > 0 ? `?${queryStrings.join("&")}` : "";
}
function getMiddlewareMatch(middlewareManifest2, functionsManifest) {
  if (functionsManifest?.functions?.["/_middleware"]) {
    return functionsManifest.functions["/_middleware"].matchers?.map(({ regexp }) => new RegExp(regexp)) ?? [/.*/];
  }
  const rootMiddleware = middlewareManifest2.middleware["/"];
  if (!rootMiddleware?.matchers)
    return [];
  return rootMiddleware.matchers.map(({ regexp }) => new RegExp(regexp));
}
function escapeRegex(str, { isPath } = {}) {
  const result = str.replaceAll("(.)", "_\xB51_").replaceAll("(..)", "_\xB52_").replaceAll("(...)", "_\xB53_");
  return isPath ? result : result.replaceAll("+", "_\xB54_");
}
function unescapeRegex(str) {
  return str.replaceAll("_\xB51_", "(.)").replaceAll("_\xB52_", "(..)").replaceAll("_\xB53_", "(...)").replaceAll("_\xB54_", "+");
}
function convertBodyToReadableStream(method, body) {
  if (method === "GET" || method === "HEAD")
    return void 0;
  if (!body)
    return void 0;
  const readable = new ReadableStream({
    start(controller) {
      controller.enqueue(body);
      controller.close();
    }
  });
  return readable;
}
var CommonHeaders;
(function(CommonHeaders2) {
  CommonHeaders2["CACHE_CONTROL"] = "cache-control";
  CommonHeaders2["NEXT_CACHE"] = "x-nextjs-cache";
})(CommonHeaders || (CommonHeaders = {}));
function normalizeLocationHeader(location2, baseUrl, encodeQuery = false) {
  if (!URL.canParse(location2)) {
    return location2;
  }
  const locationURL = new URL(location2);
  const origin = new URL(baseUrl).origin;
  let search = locationURL.search;
  if (encodeQuery && search) {
    search = `?${stringifyQs(parseQs(search.slice(1)))}`;
  }
  const href = `${locationURL.origin}${locationURL.pathname}${search}${locationURL.hash}`;
  if (locationURL.origin === origin) {
    return href.slice(origin.length);
  }
  return href;
}

// node_modules/@opennextjs/aws/dist/core/routingHandler.js
init_logger();

// node_modules/@opennextjs/aws/dist/core/routing/cacheInterceptor.js
import { createHash } from "node:crypto";
init_stream();

// node_modules/@opennextjs/aws/dist/utils/cache.js
init_logger();
async function hasBeenRevalidated(key, tags, cacheEntry) {
  if (globalThis.openNextConfig.dangerous?.disableTagCache) {
    return false;
  }
  const value = cacheEntry.value;
  if (!value) {
    return true;
  }
  if ("type" in cacheEntry && cacheEntry.type === "page") {
    return false;
  }
  const lastModified = cacheEntry.lastModified ?? Date.now();
  if (globalThis.tagCache.mode === "nextMode") {
    return await globalThis.tagCache.hasBeenRevalidated(tags, lastModified);
  }
  const _lastModified = await globalThis.tagCache.getLastModified(key, lastModified);
  return _lastModified === -1;
}
function getTagsFromValue(value) {
  if (!value) {
    return [];
  }
  try {
    return value.meta?.headers?.["x-next-cache-tags"]?.split(",") ?? [];
  } catch (e) {
    return [];
  }
}

// node_modules/@opennextjs/aws/dist/core/routing/cacheInterceptor.js
init_logger();
var CACHE_ONE_YEAR = 60 * 60 * 24 * 365;
var CACHE_ONE_MONTH = 60 * 60 * 24 * 30;
var VARY_HEADER = "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch, Next-Url";
async function computeCacheControl(path3, body, host, revalidate, lastModified) {
  let finalRevalidate = CACHE_ONE_YEAR;
  const existingRoute = Object.entries(PrerenderManifest.routes).find((p) => p[0] === path3)?.[1];
  if (revalidate === void 0 && existingRoute) {
    finalRevalidate = existingRoute.initialRevalidateSeconds === false ? CACHE_ONE_YEAR : existingRoute.initialRevalidateSeconds;
  } else if (revalidate !== void 0) {
    finalRevalidate = revalidate === false ? CACHE_ONE_YEAR : revalidate;
  }
  const age = Math.round((Date.now() - (lastModified ?? 0)) / 1e3);
  const hash = (str) => createHash("md5").update(str).digest("hex");
  const etag = hash(body);
  if (revalidate === 0) {
    return {
      "cache-control": "private, no-cache, no-store, max-age=0, must-revalidate",
      "x-opennext-cache": "ERROR",
      etag
    };
  }
  if (finalRevalidate !== CACHE_ONE_YEAR) {
    const sMaxAge = Math.max(finalRevalidate - age, 1);
    debug("sMaxAge", {
      finalRevalidate,
      age,
      lastModified,
      revalidate
    });
    const isStale = sMaxAge === 1;
    if (isStale) {
      let url = NextConfig.trailingSlash ? `${path3}/` : path3;
      if (NextConfig.basePath) {
        url = `${NextConfig.basePath}${url}`;
      }
      await globalThis.queue.send({
        MessageBody: {
          host,
          url,
          eTag: etag,
          lastModified: lastModified ?? Date.now()
        },
        MessageDeduplicationId: hash(`${path3}-${lastModified}-${etag}`),
        MessageGroupId: generateMessageGroupId(path3)
      });
    }
    return {
      "cache-control": `s-maxage=${sMaxAge}, stale-while-revalidate=${CACHE_ONE_MONTH}`,
      "x-opennext-cache": isStale ? "STALE" : "HIT",
      etag
    };
  }
  return {
    "cache-control": `s-maxage=${CACHE_ONE_YEAR}, stale-while-revalidate=${CACHE_ONE_MONTH}`,
    "x-opennext-cache": "HIT",
    etag
  };
}
async function generateResult(event, localizedPath, cachedValue, lastModified) {
  debug("Returning result from experimental cache");
  let body = "";
  let type = "application/octet-stream";
  let isDataRequest = false;
  switch (cachedValue.type) {
    case "app":
      isDataRequest = Boolean(event.headers.rsc);
      body = isDataRequest ? cachedValue.rsc : cachedValue.html;
      type = isDataRequest ? "text/x-component" : "text/html; charset=utf-8";
      break;
    case "page":
      isDataRequest = Boolean(event.query.__nextDataReq);
      body = isDataRequest ? JSON.stringify(cachedValue.json) : cachedValue.html;
      type = isDataRequest ? "application/json" : "text/html; charset=utf-8";
      break;
  }
  const cacheControl = await computeCacheControl(localizedPath, body, event.headers.host, cachedValue.revalidate, lastModified);
  return {
    type: "core",
    // sometimes other status codes can be cached, like 404. For these cases, we should return the correct status code
    statusCode: cachedValue.meta?.status ?? 200,
    body: toReadableStream(body, false),
    isBase64Encoded: false,
    headers: {
      ...cacheControl,
      "content-type": type,
      ...cachedValue.meta?.headers,
      vary: VARY_HEADER
    }
  };
}
function escapePathDelimiters(segment, escapeEncoded) {
  return segment.replace(new RegExp(`([/#?]${escapeEncoded ? "|%(2f|23|3f|5c)" : ""})`, "gi"), (char) => encodeURIComponent(char));
}
function decodePathParams(pathname) {
  return pathname.split("/").map((segment) => {
    try {
      return escapePathDelimiters(decodeURIComponent(segment), true);
    } catch (e) {
      return segment;
    }
  }).join("/");
}
async function cacheInterceptor(event) {
  if (Boolean(event.headers["next-action"]) || Boolean(event.headers["x-prerender-revalidate"]))
    return event;
  const cookies = event.headers.cookie || "";
  const hasPreviewData = cookies.includes("__prerender_bypass") || cookies.includes("__next_preview_data");
  if (hasPreviewData) {
    debug("Preview mode detected, passing through to handler");
    return event;
  }
  let localizedPath = localizePath(event);
  if (NextConfig.basePath) {
    localizedPath = localizedPath.replace(NextConfig.basePath, "");
  }
  localizedPath = localizedPath.replace(/\/$/, "");
  localizedPath = decodePathParams(localizedPath);
  debug("Checking cache for", localizedPath, PrerenderManifest);
  const isISR = Object.keys(PrerenderManifest.routes).includes(localizedPath ?? "/") || Object.values(PrerenderManifest.dynamicRoutes).some((dr) => new RegExp(dr.routeRegex).test(localizedPath));
  debug("isISR", isISR);
  if (isISR) {
    try {
      const cachedData = await globalThis.incrementalCache.get(localizedPath ?? "/index");
      debug("cached data in interceptor", cachedData);
      if (!cachedData?.value) {
        return event;
      }
      if (cachedData.value?.type === "app" || cachedData.value?.type === "route") {
        const tags = getTagsFromValue(cachedData.value);
        const _hasBeenRevalidated = cachedData.shouldBypassTagCache ? false : await hasBeenRevalidated(localizedPath, tags, cachedData);
        if (_hasBeenRevalidated) {
          return event;
        }
      }
      const host = event.headers.host;
      switch (cachedData?.value?.type) {
        case "app":
        case "page":
          return generateResult(event, localizedPath, cachedData.value, cachedData.lastModified);
        case "redirect": {
          const cacheControl = await computeCacheControl(localizedPath, "", host, cachedData.value.revalidate, cachedData.lastModified);
          return {
            type: "core",
            statusCode: cachedData.value.meta?.status ?? 307,
            body: emptyReadableStream(),
            headers: {
              ...cachedData.value.meta?.headers ?? {},
              ...cacheControl
            },
            isBase64Encoded: false
          };
        }
        case "route": {
          const cacheControl = await computeCacheControl(localizedPath, cachedData.value.body, host, cachedData.value.revalidate, cachedData.lastModified);
          const isBinary = isBinaryContentType(String(cachedData.value.meta?.headers?.["content-type"]));
          return {
            type: "core",
            statusCode: cachedData.value.meta?.status ?? 200,
            body: toReadableStream(cachedData.value.body, isBinary),
            headers: {
              ...cacheControl,
              ...cachedData.value.meta?.headers,
              vary: VARY_HEADER
            },
            isBase64Encoded: isBinary
          };
        }
        default:
          return event;
      }
    } catch (e) {
      debug("Error while fetching cache", e);
      return event;
    }
  }
  return event;
}

// node_modules/path-to-regexp/dist.es2015/index.js
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
function parse2(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path3 = "";
  var tryConsume = function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  };
  var mustConsume = function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  };
  var consumeText = function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  };
  var isSafe = function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  };
  var safePattern = function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  };
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path3 += prefix;
        prefix = "";
      }
      if (path3) {
        result.push(path3);
        path3 = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path3 += value;
      continue;
    }
    if (path3) {
      result.push(path3);
      path3 = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
function compile(str, options) {
  return tokensToFunction(parse2(str, options), options);
}
function tokensToFunction(tokens, options) {
  if (options === void 0) {
    options = {};
  }
  var reFlags = flags(options);
  var _a = options.encode, encode = _a === void 0 ? function(x) {
    return x;
  } : _a, _b = options.validate, validate = _b === void 0 ? true : _b;
  var matches = tokens.map(function(token) {
    if (typeof token === "object") {
      return new RegExp("^(?:".concat(token.pattern, ")$"), reFlags);
    }
  });
  return function(data) {
    var path3 = "";
    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];
      if (typeof token === "string") {
        path3 += token;
        continue;
      }
      var value = data ? data[token.name] : void 0;
      var optional = token.modifier === "?" || token.modifier === "*";
      var repeat = token.modifier === "*" || token.modifier === "+";
      if (Array.isArray(value)) {
        if (!repeat) {
          throw new TypeError('Expected "'.concat(token.name, '" to not repeat, but got an array'));
        }
        if (value.length === 0) {
          if (optional)
            continue;
          throw new TypeError('Expected "'.concat(token.name, '" to not be empty'));
        }
        for (var j = 0; j < value.length; j++) {
          var segment = encode(value[j], token);
          if (validate && !matches[i].test(segment)) {
            throw new TypeError('Expected all "'.concat(token.name, '" to match "').concat(token.pattern, '", but got "').concat(segment, '"'));
          }
          path3 += token.prefix + segment + token.suffix;
        }
        continue;
      }
      if (typeof value === "string" || typeof value === "number") {
        var segment = encode(String(value), token);
        if (validate && !matches[i].test(segment)) {
          throw new TypeError('Expected "'.concat(token.name, '" to match "').concat(token.pattern, '", but got "').concat(segment, '"'));
        }
        path3 += token.prefix + segment + token.suffix;
        continue;
      }
      if (optional)
        continue;
      var typeOfMessage = repeat ? "an array" : "a string";
      throw new TypeError('Expected "'.concat(token.name, '" to be ').concat(typeOfMessage));
    }
    return path3;
  };
}
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path3 = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    };
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path: path3, index, params };
  };
}
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
function regexpToRegexp(path3, keys) {
  if (!keys)
    return path3;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path3.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path3.source);
  }
  return path3;
}
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path3) {
    return pathToRegexp(path3, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
function stringToRegexp(path3, keys, options) {
  return tokensToRegexp(parse2(path3, options), keys, options);
}
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
function pathToRegexp(path3, keys, options) {
  if (path3 instanceof RegExp)
    return regexpToRegexp(path3, keys);
  if (Array.isArray(path3))
    return arrayToRegexp(path3, keys, options);
  return stringToRegexp(path3, keys, options);
}

// node_modules/@opennextjs/aws/dist/utils/normalize-path.js
import path2 from "node:path";
function normalizeRepeatedSlashes(url) {
  const urlNoQuery = url.host + url.pathname;
  return `${url.protocol}//${urlNoQuery.replace(/\\/g, "/").replace(/\/\/+/g, "/")}${url.search}`;
}

// node_modules/@opennextjs/aws/dist/core/routing/matcher.js
init_stream();
init_logger();

// node_modules/@opennextjs/aws/dist/core/routing/routeMatcher.js
var optionalLocalePrefixRegex = `^/(?:${RoutesManifest.locales.map((locale) => `${locale}/?`).join("|")})?`;
var optionalBasepathPrefixRegex = RoutesManifest.basePath ? `^${RoutesManifest.basePath}/?` : "^/";
var optionalPrefix = optionalLocalePrefixRegex.replace("^/", optionalBasepathPrefixRegex);
function routeMatcher(routeDefinitions) {
  const regexp = routeDefinitions.map((route) => ({
    page: route.page,
    regexp: new RegExp(route.regex.replace("^/", optionalPrefix))
  }));
  const appPathsSet = /* @__PURE__ */ new Set();
  const routePathsSet = /* @__PURE__ */ new Set();
  for (const [k, v] of Object.entries(AppPathRoutesManifest)) {
    if (k.endsWith("page")) {
      appPathsSet.add(v);
    } else if (k.endsWith("route")) {
      routePathsSet.add(v);
    }
  }
  return function matchRoute(path3) {
    const foundRoutes = regexp.filter((route) => route.regexp.test(path3));
    return foundRoutes.map((foundRoute) => {
      let routeType = "page";
      if (appPathsSet.has(foundRoute.page)) {
        routeType = "app";
      } else if (routePathsSet.has(foundRoute.page)) {
        routeType = "route";
      }
      return {
        route: foundRoute.page,
        type: routeType
      };
    });
  };
}
var staticRouteMatcher = routeMatcher([
  ...RoutesManifest.routes.static,
  ...getStaticAPIRoutes()
]);
var dynamicRouteMatcher = routeMatcher(RoutesManifest.routes.dynamic);
function getStaticAPIRoutes() {
  const createRouteDefinition = (route) => ({
    page: route,
    regex: `^${route}(?:/)?$`
  });
  const dynamicRoutePages = new Set(RoutesManifest.routes.dynamic.map(({ page }) => page));
  const pagesStaticAPIRoutes = Object.keys(PagesManifest).filter((route) => route.startsWith("/api/") && !dynamicRoutePages.has(route)).map(createRouteDefinition);
  const appPathsStaticAPIRoutes = Object.values(AppPathRoutesManifest).filter((route) => route.startsWith("/api/") || route === "/api" && !dynamicRoutePages.has(route)).map(createRouteDefinition);
  return [...pagesStaticAPIRoutes, ...appPathsStaticAPIRoutes];
}

// node_modules/@opennextjs/aws/dist/core/routing/matcher.js
var routeHasMatcher = (headers, cookies, query) => (redirect) => {
  switch (redirect.type) {
    case "header":
      return !!headers?.[redirect.key.toLowerCase()] && new RegExp(redirect.value ?? "").test(headers[redirect.key.toLowerCase()] ?? "");
    case "cookie":
      return !!cookies?.[redirect.key] && new RegExp(redirect.value ?? "").test(cookies[redirect.key] ?? "");
    case "query":
      return query[redirect.key] && Array.isArray(redirect.value) ? redirect.value.reduce((prev, current) => prev || new RegExp(current).test(query[redirect.key]), false) : new RegExp(redirect.value ?? "").test(query[redirect.key] ?? "");
    case "host":
      return headers?.host !== "" && new RegExp(redirect.value ?? "").test(headers.host);
    default:
      return false;
  }
};
function checkHas(matcher, has, inverted = false) {
  return has ? has.reduce((acc, cur) => {
    if (acc === false)
      return false;
    return inverted ? !matcher(cur) : matcher(cur);
  }, true) : true;
}
var getParamsFromSource = (source) => (value) => {
  debug("value", value);
  const _match = source(value);
  return _match ? _match.params : {};
};
var computeParamHas = (headers, cookies, query) => (has) => {
  if (!has.value)
    return {};
  const matcher = new RegExp(`^${has.value}$`);
  const fromSource = (value) => {
    const matches = value.match(matcher);
    return matches?.groups ?? {};
  };
  switch (has.type) {
    case "header":
      return fromSource(headers[has.key.toLowerCase()] ?? "");
    case "cookie":
      return fromSource(cookies[has.key] ?? "");
    case "query":
      return Array.isArray(query[has.key]) ? fromSource(query[has.key].join(",")) : fromSource(query[has.key] ?? "");
    case "host":
      return fromSource(headers.host ?? "");
  }
};
function convertMatch(match2, toDestination, destination) {
  if (!match2) {
    return destination;
  }
  const { params } = match2;
  const isUsingParams = Object.keys(params).length > 0;
  return isUsingParams ? toDestination(params) : destination;
}
function getNextConfigHeaders(event, configHeaders) {
  if (!configHeaders) {
    return {};
  }
  const matcher = routeHasMatcher(event.headers, event.cookies, event.query);
  const requestHeaders = {};
  const localizedRawPath = localizePath(event);
  for (const { headers, has, missing, regex, source, locale } of configHeaders) {
    const path3 = locale === false ? event.rawPath : localizedRawPath;
    if (new RegExp(regex).test(path3) && checkHas(matcher, has) && checkHas(matcher, missing, true)) {
      const fromSource = match(source);
      const _match = fromSource(path3);
      headers.forEach((h) => {
        try {
          const key = convertMatch(_match, compile(h.key), h.key);
          const value = convertMatch(_match, compile(h.value), h.value);
          requestHeaders[key] = value;
        } catch {
          debug(`Error matching header ${h.key} with value ${h.value}`);
          requestHeaders[h.key] = h.value;
        }
      });
    }
  }
  return requestHeaders;
}
function handleRewrites(event, rewrites) {
  const { rawPath, headers, query, cookies, url } = event;
  const localizedRawPath = localizePath(event);
  const matcher = routeHasMatcher(headers, cookies, query);
  const computeHas = computeParamHas(headers, cookies, query);
  const rewrite = rewrites.find((route) => {
    const path3 = route.locale === false ? rawPath : localizedRawPath;
    return new RegExp(route.regex).test(path3) && checkHas(matcher, route.has) && checkHas(matcher, route.missing, true);
  });
  let finalQuery = query;
  let rewrittenUrl = url;
  const isExternalRewrite = isExternal(rewrite?.destination);
  debug("isExternalRewrite", isExternalRewrite);
  if (rewrite) {
    const { pathname, protocol, hostname, queryString } = getUrlParts(rewrite.destination, isExternalRewrite);
    const pathToUse = rewrite.locale === false ? rawPath : localizedRawPath;
    debug("urlParts", { pathname, protocol, hostname, queryString });
    const toDestinationPath = compile(escapeRegex(pathname, { isPath: true }));
    const toDestinationHost = compile(escapeRegex(hostname));
    const toDestinationQuery = compile(escapeRegex(queryString));
    const params = {
      // params for the source
      ...getParamsFromSource(match(escapeRegex(rewrite.source, { isPath: true })))(pathToUse),
      // params for the has
      ...rewrite.has?.reduce((acc, cur) => {
        return Object.assign(acc, computeHas(cur));
      }, {}),
      // params for the missing
      ...rewrite.missing?.reduce((acc, cur) => {
        return Object.assign(acc, computeHas(cur));
      }, {})
    };
    const isUsingParams = Object.keys(params).length > 0;
    let rewrittenQuery = queryString;
    let rewrittenHost = hostname;
    let rewrittenPath = pathname;
    if (isUsingParams) {
      rewrittenPath = unescapeRegex(toDestinationPath(params));
      rewrittenHost = unescapeRegex(toDestinationHost(params));
      rewrittenQuery = unescapeRegex(toDestinationQuery(params));
    }
    if (NextConfig.i18n && !isExternalRewrite) {
      const strippedPathLocale = rewrittenPath.replace(new RegExp(`^/(${NextConfig.i18n.locales.join("|")})`), "");
      if (strippedPathLocale.startsWith("/api/")) {
        rewrittenPath = strippedPathLocale;
      }
    }
    rewrittenUrl = isExternalRewrite ? `${protocol}//${rewrittenHost}${rewrittenPath}` : new URL(rewrittenPath, event.url).href;
    finalQuery = {
      ...query,
      ...convertFromQueryString(rewrittenQuery)
    };
    rewrittenUrl += convertToQueryString(finalQuery);
    debug("rewrittenUrl", { rewrittenUrl, finalQuery, isUsingParams });
  }
  return {
    internalEvent: {
      ...event,
      query: finalQuery,
      rawPath: new URL(rewrittenUrl).pathname,
      url: rewrittenUrl
    },
    __rewrite: rewrite,
    isExternalRewrite
  };
}
function handleRepeatedSlashRedirect(event) {
  if (event.rawPath.match(/(\\|\/\/)/)) {
    return {
      type: event.type,
      statusCode: 308,
      headers: {
        Location: normalizeRepeatedSlashes(new URL(event.url))
      },
      body: emptyReadableStream(),
      isBase64Encoded: false
    };
  }
  return false;
}
function handleTrailingSlashRedirect(event) {
  const url = new URL(event.rawPath, "http://localhost");
  if (
    // Someone is trying to redirect to a different origin, let's not do that
    url.host !== "localhost" || NextConfig.skipTrailingSlashRedirect || // We should not apply trailing slash redirect to API routes
    event.rawPath.startsWith("/api/")
  ) {
    return false;
  }
  const emptyBody = emptyReadableStream();
  if (NextConfig.trailingSlash && !event.headers["x-nextjs-data"] && !event.rawPath.endsWith("/") && !event.rawPath.match(/[\w-]+\.[\w]+$/g)) {
    const headersLocation = event.url.split("?");
    return {
      type: event.type,
      statusCode: 308,
      headers: {
        Location: `${headersLocation[0]}/${headersLocation[1] ? `?${headersLocation[1]}` : ""}`
      },
      body: emptyBody,
      isBase64Encoded: false
    };
  }
  if (!NextConfig.trailingSlash && event.rawPath.endsWith("/") && event.rawPath !== "/") {
    const headersLocation = event.url.split("?");
    return {
      type: event.type,
      statusCode: 308,
      headers: {
        Location: `${headersLocation[0].replace(/\/$/, "")}${headersLocation[1] ? `?${headersLocation[1]}` : ""}`
      },
      body: emptyBody,
      isBase64Encoded: false
    };
  }
  return false;
}
function handleRedirects(event, redirects) {
  const repeatedSlashRedirect = handleRepeatedSlashRedirect(event);
  if (repeatedSlashRedirect)
    return repeatedSlashRedirect;
  const trailingSlashRedirect = handleTrailingSlashRedirect(event);
  if (trailingSlashRedirect)
    return trailingSlashRedirect;
  const localeRedirect = handleLocaleRedirect(event);
  if (localeRedirect)
    return localeRedirect;
  const { internalEvent, __rewrite } = handleRewrites(event, redirects.filter((r) => !r.internal));
  if (__rewrite && !__rewrite.internal) {
    return {
      type: event.type,
      statusCode: __rewrite.statusCode ?? 308,
      headers: {
        Location: internalEvent.url
      },
      body: emptyReadableStream(),
      isBase64Encoded: false
    };
  }
}
function fixDataPage(internalEvent, buildId) {
  const { rawPath, query } = internalEvent;
  const basePath = NextConfig.basePath ?? "";
  const dataPattern = `${basePath}/_next/data/${buildId}`;
  if (rawPath.startsWith("/_next/data") && !rawPath.startsWith(dataPattern)) {
    return {
      type: internalEvent.type,
      statusCode: 404,
      body: toReadableStream("{}"),
      headers: {
        "Content-Type": "application/json"
      },
      isBase64Encoded: false
    };
  }
  if (rawPath.startsWith(dataPattern) && rawPath.endsWith(".json")) {
    const newPath = `${basePath}${rawPath.slice(dataPattern.length, -".json".length).replace(/^\/index$/, "/")}`;
    query.__nextDataReq = "1";
    return {
      ...internalEvent,
      rawPath: newPath,
      query,
      url: new URL(`${newPath}${convertToQueryString(query)}`, internalEvent.url).href
    };
  }
  return internalEvent;
}
function handleFallbackFalse(internalEvent, prerenderManifest) {
  const { rawPath } = internalEvent;
  const { dynamicRoutes, routes } = prerenderManifest;
  const prerenderedFallbackRoutes = Object.entries(dynamicRoutes).filter(([, { fallback }]) => fallback === false);
  const routeFallback = prerenderedFallbackRoutes.some(([, { routeRegex }]) => {
    const routeRegexExp = new RegExp(routeRegex);
    return routeRegexExp.test(rawPath);
  });
  const locales = NextConfig.i18n?.locales;
  const routesAlreadyHaveLocale = locales?.includes(rawPath.split("/")[1]) || // If we don't use locales, we don't need to add the default locale
  locales === void 0;
  let localizedPath = routesAlreadyHaveLocale ? rawPath : `/${NextConfig.i18n?.defaultLocale}${rawPath}`;
  if (
    // Not if localizedPath is "/" tho, because that would not make it find `isPregenerated` below since it would be try to match an empty string.
    localizedPath !== "/" && NextConfig.trailingSlash && localizedPath.endsWith("/")
  ) {
    localizedPath = localizedPath.slice(0, -1);
  }
  const matchedStaticRoute = staticRouteMatcher(localizedPath);
  const prerenderedFallbackRoutesName = prerenderedFallbackRoutes.map(([name]) => name);
  const matchedDynamicRoute = dynamicRouteMatcher(localizedPath).filter(({ route }) => !prerenderedFallbackRoutesName.includes(route));
  const isPregenerated = Object.keys(routes).includes(localizedPath);
  if (routeFallback && !isPregenerated && matchedStaticRoute.length === 0 && matchedDynamicRoute.length === 0) {
    return {
      event: {
        ...internalEvent,
        rawPath: "/404",
        url: constructNextUrl(internalEvent.url, "/404"),
        headers: {
          ...internalEvent.headers,
          "x-invoke-status": "404"
        }
      },
      isISR: false
    };
  }
  return {
    event: internalEvent,
    isISR: routeFallback || isPregenerated
  };
}

// node_modules/@opennextjs/aws/dist/core/routing/middleware.js
init_stream();
init_utils();
var middlewareManifest = MiddlewareManifest;
var functionsConfigManifest = FunctionsConfigManifest;
var middleMatch = getMiddlewareMatch(middlewareManifest, functionsConfigManifest);
var REDIRECTS = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
function defaultMiddlewareLoader() {
  return Promise.resolve().then(() => (init_edgeFunctionHandler(), edgeFunctionHandler_exports));
}
async function handleMiddleware(internalEvent, initialSearch, middlewareLoader = defaultMiddlewareLoader) {
  const headers = internalEvent.headers;
  if (headers["x-isr"] && headers["x-prerender-revalidate"] === PrerenderManifest.preview.previewModeId)
    return internalEvent;
  const normalizedPath = localizePath(internalEvent);
  const hasMatch = middleMatch.some((r) => r.test(normalizedPath));
  if (!hasMatch)
    return internalEvent;
  const initialUrl = new URL(normalizedPath, internalEvent.url);
  initialUrl.search = initialSearch;
  const url = initialUrl.href;
  const middleware = await middlewareLoader();
  const result = await middleware.default({
    // `geo` is pre Next 15.
    geo: {
      // The city name is percent-encoded.
      // See https://github.com/vercel/vercel/blob/4cb6143/packages/functions/src/headers.ts#L94C19-L94C37
      city: decodeURIComponent(headers["x-open-next-city"]),
      country: headers["x-open-next-country"],
      region: headers["x-open-next-region"],
      latitude: headers["x-open-next-latitude"],
      longitude: headers["x-open-next-longitude"]
    },
    headers,
    method: internalEvent.method || "GET",
    nextConfig: {
      basePath: NextConfig.basePath,
      i18n: NextConfig.i18n,
      trailingSlash: NextConfig.trailingSlash
    },
    url,
    body: convertBodyToReadableStream(internalEvent.method, internalEvent.body)
  });
  const statusCode = result.status;
  const responseHeaders = result.headers;
  const reqHeaders = {};
  const resHeaders = {};
  const filteredHeaders = [
    "x-middleware-override-headers",
    "x-middleware-next",
    "x-middleware-rewrite",
    // We need to drop `content-encoding` because it will be decoded
    "content-encoding"
  ];
  const xMiddlewareKey = "x-middleware-request-";
  responseHeaders.forEach((value, key) => {
    if (key.startsWith(xMiddlewareKey)) {
      const k = key.substring(xMiddlewareKey.length);
      reqHeaders[k] = value;
    } else {
      if (filteredHeaders.includes(key.toLowerCase()))
        return;
      if (key.toLowerCase() === "set-cookie") {
        resHeaders[key] = resHeaders[key] ? [...resHeaders[key], value] : [value];
      } else if (REDIRECTS.has(statusCode) && key.toLowerCase() === "location") {
        resHeaders[key] = normalizeLocationHeader(value, internalEvent.url);
      } else {
        resHeaders[key] = value;
      }
    }
  });
  const rewriteUrl = responseHeaders.get("x-middleware-rewrite");
  let isExternalRewrite = false;
  let middlewareQuery = internalEvent.query;
  let newUrl = internalEvent.url;
  if (rewriteUrl) {
    newUrl = rewriteUrl;
    if (isExternal(newUrl, internalEvent.headers.host)) {
      isExternalRewrite = true;
    } else {
      const rewriteUrlObject = new URL(rewriteUrl);
      middlewareQuery = getQueryFromSearchParams(rewriteUrlObject.searchParams);
      if ("__nextDataReq" in internalEvent.query) {
        middlewareQuery.__nextDataReq = internalEvent.query.__nextDataReq;
      }
    }
  }
  if (!rewriteUrl && !responseHeaders.get("x-middleware-next")) {
    const body = result.body ?? emptyReadableStream();
    return {
      type: internalEvent.type,
      statusCode,
      headers: resHeaders,
      body,
      isBase64Encoded: false
    };
  }
  return {
    responseHeaders: resHeaders,
    url: newUrl,
    rawPath: new URL(newUrl).pathname,
    type: internalEvent.type,
    headers: { ...internalEvent.headers, ...reqHeaders },
    body: internalEvent.body,
    method: internalEvent.method,
    query: middlewareQuery,
    cookies: internalEvent.cookies,
    remoteAddress: internalEvent.remoteAddress,
    isExternalRewrite,
    rewriteStatusCode: statusCode
  };
}

// node_modules/@opennextjs/aws/dist/core/routingHandler.js
var MIDDLEWARE_HEADER_PREFIX = "x-middleware-response-";
var MIDDLEWARE_HEADER_PREFIX_LEN = MIDDLEWARE_HEADER_PREFIX.length;
var INTERNAL_HEADER_PREFIX = "x-opennext-";
var INTERNAL_HEADER_INITIAL_URL = `${INTERNAL_HEADER_PREFIX}initial-url`;
var INTERNAL_HEADER_LOCALE = `${INTERNAL_HEADER_PREFIX}locale`;
var INTERNAL_HEADER_RESOLVED_ROUTES = `${INTERNAL_HEADER_PREFIX}resolved-routes`;
var INTERNAL_HEADER_REWRITE_STATUS_CODE = `${INTERNAL_HEADER_PREFIX}rewrite-status-code`;
var INTERNAL_EVENT_REQUEST_ID = `${INTERNAL_HEADER_PREFIX}request-id`;
var geoHeaderToNextHeader = {
  "x-open-next-city": "x-vercel-ip-city",
  "x-open-next-country": "x-vercel-ip-country",
  "x-open-next-region": "x-vercel-ip-country-region",
  "x-open-next-latitude": "x-vercel-ip-latitude",
  "x-open-next-longitude": "x-vercel-ip-longitude"
};
function applyMiddlewareHeaders(eventOrResult, middlewareHeaders) {
  const isResult = isInternalResult(eventOrResult);
  const headers = eventOrResult.headers;
  const keyPrefix = isResult ? "" : MIDDLEWARE_HEADER_PREFIX;
  Object.entries(middlewareHeaders).forEach(([key, value]) => {
    if (value) {
      headers[keyPrefix + key] = Array.isArray(value) ? value.join(",") : value;
    }
  });
}
async function routingHandler(event, { assetResolver }) {
  try {
    for (const [openNextGeoName, nextGeoName] of Object.entries(geoHeaderToNextHeader)) {
      const value = event.headers[openNextGeoName];
      if (value) {
        event.headers[nextGeoName] = value;
      }
    }
    for (const key of Object.keys(event.headers)) {
      if (key.startsWith(INTERNAL_HEADER_PREFIX) || key.startsWith(MIDDLEWARE_HEADER_PREFIX)) {
        delete event.headers[key];
      }
    }
    let headers = getNextConfigHeaders(event, ConfigHeaders);
    let eventOrResult = fixDataPage(event, BuildId);
    if (isInternalResult(eventOrResult)) {
      return eventOrResult;
    }
    const redirect = handleRedirects(eventOrResult, RoutesManifest.redirects);
    if (redirect) {
      redirect.headers.Location = normalizeLocationHeader(redirect.headers.Location, event.url, true);
      debug("redirect", redirect);
      return redirect;
    }
    const middlewareEventOrResult = await handleMiddleware(
      eventOrResult,
      // We need to pass the initial search without any decoding
      // TODO: we'd need to refactor InternalEvent to include the initial querystring directly
      // Should be done in another PR because it is a breaking change
      new URL(event.url).search
    );
    if (isInternalResult(middlewareEventOrResult)) {
      return middlewareEventOrResult;
    }
    headers = {
      ...middlewareEventOrResult.responseHeaders,
      ...headers
    };
    let isExternalRewrite = middlewareEventOrResult.isExternalRewrite ?? false;
    eventOrResult = middlewareEventOrResult;
    if (!isExternalRewrite) {
      const beforeRewrite = handleRewrites(eventOrResult, RoutesManifest.rewrites.beforeFiles);
      eventOrResult = beforeRewrite.internalEvent;
      isExternalRewrite = beforeRewrite.isExternalRewrite;
      if (!isExternalRewrite) {
        const assetResult = await assetResolver?.maybeGetAssetResult?.(eventOrResult);
        if (assetResult) {
          applyMiddlewareHeaders(assetResult, headers);
          return assetResult;
        }
      }
    }
    const foundStaticRoute = staticRouteMatcher(eventOrResult.rawPath);
    const isStaticRoute = !isExternalRewrite && foundStaticRoute.length > 0;
    if (!(isStaticRoute || isExternalRewrite)) {
      const afterRewrite = handleRewrites(eventOrResult, RoutesManifest.rewrites.afterFiles);
      eventOrResult = afterRewrite.internalEvent;
      isExternalRewrite = afterRewrite.isExternalRewrite;
    }
    let isISR = false;
    if (!isExternalRewrite) {
      const fallbackResult = handleFallbackFalse(eventOrResult, PrerenderManifest);
      eventOrResult = fallbackResult.event;
      isISR = fallbackResult.isISR;
    }
    const foundDynamicRoute = dynamicRouteMatcher(eventOrResult.rawPath);
    const isDynamicRoute = !isExternalRewrite && foundDynamicRoute.length > 0;
    if (!(isDynamicRoute || isStaticRoute || isExternalRewrite)) {
      const fallbackRewrites = handleRewrites(eventOrResult, RoutesManifest.rewrites.fallback);
      eventOrResult = fallbackRewrites.internalEvent;
      isExternalRewrite = fallbackRewrites.isExternalRewrite;
    }
    const isNextImageRoute = eventOrResult.rawPath.startsWith("/_next/image");
    const isRouteFoundBeforeAllRewrites = isStaticRoute || isDynamicRoute || isExternalRewrite;
    if (!(isRouteFoundBeforeAllRewrites || isNextImageRoute || // We need to check again once all rewrites have been applied
    staticRouteMatcher(eventOrResult.rawPath).length > 0 || dynamicRouteMatcher(eventOrResult.rawPath).length > 0)) {
      eventOrResult = {
        ...eventOrResult,
        rawPath: "/404",
        url: constructNextUrl(eventOrResult.url, "/404"),
        headers: {
          ...eventOrResult.headers,
          "x-middleware-response-cache-control": "private, no-cache, no-store, max-age=0, must-revalidate"
        }
      };
    }
    if (globalThis.openNextConfig.dangerous?.enableCacheInterception && !isInternalResult(eventOrResult)) {
      debug("Cache interception enabled");
      eventOrResult = await cacheInterceptor(eventOrResult);
      if (isInternalResult(eventOrResult)) {
        applyMiddlewareHeaders(eventOrResult, headers);
        return eventOrResult;
      }
    }
    applyMiddlewareHeaders(eventOrResult, headers);
    const resolvedRoutes = [
      ...foundStaticRoute,
      ...foundDynamicRoute
    ];
    debug("resolvedRoutes", resolvedRoutes);
    return {
      internalEvent: eventOrResult,
      isExternalRewrite,
      origin: false,
      isISR,
      resolvedRoutes,
      initialURL: event.url,
      locale: NextConfig.i18n ? detectLocale(eventOrResult, NextConfig.i18n) : void 0,
      rewriteStatusCode: middlewareEventOrResult.rewriteStatusCode
    };
  } catch (e) {
    error("Error in routingHandler", e);
    return {
      internalEvent: {
        type: "core",
        method: "GET",
        rawPath: "/500",
        url: constructNextUrl(event.url, "/500"),
        headers: {
          ...event.headers
        },
        query: event.query,
        cookies: event.cookies,
        remoteAddress: event.remoteAddress
      },
      isExternalRewrite: false,
      origin: false,
      isISR: false,
      resolvedRoutes: [],
      initialURL: event.url,
      locale: NextConfig.i18n ? detectLocale(event, NextConfig.i18n) : void 0
    };
  }
}
function isInternalResult(eventOrResult) {
  return eventOrResult != null && "statusCode" in eventOrResult;
}

// node_modules/@opennextjs/aws/dist/adapters/middleware.js
globalThis.internalFetch = fetch;
globalThis.__openNextAls = new AsyncLocalStorage();
var defaultHandler = async (internalEvent, options) => {
  const middlewareConfig = globalThis.openNextConfig.middleware;
  const originResolver = await resolveOriginResolver(middlewareConfig?.originResolver);
  const externalRequestProxy = await resolveProxyRequest(middlewareConfig?.override?.proxyExternalRequest);
  const assetResolver = await resolveAssetResolver(middlewareConfig?.assetResolver);
  const requestId = Math.random().toString(36);
  return runWithOpenNextRequestContext({
    isISRRevalidation: internalEvent.headers["x-isr"] === "1",
    waitUntil: options?.waitUntil,
    requestId
  }, async () => {
    const result = await routingHandler(internalEvent, { assetResolver });
    if ("internalEvent" in result) {
      debug("Middleware intercepted event", internalEvent);
      if (!result.isExternalRewrite) {
        const origin = await originResolver.resolve(result.internalEvent.rawPath);
        return {
          type: "middleware",
          internalEvent: {
            ...result.internalEvent,
            headers: {
              ...result.internalEvent.headers,
              [INTERNAL_HEADER_INITIAL_URL]: internalEvent.url,
              [INTERNAL_HEADER_RESOLVED_ROUTES]: JSON.stringify(result.resolvedRoutes),
              [INTERNAL_EVENT_REQUEST_ID]: requestId,
              [INTERNAL_HEADER_REWRITE_STATUS_CODE]: String(result.rewriteStatusCode)
            }
          },
          isExternalRewrite: result.isExternalRewrite,
          origin,
          isISR: result.isISR,
          initialURL: result.initialURL,
          resolvedRoutes: result.resolvedRoutes
        };
      }
      try {
        return externalRequestProxy.proxy(result.internalEvent);
      } catch (e) {
        error("External request failed.", e);
        return {
          type: "middleware",
          internalEvent: {
            ...result.internalEvent,
            headers: {
              ...result.internalEvent.headers,
              [INTERNAL_EVENT_REQUEST_ID]: requestId
            },
            rawPath: "/500",
            url: constructNextUrl(result.internalEvent.url, "/500"),
            method: "GET"
          },
          // On error we need to rewrite to the 500 page which is an internal rewrite
          isExternalRewrite: false,
          origin: false,
          isISR: result.isISR,
          initialURL: result.internalEvent.url,
          resolvedRoutes: [{ route: "/500", type: "page" }]
        };
      }
    }
    result.headers[INTERNAL_EVENT_REQUEST_ID] = requestId;
    debug("Middleware response", result);
    return result;
  });
};
var handler2 = await createGenericHandler({
  handler: defaultHandler,
  type: "middleware"
});
var middleware_default = {
  fetch: handler2
};
export {
  middleware_default as default,
  handler2 as handler
};
