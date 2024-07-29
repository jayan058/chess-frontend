import { modal } from "../components/offline";



export function gameDifficultySelection(){
modal.show("Choose your level:", [
    { text: "Easy", onClick: () => startGame(1) },
    { text: "Medium", onClick: () => startGame(2) },
    { text: "Hard", onClick: () => startGame(3) },
  ]);

  function startGame(level: number) {
    modal.hide();
    const depth = level === 1 ? 1 : level === 2 ? 2 : 3;
    const searchDepthSelect = document.getElementById(
      "search-depth"
    ) as HTMLSelectElement;
    searchDepthSelect.value = depth.toString();
    searchDepthSelect.disabled = true;
    modal.show("YOU MAKE THE FIRST MOVE", []);
    setTimeout(() => {
      modal.hide();
    }, 2000);
  }


}