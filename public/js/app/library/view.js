var LibraryView = Backbone.View.extend({
    tagName: "div",
    className: "tab-pane fade",
    $els: null,
    $link: null,
    initialize: function () {
        this.model.on("change render", this.render, this);
        $("#sample-tabs-content").append(this.$el.attr("id", this.model.get("id_name")));
        this.$link = $('<li><a href="#' + this.model.get("id_name") + '" tabindex="-1" data-toggle="tab">'
            + this.model.get("name") + '</a></li>');
        this.$link.find('a').on('shown.bs.tab', update_dropdown_caption);
        $('#sample-collections-tabs').find(".dropdown-menu").append(this.$link);
    },
    render: function () {
        $.each(this.$els, _.bind(function (n, val) {
            this.$el.append(val);
        }, this));
        return this;
    }
});

var ItemView = Backbone.View.extend({
    tagName: "div",
    className: "box generated",
    template: _.template($("#library-item-tmpl").remove().text()),
    initialize: function () {
        this.model.on("change render", this.render, this);
    },
    render: function () {
        this.$el.html(this.template(this.model.attributes));
        return this;
    },
    events: {
        "click a.innerContent": "onclick"
    },
    onclick: function (e) {
        select_from_library(e);
    }
});