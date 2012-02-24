// Backbone.ModelBinder v0.1.0

Backbone.ModelBinder = Backbone.Model.extend({

    model:undefined,
    rootEl:undefined,
    attributeBindings:undefined,

    bind:function (model, rootEl, attributeBindings) {
        this.unbind();

        this.model = model;
        this.rootEl = rootEl;
        this.attributeBindings = attributeBindings;

        if (!this.model) throw 'model must be specified';
        if (!this.rootEl) throw 'rootEl must be specified';

        this._initializeAttributeBindings();

        this._bindModelToView();
        this._bindViewToModel();
    },

    unbind:function () {
        this._unbindModelToView();
        this._unbindViewToModel();

        if(this.attributeBindings){
            delete this.attributeBindings;
            this.attributeBindings = undefined;
        }
    },

    // Converts the input bindings, which might just be empty or strings, to binding objects
    _initializeAttributeBindings:function () {
        var attributeBindingKey, inputBinding, attributeBinding, elementBindingCount, elementBinding;

        if(!this.attributeBindings){
            this._initializeDefaultAttributeBindings();
        }
        else {
            for (attributeBindingKey in this.attributeBindings) {
                inputBinding = this.attributeBindings[attributeBindingKey];

                if (_.isString(inputBinding)) {
                    attributeBinding = {elementBindings: [{selector: inputBinding}]};
                }
                else if (_.isArray(inputBinding)) {
                    attributeBinding = {elementBindings: inputBinding};
                }
                else if(_.isObject(inputBinding)){
                    attributeBinding = {elementBindings: [inputBinding]};
                }
                else {
                    throw 'Unsupported type passed to Model Binder ' + attributeBinding;
                }

                // Add a linkage from the element binding back to the attribute binding
                for(elementBindingCount = 0; elementBindingCount < attributeBinding.elementBindings.length; elementBindingCount++){
                    elementBinding = attributeBinding.elementBindings[elementBindingCount];
                    elementBinding.attributeBinding = attributeBinding;
                }

                attributeBinding.attributeName = attributeBindingKey;
                this.attributeBindings[attributeBindingKey] = attributeBinding;
            }

            this._linkBoundEls();
        }
    },

    _initializeDefaultAttributeBindings: function(){
        var elCount, namedEls, namedEl, name;
        this.attributeBindings = {};
        namedEls = $('[name]', this.rootEl);

        for(elCount = 0; elCount < namedEls.length; elCount++){
            namedEl = namedEls[elCount];
            name = $(namedEl).attr('name');
            var attributeBinding =  {attributeName: name};
            attributeBinding.elementBindings = [{attributeBinding: attributeBinding, boundEls: [namedEl]}];
            this.attributeBindings[name] = attributeBinding;
        }
    },

    _linkBoundEls:function () {
        var bindingKey, attributeBinding, bindingCount, elementBinding, foundEls, elCount, el;
        for (bindingKey in this.attributeBindings) {
            attributeBinding = this.attributeBindings[bindingKey];

            for (bindingCount = 0; bindingCount < attributeBinding.elementBindings.length; bindingCount++) {
                elementBinding = attributeBinding.elementBindings[bindingCount];
                foundEls = $(elementBinding.selector, this.rootEl);

                if (foundEls.length === 0) {
                    throw 'Bad binding found. No elements returned for binding selector ' + elementBinding.selector;
                }
                else {
                    elementBinding.boundEls = [];
                    for (elCount = 0; elCount < foundEls.length; elCount++) {
                        el = foundEls[elCount];
                        elementBinding.boundEls.push(el);
                    }
                }
            }
        }
    },

    _bindModelToView: function () {
        this.model.on('change', this._onModelChange, this);

        this._copyModelAttributesToView();
    },

    // should only be called when initially binding the model to the view
    _copyModelAttributesToView: function(){
        var attributes = _.keys(this.model.attributes);
        var attributeCount, attribute, attributeBinding;

        for(attributeCount = 0; attributeCount < attributes.length; attributeCount++){
            attribute = attributes[attributeCount];

            attributeBinding = this.attributeBindings[attribute];

            if (attributeBinding) {
                this._copyModelToView(attributeBinding);
            }
        }
    },

    _unbindModelToView: function(){
        if(this.model){
            this.model.off('change', this._onModelChange);
            this.model = undefined;
        }
    },

    _bindViewToModel:function () {
        var that = this;

        $(this.rootEl).delegate('*', 'change', function (event) {
            that._onElChanged(event);
        });
    },

    _unbindViewToModel: function(){
        if(this.rootEl){
            $(this.rootEl).undelegate('', 'change');
        }
    },

    _onElChanged:function (event) {
        var el = $(event.target)[0];
        var elementBinding = this._getElBinding(el);
        if (elementBinding) {
            this._copyViewToModel(elementBinding, el);
        }
    },

    _getElBinding:function (findEl) {
        var attributeName, attributeBinding, elementBindingCount, elementBinding, boundElCount, boundEl;

        for (attributeName in this.attributeBindings) {
            attributeBinding = this.attributeBindings[attributeName];

            for (elementBindingCount = 0; elementBindingCount < attributeBinding.elementBindings.length; elementBindingCount++) {
                elementBinding = attributeBinding.elementBindings[elementBindingCount];

                for (boundElCount = 0; boundElCount < elementBinding.boundEls.length; boundElCount++) {
                    boundEl = elementBinding.boundEls[boundElCount];

                    if (boundEl === findEl) {
                        return elementBinding;
                    }
                }
            }
        }

        return undefined;
    },

    _onModelChange:function () {
        var changedAttribute, attributeBinding;

        for (changedAttribute in this.model.changedAttributes()) {
            attributeBinding = this.attributeBindings[changedAttribute];
            if (attributeBinding) {
                this._copyModelToView(attributeBinding);
            }
        }
    },

    _copyModelToView:function (attributeBinding) {
        var elementBindingCount, elementBinding, boundElCount, boundEl;
        var value = this.model.get(attributeBinding.attributeName);

        for (elementBindingCount = 0; elementBindingCount < attributeBinding.elementBindings.length; elementBindingCount++) {
            elementBinding = attributeBinding.elementBindings[elementBindingCount];

            if (!elementBinding.isSetting) {
                elementBinding.isSetting = true;

                var convertedValue = this._getConvertedValue(Backbone.ModelBinder.Constants.ModelToView, elementBinding, value);

                for (boundElCount = 0; boundElCount < elementBinding.boundEls.length; boundElCount++) {
                    boundEl = elementBinding.boundEls[boundElCount];
                    this._setEl($(boundEl), elementBinding, convertedValue);
                }

                elementBinding.isSetting = false;
            }
        }
    },

    _setEl: function (el, elementBinding, convertedValue) {
        if (elementBinding.elAttribute) {
            this._setElAttribute(el, elementBinding, convertedValue);
        }
        else {
            this._setElValue(el, convertedValue);
        }
    },

    _setElAttribute:function (el, elementBinding, convertedValue) {
        switch (elementBinding.elAttribute) {
            case 'html':
                el.html(convertedValue);
                break;
            case 'text':
                el.text(convertedValue);
                break;
            case 'enabled':
                el.attr('disabled', !convertedValue);
                break;
            case 'displayed':
                el[convertedValue ? 'show' : 'hide']();
                break;
            case 'hidden':
                el[convertedValue ? 'hide' : 'show']();
                break;
            case 'class':
                if(!convertedValue){
                    var previousValue = this.model.previous(elementBinding.attributeBinding.attributeName);
                    if(previousValue){
                        el.removeClass(previousValue);
                    }
                }
                else{
                    el.addClass(convertedValue);
                }
                break;
            default:
                el.attr(elAttribute, convertedValue);
        }
    },

    _setElValue:function (el, convertedValue) {
        if(el.attr('type')){
            switch (el.attr('type')) {
                case 'radio':
                    if (el.attr('value') === convertedValue) {
                        el.attr('checked', 'checked');
                    }
                    break;
                case 'checkbox':
                    if (convertedValue) {
                        el.attr('checked', 'checked');
                    }
                    else {
                        el.removeAttr('checked');
                    }
                    break;
                default:
                    $(el).val(convertedValue);
            }
        }
        else if(el.is('input') || el.is('select') || el.is('textarea')){
            el.val(convertedValue);
        }
        else {
            el.html(convertedValue);
        }
    },

    _copyViewToModel: function (elementBinding, el) {
        if (!elementBinding.isSetting) {
            elementBinding.isSetting = true;
            this._setModel(elementBinding, $(el));
            elementBinding.isSetting = false;

            // If there is a converter, copy the newly set model value back into the view to have the conversion applied
            if (elementBinding.converter) {
                this._copyModelToView(elementBinding.attributeBinding);
            }
        }
    },

    _setModel: function (elementBinding, el) {
        var data = {};
        var elVal;

        switch (el.attr('type')) {
            case 'checkbox':
                elVal = el.attr('checked') ? true : false;
                break;
            default:
                elVal = el.val();
        }

        data[elementBinding.attributeBinding.attributeName] = this._getConvertedValue(Backbone.ModelBinder.Constants.ViewToModel, elementBinding, elVal);
        this.model.set(data);
    },

    _getConvertedValue: function (direction, elementBinding, value) {
        if (elementBinding.converter) {
            value = elementBinding.converter(direction, value);
        }

        return value;
    }
});

Backbone.ModelBinder.Constants = {};
Backbone.ModelBinder.Constants.ModelToView = 'ModelToView';
Backbone.ModelBinder.Constants.ViewToModel = 'ViewToModel';

Backbone.ModelBinder.CollectionConverter = Backbone.Model.extend({
    collection: undefined,

    constructor: function(collection, formatter){
        this.collection = collection;

        if(!this.collection){
            throw 'Collection must be defined';
        }
        _.bindAll(this, 'convert');
    },

    convert: function(direction, value){
        if (direction === Backbone.ModelBinder.Constants.ModelToView) {
            return value ? value.id : undefined;
        }
        else {
            return this.collection.get(value);
        }
    }
});