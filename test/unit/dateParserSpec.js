'use strict';

/* jasmine specs for directives go here */
// ReSharper disable UndeclaredGlobalVariableUsing

describe('dateParser', function() {
    describe('parse d sections', function () {
        it('d section should be parsed', function() {
            var result = window.dateParser.parseExact('1','d');
            expect(result.getDate()).toBe(1);
        });
        
        it('dd section should be parsed', function() {
            var result = window.dateParser.parseExact('01','dd');
            expect(result.getDate()).toBe(1);
        });
    });
});
