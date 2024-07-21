import { HomePage } from "./eventListeners/home";
import { LoginPage } from "./eventListeners/login";
import { SignupPage } from "./eventListeners/signup";
import { WelcomePage } from "./eventListeners/welcome";
import { Auth } from "./auth";
import { loadCSS } from "./utils/cssLoader"; // Import the CSS loader

const routes: { [key: string]: any } = {
  "#/home": { component: HomePage, css: "home" },
  "#/login": { component: LoginPage, css: "login" },
  "#/signup": { component: SignupPage, css: "signup" },
  "#/welcome": { component: WelcomePage, css: "welcome" },
};

export class Router {
  static async loadContent() {
    const hash = window.location.hash || "#/home";
    const route = routes[hash];
    if (route) {
      this.loadHeader(hash);
      const content = await route.component.load();
      document.getElementById("main-content")!.innerHTML = content;
      route.component.initEventListeners();

      loadCSS(route.css); 
    }
  }

  static loadHeader(hash: string) {
    const header = document.getElementById("header")!;
    let headerContent = "";

    if (hash === "#/home") {
      headerContent = `
                <a href="#/login">Login</a>
                <a href="#/signup">Signup</a>
            `;
    } else if (hash === "#/login") {
      headerContent = `
                <a href="#/signup">Register Here</a>
            `;
    } else if (hash === "#/signup") {
      headerContent = `
                <a href="#/login">Already A Member?</a>
            `;
    } else if (hash === "#/welcome") {
      headerContent = `
                <div id="user-greeting-information"></div>
                <button id="logout">Logout</button>
            `;
    }

    header.innerHTML = headerContent;
    if (hash === "#/welcome") {
      document.getElementById("logout")!.addEventListener("click", () => {
        Auth.logout();
        window.location.hash = "#/home";
        Router.loadContent();
      });
    }
  }

  static handleRouteChange() {
    Router.loadContent();
  }

  static init() {
    window.addEventListener("popstate", () => this.handleRouteChange());
    this.handleRouteChange();
  }
}
