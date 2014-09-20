// js for place listing


// popup DOM for a particular place. HTML with name, description, etc.
function popupForPlace(place) {
  return "<span id='place-name'>" + place['name'] + "</span><br/>"
}

// adds a given place to the leaflet map as a marker
// TODO: give it an alphabetical or numerical ID
function addPlaceToMap(place) {
    console.log("adding marker: " + popupForPlace(place))
    L.marker([place['lat'], place['lon']]).addTo(map).bindPopup(popupForPlace(place))
}

// updates the place list for the given parseid
function updatePlaceList(parseid) {
    placeList = $('ul#place-list')
    $.get('/itinerary/' + parseid,
          function(data) {
              console.log("received list of places:");
              console.log(data);
              var places = data['itinerary'];
              for(i in places) {
                  console.log(places[i].name);
                  placeList.append("<li data-json='"+JSON.stringify(places[i])+"' class='place-item'>" + places[i].name + '</li>');
                  addPlaceToMap(places[i]);
              }
          });
}

$(document).ready(function() {
    // TODO: change this hardcoded ID to be dynamic
    var testId = 'Mw3O68vpF8';
    updatePlaceList('Mw3O68vpF8');
    $("ul#place-list").sortable({
        opacity: 0.6,
        cursor: 'move',
        // save itinerary when user reorders list
        update: function( event, ui ) {
            var itin = {"itinerary" : []};
            $("ul#place-list").each(function( index ) {
                $(this).find("li").each(function(){
                    console.log($(this).data("json"));
                    itin.itinerary.push($(this).data("json"));
                });
            });
            console.log(itin);
            $.post("/itinerary/" + testId, JSON.stringify(itin, function(data) {
                console.log("Saved new itinerary order")
                console.log(data);
            }, "json");
        }
    });
});
