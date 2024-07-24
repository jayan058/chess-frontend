export class ChessAlertModal {
    modalElement: HTMLDivElement;
    messageElement: HTMLParagraphElement;
    buttonsElement: HTMLDivElement;

    constructor() {
        this.modalElement = document.createElement('div');
        this.modalElement.classList.add('modal');
        this.modalElement.innerHTML = `
            <div class="modal-content">
                <p id="modalMessage"></p>
                <div id="modalButtons" class="modal-buttons"></div>
            </div>
        `;
        document.body.appendChild(this.modalElement);
        this.messageElement = this.modalElement.querySelector('#modalMessage') as HTMLParagraphElement;
        this.buttonsElement = this.modalElement.querySelector('#modalButtons') as HTMLDivElement;
    }

    show(message: string, buttons: { text: string, onClick: () => void }[] = []) {
        this.messageElement.innerText = message;
        this.buttonsElement.innerHTML = '';
        buttons.forEach(button => {
            const buttonElement = document.createElement('button');
            buttonElement.classList.add('modal-buttons__indivisual-buttons')
            buttonElement.innerText = button.text;
            buttonElement.onclick = button.onClick;
            this.buttonsElement.appendChild(buttonElement);
        });
        this.modalElement.style.display = 'block';
    }

    hide() {
        this.modalElement.style.display = 'none';
    }
    
    
}