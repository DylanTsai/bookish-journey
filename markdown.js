"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_markdown_1 = __importDefault(require("react-markdown"));
const fs_1 = __importDefault(require("fs"));
class Markdown extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.state = {
            md_text: null
        };
    }
    onComponentDidMount() {
        fs_1.default.readFile(this.props.src_fpath, (err, data) => {
            if (err) {
                console.log("Error reading file for markdown:");
                return console.error(err);
            }
            this.setState({ md_text: data.toString() });
        });
    }
    render() {
        if (this.state.md_text === null) {
            return react_1.default.createElement(react_1.default.Fragment, null);
        }
        return react_1.default.createElement(react_markdown_1.default, { source: this.state.md_text });
    }
}
exports.default = Markdown;
//# sourceMappingURL=markdown.js.map