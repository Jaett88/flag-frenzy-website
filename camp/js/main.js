// ===============================
// Flag Frenzy — Registration JS
// ===============================

// ===== Pricing Settings =====
const DAILY_RATE = 35;
const FULL_WEEK_RATE = 150;
const EARLY_BIRD_RATE = 135;
const SIBLING_DISCOUNT_FLAT = 10; // flat £10 off
const EARLY_BIRD_CUTOFF = new Date("2025-10-03T23:59:59"); // deadline 3 Oct

// ===== Utility Functions =====
function isEarlyBird() {
  return new Date() <= EARLY_BIRD_CUTOFF;
}

function toggleDaySelect(show) {
  const daySection = document.getElementById("day-selector");
  if (daySection) {
    daySection.classList.toggle("hidden", !show);
  }
  updatePaymentSummary();
}

function updatePaymentSummary() {
  const attendance = document.querySelector(
    "input[name='attendance']:checked"
  )?.value;
  const sibling = document.querySelector(
    "input[name='sibling']:checked"
  )?.value?.toLowerCase();
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

  // Flat sibling discount
  if (sibling === "yes") {
    baseTotal = Math.max(0, baseTotal - SIBLING_DISCOUNT_FLAT);
  }

  if (paymentDisplay) {
    let message = `Total Due: £${baseTotal.toFixed(2)}`;

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

// ===== DOMContentLoaded =====
document.addEventListener("DOMContentLoaded", () => {
  console.log("Flag Frenzy registration page loaded!");

  // Attendance radios
  const attendanceRadios = document.querySelectorAll(
    "input[name='attendance']"
  );
  attendanceRadios.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      toggleDaySelect(e.target.value === "Choose Dates");
      updatePaymentSummary();
    });
  });

  // Day checkboxes
  const dateCheckboxes = document.querySelectorAll(
    "input[name='selected-dates']"
  );
  dateCheckboxes.forEach((cb) =>
    cb.addEventListener("change", updatePaymentSummary)
  );

  // Sibling radios
  const siblingRadios = document.querySelectorAll("input[name='sibling']");
  siblingRadios.forEach((radio) =>
    radio.addEventListener("change", updatePaymentSummary)
  );

  // Initial UI state
  toggleDaySelect(false);
  updatePaymentSummary();

  // … (your DOB, medical, menu, footer year, Swiper code stays the same here)
});


  // DOB dropdowns (dynamic population)
  const dobDay = document.getElementById("dob-day");
  const dobMonth = document.getElementById("dob-month");
  const dobYear = document.getElementById("dob-year");
  const ageInput = document.querySelector("input[name='camper-age']");

  if (dobDay && dobMonth && dobYear && ageInput) {
    for (let d = 1; d <= 31; d++)
      dobDay.innerHTML += `<option value="${d}">${d}</option>`;

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

    const currentYear = new Date().getFullYear();
    const youngestYear = currentYear - 7;
    const oldestYear = currentYear - 15;
    for (let y = youngestYear; y >= oldestYear; y--) {
      dobYear.innerHTML += `<option value="${y}">${y}</option>`;
    }

    [dobDay, dobMonth, dobYear].forEach((el) => {
      el.addEventListener("change", () => {
        const day = parseInt(dobDay.value);
        const month = parseInt(dobMonth.value) - 1;
        const year = parseInt(dobYear.value);
        if (!day || !dobMonth.value || !year) return;

        const dob = new Date(year, month, day);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;

        ageInput.value = age;

        if (age < 7 || age > 15) {
          alert("Sorry, campers must be between 7 and 15 years old.");
        }
      });
    });
  }

  // Medical conditions ("None" logic)
  const noneCheckbox = document.querySelector(
    "input[name='medical-conditions'][value='None']"
  );
  const otherCheckboxes = Array.from(
    document.querySelectorAll("input[name='medical-conditions']")
  ).filter((cb) => cb.value !== "None");

  if (noneCheckbox) {
    noneCheckbox.addEventListener("change", () => {
      if (noneCheckbox.checked)
        otherCheckboxes.forEach((cb) => (cb.checked = false));
    });
    otherCheckboxes.forEach((cb) => {
      cb.addEventListener("change", () => {
        if (cb.checked) noneCheckbox.checked = false;
      });
    });
  }

  // Store camper name (for thank-you greeting)
  const registrationForm = document.querySelector(
    "form[name='camper-registration']"
  );
  if (registrationForm) {
    registrationForm.addEventListener("submit", () => {
      const camperName = document.querySelector(
        "input[name='camper-name']"
      )?.value;
      if (camperName) localStorage.setItem("camperName", camperName.trim());
    });
  }

  // Mobile menu toggle
  const menuBtn = document.getElementById("menuBtn");
  const mobileNav = document.getElementById("mobileNav");
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener("click", () =>
      mobileNav.classList.toggle("hidden")
    );
  }

  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Initial UI state
  toggleDaySelect(false);
  updatePaymentSummary();
});

// /camp/js/main.js
(function () {
  document.addEventListener("DOMContentLoaded", function () {
    const body = document.body;
    const menuBtn = document.getElementById("menuBtn");
    const mobileNav = document.getElementById("mobileNav");

    // ---------- Mobile menu ----------
    function openMenu() {
      if (!mobileNav) return;
      mobileNav.classList.add("is-open");
      body.classList.add("nav-open");
      if (menuBtn) menuBtn.setAttribute("aria-expanded", "true");
    }
    function closeMenu() {
      if (!mobileNav) return;
      mobileNav.classList.remove("is-open");
      body.classList.remove("nav-open");
      if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
    }
    function toggleMenu() {
      if (!mobileNav) return;
      if (mobileNav.classList.contains("is-open")) {
        closeMenu();
      } else {
        openMenu();
      }
      // Swiper may need to recalc after layout change
      requestAnimationFrame(() => {
        if (window.__heroSwiper) window.__heroSwiper.update();
      });
    }

    menuBtn && menuBtn.addEventListener("click", toggleMenu);

    // Close on ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });

    // Close when a link inside the mobile nav is clicked
    mobileNav &&
      mobileNav.addEventListener("click", (e) => {
        const t = e.target;
        if (t && t.tagName === "A") closeMenu();
      });

    // ---------- Swiper (hero) ----------
    if (typeof Swiper !== "undefined") {
      window.__heroSwiper = new Swiper(".hero-swiper", {
        loop: true,
        speed: 700,
        grabCursor: true,
        autoplay: { delay: 4000, disableOnInteraction: false },
        keyboard: { enabled: true },
        pagination: { el: ".hero-swiper .swiper-pagination", clickable: true },
        navigation: {
          nextEl: ".hero-swiper .swiper-button-next",
          prevEl: ".hero-swiper .swiper-button-prev",
        },
        a11y: { enabled: true },
      });

      // Recompute sizes on resize/orientation
      const updateSwiper = () =>
        window.__heroSwiper && window.__heroSwiper.update();
      window.addEventListener("resize", updateSwiper, { passive: true });
      window.addEventListener("orientationchange", () => {
        setTimeout(updateSwiper, 150);
      });

      // First paint safeguard (after images/layout settle)
      window.addEventListener("load", () => {
        setTimeout(updateSwiper, 60);
      });
    }
  });
})();
