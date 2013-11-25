var Sample = Backbone.Model.extend({
    objects: null,
    original_fabric: null,
    events: null,
    defaults: {
        count: 5,
        placement: "one", //one, random, circle
        angle: 0,
        opacity: 1,
        overlay: "rgba(0, 0, 0, 0.8)",
        filter: null,
        angle_delta: 0,
        offset: 0,
        grid: 1, //1, 4, 9, 16, 25?
        x: 0,
        y: 0,
        radius: 40,
        range: {
            angle: {
                min: -180,
                step: 1,
                max: 180
            },
            offset: {
                min: 0,
                step: 1,
                max: 360
            },
            opacity: {
                min: 0,
                step: 0.01,
                max: 1
            },
            width: {
                min: 0,
                step: 1
            },
            height: {
                min: 0,
                step: 1
            },
            count: {
                min: 1,
                step: 1,
                max: 20
            },
            placement: {
                values: ["one", "random", "circle"]
            },
            angle_delta: {
                min: 0,
                step: 1,
                max: 360
            },
            grid: {
                values: [1, 4, 9, 16, 25]
            },
            x: {
                step: 1
            },
            y: {
                step: 1
            },
            radius: {
                min: 0,
                step: 1
            }
        }
    },
    initialize: function () {
        this.events = _.extend({}, Backbone.Events);
        this.objects = new Backbone.Collection([], {model: Grid});
        this.setRange();
        this.set({id: this.cid});
        this.set({filter: new fabric.Image.filters.Tint({color: this.get("overlay")})});
        this.original_fabric = new fabric.Image(this.get("img"), {filters: [this.get("filter")]});
        var range = this.get("range"), img = this.get("img");
        /*init height and width*/
        var w = Math.min(img.width, range.width.max / 2),
            h = Math.min(img.height, range.height.max / 2),
            r = img.width / img.height;
        this.set({width: Math.min(w, h * r), height: Math.min(h, w / r)});

        for (var i = 0; i < range.count.max; i++)
            this.objects.add({
                x: this.get("x"),
                y: this.get("y"),
                angle: this.get("angle"),
                opacity: this.get("opacity"),
                grid: this.get("grid"),
                height: this.get("height"),
                width: this.get("width"),
                img: this.get("img")
            }, {sample_events: this.events});

        this.change_layout();
        this.layout();
        this.on("change", this.model_changed);
        //this.on("change:count change:angle change:opacity change:angle_delta change:offset change:grid change:x change:y change:radius", this.layout);
        //this.on("change:range", _.compose(this.layout, this.updateRange));
        //this.on("change:overlay", this.updateFilter);
        //this.on("change:placement", this.change_layout);
        this.on("remove", this.remove);
        APP.Canvas.on("change:width change:height", this.canvasSizeChanged, this);
    },
    model_changed: function (data) {
        if('overlay' in data.changed)


    },
    setRange: function () {
        var range = this.get("range");
        range.width.max = APP.Canvas.getWidth() * 2;
        range.height.max = APP.Canvas.getHeight() * 2;
        range.x.max = Math.round(APP.Canvas.getWidth() / 2);
        range.x.min = -Math.round(APP.Canvas.getWidth() / 2);
        range.y.max = Math.round(APP.Canvas.getHeight() / 2);
        range.y.min = -Math.round(APP.Canvas.getHeight() / 2);
        range.radius.max = Math.min(APP.Canvas.getHeight(), APP.Canvas.getWidth());
        this.set("range", range);
    },
    updateRange: function () {
        this.set({
            width: Math.min(this.get("width"), range.width.max),
            height: Math.min(this.get("height"), range.height.max),
            x: Math.max(Math.min(this.get("x"), range.x.max), range.x.min),
            y: Math.max(Math.min(this.get("y"), range.y.max), range.y.min),
            radius: Math.min(this.get("radius"), range.radius.max)
        });
    },
    change_layout: function () {
        var i;
        this.layout = this.layouts[this.get("placement")];
        //specific preparations
        switch (this.get("placement")) {
            case "one":
                this.objects.at(0).visible(true);
                for (i = 1; i < this.objects.length; i++)
                    this.objects.at(i).visible(false);
                break;
            case "random":
                var data = [], r = this.get("range");
                for (i = 0; i < this.objects.length; i++)
                    data[i] = {
                        x: _.random(r.x.min, r.x.max),
                        y: _.random(r.y.min, r.y.max),
                        angle: _.random(r.angle.min, r.angle.max)
                    };
                for (i = 0; i < this.objects.length; i++)
                    this.objects.at(i).set(data[i]);
                break;
        }

        _.each(this.get("range").placement.values, function (func) {
            this.off("change", this.layouts[func]);
        }, this);
        this.on("change", this.layouts[this.get("placement")]);
    },
    layouts: {
        one: function () {
            var x = this.get("x"),
                y = this.get("y"),
                angle = this.get("angle"),
                opacity = this.get("opacity"),
                grid = this.get("grid"),
                height = this.get("height"),
                width = this.get("width");
            var data = {
                x: x,
                y: y,
                angle: angle,
                opacity: opacity,
                grid: grid,
                height: height,
                width: width
            };
            this.objects.at(0).set(data);

            this.trigger("render");
        },
        random: function () {
            var count = this.get("count"),
                opacity = this.get("opacity"),
                grid = this.get("grid"),
                height = this.get("height"),
                width = this.get("width"),
                i, data = [];
            for (i = 0; i < count; i++)
                data[i] = {
                    opacity: opacity,
                    grid: grid,
                    height: height,
                    width: width
                };
            for (i = 0; i < this.objects.length; i++)
                this.objects.at(i).set(data[i]).visible(true);
            for (i = count; i < this.objects.length; i++)
                this.objects.at(i).visible(false);

            this.trigger("render");
        },
        circle: function () {
            var count = this.get("count"),
                delta = 360 / count,
                offset = this.get("offset"),
                radius = this.get("radius"),
                x = this.get("x"),
                y = this.get("y"),
                angle = this.get("angle"),
                angle_delta = this.get("angle_delta"),
                opacity = this.get("opacity"),
                grid = this.get("grid"),
                height = this.get("height"),
                width = this.get("width"),
                i, data = [];
            for (i = 0; i < count; i++)
                data[i] = {
                    x: x + radius * Math.sin(Math.PI * (offset + delta * i) / 180),
                    y: y + radius * Math.cos(Math.PI * (offset + delta * i) / 180),
                    angle: angle + angle_delta * i,
                    opacity: opacity,
                    grid: grid,
                    height: height,
                    width: width
                };
            for (i = 0; i < this.objects.length; i++)
                this.objects.at(i).set(data[i]).visible(true);
            for (i = count; i < this.objects.length; i++)
                this.objects.at(i).visible(false);

            this.trigger("render");
        }
    },
    remove: function () {
        this.events.trigger("remove:fabric");
    },
    randomize: function () {
        var r = this.get("range");
        this.set({
            count: this.rnd("count"),
            placement: r.placement.values[_.random(0, r.placement.values.length - 1)],
            angle: this.rnd("angle"),
            opacity: this.rnd("opacity"),
            angle_delta: this.rnd("angle_delta"),
            offset: this.rnd("offset"),
            grid: r.grid.values[_.random(0, r.grid.values.length - 1)],
            width: this.rnd("width"),
            height: this.rnd("height"),
            x: this.rnd("x"),
            y: this.rnd("y"),
            radius: this.rnd("radius")
        });
    },
    rnd: function (p) {
        var r = this.get("range");
        return _.random(r[p].min / r[p].step, r[p].max / r[p].step) * r[p].step;
    },
    updateFilter: function () {
        var rgba = this.get("overlay");
        this.get("filter").color = "rgba(" + rgba.r + ", " + rgba.g + ", " + rgba.b + ", " + rgba.a + ")";
        this.get("filter").opacity = rgba.a;
        this.original_fabric.applyFilters(_.bind(function () {
            this.events.trigger("change:fabric_element", this.original_fabric._element);
            this.layout();
        }, this));
    },
    canvasSizeChanged: function () {
        this.setRange();
        this.updateRange();
        this.events.trigger("change:canvas");
        this.layout();
        //this.trigger("change:range");
        this.trigger("render");
    }
});

