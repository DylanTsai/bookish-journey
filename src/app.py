from flask import Flask, request, render_template
from flask import current_app, g
import connectToDB

app = Flask(__name__,
  static_folder="static/dist",
  template_folder="templates"
)



@app.route('/')
def hello():
    return render_template("index.html")

@app.route('/response', methods=['POST'])
def response():
    fname = request.form.get("fname")
    note = request.form.get("note") 
    return render_template("index.html", name=fname, note=note) 


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

  return str(colnames)

@app.route('/testRetrieveColFromCountry', methods=['GET'])
def test_SymbaApi_country_col_yeah():
  col= request.args['col']
  engine = connectToDB.get_db()
  cur = engine.cursor()

  cur.execute("select "+col+" from public.\"SymbaApi_country\"")
  rows = cur.fetchall()
  res = ""
  for r in rows:
      res += r[0] +'<br/>'
  print(res)
  cur.close()
  return res


if __name__ == '__main__': app.run(host="0.0.0.0", port=5000)
