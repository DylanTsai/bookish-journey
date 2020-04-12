import { Project, isAProject } from './crossProjectInfo'

let base_url = process.env.NODE_ENV == "production" ?
  "https://dylantsai.github.io/bookish-journey"
  : "http://0.0.0.0:8000"

export function make_template_path(project: Project, assetNameWithExtension: string): string;                     //Overload 1
export function make_template_path(project: Project): string;
export function make_template_path(templateNameWithExtension: string): string;
export function make_template_path(p1: Project | string, p2?: string): string {
  let project = "main";
  let templateNameWithExtension = "index.html";
  if (!isAProject(p1)) {
    templateNameWithExtension = p1;
  } else {
    project = p1;
    if (p2 !== undefined) {
      templateNameWithExtension = p2;
    }
  }
  if (templateNameWithExtension.endsWith(".html")) {
    if (templateNameWithExtension === "index.html") {
      let url_suffix = project == "main" ? "" : project
      return `${base_url}/${url_suffix}`
    }
    return `${base_url}/${templateNameWithExtension}`
  }
  return `${base_url}/templates/${project}/${templateNameWithExtension}`
}


export function make_asset_path(project: Project, assetNameWithExtension: string): string;
export function make_asset_path(assetNameWithExtension: string): string;
export function make_asset_path(p1: Project | string, p2?: string): string {
  let project;
  let assetNameWithExtension;
  if (isAProject(p1)) {
    project = p1;
    assetNameWithExtension = p2;
  } else {
    project = Project.main;
    assetNameWithExtension = p1;
  }
  return `${base_url}/assets/${project}/${assetNameWithExtension}`
}


type cfgT = {
  base_url: string,
  make_template_path: typeof make_template_path,
  make_asset_path: typeof make_asset_path
}

let cfg: cfgT = {
  base_url: base_url,
  make_template_path: make_template_path,
  make_asset_path: make_asset_path
}

export default cfg;