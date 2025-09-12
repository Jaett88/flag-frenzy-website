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
});

document.addEventListener("DOMContentLoaded", () => {
  const dobDay = document.getElementById("dob-day");
  const dobMonth = document.getElementById("dob-month");
  const dobYear = document.getElementById("dob-year");
  const ageInput = document.querySelector("input[name='camper-age']");

  // Populate day options (1–31)
  for (let d = 1; d <= 31; d++) {
    dobDay.innerHTML += `<option value="${d}">${d}</option>`;
  }

  // Populate month options (1–12)
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  months.forEach((month, i) => {
    dobMonth.innerHTML += `<option value="${i + 1}">${month}</option>`;
  });

  // Populate year options (2009 to current year)
  const currentYear = new Date().getFullYear();
  for (let y = 2009; y <= currentYear; y++) {
    dobYear.innerHTML += `<option value="${y}">${y}</option>`;
  }

  // Watch for changes to validate age
  [dobDay, dobMonth, dobYear].forEach((el) => {
    el.addEventListener("change", () => {
      const day = parseInt(dobDay.value);
      const month = parseInt(dobMonth.value) - 1; // JS months are 0-indexed
      const year = parseInt(dobYear.value);

      if (!day || !month || !year) return;

      const dob = new Date(year, month, day);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
      }

      // Display age in input field
      ageInput.value = age;

      // Validate age range
      if (age < 7 || age > 15) {
        alert("Sorry, campers must be between 7 and 15 years old.");
      }
    });
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

// ===== Payment Calculation =====
const DAILY_RATE = 35;
const FULL_WEEK_RATE = 150; // standard week
const EARLY_BIRD_RATE = 135; // early-bird week
const SIBLING_DISCOUNT_PERCENT = 0.1; // keep as-is for now (10%)
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

  // Apply sibling % discount if chosen (kept from your current logic)
  if (sibling === "yes") {
    baseTotal -= baseTotal * SIBLING_DISCOUNT_PERCENT;
  }

  if (paymentDisplay) {
    // Build the main total line
    let message = `Total Due: £${baseTotal.toFixed(2)}`;

    // Append early-bird reminder if still active and "Full Week" selected
    if (attendance === "Full Week" && isEarlyBird()) {
      const cutoffStr = EARLY_BIRD_CUTOFF.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      });
      message += `\n(Early-bird ends ${cutoffStr})`;
    }

    paymentDisplay.textContent = message;
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

document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById("menuBtn");
  const mobileNav = document.getElementById("mobileNav");
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener("click", () =>
      mobileNav.classList.toggle("hidden")
    );
  }
});

// Auto-update footer year
document.addEventListener("DOMContentLoaded", function () {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});
