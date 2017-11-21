/**
 * Создание объектов Funny Select
 * @param elSelector {String} - Селектор принимаемых елементов
 * @param objData {Object} - Объект дополнительных свойств:
 *      fieldName {String} - Корень значения атрибута поля (name) для поля ввода
 *      fieldId {String} - Корень значения атрибута поля (id) для поля ввода
 *      containerClass {String} - Класс контейнера. По умолчанию (funny-field-select) (В случае изменения, нужно будет изменить классы в файле стилей)
 * @returns {Object}
 * @constructor
 */
function FunnyFieldSelect(elSelector, objData) {
    var elSelector = elSelector;
    var fieldName = objData.fieldName;
    var fieldId = objData.fieldId;
    var containerClass = objData.containerClass || 'funny-field-select';

    var o = new Object();

    /**
     * Метод инициализации объекта
     *
     * *** ДОПОЛНИТЕЛЬНЫЕ ПЕРЕМЕННЫЕ ***
     * listElements {List} - Список элементов с заданным селектором
     * container - Промежуточная переменная для создания Элемента-контейнера для текущего элемента
     * listFields {List} - Список полей ввода для заданного селектора
     * selectorContainers {String} - Селектор активного контейнера
     * self {Object} - Ссылка на текущий контекст (Для работы с содержимым функций)
     *
     * *** СОЗДАВАЕМЫЕ СВОЙСТВА ОБЪЕКТА: ***
     * data-n {Array} - Массив данных для текущего элемента, где n - его порядковый номер
     * container-n {Element} - Элемент-контейнер для текущего элемента, где n - его порядковый номер
     * field-n {Element} - Поле ввода для текущего элемента, где n - его порядковый номер
     */
    o.init = function() {
        var listElements = document.querySelectorAll(elSelector);

        for (var i = 0; i < listElements.length; i++) {

            this['data-' + i] = getDataCurrent(listElements[i]);
            var container = createContainer(listElements[i], containerClass);
            container.setAttribute('data-idx', i);
            this['container-' + i] = container;
            this['field-' + i] = createField(this['container-' + i], fieldName + '-' + i, fieldId + '-' + i);
            this['field-' + i].value = this['data-' + i][0];

            this['container-' + i].addEventListener('keydown', function (e) {
                var e = e || event;
                moveActiveItem(e, this);
            });
        }

        var listFields = document.querySelectorAll('.' + containerClass + ' input[type=text]');
        var selectorContainers = '.' + containerClass;
        var self = this;

        for (var i = 0, len = listFields.length; i < len; i++) {

            /**
             * *** ПЕРЕМЕННЫЕ ДЛЯ ОБРАБОТЧИКА СОБЫТИЯ 'FOCUS' ***
             * idx {Number} - Индекс текущего объекта
             * currentField {Element} - Поле ввода с текущим индексом для каждого из элементов с таким индексом
             * currentData {Array} - Массив данных для текущего поля ввода
             * currentContainer {Element} - Контейнер для текущего компонента
             */
            listFields[i].addEventListener('focus', function(e) {
                var e = e || event;
                e.stopImmediatePropagation();
                var idx = this.closest('[data-idx]').getAttribute('data-idx');
                var currentField = self['field-' + idx];
                var currentContainer = self['container-' + idx];
                var listContainers = document.querySelectorAll(selectorContainers);

                this.select();

                destroyDataList(listContainers, this);

                // Отсекаем посторонние поля ввода
                if (currentField !== this || currentContainer.classList.contains('active')) return;

                var currentData = self['data-' + idx];
                currentContainer.classList.add('active');

                createDataList(currentData, currentContainer, currentField);

                var listItem = currentContainer.querySelectorAll('li');
                for (var i = 0, len = listItem.length; i < len; i++) {
                    listItem[i].addEventListener('click', function(e) {
                        currentField.value = this.textContent;
                        currentContainer.classList.remove('active');
                        currentContainer.removeChild(this.parentNode);
                    });
                }
            });

            listFields[i].addEventListener('input', function() {
                completeField(this, self);
            });
        }

        /**
         * *** ВНУТРЕННИЕ ПЕРЕМЕННЫЕ ДЛЯ ОБРАБОТЧИКА 'CLICK' НА 'DOCUMENT' ***
         * listContainers {List} - Список контейнеров
         */
        document.addEventListener('click', function(e) {
            var e = e || event;
            var listContainers = document.querySelectorAll(selectorContainers);

            if (listContainers.length > 0 && !e.target.closest(selectorContainers)) {
                destroyDataList(listContainers);
            }
        });
    };

    /**
     * Перемещение активного элемента по списку
     * @param event {Object} - Объект события
     * @param ctx {Element} - Контейнер компонента
     *
     * ВНУТРЕННИЕ ПЕРЕМЕННЫЕ
     * var currentList {Element} - Текущий список элементов <UL>
     * var currentListItems {Element} - Список элементов списка <LI>
     * var currentField {Element} - Текущее поле ввода <INPUT>
     */
    function moveActiveItem(event, ctx) {
        var currentList = ctx.querySelector('ul');
        var currentListItems = currentList.querySelectorAll('li');
        var currentField = ctx.querySelector('input[type=text]');

        // Нажатие кнопки DOWN
        if (event.keyCode === 40) {
            if (ctx.querySelectorAll('.active').length > 0) {
                moveItem();
            }
        }
        // Нажатие кнопки UP
        else if (event.keyCode === 38) {
            if (ctx.querySelectorAll('.active').length > 0) {
                moveItem(false);
            }
        }
        // Нажатие кнопки ENTER
        else if (event.keyCode === 13 || event.keyCode === 39 || event.keyCode === 32) {
            event.preventDefault();
            currentField.value = ctx.querySelector('ul li.active').textContent;
            currentField.blur();
            ctx.classList.remove('active');
            ctx.removeChild(currentList);
        }

        function startMoveItem(pos) {
            currentListItems[pos].classList.add('active');
            currentField.value = currentListItems[pos].textContent;
        }

        /**
         * Действия при определении перемещения активного элемента списка
         * @param direction {Boolean} - Флаг, определяющий направление перемещения активного элемента списка
         *      true - вниз (по умолчанию)
         *      false - вверх
         * ВНУТРЕННИЕ ПЕРЕМЕННЫЕ
         * var currentItem {Element} - Текущий активный элемент
         */
        function moveItem(direction) {
            var currentItem = ctx.querySelector('.active');
            direction = (direction === undefined) ? true : false;

            if (direction && currentItem.nextElementSibling) {
                currentItem.removeAttribute('class');
                currentItem.nextElementSibling.classList.add('active');
                currentField.value = currentItem.nextElementSibling.textContent;
            } else if (!direction && currentItem.previousElementSibling) {
                currentItem.removeAttribute('class');
                currentItem.previousElementSibling.classList.add('active');
                currentField.value = currentItem.previousElementSibling.textContent;
            }
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
        var container = document.createElement('div');
        container.classList.add(containerClass);
        el.parentNode.replaceChild(container, el);

        return container;
    }

    /**
     * Создание блока с полем ввода
     * @param block {Element} - Контейнер приложения
     * @param fieldName {String} - значение атрибута 'name' для поля ввода
     * @param fieldId {String} - значение атрибута 'id' для поля ввода
     * @returns {Element}
     */
    function createField(block, fieldName, fieldId) {
        var blockField = document.createElement('div');
        var field = document.createElement('input');
        field.setAttribute('type', 'text');
        field.setAttribute('name', fieldName);
        field.setAttribute('id', fieldId);
        blockField.appendChild(field);
        block.appendChild(blockField);

        return field;
    }

    /**
     * Создание структуры списка данных
     * @param arrData {Array} - Массив данных
     * @param insertPlace {Element} - Место для вставки списка данных
     * @param field {Element} - Поле ввода
     * @returns {Element}
     *
     * ВНУТРЕННИЕ ПЕРЕМЕННЫЕ
     * var dataList {Element} - Список <UL>
     * var hasActive {Boolean} - Флаг, указывающий на наличие активного элемента
     */
    function createDataList(arrData, insertPlace, field) {
        var dataList = document.createElement('ul');
        var hasActive = false;

        /**
         * var listItem {Element} - Элемент списка
         */
        arrData.forEach(function(item) {
            var listItem = document.createElement('li');
            hasActive || listItem.classList.add('active');
            listItem.innerHTML = item;
            dataList.appendChild(listItem);
            hasActive = true;
        });
        dataList.setAttribute('data-first-value', arrData[0]);
        insertPlace.appendChild(dataList);
    }

    /**
     * Уборка открытых списков
     * @param listContainers {List} - Список контейнеров
     *
     * *** ВНУТРЕННИЕ ПЕРЕМЕННЫЕ ***
     * activeList {Element} - Список текущего элемента
     * activeField {Element} - Поле ввода текущего элемента
     */
    function destroyDataList(listContainers, focusField) {
        for (var i = 0, len = listContainers.length; i < len; i++) {

            // Неактивные контейнера пропускаем
            if (!listContainers[i].classList.contains('active')) continue;
            // Активные контейнера с полем ввода в фокусе пропускаем
            if (focusField === listContainers[i].querySelector('input[type=text]')) continue;

            var activeList = listContainers[i].querySelector('ul');
            var activeField = listContainers[i].querySelector('input[type=text]');
            activeField.value = (activeField.value == '') ? activeList.getAttribute('data-first-value') : activeField.value;
            listContainers[i].classList.remove('active');
            if (activeList) {
                listContainers[i].removeChild(activeList);
            }
        }
    }

    /**
     * Автоподбор списка элементов
     * @param ctx {Element} - Текущее поле ввода
     *
     * *** ВНУТРЕННИЕ ПЕРЕМЕННЫЕ ***
     * idx {Number} - Индекс активного контейнера
     * currentField {Object} - Набор полей ввода с подходящим активным индексом
     * currentContainer {Object} - Текущий активный контейнер
     * currentData {Array} - Текущие данные для активного контейнера
     * currentValue {String} - Текущее значение поля ввода
     * currentDataList {Element} - Полученный сгенерированный список данных <UL>
     * reg {RegExp} - Регулярное выражение для проверки ввденных данных
     * afterData {Array} - Новые данные для генерации списка
     */
    function completeField(ctx, self) {
        // debugger;
        var idx = ctx.closest('[data-idx]').getAttribute('data-idx');
        var currentField = self['field-' + idx];

        // Отсекаем лишние контейнера
        if (currentField !== ctx) return;

        var currentContainer = self['container-' + idx];
        var currentData = self['data-' + idx];
        var currentValue = ctx.value;
        var currentDataList = currentContainer.querySelector('ul');
        var reg = new RegExp(currentValue, 'i');
        var afterData = currentData.filter(function(item) {
            return reg.test(item);
        });

        if (afterData.length === 0) {
            ctx.value = ctx.value.slice(0, -1);
            return;
        }

        currentContainer.removeChild(currentDataList);

        createDataList(afterData, currentContainer, ctx);
    }

    return o;
}

var list1 = FunnyFieldSelect('.test-list', {
    fieldName: 'testFieldName',
    fieldId: 'testFieldId'
});
list1.init();

var list2 = FunnyFieldSelect('.test-list-1', {
    fieldName: 'test2FieldName',
    fieldId: 'test2FieldId'
});
list2.init();

var sel = FunnyFieldSelect('.test-select', {
    fieldName: 'test3FieldName',
    fieldId: 'test3FieldId'
});
sel.init();

var sel2 = FunnyFieldSelect('.test-select-2', {
    fieldName: 'test4FieldName',
    fieldId: 'test4FieldId'
});
sel2.init();