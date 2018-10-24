describe("CollectionBinder: sorting", function(){

    function createViewWithClickCallback(clickCallback) {
        var View = Backbone.View.extend({
            events: function(){
                return {
                    'click .clickable-div': this.onElementClicked,
                    'click .clickable-span': this.onElementClicked
                };
            },

            initialize: function () {
                var elManagerFactory = new Backbone.CollectionBinder.ElManagerFactory("<div class='clickable-div'><span class='clickable-span'>Hello !</span></div>");
                this.collectionBinder = new Backbone.CollectionBinder(elManagerFactory);

                this.collection = new Backbone.Collection([1,2,3]);
            },

            render: function(){
                this.collectionBinder.bind(this.collection, this.$el);
                return this;
            },

            onElementClicked: function(event) {
                var targetManager = this.collectionBinder.getManagerForEl($(event.currentTarget));
                clickCallback(targetManager);

                // Stopping propagation (in order to avoid bubbling from span to parent div)
                event.stopPropagation();
            }
        });
        return new View();
    }

    var createViewThenClickAndExpectManagerResolved = function(selectorElementToClick) {
        var resolvedManager = undefined;
        var clickCallbackCalled = false;
        var view = createViewWithClickCallback(function(manager) {
            clickCallbackCalled = true;
            resolvedManager = manager;
        });

        view.render();
        view.$(selectorElementToClick).click();

        expect(clickCallbackCalled).toBe(true);
        expect(resolvedManager).toBeTruthy();

        view.remove();
    };

    it('should resolve el manager when span inner element is clicked', function () {
        createViewThenClickAndExpectManagerResolved('span.clickable-span:eq(0)');
    });

    it('should resolve el manager when div root element is clicked', function () {
        createViewThenClickAndExpectManagerResolved('div.clickable-div:eq(0)');
    });

});
