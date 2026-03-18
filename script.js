/**
 * Smart Calculator Logic
 * Handles standard operations and custom multipliers (H, K, M).
 */
class Calculator {
  constructor(previousOperandElement, currentOperandElement) {
    this.previousOperandElement = previousOperandElement;
    this.currentOperandElement = currentOperandElement;
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
    // Prevent multiple decimals
    if (number === '.' && this.currentOperand.includes('.')) return;
    this.currentOperand = this.currentOperand.toString() + number.toString();
  }

  /**
   * Instantly evaluates the multiplier and updates the current operand.
   * e.g., typing '5' then 'K' immediately makes it '5000'
   */
  applyMultiplier(multiplier) {
    if (this.currentOperand === '') return;

    const currentNum = parseFloat(this.currentOperand);
    if (isNaN(currentNum)) return;

    let result;
    switch (multiplier) {
      case 'H': result = currentNum * 100; break;
      case 'K': result = currentNum * 1000; break;
      case 'M': result = currentNum * 1000000; break;
      default: return;
    }

    // Convert back to string for state management
    this.currentOperand = result.toString();
  }

  chooseOperation(operation) {
    if (this.currentOperand === '') return;
    
    // If we already have a previous operand, compute first before starting new operation
    if (this.previousOperand !== '') {
      this.compute();
    }
    
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = '';
  }

  compute() {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);

    // Guard clause: if either is not a number, don't compute
    if (isNaN(prev) || isNaN(current)) return;

    switch (this.operation) {
      case '+': computation = prev + current; break;
      case '-': computation = prev - current; break;
      case '×': computation = prev * current; break;
      case '÷': computation = prev / current; break;
      default: return;
    }

    this.currentOperand = computation.toString();
    this.operation = undefined;
    this.previousOperand = '';
  }

  /**
   * Formats numbers with commas (e.g., 1000000 -> 1,000,000)
   * while preserving decimal points as they are being typed.
   */
  getDisplayNumber(number) {
    const stringNumber = number.toString();
    // Split into integer and decimal parts
    const integerDigits = parseFloat(stringNumber.split('.')[0]);
    const decimalDigits = stringNumber.split('.')[1];

    let integerDisplay;
    if (isNaN(integerDigits)) {
      integerDisplay = '';
    } else {
      // Format integers with commas
      integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
    }

    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`;
    } else {
      return integerDisplay;
    }
  }

  updateDisplay() {
    this.currentOperandElement.innerText = this.getDisplayNumber(this.currentOperand);
    
    if (this.operation != null) {
      this.previousOperandElement.innerText = 
        `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
    } else {
      this.previousOperandElement.innerText = '';
    }
  }
}

// --- DOM Elements & Initialization ---
const UI = {
  numberBtns: document.querySelectorAll('[data-number]'),
  operationBtns: document.querySelectorAll('[data-operation]'),
  specialBtns: document.querySelectorAll('[data-special]'),
  equalsBtn: document.querySelector('[data-equals]'),
  deleteBtn: document.querySelector('[data-delete]'),
  clearBtn: document.querySelector('[data-all-clear]'),
  prevOperand: document.querySelector('[data-previous-operand]'),
  currOperand: document.querySelector('[data-current-operand]')
};

const calculator = new Calculator(UI.prevOperand, UI.currOperand);

// --- Event Listeners ---
UI.numberBtns.forEach(button => {
  button.addEventListener('click', () => {
    calculator.appendNumber(button.innerText);
    calculator.updateDisplay();
  });
});

UI.operationBtns.forEach(button => {
  button.addEventListener('click', () => {
    calculator.chooseOperation(button.innerText);
    calculator.updateDisplay();
  });
});

UI.specialBtns.forEach(button => {
  button.addEventListener('click', () => {
    // Pass the multiplier (H, K, or M) from the dataset or innerText
    calculator.applyMultiplier(button.innerText);
    calculator.updateDisplay();
  });
});

UI.equalsBtn.addEventListener('click', () => {
  calculator.compute();
  calculator.updateDisplay();
});

UI.clearBtn.addEventListener('click', () => {
  calculator.clear();
  calculator.updateDisplay();
});

UI.deleteBtn.addEventListener('click', () => {
  calculator.delete();
  calculator.updateDisplay();
});