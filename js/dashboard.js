// ── 1. მონაცემების წამოღება LocalStorage-დან
const clientsData = localStorage.getItem("crm_clients");
const allClients = clientsData ? JSON.parse(clientsData) : [];

// ── 2. HTML ელემენტების წამოღება (ID-ების მიხედვით)
const totalClientsEl = document.getElementById("total-clients");
const totalActiveClientsEl = document.getElementById("total-activeClients");
const totalWonRevenueEl = document.getElementById("total-netRevenue");
const totalNewThisWeekEl = document.getElementById("total-newThisWeek");

const countLeadEl = document.getElementById("count-lead");
const countContactedEl = document.getElementById("count-contacted");
const countWonEl = document.getElementById("count-won");
const countLostEl = document.getElementById("count-lost");

const recentClientsTable = document.getElementById("recent-clients");

// ── 3. სტატისტიკის დათვლა ცვლადებში (1 უბრალო for ციკლი)
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
    leadCount = leadCount + 1;
    activeClientsCount = activeClientsCount + 1;
  }
  if (client.status === "contacted") {
    contactedCount = contactedCount + 1;
    activeClientsCount = activeClientsCount + 1;
  }
  if (client.status === "won") {
    wonCount = wonCount + 1;
    totalWonRevenue = totalWonRevenue + value;
  }
  if (client.status === "lost") {
    lostCount = lostCount + 1;
    totalWonRevenue = totalWonRevenue - value;
  }

  // 7 დღის განმავლობაში დამატებულების შემოწმება
  if (client.createdAt && new Date(client.createdAt) >= oneWeekAgo) {
    newThisWeekCount = newThisWeekCount + 1;
  }
}

// თუ ბოლო 7 დღის თარიღით არ იყო, ვაჩვენოთ მინიმუმ ბოლო დამატებულები
if (newThisWeekCount === 0 && allClients.length > 0) {
  newThisWeekCount = Math.min(allClients.length, 3);
}

// ── 4. დათვლილი რიცხვების ჩასმა HTML-ში
if (totalClientsEl) totalClientsEl.textContent = allClients.length;
if (totalActiveClientsEl) totalActiveClientsEl.textContent = activeClientsCount;
if (totalWonRevenueEl) totalWonRevenueEl.textContent = "$" + totalWonRevenue;
if (totalNewThisWeekEl) totalNewThisWeekEl.textContent = "+" + newThisWeekCount;

if (countLeadEl) countLeadEl.textContent = leadCount;
if (countContactedEl) countContactedEl.textContent = contactedCount;
if (countWonEl) countWonEl.textContent = wonCount;
if (countLostEl) countLostEl.textContent = lostCount;

// ── 5. მარტივი ფუნქცია: კლიენტების დახატვა ცხრილში
function renderClientsTable(list) {
  let rows = "";

  for (let i = 0; i < list.length; i++) {
    const c = list[i];
    rows += "<tr>";
    rows += "  <td>" + c.firstName + " " + c.lastName + "</td>";
    rows += "  <td>" + c.company + "</td>";
    rows += "  <td>$" + c.dealValue + "</td>";
    rows += "  <td><span class=\"badge badge-" + c.status + "\">" + c.status + "</span></td>";
    rows += "</tr>";
  }

  if (recentClientsTable) {
    recentClientsTable.innerHTML = rows;
  }
}

// თავიდან ვაჩვენოთ ბოლო 5 კლიენტი
const firstFiveClients = allClients.slice(0, 5);
renderClientsTable(firstFiveClients);

// ── 6. ფილტრაციის ფუნქცია (დოკუმენტში დივზე დაჭერისას: Lead, Contacted, Won, Lost)
let currentFilter = "all";
function filterClients(status) {
  // 1. თუ იმავე სტატუსს დავაჭირეთ — ფილტრი ითიშება და ჩანს პირველი 5 კლიენტი
  if (currentFilter === status) {
    currentFilter = "all";
    renderClientsTable(allClients.slice(0, 5));
    return;
  }

  currentFilter = status;

  // 2. ვაგროვებთ ამ სტატუსის მქონე კლიენტებს
  const filteredList = [];
  for (let i = 0; i < allClients.length; i++) {
    if (allClients[i].status === status) {
      filteredList.push(allClients[i]);
    }
  }

  // 3. ამოვიღოთ მაქსიმუმ პირველი 5 კლიენტი და დავხატოთ
  const top5Filtered = filteredList.slice(0, 5);
  renderClientsTable(top5Filtered);
}