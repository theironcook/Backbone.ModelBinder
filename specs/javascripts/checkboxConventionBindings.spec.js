describe("checkbox convention bindings", function(){

  describe("checkbox element binding", function(){
    beforeEach(function(){
      this.model = new AModel({
        drivers_license: true,
        motorcycle_license: false,
      });
      this.view = new AView({model: this.model});
      this.view.render();
    });

    it("bind view changes to the model's field", function(){
      var el = this.view.$("#drivers_license");
      el.removeAttr("checked");
      el.trigger('change');
      expect(this.model.get('drivers_license')).toBeFalsy();
    });

    it("bind model field changes to the form input", function(){
      var el = this.view.$("#drivers_license");

      // uncheck it
      this.model.set({drivers_license: false});
      var selected = el.attr("checked");
      expect(selected).toBeFalsy();

      // then check it
      this.model.set({drivers_license: true});
      var selected = el.attr("checked");
      expect(selected).toBeTruthy();
    });

    it("checks the box for a truthy value, on render", function(){
      var el = this.view.$("#drivers_license");
      var selected = el.attr("checked");

      expect(selected).toBeTruthy();
    });

    it("unchecks the box for a falsy value, on render", function(){
      var el = this.view.$("#motorcycle_license");
      var selected = el.attr("checked");

      expect(selected).toBeFalsy();
    });
  });

  describe("when binding a 1 to a checkbox", function(){
    beforeEach(function(){
      this.model = new AModel({
        binary_checkbox: 1
      });
      this.view = new AView({model: this.model});
      this.view.render();
      this.el = this.view.$("#binary_checkbox");
    });

    it("checks the box for a 1 (one) value, on render", function(){
      var selected = this.el.attr("checked");
      expect(selected).toBeTruthy();
    });

    it("unchecks the box when the value is changed to a 0 (zero)", function(){
      this.model.set({binary_checkbox: 0});
      var selected = this.el.attr("checked");
      expect(selected).toBeFalsy();
    });

  });

  describe("when binding a 0 to a checkbox", function(){
    beforeEach(function(){
      this.model = new AModel({
        binary_checkbox: 0
      });
      this.view = new AView({model: this.model});
      this.view.render();
      this.el = this.view.$("#binary_checkbox");
    });

    it("unchecks the box for a 0 (zero) value, on render", function(){
      var selected = this.el.attr("checked");
      expect(selected).toBeFalsy();
    });

    it("checks the box when the value is changed to a 1 (one)", function(){
      this.model.set({binary_checkbox: 1});
      var selected = this.el.attr("checked");
      expect(selected).toBeTruthy();
    });
  });

  describe("when there is no value in the model", function(){
    beforeEach(function(){
      this.model = new AModel();
      this.view = new AView({model: this.model});
      this.view.render();
    });

    it("bind an unchecked checkbox value to the model, on render", function(){
      expect(this.model.get('drivers_license')).toBeFalsy();
    });
  });

});
