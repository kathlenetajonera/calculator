const body = document.body;
const themeToggleButton = document.querySelector(".header__toggle-btn");
const themeToggleIndicator = document.querySelector(".header__toggle-indicator");
const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
const currentNumber = document.querySelector(".calculator__current-number");
const keypad = document.querySelector(".calculator__keypad");
const saveThemeToStorage = (themeIndex) => localStorage.setItem("themeIndex", themeIndex);
let themeCounter;
let previousOperand = '';
let currentOperand = '';
let operation;
let result;

loadInitialTheme();

themeToggleButton.addEventListener("click", () => {
    themeCounter < 2 
    ? themeCounter++
    : themeCounter = 0

    updateTheme();
});

function loadInitialTheme() {
    const savedThemeIndex = localStorage.getItem("themeIndex");

    if (savedThemeIndex) {
        themeCounter = savedThemeIndex;
    } else {
        isDarkMode ? themeCounter = 0 : themeCounter = 1;
    }

    updateTheme();
}

function updateTheme() {
    const themeClassNames = ["dark-mode", "light-mode", "bright-mode"];
    const currentTheme = themeClassNames[themeCounter];

    //removes previous class, then adds new theme class
    body.classList = ""
    body.classList.add(`${currentTheme}`);

    saveThemeToStorage(themeCounter);
}

keypad.addEventListener("click", e => {
    const target = e.target;
    const numberKeys = target.hasAttribute("data-number");
    const operationKeys = target.hasAttribute("data-operation");

    if (numberKeys) {
        const number = e.target.dataset.number;

        handleNumberKey(number);
    } else if (operationKeys) {
        const operation = e.target.dataset.operation;

        handleOperationKey(operation);
    } else {
        const action = e.target.dataset.action;

        handleActionKeys(action);
    }
})

document.addEventListener("keydown", e => {
    const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];
    const operators = { addition: "+",  subtraction: "-", multiplication: "*", division: "/" };
    const key = e.key;

    const isNumber = numbers.find(number => number === key);
    const operatorIndex = Object.values(operators).findIndex(operator => operator === key);
    const isActionKey = key === "Enter" || key === "Backspace";

    if (isNumber) {
        handleNumberKey(key);
    } else if (operatorIndex !== -1) {
        const operation = Object.keys(operators)[operatorIndex];

        handleOperationKey(operation)
    } else if (isActionKey) {
        key === "Enter"
        ? handleActionKeys("equals")
        : handleActionKeys("delete")
    } else return;
})

function handleNumberKey(numberKey) {
    const isFirstNumber = !currentOperand && !previousOperand;

    if (isFirstNumber && numberKey === "0") return;

    currentOperand += numberKey;
    currentNumber.textContent = currentOperand;
}

function handleOperationKey(operationKey) {
    const hasBothOperands = previousOperand && currentOperand;
    const isChangingOperator = previousOperand && !currentOperand;

    if (hasBothOperands) {
        handleComputation();

        operation = operationKey;
        previousOperand = result;
        currentOperand = '';
    } else if (isChangingOperator) {
        operation = operationKey;
    } else { 
        operation = operationKey;

        previousOperand = currentOperand;
        currentOperand = '';
    }
}

function handleActionKeys(actionKey) {
    switch (actionKey) {
        case "reset":
            currentOperand = '';
            previousOperand = '';
            currentNumber.textContent = 0;
            break;
        case "delete":
            const updatedOperand = currentOperand.slice(0, currentOperand.length - 1);
            currentOperand = updatedOperand;

            if (currentOperand) currentNumber.textContent = currentOperand;
            else currentNumber.textContent = 0;

            break;
        case "equals":
            handleComputation();

            previousOperand = '';
            currentOperand = result;

            break;
        default:
            break;
    }
}

function handleComputation() {
    let operandOne = parseFloat(previousOperand);
    let operandTwo = parseFloat(currentOperand);

    if (previousOperand === "." && previousOperand.length === 1) {
        operandOne = 0;
    } else if (currentOperand === "." && currentOperand.length === 1) {
        operandTwo = 0;
    }

    switch (operation) {
        case "addition":
            result = operandOne + operandTwo
            break;
        case "subtraction":
            result = operandOne - operandTwo
            break;
        case "multiplication":
            result = operandOne * operandTwo
            break;
        case "division":
            result = operandOne / operandTwo
            break;
        default:
            break;
    }

    currentNumber.textContent = result;
}