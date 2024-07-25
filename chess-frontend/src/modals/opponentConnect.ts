export class OpponentConnectModal {
    private modalId: string;
    private messageId: string;
    private closeId: string;
    private modalElement: HTMLElement | null;
    private messageElement: HTMLElement | null;
    private closeButton: HTMLElement | null;

    constructor(modalId: string, messageId: string, closeId: string) {
        this.modalId = modalId;
        this.messageId = messageId;
        this.closeId = closeId;

        this.createModal();
        this.modalElement = document.getElementById(this.modalId);
        this.messageElement = document.getElementById(this.messageId);
        this.closeButton = document.getElementById(this.closeId);

        if (this.closeButton) {
            this.closeButton.addEventListener('click', () => this.hide());
        }
    }

    private createModal(): void {
        // Create modal elements
        const modal = document.createElement('div');
        modal.id = this.modalId;
        modal.className = 'modal';

        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';

        const closeButton = document.createElement('span');
        closeButton.id = this.closeId;
        closeButton.className = 'close';
        closeButton.innerHTML = '&times;';

        const messageContainer = document.createElement('div');
        messageContainer.id = this.messageId;
        messageContainer.className = 'modal-message';

        modalContent.appendChild(closeButton);
        modalContent.appendChild(messageContainer);
        modal.appendChild(modalContent);

        // Append modal to the body
        document.body.appendChild(modal);
    }

    public show(content: string): void {
        if (this.messageElement) {
            this.messageElement.innerHTML = content;
        }
        if (this.modalElement) {
            this.modalElement.classList.add('show');
        }

        // Auto-hide after 10 seconds
        setTimeout(() => this.hide(), 10000);
    }

    public hide(): void {
        if (this.modalElement) {
            this.modalElement.classList.remove('show');
        }
    }
}
