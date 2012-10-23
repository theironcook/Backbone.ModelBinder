describe("text area convention binding", function(){
  beforeEach(function(){
    this.model = new AModel({
      bio: "my biography"
    });
    this.view = new AView({model: this.model});
    this.view.render();
  });

  it("bind view changes to the model's field, by convention of id", function(){
    var el = this.view.$("#bio");
    el.val("my biography");
    el.trigger('change');

    expect(this.model.get('bio')).toEqual("my biography");
  });

  it("bind model field changes to the form input, by convention of id", function(){
    this.model.set({bio: "a modified biogrpahy"});
    var el = this.view.$("#bio");
    expect(el.val()).toEqual("a modified biogrpahy");
  });

  it("binds the model's value to the form field on render", function(){
    var el = this.view.$("#bio");
    expect(el.val()).toEqual("my biography");
  });

});
