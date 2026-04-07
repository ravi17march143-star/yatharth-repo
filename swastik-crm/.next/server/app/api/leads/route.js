"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/leads/route";
exports.ids = ["app/api/leads/route"];
exports.modules = {

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("mongoose");

/***/ }),

/***/ "../../client/components/action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/client/components/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/action-async-storage.external.js");

/***/ }),

/***/ "../../client/components/request-async-storage.external":
/*!********************************************************************************!*\
  !*** external "next/dist/client/components/request-async-storage.external.js" ***!
  \********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/request-async-storage.external.js");

/***/ }),

/***/ "../../client/components/static-generation-async-storage.external":
/*!******************************************************************************************!*\
  !*** external "next/dist/client/components/static-generation-async-storage.external.js" ***!
  \******************************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/static-generation-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("assert");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("events");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

module.exports = require("https");

/***/ }),

/***/ "querystring":
/*!******************************!*\
  !*** external "querystring" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("querystring");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("zlib");

/***/ }),

/***/ "node:crypto":
/*!******************************!*\
  !*** external "node:crypto" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("node:crypto");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fleads%2Froute&page=%2Fapi%2Fleads%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fleads%2Froute.ts&appDir=G%3A%5Cxmp%5Chtdocs%5Chtml%5Cswastik-crm%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=G%3A%5Cxmp%5Chtdocs%5Chtml%5Cswastik-crm&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fleads%2Froute&page=%2Fapi%2Fleads%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fleads%2Froute.ts&appDir=G%3A%5Cxmp%5Chtdocs%5Chtml%5Cswastik-crm%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=G%3A%5Cxmp%5Chtdocs%5Chtml%5Cswastik-crm&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var G_xmp_htdocs_html_swastik_crm_src_app_api_leads_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/app/api/leads/route.ts */ \"(rsc)/./src/app/api/leads/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/leads/route\",\n        pathname: \"/api/leads\",\n        filename: \"route\",\n        bundlePath: \"app/api/leads/route\"\n    },\n    resolvedPagePath: \"G:\\\\xmp\\\\htdocs\\\\html\\\\swastik-crm\\\\src\\\\app\\\\api\\\\leads\\\\route.ts\",\n    nextConfigOutput,\n    userland: G_xmp_htdocs_html_swastik_crm_src_app_api_leads_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/leads/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZsZWFkcyUyRnJvdXRlJnBhZ2U9JTJGYXBpJTJGbGVhZHMlMkZyb3V0ZSZhcHBQYXRocz0mcGFnZVBhdGg9cHJpdmF0ZS1uZXh0LWFwcC1kaXIlMkZhcGklMkZsZWFkcyUyRnJvdXRlLnRzJmFwcERpcj1HJTNBJTVDeG1wJTVDaHRkb2NzJTVDaHRtbCU1Q3N3YXN0aWstY3JtJTVDc3JjJTVDYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj1HJTNBJTVDeG1wJTVDaHRkb2NzJTVDaHRtbCU1Q3N3YXN0aWstY3JtJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBc0c7QUFDdkM7QUFDYztBQUNrQjtBQUMvRjtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsZ0hBQW1CO0FBQzNDO0FBQ0EsY0FBYyx5RUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLGlFQUFpRTtBQUN6RTtBQUNBO0FBQ0EsV0FBVyw0RUFBVztBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ3VIOztBQUV2SCIsInNvdXJjZXMiOlsid2VicGFjazovL3N3YXN0aWstY3JtLz9lNzFkIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIkc6XFxcXHhtcFxcXFxodGRvY3NcXFxcaHRtbFxcXFxzd2FzdGlrLWNybVxcXFxzcmNcXFxcYXBwXFxcXGFwaVxcXFxsZWFkc1xcXFxyb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvbGVhZHMvcm91dGVcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS9sZWFkc1wiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvbGVhZHMvcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCJHOlxcXFx4bXBcXFxcaHRkb2NzXFxcXGh0bWxcXFxcc3dhc3Rpay1jcm1cXFxcc3JjXFxcXGFwcFxcXFxhcGlcXFxcbGVhZHNcXFxccm91dGUudHNcIixcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxuICAgIHVzZXJsYW5kXG59KTtcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxuLy8gYmUgZWxpbWluYXRlZCB3aGVuIHdlJ3ZlIG1vdmVkIHRoZSBvdGhlciByb3V0ZXMgdG8gdGhlIG5ldyBmb3JtYXQuIFRoZXNlXG4vLyBhcmUgdXNlZCB0byBob29rIGludG8gdGhlIHJvdXRlLlxuY29uc3QgeyByZXF1ZXN0QXN5bmNTdG9yYWdlLCBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcyB9ID0gcm91dGVNb2R1bGU7XG5jb25zdCBvcmlnaW5hbFBhdGhuYW1lID0gXCIvYXBpL2xlYWRzL3JvdXRlXCI7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHNlcnZlckhvb2tzLFxuICAgICAgICBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIG9yaWdpbmFsUGF0aG5hbWUsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fleads%2Froute&page=%2Fapi%2Fleads%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fleads%2Froute.ts&appDir=G%3A%5Cxmp%5Chtdocs%5Chtml%5Cswastik-crm%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=G%3A%5Cxmp%5Chtdocs%5Chtml%5Cswastik-crm&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./src/app/api/leads/route.ts":
