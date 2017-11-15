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
                hideDataList(containerClass, currentData);
            }
        });

        while (document.querySelectorAll(this.elSelector).length > 0) {
            currentEl[i] = document.querySelectorAll(this.elSelector)[0];
            currentData[i] = getDataCurrent(currentEl[i]);
            containerEl[i] = createContainer(currentEl[i]);
            containerEl[i].setAttribute('data-idx', i);
            var containerClass = containerEl[i].classList[0];

            field[i] = createField(containerEl[i], this.fieldName);
            dataList[i] = createDataList(currentData[i], containerEl[i]);
            setDefaultValue(field[i], currentData[i][0]);
            field[i].setAttribute('data-default-value', currentData[i][0]);

            field[i].addEventListener('focus', function(e) {
                var self = this;

                var list = this.parentNode.nextElementSibling;
                if (!self.closest('.active')) {
                    hideDataList(containerClass, currentData);
                    showDataList(self, list);
                }
                document.addEventListener('keydown', function(e) {
                    var event = e || event;
                    moveActiveItem(event, self, containerClass, currentData);
                });
            });

            field[i].addEventListener('input', function() {
                var containerList = this.parentNode.nextElementSibling;
                var idx = this.closest('.' + containerClass).getAttribute('data-idx');
                completeField(this, containerList, currentData[idx]);
            });

            i++;
        }
    };

    function moveActiveItem(event, ctx, containerClass, currentData) {
        var curList = ctx.parentNode.nextElementSibling;
        var curListItems = curList.querySelectorAll('li');
        var resultValue = null;

        if (event.keyCode === 40) {
            resultValue = moveItem(0);
            ctx.value = resultValue;
        } else if (event.keyCode === 38) {
            resultValue = moveItem(curListItems.length-1, false);
            ctx.value = resultValue;
        } else if (event.keyCode === 13) {
            event.preventDefault();
            hideDataList(containerClass, currentData);
        }

        function moveItem(startPos, direction) {
            direction = (direction === undefined) ? true : false;

            if (curList.querySelectorAll('.active').length === 0) {
                curList.querySelectorAll('li')[startPos].classList.add('active');
                resultValue = curList.querySelectorAll('li')[startPos].innerHTML;
            } else {
                var curActive = curList.querySelector('.active');
                if (direction) {
                    if (curActive.nextElementSibling) {
                        curActive.classList.remove('active');
                        curActive.nextElementSibling.classList.add('active');
                        resultValue = curActive.nextElementSibling.innerHTML;
                    } else {
                        resultValue = curActive.innerHTML;
                    }
                } else {
                    if (curActive.previousElementSibling) {
                        curActive.classList.remove('active');
                        curActive.previousElementSibling.classList.add('active');
                        resultValue = curActive.previousElementSibling.innerHTML;
                    } else {
                        resultValue = curActive.innerHTML;
                    }
                }
            }

            return resultValue;
        }
    }

    /**
     * Скрытие всех списков данных
     * @param containerClass {String} - Класс контейнера компонента
     * @param currentData {Object} - Объект массивов данных
     */
    function hideDataList(containerClass, currentData) {
        var i = 0;
        while (document.querySelectorAll('.' + containerClass + '.active').length > 0) {
            var container = document.querySelectorAll('.' + containerClass + '.active')[i];
            var field = container.querySelector('input[type=text]');
            if (container.querySelectorAll('li.active').length > 0) {
                setDefaultValue(field, container.querySelector('li.active').innerHTML);
            } else {
                setDefaultValue(field, field.getAttribute('data-default-value'));
            }
            container.classList.remove('active');
            var idx = container.getAttribute('data-idx');
            var curUL = container.querySelector('ul');
            container.removeChild(curUL);
            createDataList(currentData[idx], container);
            field.blur();
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
    function setDefaultValue(field, dataItem) {
        field.value = dataItem;
    }

    /**
     * Отображение списка данных при фокусе
     * @param field {Element} - Поле ввода на котором произошел фокус
     * @param dataList {Element} - Список данных
     */
    function showDataList(field, dataList) {
        dataList.parentNode.classList.add('active');
        field.value = '';
    }


    /**
     * Автоподбор списка элементов
     * @param field {Element} - Поле ввода
     * @param containerList {Element} - Блок списка
     * @param arrData {Array} - Массив элементов
     */
    function completeField(field, containerList, arrData) {
        var reg = new RegExp(field.value, 'i');

        var count = arrData.filter(function(item) {
            return reg.test(item);
        });
        if (count.length == 0) {
            field.value = field.value.slice(0, -1);
            return;
        }

        var newArrData = arrData.filter(function(item) {
            return reg.test(item);
        });
        containerList.innerHTML = '';

        newArrData.forEach(function(item) {
            var curLi = document.createElement('li');
            curLi.innerHTML = item;
            containerList.appendChild(curLi);
        });
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