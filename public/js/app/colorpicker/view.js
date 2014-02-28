var GLOBAL_COLORPICKER_EVENT_BUS = _.extend({}, Backbone.Events),
    isMouseClickedInside = false;

var ColorpickerView = Backbone.View.extend({
    template_color: "<input class='hex-color' type='text' maxlength='7'><div class='picker'><div class='map'><div class='pointer'></div></div><div class='column value'><div class='selector'><div class='arr-l'></div><div class='arr-r'></div></div></div></div>",
    template_alpha: "<input class='alpha' type='text' maxlength='4'><div class='op-picker'><div class='column alpha'><div class='alpha-gradient'><div class='selector'><div class='arr-l'></div><div class='arr-r'></div></div></div></div></div>",
    template_result: "<div class='result-wrapper'><div class='color-result'></div></div>",
    events: {
        "focus .hex-color": "show_picker",
        "input .hex-color": "parseColor",
        "focus .alpha": "show_op_picker",
        "input .alpha": "parseAlpha",
        "keydown .alpha": "keydown_op_picker",
        "click .color-result": "show_picker",
        "mousedown .map": "pointerStartmove",
        "mousedown .value": "selectorStartmove",
        "mousedown .alpha-gradient": "opselectorStartmove",
        "click .map": "change_mouse_state",
        "click .value": "change_mouse_state",
        "click .alpha-gradient": "change_mouse_state"
    },
    initialize: function (opt) {
        this.$el.append(this.template_color + this.template_alpha + this.template_result);
        this.$el.click(_.bind(this.stop_propagation, this));
        this._$ = {};
        this._$.color_input = this.$el.find('input.hex-color');
        this._$.color_picker = this.$el.find('div.picker');
        this._$.color_map = this._$.color_picker.find(".map");
        this._$.value_col = this._$.color_picker.find(".value");
        this._$.alpha_input = this.$el.find('input.alpha');
        this._$.alpha_picker = this.$el.find('div.op-picker');
        this._$.alpha_col = this._$.alpha_picker.find(".alpha-gradient");
        if (!opt.alpha)
            this._$.alpha_input.attr("disabled", true).css("display", "none");
        this._$.color_map_pointer = this._$.color_map.find('.pointer');
        this._$.color_value_selector = this._$.value_col.find('.selector');
        this._$.alpha_col_selector = this._$.alpha_col.find('.selector');
        this._$.result = this.$el.find("div.color-result");
        this.messages = GLOBAL_COLORPICKER_EVENT_BUS;
        this.messages.on("hide", _.bind(this.hide_all, this));

        this.pointerMove = _.bind(this.pointerMove, this);
        this.pointerStartmove = _.bind(this.pointerStartmove, this);
        this.pointerStopmove = _.bind(this.pointerStopmove, this);
        this.selectorMove = _.bind(this.selectorMove, this);
        this.selectorStartmove = _.bind(this.selectorStartmove, this);
        this.selectorStopmove = _.bind(this.selectorStopmove, this);
        this.opselectorMove = _.bind(this.opselectorMove, this);
        this.opselectorStartmove = _.bind(this.opselectorStartmove, this);
        this.opselectorStopmove = _.bind(this.opselectorStopmove, this);

        this.update_colors();
        this.update_controls();
        this.update_inputs();

        this.model.on("change:hsv", _.bind(this.update_colors, this));
    },
    stop_propagation: function (e) {
        e.stopPropagation();
        e.preventDefault();
    },
    update_all: function () {
        this.update_colors();
        this.update_controls();
        this.update_inputs();
    },
    update_colors: function () {
        var hsv = this.model.get("hsv");
        var rgb = this.model.get("rgb");
        var alpha = this.model.get("alpha");
        this._$.color_map.css({
            "background": "-webkit-linear-gradient(top, rgba(255, 255, 255, " + (1 - hsv.s) + "), #000000), -webkit-linear-gradient(to right, #ff0000 0%, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
            "background-image": "linear-gradient(to bottom, rgba(255, 255, 255, " + (1 - hsv.s) + "), #000), linear-gradient(to right, #F00 0%, #FF0, #0F0, #0FF, #00F, #F0F, #F00)"
        });
        this._$.value_col.css({
            "background-color": this.model.cnv.hsvtohex({h: hsv.h, s: 1, v: hsv.v})
        });
        this._$.alpha_col.css({
            "background": "-webkit-linear-gradient(to bottom, rgba(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ", 1), rgba(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ", 0))",
            "background-image": "linear-gradient(to bottom, rgba(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ", 1), rgba(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ", 0))"
        });
        this._$.result.css({
            "background-color": this.model.getRGBA_string()
        });
    },
    update_controls: function () {
        var hsv = this.model.get("hsv");
        var alpha = this.model.get("alpha");
        this._$.color_map_pointer.css({
            top: (1 - hsv.v) * 100 + "%",
            left: hsv.h * 100 + "%"
        });
        this._$.color_value_selector.css("top", (1 - hsv.s) * 100 + "%");
        this._$.alpha_col_selector.css("top", (1 - alpha) * 100 + "%");
    },
    update_inputs: function () {
        var hex = this.model.get("hex");
        var alpha = this.model.get("alpha");
        this._$.color_input.val(hex);
        this._$.alpha_input.val(alpha.toFixed(2));
    },
    show_picker: function (e) {
        e.stopPropagation();
        e.preventDefault();
        //check for visibility
        if (this._$.color_picker.height() + this._$.color_input.outerHeight(true) + this._$.color_input.offset().top <= $(window).height())
            this._$.color_picker.css({
                top: this._$.color_input.outerHeight(true) + this._$.color_input.position().top + "px",
                left: this._$.color_input.position().left + "px"
            }).removeClass("upSideDown");
        else
            this._$.color_picker.css({
                top: -this._$.color_picker.height() + "px",
                left: this._$.color_input.position().left + "px"
            }).addClass("upSideDown");
        this.messages.trigger("hide");
        this._$.color_picker.addClass("vis").removeClass("none");
        //$(document).on("click", hide_all_colorpickers);
    },
    hide_picker: function () {
        this._$.color_picker.addClass("none");
    },
    show_op_picker: function (e) {
        e.stopPropagation();
        e.preventDefault();
        if (this._$.alpha_picker.height() + this._$.alpha_input.outerHeight(true) + this._$.alpha_input.offset().top <= $(window).height())
            this._$.alpha_picker.css({
                top: this._$.alpha_input.outerHeight(true) + this._$.alpha_input.position().top + "px",
                left: this._$.alpha_input.position().left + "px"
            }).removeClass("upSideDown");
        else
            this._$.alpha_picker.css({
                top: -this._$.alpha_picker.height() + "px",
                left: this._$.alpha_input.position().left + "px"
            }).addClass("upSideDown");
        this.messages.trigger("hide");
        this._$.alpha_picker.addClass("vis").removeClass("none");
        //$(document).on("click", hide_all_colorpickers);
    },
    hide_op_picker: function () {
        this._$.alpha_picker.addClass("none");
    },
    hide_all: function () {
        this.hide_picker();
        this.hide_op_picker();
    },
    bind_focus: function () {
        $("body").addClass("unselectable");
        this._$.color_input.blur();
        this._$.alpha_input.blur();
    },
    unbind_focus: function () {
        $("body").removeClass("unselectable");
        this._$.color_input.blur();
        this._$.alpha_input.blur();
    },

    pointerStartmove: function (e) {
        $(document).on({
            mouseover: this.pointerMove,
            mousemove: this.pointerMove,
            mouseup: this.pointerStopmove
        });
        this.bind_focus();
        this.pointerMove(e);
        this.show_picker(e);
        isMouseClickedInside = true;
    },
    pointerStopmove: function (e) {
        this.unbind_focus();
        $(document).off({
            mouseover: this.pointerMove,
            mousemove: this.pointerMove,
            mouseup: this.pointerStopmove
        });
    },
    pointerMove: function (e) {
        e.stopPropagation();
        e.preventDefault();
        var maxH, maxW, offset, x, y;
        offset = this._$.color_map.offset();
        maxW = this._$.color_map.width();
        maxH = this._$.color_map.height();
        x = (e.clientX - offset.left) * 100 / maxW;
        y = (e.clientY - offset.top) * 100 / maxH;
        x = Math.max(Math.min(100, x), 0);
        y = Math.max(Math.min(100, y), 0);
        this._$.color_map_pointer.css("top", y + "%");
        this._$.color_map_pointer.css("left", x + "%");
        this.model.attributes.hsv.h = x / 100;
        this.model.attributes.hsv.v = (100 - y ) / 100;
        this.model.trigger("change:hsv");
        this.update_colors();
        this.update_inputs();
    },
    selectorStartmove: function (e) {
        $(document).on({
            mouseover: this.selectorMove,
            mousemove: this.selectorMove,
            mouseup: this.selectorStopmove
        });
        this.bind_focus();
        this.selectorMove(e);
        this.show_picker(e);
        isMouseClickedInside = true;
    },
    selectorStopmove: function (e) {
        this.unbind_focus();
        $(document).off({
            mouseover: this.selectorMove,
            mousemove: this.selectorMove,
            mouseup: this.selectorStopmove
        });
    },
    selectorMove: function (e) {
        e.stopPropagation();
        e.preventDefault();
        y = (e.clientY - this._$.value_col.offset().top) * 100 / this._$.value_col.height();
        y = Math.max(Math.min(100, y), 0);
        this._$.color_value_selector.css("top", y + "%");
        this.model.attributes.hsv.s = (100 - y) / 100;
        this.model.trigger("change:hsv");
        this.update_colors();
        this.update_inputs();
    },
    opselectorStartmove: function (e) {
        $(document).on({
            mouseover: this.opselectorMove,
            mousemove: this.opselectorMove,
            mouseup: this.opselectorStopmove
        });
        this.bind_focus();
        this.opselectorMove(e);
        this.show_op_picker(e);
        isMouseClickedInside = true;
    },

    opselectorStopmove: function (e) {
        this.unbind_focus();
        $(document).off({
            mouseover: this.opselectorMove,
            mousemove: this.opselectorMove,
            mouseup: this.opselectorStopmove
        });

    },
    opselectorMove: function (e) {
        e.stopPropagation();
        e.preventDefault();
        y = (e.clientY - this._$.alpha_col.offset().top) * 100 / this._$.alpha_col.height();
        y = Math.max(Math.min(100, y), 0);
        this._$.alpha_col_selector.css("top", y + "%");
        this.model.set("alpha", (100 - y) / 100);
        this.update_colors();
        this.update_inputs();
    },
    parseColor: function (e) {
        this.show_picker(e);
        var rgbarr = [];
        var val = this._$.color_input.val();
        var color = val.replace(/[^A-Fa-f0-9]/g, "");
        if ((val[0] != '#') || (val.length - 1 != color.length)) {
            pos = this._$.color_input[0].selectionStart;
            this._$.color_input.val('#' + color);
            if (pos != val.length) {
                this._$.color_input[0].selectionStart = pos - 1;
                this._$.color_input[0].selectionEnd = pos - 1;
            }
        }
        if (color.length == 0)
            color = "FFFFFF";
        if (color.length == 3)
            color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
        else
            while (color.length < 6)
                color += color[color.length - 1];
        while (color.length >= 2) {
            rgbarr.push(parseInt(color.substring(0, 2), 16));
            color = color.substring(2, color.length);
        }
        this.model.attributes.rgb = {r: rgbarr[0], g: rgbarr[1], b: rgbarr[2]};
        this.model.trigger("change:rgb");
        this.update_controls();
        this.update_colors();
    },
    parseAlpha: function (e) {
        this.show_op_picker(e);
        var orig_val = this._$.alpha_input.val(),
            val = orig_val.replace(/[^\+\-0-9\.]/g, "").match(/[\+\-]{0,1}[0-9]{0,}[\.]{0,1}[0-9]{0,}/)[0],
            posOff = orig_val.length - val.length,
            pos = this._$.alpha_input[0].selectionStart,
            isLast = pos == orig_val.length,
            num;
        num = parseFloat(val);

        if (isNaN(num)) {
            this._$.alpha_input.val(val);
        } else {
            if (num < 0) {
                num = 0;
                this._$.alpha_input.val(num);
            } else if (num > 1) {
                num = 1;
                this._$.alpha_input.val(num);
            } else
                this._$.alpha_input.val(val);
        }
        //restore cursor
        if (isLast) {
            this._$.alpha_input[0].selectionStart = this._$.alpha_input.val().length;
            this._$.alpha_input[0].selectionEnd = this._$.alpha_input.val().length;
        } else {
            this._$.alpha_input[0].selectionStart = pos + posOff;
            this._$.alpha_input[0].selectionEnd = pos + posOff;
        }
        if (isNaN(num))
            num = 0;
        this.model.set("alpha", num);
        this.update_colors();
        this.update_controls();
    },
    keydown_op_picker: function (e) {
        var key = e.keyCode;
        if (key != 38 && key != 40)
            return;
        var val = parseInt(Math.round(this._$.alpha_input.val() * 10000));
        var step = 0.01 * 10000;
        var ost = val % step;
        if (key == 38 && (val > 0 || !ost)) //key up
            val += step;
        else if (key == 40 && (val < 0 || !ost)) //key down
            val -= step;
        val -= ost;
        val /= 10000;
        val = Math.max(val, 0);
        val = Math.min(val, 1);
        this._$.alpha_input.val(val);
        this._$.alpha_input[0].selectionStart = this._$.alpha_input.val().length;
        this._$.alpha_input[0].selectionEnd = this._$.alpha_input.val().length;
        this.model.set("alpha", val);
        this.update_colors();
        this.update_controls();
    },
    change_mouse_state: function () {
        isMouseClickedInside = false;
    },
    removeVisClass: function(){
        this._$.color_picker.removeClass('vis');
        this._$.alpha_picker.removeClass('vis');
    }
});

function hide_all_colorpickers() {
    if (isMouseClickedInside)
        isMouseClickedInside = false;
    else {
        GLOBAL_COLORPICKER_EVENT_BUS.trigger("hide");
        //$(document).off("click", hide_all_colorpickers);
    }

}

$(document).on("click", hide_all_colorpickers);

