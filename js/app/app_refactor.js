function init() {
    console.log("init app and controls");
    $('button.upload-file').click(upload_file);
    $('#file-uploader').change(handle_image);
    $('a.innerContent').click(select_from_library);
    $('button.preview-button').mousedown(hide_controls_and_show_bg).mouseleave(show_controls).mouseup(show_controls);
    $('a[data-toggle="tab"]').on('shown.bs.tab', update_dropdown_caption);
}

var canvas = new Canvas;
var parts = new PartCollection();
init();



