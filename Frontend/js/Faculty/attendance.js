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