//TODO: update ranges and set new values
var Slider = Backbone.View.extend({
    keys: [45, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57], //- + 0-9
    range: null,
    initialize: function (opt) {
        var range = this.range = this.model.get("range")[opt.name];
        this.name = opt.name;
        this.$el = opt.jquery_object;
        this.$input = this.$el.find('input');
        this.$slider = this.$el.find(".slider");
        this.$input.val(this.model.get(opt.name));
        this.$slider.slider({
            animate: 100,
            min: range.min,
            max: range.max,
            step: range.step,
            value: this.model.get(opt.name),
            range: "min"
        });
        this.delegateEvents();
    },
    events: {
        "slide .slider": "onslide",
        "input input": "oninput",
        "keypress input": "filter_number",
        "keydown input": "up_and_down"
    },
    up_and_down: function (e) {
        var key = e.keyCode;
        if (key != 38 && key != 40)
            return;
        var val = parseInt($(e.target).val() * 10000);
        var slider_options = this.$slider.slider("option");
        var step = slider_options.step * 10000;
        var ost = val % step;
        if (key == 38) { //key up
            if (ost)
                val += step - Math.abs(ost);
            else
                val += step;
        } else if (key == 40) {  //key down
            if (ost)
                val -= ost;
            else
                val -= step;
        }
        val /= 10000;
        val = Math.max(val, slider_options.min);
        val = Math.min(val, slider_options.max);
        this.$input.val(val);
        this.$slider.slider("value", val);
        this.save(val);
    },
    filter_number: function (e) {
        var key = e.keyCode;
        if (!_.contains(this.keys, key))
            e.preventDefault();
        else if (key == 46 && $(e.target).val().match(/\./g))
            e.preventDefault();
        else if (key == 45 && $(e.target).val().match(/[-]/g))
            e.preventDefault();
    },
    oninput: function (e) {
        var opt = this.$slider.slider("option");
        var value = this.$input.val();
        if (value == "") value = 0;
        if (isInt(opt.step))
            value = parseInt(value);
        else
            value = parseFloat(value);
        if (isNaN(value)) {
            event.preventDefault();
            return;
        }
        if (value < opt.min) {
            this.$slider.slider("value", opt.min);
            this.$input.val(opt.min);
        } else if (value > opt.max) {
            this.$slider.slider("value", opt.max);
            this.$input.val(opt.max);
        } else
            this.$slider.slider("value", value);
        this.save(this.$slider.slider("value"));
    },
    onslide: function (e, o) {
        this.$input.val(o.value);
        this.save(o.value);
    },
    save: function (val) {
        this.model.set(this.name, val);
    }
});