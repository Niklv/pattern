//COLLECTION
var SampleCollection = Backbone.Collection.extend({
    model: Sample,
    initialize: function () {
        this.on("add", this.add_model);
        this.on("remove", this.remove_model);
        this.on("render", APP.Canvas.update, APP.Canvas);
    },
    add_model: function (model) {
        model.resize_and_filter(_.bind(function () {
            var view = new SampleView({model: model});
            model.view = view;
            view.render().init_controls().place();
            APP.Canvas.update();
            recalculate_tab_width();
        }, this));

    },
    move: function (oldIndex, newIndex) {
        var model = this.at(oldIndex);
        this.remove(model, {silent:true});
        this.add(model, {at: newIndex, silent:true});
        this.each(function (sample, i) {
            sample.set("layer", i);
        });
        APP.Canvas.update();
    },
    swap: function (a, b) {
        this.models[a] = this.models.splice(b, 1, this.models[a])[0];
        this.models[a].set("layer", a);
        this.models[b].set("layer", b);
        APP.Canvas.update();
    },
    remove_model: function () {
        APP.Canvas.removeAll();
        this.each(function (sample, i) {
            sample.set("layer", i);
        });
        APP.Events.trigger("reinitialize");
        APP.Canvas.update();
    }
});