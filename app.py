from flask import *
from reverse_proxied import ReverseProxied
import fun_requests as f
import requests
import recommendations

app = Flask(__name__)
app.config.from_object('config')

# reverse proxy stuff for deployment
app.wsgi_app = ReverseProxied(app.wsgi_app)

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
    #print(r.json())
    #print(r.json()['parent'])
    #print(r.json().get('parent', None))

    #return jsonify(itinerary=r.json()['itinerary'], parent=getattr(r.json(), 'parent', None))
    return jsonify(itinerary=r.json()['itinerary'], parent=r.json().get('parent', None))

@app.route('/id/<parseid>', methods=['GET'])
def get_id(parseid):
    """
    Renders a permalink-style page for an itinerary based on a parse-id
    """

    return render_template('index.html')


@app.route('/itinerary/<parseid>', methods=['POST'])
def update_itinerary(parseid):
    """ Updates the itinerary for a particular parseid

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

@app.route('/recommendation', methods=['GET'])
def get_recommendations():
    lat = float(request.args.get('lat'))
    lon = float(request.args.get('lon'))
    radius = int(request.args.get('radius', default=100))
    res = recommendations.get_foursquare_venues(lat, lon, radius)
    return jsonify(res)


@app.route("/")
def hello():
    return render_template('index.html')


@app.route("/homepage")
def go():
    return render_template('homepage.html')


@app.route("/location/<zipcode>/<address>")
def loc(zipcode, address):
	address = address.split(',')
	return f.get_info_from_name_and_zip(address[0], zipcode)

@app.route("/latlon/<lat>/<lon>")
def latlon(lat, lon):
	return f.get_info_from_lat_and_lon(lat, lon)

if __name__ == "__main__":
    app.run(debug=True)
