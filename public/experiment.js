var A = Backbone.Model.extend({
    defaults: {
        a: 1,
        b: 1
    },
    initialize: function () {
        this.on("change", function () {
            console.log(arguments);
        });
    }
});

var a = new A();
a.set({c:3});