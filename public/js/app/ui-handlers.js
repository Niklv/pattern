function upload_file(e) {
    e.stopPropagation();
    e.preventDefault();
    $('#file-uploader').click();
}

function handle_image(e) {
    var reader = new FileReader();
    reader.onload = function (event) {
        var imgObj = new Image();
        var res = event.target.result;
        if (res) {
            var ext = res.split("\/")[1];
            if (ext) {
                ext = ext.split(";")[0];
                if (ext && (ext == 'jpeg' || ext == 'bmp' || ext == 'png')) {
                    imgObj.src = event.target.result;
                    imgObj.onload = function () {
                        APP.Samples.add({type: "img", img: imgObj, layer: APP.Samples.length});
                    };
                } else
                    APP.alert("Only .png, .jpeg and .bmp supported!");
            } else
                APP.alert("Only .png, .jpeg and .bmp supported!");
        } else
            APP.alert("File is empty!");
        $(e.target).val("");
    };
    reader.readAsDataURL(e.target.files[0]);
    ga('send', 'event', 'select_from_pc', 'select');
}

function update_dropdown_caption(e) {
    $(e.target).parent().parent().parent().find("a h4").html($(e.target).text() + " <b class='caret'></b>");
}

function select_from_library(e) {
    e.stopPropagation();
    e.preventDefault();
    APP.loading(true);
    var src = "", sprite_name = $(this).attr("data-sprite");
    if (sprite_name) {
        //TODO: validation!
        src = sprite_name.split('.');
        src = _.first(src) + "_" + $(this).attr("data-number") + "." + _.last(src);
    } else {
        src = $(this).find('img').attr('src');
        src = src.split("/");
        src = _.last(src);
    }
    console.log(src);
    $.ajax({
        url: "img/calculated/" + src + ".json",
        success: function (data) {
            if (typeof data == "string")
                data = JSON.parse(data);
            var img = new Image();
            img.src = data.prefix + data.image;
            img.onload = function () {
                APP.Samples.add({type: "img", img: img, layer: APP.Samples.length});
                APP.loading(false);
            };
        },
        error: function () {
            console.log("error!");
            console.log(arguments);
            APP.loading(false);
            APP.alert();
        }
    });
    $('#collections_modal').modal('hide');
}

function select_from_internet(e) {
    e.stopPropagation();
    e.preventDefault();
    APP.loading(true);
    var src = $(e.currentTarget).val();
    ga('send', 'event', 'select_from_internet', 'select', src);
    $.ajax({
        url: "/imgtob64?img_url=" + src,
        success: function (data) {
            if (data.err != null) {
                $(e.currentTarget).addClass("text-danger");
                console.log("error!");
                console.log(arguments);
                APP.loading(false);
                APP.alert("Error parsing image!");
                return;
            }
            $(e.currentTarget).removeClass("text-danger");
            var img = new Image();
            img.src = data.prefix + data.image;
            img.onload = function () {
                APP.Samples.add({type: "img", img: img, layer: APP.Samples.length});
                APP.loading(false);
            };
        },
        error: function () {
            $(e.currentTarget).addClass("text-danger");
            console.log("error!");
            console.log(arguments);
            APP.loading(false);
            APP.alert();

        }
    });
    $('#paste_link_modal').modal('hide');
}

function on_modal_paste_link_hide(e) {
    $(e.target).find("input").val("").removeClass("text-danger");
}


function hide_controls_and_show_bg() {
    APP.Canvas.render_to_bg();
    $('.canvas-container').addClass("preview");
    $('.controls-section').addClass("flow-down");
    ga('send', 'event', 'preview-button', 'click');
}

function show_controls() {
    $('.canvas-container').removeClass("preview");
    $('.controls-section').removeClass("flow-down");
}

function add_drawing_mode_sample() {

}

function recalculate_tab_width(onRemove) {
    var st = $('.sample-tabs');
    var total = $(window).width() - $(".add-new-sample").width();
    console.log(total);
    var lis = st.find('> li');
    var n = lis.length;
    lis.each(function (i) {
        if (onRemove)
            $(this).css('max-width', total / (n - 1) + "px");
        else
            $(this).css('max-width', total / n + "px");

    });
}


