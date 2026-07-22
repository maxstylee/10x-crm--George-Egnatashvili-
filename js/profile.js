// ── 1. მოდალის ფუნქცია alert-ის ჩასანაცვლებლად
function showAlertModal(message, title) {
  var modal = document.getElementById("appAlertModal");
  var msgEl = document.getElementById("alertModalMessage");
  var titleEl = document.getElementById("alertModalTitle");

  if (titleEl) titleEl.textContent = title || "შეტყობინება";
  if (msgEl) msgEl.textContent = message;
  if (modal) modal.style.display = "flex";
}

function closeAlertModal() {
  var modal = document.getElementById("appAlertModal");
  if (modal) modal.style.display = "none";
}

// ── 2. პროფილის მონაცემების ჩატვირთვა
function loadProfileInfo() {
  var currentEmail = sessionStorage.getItem("crm_session");
  var usersData = localStorage.getItem("crm_users");
  var users = usersData ? JSON.parse(usersData) : [];

  var currentUser = null;
  for (var i = 0; i < users.length; i++) {
    if (users[i].email === currentEmail) {
      currentUser = users[i];
      break;
    }
  }

  var nameEl = document.getElementById("profileName");
  var emailEl = document.getElementById("profileEmail");
  var companyEl = document.getElementById("profileCompany");

  if (currentUser) {
    if (nameEl) nameEl.value = currentUser.name || "User";
    if (emailEl) emailEl.value = currentUser.email || "";
    if (companyEl) companyEl.value = currentUser.company || "CRM User";
  } else {
    if (nameEl) nameEl.value = "Guest User";
    if (emailEl) emailEl.value = currentEmail || "guest@crm.com";
    if (companyEl) companyEl.value = "10X CRM";
  }
}

// ── 3. პროფილის რედაქტირების მოდალი
function openEditProfileModal() {
  var nameEl = document.getElementById("profileName");
  var companyEl = document.getElementById("profileCompany");

  var editNameEl = document.getElementById("editProfileName");
  var editCompanyEl = document.getElementById("editProfileCompany");

  if (editNameEl && nameEl) editNameEl.value = nameEl.value;
  if (editCompanyEl && companyEl) editCompanyEl.value = companyEl.value;

  var modal = document.getElementById("editProfileModal");
  if (modal) modal.style.display = "flex";
}

function closeEditProfileModal() {
  var modal = document.getElementById("editProfileModal");
  if (modal) modal.style.display = "none";
}

function saveProfileEdits(event) {
  event.preventDefault();

  var newName = document.getElementById("editProfileName").value.trim();
  var newCompany = document.getElementById("editProfileCompany").value.trim();

  if (!newName) {
    showAlertModal("გთხოვთ მიუთითოთ სახელი!");
    return;
  }

  var currentEmail = sessionStorage.getItem("crm_session");
  var usersData = localStorage.getItem("crm_users");
  var users = usersData ? JSON.parse(usersData) : [];

  var currentUser = null;
  for (var i = 0; i < users.length; i++) {
    if (users[i].email === currentEmail) {
      currentUser = users[i];
      break;
    }
  }

  if (currentUser) {
    currentUser.name = newName;
    currentUser.company = newCompany;
    localStorage.setItem("crm_users", JSON.stringify(users));
  }

  loadProfileInfo();
  closeEditProfileModal();
  showAlertModal("პროფილის მონაცემები წარმატებით განახლდა!", "წარმატება");
}

// ── 4. პაროლის სირთულის ვალიდაცია (8 სიმბოლო, 1 დიდი ასო, 1 ციფრი)
function validatePasswordStrength(newPassword, confirmPassword) {
  var errorEl = document.getElementById("profilePasswordError");

  if (!newPassword) {
    if (errorEl) errorEl.classList.remove("visible");
    return true;
  }

  // 1. სიგრძის შემოწმება (მინიმუმ 8 სიმბოლო)
  if (newPassword.length < 8) {
    showPasswordError("პაროლი უნდა იყოს სულ მცირე 8 სიმბოლო!", "weak");
    return false;
  }

  // 2. დიდი ასოს შემოწმება (A-Z)
  if (!/[A-Z]/.test(newPassword)) {
    showPasswordError("პაროლი უნდა შეიცავდეს სულ მცირე 1 დიდ ასოს (A-Z)!", "medium");
    return false;
  }

  // 3. ციფრის შემოწმება (0-9)
  if (!/[0-9]/.test(newPassword)) {
    showPasswordError("პაროლი უნდა შეიცავდეს სულ მცირე 1 ციფრს (0-9)!", "medium");
    return false;
  }

  // 4. პაროლების თანხვედრა
  if (confirmPassword && newPassword !== confirmPassword) {
    showPasswordError("ახალი პაროლები ერთმანეთს არ ემთხვევა!", "weak");
    return false;
  }

  showPasswordError("ძლიერი პაროლი! ✓", "strong");
  return true;
}

function showPasswordError(message, level) {
  var errorEl = document.getElementById("profilePasswordError");
  if (!errorEl) return;

  errorEl.textContent = message;
  errorEl.classList.add("visible");
  errorEl.classList.remove("error-weak", "error-medium", "error-strong");
  errorEl.classList.add("error-" + level);
}

// ── 5. პაროლის შეცვლა
function changePassword(event) {
  event.preventDefault();

  var currentPassword = document.getElementById("currentPassword").value;
  var newPassword = document.getElementById("newPassword").value;
  var confirmNewPassword = document.getElementById("confirmNewPassword").value;

  // სირთულის შემოწმება
  if (!validatePasswordStrength(newPassword, confirmNewPassword)) {
    return;
  }

  var currentEmail = sessionStorage.getItem("crm_session");
  var usersData = localStorage.getItem("crm_users");
  var users = usersData ? JSON.parse(usersData) : [];

  var currentUser = null;
  for (var i = 0; i < users.length; i++) {
    if (users[i].email === currentEmail) {
      currentUser = users[i];
      break;
    }
  }

  if (!currentUser) {
    showAlertModal("მომხმარებელი ვერ მოიძებნა!");
    return;
  }

  if (currentUser.password !== currentPassword) {
    showAlertModal("მიმდინარე პაროლი არასწორია!");
    return;
  }

  currentUser.password = newPassword;
  localStorage.setItem("crm_users", JSON.stringify(users));

  showAlertModal("პაროლი წარმატებით შეიცვალა!", "წარმატება");
  document.getElementById("changePasswordForm").reset();

  var errorEl = document.getElementById("profilePasswordError");
  if (errorEl) errorEl.classList.remove("visible");
}

// ── 6. ინიციალიზაცია ჩატვირთვისას
document.addEventListener("DOMContentLoaded", function () {
  loadProfileInfo();

  var newPassInput = document.getElementById("newPassword");
  var confirmPassInput = document.getElementById("confirmNewPassword");

  if (newPassInput && confirmPassInput) {
    newPassInput.addEventListener("input", function () {
      validatePasswordStrength(newPassInput.value, confirmPassInput.value);
    });
    confirmPassInput.addEventListener("input", function () {
      validatePasswordStrength(newPassInput.value, confirmPassInput.value);
    });
  }
});

window.addEventListener("click", function (event) {
  var editProfileModal = document.getElementById("editProfileModal");
  var alertModal = document.getElementById("appAlertModal");

  if (event.target === editProfileModal) closeEditProfileModal();
  if (event.target === alertModal) closeAlertModal();
});
