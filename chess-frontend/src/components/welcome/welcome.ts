// eventListeners/welcome.ts
import { Auth } from "../../auth";
import { Router } from "../../router";
import { sessionChangeListeners } from "../../utils/sessionChangeListener";
import { ChessAlertModal } from "../../modals/chessAlertModal";
import { GameTable } from "./userGameHistory";
export class WelcomePage {
  static currentPage: number = parseInt(localStorage.getItem('currentPage') || '1');

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
    sessionChangeListeners();
    this.dropDownToggle();
    this.fetchUserDetails();
    this.setupPlayOfflineEventListener();
    this.setupPlayOnlineEventListener();
    this.setupPaginationEventListeners(); 
  }

  static async fetchUserDetails(page: number = 1) {
    let token = Auth.getAccessToken();
    try {
      const response = await fetch(
        `http://localhost:3000/user/getUserDetails?page=${page}&limit=4`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        console.log(response);
      }
      const userData = await response.json();
      console.log(userData);
      
      this.updateUserDetails(userData.foundUser[0]);
      new GameTable(userData.enhancedGameDetails, 'game-history-container');
      
      // Update pagination information
      this.updatePaginationInfo();
      
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    }
  }

  

  static updateUserDetails(userData: { profilePicture: string; name: string }) {
    const userImage = document.getElementById(
      "user-greeting-information__user-image"
    ) as HTMLImageElement;
    const greetingMessage = document.getElementById(
      "user-greeting-information__greeting-message"
    );

    if (userImage) {
      userImage.src = userData.profilePicture;
    }

    if (greetingMessage) {
      greetingMessage.textContent = `Hello, ${userData.name}!`;
    }
  }

  static dropDownToggle() {
    const dropdownToggles = document.querySelectorAll(".dropdown-toggle");
    const dropdownMenus = document.querySelectorAll(".dropdown-menu");

    console.log("Dropdown toggles:", dropdownToggles);
    console.log("Dropdown menus:", dropdownMenus);

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
  } static setupPaginationEventListeners() {
    document.getElementById("next-page")?.addEventListener("click", () => {
      this.currentPage++;
      localStorage.setItem('currentPage', this.currentPage.toString());
      this.fetchUserDetails(this.currentPage);
    });

    document.getElementById("previous-page")?.addEventListener("click", () => {
      if (this.currentPage > 1) {
        this.currentPage--;
        localStorage.setItem('currentPage', this.currentPage.toString());
        this.fetchUserDetails(this.currentPage);
      }
    });

    // Initial update of pagination info
    this.updatePaginationInfo();
  }
  static updatePaginationInfo() {
    const pageInfo = document.getElementById("page-info");
    if (pageInfo) {
      pageInfo.textContent = `Page ${this.currentPage}`;
    }

    const previousButton = document.getElementById("previous-page") as HTMLButtonElement;
    const nextButton = document.getElementById("next-page") as HTMLButtonElement;

    if (this.currentPage <= 1) {
      if (previousButton) previousButton.disabled = true;
    } else if (previousButton) {
      previousButton.disabled = false;
    }

    // Optionally, adjust logic to disable 'Next' button based on total pages
    if (nextButton) nextButton.disabled = false;
  }
  
  static setupPlayOfflineEventListener() {
    document
      .getElementById("play-offline")!
      .addEventListener("click", async (e) => {   
        e.preventDefault();
        const token = Auth.getAccessToken();

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

  static setupPlayOnlineEventListener() {
    document.getElementById("play-online")?.addEventListener("click", () => {
      const modal = new ChessAlertModal();

      modal.show("", [
        { text: "Create A New Room", onClick: () => {
          window.location.hash='#/create-game'
          modal.hide()
        } },
        { text: "Join A Game", onClick: () => {
          window.location.hash='#/join-game'
          modal.hide()
        } },
        { text: "Watch A Game", onClick: () => {
          window.location.hash='#/watch-game'
          modal.hide()
        } },
        { text: "Play With A Random Stranger", onClick: () => {
          window.location.hash='#/random-match-making'
          modal.hide()
        } }
        
      ]);
    });
  }
}
