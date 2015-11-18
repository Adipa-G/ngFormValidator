'use strict';

(function () {
    var module = angular.module('ngFormValidator',[]);

    module.directive('validator', function() {
        function attrNameEquals(attrName, checkAgainst) {
            return attrName.toLowerCase() === checkAgainst.toLowerCase() ||
                attrName.toLowerCase() === checkAgainst.split("-").join("").toLowerCase();
        };

        function findProperty(object, name) {
            if (!object)
                return null;

            for (var attrName in object) {
                if (attrNameEquals(attrName, name)) {
                    return object[attrName];
                }
            }
            return null;
        };

        function findElementAttrByNameOrId(element, name) {
            var attrs = element.attributes;;
            if (!attrs)
                return null;

            for (var i = 0; i < attrs.length; i++) {
                var attr = attrs[i];
                if (attr.name && attrNameEquals(attr.name, name)) {
                    return attrs[attr.name];
                }
                if (attr.id && attrNameEquals(attr.id, name)) {
                    return attrs[attr.id];
                }
            }
            return null;
        };

        function findInputNameToValidate(element, attrs, ngForm) {
            var inputName = findProperty(attrs, 'v-input');

            var modelControler = null;

            // ReSharper disable once MissingHasOwnPropertyInForeach
            for (var name in ngForm) {
                if (inputName) {
                    if (inputName === name) {
                        modelControler = ngForm[name];
                    }
                } else {
                    var children = angular.element(element).contents();
                    for (var i = 0; i < children.length; i++) {
                        var child = children[i];
                        var nameAttr = findElementAttrByNameOrId(child, 'name');
                        if (nameAttr && name === nameAttr.nodeValue) {
                            modelControler = ngForm[name];
                        }
                    }
                }
            }
            return modelControler;
        };

        function findStyle(attributeName, propertyName, scope, ngForm, attrs, defaultValue) {
            var styleValue = findProperty(attrs, attributeName);
            if (!styleValue && scope.validator) {
                var formSpecific = findProperty(scope.validator, ngForm.$name);
                if (formSpecific) {
                    styleValue = findProperty(formSpecific, propertyName);
                }
                if (!styleValue) {
                    styleValue = findProperty(scope.validator, propertyName);
                }
            }
            if (!styleValue) {
                styleValue = defaultValue;
            }
            return styleValue;
        };

        function findStyles(scope, ngForm, attrs) {
            return {
                successStyle: findStyle('v-style-success', 'successStyle', scope, ngForm, attrs, 'has-success has-feedback'),
                errorStyle: findStyle('v-style-error', 'errorStyle', scope, ngForm, attrs, 'has-error has-feedback'),
                errorMessageStyle: findStyle('v-style-error-message', 'errorMessageStyle', scope, ngForm, attrs, 'bg-danger')
            };
        };

        function getValidationRules(ruleStr) {
            var rules = [];
            
            var regexp = /([^\[\],]*)(\[([^\[\]]*\])|\[([\'\"](.)*[\'\"])*\])?([,]?)/g;
            var match = regexp.exec(ruleStr);

            while (match !== null && match[0]) {
                var rule = {
                    type: match[1].toLowerCase(),
                    params: []
                };
                
                if (match[2]) {
                    var paramArr = match[2].replace('[', '').replace(']', '').split(',');
                    for (var i = 0; i < paramArr.length; i++) {
                        var param = paramArr[i].trim();
                        if (param) {
                            rule.params.push({ name: param, value: null });
                        }
                    }
                }
                rules.push(rule);
                match = regexp.exec(ruleStr);
            }
            return rules;
        };

        function addWatches(scope, modelController, ruleStr) {
            var rules = getValidationRules(ruleStr);
            for (var i = 0; i < rules.length; i++) {
                var rule = rules[i];
                for (var j = 0; j < rule.params.length; j++) {
                    var param = rule.params[j];
                    if (param.name.charAt(0) !== '\'' && param.name.charAt(0) !== '\"') {
                        scope.$watch(param.name, function (newValue, oldValue) {
                            if (newValue !== oldValue) {
                                modelController.$validate();
                            }
                        });
                    }
                }
            }
        };

        function extractParams(scope,ruleStr) {
            var rules = getValidationRules(ruleStr);
            for (var i = 0; i < rules.length; i++) {
                var rule = rules[i];
                for (var j = 0; j < rule.params.length; j++) {
                    var param = rule.params[j];
                    if (param.name.charAt(0) !== '\'' && param.name.charAt(0) !== '\"') {
                        param.value = scope.$eval(param.name);
                    } else {
                        param.value = param.name.replace(/\"/g, '').replace(/\'/g, '');
                    }
                }

                if (rule.params.length > 0
                    && typeof (rule.params[0].value) === 'boolean') {
                    rule.enabled = rule.params[0].value;
                    rule.params.splice(0,1);
                }
                else {
                    rule.enabled = true;
                }
            }
            return rules;
        };
        
        function validateRequired(value, params) {
            var message = (params.length === 1) ? params[0].value : 'This field is required';

            if (!value) {
                return { valid: false, message: message };
            }
            return { valid: true, message: '' };
        };

        function validateString(value, params) {
            if (!params)
                return { valid: true, message: '' };

            if (!value)
                value = '';

            var minLen = parseInt(params[0].value);
            var maxLen = params.length > 0 ? parseInt(params[1].value) : INT.MAX_VALUE;
            var valid = (isNaN(minLen) || (!isNaN(minLen) && value.length >= minLen))
                && (isNaN(maxLen) || (!isNaN(maxLen) && value.length <= maxLen));

            var message = params.length > 2 && !valid ? params[2].value : '';
            if (!message && !valid) {
                message = 'This field should be ';
                if (!isNaN(minLen)) {
                    message += ' minimum length of ' + minLen;
                    if (!isNaN(maxLen)) {
                        message += ' and ';
                    }
                }
                if (!isNaN(maxLen)) {
                    message += ' maximum length of ' + maxLen;          
                }
            }
            return { valid: valid, message: message };
        };
        
        function validateNumber(value, params) {
            if (!params)
                return { valid: true, message: '' };

            if (!value)
                value = '';

            var min = parseInt(params[0].value);
            var max = params.length > 0 ? parseInt(params[1].value) : INT.MAX_VALUE;
            var val = Number(value);
            var valid = !isNaN(val)
                && (isNaN(min) || (!isNaN(min) && val >= min))
                && (isNaN(max) || (!isNaN(max) && val <= max));

            var message = params.length > 2 && !valid ? params[2].value : '';
            if (!message && !valid) {
                message = 'This field should be a number with ';
                if (!isNaN(min)) {
                    message += ' minimum of ' + min;
                    if (!isNaN(max)) {
                        message += ' and ';
                    }
                }
                if (!isNaN(max)) {
                    message += ' maximum of ' + max;          
                }
            }
            return { valid: valid, message: message };
        };
        
        function validateRegEx(value,params){
            if (!params)
                return { valid: true, message: '' };

            if (!value)
                value = '';
            
            var expr = new RegExp(params[0].value,'gi');
            var valid = expr.test(value);
            
            var message = params.length > 1 && !valid ? params[1].value : '';
            if (!message && !valid) {
                message = 'This field should be a of pattern ' + params[0].value;
            }
            
            return { valid: valid, message: message };
        };
        
        function validateEmail(value,params){
            if (!value)
                value = '';
            
            var message = params.length > 0 
            ? params[0].value 
            : 'Please enter an email address';
            
            return validateRegEx(value,[{value : '^(([^<>()[\\]\\.,;:\\s@\\"]+(\\.[^<>()[\\]\\.,;:\\s@\\"]+)*)|(\\".+\\"))@(([^<>()[\\]\\.,;:\\s@\\"]+\\.)+[^<>()[\\]\\.,;:\\s@\\"]{2,})$'},{value : message}]);
        };
        
        function validateUrl(value,params){
            if (!value)
                value = '';
            
            var message = params.length > 0 
            ? params[0].value 
            : 'Please enter a URL';
            
            return validateRegEx(value,[{value : '(http|ftp|https)://[\\w-]+(\\.[\\w-]+)+([\\w.,@?^=%&amp;:/~+#-]*[\\w@?^=%&amp;/~+#-])?'},{value : message}]);
        };

        function validateEqualTo(value,params,ngForm){
            if (!params || params.length === 0)
                return { valid: true, message: '' };

            if (!value)
                value = '';

            var controlName = params[0].value;
            var modelControl = ngForm[controlName];
            var controlValue = '';
            if (modelControl){
                controlValue = modelControl.$modelValue || modelControl.$viewValue;;
            }
            
            var message = params.length > 1 
                ? params[1].value 
                : 'The value of this field should be equal to ' + controlName;
            return { valid: controlValue === value, message: message };
        };
        
        function validateCustom(scope ,value,params){
            if (!params || params.length === 0)
                return { valid: true, message: '' };

            if (!value)
                value = '';

            var functionName = params[0].value;
            return scope[functionName](value);
        };

        function removeClasses(element, classList) {
            if (element.classList) {
                var classItems = classList.split(' ');
                for (var i = 0; i < classItems.length; i++) {
                    var classItem = classItems[i];
                    if (element.classList.contains(classItem)) {
                        element.classList.remove(classItem);
                    }
                }
            }
        };

        function addClasses(element, classList) {
            if (!element.classList) {
                element.classList = {};
            }

            var classItems = classList.split(' ');
            for (var i = 0; i < classItems.length; i++) {
                var classItem = classItems[i];
                if (!element.classList.contains(classItem)) {
                    element.classList.add(classItem);
                }
            }
        };

        function updateClasses(element, styles, result) {
            removeClasses(element, styles.successStyle);
            removeClasses(element, styles.errorStyle);
            if (result.validationCount > 0) {
                addClasses(element, result.valid ? styles.successStyle : styles.errorStyle);
            }
        };

        function showValidationMessage(modelController, element, styles, result) {
            if (modelController.$validationErrorElement) {
                element.removeChild(modelController.$validationErrorElement);
                modelController.$validationErrorElement = null;
            }

            if (!result.valid) {
                var child = document.createElement("p");
                addClasses(child, styles.errorMessageStyle);
                child.innerHTML = result.message;
                modelController.$validationErrorElement = child;
                element.appendChild(child);
            }
        };

        return {
            require: ['^form'],
            link: function(scope, element, attrs, ngForm) {
                if (ngForm.length === 0 || element.length === 0)
                    return;

                element = element[0];
                ngForm = ngForm[0];

                var styles = findStyles(scope, ngForm, attrs);

                var ruleStr = findProperty(attrs, 'validator');
                ruleStr = ruleStr ? ruleStr : '';

                var modelController = findInputNameToValidate(element, attrs, ngForm);
                addWatches(scope, modelController, ruleStr);
               
                modelController.$validators.validator = function(modelValue, viewValue) {
                    var value = modelValue || viewValue;
                    var rules = extractParams(scope,ruleStr);

                    var result = { validationCount: 0, valid: true, message: '' };
                    for (var i = 0; i < rules.length; i++) {
                        var rule = rules[i];

                        if (!rule.enabled)
                            continue;

                        var typeResult = null;
                        switch (rule.type) {
                            case 'required':
                                typeResult = validateRequired(value, rule.params);
                                break;
                            case 'string':
                                typeResult = validateString(value, rule.params);
                                break;
                            case 'number':
                                typeResult = validateNumber(value, rule.params);
                                break;
                            case 'regex':
                                typeResult = validateRegEx(value, rule.params);
                                break;
                            case 'email':
                                typeResult = validateEmail(value, rule.params);
                                break;
                            case 'url':
                                typeResult = validateUrl(value, rule.params);
                                break;
                            case 'equalto':
                                typeResult = validateEqualTo(value,rule.params,ngForm);
                                break;
                            case 'custom':
                                typeResult = validateCustom(scope,value,rule.params);
                                break;
                        }
                        if (typeResult) {
                            result.validationCount += 1;
                            result.valid = result.valid & typeResult.valid;
                            result.message += result.message ? '<br/>' : '';
                            result.message += typeResult.message;
                        }
                    }

                    if (modelController.$dirty) {
                        updateClasses(element, styles, result);
                        showValidationMessage(modelController, element, styles, result);
                    }
                    return result.valid ? true : false;
                };
            }
        };
    });
})();