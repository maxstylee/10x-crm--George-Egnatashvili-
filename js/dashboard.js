// ── 1. გლობალური ცვლადები ──
let allClients = [];
let currentFilter = "all";

// ── 2. დეშბორდის ინიციალიზაცია ──
async function initDashboard() {
  let userClients = getUserClients();

  // თუ მიმდინარე მომხმარებელს ჯერ არ აქვს შენახული კლიენტები, წამოვიღოთ API-დან
  if (!userClients || userClients.length === 0) {
    try {
      const response = await fetch("https://dummyjson.com/users?limit=30");
      if (response.ok) {
        const data = await response.json();
        userClients = data.users.map(u => ({
          id: u.id,
          firstName: u.firstName,
          lastName: u.lastName,
          email: u.email,
          phone: u.phone,
          company: u.company.name,
          status: "lead",
          dealValue: Math.floor(Math.random() * 9500) + 500,
          createdAt: new Date().toISOString()
        }));
        saveUserClients(userClients);
      } else {
        userClients = [];
      }
    } catch (e) {
      userClients = [];
    }
  }

  allClients = userClients;
  renderDashboard();
}

// ── 3. სტატისტიკის დათვლა და DOM-ში ასახვა ──
function renderDashboard() {
  const totalClientsEl = document.getElementById("total-clients");
  const totalActiveClientsEl = document.getElementById("total-activeClients");
  const totalWonRevenueEl = document.getElementById("total-netRevenue");
  const totalNewThisWeekEl = document.getElementById("total-newThisWeek");

  const countLeadEl = document.getElementById("count-lead");
  const countContactedEl = document.getElementById("count-contacted");
  const countWonEl = document.getElementById("count-won");
  const countLostEl = document.getElementById("count-lost");

  let leadCount = 0;
  let contactedCount = 0;
  let wonCount = 0;
  let lostCount = 0;
  let activeClientsCount = 0;
  let totalWonRevenue = 0;
  let newThisWeekCount = 0;

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  for (let i = 0; i < allClients.length; i++) {
    const client = allClients[i];
    const value = Number(client.dealValue || 0);

    if (client.status === "lead") {
      leadCount += 1;
      activeClientsCount += 1;
    }
    if (client.status === "contacted") {
      contactedCount += 1;
      activeClientsCount += 1;
    }
    if (client.status === "won") {
      wonCount += 1;
      totalWonRevenue += value;
    }
    if (client.status === "lost") {
      lostCount += 1;
      totalWonRevenue -= value;
    }

    if (client.createdAt && new Date(client.createdAt) >= oneWeekAgo) {
      newThisWeekCount += 1;
    }
  }

  if (newThisWeekCount === 0 && allClients.length > 0) {
    newThisWeekCount = Math.min(allClients.length, 3);
  }

  if (totalClientsEl) totalClientsEl.textContent = allClients.length;
  if (totalActiveClientsEl) totalActiveClientsEl.textContent = activeClientsCount;
  if (totalWonRevenueEl) {
  const sign = totalWonRevenue < 0 ? '-' : '';
  totalWonRevenueEl.textContent = `${sign}$${Math.abs(totalWonRevenue)}`;
}
  if (totalNewThisWeekEl) totalNewThisWeekEl.textContent = `+${newThisWeekCount}`;

  if (countLeadEl) countLeadEl.textContent = leadCount;
  if (countContactedEl) countContactedEl.textContent = contactedCount;
  if (countWonEl) countWonEl.textContent = wonCount;
  if (countLostEl) countLostEl.textContent = lostCount;

  renderClientsTable(allClients.slice(0, 5));
}

// ── 4. კლიენტების დახატვა ცხრილში ──
function renderClientsTable(list) {
  const recentClientsTable = document.getElementById("recent-clients");
  if (!recentClientsTable) return;

  recentClientsTable.innerHTML = list.map(c => `
    <tr>
      <td>${c.firstName} ${c.lastName}</td>
      <td>${c.company}</td>
      <td>$${c.dealValue}</td>
      <td><span class="badge badge-${c.status}">${c.status}</span></td>
    </tr>
  `).join("");
}

// ── 5. ფილტრაციის ფუნქცია ──
function filterClients(status) {
  if (currentFilter === status) {
    currentFilter = "all";
    renderClientsTable(allClients.slice(0, 5));
    return;
  }

  currentFilter = status;
  const filteredList = allClients.filter(c => c.status === status);
  renderClientsTable(filteredList.slice(0, 5));
}

// გვერდის ჩატვირთვისას გამოვიძახოთ ინიციალიზაცია
document.addEventListener("DOMContentLoaded", initDashboard);