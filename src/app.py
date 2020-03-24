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

@app.route('/create-profile')
def createProfile():
    return render_template("createProfile.html")

@app.route('/create-password/<string:email>')
def createPassword(email: str):
    return render_template("createPassword.html",email=email)

@app.route('/response', methods=['POST'])
def response():
    fname = request.form.get("fname")
    note = request.form.get("note") 
    return render_template("test.html", name=fname, note=note) 


@app.route('/getStudentData')
def test_getStudentData():
  engine = connectToDB.get_db()
  cur = engine.cursor()

  # getting the column names for each table
  cur.execute("""
      SELECT * FROM public."InternProfile";
  """)
  colnames = [desc[0] for desc in cur.description]
  rows = cur.fetchall()
  res = "\t".join(colnames)

  for row in rows:
      intern_id = row[0]
      last_name = row[1]
      first_name = row[2]
      email = row[3]
      country = row[4]
      state = row[5]
      city = row[6]
      local_time_zone = row[7]
      college_education = row[8]
      major_1 = row[9]
      major_2 = row[10]
      minor_1 = row[11]
      minor_2 = row[12]
      self_intro = row[13]
      resume_fpath = row[14]
      symba_challenge_points = row[15]
      res+='<br />'+'\t'.join(map(str, row))
  cur.close()
  return res


@app.route('/testRetrieveFromAnyTable', methods=['GET'])
def test_getAnyTableData():
  # it'll look somethinglike http://0.0.0.0:5000/testRetrieveFromAnyTable?table=tablename
  # tablename could be: InternProfile, Country, Interest...
  table= request.args.get('table', default='None', type=str)
  engine = connectToDB.get_db()
  cur = engine.cursor()
  try:
    cur.execute("select * from public.\"" + table + "\";")
  except pg_errors.UndefinedTable:
    return ("error with tablename / table don't exist<br />" 
    + "It'll look somethinglike http://0.0.0.0:5000/testRetrieveFromAnyTable?table=tablename<br />"
    + "tablename could be: InternProfile, Country, Interest...")

  colnames = [desc[0] for desc in cur.description]
  rows = cur.fetchall()
  res = "\t".join(colnames)

  for row in rows:
    res+='<br />'+'\t'.join(map(str, row))
  cur.close()
  return res


@app.route('/testRetrieveFromAnyTableAnyColumn', methods=['GET'])
def test_getAnyTableAnyColumnData():
  # it'll look somethinglike http://0.0.0.0:5000/testRetrieveFromAnyTableAnyColumn?table=tablename&col=colname
  # tablename could be: InternProfile, Country, Interest...
  # colname could be: name, id...

  table= request.args.get('table', default='None', type=str)
  col = request.args.get('col', default='None', type=str)
  engine = connectToDB.get_db()
  cur = engine.cursor()
  try: 
    cur.execute("select " + col + " from public.\"" + table + "\";")
  except pg_errors.UndefinedColumn:
     return ("error with colname / colname don't exist<br />" 
      + "It'll look somethinglike http://0.0.0.0:5000/testRetrieveFromAnyTableAnyColumn?table=tablename&col=colname<br />" 
      + "tablename could be: InternProfile, Country, Interest...<br />" 
      + "colname could be: name, id...<br />" )

  except pg_errors.UndefinedTable:
    return ("error with tablename / table don't exist<br />" 
      + "It'll look somethinglike http://0.0.0.0:5000/testRetrieveFromAnyTableAnyColumn?table=tablename&col=colname<br />" 
      + "tablename could be: InternProfile, Country, Interest...<br />" 
      + "colname could be: name, id...<br />" )

  rows = cur.fetchall()
  res = col

  for row in rows:
    res+='<br />'+'\t'.join(map(str, row))
  cur.close()
  return res

# @app.route('/getColNames', methods=['GET'])
# def test_SymbaApi_country_col():
#   # you'll get a parameter from the person who goes to the website
#   # it'll look somethinglike http://0.0.0.0:5000/getColNames?table=SymbaApi_country
#   # table here is the name of the table you want to query
#   table = request.args['table']
#   engine = connectToDB.get_db()
#   cur = engine.cursor()

#   # getting the column names for each table
#   cur.execute(f"""
#       Select * FROM public."{table}" LIMIT 0;
#   """)
#   colnames = [desc[0] for desc in cur.description]
#   cur.close()
#   return ",".join(colnames)

# @app.route('/testRetrieveColFromCountry', methods=['GET'])
# def test_SymbaApi_country_col_yeah():
#   # it'll look somethinglike http://0.0.0.0:5000/testRetrieveColFromCountry?col=name
#   col= request.args.get('col')
#   engine = connectToDB.get_db()
#   cur = engine.cursor()
#   try:
#     cur.execute("select "+col+" from public.\"SymbaApi_country\"")
#   except pg_errors.UndefinedColumn:
#     return ""
#   rows = cur.fetchall()
#   res = []
#   for r in rows:
#     if len(r) > 0:
#       res.append(r[0])
#   res = ", ".join(res)
#   cur.close()
#   return res


if __name__ == '__main__': app.run(host="0.0.0.0", port=5000)
