// ── 1. გლობალური ცვლადები
let allClients = [];
let currentDisplayedClients = [];
let currentEditingClientId = null;
let pendingDeleteClientId = null;

// პაგინაციის ცვლადები
let currentPage = 1;
const itemsPerPage = 10;

// ── 2. მოდალის დამხმარე ფუნქციები alert/confirm-ის ჩასანაცვლებლად
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

function showConfirmModal(message, idToDelete) {
  pendingDeleteClientId = idToDelete;
  const modal = document.getElementById("appConfirmModal");
  const msgEl = document.getElementById("confirmModalMessage");

  if (msgEl) msgEl.textContent = message;
  if (modal) modal.style.display = "flex";
}

function closeConfirmModal(isConfirmed) {
  const modal = document.getElementById("appConfirmModal");
  if (modal) modal.style.display = "none";

  if (isConfirmed && pendingDeleteClientId !== null) {
    // წავშალოთ კლიენტი ID-ით
    const updatedList = [];
    for (let i = 0; i < allClients.length; i++) {
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
  setupSort();
});

// ── 4. კლიენტების ჩატვირთვა LocalStorage-დან ან API-დან
async function loadClients() {
  showLoading();

  const saved = localStorage.getItem("crm_clients");
  if (saved) {
    allClients = JSON.parse(saved);
    renderTable(allClients);
    return;
  }

  try {
    const response = await fetch("https://dummyjson.com/users?limit=30");
    if (!response.ok) throw new Error("Error fetching");
    const data = await response.json();

    allClients = [];
    for (let i = 0; i < data.users.length; i++) {
      const u = data.users[i];
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

// ── 5. ცხრილის დახატვა პაგინაციით (10 კლიენტი თითო გვერდზე)
function renderTable(clientsList) {
  const zone = document.getElementById("clientsZone");
  if (!zone) return;

  currentDisplayedClients = clientsList || allClients;
  const totalItems = currentDisplayedClients.length;

  if (totalItems === 0) {
    zone.innerHTML = "<p class='no-clients-text'>კლიენტები ვერ მოიძებნა.</p>";
    return;
  }

  // პაგინაციის გამოთვლა
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  if (currentPage > totalPages) {
    currentPage = totalPages;
  }
  if (currentPage < 1) {
    currentPage = 1;
  }

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const pageClients = currentDisplayedClients.slice(startIndex, endIndex);

  let rows = "";
  for (let i = 0; i < pageClients.length; i++) {
    const c = pageClients[i];
    const initials = (c.firstName[0] || "") + (c.lastName[0] || "");
    const avatarColorIndex = (c.id % 7) + 1;

    rows += `
      <tr class="client-row" ondblclick="openClientModal(${c.id})">
        <td>
          <div class="client-cell">
            <div class="client-avatar avatar-color-${avatarColorIndex}">${initials}</div>
            <span class="client-name">${c.firstName} ${c.lastName}</span>
          </div>
        </td>
        <td>${c.email}</td>
        <td>${c.phone || "-"}</td>
        <td>${c.company}</td>
        <td class="deal-value">$${c.dealValue}</td>
        <td><span class="badge badge-${c.status}">${c.status}</span></td>
        <td>
          <button class="action-btn action-delete" onclick="deleteClient(event, ${c.id})" type="button" title="Delete">🗑️</button>
        </td>
      </tr>
    `;
  }

  // პაგინაციის ღილაკების გენერაცია
  let pageButtonsHtml = "";
  for (let p = 1; p <= totalPages; p++) {
    pageButtonsHtml += `
      <button class="page-btn ${p === currentPage ? "active" : ""}" onclick="goToPage(${p})">
        ${p}
      </button>
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

    <!-- Pagination UI -->
    <div class="pagination-container">
      <div class="pagination-info">
        Showing ${startIndex + 1}–${endIndex} of ${totalItems} clients (Page ${currentPage} of ${totalPages})
      </div>
      <div class="pagination-controls">
        <button class="page-btn" onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? "disabled" : ""}>‹ Prev</button>
        ${pageButtonsHtml}
        <button class="page-btn" onclick="goToPage(${currentPage + 1})" ${currentPage === totalPages ? "disabled" : ""}>Next ›</button>
      </div>
    </div>
  `;
}

// გვერდის შეცვლა პაგინაციისას
function goToPage(page) {
  currentPage = page;
  renderTable(currentDisplayedClients);
}

// ── 6. მოდალის გახსნა კლიენტზე 2-ჯერ დაკლიკებისას
function openClientModal(id) {
  let client = null;
  for (let i = 0; i < allClients.length; i++) {
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

  const modal = document.getElementById("clientInfoModal");
  if (modal) modal.style.display = "flex";
}

function closeClientModal() {
  const modal = document.getElementById("clientInfoModal");
  if (modal) modal.style.display = "none";
}

// ── 7. მოდალიდან შეცვლილი მონაცემების შენახვა
function saveClientEdits(event) {
  event.preventDefault();

  if (currentEditingClientId === null) return;

  const updatedFirstName = document.getElementById("editFirstName").value.trim();
  const updatedLastName = document.getElementById("editLastName").value.trim();
  const updatedEmail = document.getElementById("editEmail").value.trim();
  const updatedPhone = document.getElementById("editPhone").value.trim();
  const updatedCompany = document.getElementById("editCompany").value.trim();
  const updatedDealValue = Number(document.getElementById("editDealValue").value || 0);
  const updatedStatus = document.getElementById("editStatus").value;

  if (!updatedFirstName || !updatedLastName || !updatedEmail) {
    showAlertModal("გთხოვთ შეავსოთ სახელი, გვარი და მეილი!");
    return;
  }

  // მოვძებნოთ და განვაახლოთ კლიენტი მასივში
  for (let i = 0; i < allClients.length; i++) {
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
  const modal = document.getElementById("addClientModal");
  if (modal) modal.style.display = "flex";
}

function closeAddClientModal() {
  const modal = document.getElementById("addClientModal");
  if (modal) {
    modal.style.display = "none";
    const form = document.getElementById("addClientForm");
    if (form) form.reset();
  }
}

function handleAddClient(event) {
  event.preventDefault();

  const firstName = document.getElementById("newFirstName").value.trim();
  const lastName = document.getElementById("newLastName").value.trim();
  const email = document.getElementById("newEmail").value.trim();
  const phone = document.getElementById("newPhone").value.trim();
  const company = document.getElementById("newCompany").value.trim();
  const dealValue = Number(document.getElementById("newDealValue").value || 0);
  const status = document.getElementById("newStatus").value;

  if (!firstName || !lastName || !email) {
    showAlertModal("გთხოვთ შეავსოთ სავალდებულო ველები!");
    return;
  }

  const newClient = {
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
  
  currentPage = 1;
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
  const input = document.getElementById("searchInput");
  if (!input) return;

  input.addEventListener("input", function (e) {
    const q = e.target.value.toLowerCase().trim();
    if (q === "") {
      currentPage = 1;
      renderTable(allClients);
      return;
    }

    const filtered = [];
    for (let i = 0; i < allClients.length; i++) {
      const name = (allClients[i].firstName + " " + allClients[i].lastName).toLowerCase();
      const email = (allClients[i].email || "").toLowerCase();
      const company = (allClients[i].company || "").toLowerCase();

      if (name.includes(q) || email.includes(q) || company.includes(q)) {
        filtered.push(allClients[i]);
      }
    }
    currentPage = 1;
    renderTable(filtered);
  });
}

// ── 11. ფილტრაციის Chips (All, Lead, Contacted, Won, Lost)
function setupFilterChips() {
  const chips = document.querySelectorAll(".filter-chips .chip");
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      const status = this.getAttribute("name");

      chips.forEach(function (c) { c.classList.remove("chip-active"); });
      this.classList.add("chip-active");

      currentPage = 1;
      if (status === "all") {
        renderTable(allClients);
        return;
      }

      const filtered = [];
      for (let i = 0; i < allClients.length; i++) {
        if (allClients[i].status === status) {
          filtered.push(allClients[i]);
        }
      }
      renderTable(filtered);
    });
  });
}

// ── 12. სორტირება (Sort Select)
function setupSort() {
  const sortSelect = document.querySelector(".sort-select");
  if (!sortSelect) return;

  sortSelect.addEventListener("change", function () {
    const val = this.value;
    const list = [...currentDisplayedClients];

    if (val === "newest") {
      list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (val === "oldest") {
      list.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
    } else if (val === "name_asc") {
      list.sort((a, b) => (a.firstName + a.lastName).localeCompare(b.firstName + b.lastName));
    } else if (val === "deal_desc") {
      list.sort((a, b) => Number(b.dealValue || 0) - Number(a.dealValue || 0));
    }

    currentPage = 1;
    renderTable(list);
  });
}

// ── 13. Loading / Error სტეიტები
function showLoading() {
  const zone = document.getElementById("clientsZone");
  if (zone) {
    zone.innerHTML = "<div class='clients-feedback'><div class='loading-spinner'></div><p class='feedback-text'>Loading clients...</p></div>";
  }
}

function showError() {
  const zone = document.getElementById("clientsZone");
  if (zone) {
    zone.innerHTML = "<div class='clients-feedback clients-error'><p class='feedback-text'>Could not load clients.</p><button class='btn-primary btn-auto-width' onclick='loadClients()'>Retry</button></div>";
  }
}

// ── 14. მოდალის დახურვა ფონზე (Backdrop) დაკლიკებისას
window.addEventListener("click", function (event) {
  const addModal = document.getElementById("addClientModal");
  const infoModal = document.getElementById("clientInfoModal");
  const alertModal = document.getElementById("appAlertModal");
  const confirmModal = document.getElementById("appConfirmModal");

  if (event.target === addModal) closeAddClientModal();
  if (event.target === infoModal) closeClientModal();
  if (event.target === alertModal) closeAlertModal();
  if (event.target === confirmModal) closeConfirmModal(false);
});
