describe("globalConfigurableBindingAttributes", function () {
    beforeEach(function () {
        this.model = new AModel({ weakness:"liver & onions" });
        var bindings = {
            weakness:'[modelAttr=weakness]'
        };

        this.view = new AView({model:this.model, bindings: bindings});
        this.view.render();
    });

    describe("text element binding with global configuration of convention attribute", function () {
        it("bind view changes to the model's field, by configurable convention", function () {
            var el = this.view.$("#super_hero_weakness");
            el.val("spinach");
            el.trigger('change');

            expect(this.model.get('weakness')).toEqual("spinach");
        });

        it("bind model field changes to the form input, by convention of id", function () {
            this.model.set({weakness:"broccoli"});
            var el = this.view.$("#super_hero_weakness");
            expect(el.val()).toEqual("broccoli");
        });

        it("binds the model's value to the form field on render", function () {
            var el = this.view.$("#super_hero_weakness");
            expect(el.val()).toEqual("liver & onions");
        });
    });

});
