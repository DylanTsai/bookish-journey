from flask import Flask, request, render_template


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


@app.route('/testRetrieveColFromSymbaApi_country')
def test_SymbaApi_country_col():
  # you'll get a parameter from the person who goes to the website
  # it'll look something like /testRetrieveColFromSymbaApi_country?col='colname'
  pass
  return "the column, comma-separated"

if __name__ == '__main__': app.run(host="0.0.0.0", port=5000)