var Grid = Backbone.Model.extend({
    objects: null,
    model: null,
    sample_events: null,
    events: null,
    el_dots: null,
    tl: null,
    br: null,
    visible_parts: null,
    fabric_element: null,
    initialize: function (attr, opt) {
        this.events = _.extend({}, Backbone.Events);
        this.objects = new Backbone.Collection([], {model: Fabric});
        this.sample_events = opt.sample_events;
        this.updateBoundingPoints();
        this.calculateGrid();
        this.on("change:grid change:width change:height change:angle change:x change:y", this.calculateGrid);
        this.on("change:opacity", this.update_non_dimension_settings);
        this.sample_events.on("change:fabric_element", this.updateElement, this);
        this.sample_events.on("change:canvas", this.updateBoundingPoints, this);
    },
    calculateGrid: function () {
        var g = this.get("grid"),
            x = this.get("x"),
            y = this.get("y"),
            width = this.get("width"),
            height = this.get("height"),
            angle = this.get("angle"),
            opacity = this.get("opacity"),
            step_x = APP.Canvas.getWidth() / Math.sqrt(g),
            step_y = APP.Canvas.getHeight() / Math.sqrt(g),
            i = 0, R = 1, currentVis = true, totalVis = true, opt = new DoubleLinkedList();

        //process CENTER elements
        var rad = -angle / 180 * Math.PI;
        var c = Math.cos(rad);
        var s = Math.sin(rad);
        var pnts = [
            {x: width / 2, y: height / 2},
            {x: width / 2, y: -height / 2}
        ];
        this.el_dots = {POINTS: [
            new fabric.Point(pnts[0].x * c - pnts[0].y * s, pnts[0].x * s + pnts[0].y * c),
            new fabric.Point(pnts[1].x * c - pnts[1].y * s, pnts[1].x * s + pnts[1].y * c)
        ]};
        this.el_dots.POINTS[2] = this.el_dots.POINTS[0].multiply(-1);
        this.el_dots.POINTS[3] = this.el_dots.POINTS[1].multiply(-1);
        var off = {x: x, y: y};
        this.el_dots.POINTS[0].addEquals(off);
        this.el_dots.POINTS[1].addEquals(off);
        this.el_dots.POINTS[2].addEquals(off);
        this.el_dots.POINTS[3].addEquals(off);

        opt.add({x: x, y: y}, 0, 0);
        //process OTHER elements
        var prevVis = true;
        while (totalVis) {
            currentVis = false;
            for (i = -R; i <= R; i++) { //check top and bottom row
                if (this.isVisible(i * step_x, R * step_y)) {
                    currentVis = true;
                    opt.add({x: x + i * step_x, y: y + R * step_y}, i, R);
                }
                if (this.isVisible(i * step_x, -R * step_y)) {
                    currentVis = true;
                    opt.add({x: x + i * step_x, y: y - R * step_y}, i, -R);
                }
            }
            for (i = -R + 1; i <= R - 1; i++) { //check left and right row
                if (this.isVisible(R * step_x, i * step_y)) {
                    currentVis = true;
                    opt.add({x: x + R * step_x, y: y + i * step_y}, R, i);
                }
                if (this.isVisible(-R * step_x, i * step_y)) {
                    currentVis = true;
                    opt.add({x: x - R * step_x, y: y + i * step_y}, -R, i);
                }
            }
            totalVis = currentVis || prevVis;
            prevVis = currentVis;
            R++;
        }
        i = 0;
        var vis = opt.toArray();
        this.visible_parts = vis.length;
        //console.log(vis.length);
        while (this.objects.length < this.visible_parts)
            this.objects.add(this.attributes, {sample_events: this.sample_events, grid_events: this.events, el: this.fabric_element});
        while (i < this.visible_parts)
            this.objects.at(i).set({show: true, x: vis[i].x, y: vis[i++].y, width: width, height: height, angle: angle, opacity: opacity});
        while (i < this.objects.length)
            this.objects.at(i++).set({show: false});
    },
    update_non_dimension_settings: function () {
        var i = 0;
        while (i < this.visible_parts)
            this.objects.at(i++).set({opacity: this.get("opacity")});
    },
    isVisible: function (sx, sy) {
        var subV = new fabric.Point(sx, sy);
        var tr = this.tr.subtract(subV);
        var bl = this.bl.subtract(subV);
        //contain any point
        var i = 0;
        while (i < this.el_dots.POINTS.length)
            if (this.el_dots.POINTS[i].lte(tr) && this.el_dots.POINTS[i].gte(bl))
                return true;
            else
                i++;
        var tl = this.tl.subtract(subV);
        var br = this.br.subtract(subV);
        var status = fabric.Intersection.intersectPolygonPolygon(this.el_dots.POINTS, [tl, tr, br, bl]).status;
        return status === 'Intersection' || status === 'Coincident';

    },
    updateBoundingPoints: function () {
        var w = APP.Canvas.getWidth() / 2, h = APP.Canvas.getHeight() / 2;
        this.tl = new fabric.Point(-w, h);
        this.tr = new fabric.Point(w, h);
        this.br = new fabric.Point(w, -h);
        this.bl = new fabric.Point(-w, -h);
    },
    updateElement: function (el) {
        this.fabric_element = el;
    },
    visible: function (isVisible) {
        var i;
        for (i = 0; i < this.objects.length; i++)
            this.objects.at(i).set({show: isVisible});
    }
});

