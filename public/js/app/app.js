//GA
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-44527078-1', 'patter.net');
ga('send', 'pageview');

var APP = {
    Canvas: null,
    Samples: null,
    Events: _.extend({}, Backbone.Events),
    LoadingOverlay: $('#loading-hover'),
    init: function(){
        console.log("init start");
        APP.loading(true);
        this.Canvas = new Canvas();
        this.Samples = new SampleCollection();
        this.Library = new Libraries();
        this.initUI();
        APP.loading(false);
        console.log("init end");
    },
    initUI: function () {
        $('.upload-file').click(upload_file);
        $('#file-uploader').change(handle_image);
        $('a.innerContent').click(select_from_library);
        $('#input-link').change(select_from_internet);
        $('.add-free-drawing-tab').click(add_drawing_mode_sample);
        $('#paste-link-button').click(function () {
            $('#input-link').trigger("submit");
        });
        $('#paste_link_modal').on('hidden.bs.modal', on_modal_paste_link_hide)
            .on('shown.bs.modal', function () {
                $('#input-link').focus();
            });
        $('button.preview-button').mousedown(hide_controls_and_show_bg).mouseleave(show_controls).mouseup(show_controls);
        $('a[data-toggle="tab"]').on('shown.bs.tab', update_dropdown_caption);
        $('.sample-tabs').sortable({
            items: "> li",
            axis: 'x',
            cancel: '.add-new-sample',
            cursor: 'ew-resize',
            distance: 4,
            forceHelperSize: true,
            forcePlaceholderSize: true,
            opacity: 0.9,
            revert: true,
            scroll: true
        });
        $(window).resize(this.onResize).resize();
    },
    loading: function(isVisible){
        if(isVisible)
            this.LoadingOverlay.removeClass('non-visible');
        else
            this.LoadingOverlay.addClass('non-visible');
    },
    addSample: function(data, cb, err){
        APP.loading(true);
        APP.loading(false);
    },
    alert: function(msg){
        msg = msg || "Sorry, something is going wrong :C<br>Our team working on this problem!";
        var alert = $('<div class="auto-hidden-alert new">' + msg + '</div>');
        $('.alerts').append(alert);
        var nice_hide = _.bind(function () {
            $(this).clearQueue().addClass("deleted").delay(1100).slideUp(450).queue(function (next) {
                $(this).remove();
                next();
            });
        }, alert);
        alert.click(nice_hide);
        setTimeout(nice_hide, 5000);
    },
    onResize: function(){
        var st = $('.sample-tabs');
        var plus = $('.add-new-sample');
        st.css('max-width', $(window).width() - plus.width() + "px");
    }
};

$(function() {
    APP.init();
    test();
    APP.alert("WOW!");
});


//$('#collections_modal').modal('show');
//$('#collections_modal > div').click();
