(function(){

    if(!Backbone){
        throw 'Please include Backbone.js before Backbone.ModelBinder.js';
    }

    if(!Backbone.ModelBinder){
        throw 'Please include Backbone.ModelBinder.js before Backbone.CollectionViewBinder.js';
    }

    Backbone.CollectionViewBinder = function(){
        _.bindAll(this);
    };

    _.extend(Backbone.CollectionViewBinder.prototype, {

        createBoundEls: function(collection, elCreator){
            this.unbind();

            this.elBindings = {};
            this._collection = collection;
            this._elCreator = elCreator;

            this._collection.each(function(model){
                this.elBindings[model.cid] = this._elCreator(model);
            }, this);

            this._collection.on('add', this._onCollectionAdd, this);
            this._collection.on('remove', this._onCollectionRemove, this);
            this._collection.on('reset', this._onCollectionReset, this);

        },

        unbind: function(){
            if(this._collection !== undefined){
                this._collection.off('add', this._onCollectionAdd);
                this._collection.off('remove', this._onCollectionRemove);
                this._collection.off('reset', this._onCollectionReset);
            }

            this._removeAllElBindings();
        },

        _onCollectionAdd: function(model){
            this.elBindings[model.cid] = this._elCreator(model);
        },

        _onCollectionRemove: function(model){
            this._removeBinding(model);
        },

        _onCollectionReset: function(){
            this._removeAllElBindings();

            this._collection.each(function(model){
                this._onCollectionAdd(model);
            }, this);
        },

        _removeAllElBindings: function(){
            _.each(this.elBindings, function(elBinding){
                this._removeBinding(elBinding.model);
            }, this);

            this.elBindings = {};
        },

        _removeBinding: function(model){
            if(this.elBindings[model.cid] !== undefined){

                if(this.elBindings[model.cid].binder !== undefined){
                    this.elBindings[model.cid].binder.unbind();
                }

                this.elBindings[model.cid].el.remove();
                delete this.elBindings[model.cid];
            }
        },

        // You can create your own creator functions, but the default below probably should be sufficient
        // A creator function takes a model and returns an elBinding that has the following fields:
        //      el: the root el that is created
        //      model: the model that you created the rootEl for
        //      binder (optional): the Backbone.ModelBinder used to bind the el's elements to the model
        makeElCreator: function(rootEl, html, bindings){
            return function(model){

                var newEl =  $(html);
                $(rootEl).append(newEl);

                var elBinding = {el: newEl, model: model};

                if(bindings){
                    if(_.isBoolean(bindings)){
                        elBinding['binder'] = new Backbone.ModelBinder();
                        elBinding['binder'].bind(model, newEl, Backbone.ModelBinder.createDefaultBindings(newEl, 'data-name'));
                    }
                    else if(_.isObject(bindings)){
                        elBinding['binder'] = new Backbone.ModelBinder();
                        elBinding['binder'].bind(model, newEl, bindings);
                    }
                    else {
                        throw 'Unsupported bindings type, please use a boolean or a bindings hash';
                    }
                }

                return elBinding;
            };
        }
    });

}).call(this);
