var bankName = "Secure Bank Ltd.";
let branch = "Ahmedabad";
const IFSC = "SBL0001234";

console.log(bankName);
console.log(branch);
console.log(IFSC);

// Scope Demonstration

function variableScope(){

    var x = 10;
    let y = 20;
    const z = 30;

    console.log(x);
    console.log(y);
    console.log(z);
}

variableScope();


//----------------------------
// Loan Eligibility
// if-else and Logical Operators
//----------------------------

function checkLoanEligibility(){
    let age = Number(document.getElementById("age").value);
    let salary = Number(document.getElementById("salary").value);
    
    if(age >= 21 && age <= 60 && salary >= 30000){
        document.getElementById("loanResult").innerHTML =
        "Eligible for Loan";
    }
    else{
        document.getElementById("loanResult").innerHTML =
        "Not Eligible";
    }

}


//----------------------------
// EMI Calculation
// Arithmetic Operators
//----------------------------

function calculateEMI(){

    let P = Number(document.getElementById("loan").value);

    let annualRate = Number(document.getElementById("rate").value);

    let years = Number(document.getElementById("years").value);

    let R = annualRate/(12*100);

    let N = years*12;

    let EMI = (P*R*Math.pow((1+R),N))/(Math.pow((1+R),N)-1);

    document.getElementById("emiResult").innerHTML ="Monthly EMI = ₹"+EMI.toFixed(2);

}


//----------------------------
// Function with Return Value
//----------------------------

function simpleInterest(P,R,T){
    return (P*R*T)/100;
}
function calculateSI(){

    let P = Number(document.getElementById("principal").value);
    let R = Number(document.getElementById("interest").value);
    let T = Number(document.getElementById("time").value);
    let SI = simpleInterest(P,R,T);
    document.getElementById("siResult").innerHTML =
    "Simple Interest = ₹"+SI;
}


//----------------------------
// Switch Statement
//----------------------------

function accountDetails(){
    let account =
    document.getElementById("accountType").value;
    let message="";
    switch(account){
        case "Savings":
        message="Savings Account Interest : 3%";
        break;
        case "Current":
        message="Current Account : No Interest";
        break;
        case "Fixed Deposit":
        message="FD Interest : 7%";
        break;
        default:
        message="Invalid Account";
    }
    document.getElementById("accountResult").innerHTML =
    message;
}


//----------------------------
// For Loop
//----------------------------

function generateInterestTable(){
    let output="Year\tInterest\n";
    for(let i=1;i<=10;i++){
        output += i+"\t"+(10000*0.05*i)+"\n";
    }
    document.getElementById("tableResult").textContent =
    output;
}


//----------------------------
// While Loop
//----------------------------

let count=1;

while(count<=3){
    console.log("Transaction "+count);
    count++;
}


//----------------------------
// Do While Loop
//----------------------------

let number=1;

do{

    console.log("Welcome Customer "+number);
    number++;
}while(number<=3);


//----------------------------
// Nested If
//----------------------------

function premiumCustomer(balance, years){
    if(balance>=500000){
        if(years>=5){
            return "Premium Customer";
        }
        else{
            return "Regular Customer";
        }
    }
    else{
        return "Standard Customer";
    }
}

console.log(premiumCustomer(600000,6));


//----------------------------
// Operators Demonstration
//----------------------------

let deposit = 50000;

deposit += 5000;

console.log(deposit);

console.log(deposit > 40000);

console.log(deposit == 55000);

console.log(deposit != 60000);

console.log(deposit >= 50000);

let status = (deposit > 50000) ? "High Balance" : "Low Balance";

console.log(status);
