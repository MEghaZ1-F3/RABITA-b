async function loadCollegeStudents() {
    const branchSelect = document.getElementById("principal-student-branch");
    const semesterSelect = document.getElementById("principal-student-semester");
    const approvedBody = document.getElementById("principal-approved-students-body");
    const rejectedBody = document.getElementById("principal-rejected-students-body");

    const branch = branchSelect.value;
    const semester = semesterSelect.value;

    if (!branch || !semester) {
        approvedBody.innerHTML =
            '<tr><td colspan="4">Select branch and semester.</td></tr>';
        rejectedBody.innerHTML =
            '<tr><td colspan="4">Select branch and semester.</td></tr>';
        return;
    }

    try {
        const response = await fetch("http://127.0.0.1:8000/students/", {
            credentials: "include"
        });

        const students = await response.json();

        if (!response.ok) {
            throw new Error(students.error || "Unable to load students.");
        }

        const filteredStudents = students.filter(student =>
            student.branch === branch &&
            String(student.semester) === semester
        );

        function renderStudents(list, tbody) {
            if (list.length === 0) {
                tbody.innerHTML =
                    '<tr><td colspan="4">No students found.</td></tr>';
                return;
            }

            tbody.innerHTML = "";

            list.forEach(student => {
                const row = document.createElement("tr");

                const values = [
                    student.name || "-",
                    student.student_id || student.temporary_id || "-",
                    student.entry_type || "-",
                    student.approval_status || "-"
                ];

                values.forEach(value => {
                    const cell = document.createElement("td");
                    cell.textContent = value;
                    row.appendChild(cell);
                });

                tbody.appendChild(row);
            });
        }

        renderStudents(
            filteredStudents.filter(s => s.approval_status === "approved"),
            approvedBody
        );

        renderStudents(
            filteredStudents.filter(s => s.approval_status === "rejected"),
            rejectedBody
        );

    } catch (error) {
        console.error("Principal Students Error:", error);
        approvedBody.innerHTML =
            '<tr><td colspan="4">Failed to load students.</td></tr>';
        rejectedBody.innerHTML =
            '<tr><td colspan="4">Failed to load students.</td></tr>';
    }
}

document.getElementById("principal-student-branch")
    .addEventListener("change", loadCollegeStudents);

document.getElementById("principal-student-semester")
    .addEventListener("change", loadCollegeStudents);