function changePassword(event) {
  // 1. თავიდან ავიცილოთ გვერდის გადატვირთვა (page reload)
  if (event) {
    event.preventDefault();
  }

  const currentPassword = document.getElementById("currentPassword").value;
  const newPassword = document.getElementById("newPassword").value;
  const confirmNewPassword = document.getElementById("confirmNewPassword").value;

  const currentUserEmail = sessionStorage.getItem("crm_session");

  if (!currentUserEmail) {
    alert("please log in first");
    return;
  }

  const users = localStorage.getItem("crm_users");
  const parsedUsers = JSON.parse(users);

  if (!parsedUsers) {
    alert("error");
    return;
  }

  // მოვძებნოთ მიმდინარე მომხმარებელი
  const currentUser = parsedUsers.find(user => user.email === currentUserEmail);

  if (!currentUser) {
    alert("User not found");
    return;
  }

  // 2. შევამოწმოთ ძველი პაროლის სისწორე
  if (currentUser.password !== currentPassword) {
    alert("მიმდინარე პაროლი არასწორია!");
    return;
  }

  // 3. შევამოწმოთ ახალი პაროლების თანხვედრა
  if (newPassword !== confirmNewPassword) {
    alert("ახალი პაროლები ერთმანეთს არ ემთხვევა!");
    return;
  }

  // 4. შევცვალოთ პაროლი და შევინახოთ
  currentUser.password = newPassword;
  localStorage.setItem("crm_users", JSON.stringify(parsedUsers));
  
  alert("password changed successfully");
  
  // ფორმის გასუფთავება
  document.getElementById("changePasswordForm").reset();
}
