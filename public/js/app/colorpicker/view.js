var ColorpickerView = Backbone.View.extend({
    $rgb: null,
    $alpha: null,
    $result_color: null,
    template_color: "<input class='hex-color' type='text'><div class='picker'><div class='map'><div class='pointer'></div></div><div class='column value'><div class='selector'></div></div></div></div>",
    template_alpha: "<input class='alpha' type='text'><div class='op-picker'><div class='selector'></div></div>",
    initialize: function () {
        this.$el.css({height: "100px", width: "100px", "background-color": "red"});
    }
});
