import { HomePage } from "./eventListeners/home";
import { LoginPage } from "./eventListeners/login";
import { SignupPage } from "./eventListeners/signup";
import { WelcomePage } from "./eventListeners/welcome";
import { OfflinePage } from "./eventListeners/offline";
import { loadCSS } from "./utils/cssLoader"; 

const routes: { [key: string]: any } = {
  "#/home": { component: HomePage, css: "home" },
  "#/login": { component: LoginPage, css: "login" },
  "#/signup": { component: SignupPage, css: "signup" },
  "#/welcome": { component: WelcomePage, css: "welcome" },
  "#/offline": { component: OfflinePage,css: "offline"},
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
             <div id="user-greeting-information" class="user-greeting-information">
    <img id="user-greeting-information__user-image" class="user-greeting-information__user-image" src="path/to/user-image.jpg" alt="User Image">
    <span id="user-greeting-information__greeting-message" class="user-greeting-information__greeting-message">Hello, User! Welcome back.</span>
  </div>
            `;
    }
    else if (hash === "#/offline") {
      headerContent = `
           <button id="pause-button" class="pause-button">Pause</button>
            `;
    }
   

    header.innerHTML = headerContent;
   
  }

  static handleRouteChange() {
    Router.loadContent();
  }

  static init() {
    window.addEventListener("popstate", () => this.handleRouteChange());
    this.handleRouteChange();
  }
}
