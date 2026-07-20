(function () {
  const currentUser = sessionStorage.getItem("crm_session");
  // თუ მომხმარებელი არ არის შესული, გადავიყვანოთ ავტორიზაციის გვერდზე
  if (!currentUser) {
    alert("please log in first");
    window.location.href = "index.html";
  }
})();

function logout() {
  sessionStorage.removeItem("crm_session");
  window.location.href = "index.html";
}
