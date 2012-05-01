describe("css bindings", function(){
    beforeEach(function(){

        this.model = new AModel({
            number: 45,
            color: "white",
        });

        this.view = new CssBindingView({model: this.model});
        this.view.render();
    });

    describe("Width bound", function(){
        it("binds width of element to number", function(){
            expect(this.view.$el.css('width')).toEqual('45px');
            this.model.set('number', 100);
            expect(this.view.$el.css('width')).toEqual('100px');
        });
    });


});