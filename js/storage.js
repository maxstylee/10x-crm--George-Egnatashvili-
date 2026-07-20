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

// ივენთის მიბმა გვერდის ჩატვირთვაზე
window.addEventListener("DOMContentLoaded", initThemeSelector);