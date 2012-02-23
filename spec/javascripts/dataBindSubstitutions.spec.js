describe("default data-bind substitutions", function(){
  beforeEach(function(){
    this.model = new AModel({
      doctor: "Seuss",
      name: "foo"
    });
    this.view = new AView({model: this.model});
    this.view.render();
  });

  describe("when binding unsetting the model's property that is bound to an unconfigured attribute", function(){
    beforeEach(function(){
      this.model.unset("name");
      this.el = this.view.$("#avatar");
    });

    it("should use the 'default' substitution setting", function(){
      expect(this.el.attr("class")).toBe("");
    });
  });

  describe("when binding to text and unsetting the model's property", function(){
    beforeEach(function(){
      this.model.unset("doctor");
      this.el = this.view.$("#doctor");
    });

    it("should set the text to an empty string", function(){
      expect(this.el.text()).toBe("");
    });
  });

  describe("when binding to html and unsetting the model's property", function(){
    beforeEach(function(){
      this.model.unset("villain");
      this.el = this.view.$("#villain");
    });

    it("should set the html to an empty string", function(){
      expect(this.el.html()).toBe("");
    });
  });

});

describe("configured data-bind substitutions", function(){
  beforeEach(function(){
    Backbone.ModelBinding.Configuration.dataBindSubst({
      text: "text subst",
      html: "&nbsp;"
    });
    this.model = new AModel({
      doctor: "Seuss"
    });
    this.view = new AView({model: this.model});
    this.view.render();
  });

  afterEach(function(){
    Backbone.ModelBinding.Configuration.restoreDataBindSubstConfig();
  });

  describe("when binding to text and unsetting the model's property", function(){
    beforeEach(function(){
      this.model.unset("doctor");
      this.el = this.view.$("#doctor");
    });

    it("should set the text to an empty string", function(){
      expect(this.el.text()).toBe("text subst");
    });
  });

  describe("when binding to html and unsetting the model's property", function(){
    beforeEach(function(){
      this.model.unset("villain");
      this.el = this.view.$("#villain");
    });

    it("should set the html to an empty string", function(){
      expect(this.el.html()).toBe("&nbsp;");
    });
  });

});

describe("resetting the data bind substitutions", function(){
  beforeEach(function(){
    Backbone.ModelBinding.Configuration.dataBindSubst({
      text: "text subst",
      html: "html subst"
    });
    this.model = new AModel({
      doctor: "Seuss",
      villain: "mort"
    });
    this.view = new AView({model: this.model});
    this.view.render();

    Backbone.ModelBinding.Configuration.restoreDataBindSubstConfig();
  });

  it("should use the default for text substitutions", function(){
    this.model.unset("doctor");
    this.doctorEl = this.view.$("#doctor");
    expect(this.doctorEl.text()).toBe("");
  });

  it("should use the default for html substitutions", function(){
    this.model.unset("villain");
    this.villainEl = this.view.$("#villain");
    expect(this.villainEl.html()).toBe("");
  });
});

describe("when the data-bind attribute is manually configured", function(){
  beforeEach(function(){
    Backbone.ModelBinding.Conventions.databind.selector = "*[data-bind-bb]";
    this.model = new AModel({
      doctor: "Seuss",
      villain: "mort"
    });
    this.view = new AView({model: this.model});
    this.view.render();
    this.el = this.view.$("#doctor_data_bind_bb");
    Backbone.ModelBinding.Conventions.databind.selector = "*[data-bind]";
  });

  it("should set the element's text to the model's property value immediately", function(){
    expect(this.el.text()).toBe("Seuss");
  });

  it("should set the text of the element when the model's property changes", function(){
    this.model.set({doctor: "Who"});
    expect(this.el.text()).toBe("Who");
  });
});
