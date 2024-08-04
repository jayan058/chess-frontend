//All the necessary imports
import { ModalManager } from "../utils/modal";
import { formatMessage } from "../utils/formatMessage";
//Class to handle the signup
export class SignupPage {
  static async load(): Promise<string> {
    const response = await fetch("src/views/signup.html");
    return response.text();
  }

  static initEventListeners() {
    //Grabbing all the form elements
    const usernameInput = document.getElementById(
      "username",
    ) as HTMLInputElement;
    const passwordInput = document.getElementById(
      "password",
    ) as HTMLInputElement;
    const photoInput = document.getElementById("photo") as HTMLInputElement;
    const emailInput = document.getElementById("email") as HTMLInputElement;
    const imagePreview = document.getElementById(
      "image-preview",
    ) as HTMLImageElement;

    if (photoInput && imagePreview) {
      photoInput.addEventListener("change", (event) => {
        const input = event.target as HTMLInputElement;
        const file = input.files ? input.files[0] : null;

        if (file) {
          const reader = new FileReader();

          reader.onload = (e) => {
            imagePreview.src = e.target?.result as string; //Setting the src of the image to send to the backend to upload
          };

          reader.readAsDataURL(file);
        } else {
          imagePreview.src = ""; // Clear the image preview if no file is selected
        }
      });
    }

    document
      .getElementById("signup-form")
      ?.addEventListener("submit", async (event: Event) => {
        event.preventDefault();
        const formData = new FormData(); //Creating a formdata object to bundle all the necessary data to and send to the backend
        formData.append("userName", usernameInput.value);
        formData.append("password", passwordInput.value);
        formData.append("email", emailInput.value);

        if (photoInput.files && photoInput.files[0]) {
          formData.append("photo", photoInput.files[0]);
        }

        try {
          const response = await fetch("http://localhost:3000/user", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            const result = await response.json();
            let formattedMessage = formatMessage(result.message);
            const modal = new ModalManager("myModal", "modalMessage", "close");
            modal.show(formattedMessage, "error");
          }

          const result = await response.json();
          let formattedMessage = formatMessage(
            result.message +
              " now login to Chess.com using the new credentials",
          );
          const modal = new ModalManager("myModal", "modalMessage", "close");
          modal.show(formattedMessage, "success");
          setTimeout(() => {
            window.location.hash = "#/login"; //If the login in successfull then sending the user to the login page
          }, 3000);
        } catch (error: unknown) {
          console.error(error);
        }
      });
  }
}
