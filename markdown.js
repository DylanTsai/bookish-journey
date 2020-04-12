"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_markdown_1 = __importDefault(require("react-markdown"));
class Markdown extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.state = {
            md_text: null
        };
    }
    componentDidMount() {
        let fpath = this.props.src_fpath;
        fetch(fpath)
            .then(resp => {
            return resp.body.getReader().read();
        })
            .then((result) => {
            let decoder = new TextDecoder("utf-8");
            this.setState({ md_text: decoder.decode(result.value) });
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