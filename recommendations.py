import requests
import json


def get_foursquare_venues(lat, lon, radius, section='topPicks'):
    data = requests.get('https://api.foursquare.com/v2/venues/explore',
                        params={'ll': '{0},{1}'.format(lat, lon),
                            #'near': 'Boston, MA',
                                'client_id': 'ZUDSL5DMLLDATSU3KOY2BAQOJPPLT01ZKHQMHUNLIBYZLOPR',
                                'client_secret': 'RS0F55CWISG4AAJVYQ4WXQMKADNMO5CVTPYJUYHPGCJ22TA2',
                                'v': '20140920',
                                'radius': radius,
                                'limit': 5,
                                'section': section})
    return data.json()['response']
