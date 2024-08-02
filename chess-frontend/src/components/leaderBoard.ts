import { Auth } from "../auth";
import { Router } from "../router";
import { sessionChangeListeners } from "../utils/sessionChangeListener";
export class LeaderBoard {
  static currentPage: number = 1;
  static totalPages: number = 1;

  static async load(): Promise<string> {
    if (!Auth.isLoggedIn()) {
      window.location.hash = "#/login";
      Router.loadContent();
      return "";
    }
    this.currentPage = 1;
    localStorage.setItem("currentPage", this.currentPage.toString());

    const response = await fetch("src/views/leaderBoard.html");
    return response.text();
  }

  static initEventListeners() {
    sessionChangeListeners();
    this.setupPaginationEventListeners();
    this.fetchLeaderboardData();
  }

  static async fetchLeaderboardData(page: number = 1) {
    let token = Auth.getAccessToken();
    try {
      const response = await fetch(
        `http://localhost:3000/games/leaderboard?page=${page}&pageSize=4`,
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
      const leaderboardData = await response.json();

      this.renderLeaderboard(leaderboardData.userStats);

      // Update totalPages
      this.totalPages = leaderboardData.totalPages;

      // Update pagination information
      this.updatePaginationInfo(this.totalPages);
    } catch (error) {
      console.error("Failed to fetch leaderboard data:", error);
    }
  }

  static renderLeaderboard(
    leaderboard: Array<{ username: string; wins: number }>,
  ): void {
    const leaderboardContainer = document.getElementById(
      "leaderboard-container",
    );
    if (leaderboardContainer) {
      leaderboardContainer.innerHTML = `
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Wins</th>
            </tr>
          </thead>
          <tbody>
            ${leaderboard
              .map(
                (entry) => `
              <tr>
                <td>${entry.username}</td>
                <td>${entry.wins}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      `;
    }
  }

  static setupPaginationEventListeners() {
    document.getElementById("next-page")?.addEventListener("click", () => {
      this.currentPage++;
      localStorage.setItem("currentPage", this.currentPage.toString());
      this.fetchLeaderboardData(this.currentPage);
    });

    document.getElementById("previous-page")?.addEventListener("click", () => {
      if (this.currentPage > 1) {
        this.currentPage--;
        localStorage.setItem("currentPage", this.currentPage.toString());
        this.fetchLeaderboardData(this.currentPage);
      }
    });

    // Initial update of pagination info
    this.updatePaginationInfo(this.totalPages);
  }

  static updatePaginationInfo(totalPages: number) {
    const pageInfo = document.getElementById("page-info");
    if (pageInfo) {
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
}
