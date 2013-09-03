function upload_file() {
    $('#file-uploader').click();
}

function update_dropdown_caption(e) {
    $(e.target).parent().parent().parent().find("a h4").html($(e.target).text() + " <b class='caret'></b>");
}

function select_from_library(e) {
    var img = new Image();
    img.src = $(e.currentTarget).find('img').attr('src');
    img.onload = function () {
        parts.add({type: "img", img: img});
        $('#collections_modal').modal('hide');
    };
    return 0;
}

function handle_image(e) {
    var reader = new FileReader();
    reader.onload = function (event) {
        var imgObj = new Image();
        imgObj.src = event.target.result;
        imgObj.onload = function () {
            parts.add({type: "img", img: imgObj});
        };
        $(e.target).val("");
    };
    reader.readAsDataURL(e.target.files[0]);
}
