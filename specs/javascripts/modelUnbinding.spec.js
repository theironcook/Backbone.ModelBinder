describe("model unbinding", function(){
  beforeEach(function(){
    this.model = new AModel({ 
      name: "a name",
      bio: "a bio",
      password: "it's a secret",
      education: "college",
      graduated: "no",
      drivers_license: true,
      isValid: true
    });
    this.view = new AView({model: this.model});
    this.view.render();
  });

  describe("when unbinding a view should", function(){
    beforeEach(function(){
      this.view.binder.unbind();
    });

    it("should unbind the text box", function(){
      this.model.set({name: "some name change"});
      var el = this.view.$("#name");
      expect(el.val()).toEqual("a name");
    });

    it("should unbind the textarea", function(){
      this.model.set({bio: "some change to my bio"});
      var el = this.view.$("#bio");
      expect(el.val()).toEqual("a bio");
    });

    it("should unbind the password", function(){
      this.model.set({password: "this isn't it"});
      var el = this.view.$("#password");
      expect(el.val()).toEqual("it's a secret");
    });

    it("should unbind the select box", function(){
      this.model.set({education: "none"});
      var el = this.view.$("#education");
      expect(el.val()).toEqual("college");
    });

    it("should unbind the radio group", function(){
      this.model.set({graduated: "yes"});

      var elYes = this.view.$("#graduated_yes");
      var selected = elYes.attr("checked");
      expect(selected).toBeFalsy();

      var elNo = this.view.$("#graduated_no");
      var selected = elNo.attr("checked");
      expect(selected).toBeTruthy();
    });

    it("should unbind the checkbox", function(){
      this.model.set({drivers_license: false});
      var el = this.view.$("#drivers_license");
      var selected = el.attr("checked");
      expect(selected).toBeTruthy();
    });

    it("should unbind the data-bind", function(){
      this.model.set({isValid: false});
      var el = this.view.$("#clicker");
      var disabled = el.attr("disabled");
      expect(disabled).toBeFalsy();
    });
  });
  
});

