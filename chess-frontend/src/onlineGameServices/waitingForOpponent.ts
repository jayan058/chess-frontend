import { Auth } from "../auth";
import { Router } from "../router";

export class WaitingForOpponent {
    static async load(): Promise<string> {
        if (!Auth.isLoggedIn()) {
            window.location.hash = "#/login";
            Router.loadContent();
            return "";
        }
        const response = await fetch("src/views/waitingForOpponent.html");
        return response.text();
    }

    static initEventListeners() {
        const userPicture = (localStorage.getItem('picture') || '{}');
        const userName =(localStorage.getItem('name') || '{}');
        console.log(userName);
        
        const userNameElem = document.getElementById('user-name') as HTMLParagraphElement;
        const userPictureElem = document.getElementById('user-picture') as HTMLImageElement;
        

        if (userPicture) {
            userPictureElem.src = userPicture;
        }

        if (userName) {
            userNameElem.innerText = `Room created by ${userName}`;
        }
    }
}


