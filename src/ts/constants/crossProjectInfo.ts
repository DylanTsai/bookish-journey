export enum Project {
  SVM = "SVM",
  Network = "networkAnalysis",
  main = "main"
}

export type ProjectDirName =
  | "SVM"
  | "networkAnalysis"
  | "main"


export function isAProject(str: string): str is Project {
  // @ts-ignore
  return Object.values(Project).includes(str)
}

export function FileNameToProject(fileName: ProjectDirName) {
  return Project[fileName];
}