// Паттерн Фабрика
/*
function createPerson(name, age, job) {
    var o = new Object();
    o.name = name;
    o.age = age;
    o.job = job;
    o.sayName = function() {
        console.log(this.name);
    };
    return o;
}

var person1 = createPerson('Nicholas', 29, 'Software Engineer');
var person2 = createPerson('Greg', 27, 'Doctor');

console.log(person1);
console.log(person2);
*/



// Паттерн Конструктор
/*
function Person(name, age, job) {
    this.name = name;
    this.age = age;
    this.job = job;
    this.sayName = function() {
        console.log(this.name);
    }
}

var person1 = new Person('Nicholas', 29, 'Software Engineer');
var person2 = new Person('Greg', 27, 'Doctor');

console.log(person1);
console.log(person2);

console.log(person1.constructor == Person); // true
console.log(person2.constructor == Person); // true*/


/**
 * Создание поля с автозаполнением
 * @param elClass {String} - Селектор списка, с которым работаем
 * @param obj {Object} - Принимаемые параметры. Со свойствами:
 * classWrapper {String} - Класс обертки
 * inputName {String} - Атрибут 'name' поля ввода
 * defVal {String} - Значение поля ввода по умолчанию
 * @returns {Object}
 */
function createFieldAutocomplete(elClass, obj) {
    var o = new Object();
    o.elClass = elClass;
    o.el = document.querySelector(elClass);
    o.classWrapper = obj.classWrapper || '';
    o.inputName = obj.inputName || '';
    o.defVal = obj.defVal || '';

    /**
     * Метод инициализации объекта
     */
    o.init = function() {
        createWrap(this.el, this.classWrapper, this.inputName, this.defVal);
        var inputField = document.querySelector('.' + this.classWrapper).querySelector('input[type=text]');
        var defVal = this.defVal;
        var self = this;
        inputField.value = defVal;

        inputField.addEventListener('focus', function() {
            var thisField = this;
            this.value = '';

            if (this.value.length === 0) {
                showAllItems(self.elClass);
            } else {
                completeField(inputField, self.el, self.elClass);
            }

            document.querySelector(self.elClass).classList.add('showed');

            document.addEventListener('keydown', function(e) {
                var event = e || event;
                if (event.keyCode === 27) {
                    if (thisField.value !== '') {
                        thisField.value = '';
                        showAllItems(self.elClass);
                    }
                }
            });
        });

        inputField.addEventListener('blur', function() {
            document.querySelector(self.elClass).classList.remove('showed');
        });

        document.addEventListener('click', function(e) {
            if (e.target.closest('.' + self.classWrapper + ' li')) {
                inputField.value = e.target.textContent;
                hideAllItems(self.elClass);
            } else if (!e.target.closest('.' + self.classWrapper)) {
                var isCorrect = [].slice.apply(document.querySelectorAll(self.elClass + ' li.visible')).some(function(item) {
                    return inputField.value == item.textContent;
                });
                if ((!isCorrect || inputField.value === '') && self.el.classList.contains('showed')) {
                    inputField.value = defVal;
                }
                hideAllItems(self.elClass);
            }
        });
        inputField.addEventListener('input', function() {
            completeField(inputField, self.el, self.elClass);
        });
        document.addEventListener('keydown', function(e) {
            var event = e || event;
            moveActiveItem(event, self.elClass, inputField);
        });
    };

    /**
     * Функция для перемещения по списку при помощи стрелок
     * @param event {Object} - Объект события
     * @param elClass {String} - Селектор списка
     * @param inputField {Element} - Поле ввода
     */
    function moveActiveItem(event, elClass, inputField) {
        var list = document.querySelectorAll(elClass + ' .visible');
        if (event.keyCode === 40) {
            if ([].slice.apply(list).some(function(item) {return item.classList.contains('active')})) {
                moveItem(true);
            } else {
                startMoveItem(true);
            }
        } else if (event.keyCode === 38) {
            if ([].slice.apply(list).some(function(item) {return item.classList.contains('active')})) {
                moveItem(false);
            } else {
                startMoveItem(false);
            }
        } else if (event.keyCode === 13) {
            var hasActive = (document.querySelectorAll(elClass + ' .active').length > 0) ? true : false;
            if (hasActive) {
                inputField.value = document.querySelector(elClass + ' .active').textContent;
                inputField.blur();
            }
            hideAllItems(elClass);
        }

        /**
         * Перемещение при помощи стрелок, если активный пункт уже есть
         * @param flag {Boolean} - Флаг, указывающий направление смещения выделенного элемента списка:
         *      true - вниз
         *      false - вверх
         */
        function moveItem(flag) {
            for (var i = (flag) ? 0 : list.length-1; (flag) ? i < list.length-1 : i > 0; (flag) ? i++ : i--) {
                if (list[i].classList.contains('active')) {
                    list[i].classList.remove('active');
                    var nextActive = (flag) ? list[i+1] : list[i-1];
                    nextActive.classList.add('active');
                    inputField.value = nextActive.textContent;
                    break;
                }
            }
        }

        /**
         * Старт перемещения при помощи стрелок, если активного пункта еще нет
         * @param flag {Boolean} - Флаг, укзазывающий, с какого конца списка начнется смещение выделенного элемента,
         * если выделенного элемента еще нет:
         *      true - Движение начинается низ с первого элемента
         *      false - Движение начинается вверх с последнего елемента
         */
        function startMoveItem(flag) {
            var itemStart = (flag) ? list[0] : list[list.length - 1];
            itemStart.classList.add('active');
            inputField.value = list[0].textContent;
        }
    }

    /**
     * Функция для создания блока-обертки
     * @param el {Element} - Список (напр. <ul>)
     * @param classWrapper {String} - Класс обертки списка <ul>
     * @param inputName {String} - Атрибут 'name' поля ввода
     * @returns {boolean}
     */
    function createWrap(el, classWrapper, inputName) {
        var wrap = document.createElement('div');
        wrap.classList.add(classWrapper);
        wrap.appendChild(createField(inputName));
        wrap.innerHTML = wrap.innerHTML + el.outerHTML;
        el.parentNode.replaceChild(wrap, el);

        return true;
    }

    /**
     * Функция для создания поля ввода
     * @param name {String} - Атрибут 'name' поля ввода
     * @returns {Element}
     */
    function createField(name) {
        var wrap = document.createElement('div');
        wrap.classList.add('fieldAutocomplete__field');
        var field = document.createElement('input');
        field.setAttribute('type', 'text');
        field.setAttribute('name', name);
        wrap.appendChild(field);
        return wrap;
    }

    /**
     * Функция для реализации автозаполнения
     * @param field {Element} - Поле ввода
     * @param el {Element} - Список
     * @param elClass {String} - Класс списка
     */
    function completeField(field, el, elClass) {
        var list = el.querySelectorAll('li');
        var arrList = [].slice.apply(list);
        var reg = new RegExp(field.value, 'i');

        var count = arrList.filter(function(item) {
            return reg.test(item.innerHTML);
        });

        if (count.length == 0) {
            field.value = field.value.slice(0, -1);
            return;
        }

        arrList.forEach(function(item, idx) {
            if (reg.test(item.innerHTML)) {
                document.querySelectorAll(elClass + ' li')[idx].classList.add('visible');
            } else {
                document.querySelectorAll(elClass + ' li')[idx].classList.remove('visible');
            }
        });
    }

    /**
     * Показ всех элементов списка
     * @param classList {String} - Селектор элемента списка
     */
    function showAllItems(classList) {
        for (var i = 0; i < document.querySelectorAll(classList + ' li').length; i++) {
            if (document.querySelectorAll(classList + ' li')[i].classList.contains('.visible')) continue;
            document.querySelectorAll(classList + ' li')[i].classList.add('visible');
        }
    }

    /**
     * Скрытие всех элементов списка
     * @param classList {String} - Класс списка
     */
    function hideAllItems(classList) {
        while (document.querySelectorAll(classList + ' li.visible').length > 0) {
            document.querySelectorAll(classList + ' li.visible')[0].classList.remove('visible');
        }
    }

    return o;
}

var listAutocomplete = createFieldAutocomplete('.autocomplete', {
    classWrapper: 'fieldAutocomplete',
    inputName: 'testName',
    defVal: 'No country'
});
listAutocomplete.init();
