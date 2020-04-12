"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crossProjectInfo_1 = require("./crossProjectInfo");
let base_url = process.env.NODE_ENV == "production" ?
    "http://dylantsai.github.io/bookish-journey"
    : "http://0.0.0.0:8000";
function make_template_path(p1, p2) {
    let project = "main";
    let templateNameWithExtension = "index.html";
    if (!crossProjectInfo_1.isAProject(p1)) {
        templateNameWithExtension = p1;
    }
    else {
        project = p1;
        if (p2 !== undefined) {
            templateNameWithExtension = p2;
        }
    }
    if (templateNameWithExtension == "index.html") {
        let url_suffix = project == "main" ? "" : project;
        return `${base_url}/${url_suffix}`;
    }
    return `${base_url}/templates/${project}/${templateNameWithExtension}`;
}
exports.make_template_path = make_template_path;
function make_asset_path(p1, p2) {
    let project;
    let assetNameWithExtension;
    if (crossProjectInfo_1.isAProject(p1)) {
        project = p1;
        assetNameWithExtension = p2;
    }
    else {
        project = crossProjectInfo_1.Project.main;
        assetNameWithExtension = p1;
    }
    return `${base_url}/assets/${project}/${assetNameWithExtension}`;
}
exports.make_asset_path = make_asset_path;
let cfg = {
    base_url: base_url,
    make_template_path: make_template_path,
    make_asset_path: make_asset_path
};
exports.default = cfg;
//# sourceMappingURL=webconfig.js.map