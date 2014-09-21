import requests
import json
from flask import jsonify

# returns a dict {lat, lon, place_id}
def get_info_from_address(address):
	r = requests.get('http://nominatim.openstreetmap.org/search?q=' + address + '&format=json&polygon=1&addressdetails=1&bounded=1')
	info = r.json()[0]
	geo = {
			'lat': info[u'lat']
			, 'lon': info[u'lon']
			, 'place_id': info[u'place_id']
			}
	return jsonify({address:geo})

# returns a dict {lat, lon, place_id}
def get_info_from_name_and_zip(name, zipcode):
	r = requests.get('http://nominatim.openstreetmap.org/search?q=' + name + ' ' + zipcode + '&format=json&polygon=1&addressdetails=1&bounded=1')
	info = r.json()[0]
	geo = {
			'lat': info[u'lat']
			, 'lon': info[u'lon']
			, 'place_id': info[u'place_id']
			}
	return jsonify({name:geo})

# returns a dict {address, {lat, lon, place_id}}
def get_info_from_many_addresses(addresses):
	res = {}
	for a in addresses:
		geo = get_info_from_address(a)
		res[a] = geo

	return res

# returns a dict {name: {lat, lon}}
def get_info_from_many_names_and_zips(names_and_zips):
	res = {}
	for n in names_and_zips:
		geo = get_info_from_name_and_zip(n['name'], n['zip'])
		res[n['name']] = geo

	return res

def get_info_from_lat_and_lon(lat, lon):
	r = requests.get('http://nominatim.openstreetmap.org/reverse?lat=' + lat + '&lon=' + lon + '&format=json&polygon=1&addressdetails=1')
	info = r.json()
	geo = {
			'lat': lat
			, 'lon': lon
			, 'place_id': info[u'place_id']
			}
	return jsonify(geo)