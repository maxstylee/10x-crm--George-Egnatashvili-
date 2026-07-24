// ── 1. მოდალის ფუნქცია alert-ის ჩასანაცვლებლად
function showAlertModal(message, title) {
  const modal = document.getElementById("appAlertModal");
  const msgEl = document.getElementById("alertModalMessage");
  const titleEl = document.getElementById("alertModalTitle");

  if (titleEl) titleEl.textContent = title || "შეტყობინება";
  if (msgEl) msgEl.textContent = message;
  if (modal) modal.style.display = "flex";
}

function closeAlertModal() {
  const modal = document.getElementById("appAlertModal");
  if (modal) modal.style.display = "none";
}

// ── 2. პროფილის მონაცემების ჩატვირთვა
function loadProfileInfo() {
  const currentEmail = sessionStorage.getItem("crm_session");
  const usersData = localStorage.getItem("crm_users");
  const users = usersData ? JSON.parse(usersData) : [];

  let currentUser = null;
  for (let i = 0; i < users.length; i++) {
    if (users[i].email === currentEmail) {
      currentUser = users[i];
      break;
    }
  }

  const nameEl = document.getElementById("profileName");
  const emailEl = document.getElementById("profileEmail");
  const phoneEl = document.getElementById("profilePhone");
  const companyEl = document.getElementById("profileCompany");

  if (currentUser) {
    if (nameEl) nameEl.value = currentUser.name || "User";
    if (emailEl) emailEl.value = currentUser.email || "";
    if (phoneEl) phoneEl.value = currentUser.phone || "";
    if (companyEl) companyEl.value = currentUser.company || "CRM User";
  } else {
    if (nameEl) nameEl.value = "Guest User";
    if (emailEl) emailEl.value = currentEmail || "guest@crm.com";
    if (phoneEl) phoneEl.value = "";
    if (companyEl) companyEl.value = "10X CRM";
  }
}

// ── 3. პროფილის რედაქტირების მოდალი (ტელეფონის ნომრით)
function openEditProfileModal() {
  const nameEl = document.getElementById("profileName");
  const phoneEl = document.getElementById("profilePhone");
  const companyEl = document.getElementById("profileCompany");

  const editNameEl = document.getElementById("editProfileName");
  const editPhoneEl = document.getElementById("editProfilePhone");
  const editCompanyEl = document.getElementById("editProfileCompany");

  if (editNameEl && nameEl) editNameEl.value = nameEl.value;
  if (editPhoneEl && phoneEl) editPhoneEl.value = phoneEl.value;
  if (editCompanyEl && companyEl) editCompanyEl.value = companyEl.value;

  const modal = document.getElementById("editProfileModal");
  if (modal) modal.style.display = "flex";
}

function closeEditProfileModal() {
  const modal = document.getElementById("editProfileModal");
  if (modal) modal.style.display = "none";
}

function saveProfileEdits(event) {
  event.preventDefault();

  const newName = document.getElementById("editProfileName").value.trim();
  const newPhone = document.getElementById("editProfilePhone") ? document.getElementById("editProfilePhone").value.trim() : "";
  const newCompany = document.getElementById("editProfileCompany").value.trim();

  if (!newName || newName.length < 3) {
    showAlertModal("სრული სახელი უნდა შეიცავდეს მინიმუმ 3 ასოს!");
    return;
  }

  const currentEmail = sessionStorage.getItem("crm_session");
  const usersData = localStorage.getItem("crm_users");
  const users = usersData ? JSON.parse(usersData) : [];

  let currentUser = null;
  for (let i = 0; i < users.length; i++) {
    if (users[i].email === currentEmail) {
      currentUser = users[i];
      break;
    }
  }

  if (currentUser) {
    currentUser.name = newName;
    currentUser.phone = newPhone;
    currentUser.company = newCompany;
    localStorage.setItem("crm_users", JSON.stringify(users));
  }

  loadProfileInfo();
  closeEditProfileModal();
  showAlertModal("პროფილის მონაცემები წარმატებით განახლდა!", "წარმატება");
}

// ── 4. პაროლის სირთულის ვალიდაცია
function validatePasswordStrength(newPassword, confirmPassword) {
  const errorEl = document.getElementById("profilePasswordError");

  if (!newPassword) {
    if (errorEl) errorEl.classList.remove("visible");
    return true;
  }

  if (newPassword.length < 8) {
    showPasswordError("პაროლი უნდა იყოს სულ მცირე 8 სიმბოლო!", "weak");
    return false;
  }

  if (!/[A-Z]/.test(newPassword)) {
    showPasswordError("პაროლი უნდა შეიცავდეს სულ მცირე 1 დიდ ასოს (A-Z)!", "medium");
    return false;
  }

  if (!/[0-9]/.test(newPassword)) {
    showPasswordError("პაროლი უნდა შეიცავდეს სულ მცირე 1 ციფრს (0-9)!", "medium");
    return false;
  }

  if (confirmPassword && newPassword !== confirmPassword) {
    showPasswordError("ახალი პაროლები ერთმანეთს არ ემთხვევა!", "weak");
    return false;
  }

  showPasswordError("ძლიერი პაროლი! ✓", "strong");
  return true;
}

function showPasswordError(message, level) {
  const errorEl = document.getElementById("profilePasswordError");
  if (!errorEl) return;

  errorEl.textContent = message;
  errorEl.classList.add("visible");
  errorEl.classList.remove("error-weak", "error-medium", "error-strong");
  errorEl.classList.add("error-" + level);
}

// ── 5. პაროლის შეცვლა
function changePassword(event) {
  event.preventDefault();

  const currentPassword = document.getElementById("currentPassword").value;
  const newPassword = document.getElementById("newPassword").value;
  const confirmNewPassword = document.getElementById("confirmNewPassword").value;

  if (!validatePasswordStrength(newPassword, confirmNewPassword)) {
    return;
  }

  const currentEmail = sessionStorage.getItem("crm_session");
  const usersData = localStorage.getItem("crm_users");
  const users = usersData ? JSON.parse(usersData) : [];

  let currentUser = null;
  for (let i = 0; i < users.length; i++) {
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

  const errorEl = document.getElementById("profilePasswordError");
  if (errorEl) errorEl.classList.remove("visible");
}

// ── 6. ინიციალიზაცია ჩატვირთვისას
document.addEventListener("DOMContentLoaded", function () {
  loadProfileInfo();

  const newPassInput = document.getElementById("newPassword");
  const confirmPassInput = document.getElementById("confirmNewPassword");

  if (newPassInput && confirmPassInput) {
    newPassInput.addEventListener("input", function () {
      validatePasswordStrength(newPassInput.value, confirmPassInput.value);
    });
    confirmPassInput.addEventListener("input", function () {
      validatePasswordStrength(newPassInput.value, confirmPassInput.value);
    });
  }

  const editPhoneInput = document.getElementById("editProfilePhone");
  if (editPhoneInput) {
    editPhoneInput.addEventListener("input", function (e) {
      e.target.value = e.target.value.replace(/[^0-9+\s\-()]/g, "");
    });
  }
});

// მოდალის დახურვა ბექგრაუნდზე დაკლიკებისას
window.addEventListener("click", function (event) {
  const editProfileModal = document.getElementById("editProfileModal");
  const alertModal = document.getElementById("appAlertModal");

  if (event.target === editProfileModal) closeEditProfileModal();
  if (event.target === alertModal) closeAlertModal();
});
