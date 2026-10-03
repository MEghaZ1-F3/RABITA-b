document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("assignment-branch")
    .addEventListener("change", loadAssignmentSubjects);

  document
    .getElementById("assignment-semester")
    .addEventListener("change", loadAssignmentSubjects);
  const navLinks = document.querySelectorAll(".sidebar-nav a");

  function showSection(sectionName) {
    document.getElementById("dashboard-section").classList.add("page-hidden");
    document.getElementById("students").classList.add("page-hidden");
    document.getElementById("attendance").classList.add("page-hidden");
    document.getElementById("assignments").classList.add("page-hidden");
    document.getElementById("submissions").classList.add("page-hidden");
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
      document.getElementById("assignments").classList.remove("page-hidden");
    }

    if (sectionName === "submissions") {
      document.getElementById("submissions").classList.remove("page-hidden");
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

  async function loadFacultyData() {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/me/", {
        credentials: "include",
      });

      if (response.status === 401) {
        window.location.href = "login.html";
        return;
      }

      const data = await response.json();

      console.log("Faculty Data:", data);
    } catch (error) {
      console.error("Faculty Data Error:", error);
    }
  }

  async function loadStudents() {
    try {
      const response = await fetch("http://127.0.0.1:8000/students/", {
        credentials: "include",
      });

      if (response.status === 401) {
        window.location.href = "login.html";
        return;
      }

      if (response.status === 403) {
        alert("Access denied");
        return;
      }

      const students = await response.json();

      console.log("Faculty Students:", students);
      const tableBody = document.getElementById("faculty-students-body");

      if (!tableBody) {
        console.error("Students table not found");
        return;
      }

      tableBody.innerHTML = "";

      students.forEach(function (student) {
        const row = document.createElement("tr");

        row.innerHTML = `
                <td>${student.name}</td>
                <td>${student.student_id || student.temporary_id || "-"}</td>
                <td>${student.branch || "-"}</td>
                <td>${student.semester || "-"}</td>
                <td>${student.approval_status}</td>
                <td><button class="student-view-btn"> View</button></td>
                `;

        tableBody.appendChild(row);
      });
    } catch (error) {
      console.error("Students Error:", error);
    }
  }
  async function loadMyStudentsAttendance() {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/my-students-attendance/",
        {
          credentials: "include",
        },
      );

      const data = await response.json();
      if (response.status === 401) {
        window.location.href = "login.html";
        return;
      }

      if (response.status === 403) {
        alert("Access denied");
        return;
      }

      console.log("my_students_attendance:", data);
      const attendanceBody = document.getElementById(
        "my-students-attendance-body",
      );

      attendanceBody.innerHTML = "";

      data.records.forEach(function (record) {
        const row = document.createElement("tr");

        const absent = record.total_classes - record.present_classes;

        row.innerHTML = `
                <td>${record.student}</td>
                <td>${record.subject}</td>
                <td>${record.present_classes}</td>
                <td>${absent}</td>
                <td>${record.percentage}%</td>
                <td><button class="view-btn">View</button></td>
                `;

        attendanceBody.appendChild(row);
      });
    } catch (error) {
      console.error("my_students_attendance Error:", error);
    }
  }
  async function loadAssignmentSubjects() {
    const branch = document.getElementById("assignment-branch").value;
    const semester = document.getElementById("assignment-semester").value;

    const subjectList = document.getElementById("assignment-subject-list");

    if (!branch || !semester) {
      subjectList.innerHTML = `
            <p class="empty-message">
                Select branch and semester to view subjects.
            </p>
        `;
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/faculty-subjects/?branch=${branch}&semester=${semester}`,
        {
          credentials: "include",
        },
      );

      if (response.status === 401) {
        window.location.href = "login.html";
        return;
      }

      if (response.status === 403) {
        alert("Access denied");
        return;
      }

      const data = await response.json();

      subjectList.innerHTML = "";

      if (data.subjects.length === 0) {
        subjectList.innerHTML = `
                <p class="empty-message">
                    No subjects found for this branch and semester.
                </p>
            `;

        return;
      }

      data.subjects.forEach(function (subject) {
        const card = document.createElement("div");

        card.className = "subject-card";

        card.textContent = subject.name;
        card.addEventListener("click", function () {
          const selectedSubject = subject;
          window.selectedSubjectId = selectedSubject.id;

          console.log("Selected Subject:", selectedSubject);

          document.getElementById("selected-assignment-subject").textContent =
            selectedSubject.name;

          document
            .getElementById("create-assignment-form")
            .classList.remove("page-hidden");
        });

        subjectList.appendChild(card);
      });
    } catch (error) {
      console.error("Subject Error:", error);

      subjectList.innerHTML = `
            <p class="empty-message">
                Unable to load subjects.
            </p>
        `;
    }
  }
  document
    .getElementById("create-assignment-btn")
    .addEventListener("click", async function () {
      const title = document.getElementById("assignment-title").value;

      const description = document.getElementById(
        "assignment-description",
      ).value;

      const dueDate = document.getElementById("assignment-due-date").value;

      if (!title || !dueDate) {
        alert("Please enter assignment title and due date.");
        return;
      }

      // Selected subject ID ko save karne ke liye
      if (!window.selectedSubjectId) {
        alert("Please select a subject first.");
        return;
      }

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/create-assignment/",
          {
            method: "POST",

            credentials: "include",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              subject_id: window.selectedSubjectId,
              title: title,
              description: description,
              due_date: dueDate,
            }),
          },
        );

        const data = await response.json();

        if (!response.ok) {
          alert(data.error || "Failed to create assignment.");
          return;
        }

        alert("Assignment created successfully!");

        console.log("Created Assignment:", data);
        await loadFacultyAssignments();
      } catch (error) {
        console.error("Create Assignment Error:", error);

        alert("Unable to create assignment.");
      }
    });
  async function loadFacultyAssignments() {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/faculty-assignments/",
        {
          credentials: "include",
        },
      );

      const data = await response.json();

      const tableBody = document.getElementById("faculty-assignment-body");

      tableBody.innerHTML = "";

      data.assignments.forEach(function (assignment) {
        const row = document.createElement("tr");

        row.innerHTML = `
                <td>${assignment.title}</td>
                <td>${assignment.subject}</td>
                <td>${assignment.due_date}</td>
                <td>0</td>
                <td>
                    <button class="view-btn">View</button>
                </td>
            `;

        tableBody.appendChild(row);
      });
    } catch (error) {
      console.error("Faculty Assignments Error:", error);
    }
  }
  async function loadFacultySubmissions() {
    try {

      const response = await fetch(
        "http://127.0.0.1:8000/api/faculty-submissions/",
        {
          credentials: "include"
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(data.error);
        return;
      }

      const tableBody = document.getElementById(
        "faculty-submission-body"
      );

      tableBody.innerHTML = "";

      if (data.submissions.length === 0) {

        tableBody.innerHTML = `
                <tr>
                    <td colspan="6">
                        No submissions yet.
                    </td>
                </tr>
            `;

        return;
      }

      data.submissions.forEach(function (submission) {

        const row = document.createElement("tr");

        row.innerHTML = `
                <td>${submission.student}</td>
                <td>${submission.assignment}</td>
                <td>${submission.subject}</td>
                <td>${submission.submitted_at}</td>
                <td>${submission.status}</td>
                <td>
                    <button
                        class="view-btn review-btn"
                        type="button">
                        Review
                    </button>
                </td>
            `;

        const reviewButton = row.querySelector(".review-btn");

        reviewButton.addEventListener("click", function () {

          document.getElementById(
            "review-submission-box"
          ).classList.remove("page-hidden");

          document.getElementById(
            "review-student"
          ).textContent = submission.student;

          document.getElementById(
            "review-assignment"
          ).textContent = submission.assignment;

          document.getElementById(
            "review-remarks"
          ).value = "";

          window.selectedSubmissionId = submission.id;

          console.log(
            "Selected Submission:",
            submission
          );
        });

        tableBody.appendChild(row);
      });

    } catch (error) {

      console.error(
        "Faculty Submissions Error:",
        error
      );
    }
  }
  async function reviewSubmission(status) {

    const submissionId = window.selectedSubmissionId;

    if (!submissionId) {
      alert("Please select a submission first.");
      return;
    }

    const remarks = document.getElementById(
      "review-remarks"
    ).value;

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/api/review-submission/",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            submission_id: submissionId,
            status: status,
            remarks: remarks
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Review failed.");
        return;
      }

      alert(
        status === "approved"
          ? "Assignment approved!"
          : "Assignment rejected!"
      );

      document
        .getElementById("review-submission-box")
        .classList.add("page-hidden");

      await loadFacultySubmissions();

    } catch (error) {

      console.error(
        "Review Submission Error:",
        error
      );

      alert("Unable to review submission.");
    }
  }
  document.getElementById(
    "approve-submission-btn"
  ).addEventListener("click", function () {

    reviewSubmission("approved");

  });


  document.getElementById(
    "reject-submission-btn"
  ).addEventListener("click", function () {

    reviewSubmission("rejected");

  });

  loadFacultyData();
  loadStudents();
  loadMyStudentsAttendance();
  loadFacultyAssignments();
  loadFacultySubmissions();
});
