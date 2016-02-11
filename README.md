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
* checkbox (for input type="checkbox" with data-validate="required")
* radio (for input type="radio" with data-validate="required")
* minlength
* email
* datetime (default: dddd/mm/yyyy hh:ii:ss)
* date (default: dddd/mm/yyyy)
* time
* cpf
* cnpj
* phone (numeric with 10~11 digits)
* numeric (numeric including zero)
* cep (numeric with 8 digits)
* url
* decimal (float values)
* match (matches with other input name in the same form, eg.: data-validate="match('password1')" )
* regex (a custom regex, eg.: data-validate="\d{3,5}" )

### Custom validation rule
You can create your custom validation rule with a default message, like
```sh
cevalidator.addRule("myNewRule", function(inputElem) {
    // DO SOMETHING
    return true; // OR FALSE
}, "This field is required.");
```
```sh
<form id="myForm" class="validate validate-tooltip">
    <input type="text" data-validate="myNewRule" />
</form>
```
