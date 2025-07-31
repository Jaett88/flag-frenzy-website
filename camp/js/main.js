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

// ===== Toggle Day Selector Visibility =====
function toggleDaySelect(show) {
  const daySection = document.getElementById("day-selector");
  const paymentSummary = document.getElementById("payment-summary");
  if (daySection) {
    daySection.classList.toggle("hidden", !show);
  }
  if (paymentSummary) {
    paymentSummary.textContent = show ? "Total Due: £0" : "Total Due: £100";
  }
}

// ===== Age Auto-Validation Based on DOB =====
function calculateAge(dobStr) {
  const today = new Date();
  const dob = new Date(dobStr);
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

document.addEventListener("DOMContentLoaded", () => {
  toggleDaySelect(false); // Hide day checkboxes by default

  const attendanceRadios = document.querySelectorAll(
    "input[name='attendance']"
  );
  const dateCheckboxes = document.querySelectorAll(
    "input[name='selected-dates']"
  );
  const dobInput = document.querySelector("input[name='dob']");
  const ageInput = document.querySelector("input[name='camper-age']");
  const paymentSummary = document.getElementById("payment-summary");

  // Toggle day selector when changing attendance type
  attendanceRadios.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      toggleDaySelect(e.target.value === "Choose Dates");
    });
  });

  // Auto-fill age + validate
  dobInput?.addEventListener("change", () => {
    const dob = dobInput.value;
    if (!dob) return;

    const age = calculateAge(dob);
    ageInput.value = age;

    if (age < 7 || age > 15) {
      alert("Sorry, campers must be between 7 and 15 years old.");
    }
  });

  // Calculate payment summary
  dateCheckboxes.forEach((box) => {
    box.addEventListener("change", () => {
      const selected = Array.from(dateCheckboxes).filter(
        (cb) => cb.checked
      ).length;
      const total = selected * 20;
      if (paymentSummary) {
        paymentSummary.textContent = `Total Due: £${total}`;
      }
    });
  });
});
