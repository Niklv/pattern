var Sample = Backbone.Model.extend({
    objects: null,
    original_fabric: null,
    events: null,
    defaults: {
        layer: 0,
        count: 5,
        placement: "one", //one, random, circle
        angle: 0,
        opacity: 1,
        overlay: {r: 0, g: 0, b: 0, a: 0},
        angle_delta: 0,
        offset: 0,
        grid: 1, //1, 4, 9, 16, 25?
        x: 0,
        y: 0,
        radius: 40,
        lock_ratio: false,
        ratio: 1,
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
        this.set({id: this.cid});
        this.setRange();
        /*init height and width*/
        var range = this.get("range"), img = this.get("img");
        var w = Math.min(img.width, range.width.max / 2),
            h = Math.min(img.height, range.height.max / 2),
            r = img.width / img.height;
        this.set({width: Math.min(w, h * r), height: Math.min(h, w / r), ratio: r});
        /* Create 20 objects */
        for (var i = 0; i < range.count.max; i++)
            this.objects.add({
                x: this.get("x"),
                y: this.get("y"),
                angle: this.get("angle"),
                grid: this.get("grid"),
                height: this.get("height"),
                width: this.get("width"),
                layer: this.get("layer"),
                img: this.get("img")
            }, {sample_events: this.events});

        this.change_layout();
        this.layout();
        this.events.trigger("change:opacity", this.get("opacity"));
        this.on("all", function (t) {
            console.log("model:" + t)
        });
        this.on("change", this.model_changed);
        this.on("remove", this.remove);
        APP.Canvas.on("change:width change:height", this.canvasSizeChanged, this);
    },
    resize_and_filter: function (cb) {
        //resize
        //...
        //filter
        var rgba = this.get("overlay");
        var color = "rgba(" + rgba.r + ", " + rgba.g + ", " + rgba.b + ", " + rgba.a + ")";
        this.original_fabric = new fabric.Image(this.get("img"), {filters: [new fabric.Image.filters.Tint({color: color})]});
        this.original_fabric.applyFilters(_.bind(function () {
            this.events.trigger("change:fabric_element", this.original_fabric._element);
            cb && cb();
        }, this));
    },
    model_changed: function (ev, opt, opt2) {
        var data = ev.changed;
        if (_.has(data, 'placement'))
            this.change_layout();
        if (_.has(data, 'lock_ratio'))
            this.lock_ratio();
        if (this.get("lock_ratio") && (_.has(data, 'width') || _.has(data, 'height')))
            this.process_ratio(data);

        if (_.has(data, 'placement') || !_.isEmpty(_.omit(data, 'opacity', 'range', 'filter', 'overlay'))) {
            this.layout();
            this.events.trigger("change:grid");
        }

        if (_.has(data, 'layer')) {
            this.events.trigger("change:layer", data.layer);
            if (_.isEmpty(_.omit(data, 'layer')))
                return;
        }

        if (_.has(data, "opacity"))
            this.events.trigger("change:opacity", data.opacity);
        if (_.has(data, "overlay"))
            this.updateFilter(_.bind(function () {
                this.events.trigger("change:fabric_element", this.original_fabric._element);
                this.trigger("render");
            }, this));
        else
            this.trigger("render");
    },
    setRange: function () {
        var range = this.get("range"), isLock = this.get("lock_ratio"), r = this.get("ratio");
        if (isLock) {
            range.width.max = Math.min(APP.Canvas.getHeight() * 2 * r, APP.Canvas.getWidth() * 2);
            range.height.max = Math.min(APP.Canvas.getWidth() * 2 / r, APP.Canvas.getHeight() * 2);
        } else {
            range.width.max = APP.Canvas.getWidth() * 2;
            range.height.max = APP.Canvas.getHeight() * 2;
        }
        range.x.max = Math.round(APP.Canvas.getWidth() / 2);
        range.x.min = -Math.round(APP.Canvas.getWidth() / 2);
        range.y.max = Math.round(APP.Canvas.getHeight() / 2);
        range.y.min = -Math.round(APP.Canvas.getHeight() / 2);
        range.radius.max = Math.min(APP.Canvas.getHeight(), APP.Canvas.getWidth());
        //this.set("range", range, {silent: true});
        this.trigger("change:range", {changed: {range: range}});
    },
    updateElementSize: function () {
        var range = this.get("range"), w = this.get("width"), h = this.get("height");
        if (this.get("lock_ratio")) {
            var r = this.get("ratio"), nw, nh;
            nh = Math.min(Math.min(w, range.width.max) / r, range.height.max);
            nw = nh * r;
            w = ((nw < w + 1) && (nw > w - 1)) ? w : nw;
            h = ((nh < h + 1) && (nh > h - 1)) ? h : nh;
        } else {
            w = Math.min(w, range.width.max);
            h = Math.min(h, range.height.max);
        }
        this.set({
            width: w,
            height: h,
            x: Math.max(Math.min(this.get("x"), range.x.max), range.x.min),
            y: Math.max(Math.min(this.get("y"), range.y.max), range.y.min),
            radius: Math.min(this.get("radius"), range.radius.max)
        });
    },
    change_layout: function () {
        var i;
        this.layout = this.layouts[this.get("placement")];
        //hide all
        this.events.trigger("visible", false);
        //specific preparations
        switch (this.get("placement")) {
            case "one":
                this.objects.at(0).visible(true);
                break;
            case "random":
                var data = [], r = this.get("range");
                for (i = 0; i < this.objects.length; i++)
                    data[i] = {
                        x: _.random(r.x.min, r.x.max),
                        y: _.random(r.y.min, r.y.max),
                        angle: _.random(r.angle.min, r.angle.max)
                    };
                for (i = 0; i < this.objects.length; i++) {
                    this.objects.at(i).set(data[i]);
                }
                break;
            case "circle":
                break;
        }
    },
    layouts: {
        one: function () {
            var x = this.get("x"),
                y = this.get("y"),
                angle = this.get("angle"),
                grid = this.get("grid"),
                height = this.get("height"),
                width = this.get("width");
            var data = {
                x: x,
                y: y,
                angle: angle,
                grid: grid,
                height: height,
                width: width
            };
            this.objects.at(0).set(data);
        },
        random: function () {
            var count = this.get("count"),
                grid = this.get("grid"),
                height = this.get("height"),
                width = this.get("width"),
                i, data = [];
            for (i = 0; i < count; i++)
                data[i] = {
                    grid: grid,
                    height: height,
                    width: width
                };
            for (i = 0; i < this.objects.length; i++)
                this.objects.at(i).set(data[i]).visible(true);
            for (i = count; i < this.objects.length; i++)
                this.objects.at(i).visible(false);
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
                grid = this.get("grid"),
                height = this.get("height"),
                width = this.get("width"),
                i, data = [];
            for (i = 0; i < count; i++)
                data[i] = {
                    x: x + radius * Math.sin(Math.PI * (offset + delta * i) / 180),
                    y: y + radius * Math.cos(Math.PI * (offset + delta * i) / 180),
                    angle: angle + angle_delta * i,
                    grid: grid,
                    height: height,
                    width: width,
                    visible: true

                };
            for (i = 0; i < this.objects.length; i++)
                this.objects.at(i).set(data[i]);
            for (i = count; i < this.objects.length; i++)
                this.objects.at(i).set("visible", false);
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
    updateFilter: function (cb) {
        var rgba = this.get("overlay");
        this.original_fabric.filters[0].color = "rgba(" + rgba.r + ", " + rgba.g + ", " + rgba.b + ", " + rgba.a + ")";
        this.original_fabric.filters[0].opacity = rgba.a;
        this.original_fabric.applyFilters(cb);
    },
    lock_ratio: function (isLock) {
        this.off("change", this.model_changed);
        this.setRange();
        this.updateElementSize();
        this.on("change", this.model_changed);
    },
    process_ratio: function (data) {
        var w = this.get("width"),
            h = this.get("height"),
            r = this.get("ratio");
        if (!_.has(data, 'width') && _.has(data, 'height'))
            w = h * r;
        else
            h = w / r;
        //this.off("change", this.model_changed);
        this.set({width: w, height: h});
        //this.on("change", this.model_changed);
        this.updateElementSize();
    },
    canvasSizeChanged: function () {
        this.off("change", this.model_changed);
        this.setRange();
        this.updateElementSize();
        this.layout();
        this.events.trigger("change:canvas");
        this.events.trigger("change:grid");
        this.on("change", this.model_changed);
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
        this.set("visible", true);
        this.updateBoundingPoints();
        this.calculateGrid();
        this.sample_events.on("visible", this.visible, this);
        this.sample_events.on("change:grid", this.calculateGrid, this);
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
            visible = this.get("visible"),
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
            this.objects.at(i).set({show: visible, x: vis[i].x, y: vis[i++].y, width: width, height: height, angle: angle, opacity: opacity});
        while (i < this.objects.length)
            this.objects.at(i++).set({show: false});
    },
    isVisible: function (sx, sy) {
        var subV = new fabric.Point(sx, sy),
            tr = this.tr.subtract(subV),
            bl = this.bl.subtract(subV),
            el_arr = this.el_dots.POINTS, i = 0;
        //contain any point
        while (i < el_arr.length)
            if (el_arr[i].lte(tr) && el_arr[i].gte(bl))
                return true;
            else
                i++;

        //contain any intersection
        var tl = this.tl.subtract(subV),
            br = this.br.subtract(subV);
        var cnvarr = [tl, tr, br, bl];
        for (i = 0; i < 4; i++) {
            var a1 = el_arr[i],
                a2 = el_arr[(i + 1) % 4];
            for (var j = 0; j < 4; j++) {
                var b1 = cnvarr[j],
                    b2 = cnvarr[(j + 1) % 4],
                    flag = fabric.Intersection.intersectLineLine(a1, a2, b1, b2).points.length > 0;
                if (flag) return true;
            }
        }
        return false;
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
        this.set("visible", isVisible);
        this.events.trigger("visible", isVisible);
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
            this.updateFabricElement(opt.el);
        this.sample_events = opt.sample_events;
        this.grid_events = opt.grid_events;
        this.add();
        this.on("change", this.updateFabricProperties);
        this.on("change:show", this.show);
        this.grid_events.on("visible", this.visible, this);
        this.sample_events.on("change:fabric_element", this.updateFabricElement, this);
        this.sample_events.on("change:fabric_element", this.updateFabricElement, this);
        this.sample_events.on("change:opacity", this.updateOpacity, this);
        this.sample_events.on("change:canvas", this.updateFabricProperties, this);
        this.sample_events.on("change:layer", this.changeLayer, this);
        this.sample_events.on("remove:fabric", function () {
            APP.Events.off(null, null, this);
            this.sample_events.off(null, null, this);
        }, this);
        APP.Events.on("reinitialize", this.add, this);
    },
    add: function () {
        APP.Canvas.add(this._fabric);
    },
    show: function () {
        this._fabric.set("visible", this.get("show"));
    },
    visible: function (isVisible) {
        this.set('show', isVisible);
    },
    changeLayer: function (n) {
        this.set("layer", n);
    },
    updateFabricElement: function (el) {
        this._fabric._element = el;
    },
    updateOpacity: function (op) {
        this._fabric.set({opacity: op});
    },
    updateFabricProperties: function () {
        this._fabric.set({
            layer: this.get("layer"),
            left: APP.Canvas.getCenter().left + this.get("x"),
            top: APP.Canvas.getCenter().top - this.get("y"),
            width: this.get("width"),
            height: this.get("height"),
            angle: this.get("angle"),
            opacity: this.get("opacity")
        });
    }
});