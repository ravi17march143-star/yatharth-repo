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
exports.id = "app/api/estimates/route";
exports.ids = ["app/api/estimates/route"];
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

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Festimates%2Froute&page=%2Fapi%2Festimates%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Festimates%2Froute.ts&appDir=G%3A%5Cxmp%5Chtdocs%5Chtml%5Cswastik-crm%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=G%3A%5Cxmp%5Chtdocs%5Chtml%5Cswastik-crm&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Festimates%2Froute&page=%2Fapi%2Festimates%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Festimates%2Froute.ts&appDir=G%3A%5Cxmp%5Chtdocs%5Chtml%5Cswastik-crm%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=G%3A%5Cxmp%5Chtdocs%5Chtml%5Cswastik-crm&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var G_xmp_htdocs_html_swastik_crm_src_app_api_estimates_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/app/api/estimates/route.ts */ \"(rsc)/./src/app/api/estimates/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/estimates/route\",\n        pathname: \"/api/estimates\",\n        filename: \"route\",\n        bundlePath: \"app/api/estimates/route\"\n    },\n    resolvedPagePath: \"G:\\\\xmp\\\\htdocs\\\\html\\\\swastik-crm\\\\src\\\\app\\\\api\\\\estimates\\\\route.ts\",\n    nextConfigOutput,\n    userland: G_xmp_htdocs_html_swastik_crm_src_app_api_estimates_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/estimates/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZlc3RpbWF0ZXMlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRmVzdGltYXRlcyUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRmVzdGltYXRlcyUyRnJvdXRlLnRzJmFwcERpcj1HJTNBJTVDeG1wJTVDaHRkb2NzJTVDaHRtbCU1Q3N3YXN0aWstY3JtJTVDc3JjJTVDYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj1HJTNBJTVDeG1wJTVDaHRkb2NzJTVDaHRtbCU1Q3N3YXN0aWstY3JtJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBc0c7QUFDdkM7QUFDYztBQUNzQjtBQUNuRztBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsZ0hBQW1CO0FBQzNDO0FBQ0EsY0FBYyx5RUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLGlFQUFpRTtBQUN6RTtBQUNBO0FBQ0EsV0FBVyw0RUFBVztBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ3VIOztBQUV2SCIsInNvdXJjZXMiOlsid2VicGFjazovL3N3YXN0aWstY3JtLz8xNmZlIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIkc6XFxcXHhtcFxcXFxodGRvY3NcXFxcaHRtbFxcXFxzd2FzdGlrLWNybVxcXFxzcmNcXFxcYXBwXFxcXGFwaVxcXFxlc3RpbWF0ZXNcXFxccm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL2VzdGltYXRlcy9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL2VzdGltYXRlc1wiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvZXN0aW1hdGVzL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiRzpcXFxceG1wXFxcXGh0ZG9jc1xcXFxodG1sXFxcXHN3YXN0aWstY3JtXFxcXHNyY1xcXFxhcHBcXFxcYXBpXFxcXGVzdGltYXRlc1xcXFxyb3V0ZS50c1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHJlcXVlc3RBc3luY1N0b3JhZ2UsIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmNvbnN0IG9yaWdpbmFsUGF0aG5hbWUgPSBcIi9hcGkvZXN0aW1hdGVzL3JvdXRlXCI7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHNlcnZlckhvb2tzLFxuICAgICAgICBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIG9yaWdpbmFsUGF0aG5hbWUsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Festimates%2Froute&page=%2Fapi%2Festimates%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Festimates%2Froute.ts&appDir=G%3A%5Cxmp%5Chtdocs%5Chtml%5Cswastik-crm%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=G%3A%5Cxmp%5Chtdocs%5Chtml%5Cswastik-crm&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./src/app/api/estimates/route.ts":
/*!****************************************!*\
  !*** ./src/app/api/estimates/route.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET),\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next-auth */ \"(rsc)/./node_modules/next-auth/index.js\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _lib_auth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/auth */ \"(rsc)/./src/lib/auth.ts\");\n/* harmony import */ var _lib_mongodb__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/lib/mongodb */ \"(rsc)/./src/lib/mongodb.ts\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! uuid */ \"(rsc)/./node_modules/uuid/dist/esm-node/v4.js\");\n\n\n\n\n\n\nasync function GET(req) {\n    const session = await (0,next_auth__WEBPACK_IMPORTED_MODULE_1__.getServerSession)(_lib_auth__WEBPACK_IMPORTED_MODULE_2__.authOptions);\n    if (!session) return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        error: \"Unauthorized\"\n    }, {\n        status: 401\n    });\n    await (0,_lib_mongodb__WEBPACK_IMPORTED_MODULE_3__[\"default\"])();\n    const Estimate = mongoose__WEBPACK_IMPORTED_MODULE_4___default().model(\"Estimate\");\n    const { searchParams } = new URL(req.url);\n    const page = parseInt(searchParams.get(\"page\") || \"1\");\n    const limit = parseInt(searchParams.get(\"limit\") || \"20\");\n    const status = searchParams.get(\"status\");\n    const client = searchParams.get(\"client\");\n    const query = {};\n    if (status) query.status = parseInt(status);\n    if (client) query.client = client;\n    const total = await Estimate.countDocuments(query);\n    const estimates = await Estimate.find(query).sort({\n        date: -1\n    }).skip((page - 1) * limit).limit(limit).populate(\"client\", \"company\").populate(\"sale_agent\", \"firstname lastname\").lean();\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        data: estimates,\n        pagination: {\n            total,\n            page,\n            limit,\n            pages: Math.ceil(total / limit)\n        }\n    });\n}\nasync function POST(req) {\n    const session = await (0,next_auth__WEBPACK_IMPORTED_MODULE_1__.getServerSession)(_lib_auth__WEBPACK_IMPORTED_MODULE_2__.authOptions);\n    if (!session) return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        error: \"Unauthorized\"\n    }, {\n        status: 401\n    });\n    await (0,_lib_mongodb__WEBPACK_IMPORTED_MODULE_3__[\"default\"])();\n    const Estimate = mongoose__WEBPACK_IMPORTED_MODULE_4___default().model(\"Estimate\");\n    const Settings = mongoose__WEBPACK_IMPORTED_MODULE_4___default().model(\"Settings\");\n    const body = await req.json();\n    if (!body.client) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Client is required\"\n        }, {\n            status: 400\n        });\n    }\n    // Get next estimate number\n    const prefixSetting = await Settings.findOne({\n        key: \"estimate_prefix\"\n    });\n    const prefix = prefixSetting?.value || \"EST\";\n    const lastEstimate = await Estimate.findOne().sort({\n        number: -1\n    }).select(\"number\");\n    const number = (lastEstimate?.number || 0) + 1;\n    // Calculate totals\n    let subtotal = 0;\n    let total_tax = 0;\n    for (const item of body.items || []){\n        const itemTotal = item.qty * item.rate;\n        subtotal += itemTotal;\n        for (const rate of item.taxrate || []){\n            total_tax += itemTotal * rate / 100;\n        }\n    }\n    const discountAmount = body.discount_type === \"percent\" ? subtotal * (body.discount_percent || 0) / 100 : body.discount_total || 0;\n    const total = subtotal - discountAmount + total_tax + (body.adjustment || 0);\n    const estimate = await Estimate.create({\n        ...body,\n        number,\n        prefix,\n        subtotal,\n        total_tax,\n        total,\n        discount_total: discountAmount,\n        hash: (0,uuid__WEBPACK_IMPORTED_MODULE_5__[\"default\"])().replace(/-/g, \"\"),\n        date: body.date || new Date(),\n        addedfrom: session.user.id,\n        status: body.status || 1\n    });\n    const populated = await Estimate.findById(estimate._id).populate(\"client\", \"company\").lean();\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        data: populated,\n        message: \"Estimate created successfully\"\n    }, {\n        status: 201\n    });\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFFO1lBQ3JDTixhQUFhLFlBQWFLLE9BQVE7UUFDcEM7SUFDRjtJQUVBLE1BQU1FLGlCQUNKakIsS0FBS2tCLGFBQWEsS0FBSyxZQUNuQixXQUFhbEIsQ0FBQUEsS0FBS21CLGdCQUFnQixJQUFJLEtBQU0sTUFDNUNuQixLQUFLb0IsY0FBYyxJQUFJO0lBRTdCLE1BQU1wQyxRQUFReUIsV0FBV1EsaUJBQWlCUCxZQUFhVixDQUFBQSxLQUFLcUIsVUFBVSxJQUFJO0lBRTFFLE1BQU1DLFdBQVcsTUFBTWpELFNBQVNrRCxNQUFNLENBQUM7UUFDckMsR0FBR3ZCLElBQUk7UUFDUE87UUFDQUg7UUFDQUs7UUFDQUM7UUFDQTFCO1FBQ0FvQyxnQkFBZ0JIO1FBQ2hCTyxNQUFNMUQsZ0RBQU1BLEdBQUcyRCxPQUFPLENBQUMsTUFBTTtRQUM3QnBDLE1BQU1XLEtBQUtYLElBQUksSUFBSSxJQUFJcUM7UUFDdkJDLFdBQVcxRCxRQUFRMkQsSUFBSSxDQUFDQyxFQUFFO1FBQzFCekQsUUFBUTRCLEtBQUs1QixNQUFNLElBQUk7SUFDekI7SUFFQSxNQUFNMEQsWUFBWSxNQUFNekQsU0FBUzBELFFBQVEsQ0FBQ1QsU0FBU1UsR0FBRyxFQUNuRHpDLFFBQVEsQ0FBQyxVQUFVLFdBQ25CQyxJQUFJO0lBRVAsT0FBT2hDLHFEQUFZQSxDQUFDVSxJQUFJLENBQ3RCO1FBQUV1QixNQUFNcUM7UUFBV0csU0FBUztJQUFnQyxHQUM1RDtRQUFFN0QsUUFBUTtJQUFJO0FBRWxCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc3dhc3Rpay1jcm0vLi9zcmMvYXBwL2FwaS9lc3RpbWF0ZXMvcm91dGUudHM/ZDU0OCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0UmVxdWVzdCwgTmV4dFJlc3BvbnNlIH0gZnJvbSAnbmV4dC9zZXJ2ZXInO1xuaW1wb3J0IHsgZ2V0U2VydmVyU2Vzc2lvbiB9IGZyb20gJ25leHQtYXV0aCc7XG5pbXBvcnQgeyBhdXRoT3B0aW9ucyB9IGZyb20gJ0AvbGliL2F1dGgnO1xuaW1wb3J0IGNvbm5lY3REQiBmcm9tICdAL2xpYi9tb25nb2RiJztcbmltcG9ydCBtb25nb29zZSBmcm9tICdtb25nb29zZSc7XG5pbXBvcnQgeyB2NCBhcyB1dWlkdjQgfSBmcm9tICd1dWlkJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEdFVChyZXE6IE5leHRSZXF1ZXN0KSB7XG4gIGNvbnN0IHNlc3Npb24gPSBhd2FpdCBnZXRTZXJ2ZXJTZXNzaW9uKGF1dGhPcHRpb25zKTtcbiAgaWYgKCFzZXNzaW9uKSByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogJ1VuYXV0aG9yaXplZCcgfSwgeyBzdGF0dXM6IDQwMSB9KTtcblxuICBhd2FpdCBjb25uZWN0REIoKTtcbiAgY29uc3QgRXN0aW1hdGUgPSBtb25nb29zZS5tb2RlbCgnRXN0aW1hdGUnKTtcblxuICBjb25zdCB7IHNlYXJjaFBhcmFtcyB9ID0gbmV3IFVSTChyZXEudXJsKTtcbiAgY29uc3QgcGFnZSA9IHBhcnNlSW50KHNlYXJjaFBhcmFtcy5nZXQoJ3BhZ2UnKSB8fCAnMScpO1xuICBjb25zdCBsaW1pdCA9IHBhcnNlSW50KHNlYXJjaFBhcmFtcy5nZXQoJ2xpbWl0JykgfHwgJzIwJyk7XG4gIGNvbnN0IHN0YXR1cyA9IHNlYXJjaFBhcmFtcy5nZXQoJ3N0YXR1cycpO1xuICBjb25zdCBjbGllbnQgPSBzZWFyY2hQYXJhbXMuZ2V0KCdjbGllbnQnKTtcblxuICBjb25zdCBxdWVyeTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gPSB7fTtcbiAgaWYgKHN0YXR1cykgcXVlcnkuc3RhdHVzID0gcGFyc2VJbnQoc3RhdHVzKTtcbiAgaWYgKGNsaWVudCkgcXVlcnkuY2xpZW50ID0gY2xpZW50O1xuXG4gIGNvbnN0IHRvdGFsID0gYXdhaXQgRXN0aW1hdGUuY291bnREb2N1bWVudHMocXVlcnkpO1xuICBjb25zdCBlc3RpbWF0ZXMgPSBhd2FpdCBFc3RpbWF0ZS5maW5kKHF1ZXJ5KVxuICAgIC5zb3J0KHsgZGF0ZTogLTEgfSlcbiAgICAuc2tpcCgocGFnZSAtIDEpICogbGltaXQpXG4gICAgLmxpbWl0KGxpbWl0KVxuICAgIC5wb3B1bGF0ZSgnY2xpZW50JywgJ2NvbXBhbnknKVxuICAgIC5wb3B1bGF0ZSgnc2FsZV9hZ2VudCcsICdmaXJzdG5hbWUgbGFzdG5hbWUnKVxuICAgIC5sZWFuKCk7XG5cbiAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHtcbiAgICBkYXRhOiBlc3RpbWF0ZXMsXG4gICAgcGFnaW5hdGlvbjogeyB0b3RhbCwgcGFnZSwgbGltaXQsIHBhZ2VzOiBNYXRoLmNlaWwodG90YWwgLyBsaW1pdCkgfSxcbiAgfSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBQT1NUKHJlcTogTmV4dFJlcXVlc3QpIHtcbiAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGdldFNlcnZlclNlc3Npb24oYXV0aE9wdGlvbnMpO1xuICBpZiAoIXNlc3Npb24pIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiAnVW5hdXRob3JpemVkJyB9LCB7IHN0YXR1czogNDAxIH0pO1xuXG4gIGF3YWl0IGNvbm5lY3REQigpO1xuICBjb25zdCBFc3RpbWF0ZSA9IG1vbmdvb3NlLm1vZGVsKCdFc3RpbWF0ZScpO1xuICBjb25zdCBTZXR0aW5ncyA9IG1vbmdvb3NlLm1vZGVsKCdTZXR0aW5ncycpO1xuXG4gIGNvbnN0IGJvZHkgPSBhd2FpdCByZXEuanNvbigpO1xuXG4gIGlmICghYm9keS5jbGllbnQpIHtcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogJ0NsaWVudCBpcyByZXF1aXJlZCcgfSwgeyBzdGF0dXM6IDQwMCB9KTtcbiAgfVxuXG4gIC8vIEdldCBuZXh0IGVzdGltYXRlIG51bWJlclxuICBjb25zdCBwcmVmaXhTZXR0aW5nID0gYXdhaXQgU2V0dGluZ3MuZmluZE9uZSh7IGtleTogJ2VzdGltYXRlX3ByZWZpeCcgfSk7XG4gIGNvbnN0IHByZWZpeCA9IHByZWZpeFNldHRpbmc/LnZhbHVlIHx8ICdFU1QnO1xuICBjb25zdCBsYXN0RXN0aW1hdGUgPSBhd2FpdCBFc3RpbWF0ZS5maW5kT25lKCkuc29ydCh7IG51bWJlcjogLTEgfSkuc2VsZWN0KCdudW1iZXInKTtcbiAgY29uc3QgbnVtYmVyID0gKGxhc3RFc3RpbWF0ZT8ubnVtYmVyIHx8IDApICsgMTtcblxuICAvLyBDYWxjdWxhdGUgdG90YWxzXG4gIGxldCBzdWJ0b3RhbCA9IDA7XG4gIGxldCB0b3RhbF90YXggPSAwO1xuXG4gIGZvciAoY29uc3QgaXRlbSBvZiBib2R5Lml0ZW1zIHx8IFtdKSB7XG4gICAgY29uc3QgaXRlbVRvdGFsID0gaXRlbS5xdHkgKiBpdGVtLnJhdGU7XG4gICAgc3VidG90YWwgKz0gaXRlbVRvdGFsO1xuICAgIGZvciAoY29uc3QgcmF0ZSBvZiBpdGVtLnRheHJhdGUgfHwgW10pIHtcbiAgICAgIHRvdGFsX3RheCArPSAoaXRlbVRvdGFsICogcmF0ZSkgLyAxMDA7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgZGlzY291bnRBbW91bnQgPVxuICAgIGJvZHkuZGlzY291bnRfdHlwZSA9PT0gJ3BlcmNlbnQnXG4gICAgICA/IChzdWJ0b3RhbCAqIChib2R5LmRpc2NvdW50X3BlcmNlbnQgfHwgMCkpIC8gMTAwXG4gICAgICA6IGJvZHkuZGlzY291bnRfdG90YWwgfHwgMDtcblxuICBjb25zdCB0b3RhbCA9IHN1YnRvdGFsIC0gZGlzY291bnRBbW91bnQgKyB0b3RhbF90YXggKyAoYm9keS5hZGp1c3RtZW50IHx8IDApO1xuXG4gIGNvbnN0IGVzdGltYXRlID0gYXdhaXQgRXN0aW1hdGUuY3JlYXRlKHtcbiAgICAuLi5ib2R5LFxuICAgIG51bWJlcixcbiAgICBwcmVmaXgsXG4gICAgc3VidG90YWwsXG4gICAgdG90YWxfdGF4LFxuICAgIHRvdGFsLFxuICAgIGRpc2NvdW50X3RvdGFsOiBkaXNjb3VudEFtb3VudCxcbiAgICBoYXNoOiB1dWlkdjQoKS5yZXBsYWNlKC8tL2csICcnKSxcbiAgICBkYXRlOiBib2R5LmRhdGUgfHwgbmV3IERhdGUoKSxcbiAgICBhZGRlZGZyb206IHNlc3Npb24udXNlci5pZCxcbiAgICBzdGF0dXM6IGJvZHkuc3RhdHVzIHx8IDEsIC8vIERyYWZ0XG4gIH0pO1xuXG4gIGNvbnN0IHBvcHVsYXRlZCA9IGF3YWl0IEVzdGltYXRlLmZpbmRCeUlkKGVzdGltYXRlLl9pZClcbiAgICAucG9wdWxhdGUoJ2NsaWVudCcsICdjb21wYW55JylcbiAgICAubGVhbigpO1xuXG4gIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICB7IGRhdGE6IHBvcHVsYXRlZCwgbWVzc2FnZTogJ0VzdGltYXRlIGNyZWF0ZWQgc3VjY2Vzc2Z1bGx5JyB9LFxuICAgIHsgc3RhdHVzOiAyMDEgfVxuICApO1xufVxuIl0sIm5hbWVzIjpbIk5leHRSZXNwb25zZSIsImdldFNlcnZlclNlc3Npb24iLCJhdXRoT3B0aW9ucyIsImNvbm5lY3REQiIsIm1vbmdvb3NlIiwidjQiLCJ1dWlkdjQiLCJHRVQiLCJyZXEiLCJzZXNzaW9uIiwianNvbiIsImVycm9yIiwic3RhdHVzIiwiRXN0aW1hdGUiLCJtb2RlbCIsInNlYXJjaFBhcmFtcyIsIlVSTCIsInVybCIsInBhZ2UiLCJwYXJzZUludCIsImdldCIsImxpbWl0IiwiY2xpZW50IiwicXVlcnkiLCJ0b3RhbCIsImNvdW50RG9jdW1lbnRzIiwiZXN0aW1hdGVzIiwiZmluZCIsInNvcnQiLCJkYXRlIiwic2tpcCIsInBvcHVsYXRlIiwibGVhbiIsImRhdGEiLCJwYWdpbmF0aW9uIiwicGFnZXMiLCJNYXRoIiwiY2VpbCIsIlBPU1QiLCJTZXR0aW5ncyIsImJvZHkiLCJwcmVmaXhTZXR0aW5nIiwiZmluZE9uZSIsImtleSIsInByZWZpeCIsInZhbHVlIiwibGFzdEVzdGltYXRlIiwibnVtYmVyIiwic2VsZWN0Iiwic3VidG90YWwiLCJ0b3RhbF90YXgiLCJpdGVtIiwiaXRlbXMiLCJpdGVtVG90YWwiLCJxdHkiLCJyYXRlIiwidGF4cmF0ZSIsImRpc2NvdW50QW1vdW50IiwiZGlzY291bnRfdHlwZSIsImRpc2NvdW50X3BlcmNlbnQiLCJkaXNjb3VudF90b3RhbCIsImFkanVzdG1lbnQiLCJlc3RpbWF0ZSIsImNyZWF0ZSIsImhhc2giLCJyZXBsYWNlIiwiRGF0ZSIsImFkZGVkZnJvbSIsInVzZXIiLCJpZCIsInBvcHVsYXRlZCIsImZpbmRCeUlkIiwiX2lkIiwibWVzc2FnZSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./src/app/api/estimates/route.ts\n");

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
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/next-auth","vendor-chunks/bcryptjs","vendor-chunks/@babel","vendor-chunks/openid-client","vendor-chunks/oauth","vendor-chunks/object-hash","vendor-chunks/preact","vendor-chunks/yallist","vendor-chunks/lru-cache","vendor-chunks/cookie","vendor-chunks/oidc-token-hash","vendor-chunks/@panva","vendor-chunks/uuid"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Festimates%2Froute&page=%2Fapi%2Festimates%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Festimates%2Froute.ts&appDir=G%3A%5Cxmp%5Chtdocs%5Chtml%5Cswastik-crm%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=G%3A%5Cxmp%5Chtdocs%5Chtml%5Cswastik-crm&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();