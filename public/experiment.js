var M = Backbone.Model.extend({
    initialize: function () {
        this.bind("remove", function () {
            ///console.log("remove")
        })
    }
});
var C = Backbone.Collection.extend({
    model: M,
    add: function(){
        console.log("add");
    }
});

var c = new C;
for (var i = 0; i < 10; i++)
    c.add({});
console.log(c.length);
c.remove(c.models);
console.log(c.length);