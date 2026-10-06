async function loadFacultyData() {
    try {
        const response = await fetch(
            "http://127.0.0.1:8000/api/me/",
            {
                credentials: "include"
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error(data.error);
            return;
        }

        // Faculty ki branch save kar rahe hain
        window.facultyBranch = data.branch;

        console.log("Faculty Data:", data);
        console.log("Faculty Branch:", window.facultyBranch);

    } catch (error) {
        console.error("Faculty Data Error:", error);
    }
}

loadFacultyData();