// eventListeners/welcome.ts
import { Auth } from "../auth";
import { Router } from "../router";

export class WelcomePage {
  static async load(): Promise<string> {
    if (!Auth.isLoggedIn()) {
      window.location.hash = "#/login";
      Router.loadContent();
      return "";
    }
    const response = await fetch("views/welcome.html");
    return response.text();
  }

  static initEventListeners() {
    // Initialize event listeners for the welcome page
  }
}
