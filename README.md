# symba
CS5150 Project for Symba Intern Management Platform

## Virtual Enviornment Instructions
#### Create a new python3 virtualenv named symba.
`virtualenv -p python3 symba_env`
If you do not have virtualenv, you will need to run `pip3 install virtualenv`.

#### Activate the environment
`source symba_env/bin/activate`

#### Install all Python requirements
`pip install -r requirements.txt`

#### To Add Packages to requirement.txt 
`pip freeze > requirements.txt`

#### Running
To deploy locally, active the python environment, install any Python or NodeJS requirements necessary, and run `python app.py` in src. This will run the server at localhost:5000.

#### Development
Run `npm run watch` in /src/static to transpile files in real-time. Run this in the background, or in a separate terminal. Alternatively, run `node run build` to do one-time transpilation.
Note that we are using jinja, so HTML comments are formatted as `{# comment #}`.
All HTML files need to be in src/templates/ and all Javascript and CSS files need to be in src/static/.
All javascript files need to have the line `import regeneratorRuntime from "regenerator-runtime"`.
