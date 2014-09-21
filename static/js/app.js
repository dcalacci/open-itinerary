(function() {
    var app = angular.module('itineraryApp', ['ngAutocomplete']); // initialize app

    app.controller('autocompCtrl', function ($scope, $http) {
        // see http://plnkr.co/edit/il2J8qOI2Dr7Ik1KHRm8?p=preview
        // for good examples
        $scope.options = {};
        var zip = document.cookie;
        $http.get('http://nominatim.openstreetmap.org/search?q=' + zip +'&format=json&polygon=1&addressdetails=1').success(function(data) {
            //console.log("NGNGNGNG")
            //console.log(data);
            var bb = data[0]['boundingbox'];
            console.log(bb);
            var NE = new google.maps.LatLng(bb[1], bb[3]);
            var SW = new google.maps.LatLng(bb[0], bb[2]);
            var bounds = new google.maps.LatLngBounds(SW, NE);
            $scope.options.bounds = bounds;
            console.log('Added bounds to autocomplete');
            console.log(bounds);
        });
        $scope.result = '';
        $scope.details = '';
        $scope.watchForm = function () {
            return $scope.form
        };
        $scope.$watch($scope.watchForm, function () {
            $scope.checkForm()
        }, true);

        $scope.checkForm = function() {
            //$scope.options = {};
        };
    });
})();
