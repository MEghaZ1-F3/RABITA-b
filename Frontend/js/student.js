document.addEventListener("DOMContentLoaded", function () {
  async function loadStudentData() {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/me/", {
        credentials: "include",
      });

      const data = await response.json();

      console.log("Student Data:", data);
      document.getElementById("semester-value").textContent =
        data.semester || "-";

      document.getElementById("student-name").textContent = data.username;

      document.getElementById("student-id").textContent =
        data.student_id || data.temporary_id || "Not Generated";

      document.getElementById("student-branch").textContent =
        data.branch || "Not Available";

      document.getElementById("student-semester").textContent = data.semester
        ? data.semester + "th Semester"
        : "Not Available";

      document.getElementById("student-entry").textContent =
        data.entry_type || "Not Available";

      document.getElementById("student-year").textContent =
        data.admission_year || "Not Available";
    } catch (error) {
      console.error("Student Data Error:", error);
    }
  }
  async function loadAttendance() {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/my-attendance/", {
        credentials: "include",
      });

      const data = await response.json();

      console.log("Attendance Data:", data);
      const attendanceBody = document.getElementById("attendance-body");

      attendanceBody.innerHTML = "";

      data.records.forEach(function (record) {
        const absent = record.total_classes - record.present_classes;

        const row = document.createElement("tr");

        row.innerHTML = `
        <td>${record.subject}</td>
        <td>${record.total_classes}</td>
        <td>${record.present_classes}</td>
        <td>${absent}</td>
        <td>${record.percentage}%</td>`;

        attendanceBody.appendChild(row);
      });
      document.getElementById("attendance-value").textContent =
        data.overall_percentage + "%";
    } catch (error) {
      console.error("Attendance Error:", error);
    }
  }
  loadStudentData();
  loadAttendance();

  console.log("Student Dashboard Loaded");
  /* Dashboard Cards*/
  document.getElementById("attendance-value").textContent = "95%";
  document.getElementById("assignments-value").textContent = "3";
  document.getElementById("cgpa-value").textContent = "8.2";
  /* Sections */
  const dashboardSection = document.querySelector(".welcome-section");
  const summarySection = document.querySelector(".summary-cards");
  const activitySection = document.querySelector(".recent-student-activity");

  const profileSection = document.getElementById("profile");
  const attendanceSection = document.getElementById("attendance");
  const assignmentsSection = document.getElementById("assignments");
  const resultsSection = document.getElementById("results");
  const noticesSection = document.getElementById("notices");
  /* Hide All Sections */
  function hideAllSections() {
    dashboardSection.style.display = "none";
    summarySection.style.display = "none";
    activitySection.style.display = "none";

    profileSection.style.display = "none";
    attendanceSection.style.display = "none";
    assignmentsSection.style.display = "none";
    resultsSection.style.display = "none";
    noticesSection.style.display = "none";
  }
  /* Dashboard */
  function showDashboard() {
    hideAllSections();

    dashboardSection.style.display = "block";
    summarySection.style.display = "grid";
    activitySection.style.display = "block";
  }
  /* Profile */
  document.querySelector('a[href="#profile"]').onclick = function (event) {
    event.preventDefault();

    hideAllSections();

    profileSection.style.display = "block";
  };
  /* Dashboard Button */
  document.querySelector('a[href="#dashboard"]').onclick = function (event) {
    event.preventDefault();

    showDashboard();
  };

  /* Attendance */
  document.querySelector('a[href="#attendance"]').onclick = function (event) {
    event.preventDefault();

    hideAllSections();

    attendanceSection.style.display = "block";
  };
  /* Assignments */
  document.querySelector('a[href="#assignments"]').onclick = function (event) {
    event.preventDefault();

    hideAllSections();

    assignmentsSection.style.display = "block";
  };
  /* Results */
  document.querySelector('a[href="#results"]').onclick = function (event) {
    event.preventDefault();

    hideAllSections();

    resultsSection.style.display = "block";
  };
  /* Notices */
  document.querySelector('a[href="#notices"]').onclick = function (event) {
    event.preventDefault();

    hideAllSections();

    noticesSection.style.display = "block";
  };
  /* Initial Page */
  const logoutLink = document.getElementById("logout-link");

  logoutLink.onclick = function (event) {
    event.preventDefault();

    const confirmLogout = confirm("Are you sure you want to logout?");

    if (confirmLogout) {
      window.location.href = "login.html";
    }
  };
  showDashboard();
});
