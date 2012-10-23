describe("radio button convention binding", function(){
  beforeEach(function(){
    this.model = new AModel({
      graduated: "maybe",
      us_citizen: "false"
    });
    this.view = new AView({model: this.model});
    this.view.render();
  });

  it("bind view changes to the model's field, by convention of id", function(){
    var el = this.view.$("#graduated_no");
    el.attr("checked", "checked");
    el.trigger('change');
    expect(this.model.get('graduated')).toEqual("no");
  });

  it("bind model field changes to the form input, by convention of id", function(){
    this.model.set({graduated: "yes"});
    var el = this.view.$("#graduated_yes");
    var selected = el.attr("checked");

    expect(selected).toBeTruthy();
  });

  it("binds the model's value to the form field on render (graduated)", function(){
    var el = this.view.$("input[type=radio][name=graduated]:checked");
    var selected = el.val();

    expect(selected).toBe("maybe");
  });

  it("binds the model's value to the form field on render (us_citizen)", function(){
    var el = this.view.$("#us_citizen_false");
    expect(el.is(':checked')).toBe(true);
  });
});
