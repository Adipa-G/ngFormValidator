Angularjs Form Validator (ngFormValidator)
==========================================
ngFormValidator is an easy to use, highly customizable front-end validation framework.<br/>
It can be used to show realtime validation status in form controls. It uses bootstrap styles to provide visual indication of validity of each control additon to a customizable error message. Further it supports overriding the styles with custom implementations.

Requirement
-----
[AngularJS](http://angularjs.org)<br/>

DEMO
-----
http://adipa-g.github.io/ngFormValidator.html

Using ngFormValidator
---
```html
<script src="dist/ngFormValidator.js"></script>
```
```js
//add module dependency
angular.module('myApp', ['ngFormValidator']);
```

Writing your First Code
====
```html
<!--you could also use ng-form-->
<form name="introform" ng-controller="intro">
    <div class="form-group" validator="required">
        <label for="requiredField">Required Field</label>
        <input type="text" class="form-control" id="requiredField" name="requiredField"
               placeholder="Required Field" ng-model="requiredField">
    </div>
    <button type="submit" class="btn btn-default" ng-disabled="!introform.$valid">Submit</button>
</form>
```

[Documentation API](https://github.com/Adipa-G/ngFormValidator/wiki/API)

Built-in validation <small>in ngFormValidator</small>
===

1. Required
2. String (min and max length)

Integrating with Twitter Bootstrap
=====
Default implementation use bootstrap classes. So you only need to include bootstrap.css in your page.<br/>
It uses 'has-success' to indicate successful validation, 'has-error' to a validation error and 'bg-error' for the error message.

To integrate this package with Bootstrap you should do the following.

Override default bootstrap styles
=====
```css
.val-success{
//your style
}

.val-error{
//your style
}

.val-error-message{
//your style
}
```

You could override style per form control
```html
<!--you could also use ng-form-->
<form name="introform" ng-controller="intro">
    <div class="form-group" validator="required" v-style-success="val-success" v-style-error="val-error" v-style-error-message="val-error-message">
        <label for="requiredField">Required Field</label>
        <input type="text" class="form-control" id="requiredField" name="requiredField"
               placeholder="Required Field" ng-model="requiredField">
    </div>
    <button type="submit" class="btn btn-default" ng-disabled="!introform.$valid">Submit</button>
</form>
```

Further you can define common styles for all form controls, in your controller than repeat specifying styles in each control.
```js
$scope.validator = {
    successStyle: 'val-success',
    errorStyle: 'val-error',
    errorMessageStyle: 'val-error-message'
};
```

Also if you have multiple forms and if you need to use different styles in different forms, still it's possible
 ```js
//make sure to use correct form name here ($scope.validator.{{form name}})
$scope.validator.introform = {
    successStyle: 'val-success',
    errorStyle: 'val-error',
    errorMessageStyle: 'val-error-message'
};
```

CHANGELOG
=====
See [release](https://github.com/Adipa-G/ngFormValidator/wiki/CHANGELOG)

License
-----
GNU GPL V3