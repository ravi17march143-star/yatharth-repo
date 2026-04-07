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
exports.id = "app/api/projects/route";
exports.ids = ["app/api/projects/route"];
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

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fprojects%2Froute&page=%2Fapi%2Fprojects%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fprojects%2Froute.ts&appDir=G%3A%5Cxmp%5Chtdocs%5Chtml%5Cswastik-crm%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=G%3A%5Cxmp%5Chtdocs%5Chtml%5Cswastik-crm&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fprojects%2Froute&page=%2Fapi%2Fprojects%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fprojects%2Froute.ts&appDir=G%3A%5Cxmp%5Chtdocs%5Chtml%5Cswastik-crm%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=G%3A%5Cxmp%5Chtdocs%5Chtml%5Cswastik-crm&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var G_xmp_htdocs_html_swastik_crm_src_app_api_projects_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/app/api/projects/route.ts */ \"(rsc)/./src/app/api/projects/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/projects/route\",\n        pathname: \"/api/projects\",\n        filename: \"route\",\n        bundlePath: \"app/api/projects/route\"\n    },\n    resolvedPagePath: \"G:\\\\xmp\\\\htdocs\\\\html\\\\swastik-crm\\\\src\\\\app\\\\api\\\\projects\\\\route.ts\",\n    nextConfigOutput,\n    userland: G_xmp_htdocs_html_swastik_crm_src_app_api_projects_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/projects/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZwcm9qZWN0cyUyRnJvdXRlJnBhZ2U9JTJGYXBpJTJGcHJvamVjdHMlMkZyb3V0ZSZhcHBQYXRocz0mcGFnZVBhdGg9cHJpdmF0ZS1uZXh0LWFwcC1kaXIlMkZhcGklMkZwcm9qZWN0cyUyRnJvdXRlLnRzJmFwcERpcj1HJTNBJTVDeG1wJTVDaHRkb2NzJTVDaHRtbCU1Q3N3YXN0aWstY3JtJTVDc3JjJTVDYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj1HJTNBJTVDeG1wJTVDaHRkb2NzJTVDaHRtbCU1Q3N3YXN0aWstY3JtJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBc0c7QUFDdkM7QUFDYztBQUNxQjtBQUNsRztBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsZ0hBQW1CO0FBQzNDO0FBQ0EsY0FBYyx5RUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLGlFQUFpRTtBQUN6RTtBQUNBO0FBQ0EsV0FBVyw0RUFBVztBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ3VIOztBQUV2SCIsInNvdXJjZXMiOlsid2VicGFjazovL3N3YXN0aWstY3JtLz9jZDhjIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIkc6XFxcXHhtcFxcXFxodGRvY3NcXFxcaHRtbFxcXFxzd2FzdGlrLWNybVxcXFxzcmNcXFxcYXBwXFxcXGFwaVxcXFxwcm9qZWN0c1xcXFxyb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvcHJvamVjdHMvcm91dGVcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS9wcm9qZWN0c1wiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvcHJvamVjdHMvcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCJHOlxcXFx4bXBcXFxcaHRkb2NzXFxcXGh0bWxcXFxcc3dhc3Rpay1jcm1cXFxcc3JjXFxcXGFwcFxcXFxhcGlcXFxccHJvamVjdHNcXFxccm91dGUudHNcIixcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxuICAgIHVzZXJsYW5kXG59KTtcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxuLy8gYmUgZWxpbWluYXRlZCB3aGVuIHdlJ3ZlIG1vdmVkIHRoZSBvdGhlciByb3V0ZXMgdG8gdGhlIG5ldyBmb3JtYXQuIFRoZXNlXG4vLyBhcmUgdXNlZCB0byBob29rIGludG8gdGhlIHJvdXRlLlxuY29uc3QgeyByZXF1ZXN0QXN5bmNTdG9yYWdlLCBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcyB9ID0gcm91dGVNb2R1bGU7XG5jb25zdCBvcmlnaW5hbFBhdGhuYW1lID0gXCIvYXBpL3Byb2plY3RzL3JvdXRlXCI7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHNlcnZlckhvb2tzLFxuICAgICAgICBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIG9yaWdpbmFsUGF0aG5hbWUsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fprojects%2Froute&page=%2Fapi%2Fprojects%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fprojects%2Froute.ts&appDir=G%3A%5Cxmp%5Chtdocs%5Chtml%5Cswastik-crm%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=G%3A%5Cxmp%5Chtdocs%5Chtml%5Cswastik-crm&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./src/app/api/projects/route.ts":
/*!***************************************!*\
  !*** ./src/app/api/projects/route.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET),\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next-auth */ \"(rsc)/./node_modules/next-auth/index.js\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _lib_auth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/auth */ \"(rsc)/./src/lib/auth.ts\");\n/* harmony import */ var _lib_mongodb__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/lib/mongodb */ \"(rsc)/./src/lib/mongodb.ts\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_4__);\n\n\n\n\n\nasync function GET(req) {\n    const session = await (0,next_auth__WEBPACK_IMPORTED_MODULE_1__.getServerSession)(_lib_auth__WEBPACK_IMPORTED_MODULE_2__.authOptions);\n    if (!session) return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        error: \"Unauthorized\"\n    }, {\n        status: 401\n    });\n    await (0,_lib_mongodb__WEBPACK_IMPORTED_MODULE_3__[\"default\"])();\n    const Project = mongoose__WEBPACK_IMPORTED_MODULE_4___default().model(\"Project\");\n    const { searchParams } = new URL(req.url);\n    const page = parseInt(searchParams.get(\"page\") || \"1\");\n    const limit = parseInt(searchParams.get(\"limit\") || \"20\");\n    const status = searchParams.get(\"status\");\n    const client = searchParams.get(\"client\");\n    const search = searchParams.get(\"search\") || \"\";\n    const query = {};\n    if (status) query.status = parseInt(status);\n    if (client) query.client = client;\n    if (search) query.$or = [\n        {\n            name: {\n                $regex: search,\n                $options: \"i\"\n            }\n        },\n        {\n            description: {\n                $regex: search,\n                $options: \"i\"\n            }\n        }\n    ];\n    const total = await Project.countDocuments(query);\n    const projects = await Project.find(query).sort({\n        start_date: -1\n    }).skip((page - 1) * limit).limit(limit).populate(\"client\", \"company\").populate(\"addedfrom\", \"firstname lastname\").lean();\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        data: projects,\n        pagination: {\n            total,\n            page,\n            limit,\n            pages: Math.ceil(total / limit)\n        }\n    });\n}\nasync function POST(req) {\n    const session = await (0,next_auth__WEBPACK_IMPORTED_MODULE_1__.getServerSession)(_lib_auth__WEBPACK_IMPORTED_MODULE_2__.authOptions);\n    if (!session) return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        error: \"Unauthorized\"\n    }, {\n        status: 401\n    });\n    await (0,_lib_mongodb__WEBPACK_IMPORTED_MODULE_3__[\"default\"])();\n    const Project = mongoose__WEBPACK_IMPORTED_MODULE_4___default().model(\"Project\");\n    const body = await req.json();\n    if (!body.name) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Project name is required\"\n        }, {\n            status: 400\n        });\n    }\n    const project = await Project.create({\n        ...body,\n        addedfrom: session.user.id,\n        start_date: body.start_date || new Date(),\n        status: body.status || 1,\n        progress: 0\n    });\n    const populated = await Project.findById(project._id).populate(\"client\", \"company\").populate(\"addedfrom\", \"firstname lastname\").lean();\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        data: populated,\n        message: \"Project created successfully\"\n    }, {\n        status: 201\n    });\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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c0JBQ3RCQyxJQUFJO0lBRVAsT0FBT3BDLHFEQUFZQSxDQUFDUSxJQUFJLENBQ3RCO1FBQUU2QixNQUFNYztRQUFXRyxTQUFTO0lBQStCLEdBQzNEO1FBQUU1QyxRQUFRO0lBQUk7QUFFbEIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zd2FzdGlrLWNybS8uL3NyYy9hcHAvYXBpL3Byb2plY3RzL3JvdXRlLnRzPzcwMTkiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dFJlcXVlc3QsIE5leHRSZXNwb25zZSB9IGZyb20gJ25leHQvc2VydmVyJztcbmltcG9ydCB7IGdldFNlcnZlclNlc3Npb24gfSBmcm9tICduZXh0LWF1dGgnO1xuaW1wb3J0IHsgYXV0aE9wdGlvbnMgfSBmcm9tICdAL2xpYi9hdXRoJztcbmltcG9ydCBjb25uZWN0REIgZnJvbSAnQC9saWIvbW9uZ29kYic7XG5pbXBvcnQgbW9uZ29vc2UgZnJvbSAnbW9uZ29vc2UnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gR0VUKHJlcTogTmV4dFJlcXVlc3QpIHtcbiAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGdldFNlcnZlclNlc3Npb24oYXV0aE9wdGlvbnMpO1xuICBpZiAoIXNlc3Npb24pIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiAnVW5hdXRob3JpemVkJyB9LCB7IHN0YXR1czogNDAxIH0pO1xuXG4gIGF3YWl0IGNvbm5lY3REQigpO1xuICBjb25zdCBQcm9qZWN0ID0gbW9uZ29vc2UubW9kZWwoJ1Byb2plY3QnKTtcblxuICBjb25zdCB7IHNlYXJjaFBhcmFtcyB9ID0gbmV3IFVSTChyZXEudXJsKTtcbiAgY29uc3QgcGFnZSA9IHBhcnNlSW50KHNlYXJjaFBhcmFtcy5nZXQoJ3BhZ2UnKSB8fCAnMScpO1xuICBjb25zdCBsaW1pdCA9IHBhcnNlSW50KHNlYXJjaFBhcmFtcy5nZXQoJ2xpbWl0JykgfHwgJzIwJyk7XG4gIGNvbnN0IHN0YXR1cyA9IHNlYXJjaFBhcmFtcy5nZXQoJ3N0YXR1cycpO1xuICBjb25zdCBjbGllbnQgPSBzZWFyY2hQYXJhbXMuZ2V0KCdjbGllbnQnKTtcbiAgY29uc3Qgc2VhcmNoID0gc2VhcmNoUGFyYW1zLmdldCgnc2VhcmNoJykgfHwgJyc7XG5cbiAgY29uc3QgcXVlcnk6IFJlY29yZDxzdHJpbmcsIHVua25vd24+ID0ge307XG4gIGlmIChzdGF0dXMpIHF1ZXJ5LnN0YXR1cyA9IHBhcnNlSW50KHN0YXR1cyk7XG4gIGlmIChjbGllbnQpIHF1ZXJ5LmNsaWVudCA9IGNsaWVudDtcbiAgaWYgKHNlYXJjaCkgcXVlcnkuJG9yID0gW1xuICAgIHsgbmFtZTogeyAkcmVnZXg6IHNlYXJjaCwgJG9wdGlvbnM6ICdpJyB9IH0sXG4gICAgeyBkZXNjcmlwdGlvbjogeyAkcmVnZXg6IHNlYXJjaCwgJG9wdGlvbnM6ICdpJyB9IH0sXG4gIF07XG5cbiAgY29uc3QgdG90YWwgPSBhd2FpdCBQcm9qZWN0LmNvdW50RG9jdW1lbnRzKHF1ZXJ5KTtcbiAgY29uc3QgcHJvamVjdHMgPSBhd2FpdCBQcm9qZWN0LmZpbmQocXVlcnkpXG4gICAgLnNvcnQoeyBzdGFydF9kYXRlOiAtMSB9KVxuICAgIC5za2lwKChwYWdlIC0gMSkgKiBsaW1pdClcbiAgICAubGltaXQobGltaXQpXG4gICAgLnBvcHVsYXRlKCdjbGllbnQnLCAnY29tcGFueScpXG4gICAgLnBvcHVsYXRlKCdhZGRlZGZyb20nLCAnZmlyc3RuYW1lIGxhc3RuYW1lJylcbiAgICAubGVhbigpO1xuXG4gIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7XG4gICAgZGF0YTogcHJvamVjdHMsXG4gICAgcGFnaW5hdGlvbjogeyB0b3RhbCwgcGFnZSwgbGltaXQsIHBhZ2VzOiBNYXRoLmNlaWwodG90YWwgLyBsaW1pdCkgfSxcbiAgfSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBQT1NUKHJlcTogTmV4dFJlcXVlc3QpIHtcbiAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGdldFNlcnZlclNlc3Npb24oYXV0aE9wdGlvbnMpO1xuICBpZiAoIXNlc3Npb24pIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiAnVW5hdXRob3JpemVkJyB9LCB7IHN0YXR1czogNDAxIH0pO1xuXG4gIGF3YWl0IGNvbm5lY3REQigpO1xuICBjb25zdCBQcm9qZWN0ID0gbW9uZ29vc2UubW9kZWwoJ1Byb2plY3QnKTtcblxuICBjb25zdCBib2R5ID0gYXdhaXQgcmVxLmpzb24oKTtcblxuICBpZiAoIWJvZHkubmFtZSkge1xuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiAnUHJvamVjdCBuYW1lIGlzIHJlcXVpcmVkJyB9LCB7IHN0YXR1czogNDAwIH0pO1xuICB9XG5cbiAgY29uc3QgcHJvamVjdCA9IGF3YWl0IFByb2plY3QuY3JlYXRlKHtcbiAgICAuLi5ib2R5LFxuICAgIGFkZGVkZnJvbTogc2Vzc2lvbi51c2VyLmlkLFxuICAgIHN0YXJ0X2RhdGU6IGJvZHkuc3RhcnRfZGF0ZSB8fCBuZXcgRGF0ZSgpLFxuICAgIHN0YXR1czogYm9keS5zdGF0dXMgfHwgMSxcbiAgICBwcm9ncmVzczogMCxcbiAgfSk7XG5cbiAgY29uc3QgcG9wdWxhdGVkID0gYXdhaXQgUHJvamVjdC5maW5kQnlJZChwcm9qZWN0Ll9pZClcbiAgICAucG9wdWxhdGUoJ2NsaWVudCcsICdjb21wYW55JylcbiAgICAucG9wdWxhdGUoJ2FkZGVkZnJvbScsICdmaXJzdG5hbWUgbGFzdG5hbWUnKVxuICAgIC5sZWFuKCk7XG5cbiAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxuICAgIHsgZGF0YTogcG9wdWxhdGVkLCBtZXNzYWdlOiAnUHJvamVjdCBjcmVhdGVkIHN1Y2Nlc3NmdWxseScgfSxcbiAgICB7IHN0YXR1czogMjAxIH1cbiAgKTtcbn1cbiJdLCJuYW1lcyI6WyJOZXh0UmVzcG9uc2UiLCJnZXRTZXJ2ZXJTZXNzaW9uIiwiYXV0aE9wdGlvbnMiLCJjb25uZWN0REIiLCJtb25nb29zZSIsIkdFVCIsInJlcSIsInNlc3Npb24iLCJqc29uIiwiZXJyb3IiLCJzdGF0dXMiLCJQcm9qZWN0IiwibW9kZWwiLCJzZWFyY2hQYXJhbXMiLCJVUkwiLCJ1cmwiLCJwYWdlIiwicGFyc2VJbnQiLCJnZXQiLCJsaW1pdCIsImNsaWVudCIsInNlYXJjaCIsInF1ZXJ5IiwiJG9yIiwibmFtZSIsIiRyZWdleCIsIiRvcHRpb25zIiwiZGVzY3JpcHRpb24iLCJ0b3RhbCIsImNvdW50RG9jdW1lbnRzIiwicHJvamVjdHMiLCJmaW5kIiwic29ydCIsInN0YXJ0X2RhdGUiLCJza2lwIiwicG9wdWxhdGUiLCJsZWFuIiwiZGF0YSIsInBhZ2luYXRpb24iLCJwYWdlcyIsIk1hdGgiLCJjZWlsIiwiUE9TVCIsImJvZHkiLCJwcm9qZWN0IiwiY3JlYXRlIiwiYWRkZWRmcm9tIiwidXNlciIsImlkIiwiRGF0ZSIsInByb2dyZXNzIiwicG9wdWxhdGVkIiwiZmluZEJ5SWQiLCJfaWQiLCJtZXNzYWdlIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./src/app/api/projects/route.ts\n");

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
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/next-auth","vendor-chunks/openid-client","vendor-chunks/bcryptjs","vendor-chunks/@babel","vendor-chunks/oauth","vendor-chunks/object-hash","vendor-chunks/preact","vendor-chunks/yallist","vendor-chunks/lru-cache","vendor-chunks/cookie","vendor-chunks/oidc-token-hash","vendor-chunks/@panva"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fprojects%2Froute&page=%2Fapi%2Fprojects%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fprojects%2Froute.ts&appDir=G%3A%5Cxmp%5Chtdocs%5Chtml%5Cswastik-crm%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=G%3A%5Cxmp%5Chtdocs%5Chtml%5Cswastik-crm&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();