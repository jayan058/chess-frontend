import { Auth } from "../auth";
import { Router } from "../router";
export class OfflinePage {
    static async load(): Promise<string> {
      if (!Auth.isLoggedIn()) {
        window.location.hash = "#/login";
        Router.loadContent();
        return "";
      }
      const response = await fetch("src/public/offline.html");
      return response.text();
    }
    static initEventListeners() {
      // Function to load a script file
      function loadScript(src:any, callback:any) {
          let script = document.createElement('script');
          script.src = src;
          script.onload = callback;
          document.body.appendChild(script);
      }

      // Load jQuery first
      loadScript('https://code.jquery.com/jquery-3.6.0.min.js', () => {

          loadScript('./src/public/chessboard-1.0.0.js', () => {
              console.log('chessboard-1.0.0.js loaded');
              loadScript('https://cdnjs.cloudflare.com/ajax/libs/chess.js/0.10.3/chess.min.js', () => {
                  console.log('chess.min.js loaded');
                  loadScript('./src/public/chessboardjs-themes.js', () => {
                      console.log('chessboardjs-themes.js loaded');
                      loadScript('src/public/script.js', () => {
                          console.log('script.js loaded');
                          // All scripts are loaded, you can initialize your application here
                      });
                  });
              });
          });
      });
  }
  }
  