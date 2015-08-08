describe("converter", function(){
    beforeEach(function(){
        this.model = new AModel();
        this.view = new SimpleView({model: this.model});
        this.view.render();
        this.modelBinder = new Backbone.ModelBinder();
    });

    // TODO: add test cases for base functionality:
    // TODO: e.g. check parameters passed to the converter function for the both possible directions


    describe("`context` option", function(){
        it("should pass specified `context` to converter function ", function(){
            var context = {}; // context can be an arbitrary object
            var spy;

            var bindings = {
                firstName: {
                    selector: '[name=firstName]',
                    converter: function (dir, value) {
                        spy && spy(this);
                        return value;
                    }
                }
            };

            var options = {
                context: context
            };

            this.modelBinder.bind(this.model, this.view.el, bindings, options);

            spy = jasmine.createSpy('Converter');
            this.model.set('firstName', 'newValue');
            expect(spy).toHaveBeenCalledWith(context);
        });

    });

});