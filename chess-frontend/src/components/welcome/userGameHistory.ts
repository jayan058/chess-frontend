import { addRowClickEventListeners } from './fetchChessGames';

export class GameTable {
  private data: any[];
  private container: HTMLElement | null;

  constructor(data: any[], containerId: string) {
    this.data = data;
    this.container = document.getElementById(containerId);
    if (this.container) {
      this.init();
    } else {
      console.error(`Container with id "${containerId}" not found.`);
    }
  }

  private init(): void {
    if (this.container) {
      this.container.innerHTML = this.createTable();
      addRowClickEventListeners(this.container.id); 
    }
  }

  private createTable(): string {
  
    const headerClass = this.data.length > 0 ? `header-${this.data[0].gameId}` : 'header-default';
    
    return `
        <div class="table-container">
          <table class="responsive-table">
            <thead>
              <tr class="${headerClass}">
                <th>White Player Name</th>
                <th>Black Player Name</th>
                <th>Winner</th>
                <th>How The Game Was Decided</th>
              </tr>
            </thead>
            <tbody>
              ${this.data.map((game) => this.createTableRow(game)).join("")}
            </tbody>
          </table>
        </div>
      `;
  }

  private createTableRow(game: any): string {
    const isWinner = game.winnerId === game.yourId;
    const rowClass = isWinner ? "win" : "lose";

    return `
        <tr class="${rowClass}" data-game-id="${game.gameId}">
          <td>${game.whitePlayerName}</td>
          <td>${game.blackPlayerName}</td>
          <td>${game.winnerName}</td>
          <td>${game.winType}</td>
        </tr>
      `;
  }
}
