// ── 1. მოდალის დამხმარე ფუნქციები alert-ის ჩასანაცვლებლად
function showAlertModal(message, title, onOk) {
  const modal = document.getElementById("appAlertModal");
  const msgEl = document.getElementById("alertModalMessage");
  const titleEl = document.getElementById("alertModalTitle");

  if (titleEl) titleEl.textContent = title || "შეტყობინება";
  if (msgEl) msgEl.innerHTML = message;
  if (modal) modal.style.display = "flex";

  window.currentAlertOkCallback = onOk;
}

function closeAlertModal() {
  const modal = document.getElementById("appAlertModal");
  if (modal) modal.style.display = "none";
  if (typeof window.currentAlertOkCallback === "function") {
    const callback = window.currentAlertOkCallback;
    window.currentAlertOkCallback = null;
    callback();
  }
}

// ── 2. LocalStorage-ში მომხმარებლების წაკითხვა და შენახვა
function getUsers() {
  const usersData = localStorage.getItem("crm_users");
  return usersData ? JSON.parse(usersData) : [];
}

function saveUser(newUser) {
  const users = getUsers();
  users.push(newUser);
  localStorage.setItem("crm_users", JSON.stringify(users));
}

// ── 3. DRY ინფუთების შეცდომების მართვის ფუნქციები ──
function setFieldError(inputId, message) {
  const inputEl = typeof inputId === "string" ? document.getElementById(inputId) : inputId;
  if (!inputEl) return;

  inputEl.classList.add("input-error");

  const formGroup = inputEl.closest(".form-group");
  if (!formGroup) return;

  let errorEl = formGroup.querySelector(".field-error-msg");
  if (!errorEl) {
    errorEl = document.createElement("small");
    errorEl.className = "field-error-msg";
    formGroup.appendChild(errorEl);
  }

  errorEl.textContent = message;
  errorEl.classList.add("visible");
  errorEl.style.display = "flex";
}

function clearFormErrors(formEl) {
  if (!formEl) return;

  const errorInputs = formEl.querySelectorAll(".input-error");
  errorInputs.forEach(input => input.classList.remove("input-error"));

  const errorMsgs = formEl.querySelectorAll(".field-error-msg");
  errorMsgs.forEach(msg => {
    msg.classList.remove("visible");
    msg.style.display = "none";
    msg.textContent = "";
  });
}

function setupInputClearOnError(formEl) {
  if (!formEl) return;
  const inputs = formEl.querySelectorAll(".form-control");
  inputs.forEach(input => {
    input.addEventListener("input", function () {
      if (input.classList.contains("input-error")) {
        input.classList.remove("input-error");
        const formGroup = input.closest(".form-group");
        if (formGroup) {
          const errorEl = formGroup.querySelector(".field-error-msg");
          if (errorEl) {
            errorEl.classList.remove("visible");
            errorEl.style.display = "none";
            errorEl.textContent = "";
          }
        }
      }
    });
  });
}

// ── 4. პაროლის სირთულის შემოწმება (მინიმუმ 8 სიმბოლო, 1 დიდი ასო, 1 ციფრი) ──
function validatePasswordRequirements(password) {
  if (!password || password.length < 8) {
    return "პაროლი უნდა იყოს სულ მცირე 8 სიმბოლო.";
  }
  if (!/[A-Z]/.test(password)) {
    return "პაროლი უნდა შეიცავდეს სულ მცირე 1 დიდ ასოს (A-Z).";
  }
  if (!/[0-9]/.test(password)) {
    return "პაროლი უნდა შეიცავდეს სულ მცირე 1 ციფრს (0-9).";
  }
  return null;
}

