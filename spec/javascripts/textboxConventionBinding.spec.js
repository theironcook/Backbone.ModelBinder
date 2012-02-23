describe("textbox convention bindings", function(){
  beforeEach(function(){
    this.model = new AModel({
      name: "Ashelia Bailey", 
      noType: 'there is no type'
    });
    this.view = new AView({model: this.model});
  });

  describe("text element binding", function(){
    beforeEach(function(){
      this.view.render();
      this.el = this.view.$("#name");
    });

    it("bind view changes to the model's field, by convention of id", function(){
      this.el.val("Derick Bailey");
      this.el.trigger('change');

      expect(this.model.get('name')).toEqual("Derick Bailey");
    });

    it("bind model field changes to the form input, by convention of id", function(){
      this.model.set({name: "Ian Bailey"});
      expect(this.el.val()).toEqual("Ian Bailey");
    });

    it("binds the model's value to the form field on render", function(){
      expect(this.el.val()).toEqual("Ashelia Bailey");
    });
  });

  describe("when the form field has a value but the model does not", function(){
    beforeEach(function(){
      this.view.render();
      var el = this.view.$("#prefilled_name");
    });
  });

  describe("input with no type specified, binding", function(){
    beforeEach(function(){
      this.view.render();
      this.el = this.view.$("#noType");
    });

    it("bind view changes to the model's field, by convention of id", function(){
      this.el.val("something changed");
      this.el.trigger('change');

      expect(this.model.get('noType')).toEqual("something changed");
    });

    it("bind model field changes to the form input, by convention of id", function(){
      this.model.set({noType: "Ian Bailey"});
      expect(this.el.val()).toEqual("Ian Bailey");
    });

    it("binds the model's value to the form field on render", function(){
      expect(this.el.val()).toEqual("there is no type");
    });
  });
});
