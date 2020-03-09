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

For database visualization, download TablePlus and connect with the following specs:
Name: MyDatabase  
Host/Socket: symbatest.c3uotbqk2qpa.us-east-2.rds.amazonaws.com   
Port: 5432  
User: masterusername   
Pass: masterpassword  
Database: postgres
