// Helper function to get all registered users from localStorage
function getUsers() {
  const users = localStorage.getItem("users");
  return users ? JSON.parse(users) : [];
}

// Helper function to save a new user to localStorage
function saveUser(user) {
  const users = getUsers();
  users.push(user);
  localStorage.setItem("users", JSON.stringify(users));
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

    signupForm.addEventListener("submit", (event) => {
      // Prevent the default form submit reload behavior
      event.preventDefault();

      // Retrieve form field values
      const name = document.getElementById("fullName").value.trim();
      const email = document.getElementById("email").value.trim();
      const company = document.getElementById("company").value.trim();
      const password = passwordInput.value;
      const confirmPassword = confirmPasswordInput.value;

      // Step 1: Validate passwords match
      if (password !== confirmPassword) {
        passwordError.style.display = "block";
        return;
      } else {
        passwordError.style.display = "none";
      }

      // Step 2: Attempt registration
      const isRegistered = registerUser(name, email, company, password);

      if (isRegistered) {
        alert("Registration successful! Redirecting to Sign In page.");
        // Redirect to login page
        setTimeout(() => {
          window.location.href = "index.html";
        }, 1500);
      }
    });
  }
});

const signinForm = document.getElementById("form-signin");
if (signinForm) {
  signinForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const correctEmail = document.getElementById("signinEmail").value;
    const correctPassword = document.getElementById("signinPassword").value;
    const user = localStorage.getItem("users");

    if (!user) {
      alert("მომხმარებლები არ მოიძებნა!");
      return;
    }

    const parsedUser = JSON.parse(user);

    const foundUser = parsedUser.find((item) => {
      return item.email === correctEmail && item.password === correctPassword;
    });

    if (foundUser) {
      sessionStorage.setItem("currentUserEmail", correctEmail);
      window.location.href = "dashboard.html";
    } else {
      alert("invalid email or password");
    }
  });
}


