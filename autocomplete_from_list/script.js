// Паттерн Фабрика
/*
function createPerson(name, age, job) {
    var o = new Object();
    o.name = name;
    o.age = age;
    o.job = job;
    o.sayName = function() {
        console.log(this.name);
    };
    return o;
}

var person1 = createPerson('Nicholas', 29, 'Software Engineer');
var person2 = createPerson('Greg', 27, 'Doctor');

console.log(person1);
console.log(person2);
*/



// Паттерн Конструктор
function Person(name, age, job) {
    this.name = name;
    this.age = age;
    this.job = job;
    this.sayName = function() {
        console.log(this.name);
    }
}

var person1 = new Person('Nicholas', 29, 'Software Engineer');
var person2 = new Person('Greg', 27, 'Doctor');

console.log(person1);
console.log(person2);

console.log(person1.constructor == Person); // true
console.log(person2.constructor == Person); // true