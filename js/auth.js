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

// ── 3. გვერდის ჩატვირთვა და ფორმების მართვა
document.addEventListener("DOMContentLoaded", function () {
  const signupForm = document.getElementById("signupForm");
  const signinForm = document.getElementById("form-signin");

  // Sign Up ფორმა — ყველა ველის ერთდროული ვალიდაცია
  if (signupForm) {
    signupForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const name = document.getElementById("fullName").value.trim();
      const email = document.getElementById("email").value.trim();
      const company = document.getElementById("company").value.trim();
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      // შეცდომების შეგროვება მასივში (ყველა ვალიდაცია ერთდროულად)
      const errors = [];

      // 1. სრული სახელი — არანაკლებ 3 ასო
      if (!name || name.length < 3) {
        errors.push("სრული სახელი უნდა შეიცავდეს არანაკლებ 3 ასოს.");
      }

      // 2. ელ-ფოსტის შემოწმება
      if (!email || !email.includes("@")) {
        errors.push("გთხოვთ მიუთითოთ ვალიდური ელ-ფოსტის მისამართი.");
      } else {
        // უკვე არსებული ელ-ფოსტის შემოწმება
        const users = getUsers();
        for (let i = 0; i < users.length; i++) {
          if (users[i].email === email) {
            errors.push("ამ ელ-ფოსტით ანგარიში უკვე არსებობს.");
            break;
          }
        }
      }

      // 3. კომპანიის სახელი
      if (!company) {
        errors.push("გთხოვთ მიუთითოთ კომპანიის სახელი.");
      }

      // 4. პაროლის სიგრძე — მინიმუმ 8 სიმბოლო
      if (!password || password.length < 8) {
        errors.push("პაროლი უნდა იყოს სულ მცირე 8 სიმბოლო.");
      }

      // 5. პაროლების თანხვედრა
      if (password !== confirmPassword) {
        errors.push("პაროლები ერთმანეთს არ ემთხვევა.");
      }

      // თუ აღმოჩნდა შეცდომები — ვაჩვენებთ ყველა შეცდომას ერთდროულად
      if (errors.length > 0) {
        const errorListHtml = errors.map((err) => `• ${err}`).join("<br>");
        showAlertModal(errorListHtml, "შეცდომა რეგისტრაციისას");
        return;
      }

      // თუ შეცდომა არ არის — ვინახავთ მომხმარებელს
      const newUser = {
        name: name,
        email: email,
        company: company,
        password: password,
        createdAt: new Date().toISOString(),
      };

      saveUser(newUser);

      // წარმატებული რეგისტრაციის შეტყობინება და 1.5 წამიანი დაყოვნება index.html-ზე გადასვლამდე
      showAlertModal(
        "რეგისტრაცია წარმატებით დასრულდა! გადადიხართ ავტორიზაციის გვერდზე...",
        "წარმატება",
      );

      setTimeout(function () {
        closeAlertModal();
        window.location.href = "index.html";
      }, 1500);
    });
  }

  // Sign In ფორმა
  if (signinForm) {
    signinForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const email = document.getElementById("signinEmail").value.trim();
      const password = document.getElementById("signinPassword").value;
      const users = getUsers();

      let foundUser = null;
      for (let i = 0; i < users.length; i++) {
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

// მოდალების დახურვა ბექგრაუნდზე (overlay) დაკლიკებისას
window.addEventListener("click", function (event) {
  const alertModal = document.getElementById("appAlertModal");
  if (event.target === alertModal) {
    closeAlertModal();
  }
});
