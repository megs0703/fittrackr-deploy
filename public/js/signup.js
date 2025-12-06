const API_URL = '';

const form = document.getElementById('signupForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.getElementById('btnText');
const spinner = document.getElementById('spinner');

function showToast(message, type) {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

emailInput.addEventListener('blur', () => {
  if (emailInput.value && !validateEmail(emailInput.value)) {
    emailError.classList.remove('hidden');
  } else {
    emailError.classList.add('hidden');
  }
});

passwordInput.addEventListener('blur', () => {
  if (passwordInput.value && passwordInput.value.length < 6) {
    passwordError.classList.remove('hidden');
  } else {
    passwordError.classList.add('hidden');
  }
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!name) {
    showToast('Name is required', 'error');
    return;
  }

  if (!validateEmail(email)) {
    emailError.classList.remove('hidden');
    showToast('Invalid email format', 'error');
    return;
  }

  if (password.length < 6) {
    passwordError.classList.remove('hidden');
    showToast('Password must be at least 6 characters', 'error');
    return;
  }

  submitBtn.disabled = true;
  btnText.textContent = 'Signing up...';
  spinner.classList.remove('hidden');

  try {
    const response = await fetch(`/api/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();

    if (response.ok) {
      showToast('Account created successfully!', 'success');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1500);
    } else {
      showToast(data.error || 'Signup failed', 'error');
      submitBtn.disabled = false;
      btnText.textContent = 'Sign Up';
      spinner.classList.add('hidden');
    }
  } catch (error) {
    showToast('Network error. Please try again.', 'error');
    submitBtn.disabled = false;
    btnText.textContent = 'Sign Up';
    spinner.classList.add('hidden');
  }
});
