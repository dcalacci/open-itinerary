// js for place listing

function forkItinerary() {
    var id = getParseId(); 
    $.get($SCRIPT_ROOT + '/itinerary/' + id, function(data) {
        var fork = data;
        
        fork['parent'] = id;
        console.log(fork);
        $.post('/itinerary/create', JSON.stringify(fork), function(data) {
            //var forkId = data.objectId;
            console.log(data);
            window.history.pushState({"pageTitle":"TEST"},"", 'http://' + window.location.hostname + '/id/' + data.objectId);
            // it seems like the data is okay. when forked, adding new places adds them to the child
            // and I think everything else just works via URL
            // the one thing to update is the "Forked from" text
            //
            $('div#fork').html('<a class="fork-link" href="/id/' + fork['parent'] + '"> @' + fork['parent'] + '</a>');
        }, 'json'); 
    });
}

function getParseId() {
    var url = document.URL;
    if (url.indexOf("/id/") > -1) {
        url = url.split('/');
        var daId = url[4];
        if (daId.indexOf('#') > -1) {
            daId = daId.substring(0, daId.length - 1)
        }
        return daId;
    }
}

// updates the place list for the given parseid
function updatePlaceList(parseid) {
    placeList = $('ol#place-list')
    liList = $('li.place-item');
    $.get($SCRIPT_ROOT + '/itinerary/' + parseid,
        function(data) {
            if (data['parent']) { // our list is a fork, so we need to indicate that somewhere
                console.log('PARENT')
                $('div#fork').html('<a class="fork-link" href="/id/' + data['parent'] + '">@' + data['parent'] + '</a>');
            }
            console.log("received list of places:");
            console.log(data);
            var places = data['itinerary'];
            for(i in places) {
                console.log(places[i].name);
                placeList.append("<li data-json='"+JSON.stringify(places[i])+"' class='place-item'>" + places[i].name + '<span class="delete-button" onclick="removePlace(' + parseInt(liList.length) + ')"><i class="fa fa-trash"></i></span></li>');
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
        $.post($SCRIPT_ROOT + "/itinerary/" + daId, JSON.stringify(itin), function(data) {
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
        map.fitBounds(placesLayer.getBounds());
    }
    // refresh route
    drawPlaceRoute();

}
var showRouting = 0;
$(function() {
    setTimeout(function() {
        var button = document.createElement('button');
        button.type = 'button';
        button.id = 'show-routing-container';
        button.className = 'pure-button pure-button-primary';
        button.appendChild(document.createTextNode('Show/Hide'));
        $('.leaflet-routing-container').append(button);

        $('.leaflet-routing-container #show-routing-container').click(function() {
            if (showRouting == 0) {
            $('.leaflet-routing-container').animate({height: '200px'}, 500);
                showRouting = 1;
            } else {
                $('.leaflet-routing-container').animate({height: '50px'}, 500);
                showRouting = 0;
            }
        });
    }, 2500);
});


$(document).ready(function() {

    // $('#show-routing-container').detach().appendTo('.leaflet-routing-alt h2');

    $('#route-recommend').click(function() {
       getRecommendationsForRoute();
    });

    
    $("#show-routing-container").click(function() {
        if (showRouting == 0) {
            $('.leaflet-routing-container').animate({height: '200px'}, 500);
            
            showRouting = 1;
        } else {
            $('.leaflet-routing-container').animate({height: '50px'}, 500);
            showRouting = 0;
        }
    });

    var url = document.URL;
    if (url.indexOf("/id/") > -1) {
        url = url.split('/');
        var daId = url[4];
        updatePlaceList(daId);
    }

    // routing
    $('#route-button').click(function() {
        drawPlaceRoute();
    })

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
                $.post($SCRIPT_ROOT + "/itinerary/" + daId, JSON.stringify(itin), function(data) {
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
            drawPlaceRoute();
        }
    });
});
