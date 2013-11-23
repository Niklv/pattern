//COLLECTION
var SampleCollection = Backbone.Collection.extend({
    model: Sample,
    initialize: function () {
        this.on("add", this.add_model);
        this.on("remove", this.remove_model);
        this.on("render", APP.Canvas.update, APP.Canvas);
    },
    add_model: function (model) {
        var view = new SampleView({model: model});
        model.view = view;
        view.render().init_controls().place();
        APP.Canvas.update();
    },
    remove_model: function () {
        APP.Canvas.removeAll();
        APP.Events.trigger("reinitialize");
        APP.Canvas.update();
    }
});