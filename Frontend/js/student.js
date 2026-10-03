document.addEventListener("DOMContentLoaded", function () {
  async function checkLogin() {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/me/", {
        credentials: "include",
      });
      if (response.status === 401) {
        window.location.href = "login.html";
      }
    } catch (error) {
      window.location.href = "login.html";
    }
  }
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
  async function loadAssignments() {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/my-assignments/",
        {
          credentials: "include",
        },
      );

      const data = await response.json();

      console.log("Assignments Data:", data);

      const assignmentTable = document.getElementById(
        "student-assignment-body",
      );

      assignmentTable.innerHTML = "";

      if (data.assignments.length === 0) {
        assignmentTable.innerHTML = `
        <tr>
          <td colspan="5">No assignments available.</td>
        </tr>
      `;
        return;
      }

      data.assignments.forEach(function (assignment) {
        const row = document.createElement("tr");

        row.innerHTML = `
        <td>${assignment.title}</td>

        <td>${assignment.subject}</td>

        <td>${assignment.due_date}</td>

       <td>
          <span class="status-badge ${assignment.status}">
            ${assignment.status}
          </span>
        </td>

        <td>
          <input
            type="file"
            id="file-${assignment.id}"
            class="assignment-file"
          >

          <button
            type="button"
            class="view-btn"
            onclick="submitAssignment(${assignment.id})"
          >
            Submit
          </button>
        </td>
      `;

        assignmentTable.appendChild(row);
      });
    } catch (error) {
      console.error("Assignments Error:", error);
    }
  }
  async function submitAssignment(assignmentId) {
    const fileInput = document.getElementById(`file-${assignmentId}`);

    if (!fileInput.files.length) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();

    formData.append("assignment_id", assignmentId);

    formData.append("soft_copy", fileInput.files[0]);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/submit-assignment/",
        {
          method: "POST",
          credentials: "include",
          body: formData,
        },
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Submission failed.");
        return;
      }

      alert("Assignment submitted successfully!");

      loadAssignments();
    } catch (error) {
      console.error("Submission Error:", error);

      alert("Unable to submit assignment.");
    }
  }
  window.submitAssignment = submitAssignment;
  async function loadResults() {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/my-results/", {
        credentials: "include",
      });

      const data = await response.json();

      console.log("Results Data:", data);

      const resultsSection = document.getElementById("results");

      const resultsTable = document.getElementById("results-body");

      resultsTable.innerHTML = "";

      data.results.forEach(function (result) {
        const row = document.createElement("tr");

        row.innerHTML = `
                <td>${result.semester}</td>
                <td>${result.subject}</td>
                <td>${result.marks}/${result.max_marks}</td>
                <td>${result.grade}</td>`;

        resultsTable.appendChild(row);
      });
    } catch (error) {
      console.error("Results Error:", error);
    }
  }
  async function loadNotices() {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/notices/", {
        credentials: "include",
      });

      const data = await response.json();

      console.log("Notices Data:", data);

      const noticesSection = document.getElementById("notices");

      const noticeContainer = noticesSection.querySelector(".notice-list");

      noticeContainer.innerHTML = "";

      data.notices.forEach(function (notice) {
        const noticeItem = document.createElement("div");

        noticeItem.className = "notice-item";

        noticeItem.innerHTML = `
                <h4>${notice.title}</h4>
                <p>${notice.message}</p>
                <small>${notice.posted_date}</small>
            `;

        noticeContainer.appendChild(noticeItem);
      });
    } catch (error) {
      console.error("Notices Error:", error);
    }
  }
  loadStudentData();
  loadAttendance();
  loadAssignments();
  loadResults();
  loadNotices();

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
  /* Dashboardr */
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
const logoutLink = document.querySelector('a[href="#logout"]');

logoutLink.onclick = async function (event) {
  event.preventDefault();

  try {
    await fetch("http://127.0.0.1:8000/api/logout/", {
      method: "POST",
      credentials: "include",
    });

    window.location.href = "login.html";
  } catch (error) {
    console.error("Logout Error:", error);
  }
};
