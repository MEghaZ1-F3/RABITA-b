async function loadNotices() {

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/api/notices/",
            {
                credentials: "include",
            }
        );

        const data = await response.json();

        console.log("Notices Data:", data);

        const noticesSection =
            document.getElementById("notices");

        const noticeContainer =
            noticesSection.querySelector(".notice-list");

        noticeContainer.innerHTML = "";

        data.notices.forEach(function (notice) {

            const noticeItem =
                document.createElement("div");

            noticeItem.className = "notice-item";

            noticeItem.innerHTML = `
                <h4>${notice.title}</h4>
                <p>${notice.message}</p>
                <small>${notice.posted_date}</small>
            `;

            noticeContainer.appendChild(noticeItem);

        });

    } catch (error) {

        console.error(
            "Notices Error:",
            error
        );

    }
}

loadNotices();