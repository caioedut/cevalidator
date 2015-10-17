# CEValidator
HTML Cross-browser form validator

## How to use

### Automatic validation
```sh
<form id="myForm" class="validate">
    <input type="text" data-validate="required" />
</form>
```

### In JavaScript validation
```sh
<form id="myForm">
    <input type="text" data-validate="required" />
</form>
```
```sh
$(document).ready(function() {
    $('#myForm').on('submit', function(e) {
        e.preventDefault();
        
        if ($(this).validate()) {
            // DO SOMETHING IF FORM VALIDATE RETURNS TRUE
        } else {
            // DO SOMETHING IF FORM VALIDATE RETURNS FALSE
        }
    });
});
```

## Tooltips and rrror messages
### Tooltip
You can ADD a tooltip error using the class validate-tooltip in form tag. All default validator have a default message.
```sh
<form id="myForm" class="validate validate-tooltip">
    <input type="text" data-validate="required" />
</form>
```
### Custom errors messages
You can customize your tooltip error message adding a ``` data-message ``` in your input.
```sh
<form id="myForm" class="validate validate-tooltip">
    <input type="text" data-validate="required" data-message="Please, type this field."/>
</form>
```

## Validation Rules
### List of default validation rules
You can use a pre formatted validation rule, using the ``` data-validate="ruleName" ```

Rules: 
* required
* checkbox
* radio
* minlength
* email
* datetime
* date
* time
* cpf
* cnpj
* phone
* numeric
* cep
* url
* decimal
* match
* regex

### Custom validation rule
You can create your custom validation rule with a default message, like
```sh
cevalidator.rules.myNewRule = function(inputElem) {
    // DO SOMETHING
    return true; // OR FALSE
};
cevalidator.messages.myNewRule = function(inputElem) {
    return "This field is required.";
};
```
```sh
<form id="myForm" class="validate validate-tooltip">
    <input type="text" data-validate="myNewRule" />
</form>
```
