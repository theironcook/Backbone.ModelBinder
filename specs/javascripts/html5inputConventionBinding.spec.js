describe("HTML5 input convention bindings", function(){
  beforeEach(function(){
    this.model = new AModel({
        number: "1234",
        range: "65",
        tel: "321-123-1222",
        search: "search text",
        url: "http:\\\\url.com",
        email: "email@domain.com"
    });
    this.view = new AView({model: this.model});
    this.view.render();
  });

  describe("number element binding", function(){
    it("bind view changes to the model's field, by convention of id", function(){
      var el = this.view.$("#number");
      el.val("09876");
      el.trigger('change');

      expect(this.model.get('number')).toEqual("09876");
    });

    it("bind model field changes to the form input, by convention of id", function(){
      this.model.set({number: "45678"});
      var el = this.view.$("#number");
      expect(el.val()).toEqual("45678");
    });

    it("binds the model's value to the form field on render", function(){
      var el = this.view.$("#number");
      expect(el.val()).toEqual("1234");
    });
  });

  describe("range element binding", function(){
    it("bind view changes to the model's field, by convention of id", function(){
      var el = this.view.$("#range");
      el.val("9876");
      el.trigger('change');

      expect(this.model.get('range')).toEqual("9876");
    });

    it("bind model field changes to the form input, by convention of id", function(){
      this.model.set({range: "45678"});
      var el = this.view.$("#range");
      expect(el.val()).toEqual("45678");
    });

    it("binds the model's value to the form field on render", function(){
      var el = this.view.$("#range");
      expect(el.val()).toEqual("65");
    });
  });

   describe("tel element binding", function(){
    it("bind view changes to the model's field, by convention of id", function(){
      var el = this.view.$("#tel");
      el.val("321-345-5555");
      el.trigger('change');

      expect(this.model.get('tel')).toEqual("321-345-5555");
    });

    it("bind model field changes to the form input, by convention of id", function(){
      this.model.set({tel: "456-345-5555"});
      var el = this.view.$("#tel");
      expect(el.val()).toEqual("456-345-5555");
    });

    it("binds the model's value to the form field on render", function(){
      var el = this.view.$("#tel");
      expect(el.val()).toEqual("321-123-1222");
    });
  });

   describe("search element binding", function(){
    it("bind view changes to the model's field, by convention of id", function(){
      var el = this.view.$("#search");
      el.val("more text");
      el.trigger('change');

      expect(this.model.get('search')).toEqual("more text");
    });

    it("bind model field changes to the form input, by convention of id", function(){
      this.model.set({search: "new text"});
      var el = this.view.$("#search");
      expect(el.val()).toEqual("new text");
    });

    it("binds the model's value to the form field on render", function(){
      var el = this.view.$("#search");
      expect(el.val()).toEqual("search text");
    });
  });

   describe("url element binding", function(){
    it("bind view changes to the model's field, by convention of id", function(){
      var el = this.view.$("#url");
      el.val("some url");
      el.trigger('change');

      expect(this.model.get('url')).toEqual("some url");
    });

    it("bind model field changes to the form input, by convention of id", function(){
      this.model.set({url: "new url"});
      var el = this.view.$("#url");
      expect(el.val()).toEqual("new url");
    });

    it("binds the model's value to the form field on render", function(){
      var el = this.view.$("#url");
      expect(el.val()).toEqual("http:\\\\url.com");
    });
  });

  describe("email element binding", function(){
    it("bind view changes to the model's field, by convention of id", function(){
      var el = this.view.$("#email");
      el.val("new@email.com");
      el.trigger('change');

      expect(this.model.get('email')).toEqual("new@email.com");
    });

    it("bind model field changes to the form input, by convention of id", function(){
      this.model.set({email: "more@email.gov"});
      var el = this.view.$("#email");
      expect(el.val()).toEqual("more@email.gov");
    });

    it("binds the model's value to the form field on render", function(){
      var el = this.view.$("#email");
      expect(el.val()).toEqual("email@domain.com");
    });
  });


});
