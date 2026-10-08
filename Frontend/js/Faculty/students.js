async function loadStudents() {
    try {
        const response = await fetch(
            "http://127.0.0.1:8000/students/",
            {
                credentials: "include",
            }
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

        const semester =
            document.getElementById("student-semester").value;

        // Semester select nahi kiya
        if (!semester) {
            document.getElementById("faculty-students-body").innerHTML = "";
            document.getElementById("student-count").textContent =
                "0 Students";
            return;
        }

        // Selected semester ke students
        const students = data.filter(function (student) {
            return String(student.semester) === semester;
        });

        console.log("Filtered Students:", students);

        const tableBody = document.getElementById(
            "faculty-students-body"
        );

        const studentCount =
            document.getElementById("student-count");

        tableBody.innerHTML = "";

        studentCount.textContent =
            `${students.length} ${students.length === 1 ? "Student" : "Students"
            }`;

        students.forEach(function (student) {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${student.name}</td>

                <td>
                    ${student.student_id ||
                student.temporary_id ||
                "-"}
                </td>

                <td>${student.branch || "-"}</td>

                <td>${student.semester || "-"}</td>

                <td>
                    <span class="student-status ${student.approval_status}">
                        ${student.approval_status}
                    </span>
                </td>

                <td>
                    <button class="student-view-btn">
                        View
                    </button>
                </td>
            `;

            const viewButton =
                row.querySelector(".student-view-btn");

            viewButton.addEventListener(
                "click",
                function () {

                    document.getElementById(
                        "detail-name"
                    ).textContent =
                        student.name || "-";

                    document.getElementById(
                        "detail-student-id"
                    ).textContent =
                        student.student_id ||
                        student.temporary_id ||
                        "-";

                    document.getElementById(
                        "detail-branch"
                    ).textContent =
                        student.branch || "-";

                    document.getElementById(
                        "detail-semester"
                    ).textContent =
                        student.semester || "-";

                    document.getElementById(
                        "detail-entry-type"
                    ).textContent =
                        student.entry_type || "-";

                    document.getElementById(
                        "detail-admission-year"
                    ).textContent =
                        student.admission_year || "-";

                    document.getElementById(
                        "detail-enrollment-number"
                    ).textContent =
                        student.enrollment_number || "-";

                    document.getElementById(
                        "detail-approval-status"
                    ).textContent =
                        student.approval_status || "-";

                    document
                        .getElementById(
                            "student-details-modal"
                        )
                        .classList.remove("page-hidden");
                }
            );

            tableBody.appendChild(row);
        });

    } catch (error) {

        console.error(
            "Students Error:",
            error
        );
    }
}


/* Semester Change */

document
    .getElementById("student-semester")
    .addEventListener(
        "change",
        loadStudents
    );


/* Close Student Details Modal */

document
    .getElementById("close-student-modal")
    .addEventListener(
        "click",
        function () {

            document
                .getElementById(
                    "student-details-modal"
                )
                .classList.add("page-hidden");
        }
    );