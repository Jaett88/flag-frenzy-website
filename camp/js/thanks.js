// Insert camper name into thank-you message
document.addEventListener("DOMContentLoaded", () => {
  const camperName = localStorage.getItem("camperName");
  if (camperName) {
    const greeting = document.getElementById("thank-you-greeting");
    greeting.textContent = `Thank you for registering ${camperName}!`;
    localStorage.removeItem("camperName"); // Clear after use
  }
});
