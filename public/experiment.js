var B = function(){
    console.log("constructor B");
};

var A = function(){
    console.log("constructor A");
};

A.prototype.b = new B();

var a = new A();
