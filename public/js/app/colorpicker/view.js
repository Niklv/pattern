var ColorpickerView = Backbone.View.extend({
    $color: null,
    $alpha: null,
    $result: null,
    template_color: "<input class='hex-color' type='text'><div class='picker'><div class='map'><div class='pointer'></div></div><div class='column value'><div class='selector'></div></div></div></div>",
    template_alpha: "<input class='alpha' type='text'><div class='op-picker'><div class='selector'></div></div>",
    template_result: "<input type='text' class='color-result'>",
    initialize: function () {
        this.$color = $(this.template_color);
        this.$alpha = $(this.template_alpha);
        this.$result = $(this.template_result);
        this.$el.append(this.$color, this.$alpha, this.$result);
    }
});
