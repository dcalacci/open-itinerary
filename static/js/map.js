// map javascript. mostly taken from the leaflet.js example page right now
//
//
// Custom numbered markers
L.NumberedDivIcon = L.Icon.extend({
    options: {
    iconUrl: '/static/images/marker_hole.png',
    number: '',
    shadowUrl: null,
    iconSize: new L.Point(25, 41),
        iconAnchor: new L.Point(13, 41),
        popupAnchor: new L.Point(0, -33),
        /*
        iconAnchor: (Point)
        popupAnchor: (Point)
        */
        className: 'leaflet-div-icon'
    },

    createIcon: function () {
        var div = document.createElement('div');
        var img = this._createImg(this.options['iconUrl']);
        var numdiv = document.createElement('div');
        numdiv.setAttribute ( "class", "number" );
        numdiv.innerHTML = this.options['number'] || '';
        div.appendChild ( img );
        div.appendChild ( numdiv );
        this._setIconStyles(div, 'icon');
        return div;
    },

    //you could change this to add a shadow like in the normal marker if you really wanted
    createShadow: function () {
        return null;
    }
});

// create map
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
function addPlaceToMap(place, num, redraw) {
    console.log("adding marker: " + popupForPlace(place))
    //var marker = L.marker([place['lat'], place['lon']]);
    console.log("num:")
    console.log(num)
    var marker = new L.marker(new L.LatLng(place['lat'], place['lon']), {
        icon: new L.NumberedDivIcon({number: num.toString()})
    });
    marker.bindPopup(popupForPlace(place));
    placesLayer.addLayer(marker);
    if (redraw) {
        map.fitBounds(placesLayer.getBounds());
    }
}

function drawRoute(arr) {
    for (a in arr) {
        console.log(arr);
        L.Routing.control({
            waypoints: a
        }).addTo(map);
    }
}
