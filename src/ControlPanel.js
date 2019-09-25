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