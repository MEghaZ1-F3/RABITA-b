async function loadCollegeFaculty() {
    const branchSelect = document.getElementById("principal-faculty-branch");
    const regularBody = document.getElementById("principal-regular-faculty-body");
    const guestBody = document.getElementById("principal-guest-faculty-body");

    const branch = branchSelect.value;

    if (!branch) {
        regularBody.innerHTML = '<tr><td colspan="2">Select branch.</td></tr>';
        guestBody.innerHTML = '<tr><td colspan="2">Select branch.</td></tr>';
        return;
    }

    try {
        const response = await fetch("http://127.0.0.1:8000/faculty/", {
            credentials: "include"
        });

        const faculty = await response.json();

        if (!response.ok) {
            throw new Error(faculty.error || "Unable to load faculty.");
        }

        const filtered = faculty.filter(member => member.branch === branch);

        function renderFaculty(list, tbody) {
            if (list.length === 0) {
                tbody.innerHTML = '<tr><td colspan="2">No faculty found.</td></tr>';
                return;
            }

            tbody.innerHTML = "";

            list.forEach(member => {
                const row = document.createElement("tr");

                const nameCell = document.createElement("td");
                nameCell.textContent = member.name || "-";

                const branchCell = document.createElement("td");
                branchCell.textContent = member.branch || "-";

                row.append(nameCell, branchCell);
                tbody.appendChild(row);
            });
        }

        renderFaculty(
            filtered.filter(member => (member.faculty_type || "").toLowerCase() === "regular"),
            regularBody
        );

        renderFaculty(
            filtered.filter(member => (member.faculty_type || "").toLowerCase() === "guest"),
            guestBody
        );

    } catch (error) {
        console.error("Principal Faculty Error:", error);
        regularBody.innerHTML = '<tr><td colspan="2">Failed to load faculty.</td></tr>';
        guestBody.innerHTML = '<tr><td colspan="2">Failed to load faculty.</td></tr>';
    }
}

document.getElementById("principal-faculty-branch")
    .addEventListener("change", loadCollegeFaculty);