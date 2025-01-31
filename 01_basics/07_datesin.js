// console.log(Date);
// let myCreateDate =new Date(2023, 0, 23)

// let myCreateDate =new Date(2023, 0, 23, 5, 3)

//let myCreateDate =new Date("2023, 3, 23");
let myCreateDate =new Date("01-14-2024");
console.log(myCreateDate.toLocaleDateString());
let myTimeStamp= Date.now();
// console.log(myTimeStamp );
// console.log(myCreateDate.getTime());
// console.log(Math.floor(Date.now()/1000));

let newDate =new Date();
console.log(newDate.getMonth());
// console.log(newDate.toLocaleDateString());
 const hello=newDate.toLocaleString('default',{
    weekday: "long",
   
})
console.log(hello);