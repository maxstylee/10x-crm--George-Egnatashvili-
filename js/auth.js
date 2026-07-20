// Helper function to get all registered users from localStorage
function getUsers() {
  const users = localStorage.getItem("crm_users");
  return users ? JSON.parse(users) : [];
}

// Helper function to save a new user to localStorage
function saveUser(user) {
  const users = getUsers();
  users.push(user);
  localStorage.setItem("crm_users", JSON.stringify(users));
}

// Main function to handle user registration
function registerUser(name, email, company, password) {
  const users = getUsers();

  // Check if a user with the same email already exists
  const userExists = users.some((user) => user.email === email);
  if (userExists) {
    alert("An account with this email already exists!");
    return false;
  }

  // Create the new user object
  const newUser = {
    name: name,
    email: email,
    company: company,
    password: password, // In a production app, never store plain text passwords!
    createdAt: new Date().toISOString(),
  };

  // Store in localStorage
  saveUser(newUser);
  return true;
}

// DOM Setup and Submission logic
document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");

  if (signupForm) {
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const passwordError = document.getElementById("passwordError");


    // --- REAL-TIME PASSWORD VALIDATION ---
    function validatePasswordsRealtime() {
      const password = passwordInput.value;
      const confirmPassword = confirmPasswordInput.value;

      // ველი ცარიელია — გადავამზადოთ ყველაფერი
      if (!password) {
        passwordError.classList.remove("visible", "error-weak", "error-medium", "error-strong");
        passwordInput.classList.remove("input-weak", "input-medium", "input-strong");
        return true;
      }

      // ეტაპი 1: სიგრძის შემოწმება
      if (password.length < 8) {
        showError("Password must be at least 8 characters long.", "weak");
        setStrength(1);
        return false;
      }

      // ეტაპი 2: დიდი ასოს შემოწმება
      if (!/[A-Z]/.test(password)) {
        showError("Password must contain at least one uppercase letter.", "medium");
        setStrength(2);
        return false;
      }

      // ეტაპი 3: ციფრის შემოწმება
      if (!/[0-9]/.test(password)) {
        showError("Password must contain at least one number.", "medium");
        setStrength(2);
        return false;
      }

      // ძლიერი პაროლი — შევამოწმოთ confirm
      setStrength(3);

      if (confirmPassword && password !== confirmPassword) {
        showError("Passwords do not match!", "weak");
        return false;
      }

      // ყველაფერი კარგია
      showError("Strong password! ✓", "strong");
      return true;
    }

    function showError(message, level) {
      passwordError.textContent = message;
      // visibility ცვლის display-ის მაგივრად — layout არ ძვრება
      passwordError.classList.add("visible");
      passwordError.classList.remove("error-weak", "error-medium", "error-strong");
      passwordError.classList.add("error-" + level);
    }

    function setStrength(level) {
      // border ფერი პირდაპირ input-ზე
      passwordInput.classList.remove("input-weak", "input-medium", "input-strong");
      if (level === 1) passwordInput.classList.add("input-weak");
      if (level === 2) passwordInput.classList.add("input-medium");
      if (level === 3) passwordInput.classList.add("input-strong");
    }

    // მოვუსმინოთ კრეფის პროცესს რეალურ დროში
    passwordInput.addEventListener("input", validatePasswordsRealtime);
    confirmPasswordInput.addEventListener("input", validatePasswordsRealtime);

    // --- SUBMIT EVENT ---
    signupForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = document.getElementById("fullName").value.trim();
      const email = document.getElementById("email").value.trim();
      const company = document.getElementById("company").value.trim();
      const password = passwordInput.value;

      // საბოლოო შემოწმება გაგზავნამდე
      if (!validatePasswordsRealtime()) {
        return;
      }

      // Attempt registration
      const isRegistered = registerUser(name, email, company, password);

      if (isRegistered) {
        alert("Registration successful! Redirecting to Sign In page.");
        setTimeout(() => {
          window.location.href = "index.html";
        }, 1500);
      }
    });
  }
});

// Sign In Logic
const signinForm = document.getElementById("form-signin");
if (signinForm) {
  signinForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const correctEmail = document.getElementById("signinEmail").value;
    const correctPassword = document.getElementById("signinPassword").value;
    const users = getUsers(); // გამოვიყენოთ უკვე შექმნილი ფუნქცია

    if (users.length === 0) {
      alert("მომხმარებლები არ მოიძებნა!");
      return;
    }

    const foundUser = users.find((item) => {
      return item.email === correctEmail && item.password === correctPassword;
    });

    if (foundUser) {
      sessionStorage.setItem("crm_session", correctEmail);
      window.location.href = "dashboard.html";
    } else {
      alert("Invalid email or password");
    }
  });
}