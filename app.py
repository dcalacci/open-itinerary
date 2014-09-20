from flask import Flask, request, jsonify
import requests

app = Flask(__name__)
app.config.from_object('config')

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

@app.route('/')
def hello():
    return 'Hello World!'

if __name__ == '__main__':
    app.run(debug=True)
