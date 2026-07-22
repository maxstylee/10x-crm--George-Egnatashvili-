// ── 1. მონაცემების წამოღება LocalStorage-დან
var clientsData = localStorage.getItem("crm_clients");
var allClients = clientsData ? JSON.parse(clientsData) : [];

// ── 2. HTML ელემენტების წამოღება (ID-ების მიხედვით)
var totalClientsEl = document.getElementById("total-clients");
var totalActiveClientsEl = document.getElementById("total-activeClients");
var totalWonRevenueEl = document.getElementById("total-netRevenue");
var totalNewThisWeekEl = document.getElementById("total-newThisWeek");

var countLeadEl = document.getElementById("count-lead");
var countContactedEl = document.getElementById("count-contacted");
var countWonEl = document.getElementById("count-won");
var countLostEl = document.getElementById("count-lost");

var recentClientsTable = document.getElementById("recent-clients");

// ── 3. სტატისტიკის დათვლა ცვლადებში (1 უბრალო for ციკლი)
var leadCount = 0;
var contactedCount = 0;
var wonCount = 0;
var lostCount = 0;
var activeClientsCount = 0;
var totalWonRevenue = 0;
var newThisWeekCount = 0;

var oneWeekAgo = new Date();
oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

for (var i = 0; i < allClients.length; i++) {
  var client = allClients[i];
  var value = Number(client.dealValue || 0);

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
  var rows = "";

  for (var i = 0; i < list.length; i++) {
    var c = list[i];
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
var firstFiveClients = allClients.slice(0, 5);
renderClientsTable(firstFiveClients);

// ── 6. ფილტრაციის ფუნქცია (დოკუმენტში დივზე დაჭერისას: Lead, Contacted, Won, Lost)
var currentFilter = "all";
function filterClients(status) {
  // 1. თუ იმავე სტატუსს დავაჭირეთ — ფილტრი ითიშება და ჩანს პირველი 5 კლიენტი
  if (currentFilter === status) {
    currentFilter = "all";
    renderClientsTable(allClients.slice(0, 5));
    return;
  }

  currentFilter = status;

  // 2. ვაგროვებთ ამ სტატუსის მქონე კლიენტებს
  var filteredList = [];
  for (var i = 0; i < allClients.length; i++) {
    if (allClients[i].status === status) {
      filteredList.push(allClients[i]);
    }
  }

  // 3. ამოვიღოთ მაქსიმუმ პირველი 5 კლიენტი და დავხატოთ
  var top5Filtered = filteredList.slice(0, 5);
  renderClientsTable(top5Filtered);
}