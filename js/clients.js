// ── 0. დამხმარე ფუნქცია დაყოვნებისთვის (Delay)
function delay(ms) {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms);
  });
}

// ── 1. გლობალური ცვლადი - აქ ვინახავთ ყველა კლიენტს
var allClients = [];
var currentModalClientId = null;

// ── 2. გვერდი ჩაიტვირთა — დავიწყოთ
document.addEventListener("DOMContentLoaded", function () {
  loadClients();
  setupSearch(); // ვრთავთ ძებნის ფუნქციას
});

// ── 3. მონაცემების ჩატვირთვა
async function loadClients() {
  showLoading();
  await delay(1500);

  // თუ localStorage-ში უკვე გვაქვს მონაცემები
  var saved = localStorage.getItem("crm_clients");
  if (saved) {
    allClients = JSON.parse(saved); // 💡 მნიშვნელოვანია: ვინახავთ allClients-ში!
    renderTable(allClients);
    return;
  }

  // API-დან ჩამოტვირთვა
  try {
    var response = await fetch("https://dummyjson.com/users?limit=30");

    if (!response.ok) {
      throw new Error("Server error");
    }

    var data = await response.json();
    allClients = buildClients(data.users); // 💡 ვინახავთ allClients-ში!

    // შენახვა localStorage-ში
    localStorage.setItem("crm_clients", JSON.stringify(allClients));

    renderTable(allClients);
  } catch (error) {
    showError();
  }
}

// ── 4. API-ს user ობიექტებიდან ავაწყოთ Client ობიექტები
function buildClients(users) {
  var clients = [];

  for (var i = 0; i < users.length; i++) {
    var user = users[i];

    var client = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      company: user.company.name,
      status: "lead",
      dealValue: randomNumber(500, 10000),
      notes: [],
      createdAt: new Date().toISOString(),
    };

    clients.push(client);
  }

  return clients;
}

// ── 5. შემთხვევითი რიცხვი min-max შუა
function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ── 6. ცხრილის დახატვა (იღებს კლიენტების მასივს)
function renderTable(clients) {
  var zone = document.getElementById("clientsZone");

  if (clients.length === 0) {
    zone.innerHTML = "<p class='no-clients-text'>კლიენტები ვერ მოიძებნა.</p>";
    return;
  }

  var rows = "";

  for (var i = 0; i < clients.length; i++) {
    var c = clients[i];

    var badgeClass = "badge badge-" + c.status;
    var colorIndex = (c.id % 7) + 1;
    var avatarClass = "client-avatar avatar-color-" + colorIndex;
    var initials = c.firstName[0] + c.lastName[0];

    rows += "<tr onclick='openClientModal(" + c.id + ")'>";
    rows += "  <td>";
    rows += "    <div class='client-cell'>";
    rows += "      <div class='" + avatarClass + "'>" + initials + "</div>";
    rows +=
      "      <span class='client-name'>" +
      c.firstName +
      " " +
      c.lastName +
      "</span>";
    rows += "    </div>";
    rows += "  </td>";
    rows += "  <td>" + c.email + "</td>";
    rows += "  <td>" + c.phone + "</td>";
    rows += "  <td>" + c.company + "</td>";
    rows += "  <td>$" + c.dealValue + "</td>";
    rows +=
      "  <td><span class='" + badgeClass + "'>" + c.status + "</span></td>";
    rows += "  <td>";
   "    <button id='editStatus' class='action-btn action-edit' onclick='event.stopPropagation()'>✏️</button>";
    rows +=
      "    <button class='action-btn action-delete' onclick='deleteClient(event, " +
      c.id +
      ")' type='button'>🗑️</button>";
    rows += "  </td>";
    rows += "</tr>";
  }

  zone.innerHTML =
    "<div class='table-container'>" +
    "<table>" +
    "<thead>" +
    "<tr>" +
    "<th>Name</th>" +
    "<th>Email</th>" +
    "<th>Phone</th>" +
    "<th>Company</th>" +
    "<th>Deal Value</th>" +
    "<th>Status</th>" +
    "<th>Actions</th>" +
    "</tr>" +
    "</thead>" +
    "<tbody>" +
    rows +
    "</tbody>" +
    "</table>" +
    "</div>";
}

// ── 7. ძებნის ფუნქცია (Search)
function setupSearch() {
  var searchInput = document.getElementById("searchInput");

  if (!searchInput) return;

  // როცა მომხმარებელი ბეჭდავს ინპუტში
  searchInput.addEventListener("input", function (e) {
    var query = e.target.value.toLowerCase().trim();

    // თუ ცარიელია — ვაჩვენებთ ყველა კლიენტს
    if (query === "") {
      renderTable(allClients);
      return;
    }

    // ვფილტრავთ allClients მასივს
    var filtered = [];
    for (var i = 0; i < allClients.length; i++) {
      var client = allClients[i];
      var fullName = (client.firstName + " " + client.lastName).toLowerCase();
      var email = client.email.toLowerCase();
      var company = client.company.toLowerCase();

      // თუ სახელი, მეილი ან კომპანია შეიცავს საძიებო სიტყვას
      if (
        fullName.indexOf(query) !== -1 ||
        email.indexOf(query) !== -1 ||
        company.indexOf(query) !== -1
      ) {
        filtered.push(client);
      }
    }

    // ხელახლა ვხატავთ ცხრილს გაფილტრული სიით
    renderTable(filtered);
  });
}

