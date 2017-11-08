function ListAutocomplete(selector, nameInput, classWrap) {
    this.selector = document.querySelector(selector) || null;
    this.nameInput = nameInput || '';
    this.classWrap = classWrap || '';

    // function createField() {
    //     var wrap = document.createElement('div');
    //     var field = document.createElement('input');
    //     wrap.classList.add(this.classWrap);
    //     field.setAttribute('type', 'text');
    //     field.setAttribute('name', this.nameInput);
    //     wrap.appendChild(field);
    //     document.insertBefore(wrap, this.selector);
    // }
}
ListAutocomplete.prototype._createField = function() {
    debugger;
    var wrap = document.createElement('div');
    var field = document.createElement('input');
    field.setAttribute('type', 'text');
    field.setAttribute('name', this.nameInput);
    wrap.appendChild(field);
    document.insertBefore(wrap, this.selector);
}.bind(this);

ListAutocomplete.prototype.init = function() {
    this._createField();
}

var listAutocomplete = new ListAutocomplete('.autocomplete2');

listAutocomplete.init();