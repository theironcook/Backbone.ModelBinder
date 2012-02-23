describe("global configure all binding attributes", function(){
  beforeEach(function(){

    this.model = new AModel({
      name: "some dude",
      education: "graduate",
      graduated: "maybe",
      drivers_license: true
    });

    this.view = new GlobalAllBindingAttributesView({model: this.model});
    this.view.render();
  });

  describe("text element binding using configurable attribute", function(){
    it("bind view changes to the model's field, by configurable convention", function(){
      var el = this.view.$("#v_name");
      el.val("that guy");
      el.trigger('change');

      expect(this.model.get('name')).toEqual("that guy");
    });

    it("bind model field changes to the form input, by convention of id", function(){
      this.model.set({name: "joe bob"});
      var el = this.view.$("#v_name");
      expect(el.val()).toEqual("joe bob");
    });

    it("binds the model's value to the form field on render", function(){
      var el = this.view.$("#v_name");
      expect(el.val()).toEqual("some dude");
    });
  });
  
  describe("radio element binding using configurable attribute", function(){
    it("bind view changes to the model's field, by configurable convention", function(){
      var el = this.view.$("#graduated_no");
      el.attr("checked", "checked");
      el.trigger('change');
      expect(this.model.get('graduated')).toEqual("no");
    });

    it("bind model field changes to the form input, by configurable convention", function(){
      this.model.set({graduated: "yes"});
      var el = this.view.$("#graduated_yes");
      var selected = el.attr("checked");

      expect(selected).toBeTruthy();
    });

    it("binds the model's value to the form field on render", function(){
      var el = this.view.$("input[type=radio][class=graduated]:checked");
      var selected = el.val();

      expect(selected).toBe("maybe");
    });
  });

  describe("select element binding using configurable attribute", function(){
    it("bind view changes to the model's field, by configurable convention", function(){
      var el = this.view.$(".education");
      el.val("college");
      el.trigger('change');

      expect(this.model.get('education')).toEqual("college");
    });

    it("bind model field changes to the form input, by configurable convention", function(){
      this.model.set({education: "high school"});
      var el = this.view.$(".education");
      expect(el.val()).toEqual("high school");
    });

    it("binds the model's value to the form field on render", function(){
      var el = this.view.$(".education");
      expect(el.val()).toEqual("graduate");
    });

    it("applies the text of the selection to the model", function(){
      var el = this.view.$(".education");
      el.val("grade_school");
      el.trigger('change');

      expect(this.model.get('education')).toEqual("grade_school");
    });
  });

  describe("checkbox element binding using configurable attribute", function(){
    it("bind view changes to the model's field", function(){
      var el = this.view.$(".drivers_license");
      el.removeAttr("checked");
      el.trigger('change');
      expect(this.model.get('drivers_license')).toBeFalsy();
    });

    it("bind model field changes to the form input", function(){
      var el = this.view.$(".drivers_license");

      // uncheck it
      this.model.set({drivers_license: false});
      var selected = el.attr("checked");
      expect(selected).toBeFalsy();

      // then check it
      this.model.set({drivers_license: true});
      var selected = el.attr("checked");
      expect(selected).toBeTruthy();
    });

    it("binds the model's value to the form field on render", function(){
      var el = this.view.$(".drivers_license");
      var selected = el.attr("checked");

      expect(selected).toBeTruthy();
    });
  });
});
