import { ModalManager } from "./modal";
export function sessionChangeListeners() {
  window.addEventListener("storage", (event) => {
    if (event.key === "authChange") {
      const modal = new ModalManager("myModal", "modalMessage", "close");
      modal.show("Can only use one account per session", "error");
      setTimeout(() => {
        window.location.hash = "#/login";
      }, 3000);
    }
  });
}
