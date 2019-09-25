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