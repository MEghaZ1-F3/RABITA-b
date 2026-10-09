document.addEventListener("DOMContentLoaded", function () {
    const roleField = document.getElementById("id_role");
    const facultyTypeField = document.getElementById("id_faculty_type");
    const hodField = document.getElementById("id_is_hod");
    const entryTypeField = document.getElementById("id_entry_type");
    const semesterField = document.getElementById("id_semester");
    const admissionYearField = document.getElementById("id_admission_year");
    const enrollmentField = document.getElementById("id_enrollment_number");

    function toggleFields() {
        const role = roleField?.value;

        const facultyRow = facultyTypeField?.closest(".form-row");
        const hodRow = hodField?.closest(".form-row");
        const entryRow = entryTypeField?.closest(".form-row");
        const semesterRow = semesterField?.closest(".form-row");
        const yearRow = admissionYearField?.closest(".form-row");
        const enrollmentRow = enrollmentField?.closest(".form-row");

        if (facultyRow) facultyRow.style.display = role === "faculty" ? "" : "none";
        if (hodRow) {
            hodRow.style.display =
                role === "faculty" && facultyTypeField?.value === "regular"
                    ? ""
                    : "none";
        }

        const branchField = document.getElementById("id_branch");
        const branchRow = branchField?.closest(".form-row");

        if (branchRow) {
            branchRow.style.display =
                ["faculty", "student"].includes(role) ? "" : "none";
        }

        [entryRow, semesterRow, yearRow, enrollmentRow].forEach(row => {
            if (row) row.style.display = role === "student" ? "" : "none";
        });

        const entryType = entryTypeField?.value;

        if (semesterField) {
            const options = entryType === "lateral"
                ? [3, 4, 5, 6, 7, 8]
                : [1, 2, 3, 4, 5, 6, 7, 8];

            const currentValue = semesterField.value;

            semesterField.innerHTML = '<option value="">---------</option>';

            options.forEach(sem => {
                semesterField.add(new Option(sem, sem));
            });

            if (options.includes(Number(currentValue))) {
                semesterField.value = currentValue;
            }
        }
    }

    if (entryTypeField) {
        entryTypeField.addEventListener("change", toggleFields);
    }

    if (facultyTypeField) {
        facultyTypeField.addEventListener("change", toggleFields);
    }
    if (roleField) {
        roleField.addEventListener("change", toggleFields);
    }

    toggleFields();

});