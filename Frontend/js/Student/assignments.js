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
async function submitAssignment(assignmentId) {

    const fileInput =
        document.getElementById(`file-${assignmentId}`);

    if (!fileInput.files.length) {
        alert("Please select a file first.");
        return;
    }

    const formData = new FormData();

    formData.append(
        "assignment_id",
        assignmentId
    );

    formData.append(
        "soft_copy",
        fileInput.files[0]
    );

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/api/submit-assignment/",
            {
                method: "POST",
                credentials: "include",
                body: formData,
            }
        );

        const data = await response.json();

        if (!response.ok) {

            alert(
                data.error ||
                "Submission failed."
            );

            return;
        }

        alert(
            "Assignment submitted successfully!"
        );

        loadAssignments();

    } catch (error) {

        console.error(
            "Submission Error:",
            error
        );

        alert(
            "Unable to submit assignment."
        );
    }
}

window.submitAssignment = submitAssignment;