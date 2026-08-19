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
    const text = val.length > 0 ? val : 'Ahmad El Samadi';
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

// 4. SCROLL PROGRESS BAR (GPU ScaleX)
let isScrolling = false;

function updateScrollProgress() {
  const winScroll = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const progress = height > 0 ? winScroll / height : 0;
  
  const progressBar = document.getElementById('progressBar');
  if (progressBar) {
    progressBar.style.transform = `scaleX(${progress})`;
  }
  isScrolling = false;
}

window.addEventListener('scroll', () => {
  if (!isScrolling) {
    window.requestAnimationFrame(updateScrollProgress);
    isScrolling = true;
  }
});

window.addEventListener('DOMContentLoaded', updateScrollProgress);
