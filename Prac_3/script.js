//----------------------------
// Loan Eligibility
// if-else and Logical Operators
//----------------------------

function checkLoanEligibility(){
    console.log("Checking Loan Eligibility");
    let a = Number(document.getElementById("age").value);
    let s = Number(document.getElementById("salary").value);  
    if(a >= 21 && a <= 60 && s >= 30000){
        document.getElementById("loanResult").innerHTML =
        "Eligible for Loan";
        console.log("Eligible for Loan");
    }
    else{
        document.getElementById("loanResult").innerHTML =
        "Not Eligible";
        console.log("Not Eligible");
    }

}
function calculateEMI(){

    let P = Number(document.getElementById("loan").value);
    let annualRate = Number(document.getElementById("rate").value);
    let years = Number(document.getElementById("years").value);
    let R = annualRate/(12*100);
    let N = years*12;

    let EMI = (P*R*Math.pow((1+R),N))/(Math.pow((1+R),N)-1);

    document.getElementById("emiResult").innerHTML ="Monthly EMI = ₹"+EMI.toFixed(3);
}

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

function accountDetails(){
    let account = document.getElementById("accountType").value;
    let message="";
    switch(account){
        case "Savings":
        message="Savings Account : 4% Interest";
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
    document.getElementById("accountResult").innerHTML = message;
}

function generateInterestTable(){
    let output="Year\tInterest\n";
    for(let i=1;i<=10;i++){
        output += i+"\t"+(10000*0.05*i)+"\n";
    }
    document.getElementById("tableResult").textContent =
    output;
}

let count=1;

while(count<=3){
    console.log("While loop iteration: "+count);
    count++;
}

let number=1;

do{

    console.log("Do while loop iteration: "+number);
    number++;
}while(number<=3);

