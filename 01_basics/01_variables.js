const accountId = 14452
let accountEmail = "vikash@gmail.com"
var accountPassword = "12345"
accountCity="jaipur"

//accountId = 2   // not allowed
accountEmail="hc@hc.com"
accountPassword ="212121"
accountCity = "Goa"

console.log(accountId)
let accountState

/*
prefer not to use var 
because of issue in block scope and functional scope
*/
console.table([accountId,accountEmail,accountPassword,accountCity, accountState])
