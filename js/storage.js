// 1. თემის მომენტალური ჩატვირთვა (გვერდის გათეთრების თავიდან ასაცილებლად)
(function initTheme() {
  const savedTheme = localStorage.getItem("crm_theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);
})();

// 2. ჩამოსაშლელ მენიუში სწორი მნიშვნელობის მინიჭება, როცა HTML ჩაიტვირთება
function initThemeSelector() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const selector = document.getElementById("themeSelect");
  
  // უსაფრთხოებისთვის ვამოწმებთ, საერთოდ არსებობს თუ არა ეს მენიუ გვერდზე
  if (selector) {
    selector.value = currentTheme;
  }
}

// 3. თემის შეცვლა მომხმარებლის მიერ მენიუდან არჩევისას
function changeTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("crm_theme", theme);
}

// 4. ლაივ საათის ფუნქცია (საიდბარში და ჰედერში)
function startLiveClock() {
  function update() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const timeString = `${hours}:${minutes}:${seconds}`;

    const sidebarClock = document.getElementById("sidebarClock");
    if (sidebarClock) {
      sidebarClock.textContent = timeString;
    }

    const currentTimeHeader = document.getElementById("current-time");
    if (currentTimeHeader) {
      currentTimeHeader.textContent = timeString;
    }
  }

  update();
  setInterval(update, 1000);
}

// ივენთის მიბმა გვერდის ჩატვირთვაზე
window.addEventListener("DOMContentLoaded", function () {
  initThemeSelector();
  startLiveClock();
});