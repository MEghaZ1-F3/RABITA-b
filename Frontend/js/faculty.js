document.addEventListener("DOMContentLoaded", function () {

  const navLinks = document.querySelectorAll(".sidebar-nav a");

  function showSection(sectionName) {
    document.getElementById("dashboard-section").classList.add("page-hidden");
    document.getElementById("students").classList.add("page-hidden");
    document.getElementById("attendance").classList.add("page-hidden");
    document.getElementById("assignments").classList.add("page-hidden");
    document.getElementById("submissions").classList.add("page-hidden");
    document.getElementById("results").classList.add("page-hidden");
    document.getElementById("notices").classList.add("page-hidden");
    document.getElementById("reports").classList.add("page-hidden");

    if (sectionName === "dashboard") {
      document
        .getElementById("dashboard-section")
        .classList.remove("page-hidden");
    }

    if (sectionName === "students") {
      document.getElementById("students").classList.remove("page-hidden");
    }

    if (sectionName === "attendance") {
      document.getElementById("attendance").classList.remove("page-hidden");
    }

    if (sectionName === "assignments") {
      console.log("ASSIGNMENTS CLICKED");
      document.getElementById("assignments").classList.remove("page-hidden");
    }

    if (sectionName === "submissions") {
      document.getElementById("submissions").classList.remove("page-hidden");
    }
    if (sectionName === "results") {
      document.getElementById("results").classList.remove("page-hidden");
    }

    if (sectionName === "notices") {
      document.getElementById("notices").classList.remove("page-hidden");
    }
    if (sectionName === "reports") {
      document.getElementById("reports").classList.remove("page-hidden");
    }

    navLinks.forEach(function (item) {
      item.classList.remove("active");
    });

    const activeLink = document.querySelector(
      '.sidebar-nav a[href="#' + sectionName + '"]',
    );

    if (activeLink) {
      activeLink.classList.add("active");
    }
  }

  navLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();

      const sectionName = this.getAttribute("href").substring(1);

      if (sectionName === "logout") {
        fetch("http://127.0.0.1:8000/api/logout/", {
          method: "POST",
          credentials: "include",
        })
          .then(function () {
            window.location.href = "login.html";
          })
          .catch(function (error) {
            console.error("Logout Error:", error);
          });

        return;
      }

      showSection(sectionName);
    });
  });

  showSection("dashboard");
  console.log("Faculty Dashboard Loaded");

});