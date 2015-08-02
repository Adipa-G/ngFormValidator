(function () {
    var module = angular.module('angular.form.validator',[]);

    module.directive('validator', function() {
        function attrNameEquals(attrName, checkAgainst) {
            return attrName.toLowerCase() === checkAgainst.toLowerCase() ||
                attrName.toLowerCase() === checkAgainst.split("-").join("").toLowerCase();
        };

        function findProperty(object, name) {
            if (!object)
                return null;

            // ReSharper disable once MissingHasOwnPropertyInForeach
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

        function validateRequired(value, msg) {
            if (!value) {
                if (msg) {
                    msg = msg.replace('[', '').replace(']', '');
                } else {
                    msg = 'This field is required';
                }
                return { valid: false, message: msg };
            }
            return { valid: true, message: '' };
        };

        function validateString(value, params) {
            if (!params)
                return { valid: true, message: '' };

            if (!value)
                value = '';

            var paramArr = params.replace('[', '').replace(']', '').split(',');

            var minLen = parseInt(paramArr[0]);
            var maxLen = paramArr.length > 0 ? parseInt(paramArr[1]) : INT.MAX_VALUE;
            var valid = (isNaN(minLen) || (!isNaN(minLen) && value.length >= minLen))
                && (isNaN(maxLen) || (!isNaN(maxLen) && value.length <= maxLen));

            var message = paramArr.length > 1 && !valid ? paramArr[2] : '';
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

        /*
        function equalToControl(value, attrs, ngForm) {
            var otherControlName = findProperty(attrs, 'v-equal-to');
            if (otherControlName) {
                var otherControl = findProperty(ngForm, otherControlName);
                var otherControlValue = otherControl.$modelValue || otherControl.$viewValue;
                if (value !== otherControlValue) {
                    return { valid: false, message: 'Value of this control must be equal to value of ' + otherControlName }
                }
            } else {
                return { valid: false, message: 'Unable to find control' + otherControlName }
            }
            return { valid: true, message: '' };
        };*/

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
            addClasses(element, result.valid ? styles.successStyle : styles.errorStyle);
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

                var modelController = findInputNameToValidate(element, attrs, ngForm);
                modelController.$validators.validator = function(modelValue, viewValue) {
                    var value = modelValue || viewValue;

                    var typeStr = findProperty(attrs, 'validator');
                    typeStr = typeStr ? typeStr : '';

                    var regexp = /([^\[\],]*)(\[([^\[\]]*\])|\[([\'\"](.)*[\'\"])*\])?([,]?)/g;
                    var match = regexp.exec(typeStr);

                    var result = { valid: true, message: '' };
                    while (match != null && match[0]) {
                        var typeResult = null;
                        switch (match[1].toLowerCase())
                        {
                            case 'required':
                                typeResult = validateRequired(value,match[2]);
                                break;
                            case 'string':
                                typeResult = validateString(value, match[2]);
                                break;
                        }
                        if (typeResult) {
                            result.valid = result.valid & typeResult.valid;
                            result.message += result.message ? '<br/>' : '';
                            result.message += typeResult.message;
                        }
                        match = regexp.exec(typeStr);
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