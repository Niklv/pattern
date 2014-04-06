var Library = Backbone.Model.extend({
    initialize: function (attr, opt) {
        this.items = new Backbone.Collection([], {model: Item});
        this.view = new LibraryView({model: this});
        this.view.$els = new Array(this.items.length);
        for (var i = 0; i < opt.total; i++)
            this.view.$els[i] = this.items.add({
                sprite_name: this.get("sprite_name"),
                bg_url: this.get("sprite_path") + this.get("sprite_name"),
                offset_x: (i % opt.width) / (opt.width - 1) * 100 + "%",
                offset_y: Math.floor(i / opt.width) / (opt.height - 1) * 100 + "%",
                bg_size: opt.width * 100 + "%",
                number: i + 1
            }).view.render().$el;
        this.view.render();
    }
});

var Item = Backbone.Model.extend({
    initialize: function () {
        this.view = new ItemView({model: this});
    }
});