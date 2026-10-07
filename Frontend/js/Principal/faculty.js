async function loadCollegeFaculty() {

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/faculty/",
            {
                credentials: "include"
            }
        );

        const faculty = await response.json();

        if (!response.ok) {
            console.error(faculty.error);
            return;
        }

        const tbody =
            document.getElementById("college-faculty-body");

        tbody.innerHTML = "";

        faculty.forEach(function (member) {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${member.name}</td>
                <td>${member.branch || "-"}</td>
            `;

            tbody.appendChild(row);

        });

    } catch (error) {

        console.error(
            "Principal Faculty Error:",
            error
        );

    }
}
loadCollegeFaculty();