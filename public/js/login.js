const API_URL = '';

const form = document.getElementById('loginForm');
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
  if (!passwordInput.value) {
    passwordError.classList.remove('hidden');
  } else {
    passwordError.classList.add('hidden');
  }
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!validateEmail(email)) {
    emailError.classList.remove('hidden');
    showToast('Invalid email format', 'error');
    return;
  }

  if (!password) {
    passwordError.classList.remove('hidden');
    showToast('Password is required', 'error');
    return;
  }

  submitBtn.disabled = true;
  btnText.textContent = 'Logging in...';
  spinner.classList.remove('hidden');

  try {
    const response = await fetch(`/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('userName', data.user.name);
      showToast('Login successful!', 'success');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 800);
    } else {
      showToast(data.error || 'Login failed', 'error');
      submitBtn.disabled = false;
      btnText.textContent = 'Login';
      spinner.classList.add('hidden');
    }
  } catch (error) {
    showToast('Network error. Please try again.', 'error');
    submitBtn.disabled = false;
    btnText.textContent = 'Login';
    spinner.classList.add('hidden');
  }
});
