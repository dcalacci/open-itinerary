import requests
import json

# returns a dict {lat, lon, place_id}
def get_info_from_address(address):
	r = requests.get('http://nominatim.openstreetmap.org/search?q=' + address + '&format=json&polygon=1&addressdetails=1')
	info = r.json()[0]
	geo = {
			'lat': info[u'lat']
			, 'lon': info[u'lon']
			, 'place_id': info[u'place_id']
			}
	return json.dumps(geo, ensure_ascii=False)

# returns a dict {lat, lon, place_id}
def get_info_from_name_and_zip(name, zipcode):
	r = requests.get('http://nominatim.openstreetmap.org/search?q=' + name + ' ' + zipcode + '&format=json&polygon=1&addressdetails=1')
	info = r.json()[0]
	geo = {
			'lat': info[u'lat']
			, 'lon': info[u'lon']
			, 'place_id': info[u'place_id']
			}
	return geo

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

def zipcode_and_addresses(zipcode, addresses):
	res = {}
	addresses = addresses.split(",")
	for a in addresses:
		info = get_info_from_name_and_zip(a, zipcode)
		res[a] = info

	return json.dumps(res, ensure_ascii=False)