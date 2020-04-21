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

    var ParentViewWithStaticContent = ParentViewAutoSort.extend({
        render: function () {
            this.$el.append('<div class="static-content">Some static content that precedes the collection. Can be a table header, for instance</div>');

            return ParentViewAutoSort.prototype.render.apply(this, arguments);
        },

        getStaticContentIndex: function () {
            return this.$('.static-content').index();
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


    var testSequenceSorting = function (sequence, withStaticContent) {
        var View = ParentViewAutoSort, minIndex = 0;

        if (withStaticContent) {
            View = ParentViewWithStaticContent;
            minIndex = 1;
        }

        var collection = new Backbone.Collection();

        var view = createViewForTest(View, collection);

        var data = _.map(sequence, function (d) {
            return {id: d};
        });

        collection.reset(data);

        _.each(sequence, function (id, index) {
            expect(view.getNestedElementIndex(id)).toBe(index + minIndex);
        });

        collection.comparator = 'id';
        collection.sort();

        if (withStaticContent) {
            // index of the static content should remain 0
            expect(view.getStaticContentIndex()).toBe(0);
        }

        // index of element should be index of the corresponding model in the collection plus <minIndex>
        collection.each(function (model, index) {
            expect(view.getNestedElementIndex(model.id)).toBe(index + minIndex);
        });
    };


    describe('With the sort algorithm', function () {
        var sequences = [
            [1, 2, 3, 4, 5, 6],
            [5, 4, 3, 2, 1],
            [1, 2, 4, 5, 3],
            [3, 5, 1, 8, 6]
        ];

        _.each(sequences, function (sequence, index) {
            it('Should properly sort sequence: '+ sequence, function () {
                testSequenceSorting(sequence);
            });
        });
    });


    describe('With a container having static content before collection elements', function () {
        var createView = function (collection) {
            return createViewForTest(ParentViewWithStaticContent, collection);
        };

        it('Should insert the first element after the static content on collection.add with {at: 0}', function () {
            var view = createView(this.unorderedCollection);

            this.unorderedCollection.add({id: 1});
            this.unorderedCollection.add({id: 0}, {at: 0});

            // index of element should be index of the corresponding model in the collection plus 1
            // because index=0 is the index of the static content prepended to the container
            expect(view.getNestedElementIndex(0)).toBe(0+1);
            expect(view.getNestedElementIndex(1)).toBe(1+1);
        });

        it('Should not touch the leading static content on collection.sort()', function () {
            testSequenceSorting([1,2,0,3], true);
        });

        var sequences = [
            [1, 2, 3, 4, 5, 6],
            [5, 4, 3, 2, 1],
            [1, 2, 4, 5, 3],
            [3, 5, 1, 8, 6]
        ];

        _.each(sequences, function (sequence, index) {
            it('Should properly sort sequence: '+ sequence, function () {
                testSequenceSorting(sequence);
            });
        });
    });
});