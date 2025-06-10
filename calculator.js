

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
    const expenses = parseFloat(document.querySelector('#expenses-slider').value);
    const interestRate = parseFloat(document.querySelector('#interest-rate-slider').value) / 100;
    const amountBorrowed = parseFloat(document.querySelector('#amount-borrowed-slider').value);
    console.log('Total amount borrowed:', amountBorrowed);
    console.log('Total interest rate:', interestRate);
    console.log('Total expenses:', expenses);

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

function totalMBAInvestment() {
    const currentSalaryElem = document.querySelector('#current-salary-slider');
    const compInSchoolElem = document.querySelector('#comp-in-school-slider');
    const interest = loanInterest();
    const expenses = parseFloat(document.querySelector('#expenses-slider').value);
    const currentSalary = parseFloat(currentSalaryElem.value);
    const compInSchool = parseFloat(compInSchoolElem.value);

    let totalMBAInvestment = (currentSalary * 2) + interest + expenses - compInSchool;
    console.log(totalMBAInvestment);
    return totalMBAInvestment;
}

function netForgoneIncome() {
    const currentSalaryElem = document.querySelector('#current-salary-slider');
    const currentSalary = parseFloat(currentSalaryElem.value);
    const timeOff = 2; // time off in years
    let netForgoneIncome = currentSalary * time_off; // Assuming time_off is in years

    return netForgoneIncome;
}
function totalReturn() {
    // Get dynamic variables from DOM
    const currentSalaryElem = document.querySelector('#current-salary-slider');
    const expectedSalaryElem = document.querySelector('#expected-salary-slider');
    const expectedSigningBonusElem = document.querySelector('#expected-signing-bonus-slider');
    const compInSchoolElem = document.querySelector('#comp-in-school-slider');

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

function formatNumber(id, value) {
    if (id === 'interest-rate') {
        return value + '%';
    } else {
        return Math.round(value / 1000) + 'K';
    }
}


        // Helper function to create a slider with label and value display
        function createSlider(id, label, min, max, step, value) {
            return `
        <label for="${id}-slider">${label}:
            <input type="range" id="${id}-slider" min="${min}" max="${max}" step="${step}" value="${value}" style="width:200px;">
            <span id="${id}-suffix"></span>
        </label>
        <br>
    `;
        }

        // Insert sliders into the calculator form
        window.addEventListener('DOMContentLoaded', function () {
            const calculator = document.querySelector('.calculator');
            calculator.innerHTML = `
            <h1>Daniel's MBA ROI Calculator</h1>
            <p>${createSlider('expenses', 'Out of pocket expenses ($)', 0, 200000, 1000, 0)}</p>
            <p>${createSlider('amount-borrowed', 'Amount Borrowed ($)', 0, 200000, 1000, 0)}</p>
            <p>${createSlider('interest-rate', 'Interest Rate (%)', 0, 15, 0.1, 5)}</p>
            <p>${createSlider('current-salary', 'Current Salary', 0, 300000, 1000, 0)}</p>
            <p>${createSlider('expected-salary', 'Expected Starting Salary', 0, 500000, 1000, 0)}</p>
            <p>${createSlider('expected-signing-bonus', 'Expected Signing Bonus', 0, 100000, 500, 0)}</p>
            <p>${createSlider('comp-in-school', 'Compensation While in School', 0, 100000, 500, 0)}</p>
            <p>Total Interest : <span id="total-interest"></span></p>
            <p>Total MBA Investment (tuition + living cost above baseline + interest + forgone income) : <span id="total-MBA-investment"></span></p>
            <p>Net Forgone Income : <span id="net-forgone-income"></span></p>
            <p>Total Return : <span id="total-return"></span></p>
            <button id="calculate-btn" type="button">Calculate</button>
            <h2 id="total"></h2>
        `;

            // Add slider-input synchronization for each slider
            const sliderIds = [
                'expenses',
                'amount-borrowed',
                'interest-rate',
                'current-salary',
                'expected-salary',
                'expected-signing-bonus',
                'comp-in-school'
            ];
            sliderIds.forEach(id => {
                const slider = document.getElementById(`${id}-slider`);
                const suffix = document.getElementById(`${id}-suffix`);

                // Initialize the suffix on page load
                suffix.textContent = formatNumber(id, slider.value);

                slider.addEventListener('input', function () {
                    suffix.textContent = formatNumber(id, slider.value);
                });
            });
            const calcBtn = document.getElementById('calculate-btn');
if (calcBtn) {
    calcBtn.addEventListener('click', function () {
        // Call your calculation functions here
        const interest = loanInterest();
        const mbaInvestment = totalMBAInvestment();
        const forgoneIncome = netForgoneIncome();
        const returnVal = totalReturn();

        // Display results in the UI
        document.getElementById('total-interest').textContent = interest.toLocaleString(undefined, {maximumFractionDigits: 0});
        document.getElementById('total-MBA-investment').textContent = mbaInvestment.toLocaleString(undefined, {maximumFractionDigits: 0});
        document.getElementById('net-forgone-income').textContent = forgoneIncome.toLocaleString(undefined, {maximumFractionDigits: 0});
        document.getElementById('total-return').textContent = returnVal.toLocaleString(undefined, {maximumFractionDigits: 0});
        document.getElementById('total').textContent = `ROI: $${returnVal.toLocaleString(undefined, {maximumFractionDigits: 0})}`;
        // You can add more console logs for debugging if needed
        console.log('Interest:', interest);
        console.log('MBA Investment:', mbaInvestment);
        console.log('Forgone Income:', forgoneIncome);
        console.log('Total Return:', returnVal);
    });
}
        });
        




