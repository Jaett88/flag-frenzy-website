// main.js

document.addEventListener("DOMContentLoaded", () => {
  console.log("Flag Frenzy homepage loaded!");

  // Example interactivity: scroll to top when logo clicked
  const logo = document.querySelector(".logo");
  if (logo) {
    logo.style.cursor = "pointer";
    logo.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});
