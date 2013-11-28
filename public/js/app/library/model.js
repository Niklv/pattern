var Library = Backbone.Model.extend({
    initialize: function (attr, opt) {
        this.items = new Backbone.Collection([], {model: Item});
        this.view = new LibraryView({model: this});
        this.view.$els = new Array(this.items.length);
        for (var i = 0; i < opt.total; i++)
            this.view.$els[i] = this.items.add({
                bg_url: this.get("sprite_path")+this.get("sprite_ext"),
                //offset_x: opt.item_width * (i % opt.width),
                //offset_y: opt.item_height * (i / opt.width),
                offset_x: (i % opt.width)/opt.width*100,
                offset_y: Math.floor(i / opt.width)/opt.height*100,
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