/*!************************************!*\
  !*** ./src/app/api/leads/route.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET),\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next-auth */ \"(rsc)/./node_modules/next-auth/index.js\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _lib_auth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/auth */ \"(rsc)/./src/lib/auth.ts\");\n/* harmony import */ var _lib_mongodb__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/lib/mongodb */ \"(rsc)/./src/lib/mongodb.ts\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! uuid */ \"(rsc)/./node_modules/uuid/dist/esm-node/v4.js\");\n\n\n\n\n\n\nasync function GET(req) {\n    const session = await (0,next_auth__WEBPACK_IMPORTED_MODULE_1__.getServerSession)(_lib_auth__WEBPACK_IMPORTED_MODULE_2__.authOptions);\n    if (!session) return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        error: \"Unauthorized\"\n    }, {\n        status: 401\n    });\n    await (0,_lib_mongodb__WEBPACK_IMPORTED_MODULE_3__[\"default\"])();\n    const Lead = mongoose__WEBPACK_IMPORTED_MODULE_4___default().model(\"Lead\");\n    const { searchParams } = new URL(req.url);\n    const page = parseInt(searchParams.get(\"page\") || \"1\");\n    const limit = parseInt(searchParams.get(\"limit\") || \"20\");\n    const status = searchParams.get(\"status\");\n    const source = searchParams.get(\"source\");\n    const assigned = searchParams.get(\"assigned\");\n    const lost = searchParams.get(\"lost\");\n    const junk = searchParams.get(\"junk\");\n    const search = searchParams.get(\"search\") || \"\";\n    const query = {};\n    if (status) query.status = status;\n    if (source) query.source = source;\n    if (assigned) query.assigned = assigned;\n    if (lost !== null && lost !== \"\") query.lost = parseInt(lost);\n    if (junk !== null && junk !== \"\") query.junk = parseInt(junk);\n    if (search) query.$text = {\n        $search: search\n    };\n    const total = await Lead.countDocuments(query);\n    const leads = await Lead.find(query).sort({\n        dateadded: -1\n    }).skip((page - 1) * limit).limit(limit).populate(\"status\", \"name color\").populate(\"source\", \"name\").populate(\"assigned\", \"firstname lastname email profile_image\").populate(\"addedfrom\", \"firstname lastname\").lean();\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        data: leads,\n        pagination: {\n            total,\n            page,\n            limit,\n            pages: Math.ceil(total / limit)\n        }\n    });\n}\nasync function POST(req) {\n    const session = await (0,next_auth__WEBPACK_IMPORTED_MODULE_1__.getServerSession)(_lib_auth__WEBPACK_IMPORTED_MODULE_2__.authOptions);\n    if (!session) return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        error: \"Unauthorized\"\n    }, {\n        status: 401\n    });\n    await (0,_lib_mongodb__WEBPACK_IMPORTED_MODULE_3__[\"default\"])();\n    const Lead = mongoose__WEBPACK_IMPORTED_MODULE_4___default().model(\"Lead\");\n    const body = await req.json();\n    if (!body.name) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Lead name is required\"\n        }, {\n            status: 400\n        });\n    }\n    if (!body.status) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Lead status is required\"\n        }, {\n            status: 400\n        });\n    }\n    const lead = await Lead.create({\n        ...body,\n        hash: (0,uuid__WEBPACK_IMPORTED_MODULE_5__[\"default\"])().replace(/-/g, \"\"),\n        addedfrom: session.user.id,\n        dateadded: new Date(),\n        lost: 0,\n        junk: 0\n    });\n    const populated = await Lead.findById(lead._id).populate(\"status\", \"name color\").populate(\"source\", \"name\").populate(\"assigned\", \"firstname lastname\").lean();\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        data: populated,\n        message: \"Lead created successfully\"\n    }, {\n        status: 201\n    });\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QU87UUFBMEIsR0FBRztZQUFFQyxRQUFRO1FBQUk7SUFDL0U7SUFFQSxNQUFNbUMsT0FBTyxNQUFNbEMsS0FBS21DLE1BQU0sQ0FBQztRQUM3QixHQUFHSCxJQUFJO1FBQ1BJLE1BQU0zQyxnREFBTUEsR0FBRzRDLE9BQU8sQ0FBQyxNQUFNO1FBQzdCQyxXQUFXMUMsUUFBUTJDLElBQUksQ0FBQ0MsRUFBRTtRQUMxQmxCLFdBQVcsSUFBSW1CO1FBQ2Y5QixNQUFNO1FBQ05DLE1BQU07SUFDUjtJQUVBLE1BQU04QixZQUFZLE1BQU0xQyxLQUFLMkMsUUFBUSxDQUFDVCxLQUFLVSxHQUFHLEVBQzNDcEIsUUFBUSxDQUFDLFVBQVUsY0FDbkJBLFFBQVEsQ0FBQyxVQUFVLFFBQ25CQSxRQUFRLENBQUMsWUFBWSxzQkFDckJDLElBQUk7SUFFUCxPQUFPdEMscURBQVlBLENBQUNVLElBQUksQ0FDdEI7UUFBRTZCLE1BQU1nQjtRQUFXRyxTQUFTO0lBQTRCLEdBQ3hEO1FBQUU5QyxRQUFRO0lBQUk7QUFFbEIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zd2FzdGlrLWNybS8uL3NyYy9hcHAvYXBpL2xlYWRzL3JvdXRlLnRzPzVjZGEiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dFJlcXVlc3QsIE5leHRSZXNwb25zZSB9IGZyb20gJ25leHQvc2VydmVyJztcbmltcG9ydCB7IGdldFNlcnZlclNlc3Npb24gfSBmcm9tICduZXh0LWF1dGgnO1xuaW1wb3J0IHsgYXV0aE9wdGlvbnMgfSBmcm9tICdAL2xpYi9hdXRoJztcbmltcG9ydCBjb25uZWN0REIgZnJvbSAnQC9saWIvbW9uZ29kYic7XG5pbXBvcnQgbW9uZ29vc2UgZnJvbSAnbW9uZ29vc2UnO1xuaW1wb3J0IHsgdjQgYXMgdXVpZHY0IH0gZnJvbSAndXVpZCc7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBHRVQocmVxOiBOZXh0UmVxdWVzdCkge1xuICBjb25zdCBzZXNzaW9uID0gYXdhaXQgZ2V0U2VydmVyU2Vzc2lvbihhdXRoT3B0aW9ucyk7XG4gIGlmICghc2Vzc2lvbikgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6ICdVbmF1dGhvcml6ZWQnIH0sIHsgc3RhdHVzOiA0MDEgfSk7XG5cbiAgYXdhaXQgY29ubmVjdERCKCk7XG4gIGNvbnN0IExlYWQgPSBtb25nb29zZS5tb2RlbCgnTGVhZCcpO1xuXG4gIGNvbnN0IHsgc2VhcmNoUGFyYW1zIH0gPSBuZXcgVVJMKHJlcS51cmwpO1xuICBjb25zdCBwYWdlID0gcGFyc2VJbnQoc2VhcmNoUGFyYW1zLmdldCgncGFnZScpIHx8ICcxJyk7XG4gIGNvbnN0IGxpbWl0ID0gcGFyc2VJbnQoc2VhcmNoUGFyYW1zLmdldCgnbGltaXQnKSB8fCAnMjAnKTtcbiAgY29uc3Qgc3RhdHVzID0gc2VhcmNoUGFyYW1zLmdldCgnc3RhdHVzJyk7XG4gIGNvbnN0IHNvdXJjZSA9IHNlYXJjaFBhcmFtcy5nZXQoJ3NvdXJjZScpO1xuICBjb25zdCBhc3NpZ25lZCA9IHNlYXJjaFBhcmFtcy5nZXQoJ2Fzc2lnbmVkJyk7XG4gIGNvbnN0IGxvc3QgPSBzZWFyY2hQYXJhbXMuZ2V0KCdsb3N0Jyk7XG4gIGNvbnN0IGp1bmsgPSBzZWFyY2hQYXJhbXMuZ2V0KCdqdW5rJyk7XG4gIGNvbnN0IHNlYXJjaCA9IHNlYXJjaFBhcmFtcy5nZXQoJ3NlYXJjaCcpIHx8ICcnO1xuXG4gIGNvbnN0IHF1ZXJ5OiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiA9IHt9O1xuICBpZiAoc3RhdHVzKSBxdWVyeS5zdGF0dXMgPSBzdGF0dXM7XG4gIGlmIChzb3VyY2UpIHF1ZXJ5LnNvdXJjZSA9IHNvdXJjZTtcbiAgaWYgKGFzc2lnbmVkKSBxdWVyeS5hc3NpZ25lZCA9IGFzc2lnbmVkO1xuICBpZiAobG9zdCAhPT0gbnVsbCAmJiBsb3N0ICE9PSAnJykgcXVlcnkubG9zdCA9IHBhcnNlSW50KGxvc3QpO1xuICBpZiAoanVuayAhPT0gbnVsbCAmJiBqdW5rICE9PSAnJykgcXVlcnkuanVuayA9IHBhcnNlSW50KGp1bmspO1xuICBpZiAoc2VhcmNoKSBxdWVyeS4kdGV4dCA9IHsgJHNlYXJjaDogc2VhcmNoIH07XG5cbiAgY29uc3QgdG90YWwgPSBhd2FpdCBMZWFkLmNvdW50RG9jdW1lbnRzKHF1ZXJ5KTtcbiAgY29uc3QgbGVhZHMgPSBhd2FpdCBMZWFkLmZpbmQocXVlcnkpXG4gICAgLnNvcnQoeyBkYXRlYWRkZWQ6IC0xIH0pXG4gICAgLnNraXAoKHBhZ2UgLSAxKSAqIGxpbWl0KVxuICAgIC5saW1pdChsaW1pdClcbiAgICAucG9wdWxhdGUoJ3N0YXR1cycsICduYW1lIGNvbG9yJylcbiAgICAucG9wdWxhdGUoJ3NvdXJjZScsICduYW1lJylcbiAgICAucG9wdWxhdGUoJ2Fzc2lnbmVkJywgJ2ZpcnN0bmFtZSBsYXN0bmFtZSBlbWFpbCBwcm9maWxlX2ltYWdlJylcbiAgICAucG9wdWxhdGUoJ2FkZGVkZnJvbScsICdmaXJzdG5hbWUgbGFzdG5hbWUnKVxuICAgIC5sZWFuKCk7XG5cbiAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHtcbiAgICBkYXRhOiBsZWFkcyxcbiAgICBwYWdpbmF0aW9uOiB7IHRvdGFsLCBwYWdlLCBsaW1pdCwgcGFnZXM6IE1hdGguY2VpbCh0b3RhbCAvIGxpbWl0KSB9LFxuICB9KTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFBPU1QocmVxOiBOZXh0UmVxdWVzdCkge1xuICBjb25zdCBzZXNzaW9uID0gYXdhaXQgZ2V0U2VydmVyU2Vzc2lvbihhdXRoT3B0aW9ucyk7XG4gIGlmICghc2Vzc2lvbikgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6ICdVbmF1dGhvcml6ZWQnIH0sIHsgc3RhdHVzOiA0MDEgfSk7XG5cbiAgYXdhaXQgY29ubmVjdERCKCk7XG4gIGNvbnN0IExlYWQgPSBtb25nb29zZS5tb2RlbCgnTGVhZCcpO1xuXG4gIGNvbnN0IGJvZHkgPSBhd2FpdCByZXEuanNvbigpO1xuXG4gIGlmICghYm9keS5uYW1lKSB7XG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6ICdMZWFkIG5hbWUgaXMgcmVxdWlyZWQnIH0sIHsgc3RhdHVzOiA0MDAgfSk7XG4gIH1cbiAgaWYgKCFib2R5LnN0YXR1cykge1xuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiAnTGVhZCBzdGF0dXMgaXMgcmVxdWlyZWQnIH0sIHsgc3RhdHVzOiA0MDAgfSk7XG4gIH1cblxuICBjb25zdCBsZWFkID0gYXdhaXQgTGVhZC5jcmVhdGUoe1xuICAgIC4uLmJvZHksXG4gICAgaGFzaDogdXVpZHY0KCkucmVwbGFjZSgvLS9nLCAnJyksXG4gICAgYWRkZWRmcm9tOiBzZXNzaW9uLnVzZXIuaWQsXG4gICAgZGF0ZWFkZGVkOiBuZXcgRGF0ZSgpLFxuICAgIGxvc3Q6IDAsXG4gICAganVuazogMCxcbiAgfSk7XG5cbiAgY29uc3QgcG9wdWxhdGVkID0gYXdhaXQgTGVhZC5maW5kQnlJZChsZWFkLl9pZClcbiAgICAucG9wdWxhdGUoJ3N0YXR1cycsICduYW1lIGNvbG9yJylcbiAgICAucG9wdWxhdGUoJ3NvdXJjZScsICduYW1lJylcbiAgICAucG9wdWxhdGUoJ2Fzc2lnbmVkJywgJ2ZpcnN0bmFtZSBsYXN0bmFtZScpXG4gICAgLmxlYW4oKTtcblxuICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXG4gICAgeyBkYXRhOiBwb3B1bGF0ZWQsIG1lc3NhZ2U6ICdMZWFkIGNyZWF0ZWQgc3VjY2Vzc2Z1bGx5JyB9LFxuICAgIHsgc3RhdHVzOiAyMDEgfVxuICApO1xufVxuIl0sIm5hbWVzIjpbIk5leHRSZXNwb25zZSIsImdldFNlcnZlclNlc3Npb24iLCJhdXRoT3B0aW9ucyIsImNvbm5lY3REQiIsIm1vbmdvb3NlIiwidjQiLCJ1dWlkdjQiLCJHRVQiLCJyZXEiLCJzZXNzaW9uIiwianNvbiIsImVycm9yIiwic3RhdHVzIiwiTGVhZCIsIm1vZGVsIiwic2VhcmNoUGFyYW1zIiwiVVJMIiwidXJsIiwicGFnZSIsInBhcnNlSW50IiwiZ2V0IiwibGltaXQiLCJzb3VyY2UiLCJhc3NpZ25lZCIsImxvc3QiLCJqdW5rIiwic2VhcmNoIiwicXVlcnkiLCIkdGV4dCIsIiRzZWFyY2giLCJ0b3RhbCIsImNvdW50RG9jdW1lbnRzIiwibGVhZHMiLCJmaW5kIiwic29ydCIsImRhdGVhZGRlZCIsInNraXAiLCJwb3B1bGF0ZSIsImxlYW4iLCJkYXRhIiwicGFnaW5hdGlvbiIsInBhZ2VzIiwiTWF0aCIsImNlaWwiLCJQT1NUIiwiYm9keSIsIm5hbWUiLCJsZWFkIiwiY3JlYXRlIiwiaGFzaCIsInJlcGxhY2UiLCJhZGRlZGZyb20iLCJ1c2VyIiwiaWQiLCJEYXRlIiwicG9wdWxhdGVkIiwiZmluZEJ5SWQiLCJfaWQiLCJtZXNzYWdlIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./src/app/api/leads/route.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/auth.ts":
