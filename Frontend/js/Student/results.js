async function uploadSemesterResult() {

    const semester =
        document.getElementById("result-upload-semester").value;

    const fileInput =
        document.getElementById("semester-result-file");

    if (!semester || !fileInput.files.length) {
        alert("Please select semester and result file.");
        return;
    }

    const formData = new FormData();

    formData.append("semester", semester);
    formData.append("result_file", fileInput.files[0]);

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/api/upload-semester-result/",
            {
                method: "POST",
                credentials: "include",
                body: formData
            }
        );

        const data = await response.json();

        if (!response.ok) {

            alert(
                data.error ||
                "Upload failed."
            );

            return;
        }

        alert(
            "Semester result uploaded successfully!"
        );

        fileInput.value = "";

        loadSemesterResults();

    } catch (error) {

        console.error(
            "Upload Result Error:",
            error
        );

        alert(
            "Unable to upload result."
        );
    }
}


async function loadSemesterResults() {

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/api/my-semester-results/",
            {
                credentials: "include"
            }
        );

        const data = await response.json();

        if (!response.ok) {

            console.error(data.error);
            return;
        }

        const tbody =
            document.getElementById(
                "semester-result-body"
            );

        tbody.innerHTML = "";

        data.results.forEach(function (result) {

            const row =
                document.createElement("tr");

            row.innerHTML = `
                <td>${result.semester}</td>

                <td>
                    <span class="result-status ${result.status}">
                        ${result.status}
                    </span>
                </td>

                <td>
                    ${result.faculty_remarks || "-"}
                </td>

                <td>
                    <a
                        href="${result.result_file}"
                        target="_blank"
                    >
                        View Result
                    </a>
                </td>
            `;

            tbody.appendChild(row);

        });

    } catch (error) {

        console.error(
            "Semester Results Error:",
            error
        );
    }
}


document
    .getElementById("upload-semester-result")
    .addEventListener(
        "click",
        uploadSemesterResult
    );


loadSemesterResults();
async function loadInternalMarks() {

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/api/my-internal-marks/",
            {
                credentials: "include"
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error(data.error);
            return;
        }

        const tbody =
            document.getElementById("internal-marks-body");

        tbody.innerHTML = "";

        data.marks.forEach(function (mark) {

            const row =
                document.createElement("tr");

            row.innerHTML = `
                <td>${mark.semester}</td>
                <td>${mark.subject}</td>
                <td>${mark.ct1_marks}/20</td>
                <td>${mark.ct2_marks}/20</td>
                <td>${mark.total}/40</td>
            `;

            tbody.appendChild(row);

        });

    } catch (error) {

        console.error(
            "Internal Marks Error:",
            error
        );

    }
}

loadInternalMarks();