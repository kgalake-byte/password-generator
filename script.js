// DOM Elements
const resultEl = document.getElementById('result');
const lengthEl = document.getElementById('length');
const uppercaseEl = document.getElementById('uppercase');
const lowercaseEl = document.getElementById('lowercase');
const numbersEl = document.getElementById('numbers');
const symbolsEl = document.getElementById('symbols');
const generateBtn = document.getElementById('generate-btn');
const copyBtn = document.getElementById('copy-btn');
const strengthBar = document.querySelector('.strength-bar');
const strengthText = document.getElementById('strength-text');

// Character sets
const randomFunc = {
  lower: getRandomLower,
  upper: getRandomUpper,
  number: getRandomNumber,
  symbol: getRandomSymbol
};

// Generate password
generateBtn.addEventListener('click', () => {
  const length = +lengthEl.value;
  const hasLower = lowercaseEl.checked;
  const hasUpper = uppercaseEl.checked;
  const hasNumber = numbersEl.checked;
  const hasSymbol = symbolsEl.checked;

  resultEl.value = generatePassword(hasLower, hasUpper, hasNumber, hasSymbol, length);
  updateStrengthBar(resultEl.value);
});

// Copy password
copyBtn.addEventListener('click', () => {
  if (!resultEl.value) return;

  navigator.clipboard.writeText(resultEl.value)
    .then(() => {
      copyBtn.textContent = 'Copied!';
      setTimeout(() => {
        copyBtn.textContent = 'Copy';
      }, 2000);
    });
});

// Update length display
lengthEl.addEventListener('input', (e) => {
  document.getElementById('length-value').textContent = e.target.value;
});

// Generate password function
function generatePassword(lower, upper, number, symbol, length) {
  let generatedPassword = '';
  const typesCount = lower + upper + number + symbol;
  const typesArr = [{ lower }, { upper }, { number }, { symbol }].filter(item => Object.values(item)[0]);

  if (typesCount === 0) return '';

  for (let i = 0; i < length; i++) {
    const randomType = typesArr[Math.floor(Math.random() * typesArr.length)];
    const funcName = Object.keys(randomType)[0];
    generatedPassword += randomFunc[funcName]();
  }

  return generatedPassword;
}

// Password strength checker
function updateStrengthBar(password) {
  const strength = checkPasswordStrength(password);
  const bar = strengthBar.querySelector('::after') || strengthBar;

  strengthBar.style.setProperty('--width', strength.percentage + '%');
  strengthBar.style.setProperty('--color', strength.color);
  strengthText.textContent = strength.text;
  strengthText.style.color = strength.color;
}

function checkPasswordStrength(password) {
  let score = 0;
  
  // Length check
  if (password.length >= 12) score += 2;
  else if (password.length >= 8) score += 1;

  // Character variety
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^a-zA-Z0-9]/.test(password);

  score += hasLower + hasUpper + hasNumber + hasSymbol;

  if (score >= 5) return { percentage: 100, color: '#4CAF50', text: 'Strong' };
  if (score >= 3) return { percentage: 66, color: '#FFC107', text: 'Medium' };
  return { percentage: 33, color: '#F44336', text: 'Weak' };
}

// Generator functions
function getRandomLower() {
  return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
}

function getRandomUpper() {
  return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
}

function getRandomNumber() {
  return String.fromCharCode(Math.floor(Math.random() * 10) + 48);
}

function getRandomSymbol() {
  const symbols = '!@#$%^&*(){}[]=<>/,.';
  return symbols[Math.floor(Math.random() * symbols.length)];
}