// add the recommendations layer
var recommendationsLayer = new L.FeatureGroup();
map.addLayer(recommendationsLayer);


// adding click handler to popups
map.on('popupopen', function() {
    $('.recommendations-button').click(function(e) {
        var lat = $(this).data('lat');
        var lon = $(this).data('lon');
        $.get('/recommendation',
              {'lat': lat,
               'lon': lon},
              function(data) {
                  venues = data['groups'][0]['items']
                  console.log("venues::::");
                  console.log(venues);
                  recommendationsLayer.clearLayers();
                  // add new recommendations
                  for(i in venues) {
                      console.log("examining" + venues[i]);
                      addRecommendedPlace(venues[i]['venue']);
                  }
              });
    });
});


// gets the popup HTML for this recommendation
function getPopupForRec(rec) {
    return "<span>" + rec['name'] + "</span>"
}

// add a recommendation/foursquare venue to map
function addRecommendedPlace(rec) {
    console.log(rec);
    var lat = rec['location']['lat'];
    var lon = rec['location']['lng'];
    var recMarker = new L.marker(new L.LatLng(lat, lon), {
        // bouncy
        bounceOnAdd: true
    });
    recMarker.bindPopup(getPopupForRec(rec));

    recommendationsLayer.addLayer(recMarker);
}
