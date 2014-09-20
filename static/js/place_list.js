// js for place listing


function updatePlaceList() {
    placeList = $('ul#place-list')
    $.get('/test_get_itinerary',
         function(data) {
             console.log("received list of places:");
             console.log(data);
             var places = data['res'];
             for(i in places) {
                 console.log(places[i].name);
                 placeList.append("<li class='place-item'>" + places[i].name + '</li>');
             }
         })
}


$(document).ready(function() {
    updatePlaceList();

    $("ul#place-list").sortable({
        opacity: 0.6,
        cursor: 'move',
        // save itinerary when user reorders list
        update: function( event, ui ) {
            console.log("got event");
        }
    });
});
