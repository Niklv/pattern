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
            containment: "parent",
            //cursor: 'ew-resize',
            delay: 100,
            sort: function (event, ui) {
                var that = $(this),
                    w = ui.helper.outerWidth();
                that.children().each(function () {
                    if ($(this).hasClass('ui-sortable-helper') || $(this).hasClass('ui-sortable-placeholder'))
                        return true;
                    // If overlap is more than half of the dragged item
                    var dist = Math.abs(ui.position.left - $(this).position().left),
                        before = ui.position.left > $(this).position().left;
                    if ((w - dist) > (w / 2) && (dist < w)) {
                        if (before)
                            $('.ui-sortable-placeholder', that).insertBefore($(this));
                        else
                            $('.ui-sortable-placeholder', that).insertAfter($(this));
                        return false;
                    }
                });
            },
            start: function(event, ui) {
                $(this).attr('data-previndex', ui.item.index());
            },
            stop: function (event, ui) {
                var newIndex = ui.item.index();
                var oldIndex = parseInt($(this).attr('data-previndex'));
                $(this).removeAttr('data-previndex');
                if(oldIndex!=newIndex){
                    APP.Samples.move(oldIndex, newIndex);
                }
            },
            distance: 2,
            revert: 100,
            //forceHelperSize: true,
            //forcePlaceholderSize: true,
            scroll: false
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
    onResize: _.debounce(function(){
        recalculate_tab_width();
        dropdown_add_align();
        //var st = $('.sample-tabs');
        //var plus = $('.add-new-sample');
        //st.css('max-width', $(window).width() - plus.width() + "px");
    }, 100)
};

$(function() {
    APP.init();
    //test();
    //APP.alert("WOW!");
});


//$('#collections_modal').modal('show');
//$('#collections_modal > div').click();
