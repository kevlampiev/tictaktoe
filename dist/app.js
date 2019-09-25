class ControlPanel {
    /**
     * Просто конструктор
     * @param {Settings} _settings ссылка на настройки
     */
    constructor(_settings) {
        this.dimXInput = document.querySelector('input[name="dimension-x-input"]');
        this.dimYInput = document.querySelector('input[name="dimension-y-input"]');
        this.winLengthInput = document.querySelector('input[name="length-to-win"]');
        this.startButton = document.querySelector('button');
        this.settings = _settings;
        this.drawSettings();
    }

    /**
     * Чтение настроек из панели, попытка их установить в settings
     */
    getSettings() {
        let newParams = {
            dimX: Number(this.dimXInput.value),
            dimY: Number(this.dimYInput.value),
            winLength: Number(this.winLengthInput.value)
        };
        this.settings.init(newParams);
    }

    /**
     * Простановка значений настроек в соответствующие элементы формы 
     */
    drawSettings() {
        this.dimXInput.value = this.settings.dimX;
        this.dimYInput.value = this.settings.dimY;
        this.winLengthInput.value = this.settings.winLength;
    }
}
//Массив возможных букв, которые можно ставить в ячейки 
//И классы, как их отображать

let figures = [{
        letter: 'X',
        classToDisplay: 'cellWithX',
        cusrorClass: 'turnXCursor'
    },
    {
        letter: '0',
        classToDisplay: 'cellWithZero',
        cusrorImage: 'turnOCursor'
    }
];
class Game {
  /**
   *  Инициализация всех элементов, навешивание обработчиков событий запуск игры
   */

  get gameStatus() {
    return this._status;
  }

  set gameStatus(aValue) {
    switch (aValue) {
      case "playing":
        this.gameStatusHolder.closeStatusWindow();
        this._status = aValue;
        break;
      case "win1":
        this.gameStatusHolder.displayStatus("<h2>Игра кончена</h2> <p> Выиграли крестики </p>");
        this._status = aValue;
        break;
      case "win2":
        this.gameStatusHolder.displayStatus("<h2>Игра кончена</h2> <p> Выиграли нолики </p>");
        this._status = aValue;
        break;
      case "draw":
        this.gameStatusHolder.displayStatus("<h2>Игра кончена</h2> <p> Закончились свободные клетки. Ничья </p>");
        this._status = aValue;
        break;
    }

  }

  /**
   * Сохдает и инициализирует объекты, запучскает игру
   */
  init() {
    this.settings = new Settings();
    this.settings.init({
      dimX: 3,
      dimY: 3,
      winLength: 3
    });
    this.gameField = new GameField();
    this.gameField.init(this.settings, this.makeMove);
    this.controlPanel = new ControlPanel(this.settings);
    this.gameStatusHolder = new GameStatus();
    this.gfArray = [];
    this.movesCount = 0; //Общее количество сделанных шагов
    this.startNewGame();

    this.controlPanel.startButton.addEventListener("click", event => {
      event.preventDefault();
      this.startNewGame();
    });
  }

  /**
   * Запускает новую игру с настройками, указанными в settings
   */
  startNewGame() {
    this.movesCount = 0;
    this.controlPanel.getSettings();
    this.gameStatus = "playing";
    this.nextTurn = 0; //Чья очередь ходить
    //инициализация внутреннего массива. По нему бегать проще
    this.gfArray = new Array(this.settings.dimY);
    for (let i = 0; i < this.settings.dimY; i++) {
      this.gfArray[i] = new Array(this.settings.dimX).fill("");
    }
    this.gameField.renderGameField();
    this.gameField.tdArray.forEach(elem => {
      elem.addEventListener("click", this.makeStep.bind(this));
    });
  }



  makeStep(event) {
    if (this.gameStatus != "playing") {
      return;
    }

    let point = {
      x: event.target.dataset.column,
      y: event.target.dataset.row
    };

    if (this.gfArray[point.y][point.x] == "") {
      this.movesCount++;
      this.gfArray[point.y][point.x] = figures[this.nextTurn].letter;

      this.gameField.putFigure(
        event.target,
        figures[this.nextTurn].classToDisplay
      );
      //Проверяем, выиграл ли кто-нибудь. Если - нет, а вдруг поле заполнено
      let winCombo = this.getWinCombination(point.x, point.y);
      if (winCombo.length > 0) {

        this.selectWinCells(winCombo);
        //закрыть игру
        if (this.nextTurn == 0) {
          this.gameStatus = "win1";
        } else {
          this.gameStatus = "win2";
        }

      } else if (this.movesCount >= this.settings.dimX * this.settings.dimY) {
        this.gameStatus = "draw";
        alert('никто не выиграл');
      }

      this.switchTurn();


    }
    event.stopPropagation();
  }

