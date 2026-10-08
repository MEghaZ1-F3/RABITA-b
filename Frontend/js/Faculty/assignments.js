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
                <td>${assignment.submissions_count || 0}</td>
                <td>
                    <button class="view-btn" data-assignment-id="${assignment.id}">View</button>
                </td>
            `;

            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Faculty Assignments Error:", error);
    }
}

document
    .getElementById("assignment-branch")
    .addEventListener("change", loadAssignmentSubjects);

document
    .getElementById("assignment-semester")
    .addEventListener("change", loadAssignmentSubjects);

loadFacultyAssignments();

document.addEventListener("click", async function (event) {

    if (!event.target.classList.contains("view-btn")) {
        return;
    }

    const assignmentId = event.target.dataset.assignmentId;

    if (!assignmentId) {
        return;
    }

    console.log("Selected Assignment ID:", assignmentId);

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/api/faculty-submissions/",
            {
                credentials: "include"
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.error || "Unable to load submissions.");
            return;
        }

        const submissions = data.submissions.filter(function (submission) {
            return submission.assignment_id == assignmentId;
        });

        console.log(
            "Selected Assignment Submissions:",
            submissions
        );

        const tableBody = document.getElementById(
            "faculty-submission-body"
        );

        tableBody.innerHTML = "";

        if (submissions.length === 0) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="6">
                        No submissions for this assignment.
                    </td>
                </tr>
            `;

            return;
        }

        submissions.forEach(function (submission) {

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
                        class="view-btn"
                        target="_blank">
                        View File
                    </a>
                </td>
            `;

            tableBody.appendChild(row);
        });

    } catch (error) {

        console.error(
            "View Submission Error:",
            error
        );
    }
});