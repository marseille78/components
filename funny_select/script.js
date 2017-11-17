/**
 * Создание объектов Funny Field Select
 * @param elSelector {String} - Селектор принимаемых елементов
 * @param objData {Object} - Объект дополнительных свойств:
 *      fieldName {String} - Корень значения атрибута поля (name) для поля ввода
 *      fieldId {String} - Корень значения атрибута поля (id) для поля ввода
 *      containerClass {String} - Класс контейнера. По умолчанию (funny-field-select) (В случае изменения, нужно будет изменить классы в файле стилей)
 * @returns {Object}
 * @constructor
 */
function FunnySelect(elSelector, objData) {
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
            this['container-' + i].appendChild(createDataList(this['data-' + i]));

            this['field-' + i].addEventListener('focus', handlerFocus, false);
        }
    };

    document.addEventListener('click', handlerClickDocument, false);

    function handlerClickDocument(e) {
        var container = e.target.closest('.' + containerClass + '.active');

        if (container) {
            console.log(e.target);
        }
    }

    /**
     * Обработчик события 'FOCUS'
     */
    function handlerFocus() {
        this.value = '';
        var currentContainer = this.closest('.' + containerClass);
        currentContainer.classList.add('active');
    }

    /**
     * Создание структуры списков
     * @param data {Array} - Данные для текущего контейнера
     * @returns {Element} - Список данных <UL>
     */
    function createDataList(data) {
        var ul = document.createElement('ul');
        data.forEach(function(item) {
            var li = document.createElement('li');
            li.innerHTML = item;
            ul.appendChild(li);
        });
        return ul;
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