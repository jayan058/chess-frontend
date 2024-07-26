import { Router } from "./router";
import socketInstance from './utils/socket'; // Import the SocketSingleton instance

document.addEventListener("DOMContentLoaded", () => {
    Router.init();
    let previousHash = window.location.hash;

    window.addEventListener("hashchange", () => {
        const oldHash = previousHash;
        const newHash = window.location.hash;

        // Define routes where socket should be disconnected
        const disconnectRoutes = [
            '#/create-game',
            '#/join-game',
            '#/welcome',
            '#/login',
            '#/signup',
            '#/home'
        ];

        if (disconnectRoutes.includes(newHash)) {
            // Disconnect socket when navigating to any of the defined routes
            socketInstance.disconnect();
        }

        // Load the new content
        Router.loadContent();

        if (disconnectRoutes.includes(newHash)) {
            // Reconnect the socket after reaching any of the defined routes
            setTimeout(() => {
                socketInstance.reconnect();
            }, 100); // Adjust the timeout duration as needed
        }

        previousHash = newHash; // Update the previous hash
    });
});
