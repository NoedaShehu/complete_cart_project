
// Login
document.getElementById('loginBtn')?.addEventListener('click', async (e) => {
  e.preventDefault();

  const email = document.getElementById('loginemail').value;
  const password = document.getElementById('loginpassword').value;

  try {
    const res = await fetch('http://localhost:5000/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok && data.success) {
      localStorage.setItem('userId', data.userId);
      window.location.href =  "/projekt/home_page/Home.html"; // ✅ Change path if needed
    }

  } catch (error) {
    // Silent fail
  }
});

// Register
document.getElementById('registerBtn')?.addEventListener('click', async (e) => {
  e.preventDefault();

  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (password !== confirmPassword) {
    document.getElementById('error').innerText = 'Passwords do not match!';
    return;
  }

  const res = await fetch('http://localhost:5000/api/users/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await res.text();
  // Silent on registration too
});
