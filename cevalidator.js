/**
 * CEValidator JavaScript
 *
 * @author Caio Eduardo <caioedut@outlook.com>
 * @date 2014-10-01
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

        cevalidator.tooltipEnabled = false;
        if (!cevalidator.validate(input))
            cevalidator.onError(input);
        cevalidator.tooltipEnabled = true;
    });

});

var cevalidator = {
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
    autofocus: true,
    tooltipEnabled: true,
    validate: function (obj) {
        var rules = obj.data('validate').toString().toLowerCase().trim().split('|');

        // REMOVE PLACEHOLDER AS VALUE
        if (obj.attr('placeholder') == obj.val().trim())
            obj.val('');

        var success = true;

        if (obj.attr('type') == 'checkbox')
            return this.rules.checkbox(obj);

        else if (obj.attr('type') == 'radio')
            return this.rules.radio(obj);

        // Validate custom rules
        for (var i in rules) {
            var rule = rules[i];

            if (parseInt(rule)) {
                if (!this.rules.minlength(obj, parseInt(rule)))
                    success = false;
            }

            else if (rule.indexOf('match') >= 0) {
                if (!this.rules.match(obj))
                    success = false;
            }

            // IF CUSTOM VALIDATE EXISTS
            else if (this.rules[rule]) {
                if (!this.rules[rule](obj))
                    success = false;
            }

            else if (!this.rules.regex(obj))
                success = false;
        }

        return success;
    },
    rules: {
        checkbox: function (obj) {
            if (!obj.is(':checked'))
                return cevalidator.hasError(obj, 'Este campo deve ser marcado');
            return cevalidator.hasSuccess(obj);
        },
        radio: function (obj) {
            var name = obj.attr('name');
            var form = obj.closest('form');
            if (form.find('input[type="radio"][name="' + name + '"]:checked').length)
                return cevalidator.hasSuccess(obj);
            return cevalidator.hasError(obj, 'Selecione uma opçãoo');
        },
        minlength: function (obj, minlength) {
            var value = obj.val().toString().trim();

            if (value.length < minlength) {
                if (minlength <= 1)
                    return cevalidator.hasError(obj, 'Este campo é obrigatório');
                else
                    return cevalidator.hasError(obj, 'Este campo deve conter no<br/>mínimo ' + minlength + ' caracteres');
            }
            return cevalidator.hasSuccess(obj);
        },
        required: function (obj) {
            return this.minlength(obj, 1);
        },
        email: function (obj) {
            var value = obj.val().replace(/\s/g, '');

            var rule = /^[\w\.\-]{3,}\@[\w\.\-]{3,}\.[a-zA-Z]{2,}$/;
            if (!rule.test(value))
                return cevalidator.hasError(obj, 'Este e-mail não é válido');
            return cevalidator.hasSuccess(obj);
        },
        datetime: function (obj) {
            var value = obj.val();

            var matches = value.match(/^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})(:\d{2})?$/);
            if (matches === null) {
                return cevalidator.hasError(obj, 'Preencha uma data e horário válidos');
            } else {
                var year = parseInt(matches[3], 10);
                var month = parseInt(matches[2], 10) - 1; // months are 0-11
                var day = parseInt(matches[1], 10);
                var hour = parseInt(matches[4], 10);
                var minute = parseInt(matches[5], 10);
                var date = new Date(year, month, day, hour, minute);
                if (date.getFullYear() !== year || date.getMonth() != month || date.getDate() !== day || date.getHours() !== hour || date.getMinutes() !== minute) {
                    return cevalidator.hasError(obj, 'Preencha uma data e horário válidos');
                }
                return cevalidator.hasSuccess(obj);
            }
        },
        date: function (obj) {
            var value = obj.val();
            var rule = /^\d{2}\/\d{2}\/\d{4}$/;
            if (rule.test(value)) {
                var date = value.split('/');
                var dayobj = new Date(date[2], date[1] - 1, date[0]);
                if ((dayobj.getDate() == date[0]) && (dayobj.getMonth() + 1 == date[1]) && (dayobj.getFullYear() == date[2])) {
                    return cevalidator.hasSuccess(obj);
                }
            }
            return cevalidator.hasError(obj, 'Preencha uma data válida');
        },
        time: function (obj) {
            var rule = /^[0-9]{2}:[0-9]{2}(:\d{2})?$/;
            var value = obj.val();

            if (!rule.test(value))
                return cevalidator.hasError(obj, 'Este formato de hora não é válido');
            return cevalidator.hasSuccess(obj);
        },
        cpf: function (obj) {
            var value = obj.val().replace(/\D/g, '');
            var Soma;
            var Resto;
            Soma = 0;

            if (value == '00000000000')
                return cevalidator.hasError(obj, 'Este CPF não é válido');

            for (var i = 1; i <= 9; i++)
                Soma = Soma + parseInt(value.substring(i - 1, i)) * (11 - i);

            Resto = (Soma * 10) % 11;
            if (Resto == 10 || Resto == 11)
                Resto = 0;

            if (Resto != parseInt(value.substring(9, 10)))
                return cevalidator.hasError(obj, 'Este CPF não é válido');

            Soma = 0;
            for (i = 1; i <= 10; i++) Soma = Soma + parseInt(value.substring(i - 1, i)) * (12 - i);
            Resto = (Soma * 10) % 11;

            if (Resto == 10 || Resto == 11)
                Resto = 0;

            if (Resto != parseInt(value.substring(10, 11)))
                return cevalidator.hasError(obj, 'Este CPF não é válido');

            return cevalidator.hasSuccess(obj);
        },
        cnpj: function (obj) {
            var cnpj = obj.val().replace(/\D/g, '');
            var validate_msg = 'Este CNPJ não é válido';

            if (cnpj === '' || cnpj.length != 14 || cnpj == '00000000000000' || cnpj == '11111111111111' || cnpj == '22222222222222' || cnpj == '33333333333333' || cnpj == '44444444444444' || cnpj == '55555555555555' || cnpj == '66666666666666' || cnpj == '77777777777777' || cnpj == '88888888888888' || cnpj == '99999999999999')
                return cevalidator.hasError(obj, validate_msg);

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
                return cevalidator.hasError(obj, validate_msg);

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
            if (resultado != digitos.charAt(1)) {
                return cevalidator.hasError(obj, validate_msg);
            }

            return cevalidator.hasSuccess(obj);
        },
        phone: function (obj) {
            var rule = /^\d{10}\d?$/;
            var value = obj.val().replace(/\D/g, '');

            if (!rule.test(value))
                return cevalidator.hasError(obj, 'Este telefone não é válido');
            return cevalidator.hasSuccess(obj);
        },
        numeric: function (obj) {
            if ((obj.val().length <= 0 || !parseInt(obj.val())) && obj.val() != '0')
                return cevalidator.hasError(obj, 'Este valor não é um número inteiro');
            return cevalidator.hasSuccess(obj);
        },
        cep: function (obj) {
            var rule = /^\d{5}-\d{3}$/;
            var value = obj.val();

            if (!rule.test(value))
                return cevalidator.hasError(obj, 'Este CEP não é válido');
            return cevalidator.hasSuccess(obj);
        },
        url: function (obj) {
            var rule = /^(ht|f)tps?:\/\/\w+([\.\-\w]+)?\.([a-z]{2,4})(:\d{2,5})?(\/.*)?$/i;
            var value = obj.val().replace('www.');

            if (!rule.test(value))
                return cevalidator.hasError(obj, 'Este URL não é válido');
            return cevalidator.hasSuccess(obj);
        },
        decimal: function (obj) {
            var rule = /^\d{1,}(\.\d{2})?$/;
            var value = obj.val();

            if (!rule.test(value))
                return cevalidator.hasError(obj, 'Este preço não é válido');
            return cevalidator.hasSuccess(obj);
        },
        match: function (obj) {
            var rule = /\([\"|\'](.+)[\"|\']\)/;
            var value = obj.attr('data-validate').trim();

            var input_name = value.match(rule);

            if (input_name && input_name[1]) {
                var form = obj.closest('form');
                var element = form.find('*[name="' + input_name[1] + '"]');

                if (obj.val() == element.val() && obj.val().length > 0)
                    return cevalidator.hasSuccess(obj);
            }
            return cevalidator.hasError(obj, 'Os campos devem ser iguais');
        },
        regex: function (obj) {
            var rule = new RegExp(obj.attr('data-validate'));
            var value = obj.val();

            if (!rule.test(value))
                return cevalidator.hasError(obj, 'Preencha o campo corretamente');
            return cevalidator.hasSuccess(obj);
        }
    },
    hasError: function (obj, message) {
        cevalidator.onError(obj);

        if ($('.cevalidator_tooltip').length)
            return false;

        if (!obj.length)
            obj = $('.' + cevalidator.classError).first();

        cevalidator.tooltip(obj, message);

        return false;
    },
    hasSuccess: function (obj) {
        cevalidator.onSuccess(obj);
        return true;
    },
    tooltip: function (obj, message) {
        if (this.tooltipEnabled) {
            if (obj.attr('data-message'))
                message = obj.attr('data-message');
            else if (!message)
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
        if (!cevalidator.validate(input))
            errors.push(input);
    });

    if (errors.length) {
        form.addClass('validate-error');
        if (cevalidator.autofocus)
            errors[0].focus();
        cevalidator.hasError(errors[0]);

        // PREVENT SUBMIT
        return false;
    }

    return true;
};
$.fn.validate.defaults = {};