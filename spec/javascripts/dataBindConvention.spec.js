describe("data-bind conventions", function(){
  beforeEach(function(){
    this.model = new AModel({
      villain: "mrMonster",
      doctor: "Seuss",
      pet: "cat",
      isValid: false
    });
    this.view = new AView({model: this.model});
  });

  describe("when data-bind is configured for an event and the event is triggered", function(){
    beforeEach(function(){
      this.view.render();
      this.el = this.view.$("#eventDiv");
      this.model.trigger("foo", "bar");
    });

    it("should update the element with the event's value", function(){
      expect(this.el.text()).toBe("bar");
    });
  });

  describe("when a data-bind is configured with no html element attribute specified", function(){
    beforeEach(function(){
      this.view.render();
      this.el = this.view.$("#doctor_no_elem");
    });

    it("should set the element's text to the model's property value immediately", function(){
      expect(this.el.text()).toBe("Seuss");
    });

    it("should set the text of the element when the model's property changes", function(){
      this.model.set({doctor: "Who"});
      expect(this.el.text()).toBe("Who");
    });
  });

  describe("when a data-bind is configured to set text", function(){
    beforeEach(function(){
      this.view.render();
      this.el = this.view.$("#doctor");
    });

    it("should set the element's text to the model's property value immediately", function(){
      expect(this.el.text()).toBe("Seuss");
    });

    it("should set the text of the element when the model's property changes", function(){
      this.model.set({doctor: "Who"});
      expect(this.el.text()).toBe("Who");
    });
  });

  describe("when a data-bind is configured to set html", function(){
    beforeEach(function(){
      this.view.render();
      this.el = this.view.$("#villain");
    });

    it("should set the element's contents to the model's property value immediately", function(){
      expect(this.el.html()).toBe("mrMonster");
    });

    it("should replace the contents of the element when the model's property changes", function(){
      this.model.set({villain: "boogerFace"});
      expect(this.el.html()).toBe("boogerFace");
    });
  });

  describe("when a data-bind is configured to set enabled", function(){
    beforeEach(function(){
      this.view.render();
      this.el = this.view.$("#clicker");
    });

    it("should set the element's disabled value to the model's value, immediately", function(){
      expect(this.el.attr("disabled")).toBeTruthy();
    });

    it("should set the element's disabled value when the model's value is changed", function(){
      this.model.set({isValid: true});
      expect(this.el.attr("disabled")).toBeFalsy();
    });
  });

  describe("when a data-bind is configured to set disabled", function(){
    beforeEach(function(){
      this.view.render();
      this.el = this.view.$("#unclicker");
    });

    it("should set the element's disabled value to the model's value, immediately", function(){
      expect(this.el.attr("disabled")).toBeFalsy();
    });

    it("should set the element's disabled value when the model's value is changed", function(){
      this.model.set({isValid: true});
      expect(this.el.attr("disabled")).toBeTruthy();
    });
  });

  describe("when a data-bind is configured to set an arbitrary attribute", function(){
    beforeEach(function(){
      this.view.render();
      this.el = this.view.$("#pet");
    });

    it("should set the element's attribute to the model's property value immediately", function(){
      expect(this.el.attr("someAttr")).toBe("cat");
    });

    it("should set the value of the attribute", function(){
      this.model.set({pet: "bunnies"});
      expect(this.el.attr("someAttr")).toBe("bunnies");
    });
  });

  describe("when a data-bind is configured to set displayed", function(){
    beforeEach(function(){
      this.view.render();
      this.el = this.view.$("#showHideThing");
    });

    it("should set the element's disabled value to the model's value, immediately", function(){
      expect(this.el.css("display")).toBe("none");
    });

    it("should set the element's disabled value when the model's value is changed", function(){
      this.model.set({isValid: true});
      expect(this.el).toBeHidden();
    });
  });
  
  describe("when a data-bind is configured to set visible", function(){
    beforeEach(function(){
      this.view.render();
      this.el = this.view.$("#showHideAnotherThing");
    });

    it("should set the element's disabled value to the model's value, immediately", function(){
      expect(this.el.css("display")).not.toBe("none");
    });

    it("should set the element's disabled value when the model's value is changed", function(){
      this.model.set({isValid: true});
      expect(this.el).toBeHidden();
    });
  });
});
