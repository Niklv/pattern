this["templates"] = this["templates"] || {};

this["templates"]["library_item"] = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (number, sprite_name, bg_url, offset_x, offset_y, bg_size) {
buf.push("<a href=\"#\"" + (jade.attr("data-number", number, true, false)) + (jade.attr("data-sprite", sprite_name, true, false)) + " class=\"innerContent\"><img src=\"img/t.gif\"" + (jade.attr("style", "background-image:url('" + bg_url + "'); background-position: " + offset_x + " " + offset_y + "; background-size: " + bg_size + ";", true, false)) + "/></a>");}.call(this,"number" in locals_for_with?locals_for_with.number:typeof number!=="undefined"?number:undefined,"sprite_name" in locals_for_with?locals_for_with.sprite_name:typeof sprite_name!=="undefined"?sprite_name:undefined,"bg_url" in locals_for_with?locals_for_with.bg_url:typeof bg_url!=="undefined"?bg_url:undefined,"offset_x" in locals_for_with?locals_for_with.offset_x:typeof offset_x!=="undefined"?offset_x:undefined,"offset_y" in locals_for_with?locals_for_with.offset_y:typeof offset_y!=="undefined"?offset_y:undefined,"bg_size" in locals_for_with?locals_for_with.bg_size:typeof bg_size!=="undefined"?bg_size:undefined));;return buf.join("");
};

this["templates"]["part_settings_tab_header"] = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (id, img) {
buf.push("<li><a" + (jade.attr("href", '#settings-panel-' + id, true, false)) + " data-toggle=\"tab\"><div><img" + (jade.attr("src", img ? img.src : '', true, false)) + "/><button type=\"button\" aria-hidden=\"true\" class=\"close\">×</button></div></a></li>");}.call(this,"id" in locals_for_with?locals_for_with.id:typeof id!=="undefined"?id:undefined,"img" in locals_for_with?locals_for_with.img:typeof img!=="undefined"?img:undefined));;return buf.join("");
};

this["templates"]["part_settings"] = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function ($i, id) {
jade_mixins["control"] = function(class_name, name, tabindex){
var block = (this && this.block), attributes = (this && this.attributes) || {};
buf.push("<div" + (jade.cls(['control',class_name], [null,true])) + "><label for=\"part-opacity\">" + (jade.escape(null == (jade_interp = name) ? "" : jade_interp)) + "</label><div><div" + (jade.attr("data-option", class_name, true, false)) + " class=\"slider\"></div></div><input" + (jade.attr("id", 'part-' + class_name, true, false)) + (jade.attr("tabindex", tabindex, true, false)) + (jade.attr("data-option", class_name, true, false)) + " class=\"input-sm\"/></div>");
};
jade_mixins["layout-radio"] = function(id, layout){
var block = (this && this.block), attributes = (this && this.attributes) || {};
buf.push("<input" + (jade.attr("id", layout + '-' + id, true, false)) + " type=\"radio\"" + (jade.attr("name", 'placement-of-obj-' + id, true, false)) + (jade.attr("value", layout, true, false)) + " class=\"placement-of-obj\"/><label" + (jade.attr("for", layout + '-' + id, true, false)) + "><span></span><span" + (jade.cls(['type-' + layout], [true])) + "></span></label>");
};
jade_mixins["grid-radio"] = function(id, number){
var block = (this && this.block), attributes = (this && this.attributes) || {};
buf.push("<input" + (jade.attr("id", 'grid-' + number + '-' + id, true, false)) + " type=\"radio\"" + (jade.attr("name", 'grid-of-obj-' + id, true, false)) + (jade.attr("value", number, true, false)) + " class=\"grid-of-obj\"/><label" + (jade.attr("for", 'grid-' + number + '-' + id, true, false)) + "><span></span><!--TODO:AUTOFORMAT-->" + (jade.escape(null == (jade_interp = number) ? "" : jade_interp)) + "</label>");
};
buf.push("<h3 class=\"col-sm-12\">" + (jade.escape(null == (jade_interp = $i.index.sample.title) ? "" : jade_interp)) + "<button type=\"button\" class=\"random green-button\"><i class=\"glyphicon glyphicon-refresh\"></i>" + (jade.escape(null == (jade_interp = $i.index.sample.all_random) ? "" : jade_interp)) + "</button></h3><div class=\"col-sm-12\"><div class=\"control placement\"><label>" + (jade.escape(null == (jade_interp = $i.index.sample.type) ? "" : jade_interp)) + "</label><div class=\"radio-case\">");
jade_mixins["layout-radio"](id, $i.index.sample.types.one);
jade_mixins["layout-radio"](id, $i.index.sample.types.random);
jade_mixins["layout-radio"](id, $i.index.sample.types.circle);
buf.push("</div></div></div><div class=\"col-sm-12 col-lg-6\">");
jade_mixins["control"]("opacity", "Opacity", 1);
jade_mixins["control"]("width", "Width", 2);
buf.push("<span class=\"lock-origin-ratio glyphicon glyphicon-lock\"></span>");
jade_mixins["control"]("height", "Height", 3);
buf.push("<div class=\"control grid\"><label>Grid</label><div class=\"radio-case\">");
jade_mixins["grid-radio"](id, 1);
jade_mixins["grid-radio"](id, 4);
jade_mixins["grid-radio"](id, 9);
jade_mixins["grid-radio"](id, 16);
jade_mixins["grid-radio"](id, 25);
buf.push("</div></div>");
jade_mixins["control"]("angle", "Angle", 4);
buf.push("<div class=\"control overlay\"><label for=\"picker\">Overlay</label><div class=\"color-picker\"></div></div></div><div class=\"col-sm-12 col-lg-6\">");
jade_mixins["control"]("count", "Count", 5);
jade_mixins["control"]("x", "X", 6);
jade_mixins["control"]("y", "Y", 7);
jade_mixins["control"]("radius", "Radius", 8);
jade_mixins["control"]("offset", "Offset", 9);
jade_mixins["control"]("angle-delta", "Angle+", 10);
buf.push("</div>");}.call(this,"$i" in locals_for_with?locals_for_with.$i:typeof $i!=="undefined"?$i:undefined,"id" in locals_for_with?locals_for_with.id:typeof id!=="undefined"?id:undefined));;return buf.join("");
};