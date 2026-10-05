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
      document.getElementById("assignments").classList.remove("page-hidden");
    }

    if (sectionName === "submissions") {
      document.getElementById("submissions").classList.remove("page-hidden");
    }
    if (sectionName === "results") {
      document.getElementById("results").classList.remove("page-hidden");
      loadSemesterResults();
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
                    <a
                        href="http://127.0.0.1:8000${submission.soft_copy_url}"
                        class="view-btn">
                        View File
                    </a>

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
    const hardCopyReceived = document.getElementById(
      "hard-copy-received"
    ).checked;

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
            remarks: remarks,
            hard_copy_received: hardCopyReceived
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
  async function loadResultStudents() {

    const semester = document.getElementById("result-semester").value;
    const studentSelect = document.getElementById("result-student");

    studentSelect.innerHTML =
      '<option value="">Select Student</option>';

    if (!semester) {
      return;
    }

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/students/",
        {
          credentials: "include"
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(data.error);
        return;
      }

      data
        .filter(function (student) {
          return String(student.semester) === semester;
        })
        .forEach(function (student) {

          const option = document.createElement("option");

          option.value = student.id;

          option.textContent =
            student.name + " - " +
            (student.student_id ||
              student.temporary_id ||
              "-");

          studentSelect.appendChild(option);
        });

    } catch (error) {

      console.error(
        "Result Students Error:",
        error
      );
    }
  }
  document
    .getElementById("result-semester")
    .addEventListener("change", loadResultStudents);
  async function loadResultSubjects() {
    const studentId = document.getElementById("result-student").value;
    const subjectSelect = document.getElementById("result-subject");

    subjectSelect.innerHTML =
      '<option value="">Select Subject</option>';

    if (!studentId) return;

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/students/",
        {
          credentials: "include"
        }
      );

      const students = await response.json();

      const student = students.find(
        item => String(item.id) === studentId
      );

      if (!student) return;

      const subjectResponse = await fetch(
        `http://127.0.0.1:8000/api/faculty-subjects/?branch=${student.branch}&semester=${student.semester}`,
        {
          credentials: "include"
        }
      );

      const data = await subjectResponse.json();

      data.subjects.forEach(function (subject) {
        const option = document.createElement("option");

        option.value = subject.id;
        option.textContent = subject.name;

        subjectSelect.appendChild(option);
      });

    }
    catch (error) {
      console.error("Result Subjects Error:", error);
    }
  }

  document
    .getElementById("result-student")
    .addEventListener("change", loadResultSubjects);
  document.getElementById("show-ct2").addEventListener("click", function () {

    document.getElementById("ct2-section").style.display = "block";

    this.style.display = "none";
  });
  async function loadSavedInternalMarks() {
    const studentId = document.getElementById("result-student").value;
    const subjectId = document.getElementById("result-subject").value;
    const semester = document.getElementById("result-semester").value;

    if (!studentId || !subjectId || !semester) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/get-internal-marks/?student_id=${studentId}&subject_id=${subjectId}&semester=${semester}`,
        {
          credentials: "include"
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(data.error);
        return;
      }

      document.getElementById("ct1-marks").value =
        data.ct1_marks || "";

      if (data.ct2_marks > 0) {
        document.getElementById("ct2-section").style.display = "block";
        document.getElementById("show-ct2").style.display = "none";
        document.getElementById("ct2-marks").value =
          data.ct2_marks;
      }

    } catch (error) {
      console.error("Load Internal Marks Error:", error);
    }
  }
  async function saveInternalMarks() {
    const studentId = document.getElementById("result-student").value;
    const subjectId = document.getElementById("result-subject").value;
    const semester = document.getElementById("result-semester").value;
    const ct1Marks = document.getElementById("ct1-marks").value;
    const ct2Marks = document.getElementById("ct2-marks").value || 0;
    if (Number(ct1Marks) < 0 || Number(ct1Marks) > 20) {
      alert("CT-1 marks must be between 0 and 20.");
      return;
    }

    if (Number(ct2Marks) < 0 || Number(ct2Marks) > 20) {
      alert("CT-2 marks must be between 0 and 20.");
      return;
    }

    if (!studentId || !subjectId || !semester || ct1Marks === "") {
      alert("Please fill all required fields.");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/save-internal-marks/",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            student_id: studentId,
            subject_id: subjectId,
            semester: semester,
            ct1_marks: Number(ct1Marks),
            ct2_marks: Number(ct2Marks)
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to save marks.");
        return;
      }

      alert("Internal marks of CT saved successfully!");

    } catch (error) {
      console.error("Save Internal Marks Error:", error);
      alert("Unable to save marks.");
    }
  }
  document
    .getElementById("save-result")
    .addEventListener("click", saveInternalMarks);
  document
    .getElementById("result-subject")
    .addEventListener("change", loadSavedInternalMarks);

  loadFacultyData();
  loadStudents();
  loadMyStudentsAttendance();
  loadFacultyAssignments();
  loadFacultySubmissions();
});
async function loadSemesterResults() {
  try {
    const response = await fetch(
      "http://127.0.0.1:8000/api/faculty-semesters-results/",
      {
        credentials: "include"
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(data.error);
      return;
    }

    const tbody = document.getElementById("semester-result-body");

    tbody.innerHTML = "";

    data.results.forEach(function (result) {
      const row = document.createElement("tr");

      let actionHTML = `
        <a href="${result.result_file}" target="_blank">
            View Result
        </a>
    `;

      if (result.status === "pending") {
        actionHTML += `
            <br><br>

            <button type="button"
                onclick="reviewSemesterResult(${result.id}, 'approved')">
                Approve
            </button>

            <button type="button"
                onclick="reviewSemesterResult(${result.id}, 'rejected')">
                Reject
            </button>
        `;
      }

      if (result.status === "rejected" && result.faculty_remarks) {
        actionHTML += `
            <br>
            <small>Reason: ${result.faculty_remarks}</small>
        `;
      }

      row.innerHTML = `
        <td>${result.student_name}</td>
        <td>${result.semester}</td>
        <td>
            <span class="result-status ${result.status}">
                ${result.status}
            </span>
        </td>
        <td>${actionHTML}</td>
    `;

      tbody.appendChild(row);
    });

  } catch (error) {
    console.error("Semester Results Error:", error);
  }
}
async function reviewSemesterResult(resultId, status) {
  let remarks = "";

  if (status === "rejected") {
    remarks = prompt("Enter rejection reason:");

    if (!remarks || !remarks.trim()) {
      alert("Rejection reason is required.");
      return;
    }
  }

  try {
    const response = await fetch(
      "http://127.0.0.1:8000/api/review-semester-result/",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          result_id: resultId,
          status: status,
          remarks: remarks
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || "Unable to review result.");
      return;
    }

    alert(
      status === "approved"
        ? "Result approved successfully!"
        : "Result rejected successfully!"
    );

    loadSemesterResults();

  } catch (error) {
    console.error("Review Result Error:", error);
    alert("Unable to review result.");
  }
}