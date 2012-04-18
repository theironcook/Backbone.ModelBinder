describe("global configure all binding attributes", function(){
  beforeEach(function(){

    this.model = new AModel({
      type: "movie",
      comment: "some comment"
    });

    this.view = new SelectorBindingView({model: this.model});
    this.view.render();
  });

  describe("Root element binding", function(){
    it("bind model field change to the data-type attribute, by convention of root element", function(){
      this.model.set('type', 'tv show');
	  
      expect(this.view.$el.attr('data-type')).toEqual('tv show');
    });
  });
  
});
