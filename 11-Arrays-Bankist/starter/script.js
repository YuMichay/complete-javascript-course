'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];
const ownersNames = accounts.map((account) => account["owner"].split(" ").map((owner) => owner.toLowerCase().slice(0, 1)));
const userNames = ownersNames.map((name) => name.join("_"));
accounts.map((account, index) => account.username = userNames[index]);

let currentAcc;
let currentBalance = 0;

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
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

let currence = "€";

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const eurToUsd = 1.1;

// const movementsToUsd = movements.map((movement) => Math.round(movement * eurToUsd));

/////////////////////////////////////////////////

const findUser = function(enteredName) {
  currentAcc = accounts.find((account) => account.username === enteredName);
}

const setDate = function() {
  const date = new Date();
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  const month = date.getMonth() < 10 ? `0${date.getMonth()}` : date.getMonth();
  labelDate.textContent = `${day}/${month}/${date.getFullYear()}`;
}

const calcDisplaySummary = function(account, movements) {
  currentBalance = movements.reduce((sum, current) => sum += current, 0);
  labelBalance.textContent = currentBalance + currence;

  const income = movements.filter((movement) => movement > 0).reduce((sum, current) => sum += current, 0);
  labelSumIn.textContent = income + currence;

  const outcome = movements.filter((movement) => movement < 0).reduce((sum, current) => sum += current, 0);
  labelSumOut.textContent = Math.abs(outcome) + currence;

  const interest = movements.filter((movement) => movement > 0).map((deposit) => (deposit * account.interestRate) / 100).filter((interest) => interest >= 1).reduce((acc, current) => acc += current, 0);
  labelSumInterest.textContent = interest.toFixed(2) + currence;
}

