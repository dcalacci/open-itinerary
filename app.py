from flask import *
import fun_requests as f
import requests

app = Flask(__name__)
app.config.from_object('config')


@app.route('/itinerary/create', methods=['POST'])
def create_itinerary():
    """Creates an itinerary with the given JSON itinerary data.

    returns:
        { "createdAt": "2014-09-20T18:13:06.612Z", "objectId": "damL3gBx0e" }
    """
    r = requests.post('https://api.parse.com/1/classes/Itinerary',
                      headers=app.config['PARSE_HEADERS'],
                      data=request.get_data())
    return jsonify(r.json())


@app.route('/itinerary/<parseid>', methods=['GET'])
def get_itinerary(parseid):
    """Gets the itinerary for a given parseid.

    returns:
        { "itinerary": [ { "id": "abcdefg", "lat": 12.34, "lon": 34.56, "name": "test" } ] }
    """
    r = requests.get('https://api.parse.com/1/classes/Itinerary/{}'.format(parseid),
                     headers=app.config['PARSE_HEADERS'])

    return jsonify(itinerary=r.json()['itinerary'])

@app.route('/id/<parseid>', methods=['GET'])
def get_id(parseid):
    """Gets the itinerary for a given parseid.

    returns:
        { "itinerary": [ { "id": "abcdefg", "lat": 12.34, "lon": 34.56, "name": "test" } ] }
    """
    r = requests.get('https://api.parse.com/1/classes/Itinerary/{}'.format(parseid),
                     headers=app.config['PARSE_HEADERS'])

    return render_template('index.html')


@app.route('/itinerary/<parseid>', methods=['POST'])
def update_itinerary(parseid):
    """ Gets the itinerary for a particular parseid

    POST data must follow this format:

        { "itinerary": [ {
                "id": "abcdefg",
                "name": "test",
                "lat": 12.34,
                "lon": 34.56
         }, ] }

    returns:
        { "updatedAt": "2014-09-20T17:57:36.171Z" }
    """
    json_header = {'Content-Type': 'application/json'}
    update_headers = dict(app.config['PARSE_HEADERS'].items() + json_header.items())
    r = requests.put('https://api.parse.com/1/classes/Itinerary/{}'.format(parseid),
                     headers=update_headers, data=request.get_data())
    return jsonify(r.json())


@app.route("/")
def hello():
    return render_template('index.html')


@app.route("/homepage")
def go():
    return render_template('homepage.html')


@app.route("/location/<zipcode>/<addresses>")
def loc(zipcode, addresses):
    return f.zipcode_and_addresses(zipcode, addresses)

if __name__ == "__main__":
    app.run(debug=True)
