//VIEW
var SampleView = Backbone.View.extend({
    $tabHeader: null,
    tagName: "div",
    className: "tab-pane fade",
    template: _.template($("#part-settings-tmpl").remove().text()),
    tabHeaderTemplate: _.template($("#part-settings-tab-header-tmpl").remove().text()),
    controlTemplate: _.template($("#part-settings-control").remove().text()),
    j: {
        x: null,
        y: null,
        height: null,
        width: null,
        opacity: null,
        angle: null,
        count: null,
        offset: null,
        radius: null,
        angle_delta: null,
        colorpicker: null,
        origin_ratio: null
    },
    init_controls: function () {
        this.j.x = this.$el.find('.x');
        this.j.y = this.$el.find('.y');
        this.j.angle = this.$el.find('.angle');
        this.j.angle_delta = this.$el.find('.angle-delta');
        this.j.width = this.$el.find('.width');
        this.j.height = this.$el.find('.height');
        this.j.opacity = this.$el.find('.opacity');
        this.j.count = this.$el.find('.count');
        this.j.offset = this.$el.find('.offset');
        this.j.radius = this.$el.find('.radius');
        this.j.colorpicker = this.$el.find('.colorpicker');
        this.j.origin_ratio = this.$el.find('.lock-origin-ratio');

        //console.log(this.model.attributes);
        this.$tabHeader.find('button.close').click(_.bind(this.remove, this));
        this.j.colorpicker.colorPicker("init", {opacity: 1, position: "top"}).colorPicker("setRGBA", this.model.get("overlay"));
        this.$el.find('input.grid-of-obj[value=' + this.model.get('grid') + ']').attr('checked', true);
        this.$el.find('input.placement-of-obj[value=' + this.model.get('placement') + ']').attr('checked', true);
        if (this.model.get("lock_ratio"))
            this.j.origin_ratio.addClass("locked");
        switch (this.$el.find('.placement input:checked').val()) {
            case "one":
                this.j.x.show();
                this.j.y.show();
                this.j.angle.show();
                this.j.count.hide();
                this.j.offset.hide();
                this.j.angle_delta.hide();
                this.j.radius.hide();
                this.$el.find('.placement button.rndmz').hide();
                break;
            case "random":
                this.j.x.hide();
                this.j.y.hide();
                this.j.angle.hide();
                this.j.count.show();
                this.j.offset.hide();
                this.j.angle_delta.hide();
                this.j.radius.hide();
                this.$el.find('.placement button.rndmz').show();
                break;
            case "circle":
                this.j.x.show();
                this.j.y.show();
                this.j.angle.show();
                this.j.count.show();
                this.j.offset.show();
                this.j.angle_delta.show();
                this.j.radius.show();
                this.$el.find('.placement button.rndmz').hide();
                break;
        }

        new Slider({model: this.model, name: "angle", jquery_object: this.j.angle});
        new Slider({model: this.model, name: "opacity", jquery_object: this.j.opacity});
        new Slider({model: this.model, name: "width", jquery_object: this.j.width});
        new Slider({model: this.model, name: "height", jquery_object: this.j.height});
        new Slider({model: this.model, name: "count", jquery_object: this.j.count});
        new Slider({model: this.model, name: "x", jquery_object: this.j.x});
        new Slider({model: this.model, name: "y", jquery_object: this.j.y});
        new Slider({model: this.model, name: "radius", jquery_object: this.j.radius});
        new Slider({model: this.model, name: "angle_delta", jquery_object: this.j.angle_delta});
        new Slider({model: this.model, name: "offset", jquery_object: this.j.offset});

        return this;
    },
    change_settings_order: function () {
        switch (this.$el.find('.placement input:checked').val()) {
            case "one":
                this.j.x.slideDown(ANIM_TIME);
                this.j.y.slideDown(ANIM_TIME);
                this.j.angle.slideDown(ANIM_TIME);
                this.j.count.slideUp(ANIM_TIME);
                this.j.offset.slideUp(ANIM_TIME);
                this.j.angle_delta.slideUp(ANIM_TIME);
                this.j.radius.slideUp(ANIM_TIME);
                this.$el.find('.placement button.rndmz').hide();
                break;
            case "random":
                this.j.x.slideUp(ANIM_TIME);
                this.j.y.slideUp(ANIM_TIME);
                this.j.angle.slideUp(ANIM_TIME);
                this.j.count.slideDown(ANIM_TIME);
                this.j.offset.slideUp(ANIM_TIME);
                this.j.angle_delta.slideUp(ANIM_TIME);
                this.j.radius.slideUp(ANIM_TIME);
                this.$el.find('.placement button.rndmz').show();
                break;
            case "circle":
                this.j.x.slideDown(ANIM_TIME);
                this.j.y.slideDown(ANIM_TIME);
                this.j.angle.slideDown(ANIM_TIME);
                this.j.count.slideDown(ANIM_TIME);
                this.j.offset.slideDown(ANIM_TIME);
                this.j.angle_delta.slideDown(ANIM_TIME);
                this.j.radius.slideDown(ANIM_TIME);
                this.$el.find('.placement button.rndmz').hide();
                break;
        }
    },
    place: function () {
        //this.$el.hide();
        //$('.control-panel > .row:first-child').after(this.$el);
        //1 create tab+
        //$('.controls-section .sample-tabs .active').removeClass('active').removeClass('in');
        //$('.controls-section .tab-content .active').removeClass('active');
        $('.controls-section .add-new-sample').before(this.$tabHeader);
        $('.controls-section .tab-content').append(this.$el);
        this.$tabHeader.find('a').tab('show');

        //this.$tabHeader.find('a').tab('show');
        //2 paste tab content

        //3 focus to tab

        //this.$el.slideDown(ANIM_TIME);
        //$('li.active').removeClass('active');
        //this.$tabHeader.addClass('active');
        return this;
    },
    render: function () {
        this.$el.html(this.template(_.extend(this.model.attributes, {control: this.controlTemplate})));
        this.$el.attr('id', "settings-panel-" + this.model.get("id"));
        this.$tabHeader = $(this.tabHeaderTemplate(this.model.attributes));
        return this;
    },
    events: {
        "click button.rndmz": "generate_random_layout",
        "change input[type=radio]": "radio_changed",
        "change input.placement-of-obj": "change_settings_order",
        "changeColor input.colorpicker": "color_changed",
        "click .lock-origin-ratio": "ratio_changed",
        "click button.random": "random"
    },
    generate_random_layout: function () {
        this.model.change_layout();
        this.model.trigger("render");
    },
    random: function () {
        this.$el.find("button.random").attr("disabled", true);
        this.model.randomize();
        var v = this.model.attributes;
        this.$el.find('.placement input[value=' + v.placement + ']').prop('checked', true);
        this.$el.find('.grid input[value=' + v.grid + ']').prop('checked', true);
        this.change_settings_order();
        this.$el.find("button.random").attr("disabled", false);
    },
    onslide: function (e, o) {
        $(e.target).parent().parent().find("input").val(o.value);
        this.save($(e.target).attr("data-option"));
    },
    save: function (p_name) {
        var val = this.$el.find("input[data-option=" + p_name + "]").val();
        if (val == "") val = this.model.default[p_name];
        this.model.set(p_name, parseFloat(val));
    },
    remove: function (e) {
        e.stopPropagation();
        e.preventDefault();
        APP.Samples.remove(this.model);
        if (this.$tabHeader.hasClass("active")) {
            this.$tabHeader.find('a').attr("data-toggle", null);
            $('.sample-tabs a[data-toggle="tab"]:first').tab('show');
        }
        this.$tabHeader.animate({width: "0px"}, ANIM_TIME * 2, function () {
            this.remove();
        });
        this.$el.remove();

    },
    radio_changed: function (ev) {
        var p_name = $(ev.target).attr("class").replace("-of-obj", "").replace("-", "_");
        if (p_name == "grid")
            this.model.set(p_name, parseInt($(ev.target).val()));
        else if (p_name == "placement")
            this.model.set(p_name, $(ev.target).val());
    },
    ratio_changed: function () {
        this.j.origin_ratio.toggleClass("locked");
        this.model.set("lock_ratio", !(this.model.get("lock_ratio")));

    },
    color_changed: function (ev) {
        this.model.set("overlay", $(ev.target).colorPicker("getRGBA"));
    }
});

