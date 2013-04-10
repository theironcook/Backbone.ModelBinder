describe("bound events", function(){
    beforeEach(function(){

        this.model = new AModel();
        this.view = new SimpleView({model: this.model});
        this.view.render();
        this.modelBinder = new Backbone.ModelBinder();
    });

    describe("viewUpdated event", function(){
        it("handle viewUpdated event functionality", function(){
            var onBind = _.bind(function(model, atts){
                this.view.$el.data('sameModel', (model === this.model)+'');
                this.view.$el.data('attribute', atts[0].attributeName);
            }, this);

            this.modelBinder.bind(this.model, this.view.el);
            this.modelBinder.on('viewUpdated', onBind);
            this.model.set({firstName: 'Kerry'});

            expect(this.view.$("[name=firstName]").val()).toBe('Kerry');
            expect(this.view.$el.data("sameModel")).toBe('true');
            expect(this.view.$el.data("attribute")).toBe('firstName');
        });
    });

});
