var Colorpicker = Backbone.Model.extend({
    view: null,
    defaults: {
        rgb: {
            r: 0,
            g: 0,
            b: 0
        },
        hsv: {
            h: 0.5,
            s: 0.5,
            v: 0.5
        },
        hex: "#000000",
        alpha: 0.5
    },
    initialize: function (params, opt) {
        this.set("alpha", opt.alpha ? 0 : 1);
        this.view = new ColorpickerView({
            model: this,
            el: opt.el,
            alpha: opt.alpha
        });
        this.on("change:hsv", this.hsv_changed);
        this.on("change:rgb", this.rgb_changed);
        this.on("change:hex", this.hex_changed);
        this.on("change:alpha", this.alpha_changed);
    },
    hsv_changed: function () {
        //console.log("HSV CHANGED");
        var hsv = this.get("hsv");
        var rgb = this.cnv.hsvtorgb(hsv);
        var hex = this.cnv.rgbtohex(rgb);
        this.set("rgb", rgb, {silent: true});
        this.set("hex", hex, {silent: true});
        this.trigger("change:color");
    },
    rgb_changed: function () {
        //console.log("RGB CHANGED");
        var rgb = this.get("rgb");
        var hsv = this.cnv.rgbtohsv(rgb);
        var hex = this.cnv.rgbtohex(rgb);
        this.set("hsv", hsv, {silent: true});
        this.set("hex", hex, {silent: true});
        this.trigger("change:color");
    },
    hex_changed: function () {
        //console.log("HEX CHANGED");
        var hex = this.get("hex");
        var rgb = this.cnv.hextorgb(hex);
        var hsv = this.cnv.rgbtohsv(rgb);
        this.set("hsv", hsv, {silent: true});
        this.set("rgb", rgb, {silent: true});
        this.trigger("change:color");
    },
    alpha_changed: function () {
        this.trigger("change:color");
    },
    setRGBA: function(rgba){
        this.attributes.rgb = {
            r: rgba.r,
            g: rgba.g,
            b: rgba.b
        };
        this.attributes.alpha = rgba.a;
        this.rgb_changed();
        this.view.update_all();
    },
    getRGBA: function () {
        return $.extend(this.get("rgb"), {
            a: this.get("alpha")
        });
    },
    getHSVA: function () {
        return $.extend(this.get("hsv"), {
            a: this.get("alpha")
        });
    },
    getRGBA_string: function () {
        var rgb = this.get("rgb");
        return "rgba(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ", " + (this.get("alpha").toFixed(2)) + ")";
    },
    cnv: {
        hsvtohex: function (hsv) {
            return this.rgbtohex(this.hsvtorgb(hsv));
        },
        hsvtorgb: function (hsv) {
            var b, f, g, h, i, p, q, r, s, t, v, _ref;
            h = hsv.h, s = hsv.s, v = hsv.v;
            i = Math.floor(h * 6);
            f = h * 6 - i;
            p = v * (1 - s);
            q = v * (1 - f * s);
            t = v * (1 - (1 - f) * s);
            i = i % 6;
            _ref = (function () {
                switch (false) {
                    case i !== 0:
                        return [v, t, p];
                    case i !== 1:
                        return [q, v, p];
                    case i !== 2:
                        return [p, v, t];
                    case i !== 3:
                        return [p, q, v];
                    case i !== 4:
                        return [t, p, v];
                    case i !== 5:
                        return [v, p, q];
                    default:
                        return [1, 1, 1];
                }
            })(), r = _ref[0], g = _ref[1], b = _ref[2];
            return {
                r: Math.floor(r * 255),
                g: Math.floor(g * 255),
                b: Math.floor(b * 255)
            };
        },
        rgbtohsv: function (rgb) {
            var b, d, g, h, max, min, r, s, v;
            r = rgb.r, g = rgb.g, b = rgb.b;
            r = r / 255;
            g = g / 255;
            b = b / 255;
            max = Math.max(r, g, b);
            min = Math.min(r, g, b);
            v = max;
            d = max - min;
            s = max === 0 ? 0 : d / max;
            if (max === min) {
                h = 0;
            } else {
                switch (max) {
                    case r:
                        h = (g - b) / d + (g < b ? 6 : 0);
                        break;
                    case g:
                        h = (b - r) / d + 2;
                        break;
                    case b:
                        h = (r - g) / d + 4;
                }
                h /= 6;
            }
            return {
                h: h,
                s: s,
                v: v
            };
        },
        rgbtohex: function (rgb) {
            return "#" + this.ntohex(rgb.r) + this.ntohex(rgb.g) + this.ntohex(rgb.b);
        },
        ntohex: function (n) {
            if (!n) {
                return "00";
            }
            n = Math.max(0, Math.min(n, 255));
            return "0123456789ABCDEF".charAt((n - n % 16) / 16) + "0123456789ABCDEF".charAt(n % 16);
        },
        hextorgb: function (hex) {
            var res;
            res = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            if (!res) {
                return {
                    r: 255,
                    g: 255,
                    b: 255
                };
            } else {
                return {
                    r: parseInt(res[1], 16),
                    g: parseInt(res[2], 16),
                    b: parseInt(res[3], 16)
                };
            }
        }
    }

});
