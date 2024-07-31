export class ModalManager {
  private static instances: ModalManager[] = [];

  private modal: HTMLElement | null;
  private modalMessage: HTMLElement | null;
  private closeButton: HTMLElement | null;

  constructor(modalId: string, messageId: string, closeButtonClass: string) {
    // Initialize the modal, message, and close button elements
    this.modal = document.getElementById(modalId);
    this.modalMessage = document.getElementById(messageId);
    this.closeButton = document.querySelector(`.${closeButtonClass}`);

    if (!this.modal || !this.modalMessage || !this.closeButton) {
      console.error(
        "ModalManager: Could not find one or more required elements."
      );
      return;
    }

    // Add event listener to the close button
    this.closeButton.addEventListener("click", () => this.close());

    // Hide the modal by default
    this.close();

    // Add this instance to the static array of instances
    ModalManager.instances.push(this);
  }

  // Show the modal with a specific message and type
  show(message: string, type: "success" | "error"): void {
    if (this.modalMessage) {
      this.modalMessage.textContent = message;
      this.modalMessage.className = type; 
    }
    if (this.modal) {
      this.modal.style.display = "block";
    }
  }

  // Hide the modal
  close(): void {
    if (this.modal) {
      this.modal.style.display = "none";
    }
  }

  // Static method to close all instances
  static closeAll(): void {
    for (const instance of ModalManager.instances) {
      instance.close();
    }
  }
}
