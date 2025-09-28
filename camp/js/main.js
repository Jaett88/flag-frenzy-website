// ===============================
// Flag Frenzy — Main JS (camp)
// ===============================

// ===== Pricing Settings =====
const DAILY_RATE = 35;
const FULL_WEEK_RATE = 150;
const EARLY_BIRD_RATE = 135;
const SIBLING_DISCOUNT_FLAT = 10; // flat £10 off
const EARLY_BIRD_CUTOFF = new Date("2025-10-10T23:59:59");

// ===== Utilities =====
function isEarlyBird() {
  return new Date() <= EARLY_BIRD_CUTOFF;
}
function toggleDaySelect(show) {
  const daySection = document.getElementById("day-selector");
  if (daySection) daySection.classList.toggle("hidden", !show);
}
function updatePaymentSummary() {
  const attendance = document.querySelector(
    "input[name='attendance']:checked"
  )?.value;
  const sibling = document
    .querySelector("input[name='sibling']:checked")
    ?.value?.toLowerCase();
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
  if (sibling === "yes")
    baseTotal = Math.max(0, baseTotal - SIBLING_DISCOUNT_FLAT);

  if (paymentDisplay) {
    let msg = `Total Due: £${baseTotal.toFixed(2)}`;
    if (attendance === "Full Week" && isEarlyBird()) {
      const cutoffStr = EARLY_BIRD_CUTOFF.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      });
      msg += `\n(Early-bird ends ${cutoffStr})`;
    }
    paymentDisplay.textContent = msg;
  }
}

// ===== Init =====
document.addEventListener("DOMContentLoaded", () => {
  // --- Mobile nav (single source of truth: uses .is-open + body.nav-open)
  const body = document.body;
  const menuBtn = document.getElementById("menuBtn");
  const mobileNav = document.getElementById("mobileNav");

  function openMenu() {
    if (!mobileNav) return;
    mobileNav.classList.add("is-open");
    body.classList.add("nav-open");
    menuBtn?.setAttribute("aria-expanded", "true");
    if (window.__heroSwiper) window.__heroSwiper.update();
  }
  function closeMenu() {
    if (!mobileNav) return;
    mobileNav.classList.remove("is-open");
    body.classList.remove("nav-open");
    menuBtn?.setAttribute("aria-expanded", "false");
    if (window.__heroSwiper) window.__heroSwiper.update();
  }
  function toggleMenu() {
    if (!mobileNav) return;
    mobileNav.classList.contains("is-open") ? closeMenu() : openMenu();
  }

  if (menuBtn) {
    menuBtn.addEventListener("click", toggleMenu);
    // Close menu when a link is tapped
    mobileNav?.addEventListener("click", (e) => {
      if (e.target && e.target.tagName === "A") closeMenu();
    });
    // Esc to close
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
  }

  // --- Swiper (hero)
  const hasHero = document.querySelector(".hero-swiper");
  if (hasHero && typeof Swiper !== "undefined") {
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

    const updateSwiper = () =>
      window.__heroSwiper && window.__heroSwiper.update();
    window.addEventListener("resize", updateSwiper, { passive: true });
    window.addEventListener("orientationchange", () =>
      setTimeout(updateSwiper, 150)
    );
    window.addEventListener("load", () => setTimeout(updateSwiper, 60));
  }

  // --- Registration form logic (guards keep this harmless on non-form pages)

  // Attendance radios
  document.querySelectorAll("input[name='attendance']").forEach((radio) => {
    radio.addEventListener("change", (e) => {
      toggleDaySelect(e.target.value === "Choose Dates");
      updatePaymentSummary();
    });
  });

  // Day checkboxes
  document
    .querySelectorAll("input[name='selected-dates']")
    .forEach((cb) => cb.addEventListener("change", updatePaymentSummary));

  // Sibling radios
  document
    .querySelectorAll("input[name='sibling']")
    .forEach((radio) => radio.addEventListener("change", updatePaymentSummary));

  // DOB dropdowns + age calc
  const dobDay = document.getElementById("dob-day");
  const dobMonth = document.getElementById("dob-month");
  const dobYear = document.getElementById("dob-year");
  const ageInput = document.querySelector("input[name='camper-age']");
  if (dobDay && dobMonth && dobYear && ageInput) {
    for (let d = 1; d <= 31; d++)
      dobDay.innerHTML += `<option value="${d}">${d}</option>`;
    [
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
    ].forEach(
      (m, i) => (dobMonth.innerHTML += `<option value="${i + 1}">${m}</option>`)
    );

    const currentYear = new Date().getFullYear();
    for (let y = currentYear - 7; y >= currentYear - 15; y--) {
      dobYear.innerHTML += `<option value="${y}">${y}</option>`;
    }

    [dobDay, dobMonth, dobYear].forEach((el) => {
      el.addEventListener("change", () => {
        const day = parseInt(dobDay.value, 10);
        const month = parseInt(dobMonth.value, 10) - 1;
        const year = parseInt(dobYear.value, 10);
        if (!day || !dobMonth.value || !year) return;

        const dob = new Date(year, month, day);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
        ageInput.value = age;

        if (age < 7 || age > 15)
          alert("Sorry, campers must be between 7 and 15 years old.");
      });
    });
  }

  // Medical conditions "None" shortcut
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
    otherCheckboxes.forEach((cb) =>
      cb.addEventListener("change", () => {
        if (cb.checked) noneCheckbox.checked = false;
      })
    );
  }

  // Thank-you page greeting
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

  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Initial UI state for form pages
  toggleDaySelect(false);
  updatePaymentSummary();
});
