//TODO: update ranges and set new values
var Slider = Backbone.View.extend({
    keys: [45, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57], //- + 0-9
    range: null,
    initialize: function (opt) {
        var range = this.range = this.model.get("range")[opt.name];
        this.name = opt.name;
        this.setElement(opt.jquery_object);
        this.$input = this.$el.find('input');
        this.$slider = this.$el.find(".slider");
        this.$input.val(this.model.get(opt.name));
        this.$slider.slider({
            animate: ANIM_TIME,
            min: range.min,
            max: range.max,
            step: range.step,
            value: this.model.get(opt.name),
            range: "min"
        });
        this.model.on("change:range", this.setNewRange, this);
        this.model.on("change:" + opt.name, this.setNewValue, this);
        this.model.on("remove", this.remove, this);
    },
    events: {
        "slide .slider": "onslide",
        "input input": "on_input",
        "keydown input": "up_and_down"
    },
    setNewValue: function () {
        var val = this.model.get(this.name);
        this.$slider.slider("value", val);
        this.$input.val(val);
    },
    setNewRange: function () {
        this.range = this.model.get("range")[this.name];
        this.$slider.slider("option", "min", this.range.min);
        this.$slider.slider("option", "max", this.range.max);
    },
    up_and_down: function (e) {
        var key = e.keyCode;
        if (key != 38 && key != 40)
            return;
        var val = parseInt(Math.round($(e.target).val() * 10000));
        var slider_options = this.$slider.slider("option");
        var step = slider_options.step * 10000;
        var ost = val % step;
        if (key == 38 && (val > 0 || !ost)) //key up
            val += step;
        else if (key == 40 && (val < 0 || !ost)) //key down
            val -= step;
        val -= ost;
        val /= 10000;
        val = Math.max(val, slider_options.min);
        val = Math.min(val, slider_options.max);
        this.$input.val(val);
        this.$input[0].selectionStart = this.$input.val().length;
        this.$input[0].selectionEnd = this.$input.val().length;
        this.$slider.slider("value", val);
        this.save(val);
    },
    on_input: function (e) {
        console.log(e);
        var opt = this.$slider.slider("option"),
            orig_val = this.$input.val(),
            val = orig_val.replace(/[^\+\-0-9\.]/g, "").match(/[\+\-]{0,1}[0-9]{0,}[\.]{0,1}[0-9]{0,}/)[0],
            posOff = orig_val.length - val.length,
            pos = this.$input[0].selectionStart,
            isLast = pos == orig_val.length,
            num;
        if (isInt(opt.step))
            num = parseInt(val);
        else
            num = parseFloat(val);
        if (isNaN(num)) {
            this.$input.val(val);
        } else {
            if (num < opt.min) {
                num = opt.min;
                this.$input.val(num);
            } else if (num > opt.max) {
                num = opt.max;
                this.$input.val(num);
            } else
                this.$input.val(val);
        }
        //restore cursor
        if (isLast) {
            this.$input[0].selectionStart = this.$input.val().length;
            this.$input[0].selectionEnd = this.$input.val().length;
        } else {
            this.$input[0].selectionStart = pos + posOff;
            this.$input[0].selectionEnd = pos + posOff;
        }
        if (isNaN(num))
            num = opt.min;
        this.$slider.slider("value", num);
        this.save(this.$slider.slider("value"));

    },
    onslide: function (e, o) {
        this.$input.val(o.value);
        this.save(o.value);
    },
    save: function (val) {
        this.model.off("change:" + this.name, this.setNewValue, this);
        this.model.set(this.name, val);
        this.model.on("change:" + this.name, this.setNewValue, this);
    },
    remove: function(){
        this.model.off("change:range", this.setNewRange, this);
        this.model.off("change:" + this.name, this.setNewValue, this);
        this.model.off("remove", this.remove, this);
    }
});