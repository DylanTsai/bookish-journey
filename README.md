# symba
CS5150 Project for Symba Intern Management Platform

## Install postgresql
On MacOSX, you can install on Homebrew, then follow the instructions (that pop up in the terminal after installation) to initialize postgresql. Otherwise, you may have to restart your computer.

## Virtual Environment Instructions
#### Create a new python3 virtualenv named symba.
`virtualenv -p python3 symba_env`
If you do not have virtualenv, you will need to run `pip3 install virtualenv`.

#### Activate the environment
`source symba_env/bin/activate`

#### Install all Python requirements
`pip install -r requirements.txt`
If you receive an error message including `ld: library not found for -lssl` while installing psycopg2, and you are on MacOSX, run `xcode-select --install` and then run `env LDFLAGS="-I/usr/local/opt/openssl/include -L/usr/local/opt/openssl/lib" pip --no-cache install psycopg2`.

#### To Add Packages to requirement.txt 
`pip freeze > requirements.txt`

## Running
To deploy locally, active the python environment, install any Python or NodeJS requirements necessary, and run `python app.py` in src. This will run the server at localhost:5000.

## Development
Run `npm run watch` in /src/static to transpile files in real-time. Run this in the background, or in a separate terminal. Alternatively, run `node run build` to do one-time transpilation.
Note that we are using jinja, so HTML comments are formatted as `{# comment #}`.
All HTML files need to be in src/templates/ and all Javascript and CSS files need to be in src/static/.
All javascript files need to have the line `import regeneratorRuntime from "regenerator-runtime"`.
Make sure that all javascript files are (transitively) imported by a file listed in `entry` in `webpack.config.js.

For database visualization, Zhihao find 'TablePlus' a good app to use and anyone could connect with the following specs: 
Name: MyDatabase  
Host/Socket: symbatest.c3uotbqk2qpa.us-east-2.rds.amazonaws.com   
Port: 5432  
User: masterusername   
Pass: masterpassword  
Database: postgres

## Codebase Structure
This outermost directory is primarily for project-wide setup (localization setup, Python requirements, and devstart) and documentation. src contains most of the source code.
src contains app.py, the entrypoint for Flask. database is for Python files dealing with the database. templates has html files. static is our Typescript/CSS folder, and it is the starting directory for NodeJS and Babel/Webpack. To install Node packages, run `npm install` in static.
Inside static:
- styles: all css files
- tsconfig.json: Typescript config
- package.json, package-lock.json, node_modules: Node package management
- webpack.config.js: Webpack config. Change entrypoints in here to control how bundles are created in dist
- .babelrc: Babel config
- dist: transpiled Javascript+CSS files, created by Webpack through `npm run build` or `npm run watch`
- js: all Typescript and Javascript files
	- createProfile.tsx, createProfileComponents: files for Creating Profile
	- textUtils.tsx: helpful classes to work with text and to monitor text input elements
	- stateUtils.ts: convenient tools for working with React state
	- dbUtils.js: utilities for interfacing with the database
	- constants.js: Typescript constants that are used throughout the entire project
	- symbaToolbar.tsx: the toolbar that is always displayed at the top of the page
	- gen: generated files. For ease of setup, the make process only changes the files in gen. generated files include language constants (for localization)
	- everything else: we just used those for testing and learning javascript/typescript. 
