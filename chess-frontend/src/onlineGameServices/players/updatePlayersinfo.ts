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
        <h2>You</h2>
        <p id="my-name">Name: </p>
        <p id="my-color">ID: </p>
        <img id=my-picture src="" />
      `;
      playerInfoContainer.appendChild(myInfoDiv);
  
      // Create opponent info section
      const opponentInfoDiv = document.createElement('div');
      opponentInfoDiv.className = 'player';
      opponentInfoDiv.id = 'opponent-info';
      opponentInfoDiv.innerHTML = `
        <h2>Opponent</h2>
        <p id="opponent-color">Color: </p>
           <p id="opponent-name">Name: </p>
             <img id="opponent-picture" src="" />
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
      const myNameElement = document.getElementById('my-name') as HTMLParagraphElement;
      const myPictureElement = document.getElementById('my-picture') as HTMLImageElement;
      myColorElement.textContent = `Color: ${data.myColor}`;
      myNameElement.textContent = `Name: ${data.myName}`;
      myPictureElement.src=`${data.myPicture}`
      // Update opponent information
      const opponentColorElement = document.getElementById('opponent-color') as HTMLParagraphElement;
      const opponentNameElement = document.getElementById('opponent-name') as HTMLParagraphElement;
      const opponentPictureElement = document.getElementById('opponent-picture') as HTMLImageElement;
      if (data.otherParticipants.length > 0) {
        const opponent = data.otherParticipants[0];
        opponentColorElement.textContent = `Name: ${opponent.name}`;
        opponentNameElement.textContent = `Color: ${opponent.color}`;
        opponentPictureElement.src=`${opponent.picture}`
      } else {
        opponentColorElement.textContent = 'Color: N/A';
        opponentNameElement.textContent = 'ID: N/A';
      }
    }
  
    public updateTurn(turn: string) {
      // Update turn indicator
      const turnIndicatorElement = document.getElementById('turn-indicator') as HTMLDivElement;
      turnIndicatorElement.textContent = `Turn: ${turn}`;
    }
  }