"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
const markdown_1 = __importDefault(require("./markdown"));
const webconfig_1 = __importDefault(require("./constants/webconfig"));
class A extends react_1.default.Component {
    render() {
        return react_1.default.createElement("div", null, "whewhewhehhhhhh");
    }
}
console.log(webconfig_1.default.make_template_path("test.md"));
react_dom_1.default.render(react_1.default.createElement("div", null,
    react_1.default.createElement("div", null, process.env.NODE_ENV),
    react_1.default.createElement("div", null, "hi im here"),
    react_1.default.createElement(markdown_1.default, { src_fpath: webconfig_1.default.make_template_path("test.md") }),
    react_1.default.createElement(A, null),
    "xw",
    react_1.default.createElement("div", null, "im down here")), document.getElementById("main-container"));
//# sourceMappingURL=app.js.map