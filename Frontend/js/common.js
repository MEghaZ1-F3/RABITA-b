document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login-form");

  if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const usernameInput = document.getElementById("username");
      const passwordInput = document.getElementById("password");

      const username = usernameInput.value.trim();
      const password = passwordInput.value;

      console.log("Username:", username);
      console.log("Password entered:", password ? "YES" : "NO");

      try {
        const response = await fetch("http://127.0.0.1:8000/api/login/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        });

        const data = await response.json();

        console.log("Server Response:", data);

        if (response.ok) {
          console.log("Login Successful!");
          console.log("Role:", data.role);
          console.log("Username:", data.username);

          if (data.role === "student") {
            window.location.href = "student-dashboard.html";
          } else if (data.role === "faculty") {
            window.location.href = "faculty-dashboard.html";
          } else if (data.role === "principal") {
            window.location.href = "principal-dashboard.html";
          }
        } else {
          alert(data.error || "Login failed");

          passwordInput.value = "";
          passwordInput.focus();
        }
      } catch (error) {
        console.error("Login Error:", error);

        alert("Backend server se connection nahi ho raha.");
      }
    });
  }
});