const updateUI = function(account) {
  labelWelcome.textContent = `Hello, ${account.owner}`;

  containerMovements.innerHTML = "";
  const movements = sorted ? [...account.movements].sort((a, b) => a - b) : account.movements;

  movements.forEach((movement, index) => {
    const type = movement > 0 ? 'deposit' : 'withdrawal';
    const movementRow = `<div class="movements__row">
                            <div class="movements__type movements__type--${type}">${index + 1} ${type}</div>
                            <div class="movements__date">3 days ago</div>
                            <div class="movements__value">${movement}€</div>
                        </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", movementRow);
  })

  calcDisplaySummary(account, movements);
}

const logIn = function(e) {
  e.preventDefault();
  setDate();

  const enteredName = inputLoginUsername.value;
  const enteredPIN = inputLoginPin.value;
  
  findUser(enteredName);
  if (currentAcc && currentAcc.pin === +enteredPIN) {
    updateUI(currentAcc);
    containerApp.style.opacity = 1;
  } else if (!currentAcc) {
    alert("Oops! Check the username and/or pin!");
    containerApp.style.opacity = 0;
  }

  inputLoginUsername.value = inputLoginPin.value = "";
}
btnLogin.addEventListener("click", (e) => logIn(e));

const transfer = function(e) {
  e.preventDefault();

  const toUser = inputTransferTo.value;
  const amount = +inputTransferAmount.value;
  const hasUser = accounts.find((account) => account.username === toUser);

  if (hasUser && hasUser !== currentAcc && currentBalance >= amount && amount > 0) {
    currentAcc.movements.push(-amount);
    hasUser.movements.push(amount);
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
    currentAcc.movements.push(amount);
    updateUI(currentAcc);
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
    containerApp.style.opacity = 0;
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

// const movementsDescriptions = movements.map((movement, index) => `Movement ${index + 1}: you ${movement > 0 ? "deposited" : "withdrew"} ${Math.abs(movement)}`)





// Coding Challenge #1

/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, 
and stored the data into an array (one array for each). 
For now, they are just interested in knowing whether a dog is an adult or a puppy. 
A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), 
and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! 
So create a shallow copy of Julia's array, and remove the cat ages from that copied array 
(because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, 
and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

*/

// const checkDogs = function(dogsJulia, dogsKate) {
//   const correctedDogsJulia = dogsJulia.slice(1, dogsJulia.length - 1);
//   const correctedDogsKate = dogsKate.slice(1, dogsKate.length - 1);
//   correctedDogsJulia.concat(correctedDogsKate).forEach((dog, index) => {
//     const isAdult = dog >= 3 ? `an adult, and is ${dog} years old` : "is still a puppy 🐶";
//     console.log(`Dog number ${index + 1} is ${isAdult}`);
//   });
// }
// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
// checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);

// Coding Challenge #2

/* 
Let's go back to Julia and Kate's study about dogs. 
This time, they want to convert dog ages to human ages 
and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), 
and does the following things in order:

1. Calculate the dog age in human years using the following formula: 
if the dog is <= 2 years old, humanAge = 2 * dogAge. 
If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old 
(which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs 
(you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

*/

// const calcAverageHumanAge = function(ages) {
//   const humanAges = ages.map((age) => age <= 2 ? 2 * age : 16 + age * 4).filter((humanAge) => humanAge >= 18);
//   const adultDogs = humanAges.filter((humanAge) => humanAge >= 18);
//   const average = Math.round(adultDogs.reduce((acc, current) => acc += current, 0) / adultDogs.length);
//   console.log(average);
// }

// calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

// Coding Challenge #3

/* 
Rewrite the 'calcAverageHumanAge' function from the previous challenge, but this time as an arrow function, and using chaining!

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

*/

// const calcAverageHumanAge = (ages) => {
//   const average = ages.map((age) => age <= 2 ? 2 * age : 16 + age * 4).filter((humanAge) => humanAge >= 18).reduce((acc, current, _, arr) => acc += current / arr.length, 0);
//   console.log(average);
// }

// calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

// Coding Challenge #4

/* 
Julia and Kate are still studying dogs, and this time they are studying 
if dogs are eating too much or too little.
Eating too much means the dog's current food portion is larger than the recommended portion, 
and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10% above 
and 10% below the recommended portion (see hint).

1. Loop over the array containing dog objects, and for each dog, 
calculate the recommended food portion and add it to the object as a new property. 
Do NOT create a new array, simply loop over the array. 
Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, 
  and the weight needs to be in kg)
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') 
and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice 
and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended 
(just true or false)
6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food 
(try to reuse the condition used in 6.)
8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order 
(keep in mind that the portions are inside the array's objects)

HINT 1: Use many different tools to solve these challenges, 
you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: 
current > (recommended * 0.90) && current < (recommended * 1.10). 
Basically, the current portion should be between 90% and 110% of the recommended portion.

*/

// const dogs = [
//   { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
//   { weight: 8, curFood: 200, owners: ['Matilda'] },
//   { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
//   { weight: 32, curFood: 340, owners: ['Michael'] }
// ];

// 1

// dogs.forEach((dog) => dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28));

// 2

// const sarahsDog = dogs.find((dog) => dog.owners.includes('Sarah'));
// console.log(`Your dog is eating too ${sarahsDog.curFood > sarahsDog.recommendedFood ? "much" : "little" }`)

// 3

// const ownersEatTooMuch = dogs.filter((dog) => dog.curFood > dog.recommendedFood);
// const ownersEatTooLittle = dogs.filter((dog) => dog.curFood < dog.recommendedFood);

// console.log(ownersEatTooMuch, ownersEatTooLittle);

// 4

// console.log(`${ownersEatTooMuch.reduce((acc, currentDog) => acc += ` ${currentDog.owners.join(" ")}`, "").trim().replace(/\s/gi, " and ")}'s dogs eat too much!`)
// console.log(`${ownersEatTooLittle.reduce((acc, currentDog) => acc += ` ${currentDog.owners.join(" ")}`, "").trim().replace(/\s/gi, " and ")}'s dogs eat too little!`)

// 5

// const exactFoodAmount = dogs.some((dog) => dog.recommendedFood === dog.curFood);
// console.log(exactFoodAmount);

// 6

// const okayFoodAmount = dogs.some((dog) => (dog.curFood > dog.recommendedFood * 0.9 && dog.curFood < dog.recommendedFood * 1.1));
// console.log(okayFoodAmount);

// 7

// const okayFoodAmount = dogs.filter((dog) => dog.curFood > dog.recommendedFood * 0.9 && dog.curFood < dog.recommendedFood * 1.1);
// console.log(okayFoodAmount);

// 8

// const copyDogs = Array.from(dogs);
// copyDogs.sort((a, b) => a.recommendedFood - b.recommendedFood);
// console.log(copyDogs)