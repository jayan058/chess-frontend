import { Online } from "../onlineGameServices/players/online";

// Theme mappings
// Declaring the themes
declare const alpha_piece_theme: (piece: string) => string;
declare const chess24_piece_theme: (piece: string) => string;
declare const dilena_piece_theme: (piece: string) => string;
declare const leipzig_piece_theme: (piece: string) => string;
declare const metro_piece_theme: (piece: string) => string;
declare const symbol_piece_theme: (piece: string) => string;
declare const uscf_piece_theme: (piece: string) => string;
declare const wikipedia_piece_theme: (piece: string) => string;

declare const chess24_board_theme: string[];
declare const metro_board_theme: string[];
declare const leipzig_board_theme: string[];
declare const wikipedia_board_theme: string[];
declare const dilena_board_theme: string[];
declare const uscf_board_theme: string[];
declare const symbol_board_theme: string[];

const pieceThemes: { [key: string]: (piece: string) => string } = {
  alpha: alpha_piece_theme,
  chess24: chess24_piece_theme,
  dilena: dilena_piece_theme,
  leipzig: leipzig_piece_theme,
  metro: metro_piece_theme,
  symbol: symbol_piece_theme,
  uscf: uscf_piece_theme,
  wikipedia: wikipedia_piece_theme,
};

const boardThemes: { [key: string]: string[] } = {
  chess24: chess24_board_theme,
  metro: metro_board_theme,
  leipzig: leipzig_board_theme,
  wikipedia: wikipedia_board_theme,
  dilena: dilena_board_theme,
  uscf: uscf_board_theme,
  symbol: symbol_board_theme,
};

export class ThemeManager {
  private pieceThemeDropdown: HTMLSelectElement;
  private boardThemeDropdown: HTMLSelectElement;
  private board: any;

  constructor(
    pieceThemeDropdownId: string,
    boardThemeDropdownId: string,
    board: any,
  ) {
    this.pieceThemeDropdown = document.getElementById(
      pieceThemeDropdownId,
    ) as HTMLSelectElement;
    this.boardThemeDropdown = document.getElementById(
      boardThemeDropdownId,
    ) as HTMLSelectElement;
    this.board = board;

    this.initEventListeners();
  }

  private initEventListeners() {
    this.pieceThemeDropdown.addEventListener("change", (event) => {
      const selectedPieceTheme = (event.target as HTMLSelectElement).value;
      this.changePieceTheme(selectedPieceTheme);
    });

    this.boardThemeDropdown.addEventListener("change", (event) => {
      const selectedBoardTheme = (event.target as HTMLSelectElement).value;
      this.changeBoardTheme(selectedBoardTheme);
    });
  }

  private changePieceTheme(theme: string) {
    console.log(theme);

    const pieceThemeFunction = pieceThemes[theme];
    const boardThemeArray = boardThemes[theme];

    if (!pieceThemeFunction) {
      console.error(`Piece theme function not found for theme: ${theme}`);
      return;
    }

    if (!boardThemeArray) {
      console.error(`Board theme array not found for theme: ${theme}`);
      return;
    }

    if (boardThemeArray.length !== 2) {
      console.error(
        `Board theme array length is not 2: ${boardThemeArray.length}`,
      );
      return;
    }

    // Reinitialize the board with the new piece theme
    const currentPosition = Online.board.position();
    if (Online.board.flip() == true) {
      Online.board.flip();
    }
    Online.board = ChessBoard("board", {
      draggable: true,
      position: currentPosition,
      onDrop: Online.handleMove.bind(Online),
      onSnapEnd: Online.onSnapEnd.bind(Online),
      pieceTheme: pieceThemeFunction,
      boardTheme: boardThemeArray,
    });
  }

  private changeBoardTheme(theme: string) {
    const boardThemeArray = boardThemes[theme];
    console.log(boardThemeArray);

    if (boardThemeArray) {
      // Reinitialize the board with the new board theme
      const currentPosition = this.board.position();
      Online.board = ChessBoard("board", {
        draggable: true,
        position: currentPosition,
        onDrop: Online.handleMove.bind(Online),
        onSnapEnd: Online.onSnapEnd.bind(Online),
        pieceTheme: this.board.pieceTheme,
        boardTheme: boardThemeArray,
      });
    }
  }
}
