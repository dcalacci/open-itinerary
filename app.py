from flask import Flask, render_template, request, redirect, url_for, jsonify
import requests

app = Flask(__name__)
app.config.from_object('config')

# returns: 
# { "createdAt": "2014-09-20T18:13:06.612Z", "objectId": "damL3gBx0e" }
@app.route('/itinerary/create', methods=['POST'])
def create_itinerary():
    r = requests.post('https://api.parse.com/1/classes/Itinerary',
            headers=app.config['PARSE_HEADERS'], data=request.get_data())
    return jsonify(r.json())

# returns:
# { "itinerary": [ { "id": "abcdefg", "lat": 12.34, "lon": 34.56, "name": "test" } ] }
@app.route('/itinerary/<parseid>', methods=['GET'])
def get_itinerary(parseid):
    r = requests.get('https://api.parse.com/1/classes/Itinerary/{}'.format(parseid),
            headers=app.config['PARSE_HEADERS'])
    return jsonify(itinerary=r.json()['itinerary'])

# requires JSON to be posted in the following format:
'''
{ "itinerary": [ {
            "id": "abcdefg",
            "name": "test",
            "lat": 12.34,
            "lon": 34.56
        } ] }
''' 
# returns: { "updatedAt": "2014-09-20T17:57:36.171Z" }
@app.route('/itinerary/<parseid>', methods=['POST'])
def update_itinerary(parseid):
    json_header = {'Content-Type': 'application/json'} 
    update_headers = dict(app.config['PARSE_HEADERS'].items() + json_header.items()) 
    r = requests.put('https://api.parse.com/1/classes/Itinerary/{}'.format(parseid), 
            headers=update_headers, data=request.get_data())
    return jsonify(r.json())


@app.route("/")
def hello():
    return render_template('index.html')

# test points

test_itinerary = [{'id': 'osmapid1',
                   'name': 'Test Place 1',
                   'lat': 12.34,
                   'lon': 56.78},

                  {'id': 'osmapid',
                   'name': 'Test Place 2',
                   'lat': 13.34,
                   'lon': 57.78},

                  {'id': 'osmapid',
                   'name': 'Test Place 3',
                   'lat': 14.34,
                   'lon': 56.78}]


@app.route('/test_get_itinerary', methods=['GET'])
def test_get_itinerary():
    print jsonify({'res': test_itinerary})
    return jsonify({'res': test_itinerary})


if __name__ == "__main__":
    app.run(debug=True)
