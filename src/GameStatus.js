class GameStatus {
    constructor() {
        this.statusName = "playing";
        this.statusWindow = document.querySelector('.statusWindow');
        this.statusTextContainer = document.querySelector('.statusWindow div');
        this.statusWindow.querySelector('button').addEventListener('click', this.closeStatusWindow.bind(this));
    }

    displayStatus(statusMessage) {
        this.statusWindow.classList.remove('hiddenElement');
        this.statusTextContainer.innerHTML = statusMessage;
    }

    closeStatusWindow() {
        this.statusWindow.classList.add('hiddenElement');
    }




}