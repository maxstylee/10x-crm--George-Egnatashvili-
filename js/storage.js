// 1. თემის მომენტალური ჩატვირთვა (გვერდის გათეთრების თავიდან ასაცილებლად)
(function initTheme() {
  const savedTheme = localStorage.getItem("crm_theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);
})();

// 2. თემის ელემენტების (სელექტორი და სლაიდერი) სინქრონიზაცია ჩატვირთვისას
function initThemeControls() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const selector = document.getElementById("themeSelect");
  const sliderToggle = document.getElementById("sidebarThemeToggle");
  const label = document.getElementById("sidebarThemeLabel");

  if (selector) {
    selector.value = currentTheme;
  }

  if (sliderToggle) {
    sliderToggle.checked = (currentTheme === "light");
  }

  if (label) {
    label.textContent = currentTheme === "light" ? "☀️ Light" : "🌙 Dark";
  }
}

// 3. თემის შეცვლის ფუნქცია (როგორც სელექტორიდან, ისე სლაიდერიდან)
function changeTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("crm_theme", theme);

  // სინქრონიზაცია ყველა ელემენტთან გვერდზე
  initThemeControls();
}

// 4. სლაიდერით თემის გადართვა (checked = true -> light, false -> dark)
function toggleThemeSlider(isLight) {
  const newTheme = isLight ? "light" : "dark";
  changeTheme(newTheme);
}

// 5. ლაივ საათის ფუნქცია (საიდბარში და ჰედერში)
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
  initThemeControls();
  startLiveClock();
});