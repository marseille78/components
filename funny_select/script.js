function FunnySelect(elSelector, obj) {
    var o = new Object();
    o.elSelector = elSelector;
    o.fieldName = obj.fieldName;
    o.init = function() {
        var currentEl = {};// Передаваемый текущий элемент
        var currentData = {};// Массив данных для текущего элемента
        var containerEl = {};// Контейнер текущего элемента
        var field = {};// Поле ввода
        var dataList = {};// Структура списка данных
        var self = this;
        var i = 0;

        document.addEventListener('click', function(e) {
            var event = e || event;
            if (!event.target.closest('.' + containerClass + '.active')) {
                hideDataList(containerClass);
            }
        });

        while (document.querySelectorAll(this.elSelector).length > 0) {
            currentEl[i] = document.querySelectorAll(this.elSelector)[0];
            currentData[i] = getDataCurrent(currentEl[i]);
            containerEl[i] = createContainer(currentEl[i]);
            var containerClass = containerEl[i].classList[0];

            field[i] = createField(containerEl[i], this.fieldName);
            dataList[i] = createDataList(currentData[i], containerEl[i]);
            setDefaultValue(field[i], currentData[i][0]);
            field[i].setAttribute('data-default-value', currentData[i][0]);

            field[i].addEventListener('focus', function(e) {
                var list = this.parentNode.nextElementSibling;
                if (!this.closest('.active')) {
                    hideDataList(containerClass);
                    showDataList(this, list);
                }
            });

            field[i].addEventListener('input', function() {
                debugger;
                completeField(this);
            });

            i++;
        }
    };

    function completeField(field) {
        debugger;
    }

    /**
     * Скрытие всех списков данных
     * @param containerClass {String} - Класс контейнера компонента
     */
    function hideDataList(containerClass) {
        var i = 0;
        while (document.querySelectorAll('.' + containerClass + '.active').length > 0) {
            setDefaultValue(document.querySelectorAll('.' + containerClass + '.active')[i].querySelector('input[type=text]'),
                document.querySelectorAll('.' + containerClass + '.active')[i].querySelector('input[type=text]').getAttribute('data-default-value'));
            document.querySelectorAll('.' + containerClass + '.active')[i].classList.remove('active');
        }
    }

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

    /**
     * Создание структуры списка данных
     * @param arrData {Array} - Массив данных
     * @param insertPlace {Element} - Место для вставки списка данных
     * @returns {Element}
     */
    function createDataList(arrData, insertPlace) {
        var dataList = document.createElement('ul');
        arrData.forEach(function(item) {
            var listItem = document.createElement('li');
            listItem.innerHTML = item;
            dataList.appendChild(listItem);
        });
        insertPlace.appendChild(dataList);

        return dataList;
    }

    /**
     * Установка значения по умолчанию
     * @param defValue {String} - Значение поля ввода по умолчанию
     * @param field {Element} - Текущее поле ввода
     */
    function setDefaultValue(field, dataItem, defValue) {
        // debugger;
        // defValue = defValue || '';
        // field.setAttribute('value', defValue);
        // field.value = defValue;
        field.value = dataItem;
    }

    /**
     * Отображение списка данных при фокусе
     * @param field {Element} - Поле ввода на котором произошел фокус
     * @param dataList {Element} - Список данных
     */
    function showDataList(field, dataList) {
        dataList.classList.add('showed');
        dataList.parentNode.classList.add('active');
        field.value = '';
    }

    return o;
}

var list1 = FunnySelect('.test-list', {
    fieldName: 'testFieldName'
});
list1.init();

var list2 = FunnySelect('.test-list-1', {
    fieldName: 'test2FieldName'
});
list2.init();

var sel = FunnySelect('.test-select', {
    fieldName: 'test3FieldName'
});
sel.init();

var sel2 = FunnySelect('.test-select-2', {
    fieldName: 'test4FieldName'
});
sel2.init();