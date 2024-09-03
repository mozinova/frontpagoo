from flask import Flask, render_template
from docmaker import appBp
from flask_cors import CORS

app=Flask(__name__)
CORS(app)

app.register_blueprint(appBp)

@app.route("/")
def home():
  return render_template("index.html")

@app.route("/signup/")
def signup():
  return render_template("signup.html")
  
if __name__== "__main__":
  app.run()