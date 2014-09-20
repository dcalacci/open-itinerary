from flask import Flask, render_template, request, redirect, url_for, jsonify
app = Flask(__name__)

@app.route("/")
def hello():
    return render_template('index.html')

if __name__ == "__main__":
    app.run(debug=True)


# test points

test_itinerary = """
[ {
           'id' : 'osmapid1',
           'name' : 'Test Place 1',
           'lat' : 12.34,
           'lon' : 56.78
       },
  {
           'id' : 'osmapid',
           'name' : 'Test Place 2',
           'lat' : 13.34,
           'lon' : 57.78
       },
 {
           'id' : 'osmapid',
           'name' : 'Test Place 3',
           'lat' : 14.34,
           'lon' : 56.78
       }]
"""


@app.route("/test/get_itinerary")
def test_get_itinerary():
    return jsonify(test_itinerary)
