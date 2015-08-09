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

    describe('basic validation structure', function () {
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

        it('After Input should be dirty, valid, has class "has-success has-feedback"', function () {

            $scope.Form.required.$setViewValue('Required');

            expect($scope.Form.$dirty).toBe(true);
            expect(element.hasClass('ng-dirty')).toBe(true);
            expect($scope.Form.$valid).toBe(true);
            expect(element.hasClass('ng-valid')).toBe(true);
            expect(element.find('div').hasClass('has-success')).toBe(true);
            expect(element.find('div').hasClass('has-feedback')).toBe(true);
        });

        it('After Input should be dirty, valid, no error message', function () {
            $scope.Form.required.$setViewValue('Required');

            expect($scope.Form.$dirty).toBe(true);
            expect($scope.Form.$valid).toBe(true);
            expect(element.find('p').hasClass('bg-danger')).toBeUndefined(true);
        });

        it('After Input should be dirty, invalid, has class "has-error has-feedback"', function () {

            $scope.Form.required.$setViewValue('');

            expect($scope.Form.$dirty).toBe(true);
            expect(element.hasClass('ng-dirty')).toBe(true);
            expect($scope.Form.$valid).toBe(false);
            expect(element.hasClass('ng-invalid')).toBe(true);
            expect(element.find('div').hasClass('has-error')).toBe(true);
            expect(element.find('div').hasClass('has-feedback')).toBe(true);
        });

        it('After Input should be dirty, invalid, has error message with class "bg-danger"', function () {

            $scope.Form.required.$setViewValue('');

            expect($scope.Form.$dirty).toBe(true);
            expect($scope.Form.$valid).toBe(false);
            expect(element.find('p').hasClass('bg-danger')).toBe(true);
        });
    });
    
    describe('validation based on parameters', function () {
        beforeEach(inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $compile = $injector.get('$compile');
            $timeout = $injector.get('$timeout');
            $scope = $rootScope.$new();

            element = $compile('<form name="Form">' +
                '<div validator="required[validationEnabled,validationMessage]">' +
                '<input type="text" name="required" ng-model="required">' +
                '</div>' +
                '</form>')($scope);
            $scope.$digest();
        }));

        it('When validation enabled, Initial should be pristine and invalid', function() {
            $scope.validationEnabled = true;
            $scope.$digest();
            
            expect($scope.Form.$pristine).toBe(true);
            expect(element.hasClass('ng-pristine')).toBe(true);
            expect($scope.Form.$valid).toBe(false);
            expect($scope.Form.$invalid).toBe(true);
        });

        it('When validation disabled, Initial should be pristine and valid', function() {
            $scope.validationEnabled = false;
            $scope.$digest();
            
            expect($scope.Form.$pristine).toBe(true);
            expect(element.hasClass('ng-pristine')).toBe(true);
            expect($scope.Form.$valid).toBe(true);
            expect($scope.Form.$invalid).toBe(false);
        });
        
        it('When validation enabled with custom error message, should show error message', function() {
            $scope.validationEnabled = true;
            $scope.validationMessage = 'Test Message';
            $scope.$digest();
            
            $scope.Form.required.$setViewValue('');
            
            expect($scope.Form.$valid).toBe(false);
            expect($scope.Form.$invalid).toBe(true);
            expect(element.find('p').text()).toBe('Test Message');
        });
    });

    describe('override input name', function () {
        beforeEach(inject(function ($injector) {
            $rootScope = $injector.get('$rootScope');
            $compile = $injector.get('$compile');
            $timeout = $injector.get('$timeout');
            $scope = $rootScope.$new();

            element = $compile('<form name="Form">' +
                '<div validator="required" v-input="required2">' +
                '<input type="text" name="required" ng-model="required">' +
                '<input type="text" name="required2" ng-model="required2">' +
                '</div>' +
                '</form>')($scope);
            $scope.$digest();
        }));

        it('After Input should be dirty, valid, has class "has-success has-feedback"', function () {

            $scope.Form.required2.$setViewValue('');
            $scope.Form.required2.$setViewValue('Required');

            expect($scope.Form.$dirty).toBe(true);
            expect(element.hasClass('ng-dirty')).toBe(true);
            expect(element.hasClass('ng-valid')).toBe(true);
            expect(element.find('div').hasClass('has-success')).toBe(true);
            expect(element.find('div').hasClass('has-feedback')).toBe(true);
        });
    });

    describe('style overide element', function() {
        beforeEach(inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $compile = $injector.get('$compile');
            $timeout = $injector.get('$timeout');
            $scope = $rootScope.$new();

            element = $compile('<form name="Form">' +
                '<div validator="required" v-style-success="divSuccess" v-style-error="divError" v-style-error-message="divMessage">' +
                '<input type="text" name="required" ng-model="required">' +
                '</div>' +
                '</form>')($scope);
            $scope.$digest();
        }));

        it('After Input should be dirty, valid, has class "divSuccess"', function () {

            $scope.Form.required.$setViewValue('Required');
            expect(element.find('div').hasClass('divSuccess')).toBe(true);
        });

        it('After Input should be dirty, invalid, has class "divError"', function () {

            $scope.Form.required.$setViewValue('');
            expect(element.find('div').hasClass('divError')).toBe(true);
        });

        it('After Input should be dirty, invalid, has error message with class "divMessage"', function () {

            $scope.Form.required.$setViewValue('');
            expect(element.find('p').hasClass('divMessage')).toBe(true);
        });
    });

    describe('style overide scope', function () {
        beforeEach(inject(function ($injector) {
            $rootScope = $injector.get('$rootScope');
            $compile = $injector.get('$compile');
            $timeout = $injector.get('$timeout');
            $scope = $rootScope.$new();
            $scope.validator = { successStyle: 'scopeSuccess', errorStyle: 'scopeError', errorMessageStyle: 'scopeMessage' };
            
            element = $compile('<form name="Form">' +
                '<div validator="required" >' +
                '<input type="text" name="required" ng-model="required">' +
                '</div>' +
                '</form>')($scope);
            $scope.$digest();
        }));

        it('After Input should be dirty, valid, has class "scopeSuccess"', function () {
            $scope.Form.required.$setViewValue('Required');
            expect(element.find('div').hasClass('scopeSuccess')).toBe(true);
        });

        it('After Input should be dirty, invalid, has class "scopeError"', function () {
            $scope.Form.required.$setViewValue('');
            expect(element.find('div').hasClass('scopeError')).toBe(true);
        });

        it('After Input should be dirty, invalid, has error message with class "scopeMessage"', function () {
            $scope.Form.required.$setViewValue('');
            expect(element.find('p').hasClass('scopeMessage')).toBe(true);
        });
    });

    describe('style overide form', function () {
        beforeEach(inject(function ($injector) {
            $rootScope = $injector.get('$rootScope');
            $compile = $injector.get('$compile');
            $timeout = $injector.get('$timeout');
            $scope = $rootScope.$new();
            $scope.validator = {};
            $scope.validator.testForm = {
                successStyle: 'formSuccess',
                errorStyle: 'formError',
                errorMessageStyle: 'formMessage'
            };

            element = $compile('<div ng-form name="testForm">' +
                '<div validator="required">' +
                '<input type="text" name="required" ng-model="required">' +
                '</div>' +
                '</div>')($scope);
            $scope.$digest();
        }));

        it('After Input should be dirty, valid, has class "formSuccess"', function () {
            $scope.testForm.required.$setViewValue('Required');
            expect(element.find('div').hasClass('formSuccess')).toBe(true);
        });

        it('After Input should be dirty, invalid, has class "formError"', function () {
            $scope.testForm.required.$setViewValue('');
            expect(element.find('div').hasClass('formError')).toBe(true);
        });

        it('After Input should be dirty, invalid, has error message with class "formMessage"', function () {
            $scope.testForm.required.$setViewValue('');
            expect(element.find('p').hasClass('formMessage')).toBe(true);
        });
    });
});
