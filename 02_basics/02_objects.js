// Singleton 

// Object.create 

// object literals
// const mySym = Symbol("key1");

// const JsUser = {
//     name : "Hitesh",
//     [mySym]: "hey babes",
//     age : 18,
//     location : "agra",
//     email: "hitesh@gmail.com",
//     isLoggedIn: false,
//     lastLoggedIn:["Monday", "tuesday"]

// }
// //  console.log(JsUser.email);
// //  console.log(JsUser["email"]); another way to find email
// //  console.log(JsUser[mySym]); // adding symbol in objects.
 
// //  JsUser.email="vikashkumar095.hititi2020@gmail.com";
// //  Object.freeze(JsUser);// it freeze the object and resist any changes in javascript 
// //  JsUser.email="vikashkumar095.lund2020@gmail.com";
// //  console.log(JsUser);

// JsUser.greeting =function(){
//     console.log("Hello js USer");

// }
// JsUser.greetingtwo =function(){
//     console.log(`hello js User, ${this.name}`);

// }
// console.log(JsUser.greeting());
// console.log(JsUser.greetingtwo());

// const tinderUser =new Object ();
//Or
// const tinderUser = {};
// tinderUser.id="123avs"
// tinderUser.name="Vikash"
// tinderUser.isLoggedIn=false

// //console.log(tinderUser);

// // const regularUser={
// //     email: "virusahi@gmail.com",
// //     fullName: {
// //         userFullName: {
// //             firstname: "Vikash",
// //             lastName :"Kumar"
// //         }
// //     }
// // }
// // console.log(regularUser.fullName.userFullName.firstname);


// const user =[
//     {
//         id:1,
//         email:"hangman@gmail.com"
//     },
//     {
//         id:2,
//         email:"hangpan@gmail.com"
//     },
//     {
//         id:3,
//         email:"hang@gmail.com"
//     },
//     {
//         id:4,
//         email:"hagbangn@gmail.com"
//     },
// ]


// console.log(tinderUser);
// console.log(Object.keys(tinderUser));
// console.log(Object.values(tinderUser));

// console.log(tinderUser.hasOwnProperty('isLoggedIn'));
const regularUser={
    email: "virusahi@gmail.com",
    firstname: "Vikash",
    lastName :"Kumar"
        
}
const{firstname: Name} =regularUser;
console.log(Name);
//json format 
// {
//     "name": "Vikash",
//     "courseName":"js",
//     "price":"free"
// }
// json format 

[
    {},
    {

    },
    {

    }
]