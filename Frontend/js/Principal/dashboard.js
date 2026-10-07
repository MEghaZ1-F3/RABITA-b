async function loadPrincipalDashboard() {

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

        // Total Students
        const totalStudents =
            document.querySelectorAll(".summary-card")[0]
                .querySelector(".card-number");

        totalStudents.textContent = students.length;


        // Pending Approvals
        const pendingStudents =
            students.filter(function (student) {
                return student.approval_status === "pending";
            });
        const facultyResponse = await fetch(
            "http://127.0.0.1:8000/faculty/",
            {
                credentials: "include"
            }
        );

        const faculty = await facultyResponse.json();

        if (!facultyResponse.ok) {
            console.error(faculty.error);
            return;
        }

        const totalFaculty =
            document.querySelectorAll(".summary-card")[1]
                .querySelector(".card-number");

        totalFaculty.textContent = faculty.length;

        const pendingApprovals =
            document.querySelectorAll(".summary-card")[2]
                .querySelector(".card-number");

        pendingApprovals.textContent =
            pendingStudents.length;
        const approvalBody =
            document.getElementById("pending-approvals-body");

        approvalBody.innerHTML = "";

        pendingStudents.forEach(function (student) {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${student.name}</td>

                <td>
                    ${student.student_id || student.temporary_id || "-"}
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
                        onclick="updateApproval(${student.id}, 'approved')"
                    >
                        Approve
                    </button>

                    <button
                        class="reject-btn"
                        onclick="updateApproval(${student.id}, 'rejected')"
                    >
                        Reject
                    </button>
                </td>
            `;

            approvalBody.appendChild(row);
        });

        if (pendingStudents.length === 0) {

            approvalBody.innerHTML = `
                        <tr>
                            <td colspan="6">
                                No pending approvals.
                            </td>
                        </tr>
                    `;
        }

        const noticeResponse = await fetch(
            "http://127.0.0.1:8000/api/notices/",
            {
                credentials: "include"
            }
        );

        const noticeData = await noticeResponse.json();

        if (!noticeResponse.ok) {
            console.error(noticeData.error);
            return;
        }

        const totalNotices =
            document.querySelectorAll(".summary-card")[3]
                .querySelector(".card-number");

        totalNotices.textContent =
            noticeData.notices.length;


        console.log(
            "Principal Dashboard Data:",
            students
        );


    } catch (error) {

        console.error(
            "Principal Dashboard Error:",
            error
        );

    }
}


loadPrincipalDashboard();
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
                body: JSON.stringify({
                    student_id: studentId,
                    status: status
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.error || "Approval update failed.");
            return;
        }

        alert(data.message);

        loadPrincipalDashboard();

    } catch (error) {

        console.error(
            "Approval Error:",
            error
        );

        alert("Unable to update approval.");

    }
}
window.updateApproval = updateApproval;
document.querySelectorAll(".sidebar-nav a").forEach(function (link) {

    link.addEventListener("click", function (event) {

        event.preventDefault();

        const sectionId = link.getAttribute("href").substring(1);

        // Remove active from all //
        document.querySelectorAll(".sidebar-nav a").forEach(function (item) {
            item.classList.remove("active");
        });

        // Add active to clicked item
        link.classList.add("active");

        // Hide all dashboard content//
        document.querySelector(".welcome-section").style.display = "none";
        document.querySelector(".summary-cards").style.display = "none";
        document.querySelector(".recent-student-activity").style.display = "none";
        document.querySelector(".pending-approvals").style.display = "none";
        document.querySelector(".recent-notices").style.display = "none";

        document.getElementById("students").style.display = "none";
        document.getElementById("faculty").style.display = "none";

        // Students //
        if (sectionId === "students") {

            document.getElementById("students").style.display = "block";

            loadCollegeStudents();
        }

        // Faculty//
        if (sectionId === "faculty") {

            document.getElementById("faculty").style.display = "block";

            loadCollegeFaculty();
        }

        // Dashboard//
        if (sectionId === "dashboard") {

            document.querySelector(".welcome-section").style.display = "";
            document.querySelector(".summary-cards").style.display = "";
            document.querySelector(".recent-student-activity").style.display = "";
            document.querySelector(".pending-approvals").style.display = "";
            document.querySelector(".recent-notices").style.display = "";
        }

    });

});