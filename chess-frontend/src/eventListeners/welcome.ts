// eventListeners/welcome.ts
import { Auth } from "../auth";
import { Router } from "../router";
import { sessionChangeListeners } from "../utils/sessionChangeListener";

export class WelcomePage {
  static async load(): Promise<string> {
    if (!Auth.isLoggedIn()) {
      window.location.hash = "#/login";
      Router.loadContent();
      return "";
    }
    const response = await fetch("src/views/welcome.html");
    return response.text();
  }

  static initEventListeners() {
    sessionChangeListeners()



  }
}
