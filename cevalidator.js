/**
 * CEValidator JavaScript
 *
 * @author Caio Eduardo <caioedut@outlook.com>
 * @date 2013-10-01
 */

$(function () {
    var app = $(document);

    // REMOVE TOOLTIP
    $(window).on('click keydown resize', function () {
        $('.cevalidator_tooltip').remove();
    });

    // Validdation On Submit FORM
    app.on('submit', 'form.validate', function (e) {
        return $(e.currentTarget).validate();
    });

    // Validdation On Keypress INPUTS
    app.on('keyup keydown blur', 'form.validate [data-validate]', function () {
        var input = $(this);

        var tooltipOldStatus = cevalidator.tooltip;
        cevalidator.tooltip = false;
        if (cevalidator.validate(input))
            cevalidator.onSuccess(input);
        else
            cevalidator.onError(input);
        cevalidator.tooltip = tooltipOldStatus;
    });

});

var cevalidator = {
    autofocus: true,
    tooltip: true,
    classError: 'has-error',
    classSuccess: 'has-success',
    onError: function (elem) {
        var label = elem.closest('label');
        if (label.length)
            elem = label;
        elem.removeClass(this.classSuccess).addClass(this.classError);
    },
    onSuccess: function (elem) {
        var label = elem.closest('label');
        if (label.length)
            elem = label;
        elem.removeClass(this.classError).addClass(this.classSuccess);
    },
    validate: function (obj) {
        var rules = obj.data('validate').toString().split('|');

        // REMOVE PLACEHOLDER AS VALUE
        if (obj.attr('placeholder') == obj.val().trim())
            obj.val('');

        var success = true;

        if (obj.attr('type') == 'checkbox') {
            obj.data('current-rule', 'checkbox');
            return this.rules.checkbox(obj);
        }

        else if (obj.attr('type') == 'radio') {
            obj.data('current-rule', 'radio');
            return this.rules.radio(obj);
        }

        // Validate custom rules
        for (var i in rules) {
            var rule = rules[i].toLowerCase().trim();

            if (parseInt(rule)) {
                obj.data('current-rule', 'minlength');
                if (!this.rules.minlength(obj, parseInt(rule)))
                    success = false;
            }

            else if (rule.indexOf('match') >= 0) {
                obj.data('current-rule', 'match');
                if (!this.rules.match(obj))
                    success = false;
            }

            // IF CUSTOM VALIDATE EXISTS
            else if (this.rules[rule]) {
                obj.data('current-rule', rule);
                if (!this.rules[rule](obj))
                    success = false;
            }

            else if (!this.rules.regex(obj)) {
                obj.data('current-rule', 'regex');
                success = false;
            }
        }

        return success;
    },
    rules: {
        checkbox: function (obj) {
            if (!obj.is(':checked'))
                return false;

            return true;
        },
        radio: function (obj) {
            var name = obj.attr('name');
            var form = obj.closest('form');
            if (!form.find('input[type="radio"][name="' + name + '"]:checked').length)
                return false;

            return true;
        },
        minlength: function (obj, minlength) {
            var value = obj.val().toString().trim();

            obj.attr('minlength', minlength);

            if (value.length < minlength)
                return false;

            return true;
        },
        required: function (obj) {
            return this.minlength(obj, 1);
        },
        email: function (obj) {
            var value = obj.val().replace(/\s/g, '');

            var rule = /^[\w\.\-]{3,}\@[\w\.\-]{3,}\.[a-zA-Z]{2,}$/;
            if (!rule.test(value))
                return false;

            return true;
        },
        datetime: function (obj) {
            var value = obj.val();

            var matches = value.match(/^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})(:\d{2})?$/);
            if (matches === null) {
                return false;
            } else {
                var year = parseInt(matches[3], 10);
                var month = parseInt(matches[2], 10) - 1; // months are 0-11
                var day = parseInt(matches[1], 10);
                var hour = parseInt(matches[4], 10);
                var minute = parseInt(matches[5], 10);
                var date = new Date(year, month, day, hour, minute);
                if (date.getFullYear() !== year || date.getMonth() != month || date.getDate() !== day || date.getHours() !== hour || date.getMinutes() !== minute) {
                    return false;
                }
            }

            return true;
        },
        date: function (obj) {
            var value = obj.val();
            var rule = /^\d{2}\/\d{2}\/\d{4}$/;
            if (rule.test(value)) {
                var date = value.split('/');
                var dayobj = new Date(date[2], date[1] - 1, date[0]);
                if ((dayobj.getDate() == date[0]) && (dayobj.getMonth() + 1 == date[1]) && (dayobj.getFullYear() == date[2])) {
                    return true
                }
            }
            return false;
        },
        time: function (obj) {
            var rule = /^[0-9]{2}:[0-9]{2}(:\d{2})?$/;
            var value = obj.val();

            if (!rule.test(value))
                return false;

            return true;
        },
        cpf: function (obj) {
            var value = obj.val().replace(/\D/g, '');
            var Soma;
            var Resto;
            Soma = 0;

            if (value == '00000000000')
                return false;

            for (var i = 1; i <= 9; i++)
                Soma = Soma + parseInt(value.substring(i - 1, i)) * (11 - i);

            Resto = (Soma * 10) % 11;
            if (Resto == 10 || Resto == 11)
                Resto = 0;

            if (Resto != parseInt(value.substring(9, 10)))
                return false;

            Soma = 0;
            for (i = 1; i <= 10; i++) Soma = Soma + parseInt(value.substring(i - 1, i)) * (12 - i);
            Resto = (Soma * 10) % 11;

            if (Resto == 10 || Resto == 11)
                Resto = 0;

            if (Resto != parseInt(value.substring(10, 11)))
                return false;

            return true;
        },
        cnpj: function (obj) {
            var cnpj = obj.val().replace(/\D/g, '');
            var validate_msg = 'Este CNPJ não é válido';

            if (cnpj === '' || cnpj.length != 14 || cnpj == '00000000000000' || cnpj == '11111111111111' || cnpj == '22222222222222' || cnpj == '33333333333333' || cnpj == '44444444444444' || cnpj == '55555555555555' || cnpj == '66666666666666' || cnpj == '77777777777777' || cnpj == '88888888888888' || cnpj == '99999999999999')
                return false;

            var tamanho = cnpj.length - 2;
            var numeros = cnpj.substring(0, tamanho);
            var digitos = cnpj.substring(tamanho);
            var soma = 0;
            var pos = tamanho - 7;
            for (var i = tamanho; i >= 1; i--) {
                soma += numeros.charAt(tamanho - i) * pos--;
                if (pos < 2)
                    pos = 9;
            }
            var resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
            if (resultado != digitos.charAt(0))
                return false;

            tamanho = tamanho + 1;
            numeros = cnpj.substring(0, tamanho);
            soma = 0;
            pos = tamanho - 7;
            for (i = tamanho; i >= 1; i--) {
                soma += numeros.charAt(tamanho - i) * pos--;
                if (pos < 2)
                    pos = 9;
            }
            resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
            if (resultado != digitos.charAt(1))
                return false;

            return true;
        },
        phone: function (obj) {
            var rule = /^\d{10}\d?$/;
            var value = obj.val().replace(/\D/g, '');

            if (!rule.test(value))
                return false;

            return true;
        },
        numeric: function (obj) {
            if ((obj.val().length <= 0 || !parseInt(obj.val())) && obj.val() != '0')
                return false;

            return true;
        },
        cep: function (obj) {
            var rule = /^\d{5}-\d{3}$/;
            var value = obj.val();

            if (!rule.test(value))
                return false;

            return true;
        },
        url: function (obj) {
            var rule = /^(ht|f)tps?:\/\/\w+([\.\-\w]+)?\.([a-z]{2,4})(:\d{2,5})?(\/.*)?$/i;
            var value = obj.val().replace('www.');

            if (!rule.test(value))
                return false;

            return true;
        },
        decimal: function (obj) {
            var rule = /^\d{1,}(\.\d{2})?$/;
            var value = obj.val();

            if (!rule.test(value))
                return false;

            return true;
        },
        match: function (obj) {
            var rule = /\([\"|\'](.+)[\"|\']\)/;
            var value = obj.attr('data-validate').trim();

            var input_name = value.match(rule);

            if (input_name && input_name[1]) {
                var form = obj.closest('form');
                var element = form.find('*[name="' + input_name[1] + '"]');

                if (obj.val() == element.val() && obj.val().length > 0)
                    return true;
            }
            return false;
        },
        regex: function (obj) {
            var rule = new RegExp(obj.attr('data-validate'));
            var value = obj.val();

            if (!rule.test(value))
                return false;

            return true;
        }
    },
    messages: {
        checkbox: "Este campo deve ser marcado",
        radio: "Selecione uma opção",
        minlength: function(input) {
            return "Este campo deve conter no mínimo " + input.attr('minlength') + " caracteres";
        },
        required: "Este campo é obrigatório",
        email: "Este e-mail não é válido",
        datetime: "Preencha uma data e horário válidos",
        date: "Preencha uma data válida",
        time: "Este formato de hora não é válido",
        cpf: "Este CPF não é válido",
        cnpj: "Este CNPJ não é válido",
        phone: "Este telefone não é válido",
        numeric: "Este valor não é um número inteiro",
        cep: "Este CEP não é válido",
        url: "Este URL não é válido",
        decimal: "Este valor não é válido",
        match: "Os campos devem ser iguais",
        regex: "Preencha o campo corretamente"
    },
    showTooltip: function (obj, rule) {
        if (this.tooltip) {
            if (obj.data('message'))
                message = obj.attr('message');
            else if (this.messages[rule])
                message = typeof this.messages[rule] == 'function' ? this.messages[rule](obj) : this.messages[rule];
            else
                message = 'Este campo é obrigatório';

            var tooltip_pos = obj.offset();

            $('body').append('' +
                '<div class="cevalidator_tooltip" style="position: absolute; left: ' + tooltip_pos.left + 'px; top: ' + (tooltip_pos.top + obj.outerHeight() + 5) + 'px; background: #282828; color: #FFFFFF; display: none; font-family: Arial; font-size: 13px; line-height: 16px; height: auto; margin: 0; padding: 10px 15px; text-align: center; width: auto; z-index: 9999;">' +
                '   ' + message +
                '   <div class="cevalidator_tooltip_arrow" style="position: absolute; top: -3px; color: #282828; font-family: Arial; font-size: 13px; line-height: 0; height: 14px; margin: 0; margin-left: -7px; padding: 0; text-align: center; width: 14px;">&#9650;</div>' +
                '</div>'
            );
            $('.cevalidator_tooltip').fadeIn(400);
        }
    }
};


jQuery.fn.validate = function( options ) {
    cevalidator = $.extend(cevalidator, $.fn.validate.defaults, options);

    var form = $(this);

    $('.cevalidator_tooltip').remove();

    form.removeClass('validate-error');

    var errors = [];
    form.find('[data-validate]').each(function () {
        var input = $(this);
        if (cevalidator.validate(input))
            cevalidator.onSuccess(input);
        else
            errors.push(input);
    });

    if (errors.length) {
        form.addClass('validate-error');

        if (cevalidator.autofocus)
            errors[0].focus();

        cevalidator.onError(errors[0]);
        cevalidator.showTooltip(errors[0], errors[0].data('current-rule'));

        // PREVENT SUBMIT
        return false;
    }

    return true;
};
$.fn.validate.defaults = {};