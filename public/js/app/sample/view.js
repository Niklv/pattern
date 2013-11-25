//VIEW
var SampleView = Backbone.View.extend({
    $tabHeader: null,
    tagName: "div",
    className: "tab-pane fade",
    template: _.template($("#part-settings-tmpl").remove().text()),
    tabHeaderTemplate: _.template($("#part-settings-tab-header-tmpl").remove().text()),
    controlTemplate: _.template($("#part-settings-control").remove().text()),
    allowed_keys: [],
    init_controls: function () {
        //console.log(this.model.attributes);
        this.$tabHeader.find('button.close').click(_.bind(this.remove, this));
        this.$el.find('.colorpicker').colorPicker("init", {opacity: 1, position: "top"});
        this.$el.find('input.grid-of-obj[value=' + this.model.get('grid') + ']').attr('checked', true);
        this.$el.find('input.placement-of-obj[value=' + this.model.get('placement') + ']').attr('checked', true);
        switch (this.$el.find('.placement input:checked').val()) {
            case "one":
                this.$el.find('.x').show();
                this.$el.find('.y').show();
                this.$el.find('.angle').show();
                this.$el.find('.count').hide();
                this.$el.find('.offset').hide();
                this.$el.find('.angle-delta').hide();
                this.$el.find('.radius').hide();
                this.$el.find('.placement button.rndmz').hide();
                break;
            case "random":
                this.$el.find('.x').hide();
                this.$el.find('.y').hide();
                this.$el.find('.angle').hide();
                this.$el.find('.count').show();
                this.$el.find('.offset').hide();
                this.$el.find('.angle-delta').hide();
                this.$el.find('.radius').hide();
                this.$el.find('.placement button.rndmz').show();
                break;
            case "circle":
                this.$el.find('.x').show();
                this.$el.find('.y').show();
                this.$el.find('.angle').show();
                this.$el.find('.count').show();
                this.$el.find('.offset').show();
                this.$el.find('.angle-delta').show();
                this.$el.find('.radius').show();
                this.$el.find('.placement button.rndmz').hide();
                break;
        }

        new Slider({model: this.model, name: "angle", jquery_object: this.$el.find(".angle")});
        new Slider({model: this.model, name: "opacity", jquery_object: this.$el.find(".opacity")});
        new Slider({model: this.model, name: "width", jquery_object: this.$el.find(".width")});
        new Slider({model: this.model, name: "height", jquery_object: this.$el.find(".height")});
        new Slider({model: this.model, name: "count", jquery_object: this.$el.find(".count")});
        new Slider({model: this.model, name: "x", jquery_object: this.$el.find(".x")});
        new Slider({model: this.model, name: "y", jquery_object: this.$el.find(".y")});
        new Slider({model: this.model, name: "radius", jquery_object: this.$el.find(".radius")});
        new Slider({model: this.model, name: "angle_delta", jquery_object: this.$el.find(".angle-delta")});
        new Slider({model: this.model, name: "offset", jquery_object: this.$el.find(".offset")});

        return this;
    },
    change_settings_order: function () {
        switch (this.$el.find('.placement input:checked').val()) {
            case "one":
                this.$el.find('.x').slideDown(ANIM_TIME);
                this.$el.find('.y').slideDown(ANIM_TIME);
                this.$el.find('.angle').slideDown(ANIM_TIME);
                this.$el.find('.count').slideUp(ANIM_TIME);
                this.$el.find('.offset').slideUp(ANIM_TIME);
                this.$el.find('.angle-delta').slideUp(ANIM_TIME);
                this.$el.find('.radius').slideUp(ANIM_TIME);
                this.$el.find('.placement button.rndmz').hide();
                break;
            case "random":
                this.$el.find('.x').slideUp(ANIM_TIME);
                this.$el.find('.y').slideUp(ANIM_TIME);
                this.$el.find('.angle').slideUp(ANIM_TIME);
                this.$el.find('.count').slideDown(ANIM_TIME);
                this.$el.find('.offset').slideUp(ANIM_TIME);
                this.$el.find('.angle-delta').slideUp(ANIM_TIME);
                this.$el.find('.radius').slideUp(ANIM_TIME);
                this.$el.find('.placement button.rndmz').show();
                break;
            case "circle":
                this.$el.find('.x').slideDown(ANIM_TIME);
                this.$el.find('.y').slideDown(ANIM_TIME);
                this.$el.find('.angle').slideDown(ANIM_TIME);
                this.$el.find('.count').slideDown(ANIM_TIME);
                this.$el.find('.offset').slideDown(ANIM_TIME);
                this.$el.find('.angle-delta').slideDown(ANIM_TIME);
                this.$el.find('.radius').slideDown(ANIM_TIME);
                this.$el.find('.placement button.rndmz').hide();
                break;
        }
    },
    place: function () {
        //this.$el.hide();
        //$('.control-panel > .row:first-child').after(this.$el);
        //1 create tab+
        $('.controls-section .sample-tabs .active').removeClass('active').removeClass('in');
        $('.controls-section .tab-content .active').removeClass('active');
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
    remove: function () {
        APP.Samples.remove(this.model);
        //this.$el.animate({width: "0px"}, ANIM_TIME*10, function(){
        //this.remove()
        //});
        this.$el.remove();
        this.$tabHeader.animate({width: "0px"}, ANIM_TIME * 2, function () {
            this.remove()
        });
    },
    radio_changed: function (ev) {
        var p_name = $(ev.target).attr("class").replace("-of-obj", "").replace("-", "_");
        if (p_name == "grid")
            this.model.set(p_name, parseInt($(ev.target).val()));
        else if (p_name == "placement")
            this.model.set(p_name, $(ev.target).val());
    },
    color_changed: function (ev) {
        this.model.set("overlay", $(ev.target).colorPicker("getRGBA"));
    }
});

