const operationInput = document.querySelector('#operation');
const amountInput = document.querySelector('#amount');
const dateInput = document.querySelector('#operation-date');
const operationsHistory = document.querySelector('#operations-history');
const finalBalance = document.querySelector('#final-balance');
const finalBalanceUsd = document.querySelector('#final-balance-usd');
const finalBalanceEur = document.querySelector('#final-balance-eur');
const totalIncome = document.querySelector('#total-income');
const totalCosts = document.querySelector('#total-costs');
const newOperationModal = new bootstrap.Modal(document.querySelector('#new-operation-modal'));
const newOperationForm = document.querySelector('#new-operation-form');
const closeModalBtn = document.querySelector('#close-modal-btn');
const addIncomeBtn = document.querySelector('#add-income-btn');
const addCostsBtn = document.querySelector('#add-costs-btn');

const strToNum = str => str.textContent ? parseFloat(str.textContent) : 0;

const getExchangeRates = async () => {
    const response = await fetch('https://www.nbrb.by/api/exrates/rates?periodicity=0');
    const result = await response.json();
    const usdExchangeRate = result.find(abbr => abbr.Cur_Abbreviation === 'USD').Cur_OfficialRate;
    const eurExchangeRate = result.find(abbr => abbr.Cur_Abbreviation === 'EUR').Cur_OfficialRate;
    localStorage.setItem('usd', usdExchangeRate);
    localStorage.setItem('eur', eurExchangeRate);
}

getExchangeRates();

const createCard = (color, className, icon) => {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card', 'border-dark', 'mt-2', 'position-relative', 'operation-card');
    const cardBodyElement = document.createElement('div');
    cardBodyElement.classList.add('card-body', 'py-2', 'd-flex', 'justify-content-between', 'align-items-center');
    const operationName = document.createElement('p');
    operationName.classList.add('my-0', 'small', 'text-gray-dark');
    operationName.textContent = operationInput.value;
    const amountElement = document.createElement('p');
    amountElement.classList.add('my-0', 'small', 'text-' + color, 'text-nowrap');
    const amountIcon = document.createElement('i');
    amountIcon.classList.add('fa-solid', 'fa-' + icon, 'text-' + color, 'me-2');
    const amount = document.createElement('strong');
    amount.classList.add(className);
    amount.textContent = parseFloat(amountInput.value).toFixed(2) + ' BYN';
    operationsHistory.prepend(cardElement);
    cardElement.append(cardBodyElement);
    cardBodyElement.append(operationName);
    cardBodyElement.append(amountElement);
    amountElement.append(amount);
    amount.prepend(amountIcon);
}

const getFinalBalance = () => {
    const grandTotal = strToNum(totalIncome) - strToNum(totalCosts);
    finalBalance.textContent = grandTotal.toFixed(2) + ' BYN';
}

const getFinalBalanceInCurrency = () => {
    const usdCurrency = localStorage.getItem('usd');
    const eurCurrency = localStorage.getItem('eur');
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

const hideModal = () => {
    newOperationModal.hide();
    newOperationForm.reset();
    operationInput.classList.remove('is-invalid');
    amountInput.classList.remove('is-invalid');
}

const isRequired = value => value === '' ? false : true;

const checkForm = () => {
    let valid = false;
    const operation = operationInput.value.trim();
    const amount = amountInput.value;
    if(!isRequired(operation) && !isRequired(amount)) {
        operationInput.classList.add('is-invalid');
        amountInput.classList.add('is-invalid');
    } else if(isRequired(operation) && !isRequired(amount)) {
        operationInput.classList.remove('is-invalid');
        amountInput.classList.add('is-invalid');
    } else if(!isRequired(operation) && isRequired(amount)) {
        operationInput.classList.add('is-invalid');
        amountInput.classList.remove('is-invalid');
    } else {
        operationInput.classList.remove('is-invalid');
        amountInput.classList.remove('is-invalid');
        valid = true;
    }
    return valid;
}

addIncomeBtn.addEventListener('click', () => {
    const isFormValid = checkForm();
    if(isFormValid) {
        createCard('success', 'income', 'arrow-up');
        getTotalIncome();
        getFinalBalance();
        getFinalBalanceInCurrency();
        hideModal();
    } else {
        return;
    }
});

addCostsBtn.addEventListener('click', () => {
    const isFormValid = checkForm();
    if(isFormValid) {
        createCard('danger', 'costs', 'arrow-down');
        getTotalCosts();
        getFinalBalance();
        getFinalBalanceInCurrency();
        hideModal();
    } else {
        return;
    }
});

closeModalBtn.addEventListener('click', hideModal);