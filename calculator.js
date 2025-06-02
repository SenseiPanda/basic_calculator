

//global variables 
const inflation_rate = 0.025;
const loan_term = 120;
const time_off = 2; //time off in years
const wage_growth_MBA = 0.08; //8% wage growth for elite MBA graduates
const wage_growth_noMBA = 0.05; //5% wage growth for non-MBA graduates with bachelor's degrees based on Atlanta Fed Data
// what's the acceleration of earnings for someone 5 years post-bachelors? 

//calculate total interest paid on a loan
function loanInterest() {
    // Get dynamic variables from DOM
    const expenses = parseFloat(document.querySelector('#expenses').value);
    const interestRate = parseFloat(document.querySelector('#interest-rate').value) / 100;
    const amountBorrowed = parseFloat(document.querySelector('#amount-borrowed').value);


    // Calculate real interest rate (adjusted for inflation)
    const realRate = interestRate - inflation_rate;
    const monthlyRate = realRate / 12;
    const loan_term = 120; // 10 years in months

    // Calculate monthly payment using the formula for an amortizing loan
    const onePlusR = 1 + monthlyRate;
    const onePlusRtoN = Math.pow(onePlusR, loan_term);
    
    const monthlyPayment = amountBorrowed * (monthlyRate * onePlusRtoN) / (onePlusRtoN - 1);
    
    // Calculate total payments and interest
    const totalPayments = monthlyPayment * loan_term;
    const totalInterest = totalPayments - amountBorrowed;
    
    return totalInterest;
}

document.addEventListener('DOMContentLoaded', function() {
    // Button to trigger calculations
    const calcBtn = document.querySelector('#calculate-btn');
    if (calcBtn) {
        calcBtn.addEventListener('click', function() {
            // Calculate total interest and display
            const interest = loanInterest();
            document.querySelector('#total-interest').textContent = interest.toFixed(2);

            // Calculate total return and display
            const returnValue = totalReturn();
            //console.log(returnValue);
            document.querySelector('#total-return').textContent = returnValue.toFixed(2);

            const totalInvestment = totalMBAInvestment();
            document.querySelector('#total-MBA-investment').textContent = totalInvestment.toFixed(2);

             // Calculate net forgone income and display
            const netForgone = netForgoneIncome();
            document.querySelector('#net-forgone-income').textContent = netForgone.toFixed(2);
        });
    }
});

function totalMBAInvestment() {
    const currentSalaryElem = document.querySelector('#current-salary');
    const compInSchoolElem = document.querySelector('#comp-in-school');
    const interest = loanInterest();
    const expenses = parseFloat(document.querySelector('#expenses').value);
    const currentSalary = parseFloat(currentSalaryElem.value);
    const compInSchool = parseFloat(compInSchoolElem.value);

    let totalMBAInvestment = (currentSalary * 2) + interest + expenses - compInSchool;
    console.log(totalMBAInvestment);
    return totalMBAInvestment;
}

function netForgoneIncome() {
    const currentSalaryElem = document.querySelector('#current-salary');
    const currentSalary = parseFloat(currentSalaryElem.value);
    const timeOff = 2; // time off in years
    let netForgoneIncome = currentSalary * time_off; // Assuming time_off is in years

    return netForgoneIncome;
}
function totalReturn() {
    // Get dynamic variables from DOM
    const currentSalaryElem = document.querySelector('#current-salary');
    const expectedSalaryElem = document.querySelector('#expected-salary');
    const expectedSigningBonusElem = document.querySelector('#expected-signing-bonus');
    const compInSchoolElem = document.querySelector('#comp-in-school');

    if (
        !currentSalaryElem ||
        !expectedSalaryElem ||
        !expectedSigningBonusElem ||
        !compInSchoolElem
        
    ) {
        console.log("returnValue is 0 because one or more elements are missing");
        return 0;
    }

    const currentSalary = parseFloat(currentSalaryElem.value);
    const expectedSalary = parseFloat(expectedSalaryElem.value);
    const expectedSigningBonus = parseFloat(expectedSigningBonusElem.value);
    const compInSchool = parseFloat(compInSchoolElem.value);

    // Check for invalid or missing input values
    if (
        isNaN(currentSalary) ||
        isNaN(expectedSalary) ||
        isNaN(expectedSigningBonus) ||
        isNaN(compInSchool)
    ) {
        return 0;
    }

    let mbaTotal = 0;
    let nonMbaTotal = 0;
    let mbaSalary = expectedSalary;
    let nonMbaSalary = currentSalary;

    for (let year = 1; year <= 10; year++) {
        if (year === 1) {
            // Add signing bonus and comp while in school in the first year
            mbaTotal += mbaSalary + expectedSigningBonus + compInSchool;
        } else {
            mbaTotal += mbaSalary;
        }
        nonMbaTotal += nonMbaSalary;
        mbaSalary *= (1 + wage_growth_MBA);
        nonMbaSalary *= (1 + wage_growth_noMBA);
    }
    const totalReturn = mbaTotal - nonMbaTotal;
    return totalReturn;
}


