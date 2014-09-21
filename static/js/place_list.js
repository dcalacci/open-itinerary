// js for place listing

// updates the place list for the given parseid
function updatePlaceList(parseid) {
    placeList = $('ol#place-list')
    $.get('/itinerary/' + parseid,
        function(data) {
            console.log("received list of places:");
            console.log(data);
            var places = data['itinerary'];
            for(i in places) {
                console.log(places[i].name);
                placeList.append("<li data-json='"+JSON.stringify(places[i])+"' class='place-item'>" + places[i].name + '<button class="delete-button" onclick="removePlace(' + parseInt(i) + ')">X</button></li>');
                addPlaceToMap(places[i], (parseInt(i)+1), true);
            }
        });
}

// remove a place from the itinerary
function removePlace(num) {
    // find itinerary id
    var url = document.URL;
    if (url.indexOf("/id/") > -1) {
        url = url.split('/');
        var daId = url[4];
    }
    // build itinerary
    var itin = {"itinerary" : []};
    $("ol#place-list").each(function( index ) {
        //console.log(index);
        $(this).find("li").each(function(i){
            //console.log(i);
            console.log($(this).data("json"));
            itin.itinerary.push($(this).data("json"));
            if (i === num) {
                $(this).remove()
            } 
            else if (i > num) {
                //$(this).click(removePlace(parseInt(i)-1));
                $('ol#place-list').on("click", "button.delete-button", function(){removePlace(parseInt(i)-1);});
            } 
        });
    });
    // remove place from itinerary
    itin['itinerary'].splice(num, 1);
    console.log(itin);
    if (daId !== undefined) {
        $.post("/itinerary/" + daId, JSON.stringify(itin), function(data) {
            console.log("Saved new itinerary order");
            console.log(data);
        }, "json");
        // redraw markers
        console.log("refreshed placesLayer...")
        placesLayer.clearLayers();
        var places = itin['itinerary'];
        for (i in places) {
          addPlaceToMap(places[i], (parseInt(i)+1), false);
        }
        //map.fitBounds(placesLayer.getBounds());
    }

}

$(document).ready(function() {

    var url = document.URL;
    if (url.indexOf("/id/") > -1) {
        url = url.split('/');
        var daId = url[4];
        updatePlaceList(daId);
    }

    // place list, click & hover:

    // mouse hover on, color to blue
    $('ol#place-list').on('mouseover', 'li.place-item',function() {
        console.log('place item hovering');
        var placeLat = $(this).data('json')['lat'];
        var placeLon = $(this).data('json')['lon'];
        $(this).animate({color: 'rgb(42, 136, 199)', borderColor: 'rgb(42, 136, 199)'}, 300);
        placesLayer.eachLayer(function(marker) {
            var marker_lat = marker['_origLatlng']['lat'];
            var marker_lon = marker['_origLatlng']['lng'];
            if (placeLat == marker_lat && placeLon == marker_lon) {
                marker.bounce({duration: 300, height: 75});
            }
        });
    });

    // mouse out, color back to normal
    $('ol#place-list').on('mouseout', 'li.place-item', function() {
        $(this).animate({color: '#373737', borderColor: '#373737'}, 100);
    });

    $('ol#place-list').on('click', 'li.place-item', function() {
        var placeLat = $(this).data('json')['lat'];
        var placeLon = $(this).data('json')['lon'];
        placesLayer.eachLayer(function(marker) {
            var marker_lat = marker['_origLatlng']['lat'];
            var marker_lon = marker['_origLatlng']['lng'];
            if (placeLat == marker_lat && placeLon == marker_lon) {
                marker.openPopup();
            }
        });
    })


    $("ol#place-list").sortable({
        opacity: 0.6,
        cursor: 'move',
        // save itinerary when user reorders list
        update: function( event, ui ) {
            var itin = {"itinerary" : []};
            $("ol#place-list").each(function( index ) {
                $(this).find("li").each(function(){
                    console.log($(this).data("json"));
                    itin.itinerary.push($(this).data("json"));
                });
            });
            console.log(itin);
            if (daId !== undefined) {
                $.post("/itinerary/" + daId, JSON.stringify(itin), function(data) {
                    console.log("Saved new itinerary order");
                    console.log(data);
                }, "json");
                // redraw markers
                console.log("refreshed placesLayer...")
                placesLayer.clearLayers();
                var places = itin['itinerary'];
                for (i in places) {
                  addPlaceToMap(places[i], (parseInt(i)+1), false);
                }
                //map.fitBounds(placesLayer.getBounds());
            }
        }
    });
});