/*!*************************!*\
  !*** ./src/lib/auth.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   authOptions: () => (/* binding */ authOptions)\n/* harmony export */ });\n/* harmony import */ var next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth/providers/credentials */ \"(rsc)/./node_modules/next-auth/providers/credentials.js\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! bcryptjs */ \"(rsc)/./node_modules/bcryptjs/index.js\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(bcryptjs__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _mongodb__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./mongodb */ \"(rsc)/./src/lib/mongodb.ts\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_3__);\n\n\n\n\nconst authOptions = {\n    session: {\n        strategy: \"jwt\",\n        maxAge: 30 * 24 * 60 * 60\n    },\n    pages: {\n        signIn: \"/login\",\n        error: \"/login\"\n    },\n    providers: [\n        (0,next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_0__[\"default\"])({\n            name: \"credentials\",\n            credentials: {\n                email: {\n                    label: \"Email\",\n                    type: \"email\"\n                },\n                password: {\n                    label: \"Password\",\n                    type: \"password\"\n                }\n            },\n            async authorize (credentials) {\n                if (!credentials?.email || !credentials?.password) {\n                    throw new Error(\"Email and password required\");\n                }\n                await (0,_mongodb__WEBPACK_IMPORTED_MODULE_2__[\"default\"])();\n                const Staff = mongoose__WEBPACK_IMPORTED_MODULE_3___default().model(\"Staff\");\n                const staff = await Staff.findOne({\n                    email: credentials.email.toLowerCase(),\n                    active: 1\n                }).select(\"+password\");\n                if (!staff) {\n                    throw new Error(\"Invalid email or password\");\n                }\n                const isPasswordValid = await bcryptjs__WEBPACK_IMPORTED_MODULE_1___default().compare(credentials.password, staff.password);\n                if (!isPasswordValid) {\n                    throw new Error(\"Invalid email or password\");\n                }\n                // Update last login\n                await Staff.findByIdAndUpdate(staff._id, {\n                    last_login: new Date(),\n                    last_ip: \"127.0.0.1\"\n                });\n                return {\n                    id: staff._id.toString(),\n                    email: staff.email,\n                    name: `${staff.firstname} ${staff.lastname}`,\n                    isAdmin: staff.isadmin === 1 || staff.admin === 1,\n                    role: staff.role,\n                    image: staff.profile_image\n                };\n            }\n        })\n    ],\n    callbacks: {\n        async jwt ({ token, user }) {\n            if (user) {\n                token.id = user.id;\n                token.isAdmin = user.isAdmin;\n                token.role = user.role;\n            }\n            return token;\n        },\n        async session ({ session, token }) {\n            if (token) {\n                session.user.id = token.id;\n                session.user.isAdmin = token.isAdmin;\n                session.user.role = token.role;\n            }\n            return session;\n        }\n    }\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbGliL2F1dGgudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUNrRTtBQUNwQztBQUNJO0FBQ0Y7QUFFekIsTUFBTUksY0FBK0I7SUFDMUNDLFNBQVM7UUFDUEMsVUFBVTtRQUNWQyxRQUFRLEtBQUssS0FBSyxLQUFLO0lBQ3pCO0lBQ0FDLE9BQU87UUFDTEMsUUFBUTtRQUNSQyxPQUFPO0lBQ1Q7SUFDQUMsV0FBVztRQUNUWCwyRUFBbUJBLENBQUM7WUFDbEJZLE1BQU07WUFDTkMsYUFBYTtnQkFDWEMsT0FBTztvQkFBRUMsT0FBTztvQkFBU0MsTUFBTTtnQkFBUTtnQkFDdkNDLFVBQVU7b0JBQUVGLE9BQU87b0JBQVlDLE1BQU07Z0JBQVc7WUFDbEQ7WUFDQSxNQUFNRSxXQUFVTCxXQUFXO2dCQUN6QixJQUFJLENBQUNBLGFBQWFDLFNBQVMsQ0FBQ0QsYUFBYUksVUFBVTtvQkFDakQsTUFBTSxJQUFJRSxNQUFNO2dCQUNsQjtnQkFFQSxNQUFNakIsb0RBQVNBO2dCQUNmLE1BQU1rQixRQUFRakIscURBQWMsQ0FBQztnQkFFN0IsTUFBTW1CLFFBQVEsTUFBTUYsTUFBTUcsT0FBTyxDQUFDO29CQUNoQ1QsT0FBT0QsWUFBWUMsS0FBSyxDQUFDVSxXQUFXO29CQUNwQ0MsUUFBUTtnQkFDVixHQUFHQyxNQUFNLENBQUM7Z0JBRVYsSUFBSSxDQUFDSixPQUFPO29CQUNWLE1BQU0sSUFBSUgsTUFBTTtnQkFDbEI7Z0JBRUEsTUFBTVEsa0JBQWtCLE1BQU0xQix1REFBYyxDQUFDWSxZQUFZSSxRQUFRLEVBQUVLLE1BQU1MLFFBQVE7Z0JBRWpGLElBQUksQ0FBQ1UsaUJBQWlCO29CQUNwQixNQUFNLElBQUlSLE1BQU07Z0JBQ2xCO2dCQUVBLG9CQUFvQjtnQkFDcEIsTUFBTUMsTUFBTVMsaUJBQWlCLENBQUNQLE1BQU1RLEdBQUcsRUFBRTtvQkFDdkNDLFlBQVksSUFBSUM7b0JBQ2hCQyxTQUFTO2dCQUNYO2dCQUVBLE9BQU87b0JBQ0xDLElBQUlaLE1BQU1RLEdBQUcsQ0FBQ0ssUUFBUTtvQkFDdEJyQixPQUFPUSxNQUFNUixLQUFLO29CQUNsQkYsTUFBTSxDQUFDLEVBQUVVLE1BQU1jLFNBQVMsQ0FBQyxDQUFDLEVBQUVkLE1BQU1lLFFBQVEsQ0FBQyxDQUFDO29CQUM1Q0MsU0FBU2hCLE1BQU1pQixPQUFPLEtBQUssS0FBS2pCLE1BQU1rQixLQUFLLEtBQUs7b0JBQ2hEQyxNQUFNbkIsTUFBTW1CLElBQUk7b0JBQ2hCQyxPQUFPcEIsTUFBTXFCLGFBQWE7Z0JBQzVCO1lBQ0Y7UUFDRjtLQUNEO0lBQ0RDLFdBQVc7UUFDVCxNQUFNQyxLQUFJLEVBQUVDLEtBQUssRUFBRUMsSUFBSSxFQUFFO1lBQ3ZCLElBQUlBLE1BQU07Z0JBQ1JELE1BQU1aLEVBQUUsR0FBR2EsS0FBS2IsRUFBRTtnQkFDbEJZLE1BQU1SLE9BQU8sR0FBRyxLQUFnQ0EsT0FBTztnQkFDdkRRLE1BQU1MLElBQUksR0FBRyxLQUE0QkEsSUFBSTtZQUMvQztZQUNBLE9BQU9LO1FBQ1Q7UUFDQSxNQUFNekMsU0FBUSxFQUFFQSxPQUFPLEVBQUV5QyxLQUFLLEVBQUU7WUFDOUIsSUFBSUEsT0FBTztnQkFDVHpDLFFBQVEwQyxJQUFJLENBQUNiLEVBQUUsR0FBR1ksTUFBTVosRUFBRTtnQkFDekI3QixRQUFRMEMsSUFBSSxDQUEyQlQsT0FBTyxHQUFHUSxNQUFNUixPQUFPO2dCQUM5RGpDLFFBQVEwQyxJQUFJLENBQXVCTixJQUFJLEdBQUdLLE1BQU1MLElBQUk7WUFDdkQ7WUFDQSxPQUFPcEM7UUFDVDtJQUNGO0FBQ0YsRUFBRSIsInNvdXJjZXMiOlsid2VicGFjazovL3N3YXN0aWstY3JtLy4vc3JjL2xpYi9hdXRoLnRzPzY2OTIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dEF1dGhPcHRpb25zIH0gZnJvbSAnbmV4dC1hdXRoJztcbmltcG9ydCBDcmVkZW50aWFsc1Byb3ZpZGVyIGZyb20gJ25leHQtYXV0aC9wcm92aWRlcnMvY3JlZGVudGlhbHMnO1xuaW1wb3J0IGJjcnlwdCBmcm9tICdiY3J5cHRqcyc7XG5pbXBvcnQgY29ubmVjdERCIGZyb20gJy4vbW9uZ29kYic7XG5pbXBvcnQgbW9uZ29vc2UgZnJvbSAnbW9uZ29vc2UnO1xuXG5leHBvcnQgY29uc3QgYXV0aE9wdGlvbnM6IE5leHRBdXRoT3B0aW9ucyA9IHtcbiAgc2Vzc2lvbjoge1xuICAgIHN0cmF0ZWd5OiAnand0JyxcbiAgICBtYXhBZ2U6IDMwICogMjQgKiA2MCAqIDYwLCAvLyAzMCBkYXlzXG4gIH0sXG4gIHBhZ2VzOiB7XG4gICAgc2lnbkluOiAnL2xvZ2luJyxcbiAgICBlcnJvcjogJy9sb2dpbicsXG4gIH0sXG4gIHByb3ZpZGVyczogW1xuICAgIENyZWRlbnRpYWxzUHJvdmlkZXIoe1xuICAgICAgbmFtZTogJ2NyZWRlbnRpYWxzJyxcbiAgICAgIGNyZWRlbnRpYWxzOiB7XG4gICAgICAgIGVtYWlsOiB7IGxhYmVsOiAnRW1haWwnLCB0eXBlOiAnZW1haWwnIH0sXG4gICAgICAgIHBhc3N3b3JkOiB7IGxhYmVsOiAnUGFzc3dvcmQnLCB0eXBlOiAncGFzc3dvcmQnIH0sXG4gICAgICB9LFxuICAgICAgYXN5bmMgYXV0aG9yaXplKGNyZWRlbnRpYWxzKSB7XG4gICAgICAgIGlmICghY3JlZGVudGlhbHM/LmVtYWlsIHx8ICFjcmVkZW50aWFscz8ucGFzc3dvcmQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0VtYWlsIGFuZCBwYXNzd29yZCByZXF1aXJlZCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgYXdhaXQgY29ubmVjdERCKCk7XG4gICAgICAgIGNvbnN0IFN0YWZmID0gbW9uZ29vc2UubW9kZWwoJ1N0YWZmJyk7XG5cbiAgICAgICAgY29uc3Qgc3RhZmYgPSBhd2FpdCBTdGFmZi5maW5kT25lKHtcbiAgICAgICAgICBlbWFpbDogY3JlZGVudGlhbHMuZW1haWwudG9Mb3dlckNhc2UoKSxcbiAgICAgICAgICBhY3RpdmU6IDEsXG4gICAgICAgIH0pLnNlbGVjdCgnK3Bhc3N3b3JkJyk7XG5cbiAgICAgICAgaWYgKCFzdGFmZikge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBlbWFpbCBvciBwYXNzd29yZCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaXNQYXNzd29yZFZhbGlkID0gYXdhaXQgYmNyeXB0LmNvbXBhcmUoY3JlZGVudGlhbHMucGFzc3dvcmQsIHN0YWZmLnBhc3N3b3JkKTtcblxuICAgICAgICBpZiAoIWlzUGFzc3dvcmRWYWxpZCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBlbWFpbCBvciBwYXNzd29yZCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVXBkYXRlIGxhc3QgbG9naW5cbiAgICAgICAgYXdhaXQgU3RhZmYuZmluZEJ5SWRBbmRVcGRhdGUoc3RhZmYuX2lkLCB7XG4gICAgICAgICAgbGFzdF9sb2dpbjogbmV3IERhdGUoKSxcbiAgICAgICAgICBsYXN0X2lwOiAnMTI3LjAuMC4xJyxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBpZDogc3RhZmYuX2lkLnRvU3RyaW5nKCksXG4gICAgICAgICAgZW1haWw6IHN0YWZmLmVtYWlsLFxuICAgICAgICAgIG5hbWU6IGAke3N0YWZmLmZpcnN0bmFtZX0gJHtzdGFmZi5sYXN0bmFtZX1gLFxuICAgICAgICAgIGlzQWRtaW46IHN0YWZmLmlzYWRtaW4gPT09IDEgfHwgc3RhZmYuYWRtaW4gPT09IDEsXG4gICAgICAgICAgcm9sZTogc3RhZmYucm9sZSxcbiAgICAgICAgICBpbWFnZTogc3RhZmYucHJvZmlsZV9pbWFnZSxcbiAgICAgICAgfTtcbiAgICAgIH0sXG4gICAgfSksXG4gIF0sXG4gIGNhbGxiYWNrczoge1xuICAgIGFzeW5jIGp3dCh7IHRva2VuLCB1c2VyIH0pIHtcbiAgICAgIGlmICh1c2VyKSB7XG4gICAgICAgIHRva2VuLmlkID0gdXNlci5pZDtcbiAgICAgICAgdG9rZW4uaXNBZG1pbiA9ICh1c2VyIGFzIHsgaXNBZG1pbj86IGJvb2xlYW4gfSkuaXNBZG1pbjtcbiAgICAgICAgdG9rZW4ucm9sZSA9ICh1c2VyIGFzIHsgcm9sZT86IHN0cmluZyB9KS5yb2xlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRva2VuO1xuICAgIH0sXG4gICAgYXN5bmMgc2Vzc2lvbih7IHNlc3Npb24sIHRva2VuIH0pIHtcbiAgICAgIGlmICh0b2tlbikge1xuICAgICAgICBzZXNzaW9uLnVzZXIuaWQgPSB0b2tlbi5pZCBhcyBzdHJpbmc7XG4gICAgICAgIChzZXNzaW9uLnVzZXIgYXMgeyBpc0FkbWluPzogYm9vbGVhbiB9KS5pc0FkbWluID0gdG9rZW4uaXNBZG1pbiBhcyBib29sZWFuO1xuICAgICAgICAoc2Vzc2lvbi51c2VyIGFzIHsgcm9sZT86IHN0cmluZyB9KS5yb2xlID0gdG9rZW4ucm9sZSBhcyBzdHJpbmc7XG4gICAgICB9XG4gICAgICByZXR1cm4gc2Vzc2lvbjtcbiAgICB9LFxuICB9LFxufTtcbiJdLCJuYW1lcyI6WyJDcmVkZW50aWFsc1Byb3ZpZGVyIiwiYmNyeXB0IiwiY29ubmVjdERCIiwibW9uZ29vc2UiLCJhdXRoT3B0aW9ucyIsInNlc3Npb24iLCJzdHJhdGVneSIsIm1heEFnZSIsInBhZ2VzIiwic2lnbkluIiwiZXJyb3IiLCJwcm92aWRlcnMiLCJuYW1lIiwiY3JlZGVudGlhbHMiLCJlbWFpbCIsImxhYmVsIiwidHlwZSIsInBhc3N3b3JkIiwiYXV0aG9yaXplIiwiRXJyb3IiLCJTdGFmZiIsIm1vZGVsIiwic3RhZmYiLCJmaW5kT25lIiwidG9Mb3dlckNhc2UiLCJhY3RpdmUiLCJzZWxlY3QiLCJpc1Bhc3N3b3JkVmFsaWQiLCJjb21wYXJlIiwiZmluZEJ5SWRBbmRVcGRhdGUiLCJfaWQiLCJsYXN0X2xvZ2luIiwiRGF0ZSIsImxhc3RfaXAiLCJpZCIsInRvU3RyaW5nIiwiZmlyc3RuYW1lIiwibGFzdG5hbWUiLCJpc0FkbWluIiwiaXNhZG1pbiIsImFkbWluIiwicm9sZSIsImltYWdlIiwicHJvZmlsZV9pbWFnZSIsImNhbGxiYWNrcyIsImp3dCIsInRva2VuIiwidXNlciJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/auth.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/mongodb.ts":
