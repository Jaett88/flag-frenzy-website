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

function toggleDaySelect(show) {
  const daySection = document.getElementById("day-selector");
  if (daySection) {
    daySection.classList.toggle("hidden", !show);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  toggleDaySelect(false); // Hide by default
  const radios = document.querySelectorAll("input[name='attendance']");
  radios.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      toggleDaySelect(e.target.value === "Choose Dates");
    });
  });
});
