async function loadStudentApprovals() {

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
            document.getElementById("principal-approvals-body");

        tbody.innerHTML = "";

        const pendingStudents = students.filter(function (student) {
            return student.approval_status === "pending";
        });

        if (pendingStudents.length === 0) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="6">
                        No pending approvals.
                    </td>
                </tr>
            `;

            return;
        }

        pendingStudents.forEach(function (student) {

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
                    <span class="badge badge-pending">
                        Pending
                    </span>
                </td>

                <td>

                    <button
                        class="approve-btn"
                        onclick="updateApproval(${student.id}, 'approved')">
                        Approve
                    </button>

                    <button
                        class="reject-btn"
                        onclick="updateApproval(${student.id}, 'rejected')">
                        Reject
                    </button>

                </td>
            `;

            tbody.appendChild(row);

        });

    } catch (error) {

        console.error(
            "Student Approval Error:",
            error
        );

    }
}

async function updateApproval(studentId, status) {
    try {
        const response = await fetch(
            "http://127.0.0.1:8000/api/update-student-approval/",
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
               
                })
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Approval update failed.");
        }

        await loadStudentApprovals();
        await loadStudentCounts();

        alert(result.message);

    } catch (error) {
        console.error("Approval Update Error:", error);
        alert(error.message);
    }
}
