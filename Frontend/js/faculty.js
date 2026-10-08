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