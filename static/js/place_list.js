// js for place listing

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
                  addPlaceToMap(places[i], (parseInt(i)+1));
              }
          });
}


$(document).ready(function() {
    var url = document.URL;
    if (url.indexOf("/id/") > -1) {
        url = url.split('/');
        var daId = url[4];
        updatePlaceList(daId);
    }
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
            if (daId !== undefined) {
                $.post("/itinerary/" + daId, JSON.stringify(itin), function(data) {
                    console.log("Saved new itinerary order");
                    console.log(data);
                }, "json");
            }
        }
    });
});
