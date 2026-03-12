const loginForm = document.getElementById("loginForm");
const dashboard = document.getElementById("dashboard");
const resultDiv = document.getElementById("result");
const welcomeMessage = document.getElementById("welcomeMessage");
const roleMessage = document.getElementById("roleMessage");
const logoutBtn = document.getElementById("logoutBtn");

const adminPanel = document.getElementById("adminPanel");
const analystPanel = document.getElementById("analystPanel");
const employeePanel = document.getElementById("employeePanel");
const guestPanel = document.getElementById("guestPanel");

let users = [];
let currentUser = null;

fetch("users.json")
  .then(response => response.json())
  .then(data => {
    users = data;
  })
  .catch(error => {
    showMessage("Error loading user database.", "error");
    console.error("Failed to load users.json:", error);
  });

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  const matchedUser = users.find(
    user => user.username === username && user.password === password
  );

  if (!matchedUser) {
    showMessage("Invalid username or password.", "error");
    dashboard.classList.add("hidden");
    return;
  }

  currentUser = matchedUser;
  loginForm.classList.add("hidden");
  dashboard.classList.remove("hidden");

  welcomeMessage.textContent = `Welcome, ${currentUser.username}`;
  roleMessage.textContent = `Role: ${currentUser.role}`;

  applyRoleAccess(currentUser.role);
  showMessage("Login successful. Role-based access applied.", "success");
});

logoutBtn.addEventListener("click", function () {
  currentUser = null;
  loginForm.reset();
  loginForm.classList.remove("hidden");
  dashboard.classList.add("hidden");
  resetPanels();
  showMessage("You have been logged out.", "info");
});

function applyRoleAccess(role) {
  resetPanels();

  if (role === "Admin") {
    // Full access
    return;
  }

  if (role === "Security Analyst") {
    adminPanel.classList.add("restricted");
    employeePanel.classList.add("restricted");
    guestPanel.classList.add("restricted");
    return;
  }

  if (role === "Employee") {
    adminPanel.classList.add("restricted");
    analystPanel.classList.add("restricted");
    guestPanel.classList.add("restricted");
    return;
  }

  if (role === "Guest") {
    adminPanel.classList.add("restricted");
    analystPanel.classList.add("restricted");
    employeePanel.classList.add("restricted");
  }
}

function resetPanels() {
  adminPanel.classList.remove("restricted");
  analystPanel.classList.remove("restricted");
  employeePanel.classList.remove("restricted");
  guestPanel.classList.remove("restricted");
}

function showMessage(message, type) {
  resultDiv.textContent = message;
  resultDiv.className = `result ${type}`;
}