// ── 8. მოდალის გახსნა კლიენტის ID-ით
function openClientModal(id) {
  // ვპოულობთ კლიენტს ID-ის მიხედვით
  var client = null;
  for (var i = 0; i < allClients.length; i++) {
    if (allClients[i].id === id) {
      client = allClients[i];
      break;
    }
  }

  if (!client) return; // თუ ვერ იპოვა, გავჩერდეთ

  // მოდალის ელემენტები
  var modal = document.getElementById("clientInfoModal");
  var nameEl = document.getElementById("modal-name");
  var phoneEl = document.getElementById("modal-phone");
  var emailEl = document.getElementById("modal-email");
  var compEl = document.getElementById("modal-company");
  var dealEl = document.getElementById("modal-deal");
  var statusSelect = document.getElementById("modal-status");

  // ვავსებთ მონაცემებს
  nameEl.textContent = client.firstName + " " + client.lastName;
  phoneEl.textContent = client.phone;
  emailEl.textContent = client.email;
  compEl.textContent = client.company;
  dealEl.textContent = "$" + client.dealValue;
  statusSelect.value = client.status;
  statusSelect.className = "badge status-select badge-" + client.status;
  currentModalClientId = id;

  // მოდალის გახსნა
  modal.style.display = "flex";
}

// ── 9. მოდალის დახურვა
function closeClientModal() {
  var modal = document.getElementById("clientInfoModal");
  if (modal) {
    modal.style.display = "none";
  }
}

// ── 10. Loading სტეიტი
function showLoading() {
  var zone = document.getElementById("clientsZone");
  zone.innerHTML =
    "<div class='clients-feedback'>" +
    "<div class='loading-spinner'></div>" +
    "<p class='feedback-text'>Loading clients...</p>" +
    "</div>";
}

// ── 11. Error სტეიტი + Retry ღილაკი
function showError() {
  var zone = document.getElementById("clientsZone");
  zone.innerHTML =
    "<div class='clients-feedback clients-error'>" +
    "<p class='feedback-text'>Could not load clients. Check your connection and try again.</p>" +
    "<button class='btn-primary btn-auto-width' onclick='loadClients()'>Retry</button>" +
    "</div>";
}

// ── 12. კლიენტის წაშლის ფუნქცია
function deleteClient(event, id) {
  // 1. event.stopPropagation() — რომ <tr> კლიკზე კლიენტის მოდალური ფანჯარა არ გაიხსნას!
  event.stopPropagation();

  // 2. ვკითხოთ მომხმარებელს დასტური (Confirm alert)
  var isConfirmed = confirm("ნამდვილად გსურთ კლიენტის წაშლა?");

  if (isConfirmed) {
    // 3. შევქმნათ ახალი მასივი — დავტოვოთ ყველა კლიენტი ამ ID-ს გარდა
    allClients = allClients.filter(function (client) {
      return client.id !== id;
    });

    // 4. შევინახოთ localStorage-ში (რომ დარეფრეშების შემდეგაც წაშლილი დარჩეს!)
    localStorage.setItem("crm_clients", JSON.stringify(allClients));

    // 5. ხელახლა დავხატოთ განახლებული ცხრილი
    renderTable(allClients);
  }
}

function changeModalClientStatus(value) {
  if (currentModalClientId === null) {
    return;
  }

  for (var i = 0; i < allClients.length; i++) {
    if (allClients[i].id === currentModalClientId) {
      allClients[i].status = value;
      break;
    }
  }

  var statusSelect = document.getElementById("modal-status");
  if (statusSelect) {
    statusSelect.className = "badge status-select badge-" + value;
  }

  localStorage.setItem("crm_clients", JSON.stringify(allClients));
  renderTable(allClients);
}

// ── 13. ახალი კლიენტის მოდალის გახსნა და დახურვა
function openAddClientModal() {
  var modal = document.getElementById("addClientModal");
  if (modal) {
    modal.style.display = "flex";
  }
}

function closeAddClientModal() {
  var modal = document.getElementById("addClientModal");
  if (modal) {
    modal.style.display = "none";
    var form = document.getElementById("addClientForm");
    if (form) form.reset();
  }
}

// ── 14. ახალი კლიენტის დამატება (Form Submit)
function handleAddClient(event) {
  event.preventDefault();

  var firstName = document.getElementById("newFirstName").value.trim();
  var lastName = document.getElementById("newLastName").value.trim();
  var email = document.getElementById("newEmail").value.trim();
  var phone = document.getElementById("newPhone").value.trim();
  var company = document.getElementById("newCompany").value.trim();
  var dealValue =
    parseFloat(document.getElementById("newDealValue").value) || 0;
  var status = document.getElementById("newStatus").value;

  if (!firstName || !lastName || !email || !phone || !company) {
    alert("გთხოვთ შეავსოთ ყველა სავალდებულო ველი!");
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
    notes: [],
    createdAt: new Date().toISOString(),
  };

  // ჩავამატოთ ახალი კლიენტი სიის სათავეში
  allClients.unshift(newClient);

  // შევინახოთ localStorage-ში
  localStorage.setItem("crm_clients", JSON.stringify(allClients));

  // ხელახლა დავხატოთ ცხრილი
  renderTable(allClients);

  // დავხუროთ მოდალი და გავასუფთავოთ ფორმა
  closeAddClientModal();
}

// ── 15. მოდალების დახურვა ფონზე დაჭერისას
window.addEventListener("click", function (event) {
  var addModal = document.getElementById("addClientModal");
  var infoModal = document.getElementById("clientInfoModal");

  if (event.target === addModal) {
    closeAddClientModal();
  }
  if (event.target === infoModal) {
    closeClientModal();
  }
});

// console.log(JSON.parse(localStorage.getItem("crm_clients")));
