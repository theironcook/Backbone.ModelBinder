describe("CollectionBinder: sorting", function(){

    var NestedView = Backbone.View.extend({
        className: 'nested-view',
        render: function () {
            this.$el.addClass('nested-' + this.model.id);
            return this;
        },

        close: function () {
            this.remove();
        }
    });

    var ParentView = Backbone.View.extend({
        className: 'parentView',

        collectionBinderOptions: {
            autoSort: false
        },

        initialize: function () {
            var elManagerFactory = new Backbone.CollectionBinder.ViewManagerFactory(function (model) {
                return new NestedView({
                    model: model
                });
            });

            this.collectionBinder = new Backbone.CollectionBinder(elManagerFactory, this.collectionBinderOptions);
        },

        render: function () {
            this.collectionBinder.bind(this.collection, this.$el);
            return this;
        },

        remove: function () {
            this.collectionBinder.unbind();
            Backbone.View.prototype.remove.apply(this, arguments);
        },

        getNestedElementIndex: function (id) {
            return this.$('.nested-' + id).index();
        }
    });

    var ParentViewAutoSort = ParentView.extend({
        collectionBinderOptions: {
            autoSort: true
        }
    });


    var createViewForTest = function (View, collection) {
        var view = new View ({collection: collection});
        view.render();

        this.view = view;

        return view;
    };


    beforeEach(function(){
        this.collection = new Backbone.Collection([]);
        this.collection.comparator = 'id';
        this.unorderedCollection = new Backbone.Collection([]);
    });

    afterEach(function () {
        if (this.view) this.view.remove();
    });


    // The default behavior with autoSort:false is to always append views for the newly added models to the end
    // Probably not very useful except in very simple cases
    describe('With autoSort: false', function () {
        var createView = function (collection) {
            return createViewForTest(ParentView, collection);
        };

        it('Should ignore models order on collection.add', function () {
            var view = createView(this.collection);

            var collectionBinder = view.collectionBinder;

            this.collection.add({id: 1});
            this.collection.add({id: 0});

            // models should have been re-ordered by the collection
            expect(this.collection.at(0).id).toBe(0);
            expect(this.collection.at(1).id).toBe(1);

            // the order of elements should reflect the order of .add calls, regardless on collection sort order
            expect(view.getNestedElementIndex(1)).toBe(0);
            expect(view.getNestedElementIndex(0)).toBe(1);
        });

        it('Should ignore models order on collection.set', function () {
            var view = createView(this.collection);

            var collectionBinder = view.collectionBinder;

            this.collection.set([{id: 1}, {id: 0}]);

            // models should have been re-ordered by the collection
            expect(this.collection.at(0).id).toBe(0);
            expect(this.collection.at(1).id).toBe(1);

            // the order of elements should reflect the order of .add calls, regardless on collection sort order
            expect(view.getNestedElementIndex(1)).toBe(0);
            expect(view.getNestedElementIndex(0)).toBe(1);
        });

        it('Should ignore models order on collection.add with {at: some-index}', function () {
            var view = createView(this.unorderedCollection);

            var collectionBinder = view.collectionBinder;

            this.unorderedCollection.add({id: 1});
            this.unorderedCollection.add({id: 0}, {at: 0});

            // models should have been re-ordered according to at:0 option
            expect(this.unorderedCollection.at(0).id).toBe(0);
            expect(this.unorderedCollection.at(1).id).toBe(1);

            // the order of elements should reflect the order of .add calls, regardless on the 'at' option
            expect(view.getNestedElementIndex(1)).toBe(0);
            expect(view.getNestedElementIndex(0)).toBe(1);
        });

        it('Should not rearrange elements on collection.sort()', function () {
            var view = createView(this.collection);

            var collectionBinder = view.collectionBinder;

            this.collection.reset([{id: 1}, {id: 2}]);

            expect(view.getNestedElementIndex(1)).toBe(0);
            expect(view.getNestedElementIndex(2)).toBe(1);

            this.collection.get(2).set({id: 0});
            this.collection.sort();

            // models should have been re-ordered by the collection
            expect(this.collection.at(0).id).toBe(0);
            expect(this.collection.at(1).id).toBe(1);

            // the order of elements should reflect the order of .add calls, regardless on collection sort order
            expect(view.getNestedElementIndex(1)).toBe(0);
            // use the old value of 'id' because the view doesn't automatically update on model changes
            expect(view.getNestedElementIndex(2)).toBe(1);
        });
    });



    describe('With autoSort: true', function () {
        var createView = function (collection) {
            return createViewForTest(ParentViewAutoSort, collection);
        };

        it('Should respect models order on collection.add', function () {
            var view = createView(this.collection);

            var collectionBinder = view.collectionBinder;

            this.collection.add({id: 1});
            this.collection.add({id: 0});

            // models should have been re-ordered by the collection
            expect(this.collection.at(0).id).toBe(0);
            expect(this.collection.at(1).id).toBe(1);

            // the order of elements should reflect the new order of models in the collection
            expect(view.getNestedElementIndex(0)).toBe(0);
            expect(view.getNestedElementIndex(1)).toBe(1);
        });

        it('Should respect models order on collection.set', function () {
            var view = createView(this.collection);

            var collectionBinder = view.collectionBinder;

            this.collection.set([{id: 1}, {id: 0}]);

            // models should have been re-ordered by the collection
            expect(this.collection.at(0).id).toBe(0);
            expect(this.collection.at(1).id).toBe(1);

            // the order of elements should reflect the new order of models in the collection
            expect(view.getNestedElementIndex(0)).toBe(0);
            expect(view.getNestedElementIndex(1)).toBe(1);
        });

        it('Should respect models order on collection.add with {at: some-index}', function () {
            var view = createView(this.unorderedCollection);

            var collectionBinder = view.collectionBinder;

            this.unorderedCollection.add({id: 1});
            this.unorderedCollection.add({id: 0}, {at: 0});

            // models should have been re-ordered according to at:0 option
            expect(this.unorderedCollection.at(0).id).toBe(0);
            expect(this.unorderedCollection.at(1).id).toBe(1);

            // the order of elements should reflect the new order of models in the collection
            expect(view.getNestedElementIndex(0)).toBe(0);
            expect(view.getNestedElementIndex(1)).toBe(1);
        });

        it('Should rearrange elements on collection.sort()', function () {
            var view = createView(this.collection);

            var collectionBinder = view.collectionBinder;

            this.collection.reset([{id: 1}, {id: 2}]);

            expect(view.getNestedElementIndex(1)).toBe(0);
            expect(view.getNestedElementIndex(2)).toBe(1);

            this.collection.get(2).set({id: 0});
            this.collection.sort();

            // models should have been re-ordered by the collection
            expect(this.collection.at(0).id).toBe(0);
            expect(this.collection.at(1).id).toBe(1);

            // the order of elements should reflect the new order of models in the collection
            // use the old value of 'id' because the view doesn't automatically update on model changes
            expect(view.getNestedElementIndex(2)).toBe(0);
            expect(view.getNestedElementIndex(1)).toBe(1);
        });
    });
});