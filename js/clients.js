// ── 1. გლობალური ცვლადები
var allClients = [];
var currentEditingClientId = null;
var pendingDeleteClientId = null;

// ── 2. მოდალის დამხმარე ფუნქციები alert/confirm-ის ჩასანაცვლებლად
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

function showConfirmModal(message, idToDelete) {
  pendingDeleteClientId = idToDelete;
  var modal = document.getElementById("appConfirmModal");
  var msgEl = document.getElementById("confirmModalMessage");

  if (msgEl) msgEl.textContent = message;
  if (modal) modal.style.display = "flex";
}

function closeConfirmModal(isConfirmed) {
  var modal = document.getElementById("appConfirmModal");
  if (modal) modal.style.display = "none";

  if (isConfirmed && pendingDeleteClientId !== null) {
    // წავშალოთ კლიენტი ID-ით
    var updatedList = [];
    for (var i = 0; i < allClients.length; i++) {
      if (allClients[i].id !== pendingDeleteClientId) {
        updatedList.push(allClients[i]);
      }
    }
    allClients = updatedList;
    localStorage.setItem("crm_clients", JSON.stringify(allClients));
    renderTable(allClients);
  }
  pendingDeleteClientId = null;
}

// ── 3. ჩატვირთვა გვერდის გახსნისას
document.addEventListener("DOMContentLoaded", function () {
  loadClients();
  setupSearch();
  setupFilterChips();
});

// ── 4. კლიენტების ჩატვირთვა LocalStorage-დან ან API-დან
async function loadClients() {
  showLoading();

  var saved = localStorage.getItem("crm_clients");
  if (saved) {
    allClients = JSON.parse(saved);
    renderTable(allClients);
    return;
  }

  try {
    var response = await fetch("https://dummyjson.com/users?limit=30");
    if (!response.ok) throw new Error("Error fetching");
    var data = await response.json();

    allClients = [];
    for (var i = 0; i < data.users.length; i++) {
      var u = data.users[i];
      allClients.push({
        id: u.id,
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        phone: u.phone,
        company: u.company.name,
        status: "lead",
        dealValue: Math.floor(Math.random() * 9500) + 500,
        createdAt: new Date().toISOString()
      });
    }

    localStorage.setItem("crm_clients", JSON.stringify(allClients));
    renderTable(allClients);
  } catch (err) {
    showError();
  }
}

// ── 5. ცხრილის დახატვა
function renderTable(clients) {
  var zone = document.getElementById("clientsZone");
  if (!zone) return;

  if (clients.length === 0) {
    zone.innerHTML = "<p class='no-clients-text'>კლიენტები ვერ მოიძებნა.</p>";
    return;
  }

  var rows = "";
  for (var i = 0; i < clients.length; i++) {
    var c = clients[i];
    var initials = (c.firstName[0] || "") + (c.lastName[0] || "");
    var avatarColorIndex = (c.id % 7) + 1;

    rows += `
      <tr class="client-row" ondblclick="openClientModal(${c.id})">
        <td>
          <div class="client-cell">
            <div class="client-avatar avatar-color-${avatarColorIndex}">${initials}</div>
            <span class="client-name">${c.firstName} ${c.lastName}</span>
          </div>
        </td>
        <td>${c.email}</td>
        <td>${c.phone}</td>
        <td>${c.company}</td>
        <td class="deal-value">$${c.dealValue}</td>
        <td><span class="badge badge-${c.status}">${c.status}</span></td>
        <td>
          <button class="action-btn action-delete" onclick="deleteClient(event, ${c.id})" type="button" title="Delete">🗑️</button>
        </td>
      </tr>
    `;
  }

  zone.innerHTML = `
    <div class='table-container'>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Company</th>
            <th>Deal Value</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>
  `;
}

// ── 6. მოდალის გახსნა კლიენტზე 2-ჯერ დაკლიკებისას (Double Click -> Editable Inputs)
function openClientModal(id) {
  var client = null;
  for (var i = 0; i < allClients.length; i++) {
    if (allClients[i].id === id) {
      client = allClients[i];
      break;
    }
  }

  if (!client) return;

  currentEditingClientId = id;

  // ინპუტებში მნიშვნელობების შევსება
  document.getElementById("editFirstName").value = client.firstName || "";
  document.getElementById("editLastName").value = client.lastName || "";
  document.getElementById("editEmail").value = client.email || "";
  document.getElementById("editPhone").value = client.phone || "";
  document.getElementById("editCompany").value = client.company || "";
  document.getElementById("editDealValue").value = client.dealValue || 0;
  document.getElementById("editStatus").value = client.status || "lead";

  var modal = document.getElementById("clientInfoModal");
  if (modal) modal.style.display = "flex";
}

function closeClientModal() {
  var modal = document.getElementById("clientInfoModal");
  if (modal) modal.style.display = "none";
}

