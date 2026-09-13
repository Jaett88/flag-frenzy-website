// ===============================
// Flag Frenzy Football Camp
// Main JavaScript
// ===============================

// ===============================
// PRICING
// ===============================

const DAILY_RATE = 35;
const FULL_WEEK_RATE = 150;
const EARLY_BIRD_RATE = 135;
const SIBLING_DISCOUNT_FLAT = 10;

// Add the 2026 Early Bird deadline once confirmed.
const EARLY_BIRD_CUTOFF = null;

// ===============================
// PRICING FUNCTIONS
// ===============================

function isEarlyBird() {
  if (!EARLY_BIRD_CUTOFF) return false;

  return new Date() <= EARLY_BIRD_CUTOFF;
}

function toggleDaySelect(show) {
  const daySection = document.getElementById("day-selector");

  if (daySection) {
    daySection.classList.toggle("hidden", !show);
  }
}

function updatePaymentSummary() {
  const attendance = document.querySelector(
    "input[name='attendance']:checked",
  )?.value;

  const sibling = document
    .querySelector("input[name='sibling']:checked")
    ?.value?.toLowerCase();

  const selectedDates = Array.from(
    document.querySelectorAll("input[name='selected-dates']:checked"),
  );

  const paymentDisplay = document.getElementById("payment-summary");

  if (!paymentDisplay) return;

  let total = 0;

  if (attendance === "Full Week") {
    total = isEarlyBird() ? EARLY_BIRD_RATE : FULL_WEEK_RATE;
  }

  if (attendance === "Choose Dates") {
    total = selectedDates.length * DAILY_RATE;
  }

  if (sibling === "yes") {
    total = Math.max(0, total - SIBLING_DISCOUNT_FLAT);
  }

  let message = `Total Due: £${total.toFixed(2)}`;

  if (attendance === "Full Week" && isEarlyBird() && EARLY_BIRD_CUTOFF) {
    const cutoff = EARLY_BIRD_CUTOFF.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });

    message += `\n(Early-bird ends ${cutoff})`;
  }

  paymentDisplay.textContent = message;
}

