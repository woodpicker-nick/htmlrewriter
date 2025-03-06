"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var node_exports = {};
__export(node_exports, {
  HTMLRewriter: () => HTMLRewriter
});
module.exports = __toCommonJS(node_exports);
var import_html_rewriter = __toESM(require("./dist/html_rewriter.js"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_path = __toESM(require("path"), 1);
var import_url = __toESM(require("url"), 1);
var import_html_rewriter_wrapper = require("./dist/html_rewriter_wrapper.js");
const import_meta = {};
const __dirname = import_url.default.fileURLToPath(new URL(".", import_meta.url));
const bytes = import_fs.default.readFileSync(
  import_path.default.join(__dirname, "dist/html_rewriter_bg.wasm")
);
const wasm = new WebAssembly.Module(bytes);
const HTMLRewriter = (0, import_html_rewriter_wrapper.HTMLRewriterWrapper)((0, import_html_rewriter.default)(wasm));
