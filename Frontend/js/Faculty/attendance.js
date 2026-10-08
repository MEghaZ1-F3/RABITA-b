const attendanceSemester = document.getElementById("attendance-semester");
const attendanceSubject = document.getElementById("attendance-subject");

attendanceSemester.addEventListener("change", async function () {

    const semester = attendanceSemester.value;

    // Subject dropdown reset
    attendanceSubject.innerHTML =
        '<option value="">Select Subject</option>';

    // Semester select nahi hai
    if (!semester) {
        return;
    }

    // Faculty branch available nahi hai
    if (!window.facultyBranch) {
        console.error("Faculty branch not loaded.");
        return;
    }

    try {

        const response = await fetch(
            `http://127.0.0.1:8000/api/faculty-subjects/?branch=${window.facultyBranch}&semester=${semester}`,
            {
                credentials: "include"
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error(data.error);
            return;
        }

        // Subjects dropdown mein add karna
        data.subjects.forEach(function (subject) {

            const option = document.createElement("option");

            option.value = subject.id;
            option.textContent = subject.name;

            attendanceSubject.appendChild(option);

        });

    } catch (error) {

        console.error("Attendance Subject Error:", error);

    }

});
async function loadAttendanceStudents() {

    const semester = attendanceSemester.value;
    const studentsBody = document.getElementById(
        "attendance-students-body"
    );

    studentsBody.innerHTML = "";

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

        const students = data.filter(function (student) {
            return String(student.semester) === semester;

        });

        const studentCount = document.getElementById("attendance-student-count");
        if (studentCount) {
            studentCount.textContent =
                `Total Students: ${students.length}`;
        }

        if (students.length === 0) {

            studentsBody.innerHTML = `
                <tr>
                    <td colspan="3">
                        No students found for this semester.
                    </td>
                </tr>
            `;

            return;
        }

        students.forEach(function (student) {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${student.name}</td>

                <td>
                    ${student.student_id || student.temporary_id || "-"}
                </td>

                <td>
                    <label>
                        <input
                            type="radio"
                            name="attendance-${student.id}"
                            value="present"
                        >
                        Present
                    </label>

                    <label>
                        <input
                            type="radio"
                            name="attendance-${student.id}"
                            value="absent"
                        >
                        Absent
                    </label>
                </td>
            `;

            studentsBody.appendChild(row);

        });

    } catch (error) {

        console.error(
            "Attendance Students Error:", error);

    }
}
attendanceSemester.addEventListener(
    "change",
    loadAttendanceStudents
);
async function saveAttendance() {

    const subjectId = attendanceSubject.value;
    const date = document.getElementById("attendance-date").value;
    const classNumber = document.getElementById(
        "attendance-class-number"
    ).value;

    if (!subjectId || !date || !classNumber) {
        alert("Please select subject, date and class number.");
        return;
    }

    const students = document.querySelectorAll(
        "#attendance-students-body tr"
    );

    if (students.length === 0) {
        alert("No students found.");
        return;
    }

    for (const row of students) {

        const radio = row.querySelector(
            'input[type="radio"]:checked'
        );

        if (!radio) {
            alert("Please mark attendance for every student.");
            return;
        }
    }

    try {

        for (const row of students) {

            const studentRadio = row.querySelector(
                'input[type="radio"]:checked'
            );

            const studentId = studentRadio
                .name
                .replace("attendance-", "");

            const status = studentRadio.value;

            const response = await fetch(
                "http://127.0.0.1:8000/api/save-attendance/",
                {
                    method: "POST",

                    credentials: "include",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        student_id: studentId,
                        subject_id: subjectId,
                        date: date,
                        class_number: classNumber,
                        status: status
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.error || "Failed to save attendance.");
                return;
            }
        }

        alert("Attendance saved successfully!");

    } catch (error) {

        console.error(
            "Save Attendance Error:",
            error
        );

        alert("Unable to save attendance.");
    }
}


document
    .getElementById("save-attendance")
    .addEventListener(
        "click",
        saveAttendance
    );

async function loadSavedAttendance() {

    const subjectId = attendanceSubject.value;
    const date = document.getElementById("attendance-date").value;
    const classNumber = document.getElementById(
        "attendance-class-number"
    ).value;

    if (!subjectId || !date || !classNumber) {
        return;
    }

    try {

        const response = await fetch(
            `http://127.0.0.1:8000/api/get-attendance/?subject_id=${subjectId}&date=${date}&class_number=${classNumber}`,
            {
                credentials: "include"
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error(data.error);
            return;
        }

        data.attendance.forEach(function (record) {

            const radio = document.querySelector(
                `input[name="attendance-${record.student_id}"][value="${record.status}"]`
            );

            if (radio) {
                radio.checked = true;
            }

        });

    } catch (error) {

        console.error(
            "Load Saved Attendance Error:",
            error
        );

    }
}
attendanceSubject.addEventListener(
    "change",
    loadSavedAttendance
);

document
    .getElementById("attendance-date")
    .addEventListener(
        "change",
        loadSavedAttendance
    );

document
    .getElementById("attendance-class-number")
    .addEventListener(
        "change",
        loadSavedAttendance
    );

// ADD ATTENDANCE CLASS//

const addClassButton = document.getElementById("add-attendance-class");
const classSelect = document.getElementById("attendance-class-number");

addClassButton.addEventListener("click", function () {

    const semester = attendanceSemester.value;

    if (!semester) {
        alert("Please select semester first.");
        return;
    }

    const nextClassNumber = classSelect.options.length;

    const option = document.createElement("option");

    option.value = nextClassNumber;
    option.textContent = `Class ${nextClassNumber}`;

    classSelect.appendChild(option);

    classSelect.value = nextClassNumber;

    console.log("Class Added:", nextClassNumber);
});

attendanceSubject.addEventListener("change", loadAttendanceStudents);

document
    .getElementById("attendance-class-number")
    .addEventListener("change", loadAttendanceStudents);