function upload_file(e) {
    e.stopPropagation();
    e.preventDefault();
    $('#file-uploader').click();
}

function update_dropdown_caption(e) {
    $(e.target).parent().parent().parent().find("a h4").html($(e.target).text() + " <b class='caret'></b>");
}

function select_from_library(e) {
    e.stopPropagation();
    e.preventDefault();
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
    ga('send', 'event', 'select_from_library', 'select', src);
    $.ajax({
        url: "img/calculated/" + src + ".json",
        success: function (data) {
            if (typeof data == "string")
                data = JSON.parse(data);
            var img = new Image();
            img.src = data.prefix + data.image;
            img.onload = function () {
                $('#collections_modal').modal('hide');
                APP.Samples.add({type: "img", img: img, layer: APP.Samples.length});
            };
        },
        error: function () {
            console.log("error!");
            console.log(arguments);
            ga('send', 'event', 'select_from_library', 'error', arguments);
        }
    });
    return 0;
}

function select_from_internet(e) {
    var src = $(e.currentTarget).val();
    ga('send', 'event', 'select_from_internet', 'select', src);
    $.ajax({
        url: "/imgtob64?img_url=" + src,
        success: function (data) {
            if (data.err != null) {
                $(e.currentTarget).addClass("text-danger");
                console.log("error!");
                console.log(arguments);
                return;
            }
            $(e.currentTarget).removeClass("text-danger");
            var img = new Image();
            img.src = data.prefix + data.image;
            img.onload = function () {
                APP.Samples.add({type: "img", img: img, layer: APP.Samples.length});
                $('#paste_link_modal').modal('hide');
            };
        },
        error: function () {
            $(e.currentTarget).addClass("text-danger");
            console.log("error!");
            console.log(arguments);
            ga('send', 'event', 'select_from_internet', 'error', arguments);
        }
    });
    return 0;
}

function on_modal_paste_link_hide(e) {
    $(e.target).find("input").val("").removeClass("text-danger");
}


function handle_image(e) {
    var reader = new FileReader();
    reader.onload = function (event) {
        var imgObj = new Image();
        imgObj.src = event.target.result;
        imgObj.onload = function () {
            APP.Samples.add({type: "img", img: imgObj, layer: APP.Samples.length});
        };
        $(e.target).val("");
    };
    reader.readAsDataURL(e.target.files[0]);
    ga('send', 'event', 'select_from_pc', 'select');
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


