describe("custom conventions", function(){
  beforeEach(function(){
    this.model = new AModel({});
    this.view = new AView({model: this.model});
//    this.oldHandler = Backbone.ModelBinding.Conventions.text.handler;
  });

  afterEach(function(){
//    Backbone.ModelBinding.Conventions.text.handler = this.oldHandler;
  });

  describe("replace the text input handler", function(){
    beforeEach(function(){
      var nameSettingsHandler = {
        bind: function(selector, view, model){
          view.$("#name").val("a custom convention supplied this name");
        }
      };

      Backbone.ModelBinding.Conventions.text.handler = nameSettingsHandler;
      this.view.render();
    });

    it("should set the custom field value when rendered", function(){
      expect(this.view.$("#name").val()).toBe("a custom convention supplied this name");
    });
  });

  describe("add a brand new convention for paragraph tags", function(){
    beforeEach(function(){
      var PConvention = {
        selector: "p",
        handler: {
          bind: function(selector, view, model){
            view.$(selector).each(function(index){
              var name = model.get("name");
              $(this).html(name);
            });
          }
        }
      };

      Backbone.ModelBinding.Conventions.paragraphs = PConvention;
    });

    it("should display the model name in the paragraph", function(){
      this.model.set({name: "Gandalf Wizard"});
      this.view.render();
      expect(this.view.$("#aParagraph").html()).toBe("Gandalf Wizard");
    });
  });
});
