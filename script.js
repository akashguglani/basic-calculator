const calculator = document.querySelector('.calculator');
const keys = calculator.querySelector('.calculator-keys');
const display = document.querySelector('.calculator-screen');

let firstValue = null;
let operator = null;
let waitingForSecondValue = false;

keys.addEventListener('click', (event) => {
    const { target } = event; // Get the clicked element
    const { value } = target; // Get the value attribute of the clicked element

    // If the clicked element is not a button, do nothing
    if (!target.matches('button')) {
        return;
    }

    switch (value) {
        case '+':
        case '-':
        case '*':
        case '/':
            handleOperator(value);
            break;
        case '=':
            calculate();
            break;
        case '.':
            inputDecimal(value);
            break;
        case 'all-clear':
            resetCalculator();
            break;
        default:
            // Check if the button is a number
            if (Number.isInteger(parseFloat(value))) {
                inputDigit(value);
            }
    }

    updateDisplay();
});

function inputDigit(digit) {
    if (waitingForSecondValue === true) {
        display.value = digit;
        waitingForSecondValue = false;
    } else {
        // If current display is '0', replace it with digit, otherwise append
        display.value = display.value === '0' ? digit : display.value + digit;
    }
}

function inputDecimal(dot) {
    // Ensure that a decimal point can only be added once
    if (waitingForSecondValue === true) {
        display.value = '0.';
        waitingForSecondValue = false;
        return;
    }
    if (!display.value.includes(dot)) {
        display.value += dot;
    }
}

function handleOperator(nextOperator) {
    const inputValue = parseFloat(display.value);

    if (operator && waitingForSecondValue) {
        operator = nextOperator;
        return;
    }

    if (firstValue === null && !isNaN(inputValue)) {
        firstValue = inputValue;
    } else if (operator) {
        const result = performCalculation[operator](firstValue, inputValue);
        display.value = String(result);
        firstValue = result;
    }

    waitingForSecondValue = true;
    operator = nextOperator;
}

const performCalculation = {
    '/': (firstOperand, secondOperand) => firstOperand / secondOperand,
    '*': (firstOperand, secondOperand) => firstOperand * secondOperand,
    '+': (firstOperand, secondOperand) => firstOperand + secondOperand,
    '-': (firstOperand, secondOperand) => firstOperand - secondOperand,
};

function calculate() {
    const inputValue = parseFloat(display.value);

    if (firstValue === null || operator === null || waitingForSecondValue) {
        return; // Do nothing if not enough operands/operator
    }

    const result = performCalculation[operator](firstValue, inputValue);
    display.value = String(result);
    firstValue = result; // Set result as firstValue for chaining operations
    operator = null; // Clear operator after calculation
    waitingForSecondValue = true; // Wait for new input for next operation
}

function resetCalculator() {
    display.value = '0';
    firstValue = null;
    operator = null;
    waitingForSecondValue = false;
}

function updateDisplay() {
    // This function is implicitly called by setting display.value directly
    // but it's good practice to have it if you need more complex display logic
}
