// Active nav + year + mobile menu
(function () {
  const path = location.pathname.replace(/\/index\.html$/, "/");
  document.querySelectorAll(".nav-link").forEach((a) => {
    const href = a.getAttribute("href");
    if ((href === "/index.html" && path === "/") || href === path)
      a.classList.add("active");
  });
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
  const btn = document.getElementById("menuBtn"),
    mob = document.getElementById("mobileNav");
  if (btn && mob) {
    btn.addEventListener("click", () => mob.classList.toggle("hidden"));
  }
})();

document.addEventListener("DOMContentLoaded", function () {
  // Populate DOB dropdowns
  const daySelect = document.getElementById("dob-day");
  const monthSelect = document.getElementById("dob-month");
  const yearSelect = document.getElementById("dob-year");
  const ageInput = document.getElementById("camper-age");

  if (daySelect && monthSelect && yearSelect) {
    // Days
    for (let i = 1; i <= 31; i++) {
      const option = document.createElement("option");
      option.value = i;
      option.textContent = i;
      daySelect.appendChild(option);
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
      const option = document.createElement("option");
      option.value = index + 1;
      option.textContent = month;
      monthSelect.appendChild(option);
    });

    // Years (up to current year)
    const currentYear = new Date().getFullYear();
    for (let y = currentYear; y >= currentYear - 20; y--) {
      const option = document.createElement("option");
      option.value = y;
      option.textContent = y;
      yearSelect.appendChild(option);
    }

    // Auto-calculate age
    function updateAge() {
      const day = parseInt(daySelect.value);
      const month = parseInt(monthSelect.value);
      const year = parseInt(yearSelect.value);

      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        const today = new Date();
        let age = today.getFullYear() - year;
        const hasHadBirthday =
          today.getMonth() + 1 > month ||
          (today.getMonth() + 1 === month && today.getDate() >= day);

        if (!hasHadBirthday) age--;
        ageInput.value = age;
      }
    }

    daySelect.addEventListener("change", updateAge);
    monthSelect.addEventListener("change", updateAge);
    yearSelect.addEventListener("change", updateAge);
  }

  // Attendance toggle
  window.toggleDaySelect = function (show) {
    const daySelector = document.getElementById("day-selector");
    if (daySelector) {
      daySelector.classList.toggle("hidden", !show);
    }
  };

  // Apply Tailwind styling to all inputs
  const inputs = document.querySelectorAll("input, select, textarea");
  inputs.forEach((el) => {
    if (!el.classList.contains("input")) {
      el.classList.add(
        "w-full",
        "border",
        "border-gray-300",
        "rounded",
        "px-4",
        "py-2"
      );
    }
  });
});
