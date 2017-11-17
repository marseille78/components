/**
 * Создание объектов Funny Select
 * @param elSelector {String} - Селектор принимаемых елементов
 * @param objData {Object} - Объект дополнительных свойств:
 *      fieldName {String} - Корень значения атрибута поля (name) для поля ввода
 *      fieldId {String} - Корень значения атрибута поля (id) для поля ввода
 *      containerClass {String} - Класс контейнера. По умолчанию (funny-select) (В случае изменения, нужно будет изменить классы в файле стилей)
 * @returns {Object}
 * @constructor
 */
function FunnySelect(elSelector, objData) {
    var elSelector = elSelector;
    var fieldName = objData.fieldName;
    var fieldId = objData.fieldId;
    var containerClass = objData.containerClass || 'funny-select';

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

                destroyDataList(listContainers, this);

                // Отсекаем посторонние поля ввода
                if (currentField !== this || currentContainer.classList.contains('active')) return;

                var currentData = self['data-' + idx];
                var selfKeydown = this;
                currentContainer.classList.add('active');

                createDataList(currentData, currentContainer, currentField, '');

                document.addEventListener('keydown', function(e) {

                    if (!selfKeydown.closest('.' + containerClass + '.active')) return;

                    var e = e || event;
                    moveActiveItem(e, selfKeydown);
                });
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

    function moveActiveItem(event, ctx) {
        console.log('sss');
        var currentList = ctx.parentNode.nextElementSibling;
        var currentContainer = currentList.parentNode;
        var currentListItems = currentList.querySelectorAll('li');
        var currentField = currentContainer.querySelector('input[type=text]');
        var resultValue = null;

        if (event.keyCode === 40) {
            // debugger;
            if (currentContainer.querySelectorAll('.active').length > 0) {
                moveItem();
            } else {
                startMoveItem(0);
            }
        } else if (event.keyCode === 38) {
            if (currentContainer.querySelectorAll('.active').length > 0) {
                moveItem();
            } else {
                startMoveItem(currentListItems.length-1);
            }
        } else if (event.keyCode === 13) {
            //
        }

        function startMoveItem(pos) {
            currentListItems[pos].classList.add('active');
            currentField.value = currentListItems[pos].textContent;
        }

        function moveItem(direction) {
            var currentItem = currentContainer.querySelector('.active');
            direction = (direction === undefined) ? true : false;

            if (direction && currentItem.nextElementSibling) {
                currentItem.removeAttribute('class');
                currentItem.nextElementSibling.classList.add('active');
                currentField.value = currentItem.nextElementSibling.textContent;
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
     * @param fieldVal {String} - Значение поля ввода
     * @returns {Element}
     */
    function createDataList(arrData, insertPlace, field, fieldVal) {
        var dataList = document.createElement('ul');
        arrData.forEach(function(item) {
            var listItem = document.createElement('li');
            listItem.innerHTML = item;
            dataList.appendChild(listItem);
        });
        field.value = fieldVal;
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
            listContainers[i].removeChild(activeList);
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

        createDataList(afterData, currentContainer, ctx, ctx.value);
    }

    return o;
}

var list1 = FunnySelect('.test-list', {
    fieldName: 'testFieldName',
    fieldId: 'testFieldId'
});
list1.init();

var list2 = FunnySelect('.test-list-1', {
    fieldName: 'test2FieldName',
    fieldId: 'test2FieldId'
});
list2.init();

var sel = FunnySelect('.test-select', {
    fieldName: 'test3FieldName',
    fieldId: 'test3FieldId'
});
sel.init();

var sel2 = FunnySelect('.test-select-2', {
    fieldName: 'test4FieldName',
    fieldId: 'test4FieldId'
});
sel2.init();