  /**
   * Переключает ход с крестика-на нолик и наоборот
   */
  switchTurn() {
    this.nextTurn++;
    if (this.nextTurn > figures.length - 1) {
      this.nextTurn = 0;
    }
  }
  /**
   * Функция, возвращающая выигрышную комбинацию
   * @param {number} x положение по горизонтали от которого ищутся выигрышные комбинации
   * @param {number} y положение по вертикали от которого ищутся выигрышные комбинации
   * Возвращает массив точек (х,y) соответствующих выигрышной линии или null, если такой нет
   */
  getWinCombination(x, y) {
    let currentLetter = figures[this.nextTurn].letter;
    let gArr = this.gfArray;
    let wLenght = this.settings.winLength;

    //Вспомогательная внутренния функция
    //До ее запуска определяем сколько шагов по вертикали и горизонтали можем сделать назад и вперед, для составления
    //выигрышной комбинации. Проверяем комбинации для 4х линий
    function getWinComboLines() {
      let result = [];
      let currentX = x0;
      let currentY = y0;
      let letterInArr = "";
      for (let i = 0; i < steps; i++) {
        letterInArr = gArr[currentY][currentX];

        if (letterInArr == currentLetter) {
          result.push({
            x: currentX,
            y: currentY
          });
        } else if (result.length < wLenght) {
          result = [];
        }
        currentX += dX;
        currentY += dY;
      }

      if (result.length >= wLenght) {
        return result;
      } else {
        return [];
      }
    }


    //1 возможная линия идет слева-направо и сверху-вниз

    let stepBack = Math.min(x, y, this.settings.winLength - 1);
    let stepForward = Math.min(
      this.settings.dimX - x - 1,
      this.settings.dimY - y - 1,
      this.settings.winLength - 1
    );
    let x0 = x * 1 - stepBack;
    let y0 = y * 1 - stepBack;
    let steps = stepBack + 1 + stepForward;
    let dX = 1;
    let dY = 1;
    let line1 = getWinComboLines();

    //2 возможная линия идет слева-направо строго по горизонтали

    stepBack = Math.min(x, this.settings.winLength - 1);
    stepForward = Math.min(
      this.settings.dimX - x - 1,
      this.settings.winLength - 1
    );

    x0 = x - stepBack;
    y0 = y * 1;
    steps = stepBack + 1 + stepForward;
    dX = 1;
    dY = 0;
    let line2 = getWinComboLines();

    //3 возможная линия идет слева-направо и снизу-вверх
    stepBack = Math.min(
      x * 1,
      this.settings.winLength - 1,
      Math.max(this.settings.dimY - y - 1, 0)
    );
    stepForward = Math.min(
      this.settings.dimX - x - 1,
      y,
      this.settings.winLength - 1
    );
    x0 = x - stepBack;
    y0 = y * 1 + stepBack;
    steps = stepBack + 1 + stepForward;
    dX = 1;
    dY = -1;
    let line3 = getWinComboLines();

    //4 возможная линия идет строго вниз
    stepBack = Math.min(y * 1, this.settings.winLength - 1);
    stepForward = Math.min(
      this.settings.dimY - y - 1,
      this.settings.winLength - 1
    );
    x0 = x * 1;
    y0 = Math.max(y * 1 - stepBack, 0);
    steps = stepBack + 1 + stepForward;
    dX = 0;
    dY = 1;
    let line4 = getWinComboLines();

    return line1
      .concat(line2)
      .concat(line3)
      .concat(line4);
  }

  /**
   * Подсвечивает все точки массива на доске
   * @param {array} arr массив выигрышных точек {x,y}
   */
  selectWinCells(arr) {
    this.gameField.tdArray.forEach(el => {
      el.classList.add('fadedCell');
    });
    arr.forEach(el => {
      this.gameField.getCellByXY(el.x, el.y).classList.remove('fadedCell');
    });



  }

  run() {

  }

  done() {}
}
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
window.addEventListener('load', () => {
    let game = new Game();

    game.init();
    game.run();
    game.done()
});
class Settings {

    constructor() {

    }
    /**
     * 
     * @param {Object} _params - параметры игры
     * @param {number} _params.dimX - размерность поля по горизонтали
     * @param {number} _params.dimY - размерность поля по вертикали
     * @param {number} _params.winLength - необходимое количество крестиков или ноликов в ряд для победы
     * @throws {Error} если переданы неверные настройки, выбрасывается ошибка
     */
    init(_params) {
        if (_params.dimX < 3 || _params.dimX > 21) {
            throw new Error('Размерность по горизонтали должна быть в пределах [3..21]');
        }
        this.dimX = _params.dimX;

        if (_params.dimY < 3 || _params.dimY > 21) {
            throw new Error('Размерность по вертикали должна быть в пределах [3..21]');
        }
        this.dimY = _params.dimY;

        if (_params.winLength < 3 || _params.winLength > Math.max(_params.dimX, _params.dimY)) {
            throw new Error('Количество фигур в ряд должно быть не меньше трех и не больше максимальной размерности поля');
        }
        this.winLength = _params.winLength;

    }
}
//# sourceMappingURL=maps/app.js.map
