// js for place listing


// popup DOM for a particular place. HTML with name, description, etc.
function popupForPlace(place) {
  "<span id='place-name'>" + place['name'] + "</span><br/>"
}

// adds a given place to the leaflet map as a marker
// TODO: give it an alphabetical or numerical ID
function addPlaceToMap(place) {
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
                  placeList.append("<li class='place-item'>" + places[i].name + '</li>');
                  addPlaceToMap(places[i]);
              }
          });
}


$(document).ready(function() {
    {% if itinerary %}
    updatePlaceList({% itinerary %});
    {% endif %}
    $("ul#place-list").sortable({
        opacity: 0.6,
        cursor: 'move'
    });
});
