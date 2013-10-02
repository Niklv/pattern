function init() {
    console.log("init app and controls");
    $('button.upload-file').click(upload_file);
    $('#file-uploader').change(handle_image);
    $('a.innerContent').click(select_from_library);
    $('#input-link').change(select_from_internet);
    $('#paste-link-button').click(function () {
        $('#input-link').trigger("submit");
    });
    $('#paste_link_modal').on('hidden.bs.modal', on_modal_paste_link_hide)
        .on('shown.bs.modal', function () {
            $('#input-link').focus();
        });


    $('button.preview-button').mousedown(hide_controls_and_show_bg).mouseleave(show_controls).mouseup(show_controls);
    $('a[data-toggle="tab"]').on('shown.bs.tab', update_dropdown_caption);
}

var canvas = new Canvas;
var parts = new PartCollection();
init();

//GA
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-44527078-1', 'patter.net');
ga('send', 'pageview');

