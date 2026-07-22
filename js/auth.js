// ── 1. მოდალის დამხმარე ფუნქციები alert-ის ჩასანაცვლებლად
function showAlertModal(message, title, onOk) {
  var modal = document.getElementById("appAlertModal");
  var msgEl = document.getElementById("alertModalMessage");
  var titleEl = document.getElementById("alertModalTitle");

  if (titleEl) titleEl.textContent = title || "შეტყობინება";
  if (msgEl) msgEl.textContent = message;
  if (modal) modal.style.display = "flex";

  window.currentAlertOkCallback = onOk;
}

function closeAlertModal() {
  var modal = document.getElementById("appAlertModal");
  if (modal) modal.style.display = "none";
  if (typeof window.currentAlertOkCallback === "function") {
    window.currentAlertOkCallback();
    window.currentAlertOkCallback = null;
  }
}

// ── 2. LocalStorage-ში მომხმარებლების წაკითხვა და შენახვა
function getUsers() {
  var usersData = localStorage.getItem("crm_users");
  return usersData ? JSON.parse(usersData) : [];
}

function saveUser(newUser) {
  var users = getUsers();
  users.push(newUser);
  localStorage.setItem("crm_users", JSON.stringify(users));
}

// ── 3. რეგისტრაციის ლოგიკა
function registerUser(name, email, company, password) {
  var users = getUsers();

  for (var i = 0; i < users.length; i++) {
    if (users[i].email === email) {
      showAlertModal("ამ ელ-ფოსტით ანგარიში უკვე არსებობს!");
      return false;
    }
  }

  var newUser = {
    name: name,
    email: email,
    company: company,
    password: password,
    createdAt: new Date().toISOString()
  };

  saveUser(newUser);
  return true;
}

// ── 4. გვერდის ჩატვირთვა და ფორმების მართვა
document.addEventListener("DOMContentLoaded", function () {
  var signupForm = document.getElementById("signupForm");
  var signinForm = document.getElementById("form-signin");

  // Sign Up ფორმა
  if (signupForm) {
    signupForm.addEventListener("submit", function (event) {
      event.preventDefault();

      var name = document.getElementById("fullName").value.trim();
      var email = document.getElementById("email").value.trim();
      var company = document.getElementById("company").value.trim();
      var password = document.getElementById("password").value;
      var confirmPassword = document.getElementById("confirmPassword").value;

      if (password.length < 6) {
        showAlertModal("პაროლი უნდა იყოს სულ მცირე 6 სიმბოლო!");
        return;
      }

      if (password !== confirmPassword) {
        showAlertModal("პაროლები ერთმანეთს არ ემთხვევა!");
        return;
      }

      var success = registerUser(name, email, company, password);
      if (success) {
        showAlertModal("რეგისტრაცია წარმატებით დასრულდა!", "წარმატება", function () {
          window.location.href = "index.html";
        });
      }
    });
  }

  // Sign In ფორმა
  if (signinForm) {
    signinForm.addEventListener("submit", function (event) {
      event.preventDefault();

      var email = document.getElementById("signinEmail").value.trim();
      var password = document.getElementById("signinPassword").value;
      var users = getUsers();

      if (users.length === 0) {
        // თუ პირველად შედის და მომხმარებლები არ არიან, შევქმნათ default დემო მომხმარებელი
        var defaultUser = {
          name: "Demo User",
          email: email,
          company: "CRM Corp",
          password: password,
          createdAt: new Date().toISOString()
        };
        saveUser(defaultUser);
        sessionStorage.setItem("crm_session", email);
        window.location.href = "dashboard.html";
        return;
      }

      var foundUser = null;
      for (var i = 0; i < users.length; i++) {
        if (users[i].email === email && users[i].password === password) {
          foundUser = users[i];
          break;
        }
      }

      if (foundUser) {
        sessionStorage.setItem("crm_session", email);
        window.location.href = "dashboard.html";
      } else {
        showAlertModal("არასწორი ელ-ფოსტა ან პაროლი!");
      }
    });
  }
});