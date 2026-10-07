async function loadCollegeNotices() {

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/api/notices/",
            {
                credentials: "include"
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error(data.error);
            return;
        }

        const container =
            document.getElementById(
                "college-notices-container"
            );

        container.innerHTML = "";

        if (data.notices.length === 0) {

            container.innerHTML = `
                <p>No notices available.</p>
            `;

            return;
        }

        data.notices.forEach(function (notice) {

            const noticeCard =
                document.createElement("div");

            noticeCard.className = "notice-card";

            noticeCard.innerHTML = `
                <h3>${notice.title}</h3>

                <p>${notice.message}</p>

                <small>
                    Posted: ${notice.posted_date}
                </small>
            `;

            container.appendChild(noticeCard);

        });

    } catch (error) {

        console.error(
            "Principal Notices Error:",
            error
        );

    }
}