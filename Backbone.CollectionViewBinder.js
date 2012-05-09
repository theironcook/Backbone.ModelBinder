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

        createBoundEls: function(collection, elManagerFactory){
            this.unbind();

            this._elManagers = {};
            this._collection = collection;
            this._elManagerFactory = elManagerFactory;

            this._collection.each(function(model){
                this._onCollectionAdd(model);
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

            this._removeAllElManagers();
        },

        _onCollectionAdd: function(model){
            this._elManagers[model.cid] = this._elManagerFactory.makeElManager(model);
            this._elManagers[model.cid].createEl(model);
        },

        _onCollectionRemove: function(model){
            this._removeElManager(model);
        },

        _onCollectionReset: function(){
            this._removeAllElManagers();

            this._collection.each(function(model){
                this._onCollectionAdd(model);
            }, this);
        },

        _removeAllElManagers: function(){
            _.each(this._elManagers, function(elManager){
                elManager.removeEl();
                delete this._elManagers[elManager._model.cid];
            }, this);

            this._elManagers = {};
        },

        _removeElManager: function(model){
            if(this._elManagers[model.cid] !== undefined){
                this._elManagers[model.cid].removeEl();
                delete this._elManagers[model.cid];
            }
        }
    });

    ///////////////////////////////////////////////////////////////////////////////////////////////
    // Default El Manager Factories Below /////////////////////////////////////////////////////////

    // You can implement your own elManager factory for your own custom needs.  A elManager factory
    // needs to implement the makeElManager(model) function which returns an elManager.
    // An elManager needs to implement the functions createEl(model) and removeEl()
    // createEl(model) creates the necessary html to render the model, removeEl cleans up.
    ///////////////////////////////////////////////////////////////////////////////////////////////


    // The DefaultElManagerFactory is used for els that are just html templates
    // rootEl - where you want the created els to be appended
    // elHtml - how the model's html will be rendered.  Must have a single root element (div,span).
    // bindings (optional) - either a string which is the binding attribute (name, id, data-name) or a normal bindings hash
    Backbone.CollectionViewBinder.DefaultElManagerFactory = function(rootEl, elHtml, bindings){
        _.bindAll(this);

        this._rootEl = rootEl;
        this._elHtml = elHtml;
        this._bindings = bindings;

        if(this._rootEl === undefined) throw 'rootEl must be a valid DOM element';
        if(! _.isString(this._elHtml)) throw 'elHtml must be a valid html string';
    };

    _.extend(Backbone.CollectionViewBinder.DefaultElManagerFactory.prototype, {
        makeElManager: function(model){
            var elManager = {
                createEl: function(model){
                    this._model = model;

                    this._el =  $(this._elHtml);
                    $(this._rootEl).append(this._el);

                    if(this._bindings){
                        if(_.isString(this._bindings)){
                            this._modelBinder = new Backbone.ModelBinder();
                            this._modelBinder.bind(this._model, this._el, Backbone.ModelBinder.createDefaultBindings(this._el, this._bindings));
                        }
                        else if(_.isObject(this._bindings)){
                            this._modelBinder = new Backbone.ModelBinder();
                            this._modelBinder.bind(this._model, this._el, this._bindings);
                        }
                        else {
                            throw 'Unsupported bindings type, please use a boolean or a bindings hash';
                        }
                    }
                },

                removeEl: function(){
                    if(this._modelBinder !== undefined){
                        this._modelBinder.unbind();
                    }

                    this._el.remove();
                }
            };

            _.extend(elManager, this);
            return elManager;
        }
    });


    // The DefaultElManagerFactory is used for els that are just html templates
    // rootEl - where you want the created els to be appended
    // viewClass - how the model's html will be rendered
    // viewCollection (optional) - you probably should hold a reference to the created views to clean up on your view's close
    Backbone.CollectionViewBinder.DefaultViewManagerFactory = function(rootEl, viewClass, viewCollection){
        _.bindAll(this);

        this._rootEl = rootEl;
        this._viewClass = viewClass;
        this._viewCollection = viewCollection;

        if(! _.isElement(this._rootEl)) throw 'rootEl must be a valid DOM element';
        if(this._viewClass === undefined) throw 'viewClass must be a valid backbone view';
    };

    _.extend(Backbone.CollectionViewBinder.DefaultViewManagerFactory.prototype, {
        makeElManager: function(model){
            var elManager = {
                createEl: function(model){
                    this._model = model;
                    this._view = new this._viewClass();
                    $(this._rootEl).append(this._view.render(this._model).el);

                    if(this._viewCollection !== undefined){
                        this._viewCollection.add(this._view);
                    }
                },

                removeEl: function(){
                    if(this._view.close !== undefined){
                        this._view.close();
                    }
                    else {
                        this._view.el.remove();
                        console.log('warning, you should implement a close() function for your view, you might end up with zombies');
                    }

                    if(this._viewCollection !== undefined){
                        this._viewCollection.remove(this._view);
                    }
                }
            };

            _.extend(elManager, this);
            return elManager;
        }
    });

}).call(this);
