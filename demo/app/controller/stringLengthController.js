(function () {
    angular.module('validatorApp').controller('stringLength', ['$scope', function ($scope) {
        $scope.model = { field2To3: '', field2To3CustomMsg : '' };
    }]);
})();