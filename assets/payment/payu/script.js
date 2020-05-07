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

        if ($.payform.parseCardType(cardNumber.val()) == 'visa') {
            mastercard.addClass('transparent');
            amex.addClass('transparent');
        } else if ($.payform.parseCardType(cardNumber.val()) == 'amex') {
            mastercard.addClass('transparent');
            visa.addClass('transparent');
        } else if ($.payform.parseCardType(cardNumber.val()) == 'mastercard') {
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
            alert(payu_lang.error_card_number);
        } else if(owner.val().length < 5){
            ownerField.addClass('has-error');
            alert(payu_lang.error_owner);
        } else if (!isCvvValid) {
            cvvField.addClass('has-error');
            alert(payu_lang.error_card_cvv);
        } else {
            // Everything is correct. Add your form submission code here.
            $.ajax({
                type: 'post',
                url: 'index.php?route=extension/payment/payu/pay3D',
                cache: false,
                data: $('#payu-cc-form').serialize(),
                dataType: 'json',
                beforeSend: function() {
                    confirmButton.button('loading');
                },
                complete: function() {
                    confirmButton.button('reset');
                },
                success: function(response) {
                    if(response.status == true && response.rewrite_url) {
                        console.log(response.rewrite_url);
                        location=response.rewrite_url;
                    } else {
                        alert(response.error)
                        //location=response.rewrite_url;
                    }
                }
            });
        }
    });
});
