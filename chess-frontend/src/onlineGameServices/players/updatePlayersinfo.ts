import { PlayerInfo } from "../../interfaces/playersInfo";
export class Game {
    private container: HTMLElement;
  
    constructor(containerId: string) {
      this.container = document.getElementById(containerId) as HTMLElement;
  
      if (!this.container) {
        // Create the container element if it does not exist
       console.log("No containor");
       
      }
  
      this.createUIElements();
    }
  
    private createUIElements() {
      if (!this.container) return; // Ensure container exists before proceeding
  
      // Create and append player info container
      const playerInfoContainer = document.createElement('div');
      playerInfoContainer.className = 'player-info';
      
      // Create your info section
      const myInfoDiv = document.createElement('div');
      myInfoDiv.className = 'player';
      myInfoDiv.id = 'my-info';
      myInfoDiv.innerHTML = `
        <h2>Your Info</h2>
        <p id="my-color">Color: </p>
        <p id="my-id">ID: </p>
      `;
      playerInfoContainer.appendChild(myInfoDiv);
  
      // Create opponent info section
      const opponentInfoDiv = document.createElement('div');
      opponentInfoDiv.className = 'player';
      opponentInfoDiv.id = 'opponent-info';
      opponentInfoDiv.innerHTML = `
        <h2>Opponent's Info</h2>
        <p id="opponent-color">Color: </p>
        <p id="opponent-id">ID: </p>
      `;
      playerInfoContainer.appendChild(opponentInfoDiv);
  
      // Create turn indicator section
      const turnIndicatorDiv = document.createElement('div');
      turnIndicatorDiv.className = 'turn-indicator';
      turnIndicatorDiv.id = 'turn-indicator';
      turnIndicatorDiv.textContent = 'Turn: Waiting for game to start...';
  
      // Append the new elements to the container
      this.container.appendChild(playerInfoContainer);
      this.container.appendChild(turnIndicatorDiv);
    }
  
    public updatePlayerInfo(data: PlayerInfo) {
      // Update your information
      const myColorElement = document.getElementById('my-color') as HTMLParagraphElement;
      const myIdElement = document.getElementById('my-id') as HTMLParagraphElement;
      myColorElement.textContent = `Color: ${data.myColor}`;
      myIdElement.textContent = `ID: ${data.myId}`;
  
      // Update opponent information
      const opponentColorElement = document.getElementById('opponent-color') as HTMLParagraphElement;
      const opponentIdElement = document.getElementById('opponent-id') as HTMLParagraphElement;
      
      if (data.otherParticipants.length > 0) {
        const opponent = data.otherParticipants[0];
        opponentColorElement.textContent = `Color: ${opponent.color}`;
        opponentIdElement.textContent = `ID: ${opponent.userId}`;
      } else {
        opponentColorElement.textContent = 'Color: N/A';
        opponentIdElement.textContent = 'ID: N/A';
      }
    }
  
    public updateTurn(turn: string) {
      // Update turn indicator
      const turnIndicatorElement = document.getElementById('turn-indicator') as HTMLDivElement;
      turnIndicatorElement.textContent = `Turn: ${turn}`;
    }
  }