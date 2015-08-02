(function() {
    var app = angular.module('validatorApp', ['angular.form.validator', 'ui.bootstrap']);

    app.directive('embedCode', ['$http', function ($http) {
        var link = function(scope, element, attrs) {
            if (attrs.fileUrl) {
                $http({ method: 'GET', url: '/' + attrs.fileUrl }).
                success(function (data) {
                    element[0].innerHTML = $("<div>").text(data).html();
                    hljs.highlightBlock(element[0]);
                }).
                error(function () {
                });
            }
        };

        return {
            link: link
        };
    }]);
})();
