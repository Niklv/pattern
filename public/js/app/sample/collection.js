//COLLECTION
var SampleCollection = Backbone.Collection.extend({
    model: Sample,
    initialize: function () {
        this.bind("add", this.add_model);
        this.bind("remove", this.remove_model);
        this.bind("render", canvas.update, canvas);
    },
    add_model: function (model) {
        var view = new SampleView({model: model});
        model.view = view;
        view.render().init_controls().place();
        canvas.update();
    },
    remove_model: function (model) {
        canvas.removeAll();
        for (var i = 0; i < this.length; i++)
            this.at(i).trigger("reinitialize");
        canvas.update();

    }
});