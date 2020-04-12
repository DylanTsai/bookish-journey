# Setup

- Install node if you don't have it
- Install typescript
- clone this repository
- go into this repo and run `npm install`
- If that goes well, then you're done with setup!

# Project file structure

`dist` contains generated files. Don't edit this folder; edit the correspondingfiles in `src` instead.
Running `npm run deploy` updates the website by pushing `dist` to the Github under branch `gh-pages`.

Inside src, there is one folder called `projects` and 4 other folders. Tiles go into one of these 4 folders, dependent on the filetype:
- `assets`: Miscellaneous files. csv's, images, etc.
- `styles`: css files (TODO: This is not set up in webpack.config.js, so CSS files don't work yet.)
- `templates`: html and markdown files
- `ts`: Typescript files

These 4 folders store things that are not attached to a single page. For example, the html for the homepage (templates/index.html) and files related to the navbar that will be on every page (not written yet).

Inside `project`, there will be a folder for each project, i.e. each tutorial. Each of these has a structure that mirrors `src`: they each have those 4 folders. (There's just no `projects` folder.) These folders are analogous to the folders that are directly inside `src`.

One final note: Every `templates` directory should have an `index.html`. This index.html is treated specially when compiled into `dist`, in order to create nice html links.

# Getting Started

### Creating a new page

1. Create an html file that has the following line in it: "<script src="js/index.bundle.js" type="text/javascript"></script>".
2. Create a typescript file that uses ReactDOM to inject React into that html page. For examples, you can look at src/templates/index.html and src/ts/app.tsx.


### Webpage links

- When referring to any 
- src/projects/{ project name }/templates/index.html is located at { base url }/{ project name }.html. src/projects/{ project name }/templates/{ file name }.html is located at { base url }/{ project name }/{file name}.html
- 

Use `make_template_path` and `make_asset_path` to get the links to other files in the repo. These functions are in `src/constants/webconfig`, and take in parameters for the file name of the resource you want and hte project it resides under. In your html files, don't reference any other files aside from `js/index.bundle.js`; do that in Typescript/React, so you cna use those functions.


### Local deployment

One option for deploying locally:
- install http.server through `pip` if you don't have it
- `npm run build` from anywhere in the repo
- go into`dist`
- `python3 -m http.server`

Going to localhost:8000/SVM.html in a browser will pull up the webpage corresponding to src/projects/SVM/templates/index.html. When the project is deployed to the Github Pages website, you can replace "localhost:8000" with "https://github.com/CornellDataScience/Education-Immersive-Tutorials" to see the corresponding webpage.

### Publishing

`npm run deploy` builds a production-version website inside `dist`, overwriting whatever's inside `dist`, and pushes these new contents of `dist` to a branch in the Github called `gh-pages`. This updates the website. After the new push shows up on Github, it may take a few more minutes (up to 20 minutes) for the actual website to be updated.

### Important caveats

- When linking to other sources within the repo, always use the functions in `src/constants/'. The one exception is typescript `import` statements -- you can use those normally.
- It's not recommended to have many html files.
- In each of the 4 required folders (`assets`,`styles`,`templates`,`ts`) for each project, subdirectories are flattened out. So, `ts/component1/main.ts` and `ts/component2/main.ts` will clash -- don't let this happen.
- async functions don't work, because something is messed up with this codebase's configurations

### Useful Tools and Conventions

TODO

# Creating a new tutorial project
- Add a folder to src/projects, with the 4 required folders.
- In src/ts/constants/crossProjectInfo.ts, add a new entry to the enum `Project`. Also add a new string to `ProjectDirName`.
- Edit src/index.tsx` to add this new project to the homepage.

