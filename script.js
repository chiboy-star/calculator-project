class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement) {
    this.previousOperandTextElement = previousOperandTextElement;
    this.currentOperandTextElement = currentOperandTextElement;
    this.clear();
  }

  clear() {
    this.currentOperand = '';
    this.previousOperand = '';
    this.operation = undefined;
  }

  delete() {
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
  }

  appendNumber(number) {
    if (number === '.' && this.currentOperand.includes('.')) return;
    this.currentOperand = this.currentOperand.toString() + number.toString();
  }

  // Handles K (Thousands), M (Millions), H (Hundreds)
  chooseSpecialOperation(specialOperation) {
    // Prevent adding multiple letters (e.g., 5KK)
    const str = this.currentOperand.toString();
    if (/[KMH]/.test(str)) return; 
    
    this.currentOperand = str + specialOperation;
  }

  chooseOperation(operation) {
    if (this.currentOperand === '') return;
    if (this.previousOperand !== '') {
      this.compute();
    }
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = '';
  }

  // Helper to convert "2.5K" into 2500
  parseSpecialValue(val) {
    const strVal = val.toString();
    const numberVal = parseFloat(strVal);

    if (isNaN(numberVal)) return 0;
    
    if (strVal.includes('K')) return numberVal * 1000;
    if (strVal.includes('M')) return numberVal * 1000000;
    if (strVal.includes('H')) return numberVal * 100;
    
    return numberVal;
  }

  compute() {
    let computation;
    const prev = this.parseSpecialValue(this.previousOperand);
    const current = this.parseSpecialValue(this.currentOperand);

    if (isNaN(prev) || isNaN(current)) return;

    switch (this.operation) {
      case '+':
        computation = prev + current;
        break;
      case '-':
        computation = prev - current;
        break;
      case '*':
        computation = prev * current;
        break;
      case '÷':
        computation = prev / current;
        break;
      default:
        return;
    }
    this.currentOperand = computation;
    this.operation = undefined;
    this.previousOperand = '';
  }

  getDisplayNumber(number) {
    const stringNumber = number.toString();
    // Use regex to split numbers from letters (e.g. "500" vs "K")
    const match = stringNumber.match(/^([\d.]+)([KMH])?$/);
    
    if(!match) return stringNumber;

    const integerDigits = parseFloat(match[1].split('.')[0]);
    const decimalDigits = match[1].split('.')[1];
    const suffix = match[2] || ''; // K, M, H or empty

    let integerDisplay;
    if (isNaN(integerDigits)) {
      integerDisplay = '';
    } else {
      integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
    }

    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}${suffix}`;
    } else {
      return `${integerDisplay}${suffix}`;
    }
  }

  updateDisplay() {
    this.currentOperandTextElement.innerText =
      this.getDisplayNumber(this.currentOperand);
    if (this.operation != null) {
      this.previousOperandTextElement.innerText =
        `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
    } else {
      this.previousOperandTextElement.innerText = '';
    }
  }
}

const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const specialOperationButtons = document.querySelectorAll('[data-specialOperation]');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');
const allClearButton = document.querySelector('[data-all-clear]');
const previousOperandTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

numberButtons.forEach(button => {
  button.addEventListener('click', () => {
    calculator.appendNumber(button.innerText);
    calculator.updateDisplay();
  });
});

specialOperationButtons.forEach(button => {
  button.addEventListener('click', () => {
    calculator.chooseSpecialOperation(button.innerText);
    calculator.updateDisplay();
  });
});

operationButtons.forEach(button => {
  button.addEventListener('click', () => {
    calculator.chooseOperation(button.innerText);
    calculator.updateDisplay();
  });
});

equalsButton.addEventListener('click', () => {
  calculator.compute();
  calculator.updateDisplay();
});

allClearButton.addEventListener('click', () => {
  calculator.clear();
  calculator.updateDisplay();
});

deleteButton.addEventListener('click', () => {
  calculator.delete();
  calculator.updateDisplay();
});