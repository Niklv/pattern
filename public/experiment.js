var A = Backbone.Model.extend({
    defaults: {
        a: 1,
        b: 1
    },
    initialize: function () {
        this.on("change", function () {
            console.log(arguments[0]);
        });
    }
});

var a = new A();
a.set({c:3});
a.set("c", null, {unset :true});