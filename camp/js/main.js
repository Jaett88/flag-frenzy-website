// ===== Scroll to top when logo clicked =====
document.addEventListener("DOMContentLoaded", () => {
  console.log("Flag Frenzy homepage loaded!");

  const logo = document.querySelector(".logo");
  if (logo) {
    logo.style.cursor = "pointer";
    logo.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  toggleDaySelect(false); // Hide day checkboxes by default

  const attendanceRadios = document.querySelectorAll(
    "input[name='attendance']"
  );
  const dateCheckboxes = document.querySelectorAll(
    "input[name='selected-dates']"
  );
  const dobInput = document.querySelector("input[name='dob']");
  const ageInput = document.querySelector("input[name='camper-age']");
  const siblingSelect = document.querySelector(
    "select[name='sibling-discount']"
  );

  // Toggle visibility and recalculate when attendance changes
  attendanceRadios.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      toggleDaySelect(e.target.value === "Choose Dates");
      updatePaymentSummary();
    });
  });

  // Update payment when dates change
  dateCheckboxes.forEach((cb) => {
    cb.addEventListener("change", updatePaymentSummary);
  });

  // Update payment when sibling discount changes
  siblingSelect?.addEventListener("change", updatePaymentSummary);

  // Auto-fill age and validate DOB
  dobInput?.addEventListener("change", () => {
    const dob = dobInput.value;
    if (!dob) return;

    const age = calculateAge(dob);
    ageInput.value = age;

    if (age < 7 || age > 15) {
      alert("Sorry, campers must be between 7 and 15 years old.");
    }
  });
});

// ===== Toggle Day Selector Visibility + Recalculate =====
function toggleDaySelect(show) {
  const daySection = document.getElementById("day-selector");
  if (daySection) {
    daySection.classList.toggle("hidden", !show);
  }
  updatePaymentSummary(); // ✅ Ensures pricing adjusts when switching view
}

// ===== Age Calculation =====
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

// ===== Payment Calculation =====
const DAILY_RATE = 30;
const FULL_WEEK_RATE = 135;
const EARLY_BIRD_RATE = 120;
const SIBLING_DISCOUNT_PERCENT = 0.1;
const EARLY_BIRD_CUTOFF = new Date("2025-09-27T23:59:59");

function isEarlyBird() {
  return new Date() <= EARLY_BIRD_CUTOFF;
}

function updatePaymentSummary() {
  const attendance = document.querySelector(
    "input[name='attendance']:checked"
  )?.value;
  const sibling = document.querySelector(
    "select[name='sibling-discount']"
  )?.value;
  const selectedDates = Array.from(
    document.querySelectorAll("input[name='selected-dates']:checked")
  );
  const paymentDisplay = document.getElementById("payment-summary");

  let baseTotal = 0;

  if (attendance === "Full Week") {
    baseTotal = isEarlyBird() ? EARLY_BIRD_RATE : FULL_WEEK_RATE;
  } else if (attendance === "Choose Dates") {
    baseTotal = selectedDates.length * DAILY_RATE;
  }

  if (sibling === "yes") {
    baseTotal -= baseTotal * SIBLING_DISCOUNT_PERCENT;
  }

  if (paymentDisplay) {
    paymentDisplay.textContent = `Total Due: £${baseTotal.toFixed(2)}`;
  }
}

// ===== Handle 'None' checkbox logic for medical conditions =====
document.addEventListener("DOMContentLoaded", () => {
  const noneCheckbox = document.querySelector(
    "input[name='medical-conditions'][value='None']"
  );
  const otherCheckboxes = Array.from(
    document.querySelectorAll("input[name='medical-conditions']")
  ).filter((cb) => cb.value !== "None");

  if (noneCheckbox) {
    // When 'None' is selected, uncheck others
    noneCheckbox.addEventListener("change", () => {
      if (noneCheckbox.checked) {
        otherCheckboxes.forEach((cb) => (cb.checked = false));
      }
    });

    // If any other box is checked, uncheck 'None'
    otherCheckboxes.forEach((cb) => {
      cb.addEventListener("change", () => {
        if (cb.checked) {
          noneCheckbox.checked = false;
        }
      });
    });
  }
});

// Store camper name before form submission
const registrationForm = document.querySelector(
  "form[name='camper-registration']"
);
if (registrationForm) {
  registrationForm.addEventListener("submit", () => {
    const camperName = document.querySelector(
      "input[name='camper-name']"
    )?.value;
    if (camperName) {
      localStorage.setItem("camperName", camperName);
    }
  });
}
