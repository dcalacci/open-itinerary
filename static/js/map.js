// map javascript. mostly taken from the leaflet.js example page right now

var map = L.map('map').setView([51.505, -0.09], 13);

// add mapbox tile layer
L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
				'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
				'Imagery © <a href="http://mapbox.com">Mapbox</a>',
		id: 'examples.map-i875mjb7'
}).addTo(map);

// add our places layer.

var placesLayer = new L.FeatureGroup();
map.addLayer(placesLayer);


// popup DOM for a particular place. HTML with name, description, etc.
function popupForPlace(place) {
    return "<span id='place-name'>" + place['name'] + "</span><br/>"
}


// adds a given place to the leaflet map as a marker on the 'places' layer.
// also sets the zoom level / bounding box around existing points
function addPlaceToMap(place) {
    console.log("adding marker: " + popupForPlace(place))
    var marker = L.marker([place['lat'], place['lon']]);
    marker.bindPopup(popupForPlace(place));
    placesLayer.addLayer(marker);
    map.fitBounds(placesLayer.getBounds());
}
