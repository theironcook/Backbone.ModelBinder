describe("select element convention binding", function(){
  beforeEach(function(){
    this.model = new AModel({
      name: "Ashelia Bailey", 
      education: "graduate", 
      age_level: 0,
      graduated: "maybe",
      us_citizen: false,
      drivers_license: true,
      motorcycle_license: false,
      bio: "my baby girl",
      operating_system: "non existent value"
    });
    this.view = new AView({model: this.model});
    this.view.render();
  });

  it("bind view changes to the model's field, by convention of id", function(){
    var el = this.view.$("#education");
    el.val("college");
    el.trigger('change');

    expect(this.model.get('education')).toEqual("college");
  });

  it("bind model field changes to the form input, by convention of id", function(){
    this.model.set({education: "high school"});
    var el = this.view.$("#education");
    expect(el.val()).toEqual("high school");
  });

  it("binds the model's value to the form field on render (education)", function(){
    var el = this.view.$("#education");
    expect(el.val()).toEqual("graduate");
  });

  it("binds the model's value to the form field on render (age_level)", function(){
    var el = this.view.$("#age_level");
    expect(el.val()).toEqual("0");
  });

  it("applies the text of the selection to the model", function(){
    var el = this.view.$("#education");
    el.val("grade_school");
    el.trigger('change');

    expect(this.model.get('education')).toEqual("grade_school");
  });
});
