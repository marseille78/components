function FunnySelect(elSelector, nameField) {
    var o = new Object();
    o.elSelector = elSelector;
    o.nameField = nameField;
    o.init = function() {
        var currentEl = null;// Передаваемый текущий элемент
        var currentData = null;// Массив данных для текущего элемента
        var containerEl = null;// Контейнер текущего элемента
        while (document.querySelectorAll(this.elSelector).length > 0) {
            currentEl = document.querySelectorAll(this.elSelector)[0];
            currentData = getDataCurrent(currentEl);
            containerEl = createContainer(currentEl);

            createField(containerEl, nameField);
        }
    };

    /**
     * Получение массива данных для отображения
     * @param el {Element} - HTML-элемент, который принимаем за основу
     * @returns {Array}
     */
    function getDataCurrent(el) {
        var dataArr = [];
        switch (el.tagName) {
            case 'UL':
            case 'OL':
                dataArr = getData(el, 'li');
                break;
            case 'SELECT':
                dataArr = getData(el, 'option');
                break;
        }

        function getData(el, list) {
            return [].slice.apply(el.querySelectorAll(list)).map(function(item) { return item.textContent; });
        }

        return dataArr;
    }

    /**
     * Создание контейнера для элемента
     * @param el {Element} - Текущий элемент
     * @param containerClass {String} - Класс блока-контейнера
     * @returns {Element}
     */
    function createContainer(el, containerClass) {
        var containerClass = containerClass || 'funny-select';
        var container = document.createElement('div');
        container.classList.add(containerClass);
        el.parentNode.replaceChild(container, el);

        return container;
    }

    /**
     * Создание блока с полем ввода
     * @param block {Element} - Контейнер приложения
     * @param nameField {String} - значение атрибута 'name' для поля ввода
     * @returns {Element}
     */
    function createField(block, nameField) {
        var blockField = document.createElement('div');
        var field = document.createElement('input');
        field.setAttribute('type', 'text');
        field.setAttribute('name', nameField);
        blockField.appendChild(field);
        block.appendChild(blockField);

        return field;
    }

    return o;
}

var list1 = FunnySelect('.test-list');
list1.init();

var list2 = FunnySelect('.test-list-1');
list2.init();

var sel = FunnySelect('.test-select');
sel.init();

var sel2 = FunnySelect('.test-select-2');
sel2.init();