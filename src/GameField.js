class GameField {
    /**
     * Просто конструктор, ищет элемент поля, устанавливает очередность хода крестиками
     * @throws {Error} если не найдет .game-field table вызыввется исключение
     */
    constructor() {
        this.gameFieldElem = document.querySelector('.game-field table');
        if (this.gameFieldElem == null) {
            throw new Error('Объект ".game-field table" отсутствует в документе');
        }

    }
    /**
     * Получение настроек для отрисовки и поля и начала игры, инициализация игрового массива
     * @param {Settings} _settings объект настроек
     */
    init(_settings, _onClickHandler) {
        this.settings = _settings;
        this.onClickHandler = _onClickHandler;
    }

    /**
     * Метод отрисовки пустого игрового поля. И сразу подключаем eventListener к
     * внось отрисованным ячейкам
     */
    renderGameField() {
        this.gameFieldElem.innerHTML = '';
        for (let i = 0; i <= (this.settings.dimY - 1); i++) {
            let tr = document.createElement('tr');
            this.gameFieldElem.appendChild(tr);
            for (let j = 0; j <= (this.settings.dimX - 1); j++) {
                let td = document.createElement('td');
                td.dataset.row = i;
                td.dataset.column = j;
                td.addEventListener('click', this.onClickHandler);
                tr.appendChild(td);
            }
        }
        this.tdArray = this.gameFieldElem.querySelectorAll('td');

    }

    /**
     * 
     * @param {number} x номер ячейки по горизонтали. Нумерация начинается с 0 
     * @param {number} y номер ячейки по верикали. Нумерация с 0
     */
    getCellByXY(x, y) {
        return this.gameFieldElem.querySelector(`tr:nth-child(${y+1}) td:nth-child(${x+1})`);
    }

    /**
     *Возвращает координыты ячейки для псевдомасива 
     * @param {Object} cell передается объект ячейки игрового поля, по которому кликнули, например 
     */
    getXYOfCell(cell) {
        return {
            x: cell.dataset.column,
            y: cell.dataset.row
        }
    }

    putFigure(cell, className) {
        cell.classList.add(className);
    }

}