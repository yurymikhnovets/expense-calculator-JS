const newOperationForm = document.querySelector('#new-operation-form');
const operationInput = document.querySelector('#operation');
const amountInput = document.querySelector('#amount');
const addIncomeBtn = document.querySelector('#add-income');
const addCostsBtn = document.querySelector('#add-costs');
const operationsHistory = document.querySelector('#operations-history');
const finalBalance = document.querySelector('#final-balance');
const finalBalanceUsd = document.querySelector('#final-balance-usd');
const finalBalanceEur = document.querySelector('#final-balance-eur');
const totalIncome = document.querySelector('#total-income');
const totalCosts = document.querySelector('#total-costs');
const newOperationModal = new bootstrap.Modal(document.querySelector('#new-operation-modal'));

const strToNum = str => str.textContent ? parseFloat(str.textContent) : 0;

const getExchangeRates = async () => {
    const response = await fetch('https://www.nbrb.by/api/exrates/rates?periodicity=0');
    const result = await response.json();
    const usdExchangeRate = result.find(abbr => abbr.Cur_Abbreviation === 'USD').Cur_OfficialRate;
    const eurExchangeRate = result.find(abbr => abbr.Cur_Abbreviation === 'EUR').Cur_OfficialRate;
    sessionStorage.setItem('usd', usdExchangeRate);
    sessionStorage.setItem('eur', eurExchangeRate);
}

getExchangeRates();

const createCard = (color, className, icon) => {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card', 'border-' + color, 'mb-2');
    const cardBodyElement = document.createElement('div');
    cardBodyElement.classList.add('card-body', 'd-flex', 'justify-content-between', 'align-items-center');
    const operationElement = document.createElement('h6');
    operationElement.classList.add('mb-0', 'text-break');
    operationElement.textContent = operationInput.value;
    const amountElement = document.createElement('h6');
    amountElement.classList.add('mb-0', 'text-' + color, className, 'text-nowrap');
    amountElement.textContent = parseFloat(amountInput.value).toFixed(2) + ' BYN';
    const operationIcon = document.createElement('i');
    operationIcon.classList.add('fa-solid', icon, 'text-' + color, 'me-2');
    operationsHistory.prepend(cardElement);
    cardElement.append(cardBodyElement);
    cardBodyElement.append(operationElement);
    cardBodyElement.append(amountElement);
    amountElement.prepend(operationIcon);
}

const getFinalBalance = () => {
    const grandTotal = strToNum(totalIncome) - strToNum(totalCosts);
    finalBalance.textContent = grandTotal.toFixed(2) + ' BYN';
}

const getFinalBalanceInCurrency = () => {
    const usdCurrency = sessionStorage.getItem('usd');
    const eurCurrency = sessionStorage.getItem('eur');
    const transferToUsd = strToNum(finalBalance) / parseFloat(usdCurrency);
    const transferToEur = strToNum(finalBalance) / parseFloat(eurCurrency);
    finalBalanceUsd.textContent = transferToUsd.toFixed(2) + ' USD';
    finalBalanceEur.textContent = transferToEur.toFixed(2) + ' EUR';
}

const getTotalIncome = () => {
    const incomeArr = [];
    const allIncome = document.querySelectorAll('.income');
    allIncome.forEach((element) => {
        const income = strToNum(element);
        incomeArr.push(income);
        let amountIncome = incomeArr.reduce((previousValue, currentValue) => {
            return previousValue + currentValue;
        });
        totalIncome.textContent = amountIncome.toFixed(2) + ' BYN';
    });
}

const getTotalCosts = () => {
    const costsArr = [];
    const allCosts = document.querySelectorAll('.costs');
    allCosts.forEach((element) => {
        const costs = strToNum(element);
        costsArr.push(costs);
        let amountCosts = costsArr.reduce((previousValue, currentValue) => {
            return previousValue + currentValue;
        });
        totalCosts.textContent = amountCosts.toFixed(2) + ' BYN';
    });
}

addIncomeBtn.addEventListener('click', () => {
    createCard('success', 'income', 'fa-arrow-up');
    newOperationForm.reset();
    newOperationModal.hide();
    getTotalIncome();
    getFinalBalance();
    getFinalBalanceInCurrency();
});

addCostsBtn.addEventListener('click', () => {
    createCard('danger', 'costs', 'fa-arrow-down');
    newOperationForm.reset();
    newOperationModal.hide();
    getTotalCosts();
    getFinalBalance();
    getFinalBalanceInCurrency();
});