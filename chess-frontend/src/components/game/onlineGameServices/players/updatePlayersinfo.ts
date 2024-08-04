import { PlayerInfo } from "../../../../interfaces/playersInfo";
import { myData } from "./online";

export class Game {
  private container: HTMLElement;
  private modal: HTMLElement | null = null;

  constructor(containerId: string) {
    this.container = document.getElementById(containerId) as HTMLElement;

    if (!this.container) {
      // Create the container element if it does not exist
    }

    this.createUIElements();
    this.listenForButtonClick();
    this.greetUser();
  }
  private greetUser() {
    let userGretting = document.getElementById("user-greeting-information");
    userGretting!.textContent = `GoodLuck With The Game ${myData.myName}`;
  }
  private createUIElements() {
    if (!this.container) return; // Ensure container exists before proceeding

    // Create the modal element
    this.modal = document.createElement("div");
    this.modal.className = "modal";
    this.modal.innerHTML = `
      <div class="modal-content">
        <span class="close-button">&times;</span>
        <div class="player-info-container">
          <div class="player-info-content">
            <div class="player-info" id="my-info">
              <div>
                <h2 class="player-title">You</h2>  
                <img id="my-picture" src="" />
              </div>
              <div>
                <p id="my-name">Name: </p>
                <p id="my-color">ID: </p>
              </div>  
            </div>
            <div class="player-info" id="opponent-info">
              <div>
                <h2 class="player-title">Opponent</h2>       
                <img id="opponent-picture" src="" />
              </div>   
              <div>  
                <p id="opponent-name">Name: </p>
                <p id="opponent-color">Color: </p>
              </div>    
            </div>
          </div>
          <div class="separator"></div>
          <div class="turn-indicator" id="turn-indicator">
            Turn: Waiting for game to start...
          </div>
        </div>
      </div>
    `;

    // Append the modal to the container
    this.container.appendChild(this.modal);
    this.addModalEventListeners();
  }

  private listenForButtonClick() {
    console.log("Here");
    document.getElementById("show-game-info")?.addEventListener("click", () => {
      console.log("Here");

      this.showModal();
    });
  }

  private addModalEventListeners() {
    if (this.modal) {
      const closeButton = this.modal.querySelector(
        ".close-button",
      ) as HTMLElement;
      if (closeButton) {
        closeButton.addEventListener("click", () => this.hideModal());
      }

      // Close the modal if the user clicks outside of it
      window.addEventListener("click", (event) => {
        if (event.target === this.modal) {
          this.hideModal();
        }
      });
    }
  }

  private showModal() {
    if (this.modal) {
      this.modal.style.display = "block";
    }
  }

  private hideModal() {
    if (this.modal) {
      this.modal.style.display = "none";
    }
  }

  public updatePlayerInfo(data: PlayerInfo) {
    // Update your information
    const myColorElement = document.getElementById(
      "my-color",
    ) as HTMLParagraphElement;
    const myNameElement = document.getElementById(
      "my-name",
    ) as HTMLParagraphElement;
    const myPictureElement = document.getElementById(
      "my-picture",
    ) as HTMLImageElement;
    myColorElement.textContent = `Color: ${data.myColor}`;
    myNameElement.textContent = `Name: ${data.myName}`;
    myPictureElement.src = `${data.myPicture}`;

    // Update opponent information
    const opponentColorElement = document.getElementById(
      "opponent-color",
    ) as HTMLParagraphElement;
    const opponentNameElement = document.getElementById(
      "opponent-name",
    ) as HTMLParagraphElement;
    const opponentPictureElement = document.getElementById(
      "opponent-picture",
    ) as HTMLImageElement;
    if (data.otherParticipants.length > 0) {
      const opponent = data.otherParticipants[0];
      opponentColorElement.textContent = `Color: ${opponent.color}`;
      opponentNameElement.textContent = `Name: ${opponent.name}`;
      opponentPictureElement.src = `${opponent.picture}`;
    } else {
      opponentColorElement.textContent = "Color: N/A";
      opponentNameElement.textContent = "Name: N/A";
    }
  }

  public updateTurn(turn: string) {
    // Update turn indicator
    const turnIndicatorElement = document.getElementById(
      "turn-indicator",
    ) as HTMLDivElement;
    turnIndicatorElement.textContent = `Turn: ${turn}`;
  }
}
