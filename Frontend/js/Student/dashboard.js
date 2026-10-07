async function checkLogin() {
    try {
        const response = await fetch(
            "http://127.0.0.1:8000/api/me/",
            {
                credentials: "include"
            }
        );

        if (response.status === 401) {
            window.location.href = "login.html";
        }

    } catch (error) {
        window.location.href = "login.html";
    }
}


async function loadStudentData() {

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/api/me/",
            {
                credentials: "include"
            }
        );

        const data = await response.json();

        console.log("Student Data:", data);

        document.getElementById("semester-value").textContent =
            data.semester || "-";

        document.getElementById("student-name").textContent =
            data.username;

        document.getElementById("student-id").textContent =
            data.student_id ||
            data.temporary_id ||
            "Not Generated";

        document.getElementById("student-branch").textContent =
            data.branch ||
            "Not Available";

        document.getElementById("student-semester").textContent =
            data.semester
                ? data.semester + "th Semester"
                : "Not Available";

        document.getElementById("student-entry").textContent =
            data.entry_type ||
            "Not Available";

        document.getElementById("student-year").textContent =
            data.admission_year ||
            "Not Available";

    } catch (error) {

        console.error(
            "Student Data Error:",
            error
        );

    }
}


checkLogin();
loadStudentData();
const dashboardSection = document.querySelector(".welcome-section");
const summarySection = document.querySelector(".summary-cards");
const activitySection = document.querySelector(".recent-student-activity");

const profileSection = document.getElementById("profile");
const attendanceSection = document.getElementById("attendance");
const assignmentsSection = document.getElementById("assignments");
const resultsSection = document.getElementById("results");
const noticesSection = document.getElementById("notices");


function hideAllSections() {

    dashboardSection.style.display = "none";
    summarySection.style.display = "none";
    activitySection.style.display = "none";

    profileSection.style.display = "none";
    attendanceSection.style.display = "none";
    assignmentsSection.style.display = "none";
    resultsSection.style.display = "none";
    noticesSection.style.display = "none";
}


function showDashboard() {

    hideAllSections();

    dashboardSection.style.display = "block";
    summarySection.style.display = "grid";
    activitySection.style.display = "block";

    document.getElementById("cgpa-value").textContent = "8.2";
}


document.querySelector('a[href="#dashboard"]').onclick = function (event) {
    event.preventDefault();
    showDashboard();
};


document.querySelector('a[href="#profile"]').onclick = function (event) {
    event.preventDefault();

    hideAllSections();
    profileSection.style.display = "block";
};


document.querySelector('a[href="#attendance"]').onclick = function (event) {
    event.preventDefault();

    hideAllSections();
    attendanceSection.style.display = "block";
};


document.querySelector('a[href="#assignments"]').onclick = function (event) {
    event.preventDefault();

    hideAllSections();
    assignmentsSection.style.display = "block";
};


document.querySelector('a[href="#results"]').onclick = function (event) {
    event.preventDefault();

    hideAllSections();
    resultsSection.style.display = "block";
};


document.querySelector('a[href="#notices"]').onclick = function (event) {
    event.preventDefault();

    hideAllSections();
    noticesSection.style.display = "block";
};


document.querySelector('a[href="#logout"]').onclick = async function (event) {

    event.preventDefault();

    try {

        await fetch(
            "http://127.0.0.1:8000/api/logout/",
            {
                method: "POST",
                credentials: "include"
            }
        );

        window.location.href = "login.html";

    } catch (error) {

        console.error("Logout Error:", error);

    }
};


showDashboard();