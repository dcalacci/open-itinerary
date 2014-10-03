# debug
DEBUG = True

# required headers when making parse requests
with open('/var/www/keys/open-itinerary.txt', 'rb') as f:
    keys = [key.strip() for key in f.readlines()]

PARSE_HEADERS = {
        'X-Parse-Application-Id': keys[0],
        'X-Parse-REST-API-Key': keys[1]
        }
