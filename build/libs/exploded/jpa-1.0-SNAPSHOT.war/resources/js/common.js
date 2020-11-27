// check onchange input
(function ($) {
    $.fn.extend({
        donetyping: function (callback, timeout) {
            timeout = timeout || 1e3; // 1 second default timeout
            var timeoutReference,
                doneTyping = function (el) {
                    if (!timeoutReference) return;
                    timeoutReference = null;
                    callback.call(el);
                };
            return this.each(function (i, el) {
                var $el = $(el);
                // Chrome Fix (Use keyup over keypress to detect backspace)
                // thank you @palerdot
                $el.is(':input') && $el.on('keyup keypress paste change', function (e) {
                    // This catches the backspace button in chrome, but also prevents
                    // the event from triggering too preemptively. Without this line,
                    // using tab/shift+tab will make the focused element fire the callback.
                    if (e.which == 13) {
                        return false;
                    }
                    if (e.type == 'keyup' && e.keyCode != 8) return;

                    // Check if timeout has been set. If it has, "reset" the clock and
                    // start over again.
                    if (timeoutReference) clearTimeout(timeoutReference);
                    timeoutReference = setTimeout(function () {
                        // if we made it here, our timeout has elapsed. Fire the
                        // callback
                        doneTyping(el);
                    }, timeout);
                }).on('blur', function () {
                    // If we can, fire the event since we're leaving the field
                    doneTyping(el);
                });
            });
        }
    });
})(jQuery);

//Check file type
(function ($) {
    $.fn.checkFileType = function (options) {
        var defaults = {
            allowedExtensions: [],
            success: function () {
            },
            error: function () {
            }
        };
        options = $.extend(defaults, options);

        return this.each(function () {

            $(this).on('change', function () {
                var value = $(this).val(),
                    file = value.toLowerCase(),
                    extension = file.substring(file.lastIndexOf('.') + 1);

                if ($.inArray(extension, options.allowedExtensions) == -1) {
                    options.error();
                    $(this).focus();
                } else {
                    options.success();

                }

            });

        });
    };

})(jQuery);

// example
//$(function() {
//    $('#image').checkFileType({
//        allowedExtensions: ['jpg', 'jpeg'],
//        success: function() {
//            alert('Success');
//        },
//        error: function() {
//            alert('Error');
//        }
//    });
//
//});

//Checkbox script
$('#check-all').on('click', function () {
    var arr = [];
    if (this.checked) {
        $('#remove-checked').removeAttr('disabled');
        $('.check-one').each(function () {
            this.checked = true;
            $(':checkbox.check-one').closest('tr').addClass('info');
            arr.push($(this).val());
        });
        $('input[name=selected]').val(JSON.stringify(arr));
    } else {
        $('#remove-checked').prop('disabled', true);
        $('.check-one').each(function () {
            this.checked = false;
            $(':checkbox.check-one').closest('tr').removeClass('info');
        });
        $('input[name=selected]').val('');
    }
});

$('.check-one').on('click', function () {
    $(this).closest('tr').toggleClass('info');
    if ($('.check-one:checked').length == $('.check-one').length) {
        $('#remove-checked').removeAttr('disabled');
        $('#check-all').prop('checked', true);
    } else {
        $('#check-all').prop('checked', false);
    }
    if (this.checked) {
        $('#remove-checked').removeAttr('disabled');
    } else {
        $('#remove-checked').prop('disabled', $('.check-one:checked').length == 0 ? true : false);
    }
});

