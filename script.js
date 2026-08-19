// 1. DYNAMIC INPUT HANDLERS FOR COVER LETTER
const nameInput = document.getElementById('nameInput');
const companyInput = document.getElementById('companyInput');
const roleInput = document.getElementById('roleInput');

const authorNameTarget = document.getElementById('authorNameTarget');
const signatureNameTarget = document.getElementById('signatureNameTarget');
const companyTarget = document.getElementById('companyTarget');
const companyTargetRepeat = document.getElementById('companyTargetRepeat');
const roleTarget = document.getElementById('roleTarget');

if (nameInput) {
  nameInput.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    const text = val.length > 0 ? val : 'Ali Naser';
    if (authorNameTarget) authorNameTarget.textContent = text.toUpperCase();
    if (signatureNameTarget) signatureNameTarget.textContent = text;
  });
}

if (companyInput) {
  companyInput.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    const text = val.length > 0 ? val : 'Cisco';
    if (companyTarget) companyTarget.textContent = text;
    if (companyTargetRepeat) companyTargetRepeat.textContent = text;
  });
}

if (roleInput) {
  roleInput.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    const text = val.length > 0 ? val : 'Junior Network Administrator';
    if (roleTarget) roleTarget.textContent = text;
  });
}

// 2. COPY LETTER BUTTON
const copyBtn = document.getElementById('copyBtn');
if (copyBtn) {
  copyBtn.addEventListener('click', () => {
    const letterText = document.getElementById('letterDoc').innerText;
    navigator.clipboard.writeText(letterText).then(() => {
      const originalText = copyBtn.textContent;
      copyBtn.textContent = 'Copied!';
      setTimeout(() => { copyBtn.textContent = originalText; }, 2000);
    });
  });
}

// 3. PRINT / SAVE PDF BUTTON
const printBtn = document.getElementById('printBtn');
if (printBtn) {
  printBtn.addEventListener('click', () => {
    window.print();
  });
}

// 4. SCROLL REVEAL OBSERVER
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, { threshold: 0.1 });
revealElements.forEach(el => revealObserver.observe(el));