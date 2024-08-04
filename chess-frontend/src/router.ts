//importing all the components present in the application
import { HomePage } from "./components/home";
import { LoginPage } from "./components/login";
import { SignupPage } from "./components/signup";
import { WelcomePage } from "./components/welcome/welcome";
import { OfflinePage } from "./components/offline";
import { loadCSS } from "./utils/cssLoader";
import { CreateGamePage } from "./components/game/onlineGameServices/players/createGame";
import { JoinGame } from "./components/game/onlineGameServices/players/joinGame";
import { Online } from "./components/game/onlineGameServices/players/online";
import { WatchGame } from "./components/game/onlineGameServices/audience/watchGame";
import { OnlineAudiencePage } from "./components/game/onlineGameServices/audience/onlineAudiencePage";
import { GameReplay } from "./components/gameReplay";
import { RandomMatchMaking } from "./components/game/onlineGameServices/players/randomMatchMaking";
import { LeaderBoard } from "./components/leaderBoard";

//Defining all the routes(pages) present along with their files names and their typescript files
const routes: { [key: string]: any } = {
  "#/home": { component: HomePage, css: "home" },
  "#/login": { component: LoginPage, css: "login" },
  "#/signup": { component: SignupPage, css: "signup" },
  "#/welcome": { component: WelcomePage, css: "welcome" },
  "#/offline": { component: OfflinePage, css: "offline" },
  "#/create-game": { component: CreateGamePage, css: "createRoom" },
  "#/join-game": { component: JoinGame, css: "joinRoom" },
  "#/online": { component: Online, css: "online" },
  "#/watch-game": { component: WatchGame, css: "watchGame" },
  "#/online-audience-page": {
    component: OnlineAudiencePage,
    css: "onlineAudiencePage",
  },
  "#/game-replay": { component: GameReplay, css: "gameReplay" },
  "#/random-match-making": {
    component: RandomMatchMaking,
    css: "randomMatchMaking",
  },
  "#/leader-board": { component: LeaderBoard, css: "leaderBoard" },
};

export class Router {
  static async loadContent() {
    const hash = window.location.hash || "#/home";
    const route = routes[hash];
    if (route) {
      this.loadHeader(hash); //Loading the header dynamically based on which page we are present
      const content = await route.component.load(); //Loading the html file
      document.getElementById("main-content")!.innerHTML = content;
      await loadCSS(route.css); //Loading the css files and awating for the promise to enusre all the css are loaded before the event listensers are initialized
      route.component.initEventListeners(); //Initializing all the event listeners
    }
  }
  //Function to load the header contents dynamically based on the page we are present in
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
    } else if (hash === "#/offline") {
      headerContent = `
             <button id="pauseBtn"><i class="fas fa-pause"></i> Pause</button>
          <button id="restartBtn"><i class="fas fa-redo"></i> Restart</button>
          <button id="abortBtn"><i class="fas fa-times"></i> Abort</button>
          <button id="openModalButton" class="openModalButton">Show The Game Moves</button>
            `;
    }
    header.innerHTML = headerContent;
  }

  static handleRouteChange() {
    Router.loadContent();
  }

  static init() {
    window.addEventListener("popstate", () => this.handleRouteChange()); //Handle the previous and next button clicks while on a page
    this.handleRouteChange();
    window.addEventListener("beforeunload", () => {
      this.handleRouteChange();
    });
  }
}
