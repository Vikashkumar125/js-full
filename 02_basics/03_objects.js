// Singleton 

// Object.create 

// object literals
const mySym = Symbol("key1");

const JsUser = {
    name : "Hitesh",
    [mySym]: "hey babes",
    age : 18,
    location : "agra",
    email: "hitesh@gmail.com",
    isLoggedIn: false,
    lastLoggedIn:["Monday", "tuesday"]

}
//  console.log(JsUser.email);
//  console.log(JsUser["email"]); another way to find email
//  console.log(JsUser[mySym]); // adding symbol in objects.
 
//  JsUser.email="vikashkumar095.hititi2020@gmail.com";
//  Object.freeze(JsUser);// it freeze the object and resist any changes in javascript 
//  JsUser.email="vikashkumar095.lund2020@gmail.com";
//  console.log(JsUser);

JsUser.greeting =function(){
    console.log("Hello js USer");

}
JsUser.greetingtwo =function(){
    console.log(`hello js User, ${this.name}`);

}
console.log(JsUser.greeting());
console.log(JsUser.greetingtwo());