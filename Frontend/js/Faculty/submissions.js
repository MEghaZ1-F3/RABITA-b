async function loadFacultySubmissions() {
    try {

        const response = await fetch(
            "http://127.0.0.1:8000/api/faculty-submissions/",
            {
                credentials: "include"
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error(data.error);
            return;
        }

        const tableBody = document.getElementById(
            "faculty-submission-body"
        );

        tableBody.innerHTML = "";

        if (data.submissions.length === 0) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="6">
                        No submissions yet.
                    </td>
                </tr>
            `;

            return;
        }

        data.submissions.forEach(function (submission) {

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
                        class="view-btn">
                        View File
                    </a>

                    <button
                        class="view-btn review-btn"
                        type="button">
                        Review
                    </button>

                </td>
            `;

            const reviewButton = row.querySelector(".review-btn");

            reviewButton.addEventListener("click", function () {

                document.getElementById(
                    "review-submission-box"
                ).classList.remove("page-hidden");

                document.getElementById(
                    "review-student"
                ).textContent = submission.student;

                document.getElementById(
                    "review-assignment"
                ).textContent = submission.assignment;

                document.getElementById(
                    "review-remarks"
                ).value = "";

                window.selectedSubmissionId = submission.id;

                console.log(
                    "Selected Submission:",
                    submission
                );
            });

            tableBody.appendChild(row);
        });

    } catch (error) {

        console.error(
            "Faculty Submissions Error:",
            error
        );
    }
}
async function reviewSubmission(status) {

    const submissionId = window.selectedSubmissionId;

    if (!submissionId) {
        alert("Please select a submission first.");
        return;
    }

    const remarks = document.getElementById(
        "review-remarks"
    ).value;
    const hardCopyReceived = document.getElementById(
        "hard-copy-received"
    ).checked;

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/api/review-submission/",
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    submission_id: submissionId,
                    status: status,
                    remarks: remarks,
                    hard_copy_received: hardCopyReceived
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.error || "Review failed.");
            return;
        }

        alert(
            status === "approved"
                ? "Assignment approved!"
                : "Assignment rejected!"
        );

        document
            .getElementById("review-submission-box")
            .classList.add("page-hidden");

        await loadFacultySubmissions();

    } catch (error) {

        console.error(
            "Review Submission Error:",
            error
        );

        alert("Unable to review submission.");
    }
}
document.getElementById(
    "approve-submission-btn"
).addEventListener("click", function () {

    reviewSubmission("approved");

});


document.getElementById(
    "reject-submission-btn"
).addEventListener("click", function () {

    reviewSubmission("rejected");

});
loadFacultySubmissions();

document
    .getElementById("close-review-btn")
    .addEventListener("click", function () {

        document
            .getElementById("review-submission-box")
            .classList.add("page-hidden");

    });