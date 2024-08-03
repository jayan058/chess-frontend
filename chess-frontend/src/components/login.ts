import { ModalManager } from "../utils/modal";
import { Auth } from "../auth";
export class LoginPage {
  static async load(): Promise<string> {
    const response = await fetch("src/views/login.html");
    return response.text();
  }

  static initEventListeners() {
    const loginForm = document.getElementById("login-form") as HTMLFormElement;

    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const username = (document.getElementById("username") as HTMLInputElement)
        .value;
      const password = (document.getElementById("password") as HTMLInputElement)
        .value;

      try {
        const response = await fetch("http://localhost:3000/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: username,
            password: password,
          }),
          credentials: "include",
        });

        if (response.ok) {
          const result = await response.json();
          Auth.setAccessToken(result.accessToken);
          Auth.setRefreshToken(result.refreshToken);
          const modal = new ModalManager("myModal", "modalMessage", "close");
          modal.show(result.message, "success");
          localStorage.setItem("authChange", Date.now().toString());
          setTimeout(()=>{
            window.location.hash="#/welcome"
           },3000)
        } else {
          const error = await response.json();
          const modal = new ModalManager("myModal", "modalMessage", "close");
          modal.show(error.message, "error");
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    });
  }
}