/*!****************************!*\
  !*** ./src/lib/mongodb.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);\n\nconst MONGODB_URI = process.env.MONGODB_URI;\nif (!MONGODB_URI) {\n    throw new Error(\"Please define the MONGODB_URI environment variable in .env.local\");\n}\nconst cached = global.mongoose || {\n    conn: null,\n    promise: null\n};\nif (!global.mongoose) {\n    global.mongoose = cached;\n}\nasync function connectDB() {\n    if (cached.conn) {\n        return cached.conn;\n    }\n    if (!cached.promise) {\n        const opts = {\n            bufferCommands: false,\n            maxPoolSize: 10,\n            serverSelectionTimeoutMS: 5000,\n            socketTimeoutMS: 45000\n        };\n        cached.promise = mongoose__WEBPACK_IMPORTED_MODULE_0___default().connect(MONGODB_URI, opts).then((mongoose)=>{\n            console.log(\"✅ MongoDB connected successfully\");\n            return mongoose;\n        });\n    }\n    try {\n        cached.conn = await cached.promise;\n    } catch (e) {\n        cached.promise = null;\n        throw e;\n    }\n    return cached.conn;\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (connectDB);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbGliL21vbmdvZGIudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQWdDO0FBRWhDLE1BQU1DLGNBQWNDLFFBQVFDLEdBQUcsQ0FBQ0YsV0FBVztBQUUzQyxJQUFJLENBQUNBLGFBQWE7SUFDaEIsTUFBTSxJQUFJRyxNQUFNO0FBQ2xCO0FBWUEsTUFBTUMsU0FBd0JDLE9BQU9OLFFBQVEsSUFBSTtJQUFFTyxNQUFNO0lBQU1DLFNBQVM7QUFBSztBQUU3RSxJQUFJLENBQUNGLE9BQU9OLFFBQVEsRUFBRTtJQUNwQk0sT0FBT04sUUFBUSxHQUFHSztBQUNwQjtBQUVBLGVBQWVJO0lBQ2IsSUFBSUosT0FBT0UsSUFBSSxFQUFFO1FBQ2YsT0FBT0YsT0FBT0UsSUFBSTtJQUNwQjtJQUVBLElBQUksQ0FBQ0YsT0FBT0csT0FBTyxFQUFFO1FBQ25CLE1BQU1FLE9BQU87WUFDWEMsZ0JBQWdCO1lBQ2hCQyxhQUFhO1lBQ2JDLDBCQUEwQjtZQUMxQkMsaUJBQWlCO1FBQ25CO1FBRUFULE9BQU9HLE9BQU8sR0FBR1IsdURBQWdCLENBQUNDLGFBQWFTLE1BQU1NLElBQUksQ0FBQyxDQUFDaEI7WUFDekRpQixRQUFRQyxHQUFHLENBQUM7WUFDWixPQUFPbEI7UUFDVDtJQUNGO0lBRUEsSUFBSTtRQUNGSyxPQUFPRSxJQUFJLEdBQUcsTUFBTUYsT0FBT0csT0FBTztJQUNwQyxFQUFFLE9BQU9XLEdBQUc7UUFDVmQsT0FBT0csT0FBTyxHQUFHO1FBQ2pCLE1BQU1XO0lBQ1I7SUFFQSxPQUFPZCxPQUFPRSxJQUFJO0FBQ3BCO0FBRUEsaUVBQWVFLFNBQVNBLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zd2FzdGlrLWNybS8uL3NyYy9saWIvbW9uZ29kYi50cz81M2MyIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtb25nb29zZSBmcm9tICdtb25nb29zZSc7XG5cbmNvbnN0IE1PTkdPREJfVVJJID0gcHJvY2Vzcy5lbnYuTU9OR09EQl9VUkkhO1xuXG5pZiAoIU1PTkdPREJfVVJJKSB7XG4gIHRocm93IG5ldyBFcnJvcignUGxlYXNlIGRlZmluZSB0aGUgTU9OR09EQl9VUkkgZW52aXJvbm1lbnQgdmFyaWFibGUgaW4gLmVudi5sb2NhbCcpO1xufVxuXG5pbnRlcmZhY2UgTW9uZ29vc2VDYWNoZSB7XG4gIGNvbm46IHR5cGVvZiBtb25nb29zZSB8IG51bGw7XG4gIHByb21pc2U6IFByb21pc2U8dHlwZW9mIG1vbmdvb3NlPiB8IG51bGw7XG59XG5cbmRlY2xhcmUgZ2xvYmFsIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXZhclxuICB2YXIgbW9uZ29vc2U6IE1vbmdvb3NlQ2FjaGUgfCB1bmRlZmluZWQ7XG59XG5cbmNvbnN0IGNhY2hlZDogTW9uZ29vc2VDYWNoZSA9IGdsb2JhbC5tb25nb29zZSB8fCB7IGNvbm46IG51bGwsIHByb21pc2U6IG51bGwgfTtcblxuaWYgKCFnbG9iYWwubW9uZ29vc2UpIHtcbiAgZ2xvYmFsLm1vbmdvb3NlID0gY2FjaGVkO1xufVxuXG5hc3luYyBmdW5jdGlvbiBjb25uZWN0REIoKTogUHJvbWlzZTx0eXBlb2YgbW9uZ29vc2U+IHtcbiAgaWYgKGNhY2hlZC5jb25uKSB7XG4gICAgcmV0dXJuIGNhY2hlZC5jb25uO1xuICB9XG5cbiAgaWYgKCFjYWNoZWQucHJvbWlzZSkge1xuICAgIGNvbnN0IG9wdHMgPSB7XG4gICAgICBidWZmZXJDb21tYW5kczogZmFsc2UsXG4gICAgICBtYXhQb29sU2l6ZTogMTAsXG4gICAgICBzZXJ2ZXJTZWxlY3Rpb25UaW1lb3V0TVM6IDUwMDAsXG4gICAgICBzb2NrZXRUaW1lb3V0TVM6IDQ1MDAwLFxuICAgIH07XG5cbiAgICBjYWNoZWQucHJvbWlzZSA9IG1vbmdvb3NlLmNvbm5lY3QoTU9OR09EQl9VUkksIG9wdHMpLnRoZW4oKG1vbmdvb3NlKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZygn4pyFIE1vbmdvREIgY29ubmVjdGVkIHN1Y2Nlc3NmdWxseScpO1xuICAgICAgcmV0dXJuIG1vbmdvb3NlO1xuICAgIH0pO1xuICB9XG5cbiAgdHJ5IHtcbiAgICBjYWNoZWQuY29ubiA9IGF3YWl0IGNhY2hlZC5wcm9taXNlO1xuICB9IGNhdGNoIChlKSB7XG4gICAgY2FjaGVkLnByb21pc2UgPSBudWxsO1xuICAgIHRocm93IGU7XG4gIH1cblxuICByZXR1cm4gY2FjaGVkLmNvbm47XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3REQjtcbiJdLCJuYW1lcyI6WyJtb25nb29zZSIsIk1PTkdPREJfVVJJIiwicHJvY2VzcyIsImVudiIsIkVycm9yIiwiY2FjaGVkIiwiZ2xvYmFsIiwiY29ubiIsInByb21pc2UiLCJjb25uZWN0REIiLCJvcHRzIiwiYnVmZmVyQ29tbWFuZHMiLCJtYXhQb29sU2l6ZSIsInNlcnZlclNlbGVjdGlvblRpbWVvdXRNUyIsInNvY2tldFRpbWVvdXRNUyIsImNvbm5lY3QiLCJ0aGVuIiwiY29uc29sZSIsImxvZyIsImUiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/mongodb.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/next-auth","vendor-chunks/bcryptjs","vendor-chunks/@babel","vendor-chunks/openid-client","vendor-chunks/oauth","vendor-chunks/object-hash","vendor-chunks/preact","vendor-chunks/yallist","vendor-chunks/lru-cache","vendor-chunks/cookie","vendor-chunks/oidc-token-hash","vendor-chunks/@panva","vendor-chunks/uuid"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fleads%2Froute&page=%2Fapi%2Fleads%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fleads%2Froute.ts&appDir=G%3A%5Cxmp%5Chtdocs%5Chtml%5Cswastik-crm%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=G%3A%5Cxmp%5Chtdocs%5Chtml%5Cswastik-crm&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();