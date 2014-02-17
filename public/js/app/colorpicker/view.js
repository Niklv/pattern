var ColorpickerView = Backbone.View.extend({
    $: {
        color_input: null,
        color_picker: null,
        alpha_input: null,
        alpha_picker: null,
        result: null
    },
    template_color: "<input class='hex-color' type='text'><div class='picker'><div class='map'><div class='pointer'></div></div><div class='column value'><div class='selector'></div></div></div></div>",
    template_alpha: "<input class='alpha' type='text'><div class='op-picker'><div class='selector'></div></div>",
    template_result: "<input type='text' class='color-result'>",
    events: {
        "click .hex-color": "show_picker",
        "click .alpha": "show_op_picker",
        "click .color-result": "show_picker",
        "blur input": "hide_all"
    },
    initialize: function () {
        var $color = $(this.template_color),
            $alpha = $(this.template_alpha),
            $result = $(this.template_result);
        this.$el.append($color, $alpha, $result);
        this.$.color_input = $color.eq(0);
        this.$.color_picker = $color.eq(1);
        this.$.alpha_input = $alpha.eq(0);
        this.$.alpha_picker = $alpha.eq(1);
        this.$.result = $result.eq(0);
    },
    set_positions: function(){

    },
    show_picker: function () {
        this.$.color_picker.toggleClass("vis");
        console.log("show_picker");
    },
    show_op_picker: function () {
        this.$.alpha_picker.toggleClass("vis");
    },
    hide_all: function(){
        this.$.color_picker.removeClass("vis");
        this.$.alpha_picker.removeClass("vis");
    }
});
