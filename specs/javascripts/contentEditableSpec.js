describe("content editable spec", function(){
    beforeEach(function(){
        this.model = new AModel({
            paragraph1: "The initial paragraph value"
        });

        this.view = new AView({model: this.model});
        this.view.render();
    });

    it("initial binding sets element html", function(){
        var el = this.view.$("[name=paragraph1]");
        expect(this.model.get('paragraph1')).toEqual(el.html());
    });

    it("changing the model changes the view", function(){
        this.model.set({paragraph1: 'A new value for paragraph1'});
        var el = this.view.$("[name=paragraph1]");
        expect(this.model.get('paragraph1')).toEqual(el.html());
    });

    it("changing the view changes the model", function(){
        var el = this.view.$("[name=paragraph1]");
        el.html('Another new value for paragraph1');
        el.trigger('change');
        expect(this.model.get('paragraph1')).toEqual(el.html());
    });
});