var Fabric = Backbone.Model.extend({
    _fabric: null,
    sample_events: null,
    defaults: {
        show: false
    },
    initialize: function (attr, opt) {
        this._fabric = new fabric.Image(this.get("img"), {visible: this.get("show"), originX: "center", originY: "center"});
        if (opt.el)
            this.updateElement(opt.el);
        this.sample_events = opt.sample_events;
        this.grid_events = opt.grid_events;
        this.add();
        this.on("change", this.updateFabricProperties);
        this.on("change:show", this.show);
        this.sample_events.on("change:fabric_element", this.updateFabricElement, this);
        this.sample_events.on("change:canvas", this.render, this);
        this.sample_events.on("remove:fabric", function () {
            APP.Events.off("reinitialize", this.add, this)
        }, this);
        APP.Events.on("reinitialize", this.add, this);
    },
    add: function () {
        APP.Canvas.add(this._fabric);
    },
    show: function () {
        this._fabric.set("visible", this.get("show"));
    },
    updateFabricElement: function (el) {
        this._fabric._element = el;
    },
    updateFabricProperties: function () {
        this._fabric.set({
            left: APP.Canvas.getCenter().left + this.get("x"),
            top: APP.Canvas.getCenter().top - this.get("y"),
            width: this.get("width"),
            height: this.get("height"),
            angle: this.get("angle"),
            opacity: this.get("opacity")
        });
    }
});