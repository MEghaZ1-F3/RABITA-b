async function loadCollegeStudents() {

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/students/",
            {
                credentials: "include"
            }
        );

        const students = await response.json();

        if (!response.ok) {
            console.error(students.error);
            return;
        }

        const tbody =
            document.getElementById("college-students-body");

        tbody.innerHTML = "";

        if (students.length === 0) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="6">
                        No students found.
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
                    ${student.student_id ||
                student.temporary_id ||
                "-"}
                </td>

                <td>${student.branch || "-"}</td>

                <td>${student.semester || "-"}</td>

                <td>${student.entry_type || "-"}</td>

                <td>
                    <span class="badge">
                        ${student.approval_status}
                    </span>
                </td>
            `;

            tbody.appendChild(row);

        });

    } catch (error) {

        console.error(
            "Principal Students Error:",
            error
        );

    }
}


loadCollegeStudents();