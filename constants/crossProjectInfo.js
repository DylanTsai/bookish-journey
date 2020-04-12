"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Project;
(function (Project) {
    Project["SVM"] = "SVM";
    Project["Network"] = "networkAnalysis";
    Project["main"] = "main";
})(Project = exports.Project || (exports.Project = {}));
function isAProject(str) {
    // @ts-ignore
    return Object.values(Project).includes(str);
}
exports.isAProject = isAProject;
function FileNameToProject(fileName) {
    return Project[fileName];
}
exports.FileNameToProject = FileNameToProject;
//# sourceMappingURL=crossProjectInfo.js.map