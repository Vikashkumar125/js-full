// function sayMyName(){
//     console.log("H");
//     console.log("i");
//     console.log("t");
//     console.log("e");
//     console.log("s");

//}
//sayMyName();
// function addTwoNumbers(number1 , number2){
//     console.log(number1+number2);

// } 
// console.log(typeof addTwoNumbers(4,7));
function addTwoNumbers(number1 , number2){
    let result=number1+number2;
    return result;
    //console.log(number1+number2);

} 
const result=addTwoNumbers(4,6);
// console.log(result);
// console.log(typeof result);

// function loginUserMessage(userName){
//     return `${userName} just logged in`
// }
// console.log(loginUserMessage("Hitesh"));

// function loginUserMessage(userName){
//     if(userName===undefined){
//         console.log("please enter a username");
//         return

//     }
//     return `${userName} just logged in`
// }

// function loginUserMessage(userName = "Sam"){
//     if(!userName){
//         console.log("please enter a username");
//         return

//     }
//     return `${userName} just logged in`
// }
// console.log(loginUserMessage());

// function calculateCartPrice(val1, val2, ...num1){
//     return num1;

// }
// console.log(calculateCartPrice(200,400,600,9098));

// const user ={
//     username: "hitesh",
//     price: 199
// }

// function handleObject(anyObject){
//     console.log(`UserName is ${anyObject.username} and price is ${anyObject.price}`);

// } 
// handleObject(user);

const mynewArray = [200,333,500,5076,485];

function returnnewArray(getArray){
    return(getArray[4])
}
console.log(returnnewArray(mynewArray));