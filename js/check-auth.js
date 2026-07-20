(function () {
  const currentUser = sessionStorage.getItem("currentUserEmail");
  // თუ მომხმარებელი არ არის შესული, გადავიყვანოთ ავტორიზაციის გვერდზე
  if (!currentUser) {
    alert("please log in first");
    window.location.href = "index.html";
  }
})();

function logout() {
  sessionStorage.removeItem("currentUserEmail");
  window.location.href = "index.html";
}
