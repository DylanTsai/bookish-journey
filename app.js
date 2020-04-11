"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
const markdown_1 = __importDefault(require("./markdown"));
react_dom_1.default.render(react_1.default.createElement("div", null,
    react_1.default.createElement("div", null, "hi im here"),
    react_1.default.createElement(markdown_1.default, { src_fpath: "templates/test.md" }),
    react_1.default.createElement("div", null, "im down here")), document.getElementById("body"));
//# sourceMappingURL=app.js.map