//Preview image using file reader
function readURL(input) {
    if (input.files && input.files[0]) {
        var self = $(input);
        var reader = new FileReader();
        reader.onload = e => {
            self.closest('div.form-group').next('div.form-group').find('img.img-preview').attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
}

$("input.img-choice").change(function () {
    var size = parseInt(this.files[0].size);
    if (size > 2097152) {    // 15728640 byte ~ 15MB
        $(this).val('');
        swal("File upload", "Dung lượng ảnh không được vượt quá 2MB!", "error").catch(swal.noop);
        return false;
    }
    var extension = $(this).val().split('.').pop().toLowerCase();
    if (extension == 'jpg' || extension == 'png' || extension == 'jpeg') {
        readURL(this);
    } else {
        $(this).val('');
        swal("Chú ý!", "Ảnh phải thuộc 1 trong các định dạng .PNG, .JPG, .JPEG", "warning");
    }
    return false;
});

// Sweet alert confirm
function swal_confirm(elem, module, type, lang, multi = false, text = null) {
    var self = $(elem);
    if (lang == 'vi') {
        var action = type == 1 ? 'xoá' : 'cập nhật';
        var prefix = multi == false ? '' : 'những';
        var title = "Bạn có muốn " + action + " " + prefix + " " + module + " này không?";
        if (text != '') {
            var text = text;
        }
    } else {
        var action = type == 1 ? 'delete' : 'update';
        var prefix = multi == false ? '' : 'multi';
        var title = "Do you want to " + action + " " + prefix + " " + module + " there?";
    }

    swal({
        title: title,
        text: text,
        type: "warning",
        focusCancel: true,
        showCancelButton: true,
        confirmButtonText: lang == 'en' ? 'OK' : 'Có',
        cancelButtonText: lang == 'en' ? 'Cancel' : 'Không',
        confirmButtonColor: 'green',
        cancelButtonColor: '#d33',
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-danger',
        animation: false,
        allowOutsideClick: true,
        allowEscapeKey: true
    }).then(function () {
        if (self.attr('id') == 'remove-checked') {
            var checked = [];
            $('input[name="select[]"]').each(function (elem) {
                if ($(this).is(':checked')) {
                    checked.push($(this).val());
                }
                $('input[name=selected]').val(checked);
            })
        }
        self.closest('form').submit();
        //swal('Thành công', 'Đã xoá dữ liệu', 'success');
    }, function (dismiss) {
        if (dismiss == 'cancel') {
            $('input[name="select[]"]').each(function (elem) {
                $(this).prop('checked', false);
                $(this).closest('tr').removeAttr('class');
                $('button#remove-checked').prop('disabled', true);
            });
            $('input#check-all').prop('checked', false);
        }
    }).catch(swal.noop);
}

//Handle when click button input file
if ($('button.btn-input-file').length > 0) {
    $('button.btn-input-file').click(function () {
        var self = $(this);
        self.next('input[type=file]').click();
    });
}

if ($('input[name="standard_file[]"]').length > 0) {
    $('input[name="standard_file[]"]').on('change', function () {
        var self = $(this);
        self.closest('span.input-group-btn').next('input[type=text]').val(self.val().split('\\').pop());
    });
}

//Chosen JS
$(document).ready(function () {
    $(".chosen-select").chosen({no_results_text: "Không có dữ liệu!"});
});

//iCheck JS
$(document).ready(function () {
    $('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });
});

$(document).ready(function () {
    if ($('input[name=url]').length > 0) {
        $('input[name=url]').val(window.location.href);
    }
});


//Start JS SonPD1
$(document).ready(function () {
    $('#add-row-table').click(function () {
        var html = $('#list-step-group tbody').children('tr:first').html();
        $('#list-step-group tbody').append('<tr>' + html + '</tr>');
        return false;
    });
    $('#tracking-button').click(function () {
        $(".feedback-content").show();
    });
    $(".check-error-message").keyup(function () {
        var text = $(this).val();
        if (text == "error") {
            $("#error-popup").modal();
        }
    });
});
//End JS SonPD1
//Select 2
$('.select2').select2();
$('select[multiple]').select2({
    placeholder: 'Chọn nguyên nhân...'
})
$(document).ready(function () {
    $('input[type=number]').on('change keyup', function () {
        // Remove invalid characters
        var sanitized = $(this).val().replace(/[^0-9]/g, '');
        // Update value
        $(this).val(sanitized);
    });
});

//TrungLH3 update
$('.auto-submit').change(function () {
    $(this).closest('form').submit();
});

