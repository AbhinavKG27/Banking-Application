const registerTab = document.getElementById('registerTab');
const loginTab = document.getElementById('loginTab');
const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const message = document.getElementById('message');

const setTab = (tab) => {
  const registerActive = tab === 'register';
  registerTab.classList.toggle('active', registerActive);
  loginTab.classList.toggle('active', !registerActive);
  registerForm.classList.toggle('active', registerActive);
  loginForm.classList.toggle('active', !registerActive);
  message.textContent = '';
};

registerTab.addEventListener('click', () => setTab('register'));
loginTab.addEventListener('click', () => setTab('login'));

registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const payload = {
    uid: document.getElementById('regUid').value.trim(),
    username: document.getElementById('regUsername').value.trim(),
    email: document.getElementById('regEmail').value.trim(),
    phone: document.getElementById('regPhone').value.trim(),
    password: document.getElementById('regPassword').value,
    role: 'Customer',
  };

  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  message.textContent = data.message;

  if (response.ok) {
    registerForm.reset();
    setTab('login');
  }
});

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const payload = {
    username: document.getElementById('loginUsername').value.trim(),
    password: document.getElementById('loginPassword').value,
  };

  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  message.textContent = data.message;

  if (response.ok) {
    window.location.href = '/userdashboard.html';
  }
});
