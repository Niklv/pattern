/*var B = function(){
 console.log("constructor B");
 };

 var A = function(){
 console.log("constructor A");
 };

 A.prototype.b = new B();

 new A();
 new A();
 */

var a = {
    b: 5
};

var b = a.b;

console.log(b);
a.b = 4;
console.log(b);
