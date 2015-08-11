'use strict';

/* jasmine specs for directives go here */
// ReSharper disable UndeclaredGlobalVariableUsing

describe('directives', function() {

    var $scope,
        $rootScope,
        $compile,
        $timeout,
        element;

    beforeEach(module('angular.form.validator'));

    describe('required validation', function () {
        beforeEach(inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $compile = $injector.get('$compile');
            $timeout = $injector.get('$timeout');
            $scope = $rootScope.$new();

            element = $compile('<form name="Form">' +
                '<div validator="required">' +
                '<input type="text" name="required" ng-model="required">' +
                '</div>' +
                '</form>')($scope);
            $scope.$digest();
        }));

        it('Initial should be pristine and invalid', function() {
            expect($scope.Form.$pristine).toBe(true);
            expect(element.hasClass('ng-pristine')).toBe(true);
            expect($scope.Form.$valid).toBe(false);
            expect($scope.Form.$invalid).toBe(true);
        });

        it('After Input should be dirty, valid, no error message valid classes set', function () {
            $scope.Form.required.$setViewValue('Required');

            expect($scope.Form.$dirty).toBe(true);
            expect($scope.Form.$valid).toBe(true);
            expect(element.find('p').hasClass('bg-danger')).toBeUndefined(true);
            expect(element.find('div').hasClass('has-success')).toBe(true);
            expect(element.find('div').hasClass('has-feedback')).toBe(true);
        });

        it('After Input should be dirty, invalid, has error message with class "bg-danger"', function () {

            $scope.Form.required.$setViewValue('');

            expect($scope.Form.$dirty).toBe(true);
            expect($scope.Form.$valid).toBe(false);
            expect(element.find('p').hasClass('bg-danger')).toBe(true);
            expect(element.find('div').hasClass('has-error')).toBe(true);
            expect(element.find('div').hasClass('has-feedback')).toBe(true);
        });
    });

    describe('required validation with message', function () {
        beforeEach(inject(function ($injector) {
            $rootScope = $injector.get('$rootScope');
            $compile = $injector.get('$compile');
            $timeout = $injector.get('$timeout');
            $scope = $rootScope.$new();

            element = $compile('<form name="Form">' +
                '<div validator="required[\'this field is required\']">' +
                '<input type="text" name="required" ng-model="required">' +
                '</div>' +
                '</form>')($scope);
            $scope.$digest();
        }));

        it('After Input should be dirty, invalid, has error message set in the form', function () {

            $scope.Form.required.$setViewValue('');

            expect($scope.Form.$dirty).toBe(true);
            expect($scope.Form.$valid).toBe(false);
            expect(element.find('p')[0].innerText).toBe('this field is required');
        });
    });

    describe('string validation', function () {
        beforeEach(inject(function ($injector) {
            $rootScope = $injector.get('$rootScope');
            $compile = $injector.get('$compile');
            $timeout = $injector.get('$timeout');
            $scope = $rootScope.$new();

            element = $compile('<form name="Form">' +
                '<div validator="string[\'2\',\'3\']">' +
                '<input type="text" name="sringLength" ng-model="sringLength">' +
                '</div>' +
                '</form>')($scope);
            $scope.$digest();
        }));

        it('Initial should be pristine and invalid', function () {
            expect($scope.Form.$pristine).toBe(true);
            expect(element.hasClass('ng-pristine')).toBe(true);
            expect($scope.Form.$valid).toBe(false);
            expect($scope.Form.$invalid).toBe(true);
        });

        it('After Input should be dirty, valid, no error message valid classes set', function () {
            $scope.Form.sringLength.$setViewValue('12');

            expect($scope.Form.$dirty).toBe(true);
            expect($scope.Form.$valid).toBe(true);
            expect(element.find('p').hasClass('bg-danger')).toBeUndefined(true);
            expect(element.find('div').hasClass('has-success')).toBe(true);
            expect(element.find('div').hasClass('has-feedback')).toBe(true);
        });

        it('After Input should be dirty, too short, has error message with class "bg-danger"', function () {

            $scope.Form.sringLength.$setViewValue('1');

            expect($scope.Form.$dirty).toBe(true);
            expect($scope.Form.$valid).toBe(false);
            expect(element.find('p').hasClass('bg-danger')).toBe(true);
            expect(element.find('div').hasClass('has-error')).toBe(true);
            expect(element.find('div').hasClass('has-feedback')).toBe(true);
        });

        it('After Input should be dirty, too long, has error message with class "bg-danger"', function () {

            $scope.Form.sringLength.$setViewValue('1234');

            expect($scope.Form.$dirty).toBe(true);
            expect($scope.Form.$valid).toBe(false);
            expect(element.find('p').hasClass('bg-danger')).toBe(true);
            expect(element.find('div').hasClass('has-error')).toBe(true);
            expect(element.find('div').hasClass('has-feedback')).toBe(true);
        });
    });

    describe('string validation with message', function () {
        beforeEach(inject(function ($injector) {
            $rootScope = $injector.get('$rootScope');
            $compile = $injector.get('$compile');
            $timeout = $injector.get('$timeout');
            $scope = $rootScope.$new();

            element = $compile('<form name="Form">' +
                '<div validator="string[\'2\',\'3\',\'invalid string\']">' +
                '<input type="text" name="sringLength" ng-model="sringLength">' +
                '</div>' +
                '</form>')($scope);
            $scope.$digest();
        }));

        it('After Input should be dirty, invalid, has error message set in the form', function () {

            $scope.Form.sringLength.$setViewValue('1');

            expect($scope.Form.$dirty).toBe(true);
            expect($scope.Form.$valid).toBe(false);
            expect(element.find('p')[0].innerText).toBe('invalid string');
        });
    });
    
    describe('number validation', function () {
        beforeEach(inject(function ($injector) {
            $rootScope = $injector.get('$rootScope');
            $compile = $injector.get('$compile');
            $timeout = $injector.get('$timeout');
            $scope = $rootScope.$new();

            element = $compile('<form name="Form">' +
                '<div validator="number[\'100\',\'200\']">' +
                '<input type="text" name="numberValidation" ng-model="numberValue">' +
                '</div>' +
                '</form>')($scope);
            $scope.$digest();
        }));

        it('Initial should be pristine and invalid', function () {
            expect($scope.Form.$pristine).toBe(true);
            expect(element.hasClass('ng-pristine')).toBe(true);
            expect($scope.Form.$valid).toBe(false);
            expect($scope.Form.$invalid).toBe(true);
        });
        
        it('After Input should be dirty, invalid, form should be invalid', function () {
            $scope.Form.numberValidation.$setViewValue('');

            expect($scope.Form.$dirty).toBe(true);
            expect($scope.Form.$valid).toBe(false);
            expect(element.find('div').hasClass('has-error')).toBe(true);
            expect(element.find('div').hasClass('has-feedback')).toBe(true);
        });

        it('After Input should be dirty, valid, no error message valid classes set', function () {
            $scope.Form.numberValidation.$setViewValue('120');

            expect($scope.Form.$dirty).toBe(true);
            expect($scope.Form.$valid).toBe(true);
            expect(element.find('p').hasClass('bg-danger')).toBeUndefined(true);
            expect(element.find('div').hasClass('has-success')).toBe(true);
            expect(element.find('div').hasClass('has-feedback')).toBe(true);
        });

        it('After Input should be dirty, too small, has error message with class "bg-danger"', function () {

            $scope.Form.numberValidation.$setViewValue('99');

            expect($scope.Form.$dirty).toBe(true);
            expect($scope.Form.$valid).toBe(false);
            expect(element.find('p').hasClass('bg-danger')).toBe(true);
            expect(element.find('div').hasClass('has-error')).toBe(true);
            expect(element.find('div').hasClass('has-feedback')).toBe(true);
        });

        it('After Input should be dirty, too large, has error message with class "bg-danger"', function () {

            $scope.Form.numberValidation.$setViewValue('201');

            expect($scope.Form.$dirty).toBe(true);
            expect($scope.Form.$valid).toBe(false);
            expect(element.find('p').hasClass('bg-danger')).toBe(true);
            expect(element.find('div').hasClass('has-error')).toBe(true);
            expect(element.find('div').hasClass('has-feedback')).toBe(true);
        });
    });

    describe('number validation with message', function () {
        beforeEach(inject(function ($injector) {
            $rootScope = $injector.get('$rootScope');
            $compile = $injector.get('$compile');
            $timeout = $injector.get('$timeout');
            $scope = $rootScope.$new();

            element = $compile('<form name="Form">' +
                '<div validator="string[\'100\',\'200\',\'invalid number\']">' +
                '<input type="text" name="sringLength" ng-model="sringLength">' +
                '</div>' +
                '</form>')($scope);
            $scope.$digest();
        }));

        it('After Input should be dirty, invalid, has error message set in the form', function () {

            $scope.Form.sringLength.$setViewValue('1');

            expect($scope.Form.$dirty).toBe(true);
            expect($scope.Form.$valid).toBe(false);
            expect(element.find('p')[0].innerText).toBe('invalid number');
        });
    });
    
    describe('regex validation', function () {
        beforeEach(inject(function ($injector) {
            $rootScope = $injector.get('$rootScope');
            $compile = $injector.get('$compile');
            $timeout = $injector.get('$timeout');
            $scope = $rootScope.$new();

            element = $compile('<form name="Form">' +
                '<div validator="regex[\'\\S+@\\S+\\.\\S+\']">' +
                '<input type="text" name="regexValidation" ng-model="email">' +
                '</div>' +
                '</form>')($scope);
            $scope.$digest();
        }));

        it('Initial should be pristine and invalid', function () {
            expect($scope.Form.$pristine).toBe(true);
            expect(element.hasClass('ng-pristine')).toBe(true);
            expect($scope.Form.$valid).toBe(false);
            expect($scope.Form.$invalid).toBe(true);
        });
        
        it('After Input should be dirty, invalid, form should be invalid', function () {
            $scope.Form.regexValidation.$setViewValue('aa_bb.com');

            expect($scope.Form.$dirty).toBe(true);
            expect($scope.Form.$valid).toBe(false);
            expect(element.find('p').hasClass('bg-danger')).toBe(true);
            expect(element.find('div').hasClass('has-error')).toBe(true);
            expect(element.find('div').hasClass('has-feedback')).toBe(true);
        });

        it('After Input should be dirty, valid, no error message valid classes set', function () {
            $scope.Form.regexValidation.$setViewValue('aa@bb.com');

            expect($scope.Form.$dirty).toBe(true);
            expect($scope.Form.$valid).toBe(true);
            expect(element.find('p').hasClass('bg-danger')).toBeUndefined(true);
            expect(element.find('div').hasClass('has-success')).toBe(true);
            expect(element.find('div').hasClass('has-feedback')).toBe(true);
        });
    });

    describe('regex validation with message', function () {
        beforeEach(inject(function ($injector) {
            $rootScope = $injector.get('$rootScope');
            $compile = $injector.get('$compile');
            $timeout = $injector.get('$timeout');
            $scope = $rootScope.$new();

            element = $compile('<form name="Form">' +
                '<div validator="regex[\'\\S+@\\S+\\.\\S+\',\'value should match pattern\']">' +
                '<input type="text" name="regexValidation" ng-model="email">' +
                '</div>' +
                '</form>')($scope);
            $scope.$digest();
        }));

        it('After Input should be dirty, invalid, has error message set in the form', function () {
            $scope.Form.regexValidation.$setViewValue('aa_bb.com');

            expect($scope.Form.$dirty).toBe(true);
            expect($scope.Form.$valid).toBe(false);
            expect(element.find('p')[0].innerText).toBe('value should match pattern');
        });
    });
});
