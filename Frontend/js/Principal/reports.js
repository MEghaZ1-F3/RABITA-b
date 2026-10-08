async function loadCollegeReports() {

    try {

        const studentsResponse = await fetch(
            "http://127.0.0.1:8000/students/",
            { credentials: "include" }
        );

        const students = await studentsResponse.json();

        if (!studentsResponse.ok) {
            console.error(students.error);
            return;
        }

        const facultyResponse = await fetch(
            "http://127.0.0.1:8000/faculty/",
            { credentials: "include" }
        );

        const faculty = await facultyResponse.json();

        if (!facultyResponse.ok) {
            console.error(faculty.error);
            return;
        }

        const pending = students.filter(function (student) {
            return student.approval_status === "pending";
        });

        document.getElementById("report-total-students").textContent =
            students.length;

        document.getElementById("report-total-faculty").textContent =
            faculty.length;

        document.getElementById("report-pending-students").textContent =
            pending.length;

    } catch (error) {

        console.error("Reports Error:", error);

    }
}