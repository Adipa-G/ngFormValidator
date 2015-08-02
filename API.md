API
===
Following examples assumes default bootstrap styles are used. To findout how to override the styles please refer to the Readme.

### **Required validation**<br/>
You can always override the default validation message in the last parameter for the validator. In case of required validator the only parameter is the message. 
 
```html
<form name="introform" ng-controller="intro">
    <!--you can use
        <div class="form-group" validator="required">
        if you don't want to override the validation message-->
    <div class="form-group" validator="required[Field is required]">
        <label for="requiredField">Required Field</label>
        <input type="text" class="form-control" id="requiredField" name="requiredField"
               placeholder="Required Field" ng-model="requiredField">
    </div>
    <button type="submit" class="btn btn-default" ng-disabled="!introform.$valid">Submit</button>
</form>
```

### **Specify control to validate if there are multiple controls inside the parent**<br/> 
```html
<form name="introform" ng-controller="intro">
    <div class="form-group" validator="required" v-input="requiredField">
        <label for="requiredField">Required Field</label>
		<input type="text" class="form-control" id="nonValidatedField" name="nonValidatedField"
               placeholder="Non validated Field" ng-model="nonValidatedField">
        <input type="text" class="form-control" id="requiredField" name="requiredField"
               placeholder="Required Field" ng-model="requiredField">
    </div>
    <button type="submit" class="btn btn-default" ng-disabled="!introform.$valid">Submit</button>
</form>
```

### **String validation** <br/>
String validation accepts 3 arguments. First one for minimum length, second for maximum length and third for the message.

```html
<form name="introform" ng-controller="intro">
    <!--you can use
        <div class="form-group" validator="string[2]">
        or <div class="form-group" validator="string[2,,should be more than 2 characters]">
        if you want only to validate minimum length-->
    <!--also you can use
        <div class="form-group" validator="string[,3]">
        or <div class="form-group" validator="string[,3,should be less than 3 characters]">
        if you want only to validate max length-->
    <div class="form-group" validator="string[2,3]">
        <label for="field2To3">2 to 3 Length Field</label>
        <input type="text" class="form-control" id="field2To3" name="field2To3"
               placeholder="With Default Message" ng-model="field2To3">
    </div>
    <button type="submit" class="btn btn-default" ng-disabled="!introform.$valid">Submit</button>
</form>
```