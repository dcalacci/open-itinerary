from flask import Flask, render_template, request, redirect, url_for, jsonify
from flaskext.lesscss import lesscss
app = Flask(__name__)

# less -> css
lesscss(app)

@app.route("/")
def hello():
    return render_template('index.html')


if __name__ == "__main__":
    app.run(debug=True)
