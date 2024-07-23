// export class TableModal {
//     private modalElement: HTMLElement;
//     private closeButton: HTMLElement;
//     private tableBody: HTMLElement;

//     constructor(modalId: string) {
//         this.modalElement = document.getElementById(modalId)!;
//         this.closeButton = this.modalElement.querySelector('.modal-close')!;
//         this.tableBody = this.modalElement.querySelector('#move-history-table tbody')!;
//         this.bindEvents();
//     }

//     private bindEvents(): void {
//         this.closeButton.addEventListener('click', () => this.hide());
//         window.addEventListener('click', (event) => {
//             if (event.target === this.modalElement) {
//                 this.hide();
//             }
//         });
//     }

//     show(moves: string[] = []): void {
//         this.tableBody.innerHTML = '';
//         for (let i = 0; i < moves.length; i += 2) {
//             const playerMove = moves[i] || '';
//             const computerMove = moves[i + 1] || '';
//             const row = document.createElement('tr');
//             row.innerHTML = `
//                 <td>${playerMove}</td>
//                 <td>${computerMove}</td>
//             `;
//             this.tableBody.appendChild(row);
//         }
//         this.modalElement.style.display = 'block';
//     }

//     hide(): void {
//         this.modalElement.style.display = 'none';
//     }
// }