// ── 5. გვერდის ჩატვირთვა და ფორმების მართვა
document.addEventListener("DOMContentLoaded", function () {
  const signupForm = document.getElementById("signupForm");
  const signinForm = document.getElementById("form-signin");

  if (signupForm) setupInputClearOnError(signupForm);
  if (signinForm) setupInputClearOnError(signinForm);



  // Sign Up ფორმა — ინლაინ შეცდომების გამოჩენა ყოველი ინფუთის დაბლა
  if (signupForm) {
    signupForm.addEventListener("submit", function (event) {
      event.preventDefault();

      clearFormErrors(signupForm);

      const name = document.getElementById("fullName").value.trim();
      const email = document.getElementById("email").value.trim();
      const company = document.getElementById("company").value.trim();
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      let hasError = false;

      // 1. სრული სახელი — არანაკლებ 3 ასო
      if (!name || name.length < 3) {
        setFieldError("fullName", "სრული სახელი უნდა შეიცავდეს არანაკლებ 3 ასოს.");
        hasError = true;
      }

      // 2. ელ-ფოსტის შემოწმება
      if (!email || !email.includes("@")) {
        setFieldError("email", "გთხოვთ მიუთითოთ ვალიდური ელ-ფოსტის მისამართი.");
        hasError = true;
      } else {
        const users = getUsers();
        const emailExists = users.some(u => u.email === email);
        if (emailExists) {
          setFieldError("email", "ამ ელ-ფოსტით ანგარიში უკვე არსებობს.");
          hasError = true;
        }
      }

      // 3. კომპანიის სახელი
      if (!company) {
        setFieldError("company", "გთხოვთ მიუთითოთ კომპანიის სახელი.");
        hasError = true;
      }

      // 4. პაროლის სიგრძე და სირთულე (8+ სიმბოლო, 1 დიდი ასო, 1 ციფრი)
      const passError = validatePasswordRequirements(password);
      if (passError) {
        setFieldError("password", passError);
        hasError = true;
      }

      // 5. პაროლების თანხვედრა
      if (password !== confirmPassword) {
        setFieldError("confirmPassword", "პაროლები ერთმანეთს არ ემთხვევა.");
        hasError = true;
      }

      if (hasError) return;

      // თუ შეცდომა არ არის — ვინახავთ მომხმარებელს
      const newUser = {
        name: name,
        email: email,
        company: company,
        password: password,
        createdAt: new Date().toISOString(),
      };

      saveUser(newUser);

      showAlertModal(
        "რეგისტრაცია წარმატებით დასრულდა! გადადიხართ ავტორიზაციის გვერდზე...",
        "წარმატება"
      );

      setTimeout(function () {
        closeAlertModal();
        window.location.href = "index.html";
      }, 1500);
    });
  }

  // Sign In ფორმა — არასწორი მონაცემებისას მოდალის გამოჩენა
  if (signinForm) {
    signinForm.addEventListener("submit", function (event) {
      event.preventDefault();

      clearFormErrors(signinForm);

      const emailInput = document.getElementById("signinEmail");
      const passwordInput = document.getElementById("signinPassword");

      const email = emailInput ? emailInput.value.trim() : "";
      const password = passwordInput ? passwordInput.value : "";

      if (!email || !email.includes("@")) {
        setFieldError("signinEmail", "გთხოვთ მიუთითოთ ვალიდური ელ-ფოსტის მისამართი.");
        showAlertModal("გთხოვთ მიუთითოთ ვალიდური ელ-ფოსტის მისამართი!", "ავტორიზაციის შეცდომა");
        return;
      }

      if (!password) {
        setFieldError("signinPassword", "გთხოვთ მიუთითოთ პაროლი.");
        showAlertModal("გთხოვთ მიუთითოთ პაროლი!", "ავტორიზაციის შეცდომა");
        return;
      }

      const users = getUsers();
      const foundUser = users.find(u => u.email === email && u.password === password);

      if (foundUser) {
        sessionStorage.setItem("crm_session", email);
        window.location.href = "dashboard.html";
      } else {
        setFieldError("signinEmail", "არასწორი ელ-ფოსტა ან პაროლი!");
        setFieldError("signinPassword", "არასწორი ელ-ფოსტა ან პაროლი!");
        showAlertModal("არასწორი ელ-ფოსტა ან პაროლი!", "ავტორიზაციის შეცდომა");
      }
    });
  }
});

// მოდალების დახურვა ბექგრაუნდზე (overlay) დაკლიკებისას
window.addEventListener("click", function (event) {
  const alertModal = document.getElementById("appAlertModal");
  if (event.target === alertModal) {
    closeAlertModal();
  }
});
