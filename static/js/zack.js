if (document.URL.indexOf('/id/') === -1) {
      $('#start').show();
      document.cookie = '';
    } else {
      if (document.cookie === '') {
        var zipcode = prompt("Please enter your zipcode.", "xxxxx");
        document.cookie = zipcode;
      }
      $('#itinerary').show();
      $('#search').show();
    }

    $(function() {
      $('#search-button').bind('click', function() {
        $.getJSON($SCRIPT_ROOT + '/location/' + document.cookie + '/' + 
           encodeURIComponent($('input[name="search"]').val().replace('\'', '')), {
        }, function(data) {
          placeList = $('ol#place-list');
          liList = $('li.place-item');

          var newName = Object.keys(data)[0];
          var newData = data[newName];

          var jsonArr = {
            "id": newData['place_id']
            , "lat": newData['lat']
            , "lon": newData['lon']
            , "name": newName
          };
            placeList.append("<li data-json='" + JSON.stringify(jsonArr) + "' class='place-item'>" + newName + '<span class="delete-button" onclick="removePlace(' + parseInt(liList.length) + ')"><i class="fa fa-trash"></i></span></li>');
          var newMarker = newData;
          newMarker['name'] = newName;
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

              $.post($SCRIPT_ROOT + "/itinerary/" + daId, JSON.stringify(itin), function(data) {
                  console.log("Saved new itinerary order");
                  console.log(data);
              }, "json");
          }
        });
        return false;
      });
    });

    $(function() {
      $('#start-button').bind('click', function() {
        $('#start').slideUp("slow");
        $('#itinerary').show('slide', {direction: 'right'}, 800);
        $('#search').show();
        document.cookie = $('input[name="start-zipcode"]').val();

          $.post($SCRIPT_ROOT + '/itinerary/create', JSON.stringify({"itinerary": []}), function(data) {
          //document.title = 'http://' + window.location.hostname + '/id/' + data.objectId;
          window.history.pushState({"pageTitle":"TEST"},"", 'http://' + window.location.hostname + '/id/' + data.objectId);
        }, "json");
      });
    });
