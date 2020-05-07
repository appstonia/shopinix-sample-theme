$(function() {

    var owner = $('#owner');
    var ownerField = $('#owner-field');
    var cardNumber = $('#cardNumber');
    var cardNumberField = $('#card-number-field');
    var CVV = $("#cvv");
    var cvvField = $("#cvv-field");
    var confirmButton = $('#confirm-purchase');
    var mastercard = $("#mastercard");
    var visa = $("#visa");
    var amex = $("#amex");
    var card_type = $('#cc-card-type');
    var entered_card = '';

    // Use the payform library to format and validate
    // the payment fields.

    cardNumber.payform('formatCardNumber');
    CVV.payform('formatCardCVC');


    cardNumber.keyup(function() {

        amex.removeClass('transparent');
        visa.removeClass('transparent');
        mastercard.removeClass('transparent');

        if ($.payform.validateCardNumber(cardNumber.val()) == false) {
            cardNumberField.addClass('has-error');
        } else {
            cardNumberField.removeClass('has-error');
            cardNumberField.addClass('has-success');
        }

        entered_card = $.payform.parseCardType(cardNumber.val());

        if (entered_card == 'visa' || entered_card == 'visaelectron') {
            card_type.val(1);
            mastercard.addClass('transparent');
            amex.addClass('transparent');
        } else if (entered_card == 'amex') {
            card_type.val(3);
            mastercard.addClass('transparent');
            visa.addClass('transparent');
        } else if (entered_card == 'mastercard') {
            card_type.val(2);
            amex.addClass('transparent');
            visa.addClass('transparent');
        }
    });


    ownerField.on('keyup',function () {
        $(this).removeClass('has-error');
    });

    cvvField.on('keyup',function () {
        $(this).removeClass('has-error');
    });

    confirmButton.click(function(e) {

        e.preventDefault();

        var isCardValid = $.payform.validateCardNumber(cardNumber.val());
        var isCvvValid = $.payform.validateCardCVC(CVV.val());

        if (!isCardValid) {
            cardNumberField.addClass('has-error');
            alert(est_lang.error_card_number);
        } else if(owner.val().length < 5){
            ownerField.addClass('has-error');
            alert(est_lang.error_owner);
        } else if (!isCvvValid) {
            cvvField.addClass('has-error');
            alert(est_lang.error_card_cvv);
        } else {
            // Everything is correct. Add your form submission code here.
            $.ajax({
                type: 'post',
                url: 'index.php?route=extension/payment/est/pay3D',
                cache: false,
                data: $('#est-cc-form').serialize(),
                dataType: 'json',
                beforeSend: function() {
                    confirmButton.button('loading');
                },
                success: function(response) {
                    if(response.status == true && response.post_form) {
                        $('#post-bank').append(response.post_form);
                        $('#est-pay-form').submit();
                    } else {
                        alert(response.error);
                        confirmButton.button('reset');
                    }
                }
            });
        }
    });
});
