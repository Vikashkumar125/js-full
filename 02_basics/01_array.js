// //  const myArray=[0,1,2,3,4];
// //  const myHeroes= [shaktiman , krishh];

//  const arr= new Array(0,1,2,3,4,5,6,7);
// //  console.log(arr[3]);

// //  // Arrays Method 

// // //  arr.push(9);

// // //  arr.shift();
// //   console.log(arr);

// // const newArr =arr.join()
// // console.log(newArr);
// // console.log(typeof newArr);

// // slice and splice

// console.log("A", arr);
// const myn1=arr.slice(1,3);
// console.log(myn1);
// console.log("d", arr);

// // Slice did not manupulate the origginal array and it include first value and exlcude last one 

// console.log("B", arr);
// const myn2=arr.splice(1,3);
// console.log(myn2);
// console.log("c", arr);
// it manupulate original array and it include bot value 


const heroes =["batman" , "superman" , "spiderman" , "ironman"];
const heroes2=["gamora", "groot" , "dracks", "azmath"];

// heroes2.push(heroes);
// console.log(heroes2);
// console.log(heroes);
// console.log(heroes2[4][3]);
// console.log(heroes2[3]);

// const lund = heroes.concat(heroes2);
// console.log(lund);

// const spread = [...heroes, ...heroes2]
// console.log(spread);


// console.log(Array.isArray("Hitesh"));
// console.log(Array.from("Hitesh")); //convevrt into array
// console.log(Array.from({name: "Hitesh"}));// intresting 

let Score1=600;
let Score2=607;
let Score3=660;

console.log(Array.of(Score1 , Score2, Score3));