// ── 7. მოდალიდან შეცვლილი მონაცემების შენახვა (Save Changes)
function saveClientEdits(event) {
  event.preventDefault();

  if (currentEditingClientId === null) return;

  var updatedFirstName = document.getElementById("editFirstName").value.trim();
  var updatedLastName = document.getElementById("editLastName").value.trim();
  var updatedEmail = document.getElementById("editEmail").value.trim();
  var updatedPhone = document.getElementById("editPhone").value.trim();
  var updatedCompany = document.getElementById("editCompany").value.trim();
  var updatedDealValue = Number(document.getElementById("editDealValue").value || 0);
  var updatedStatus = document.getElementById("editStatus").value;

  if (!updatedFirstName || !updatedLastName || !updatedEmail) {
    showAlertModal("გთხოვთ შეავსოთ სახელი, გვარი და მეილი!");
    return;
  }

  // მოვძებნოთ და განვაახლოთ კლიენტი მასივში
  for (var i = 0; i < allClients.length; i++) {
    if (allClients[i].id === currentEditingClientId) {
      allClients[i].firstName = updatedFirstName;
      allClients[i].lastName = updatedLastName;
      allClients[i].email = updatedEmail;
      allClients[i].phone = updatedPhone;
      allClients[i].company = updatedCompany;
      allClients[i].dealValue = updatedDealValue;
      allClients[i].status = updatedStatus;
      break;
    }
  }

  // შევინახოთ localStorage-ში და ხელახლა დავხატოთ
  localStorage.setItem("crm_clients", JSON.stringify(allClients));
  renderTable(allClients);

  closeClientModal();
  showAlertModal("კლიენტის მონაცემები წარმატებით განახლდა!", "წარმატება");
}

// ── 8. ახალი კლიენტის დამატების მოდალი
function openAddClientModal() {
  var modal = document.getElementById("addClientModal");
  if (modal) modal.style.display = "flex";
}

function closeAddClientModal() {
  var modal = document.getElementById("addClientModal");
  if (modal) {
    modal.style.display = "none";
    var form = document.getElementById("addClientForm");
    if (form) form.reset();
  }
}

function handleAddClient(event) {
  event.preventDefault();

  var firstName = document.getElementById("newFirstName").value.trim();
  var lastName = document.getElementById("newLastName").value.trim();
  var email = document.getElementById("newEmail").value.trim();
  var phone = document.getElementById("newPhone").value.trim();
  var company = document.getElementById("newCompany").value.trim();
  var dealValue = Number(document.getElementById("newDealValue").value || 0);
  var status = document.getElementById("newStatus").value;

  if (!firstName || !lastName || !email) {
    showAlertModal("გთხოვთ შეავსოთ სავალდებულო ველები!");
    return;
  }

  var newClient = {
    id: Date.now(),
    firstName: firstName,
    lastName: lastName,
    email: email,
    phone: phone,
    company: company,
    status: status,
    dealValue: dealValue,
    createdAt: new Date().toISOString()
  };

  allClients.unshift(newClient);
  localStorage.setItem("crm_clients", JSON.stringify(allClients));
  renderTable(allClients);

  closeAddClientModal();
  showAlertModal("ახალი კლიენტი წარმატებით დაემატა!", "წარმატება");
}

// ── 9. წაშლის მოდალის გამოძახება
function deleteClient(event, id) {
  event.stopPropagation();
  showConfirmModal("ნამდვილად გსურთ კლიენტის წაშლა?", id);
}

// ── 10. ძებნა (Search)
function setupSearch() {
  var input = document.getElementById("searchInput");
  if (!input) return;

  input.addEventListener("input", function (e) {
    var q = e.target.value.toLowerCase().trim();
    if (q === "") {
      renderTable(allClients);
      return;
    }

    var filtered = [];
    for (var i = 0; i < allClients.length; i++) {
      var name = (allClients[i].firstName + " " + allClients[i].lastName).toLowerCase();
      var email = (allClients[i].email || "").toLowerCase();
      var company = (allClients[i].company || "").toLowerCase();

      if (name.indexOf(q) !== -1 || email.indexOf(q) !== -1 || company.indexOf(q) !== -1) {
        filtered.push(allClients[i]);
      }
    }
    renderTable(filtered);
  });
}

// ── 11. ფილტრაციის Chips (All, Lead, Contacted, Won, Lost)
function setupFilterChips() {
  var chips = document.querySelectorAll(".filter-chips .chip");
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var status = this.getAttribute("name");

      chips.forEach(function (c) { c.classList.remove("chip-active"); });
      this.classList.add("chip-active");

      if (status === "all") {
        renderTable(allClients);
        return;
      }

      var filtered = [];
      for (var i = 0; i < allClients.length; i++) {
        if (allClients[i].status === status) {
          filtered.push(allClients[i]);
        }
      }
      renderTable(filtered);
    });
  });
}

// ── 12. Loading / Error სტეიტები
function showLoading() {
  var zone = document.getElementById("clientsZone");
  if (zone) {
    zone.innerHTML = "<div class='clients-feedback'><div class='loading-spinner'></div><p class='feedback-text'>Loading clients...</p></div>";
  }
}

function showError() {
  var zone = document.getElementById("clientsZone");
  if (zone) {
    zone.innerHTML = "<div class='clients-feedback clients-error'><p class='feedback-text'>Could not load clients.</p><button class='btn-primary btn-auto-width' onclick='loadClients()'>Retry</button></div>";
  }
}

// ── 13. მოდალის დახურვა ფონზე კლიკისას
window.addEventListener("click", function (event) {
  var addModal = document.getElementById("addClientModal");
  var infoModal = document.getElementById("clientInfoModal");
  var alertModal = document.getElementById("appAlertModal");
  var confirmModal = document.getElementById("appConfirmModal");

  if (event.target === addModal) closeAddClientModal();
  if (event.target === infoModal) closeClientModal();
  if (event.target === alertModal) closeAlertModal();
  if (event.target === confirmModal) closeConfirmModal(false);
});
