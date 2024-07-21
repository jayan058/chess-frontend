// eventListeners/login.ts
import { Auth } from "../auth";
import { Router } from "../router";

export class LoginPage {
  static async load(): Promise<string> {
    const response = await fetch("src/views/login.html");

    return response.text();
  }

  static initEventListeners() {
    const loginForm = document.getElementById("login-form")!;
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      // Simulate login logic
      const token = "example-token"; // Replace with actual token from login response
      Auth.login(token);
      window.location.hash = "#/welcome";
      Router.loadContent();
    });
  }
}
