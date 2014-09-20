import requests

# returns a dict
def get_geo_from_address(address):
	r = requests.get('http://nominatim.openstreetmap.org/search?q=' + address + '&format=json&polygon=1&addressdetails=1')
	info = r.json()[0]
	geo = {
			'lat': info[u'lat']
			, 'lon': info[u'lon'] 
			}
	return geo

# returns a dict
def get_geo_from_name_and_zip(name, zipcode):
	r = requests.get('http://nominatim.openstreetmap.org/search?q=' + name + ' ' + zipcode + '&format=json&polygon=1&addressdetails=1')
	info = r.json()[0]
	geo = {
			'lat': info[u'lat']
			, 'lon': info[u'lon'] 
			}
	return geo
