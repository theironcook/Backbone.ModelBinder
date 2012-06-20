describe("one element to multiple model attributes", function () {
    beforeEach(function () {

        this.model = new AModel({
            lastName:"Deschain",
            namesEnabled: false
        });

        this.view = new SimpleView({model:this.model});
        this.view.render();

        this.bindings = {
            namesEnabled: {selector: '[name=lastName]', elAttribute: 'enabled'},
            lastName: '[name=lastName]'
        }

        this.modelBinder = new Backbone.ModelBinder();
    });

    describe("One editable and multiple read only", function () {
        it("initial values properly set", function () {
            this.modelBinder.bind(this.model, this.view.el, this.bindings);

            expect(this.view.$('[name=lastName]').val()).toEqual('Deschain');
            expect(this.view.$('[name=lastName]').attr('disabled')).toEqual('disabled');
        });

        it("values update properly from model", function () {
            this.modelBinder.bind(this.model, this.view.el, this.bindings);
            this.model.set({namesEnabled: true, lastName: 'Hendrix'});

            expect(this.view.$('[name=lastName]').val()).toEqual('Hendrix');
            expect(this.view.$('[name=lastName]').attr('disabled')).toEqual(undefined);
        });

        it("values update properly from view", function () {
            this.modelBinder.bind(this.model, this.view.el, this.bindings);
            this.view.$('[name=lastName]').val('Page');
            this.view.$('[name=lastName]').trigger('change');

            expect(this.model.get('lastName')).toEqual('Page');
        });
    });
});
