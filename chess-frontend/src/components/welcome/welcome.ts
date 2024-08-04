//All the necessary imports
import { Auth } from "../../auth";
import { Router } from "../../router";
import { sessionChangeListeners } from "../../utils/sessionChangeListener";
import { ChessAlertModal } from "../../modals/chessAlertModal";
import { GameTable } from "./userGameHistory";
import { ModalManager } from "../../utils/modal";
export class WelcomePage {
  static currentPage: number = 1; //Reseting the current page every time the page loads
  static totalPages: number = 1; //Initializing the total number of pages
  static async load(): Promise<string> {
    if (!Auth.isLoggedIn()) {
      window.location.hash = "#/login";
      Router.loadContent();
      return "";
    }
    this.currentPage = 1;
    localStorage.setItem("currentPage", this.currentPage.toString());

    const response = await fetch("src/views/welcome.html");
    return response.text();
  }

  //All the event listeners for the welcome page
  static initEventListeners() {
    sessionChangeListeners();
    this.dropDownToggle();
    this.fetchUserDetails();
    this.setupPlayOfflineEventListener();
    this.setupPlayOnlineEventListener();
    this.setupPaginationEventListeners();
    this.setUpLeaderBoardEventListeners();
    this.setUpLogoutEventListeners();
  }

  //Fetching the details of the user (their name,picture and their past games)
  static async fetchUserDetails(page: number = 1) {
    let token = await Auth.getAccessToken();
    try {
      const response = await fetch(
        `http://localhost:3000/user/getUserDetails?page=${page}&limit=4`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
      }
      const userData = await response.json();

      this.updateUserDetails(userData.foundUser[0]);
      new GameTable(userData.enhancedGameDetails, "game-history-container");
      this.totalPages = userData.totalPages;
      this.updatePaginationInfo(this.totalPages);
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    }
  }

  //Function to greet the user
  static updateUserDetails(userData: { profilePicture: string; name: string }) {
    const userImage = document.getElementById(
      "user-greeting-information__user-image",
    ) as HTMLImageElement;
    const greetingMessage = document.getElementById(
      "user-greeting-information__greeting-message",
    );

    if (userImage) {
      userImage.src = userData.profilePicture;
    }

    if (greetingMessage) {
      greetingMessage.textContent = `Hello, ${userData.name}!`;
    }
  }

  //Function to toggle the dropdown

  static dropDownToggle() {
    const dropdownToggles = document.querySelectorAll(".dropdown-toggle");
    const dropdownMenus = document.querySelectorAll(".dropdown-menu");

    dropdownToggles.forEach((toggle, index) => {
      toggle.addEventListener("click", (e) => {
        e.stopPropagation();
        const menu = dropdownMenus[index] as HTMLElement;
        menu.style.display = menu.style.display === "block" ? "none" : "block";
      });
    });

    document.addEventListener("click", () => {
      dropdownMenus.forEach((menu) => {
        const menuElement = menu as HTMLElement;
        menuElement.style.display = "none";
      });
    });
  }

  //Function to handle the pagination event listeners
  static setupPaginationEventListeners() {
    document.getElementById("next-page")?.addEventListener("click", () => {
      this.currentPage++;
      localStorage.setItem("currentPage", this.currentPage.toString());
      this.fetchUserDetails(this.currentPage);
    });

    document.getElementById("previous-page")?.addEventListener("click", () => {
      if (this.currentPage > 1) {
        this.currentPage--;
        localStorage.setItem("currentPage", this.currentPage.toString());
        this.fetchUserDetails(this.currentPage);
      }
    });

    this.updatePaginationInfo(this.totalPages);
  }
  //Function to update the pagination event listeners
  static updatePaginationInfo(totalPages: number) {
    const pageInfo = document.getElementById("page-info");
    if (pageInfo) {
      if (totalPages == 0) {
        pageInfo.textContent = `No Games Played Yet`;
        return;
      }
      pageInfo.textContent = `Page ${this.currentPage} of ${totalPages}`;
    }

    const previousButton = document.getElementById(
      "previous-page",
    ) as HTMLButtonElement;
    const nextButton = document.getElementById(
      "next-page",
    ) as HTMLButtonElement;

    if (this.currentPage <= 1) {
      previousButton.disabled = true;
    } else {
      previousButton.disabled = false;
    }

    if (this.currentPage >= totalPages) {
      nextButton.disabled = true;
    } else {
      nextButton.disabled = false;
    }
  }

  //Function to setup the offline event listeners
  static setupPlayOfflineEventListener() {
    document
      .getElementById("play-offline")!
      .addEventListener("click", async (e) => {
        e.preventDefault();
        const token = await Auth.getAccessToken();

        try {
          const response = await fetch("http://localhost:3000/offline", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            window.location.hash = "#/offline";
          } else {
            window.location.hash = "#/login";
          }
        } catch (error) {
          console.error("Failed to verify token:", error);
          window.location.hash = "#/login";
        }
      });
  }

  //Function to setup the different online mode event listeners for the game
  static setupPlayOnlineEventListener() {
    document.getElementById("play-online")?.addEventListener("click", () => {
      const modal = new ChessAlertModal();

      modal.show("", [
        {
          text: "Create A New Room",
          onClick: () => {
            window.location.hash = "#/create-game";
            modal.hide();
          },
        },
        {
          text: "Join A Game",
          onClick: () => {
            window.location.hash = "#/join-game";
            modal.hide();
          },
        },
        {
          text: "Watch A Game",
          onClick: () => {
            window.location.hash = "#/watch-game";
            modal.hide();
          },
        },
        {
          text: "Play With A Random Stranger",
          onClick: () => {
            window.location.hash = "#/random-match-making";
            modal.hide();
          },
        },
      ]);
    });
  }

  //Function to setup the leaderboard event listeners
  static setUpLeaderBoardEventListeners() {
    document
      .getElementById("getLeaderboardBtn")
      ?.addEventListener("click", () => {
        window.location.hash = "#/leader-board";
      });
  }

  //Function to setup the logout event listeners

  static setUpLogoutEventListeners() {
    let changeProfileDetails = document.getElementById("logout");
    changeProfileDetails?.addEventListener("click", () => {
      Auth.clearTokens();
      const modal = new ModalManager("myModal", "modalMessage", "close");
      modal.show("Logout Successfull", "success");

      setTimeout(() => {
        window.location.hash = "#/login";
      }, 3000);
    });
  }
}

WelcomePage.dropDownToggle();
