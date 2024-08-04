//All the necessary imports
import { Router } from "./router";
import socketInstance from "./utils/socket"; // Import the SocketSingleton instance
import { ModalManager } from "./utils/modal";
import { ChessAlertModal } from "./modals/chessAlertModal";
import { TableModal } from "./modals/tableModal";
document.addEventListener("DOMContentLoaded", () => {
  Router.init();
  let previousHash = window.location.hash;

  window.addEventListener("hashchange", () => {
    const oldHash = previousHash;
    const newHash = window.location.hash;

    // Defining routes where socket should be disconnected
    const disconnectRoutes = [
      "#/welcome",
      "#/login",
      "#/home",
      "#/leader-board",
    ];

    // Defining routes where socket should be reconnected
    const reconnectRoutes = [
      "#/create-game",
      "#/join-game",
      "#/watch-game",
      "#/random-match-making",
    ];

    //Disconnecing the socket connection where its not required
    if (disconnectRoutes.includes(newHash)) {
      socketInstance.disconnect();
    }
    //Remving all the modals that might be showing during the hash change
    ModalManager.closeAll();
    ChessAlertModal.closeAll();
    TableModal.closeAll();

    // Load the new content
    Router.loadContent();

    // Logic to disconnect and reconnect the socket based on old and new hash
    const shouldReconnect =
      (oldHash === "#/online" ||
        oldHash === "#/welcome" ||
        oldHash == "#/online-audience-page") &&
      reconnectRoutes.includes(newHash);

    if (shouldReconnect) {
      socketInstance.disconnect();
      setTimeout(() => {
        socketInstance.reconnect();
      }, 100);
    } else if (reconnectRoutes.includes(newHash) && !shouldReconnect) {
      setTimeout(() => {
        socketInstance.reconnect();
      }, 100);
    }

    previousHash = newHash; // Updating the previous hash
  });
});
