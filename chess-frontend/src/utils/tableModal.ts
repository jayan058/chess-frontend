export class TableModal {
    modalElement: HTMLElement;
    closeButton: HTMLElement;
    tableBody: HTMLTableSectionElement;

    constructor(modalId: string) {
        this.modalElement = document.getElementById(modalId) as HTMLElement;
        this.closeButton = this.modalElement.querySelector('.modal-close') as HTMLElement;
        this.tableBody = this.modalElement.querySelector('#move-history-table tbody') as HTMLTableSectionElement;

        // Bind event listeners
        this.bindEvents();
    }

    bindEvents() {
        // Close the modal when the close button is clicked
        this.closeButton.addEventListener('click', () => this.hide());

        // Close the modal when clicking outside the modal content
        window.addEventListener('click', (event) => {
            if (event.target === this.modalElement) {
                this.hide();
            }
        });
    }

    show(moves: string[] = []) {
        // Clear previous content
        this.tableBody.innerHTML = '';

        // Populate table with new data
        for (let i = 0; i < moves.length; i += 2) {
            const playerMove = moves[i] || '';
            const computerMove = moves[i + 1] || '';
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${playerMove}</td>
                <td>${computerMove}</td>
            `;
            this.tableBody.appendChild(row);
        }

        // Show the modal
        this.modalElement.style.display = 'block';
    }

    hide() {
        // Hide the modal
        this.modalElement.style.display = 'none';
    }
}