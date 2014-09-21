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

    $('.add-recommendation').click(function(e) {
        var name = $(this).attr('data-name');
        $.get('/latlon/' + $(this).attr('data-lat')+ '/' + $(this).attr('data-lon'),
          function(data) {
            placeList = $('ol#place-list');
            liList = $('li.place-item');

            data['name'] = name;

            console.log(data);
            console.log(JSON.stringify(data));

            placeList.append("<li data-json='" + JSON.stringify(data) + "' class='place-item'>" + name + '</li>');
            var newMarker = data;
            addPlaceToMap(newMarker, parseInt(liList.length)+1, true);

            var url = document.URL;
            if (url.indexOf("/id/") > -1) {
                url = url.split('/');
                var daId = url[4];

                var itin = {"itinerary" : []};
                $("ol#place-list").each(function( index ) {
                    $(this).find("li").each(function(){
                        itin.itinerary.push($(this).data("json"));
                    });
                });

                $.post("/itinerary/" + daId, JSON.stringify(itin), function(data) {
                    console.log("Saved new itinerary order");
                    console.log(data);
                }, "json");
            }
          });
    });    
});


// gets the popup HTML for this recommendation
function getPopupForRec(rec) {
    console.log(rec);
    return "<span>" + rec['name'] 
      + "</span><br /><a href='#' data-lat='" + rec['location']['lat'] 
      + "' data-lon='" + rec['location']['lng']  + "' data-name='" + rec['name'] + "' class='add-recommendation'>Click to add to your itinerary.</a>"
}

// add a recommendation/foursquare venue to map
function addRecommendedPlace(rec) {
    console.log(rec);
    var lat = rec.location.lat;
    var lon = rec.location.lng;
    var recMarker = new L.marker(new L.LatLng(lat, lon), {
        // bouncy
        bounceOnAdd: true
    });
    recMarker.bindPopup(getPopupForRec(rec));

    recommendationsLayer.addLayer(recMarker);
}
