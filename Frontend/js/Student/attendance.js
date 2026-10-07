async function loadAttendance() {

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/api/my-attendance-summary/",
            {
                credentials: "include",
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error(data.error);
            return;
        }

        console.log("Attendance Data:", data);

        const attendanceBody =
            document.getElementById("attendance-body");

        attendanceBody.innerHTML = "";

        data.attendance.forEach(function (record) {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${record.subject}</td>
                <td>${record.total}</td>
                <td>${record.present}</td>
                <td>${record.absent}</td>
                <td>${record.percentage}%</td>
            `;

            attendanceBody.appendChild(row);

        });
        if (data.overall) {

            document.getElementById("attendance-value").textContent =
                data.overall.percentage + "%";

        }

    } catch (error) {

        console.error(
            "Attendance Error:",
            error
        );

    }

}
loadAttendance();