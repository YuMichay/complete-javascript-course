'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2022-11-18T21:31:17.178Z',
    '2022-12-23T07:42:02.383Z',
    '2022-01-28T09:15:04.904Z',
    '2023-04-01T10:17:24.185Z',
    '2023-05-08T14:11:59.604Z',
    '2023-05-27T17:01:17.194Z',
    '2023-07-11T23:36:17.929Z',
    '2023-08-30T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2022-11-01T13:15:33.035Z',
    '2022-11-30T09:48:16.867Z',
    '2022-12-25T06:04:23.907Z',
    '2023-01-25T14:18:46.235Z',
    '2023-03-05T16:33:06.386Z',
    '2023-05-10T14:43:26.374Z',
    '2023-08-29T18:49:59.371Z',
    '2023-08-31T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];
const ownersNames = accounts.map((account) => account["owner"].split(" ").map((owner) => owner.toLowerCase().slice(0, 1)));
const userNames = ownersNames.map((name) => name.join("_"));
accounts.map((account, index) => account.username = userNames[index]);

const curencies = {
    "EUR": "€",
    "USD": "$"
};

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

let interval;
let currentAcc;
let locale;
let currencyOptions;
let currentBalance = 0;
let currentDate = new Date();
const dateOptions = {
  hour: "numeric",
  minute: "numeric",
  day: "numeric",
  month: "numeric",
  year: "numeric",
};

/////////////////////////////////////////////////

const findUser = function(enteredName) {
  currentAcc = accounts.find((account) => account.username === enteredName);
  locale = currentAcc.locale;
  currencyOptions = {
    style: "currency",
    currency: currentAcc.currency
  }
}

const calcDaysPassed = function(date1, date2) {
  const daysPassed = Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));
  if (daysPassed > 3) {
    return setDate(date2);
  } else if (daysPassed <= 7 && daysPassed > 1) {
    return `${daysPassed} days ago`;
  } else if (daysPassed === 1) {
    return "Yesterday";
  } else {
    return "Today";
  }  
}

const formatDate = function(date) {
  return new Intl.DateTimeFormat(locale, dateOptions).format(date);
}

const formatNumber = function(number) {
  return new Intl.NumberFormat(locale, currencyOptions).format(number)
}

const calcDisplaySummary = function(account, movements) {
  currentBalance = movements.reduce((sum, current) => sum += current, 0).toFixed(2);
  labelBalance.textContent = formatNumber(currentBalance);

  const income = movements.filter((movement) => movement > 0).reduce((sum, current) => sum += current, 0);
  labelSumIn.textContent = formatNumber(income);

  const outcome = movements.filter((movement) => movement < 0).reduce((sum, current) => sum += current, 0);
  labelSumOut.textContent = formatNumber(Math.abs(outcome));

  const interest = movements.filter((movement) => movement > 0).map((deposit) => (deposit * account.interestRate) / 100).filter((interest) => interest >= 1).reduce((acc, current) => acc += current, 0);
  labelSumInterest.textContent = formatNumber(interest);
}

const updateUI = function(account) {
  labelWelcome.textContent = `Hello, ${account.owner}`;

  containerMovements.innerHTML = "";
  const movements = sorted ? [...account.movements].sort((a, b) => a - b) : account.movements;

  movements.forEach((movement, index) => {
    const type = movement > 0 ? 'deposit' : 'withdrawal';
    const date = formatDate(new Date(account.movementsDates[index]));
    const movementRow = `<div class="movements__row">
                            <div class="movements__type movements__type--${type}">${index + 1} ${type}</div>
                            <div class="movements__date">${date}</div>
                            <div class="movements__value">${formatNumber(movement)}</div>
                        </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", movementRow);
  })

  calcDisplaySummary(account, movements);
  if (interval) clearInterval(interval);
  startLogOut();
}

const clearInfo = function() {
  labelWelcome.textContent = "Login to get started";
  containerMovements.innerHTML = "";
  currentAcc = "";
  locale = "";
  currencyOptions = {};
  currentBalance = 0;
  containerApp.style.opacity = 0;
}

const startLogOut = function() {
  let time = 300;

  interval = setInterval(() => {
    const minutes = String(Math.trunc(time / 60)).padStart(2, 0);
    const seconds = (time % 60).toFixed().padStart(2, 0);
    labelTimer.textContent = `${minutes}:${seconds}`;

    if (time <= 0) {
      clearInterval(interval);
      clearInfo();
    }

    time--;
  }, 1000);
}

const logIn = function(e) {
  e.preventDefault();

  if (interval) clearInterval(interval);
  startLogOut();

  const enteredName = inputLoginUsername.value;
  const enteredPIN = inputLoginPin.value;
  
  findUser(enteredName);

  if (currentAcc && currentAcc.pin === +enteredPIN) {
    updateUI(currentAcc);
    containerApp.style.opacity = 1;
    labelDate.textContent = formatDate(currentDate)
  } else if (!currentAcc) {
    alert("Oops! Check the username and/or pin!");
    containerApp.style.opacity = 0;
  }

  inputLoginUsername.value = inputLoginPin.value = "";
}
btnLogin.addEventListener("click", (e) => logIn(e));

const convent = function(amount) {
  const eurToUsd = 1.1;
  return Math.round(amount * eurToUsd);
}

const transfer = function(e) {
  e.preventDefault();

  const toUser = inputTransferTo.value;
  const amount = +inputTransferAmount.value;
  const hasUser = accounts.find((account) => account.username === toUser);

  if (hasUser && hasUser !== currentAcc && currentBalance >= amount && amount > 0) {
    currentAcc.movements.push(-amount);
    currentAcc.currency === hasUser.currency ? hasUser.movements.push(amount) : hasUser.movements.push(convent(amount));
    currentAcc.movementsDates.push(currentDate);
    hasUser.movementsDates.push(currentDate);
    inputTransferTo.value = inputTransferAmount.value = "";
    updateUI(currentAcc);
  } else if (hasUser === currentAcc) {
    alert("Oops! You can't transfer money to yourself");
    inputTransferTo.value = inputTransferAmount.value = "";
  } else if (!hasUser) {
    alert("Oops! Check the username");
    inputTransferTo.value = "";
  } else if (hasUser && currentBalance < amount) {
    alert("Oops! You don't have enough money!");
    inputTransferAmount.value = "";
  }
}
btnTransfer.addEventListener("click", (e) => transfer(e));

const requestLoan = function(e) {
  e.preventDefault();

  const amount = +inputLoanAmount.value;

  if (amount > 0 && currentAcc.movements.some((movement) => movement >= amount * 0.1)) {
    setTimeout(() => {
      currentAcc.movements.push(amount);
      currentAcc.movementsDates.push(currentDate);
      updateUI(currentAcc);
    }, 1000)
  }

  inputLoanAmount.value = "";
}
btnLoan.addEventListener("click", (e) => requestLoan(e));

const closeAcc = function(e) {
  e.preventDefault();

  findUser(inputCloseUsername.value);
  if (currentAcc && currentAcc.pin === +inputClosePin.value) {
    const index = accounts.findIndex((account) => account.username === currentAcc.username);
    accounts.splice(index, 1);
    clearInterval(interval);
    clearInfo();
    inputCloseUsername.value = inputClosePin.value = "";
  } else {
    alert("Oops! Check the username and/or pin!");
  }
}
btnClose.addEventListener("click", (e) => closeAcc(e));

let sorted = false;

const sort = function() {
  sorted = !sorted;
  updateUI(currentAcc);
}

btnSort.addEventListener("click", sort);

setInterval(() => labelDate.textContent = formatDate(currentDate), 1000);
