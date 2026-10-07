async function loadAssignments() {

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/api/my-assignments/",
            {
                credentials: "include",
            }
        );

        const data = await response.json();

        console.log("Assignments Data:", data);

        const assignmentTable =
            document.getElementById("student-assignment-body");

        assignmentTable.innerHTML = "";

        if (data.assignments.length === 0) {

            assignmentTable.innerHTML = `
                <tr>
                    <td colspan="5">
                        No assignments available.
                    </td>
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

                    <br>

                    <small>
                        ${assignment.hard_copy_received
                    ? "✓ Hard Copy Received"
                    : "Hard Copy Pending"
                }
                    </small>

                    ${assignment.professor_remarks
                    ? `
                                <br>
                                <small>
                                    Reason: ${assignment.professor_remarks}
                                </small>
                              `
                    : ""
                }
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

        console.error(
            "Assignments Error:",
            error
        );

    }
}