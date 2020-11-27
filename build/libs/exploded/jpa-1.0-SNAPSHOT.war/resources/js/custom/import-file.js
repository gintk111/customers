/**
* Import file excel
*
* @package  PTMS - Sumitomo
* @author   SonPD1
* @license  FPT
*/

function resetImport() {
    $('#uploadfile').val('');
    $('#path-import').val('');
    $("#message-error-import").html('');
    $("#response-import table thead").html('');
    $("#response-import table tbody").html('');
    $('#save-import-file').prop('disabled', true);
    return true;
}

// Import file
$('#uploadfile').checkFileType({
    allowedExtensions: ['xlsx', 'xls'],
    success: function () {
        $("#message-error-import").html('');
        $("#response-import").hide();
        $("#response-import table thead").html('');
        $("#response-import table tbody").html('');
        var form = document.forms.namedItem("fileinfo");
        var files = document.getElementById("uploadfile").files;
        if (files.length > 0) {
            oData = new FormData(form);
            oData.append("_token", $("#_token").val());
            var oReq = new XMLHttpRequest();
            oReq.open("POST", urlImportFile, true);
            oReq.onload = function (oEvent) {
                var responseText = jQuery.parseJSON(oReq.responseText);
                if (responseText.status) {
                    // get label table
                    var htmlImportThead = '<tr>';
                    htmlImportThead += '<th>1</th>';
                    var data = responseText.data;
                    for (var k in data[0]) {
                        if (typeof data[0][k] !== 'function') {
                            htmlImportThead += '<th>' + k + '</th>';
                        }
                    }
                    htmlImportThead += '</tr>';
                    // get content table
                    var htmlImportTbody = '';
                    for (var i = 0; i < data.length; i++) {
                        htmlImportTbody += '<tr>';
                        htmlImportTbody += '<td>' + (i + 2) + '</td>';
                        for (var j in data[i]) {
                            var value = (data[i][j] || data[i][j] === 0) ? data[i][j] : '&nbsp';
                            if (typeof value.date != 'undefined') {
                                var msec = Date.parse(value.date);
                                var d = new Date(msec);
                                var day = d.getDate();
                                var month = d.getMonth() + 1;
                                var year = d.getFullYear();
                                value = day+'/'+month+'/'+year;
                            }
                            htmlImportTbody += '<td>' + value + '</td>';
                        }
                        htmlImportTbody += '</tr>';
                    }
                    // show data import
                    $("#response-import").show();
                    $("#response-import table thead").html(htmlImportThead);
                    $("#response-import table tbody").html(htmlImportTbody);
                    $("#path-import").val(responseText.path);
                    $('#save-import-file').prop('disabled', false);
                } else {
                    swal(responseText.errors, "", "error");
                }
                return false;
            };
            oReq.send(oData);
        }
        return false;
    },
    error: function () {
        $("#response-import").hide();
        resetImport();
        swal("Bạn cần import đúng file excel.", "", "error");
    }
});
$(document).ready(function () {
    $("#save-import-file").click(function () {
        var fileName = $("#path-import").val();
        if (fileName) {
            $.ajax({
                url: urlSaveFile,
                method: 'post',
                data: {fileName: fileName, _token: $("#_token").val()},
                success: function (response) {
                    $("#message-error-import").html('');
                    response = JSON.parse(response);
                    var htmlError = '<div class="row">';
                    if (response.status) {
                        $("#response-import").hide();
                        swal("Bạn đã import file thành công.", "", "success");
                        resetImport();
                    } else {
                        swal("Bạn đã import file không thành công.", "", "error");
                        if (typeof response.errorHeader !== 'undefined' && response.errorHeader.length > 0) {
                            $("#response-import").hide();
                            $("#response-import table thead").html('');
                            $("#response-import table tbody").html('');
                            var htmlImportThead = '<tr>';
                            htmlImportThead += '<th>1</th>';
                            var dataHeader = response.dataHeader;
                            for (var k in dataHeader) {
                                if (typeof dataHeader[k] !== 'function') {
                                    htmlImportThead += '<th>' + dataHeader[k].data + '</th>';
                                }
                            }
                            htmlImportThead += '</tr>';
                            // get content table
                            var htmlImportTbody = '';
                            var dataContent = response.dataContent;
                            for (var i = 0; i < dataContent.length; i++) {
                                htmlImportTbody += '<tr>';
                                htmlImportTbody += '<td>' + (i + 2) + '</td>';
                                for (var j in dataContent[i]) {
                                    var value = (dataContent[i][j].data || dataContent[i][j].data === 0) ? dataContent[i][j].data : '&nbsp';
                                    htmlImportTbody += '<td >' + value + '</td>';
                                }
                                htmlImportTbody += '</tr>';
                            }
                            // show data import
                            $("#response-import").show();
                            $("#response-import table thead").html(htmlImportThead);
                            $("#response-import table tbody").html(htmlImportTbody);
                            htmlError += '<div class="col-sm-6 text-danger"><p>'+response.errorHeader+'</p></div>';
                        } else if (Object.keys(response.errors).length > 0) {
                            $("#response-import").hide();
                            $("#response-import table thead").html('');
                            $("#response-import table tbody").html('');
                            // get label table
                            var htmlImportThead = '<tr>';
                            htmlImportThead += '<th>1</th>';
                            var dataHeader = response.dataHeader;
                            for (var k in dataHeader) {
                                if (typeof dataHeader[k] !== 'function') {
                                    var classHead = dataHeader[k].status ? '' : 'border-danger';
                                    htmlImportThead += '<th class="' + classHead + '">' + dataHeader[k].data + '</th>';
                                }
                            }
                            htmlImportThead += '</tr>';
                            // get content table
                            var htmlImportTbody = '';
                            var dataContent = response.dataContent;
                            for (var i = 0; i < dataContent.length; i++) {
                                htmlImportTbody += '<tr>';
                                htmlImportTbody += '<td>' + (i + 2) + '</td>';
                                for (var j in dataContent[i]) {
                                    var classContent = dataContent[i][j].status ? '' : 'border-danger';
                                    var value = (dataContent[i][j].data || dataContent[i][j].data === 0) ? dataContent[i][j].data : '&nbsp';
                                    if (typeof value.date != 'undefined') {
                                        var msec = Date.parse(value.date);
                                        var d = new Date(msec);
                                        var day = d.getDate();
                                        var month = d.getMonth() + 1;
                                        var year = d.getFullYear();
                                        value = month+'/'+day+'/'+year;
                                    }
                                    htmlImportTbody += '<td class="' + classContent + '">' + value + '</td>';
                                }
                                htmlImportTbody += '</tr>';
                            }
                            // show data import
                            $("#response-import").show();
                            $("#response-import table thead").html(htmlImportThead);
                            $("#response-import table tbody").html(htmlImportTbody);
                            // show error
                            Object.keys(response.errors).forEach(function (key, index) {
                                htmlError += '<div class="col-sm-6 text-danger">';
                                htmlError += '<p><strong>Dòng số:</strong> ' + key + '</p>';
                                for (var j = 0; j < response.errors[key].length; j++) {
                                    var textFirst = ((!response.errors[key][j].key) && (response.errors[key][j].key != '') && (response.errors[key][j].key != null)) ? 'Cột: "' + response.errors[key][j].key + '" có lỗi' : 'Có lỗi';
                                    var errorCurrent = textFirst + ': ' + response.errors[key][j].error;
                                    htmlError += '<p title="'+errorCurrent+'" class="pl-20 text-danger" style="white-space: normal">' + errorCurrent + '</p>';
                                }
                                htmlError += '</div>';
                            });
                        }
                    }
                    htmlError += '</div>';
                    $("#message-error-import").html(htmlError);
                }
            });
        } else {
            swal("Bạn import file thất bại.", "", "error");
        }
        return false;
    });
    $("#reset-import").click(function () {
        resetImport();
        return false;
    });
});
