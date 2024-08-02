import { Auth } from "../../auth";

export async function addRowClickEventListeners(
  containerId: string,
): Promise<void> {
  const container = document.getElementById(containerId);

  if (!container) {
    console.error(`Container with id "${containerId}" not found.`);
    return;
  }

  const tableRows = container.querySelectorAll("tbody tr");

  tableRows.forEach((row) => {
    row.addEventListener("click", () => {
      const gameId = row.getAttribute("data-game-id");
      if (gameId) {
        handleRowClick(Number(gameId));
      }
    });
  });
}

async function handleRowClick(gameId: number): Promise<void> {
  let token = Auth.getAccessToken();
  try {
    const response = await fetch(
      `http://localhost:3000/games/id?gameId=${gameId}`,
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
    const gameMoves = await response.json();
    localStorage.setItem("moves", JSON.stringify(gameMoves));
    window.location.hash = "#/game-replay";
  } catch (error) {
    console.error("Failed to fetch user details:", error);
  }
}