// ===============================
// PAGE INITIALISATION
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  // ===============================
  // MOBILE NAVIGATION
  // ===============================

  const body = document.body;
  const menuBtn = document.getElementById("menuBtn");
  const mobileNav = document.getElementById("mobileNav");

  function openMenu() {
    if (!mobileNav) return;

    mobileNav.classList.add("is-open");
    body.classList.add("nav-open");

    menuBtn?.setAttribute("aria-expanded", "true");

    window.__heroSwiper?.update();
  }

  function closeMenu() {
    if (!mobileNav) return;

    mobileNav.classList.remove("is-open");
    body.classList.remove("nav-open");

    menuBtn?.setAttribute("aria-expanded", "false");

    window.__heroSwiper?.update();
  }

  function toggleMenu() {
    if (!mobileNav) return;

    mobileNav.classList.contains("is-open") ? closeMenu() : openMenu();
  }

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener("click", toggleMenu);

    mobileNav.addEventListener("click", (event) => {
      if (event.target && event.target.tagName === "A") {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });
  }

  // ===============================
  // HERO SWIPER
  // ===============================

  const heroSwiper = document.querySelector(".hero-swiper");

  if (heroSwiper && typeof Swiper !== "undefined") {
    window.__heroSwiper = new Swiper(".hero-swiper", {
      loop: true,
      speed: 700,
      grabCursor: true,

      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },

      keyboard: {
        enabled: true,
      },

      pagination: {
        el: ".hero-swiper .swiper-pagination",
        clickable: true,
      },

      navigation: {
        nextEl: ".hero-swiper .swiper-button-next",

        prevEl: ".hero-swiper .swiper-button-prev",
      },

      a11y: {
        enabled: true,
      },
    });

    const updateSwiper = () => {
      window.__heroSwiper?.update();
    };

    window.addEventListener("resize", updateSwiper, { passive: true });

    window.addEventListener("orientationchange", () => {
      setTimeout(updateSwiper, 150);
    });

    window.addEventListener("load", () => {
      setTimeout(updateSwiper, 60);
    });
  }

  // ===============================
  // FOOTER YEAR
  // ===============================

  document.querySelectorAll("#year").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  // ===============================
  // REGISTRATION — ATTENDANCE
  // ===============================

  document.querySelectorAll("input[name='attendance']").forEach((radio) => {
    radio.addEventListener("change", (event) => {
      toggleDaySelect(event.target.value === "Choose Dates");

      updatePaymentSummary();
    });
  });

  document
    .querySelectorAll("input[name='selected-dates']")
    .forEach((checkbox) => {
      checkbox.addEventListener("change", updatePaymentSummary);
    });

  document.querySelectorAll("input[name='sibling']").forEach((radio) => {
    radio.addEventListener("change", updatePaymentSummary);
  });

  // ===============================
  // CAMPER DATE OF BIRTH / AGE
  // ===============================

  const dobDay = document.getElementById("dob-day");

  const dobMonth = document.getElementById("dob-month");

  const dobYear = document.getElementById("dob-year");

  const ageInput = document.querySelector("input[name='camper-age']");

  if (dobDay && dobMonth && dobYear && ageInput) {
    // Days
    for (let day = 1; day <= 31; day++) {
      dobDay.insertAdjacentHTML(
        "beforeend",
        `<option value="${day}">${day}</option>`,
      );
    }

    // Months
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

    months.forEach((month, index) => {
      dobMonth.insertAdjacentHTML(
        "beforeend",
        `<option value="${index + 1}">${month}</option>`,
      );
    });

    // Years
    const currentYear = new Date().getFullYear();

    for (let year = currentYear - 6; year >= currentYear - 16; year--) {
      dobYear.insertAdjacentHTML(
        "beforeend",
        `<option value="${year}">${year}</option>`,
      );
    }

    // ===============================
    // AGE AT START OF CAMP
    // ===============================

    function calculateCamperAge() {
      const day = parseInt(dobDay.value, 10);

      const month = parseInt(dobMonth.value, 10) - 1;

      const year = parseInt(dobYear.value, 10);

      if (!day || !dobMonth.value || !year) {
        return;
      }

      const dob = new Date(year, month, day);

      /*
       * Earliest possible October 2026
       * camp start date.
       *
       * Week 1:
       * 19–23 October 2026
       *
       * Week 2:
       * 26–30 October 2026
       *
       * Once the final camp week is confirmed,
       * update this date if Week 2 is selected.
       */

      const campStartDate = new Date(2026, 9, 19);

      let age = campStartDate.getFullYear() - dob.getFullYear();

      const monthDifference = campStartDate.getMonth() - dob.getMonth();

      if (
        monthDifference < 0 ||
        (monthDifference === 0 && campStartDate.getDate() < dob.getDate())
      ) {
        age--;
      }

      ageInput.value = age;

      if (age < 7 || age > 15) {
        alert("Sorry, campers must be aged 7–15 at the start of camp.");
      }
    }

    [dobDay, dobMonth, dobYear].forEach((element) => {
      element.addEventListener("change", calculateCamperAge);
    });
  }

  // ===============================
  // MEDICAL CONDITIONS
  // ===============================

  const noneCheckbox = document.querySelector(
    "input[name='medical-conditions'][value='None']",
  );

  const otherCheckboxes = Array.from(
    document.querySelectorAll("input[name='medical-conditions']"),
  ).filter((checkbox) => checkbox.value !== "None");

  if (noneCheckbox) {
    noneCheckbox.addEventListener("change", () => {
      if (noneCheckbox.checked) {
        otherCheckboxes.forEach((checkbox) => {
          checkbox.checked = false;
        });
      }
    });

    otherCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
          noneCheckbox.checked = false;
        }
      });
    });
  }

  // ===============================
  // SAVE CAMPER NAME
  // ===============================

  const registrationForm = document.querySelector(
    "form[name='camper-registration']",
  );

  if (registrationForm) {
    registrationForm.addEventListener("submit", () => {
      const camperName = document.querySelector(
        "input[name='camper-name']",
      )?.value;

      if (camperName) {
        localStorage.setItem("camperName", camperName.trim());
      }
    });
  }

  // ===============================
  // INITIAL REGISTRATION STATE
  // ===============================

  toggleDaySelect(false);
  updatePaymentSummary();
});
