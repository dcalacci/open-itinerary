// returns true if the given layer is a routing layer.  looks to see
// if a) the layer has sub-layers equal to 1 + the number of points on
// the map, and b) if n-1 of those layers have latlng attributes (the
// extra one is the line)
function isRoutingLayer(layer) {
    markers = placesLayer.eachLayer(function(marker) {return marker});
    numMarkers = markers.length;

    totalCount = 0
    latLonCount = 0
    layer.eachLayer(function(layer) {
        count += 1;
        if (layer.hasOwnProperty('_latlng')) {
            latLonCount += 1
        }
    });
    if (totalCount == numMarkers + 1 && latLonCount == totalCount - 1) {
        return true
    } else {
        return false
    }
}

function removePointsFromRoutingLayer(layer) {
    var layer = layer;
    keepLayers = [];
    layer.eachLayer(function(layer) {
        if (!('_latlng' in layer)) {
            keepLayers.append(layer);
        }
    });
    delete layer['_layers'];
    layer['_layers'] = keepLayers;
    return layer;
}

// ------------


function drawRoute(points) {
    //TODO: clear the routing layer?
    points = _.map(points, function(p) { return {'latLng': {'lat': p[0], 'lng': p[1]}}})
    console.log(points);
    dir.route({'locations': points});
    map.addLayer(
        removePointsFromRoutingLayer(MQ.routing.routeLayer({
            'directions': dir,
            'fitBounds': true
        })));
}

// keep track of the routing control
var control = null;
function drawPlaceRoute() {
    if (control) {
        control.removeFrom(map);
    }
    markers = placesLayer.eachLayer(function(m) {return m})['_layers'];
    points = _.map(markers, function(p) {
        return [p['_origLatlng']['lat'], p['_origLatlng']['lng']]
    });
    points = _.map(points, function(p) {
        return L.latLng(p[0], p[1])
    });
    control = L.Routing.control({waypoints: points});
    control.addTo(map);
    // control.spliceWaypoints(0, points.length);
    // routeline = L.Routing.line(routes[0]);
    // console.log("map:");
    // console.log(map);

    console.log('route?');
    console.log(L.Routing.plan);
}



// permutes a list
function permute(l) {
    permutations = []
    for (var i = 0; i < l.length; i++) {
        for (var j = i+1; j < l.length; j++) {
            permutations.push([l[i], l[j]])
        }
    }
    return permutations
}
