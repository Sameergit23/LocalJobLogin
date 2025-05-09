// let currentRole = "labour";

// Show the role‐specific form section
window.showSection = function(role) {
  currentRole = role;
  document.querySelector(".role-select").style.display = "none";
  document.getElementById("formSection").style.display = "block";

  // Hide both forms, then show the signup form by default
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("signupForm").style.display = "none";

  // Show fields for the chosen role
  document.getElementById("labourFields").style.display = role === "labour" ? "block" : "none";
  document.getElementById("contractorFields").style.display = role === "contractor" ? "block" : "none";

  // Default to signup tab
  toggleTab("signup");
};

// Toggle between Login and Signup tabs
window.toggleTab = function(tab) {
  document.getElementById("loginForm").style.display  = tab === "login"  ? "block" : "none";
  document.getElementById("signupForm").style.display = tab === "signup" ? "block" : "none";
};

// Handle Signup: send form data to /register
window.handleSignup = function() {
  // Collect common fields
  let name, mobile, password;
  const form = new FormData();
  form.append("role", currentRole);

  if (currentRole === "labour") {
    name     = document.getElementById("labourName").value.trim();
    mobile   = document.getElementById("labourMobile").value.trim();
    password = document.getElementById("labourPassword").value;
    const age    = document.getElementById("labourAge").value;
    const family = document.getElementById("labourFamily").value;
    const gender = document.getElementById("labourGender").value;

    if (!name || !mobile || !password || !age || !family || !gender) {
      return alert("Please fill all Labour fields.");
    }
    form.append("name",     name);
    form.append("mobile",   mobile);
    form.append("password", password);
    form.append("age",      age);
    form.append("family",   family);
    form.append("gender",   gender);

  } else {
    name     = document.getElementById("contractorName").value.trim();
    mobile   = document.getElementById("contractorMobile").value.trim();
    password = document.getElementById("contractorPassword").value;
    const address = document.getElementById("contractorAddress").value.trim();

    if (!name || !mobile || !password || !address) {
      return alert("Please fill all Contractor fields.");
    }
    form.append("name",     name);
    form.append("mobile",   mobile);
    form.append("password", password);
    form.append("address",  address);
  }

  // Send to backend
  fetch("/register", {
    method: "POST",
    body: form
  })
  .then(res => res.json())
  .then(data => {
    if (data.error) {
      alert("Signup error: " + data.error);
    } else {
      alert(data.message);
      toggleTab("login");  // switch to login form
    }
  })
  .catch(err => {
    console.error(err);
    alert("Network error during signup");
  });
};

// Handle Login: send form data to /login
window.handleLogin = function() {
  const mobile   = document.getElementById("loginMobile").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (!mobile || !password) {
    return alert("Please enter mobile and password.");
  }

  const form = new FormData();
  form.append("role",     currentRole);
  form.append("mobile",   mobile);
  form.append("password", password);

  fetch("/login", {
    method: "POST",
    body: form
  })
  .then(res => res.json())
  .then(data => {
    if (data.error) {
      alert("Login failed: " + data.error);
    } else {
      alert(data.message);
      console.log("Logged in user:", data.user);
      // TODO: redirect or store session token here
    }
  })
  .catch(err => {
    console.error(err);
    alert("Network error during login");
  });
};