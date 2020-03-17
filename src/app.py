import os,sys
sys.path.insert(1, os.path.join(os.path.dirname(__file__),'database'))

from flask import Flask, request, render_template
from flask import current_app, g
import connectToDB
from psycopg2 import errors as pg_errors

app = Flask(__name__,
  static_folder="static/dist",
  template_folder="templates"
)



@app.route('/')
def hello():
    return render_template("test.html")

@app.route('/create-password/<string:email>')
def createPassword(email: str):
    return render_template("createPassword.html",email=email)

@app.route('/response', methods=['POST'])
def response():
    fname = request.form.get("fname")
    note = request.form.get("note") 
    return render_template("test.html", name=fname, note=note) 


@app.route('/getColNames', methods=['GET'])
def test_SymbaApi_country_col():
  # you'll get a parameter from the person who goes to the website
  # it'll look somethinglike /testRetrieveColFromSymbaApi_country?col='colname'
  table = request.args['table']
  engine = connectToDB.get_db()
  cur = engine.cursor()
  cur.execute(f"""
      Select * FROM public."{table}" LIMIT 0;
  """)
  colnames = [desc[0] for desc in cur.description]
  cur.close()
  return ",".join(colnames)

@app.route('/testRetrieveColFromCountry', methods=['GET'])
def test_SymbaApi_country_col_yeah():
  col= request.args.get('col')
  engine = connectToDB.get_db()
  cur = engine.cursor()
  try:
    cur.execute("select "+col+" from public.\"SymbaApi_country\"")
  except pg_errors.UndefinedColumn:
    return ""
  rows = cur.fetchall()
  res = []
  for r in rows:
    if len(r) > 0:
      res.append(r[0])
  res = ",".join(res)
  cur.close()
  return res


if __name__ == '__main__': app.run(host="0.0.0.0", port=5000)
