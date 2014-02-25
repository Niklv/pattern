var colorpicker1 = new Colorpicker(null, {el: $('.color-picker').eq(0), alpha: true});
var colorpicker2 = new Colorpicker(null, {el: $('.color-picker').eq(1), alpha: true});
var colorpicker3 = new Colorpicker(null, {el: $('.color-picker').eq(2), alpha: true});
colorpicker3.on("change:color", function(){
    console.log(colorpicker3.getRGBA_string());
});