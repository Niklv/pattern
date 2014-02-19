var GLOBAL_COLORPICKER_EVENT_BUS = _.extend({}, Backbone.Events);

var ColorpickerView = Backbone.View.extend({
    $: {
        color_input: null,
        color_picker: null,
        color_map: null,
        alpha_input: null,
        alpha_picker: null,
        alpha_col: null,
        result: null
    },
    messages: GLOBAL_COLORPICKER_EVENT_BUS,
    template_color: "<input class='hex-color' type='text' maxlength='7'><div class='picker'><div class='map'><div class='pointer'></div></div><div class='column value'><div class='selector'></div></div></div></div>",
    template_alpha: "<input class='alpha' type='text' maxlength='4'><div class='op-picker'><div class='column alpha'><div class='alpha-gradient'><div class='selector'></div></div></div>",
    template_result: "<div class='result-wrapper'><div class='color-result'></div></div>",
    events: {
        "click .hex-color": "show_picker",
        "focus .hex-color": "show_picker",
        "input .hex-color": "show_picker",
        "click .alpha": "show_op_picker",
        "focus .alpha": "show_op_picker",
        "input .alpha": "show_op_picker",
        "click .color-result": "show_picker"
    },
    initialize: function () {
        var $color = $(this.template_color),
            $alpha = $(this.template_alpha),
            $result = $(this.template_result);
        this.$el.append($color, $alpha, $result);
        this.$.color_input = $color.eq(0);
        this.$.color_picker = $color.eq(1);
        this.$.color_map = this.$.color_picker.find(".map");
        this.$.value_col = this.$.color_picker.find(".value");
        this.$.alpha_input = $alpha.eq(0);
        this.$.alpha_picker = $alpha.eq(1);
        this.$.alpha_col = this.$.alpha_picker.find(".alpha-gradient");
        this.$.result = $result.eq(0).find(".color-result");
        this.set_positions();
        this.update_colors();
        this.messages.on("hide", _.bind(this.hide_all, this));
    },
    set_positions: function () {
        this.$.color_picker.css({
            top: this.$.color_input.outerHeight(true) + "px",
            left: this.$.color_input.position().left + "px"
        });

        this.$.alpha_picker.css({
            top: this.$.alpha_input.outerHeight(true),
            left: this.$.alpha_input.position().left + "px"
        });
    },
    update_colors: function () {
        var hsv = this.model.get("hsv");
        var rgb = this.model.get("rgb");
        this.$.color_map.css({
            "background": "-webkit-linear-gradient(top, rgba(255, 255, 255, " + (1 - hsv.s) + "), #000000), -webkit-linear-gradient(to right, #ff0000 0%, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
            "background-image": "linear-gradient(to bottom, rgba(255, 255, 255, " + (1 - hsv.s) + "), #000), linear-gradient(to right, #F00 0%, #FF0, #0F0, #0FF, #00F, #F0F, #F00)"
        });
        this.$.value_col.css({
            "background-color": this.model.cnv.hsvtohex({h: hsv.h, s: 1, v: hsv.v})
        });
        this.$.alpha_col.css({
            "background": "-webkit-linear-gradient(to bottom, rgba(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ", 1), rgba(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ", 0))",
            "background-image": "linear-gradient(to bottom, rgba(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ", 1), rgba(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ", 0))"
        });
        this.$.result.css({
            "background-color": this.model.getRGBA_string()
        });
    },
    show_picker: function (e) {
        e.stopPropagation();
        this.messages.trigger("hide");
        this.$.color_picker.addClass("vis");
    },
    hide_picker: function () {
        this.$.color_picker.removeClass("vis");
    },
    show_op_picker: function (e) {
        e.stopPropagation();
        this.messages.trigger("hide");
        this.$.alpha_picker.addClass("vis");
    },
    hide_op_picker: function () {
        this.$.alpha_picker.removeClass("vis");
    },
    hide_all: function () {
        this.hide_picker();
        this.hide_op_picker();
    },
    bind_focus: function () {
        $("body").addClass("unselectable");
        this.$.color_input.blur();
        this.$.alpha_input.blur();
    },
    unbind_focus: function () {
        $("body").removeClass("unselectable");
        //this.$.color_input.blur();
        //this.$.alpha_input.blur();
    },

    pointerStartmove: function (e) {
        $(document).on({
            mouseover: this.pointerMove,
            mousemove: this.pointerMove,
            mouseup: this.pointerStopmove
        });
        this.bind_focus();
        this.pointerMove(e);
    },
    pointerStopmove: function (e) {
        this.pointerMove(e);
        this.unbind_focus();
        $(document).off({
            mouseover: this.pointerMove,
            mousemove: this.pointerMove,
            mouseup: this.pointerStopmove
        });
    },
    pointerMove: function (e) {
        var maxH, maxW, offset, x, y;
        e.stopPropagation();
        e.preventDefault();
        offset = this.map.offset();
        maxW = this.map.width();
        maxH = this.map.height();
        x = (e.clientX - offset.left) * 100 / maxW;
        y = (e.clientY - offset.top) * 100 / maxH;
        x = Math.max(Math.min(100, x), 0);
        y = Math.max(Math.min(100, y), 0);
        this.pointer.css("top", y + "%");
        this.pointer.css("left", x + "%");
        //TODO: I STOP THERE!
        //this.model.setHue(x);
        //this.model.setValue(100 - y);
        //this.model.recalculateColor();
    }
});

$(document).click(function () {
    GLOBAL_COLORPICKER_EVENT_BUS.trigger("hide");
});

