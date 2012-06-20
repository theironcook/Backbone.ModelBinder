describe("core binder", function(){
    beforeEach(function(){

        this.model = new AModel();
        this.view = new SimpleView({model: this.model});
        this.view.render();
        this.modelBinder = new Backbone.ModelBinder();
    });

    describe("View events", function(){
        it("correct number fired", function(){
            this.modelBinder.bind(this.model, this.view.el);
            var changeEventCount = 0;
            this.model.on('change', function(){changeEventCount++;});

            this.view.$("[name=firstName]").val("Kijana");
            this.view.$("[name=firstName]").trigger("change");
            expect(changeEventCount).toBe(1);
        });
    });

    describe("copyModelAttributesToView", function(){
        it("copyModelAttributesToView functionality", function(){
            this.model.set({firstName: 'Kijana'});
            this.modelBinder.bind(this.model, this.view.el);

            this.model.set({firstName: 'Kerry'}, {silent: true});

            expect(this.view.$("[name=firstName]").val()).toBe('Kijana');

            this.modelBinder.copyModelAttributesToView([]);
            expect(this.view.$("[name=firstName]").val()).toBe('Kijana');

            this.modelBinder.copyModelAttributesToView(['firstName']);
            expect(this.view.$("[name=firstName]").val()).toBe('Kerry');
        });
    });

});