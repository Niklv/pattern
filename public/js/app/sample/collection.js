//COLLECTION
var SampleCollection = Backbone.Collection.extend({
    model: Sample,
    initialize: function () {
        this.on("add", this.add_model);
        this.on("remove", this.remove_model);
        this.on("render", APP.Canvas.update, APP.Canvas);
    },
    add_model: function (model) {
        model.resize_and_filter(_.bind(function(){
            var view = new SampleView({model: model});
            model.view = view;
            view.render().init_controls().place();
            APP.Canvas.update();
        }, this));
    },
    remove_model: function () {
        APP.Canvas.removeAll();
        APP.Events.trigger("reinitialize");
        APP.Canvas.update();
    }
});