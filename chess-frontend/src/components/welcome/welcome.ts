// eventListeners/welcome.ts
import { Auth } from "../../auth";
import { Router } from "../../router";
import { sessionChangeListeners } from "../../utils/sessionChangeListener";
import { ChessAlertModal } from "../../modals/chessAlertModal";
import { GameTable } from "./userGameHistory";
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
    sessionChangeListeners();
    this.dropDownToggle();
    this.fetchUserDetails();
    this.setupPlayOfflineEventListener();
    this.setupPlayOnlineEventListener();
  }

  static async fetchUserDetails() {
    let token = Auth.getAccessToken();
    try {
      const response = await fetch(
        "http://localhost:3000/user/getUserDetails",
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
        {
          text: "Play With A Random Stranger",
          onClick: () => console.log("Hello"),
        },
        
      ]);
    });
  }
}
