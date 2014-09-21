(function() {
    var app = angular.module('itineraryApp', ['ngAutocomplete']); // initialize app

    app.controller('autocompCtrl', function ($scope) {
        // see http://plnkr.co/edit/il2J8qOI2Dr7Ik1KHRm8?p=preview
        // for good examples
        $scope.result = '';
        $scope.options = {};
        $scope.details = '';
        $scope.watchForm = function () {
            return $scope.form
        };
        $scope.$watch($scope.watchForm, function () {
            $scope.checkForm()
        }, true);

        $scope.checkForm = function() {
            $scope.options = {};
        };
    });
})();
