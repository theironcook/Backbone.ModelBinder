// Some projects only bind by name, especially where nested views are prevalent
// so ensuring that nested views that rely on the name attribute is important

describe("data-bind nested views", function(){
  beforeEach(function(){
    this.outerModel = new AModel({name: "outerModel"});
    this.innerModel = new AModel({name: "innerModel"});
    this.outerModel.set({innerModel: this.innerModel});

    this.outerView = new NestedOuterView({model: this.outerModel});
    this.outerView.render();
    this.innerView = this.outerView.innerView;
  });

  describe ("when binding to unique fields in an inner view", function(){
    it("the inner text should be updated", function(){
      $("[name=innerText]", this.innerView.$el).val("batman");
      $("[name=innerText]", this.innerView.$el).trigger("change");
      expect(this.innerModel.get("innerText")).toBe("batman");
    });

    it("the outer text should not be updated", function(){
      $("[name=innerText]", this.innerView.$el).val("robin");
      $("[name=innerText]", this.innerView.$el).trigger("change");
      expect(this.outerModel.get("innerText")).toBe(undefined);
    });

    it("the inner select should be updated", function(){
      $("[name=innerSelect]", this.innerView.$el).val("college");
      $("[name=innerSelect]", this.innerView.$el).trigger("change");
      expect(this.innerModel.get("innerSelect")).toBe("college");
    });

    it("the outer select should not be updated", function(){
      $("[name=innerSelect]", this.innerView.$el).val("graduate");
      $("[name=innerSelect]", this.innerView.$el).trigger("change");
      expect(this.outerModel.get("innerSelect")).toBe(undefined);
    });

    it("the inner radio should be updated", function(){
      $("#graduated_maybe", this.innerView.$el).attr("checked", "checked");
      $("#graduated_maybe", this.innerView.$el).trigger("change");
      expect(this.innerModel.get("innerRadio")).toBe("maybe");
    });

    it("the outer radio should not be updated", function(){
      $("#graduated_yes", this.innerView.$el).attr("checked", "checked");
      $("#graduated_yes", this.innerView.$el).trigger("change");
      expect(this.outerModel.get("innerRadio")).toBe(undefined);
    });

    it("the inner checkbox should be updated", function(){
      $("[name=innerCheckbox]", this.innerView.$el).removeAttr("checked");
      $("[name=innerCheckbox]", this.innerView.$el).trigger("change");
      expect(this.innerModel.get("innerCheckbox")).toBe(false);
      $("[name=innerCheckbox]", this.innerView.$el).attr("checked", "checked");
      $("[name=innerCheckbox]", this.innerView.$el).trigger("change");
      expect(this.innerModel.get("innerCheckbox")).toBe(true);
    });

    it("the outer checkbox should not be updated", function(){
      $("[name=innerCheckbox]", this.innerView.$el).removeAttr("checked");
      $("[name=innerCheckbox]", this.innerView.$el).trigger("change");
      $("[name=innerCheckbox]", this.innerView.$el).attr("checked", "checked");
      $("[name=innerCheckbox]", this.innerView.$el).trigger("change");
      expect(this.outerModel.get("innerCheckbox")).toBe(undefined);
    });
  });

  describe ("when binding to unique fields in an outer view", function(){
    it("the outer text should be updated", function(){
      $("[name=outerText]", this.outerView.$el).val("joker");
      $("[name=outerText]", this.outerView.$el).trigger("change");
      expect(this.outerModel.get("outerText")).toBe("joker");
    });

    it("the inner text should not be updated", function(){
      $("[name=outerText]", this.outerView.$el).val("penguin");
      $("[name=outerText]", this.outerView.$el).trigger("change");
      expect(this.innerModel.get("outerText")).toBe(undefined);
    });

    it("the outer select should be updated", function(){
      $("[name=outerSelect]", this.outerView.$el).val("grade_school");
      $("[name=outerSelect]", this.outerView.$el).trigger("change");
      expect(this.outerModel.get("outerSelect")).toBe("grade_school");
    });

    it("the inner select should not be updated", function(){
      $("[name=outerSelect]", this.outerView.$el).val("none");
      $("[name=outerSelect]", this.outerView.$el).trigger("change");
      expect(this.innerModel.get("outerSelect")).toBe(undefined);
    });

    it("the outer radio should be updated", function(){
      $("#graduated_maybe", this.outerView.$el).attr("checked", "checked");
      $("#graduated_maybe", this.outerView.$el).trigger("change");
      expect(this.outerModel.get("outerRadio")).toBe("maybe");
    });

    it("the inner radio should not be updated", function(){
      $("#graduated_yes", this.outerView.$el).attr("checked", "checked");
      $("#graduated_yes", this.outerView.$el).trigger("change");
      expect(this.innerModel.get("outerRadio")).toBe(undefined);
    });

    it("the outer checkbox should be updated", function(){
      $("[name=outerCheckbox]", this.outerView.$el).removeAttr("checked");
      $("[name=outerCheckbox]", this.outerView.$el).trigger("change");
      expect(this.outerModel.get("outerCheckbox")).toBe(false);
      $("[name=outerCheckbox]", this.outerView.$el).attr("checked", "checked");
      $("[name=outerCheckbox]", this.outerView.$el).trigger("change");
      expect(this.outerModel.get("outerCheckbox")).toBe(true);
    });

    it("the inner checkbox should not be updated", function(){
      $("[name=outerCheckbox]", this.outerView.$el).removeAttr("checked");
      $("[name=outerCheckbox]", this.outerView.$el).trigger("change");
      $("[name=outerCheckbox]", this.outerView.$el).attr("checked", "checked");
      $("[name=outerCheckbox]", this.outerView.$el).trigger("change");
      expect(this.innerModel.get("outerCheckbox")).toBe(undefined);
    });
  });

  describe("when binding to shared id fields in an inner view", function () {
    it("the inner text should be updated", function () {
      $("[name=sharedText]", this.innerView.$el).val("batman");
      $("[name=sharedText]", this.innerView.$el).trigger("change");
      expect(this.innerModel.get("sharedText")).toBe("batman");
    });

    it("the outer text should not be updated", function () {
      $("[name=sharedText]", this.innerView.$el).val("robin");
      $("[name=sharedText]", this.innerView.$el).trigger("change");
      expect(this.outerModel.get("sharedText")).toBe(undefined);
    });

    it("the inner select should be updated", function () {
      $("[name=sharedSelect]", this.innerView.$el).val("college");
      $("[name=sharedSelect]", this.innerView.$el).trigger("change");
      expect(this.innerModel.get("sharedSelect")).toBe("college");
    });

    it("the outer select should not be updated", function () {
      $("[name=sharedSelect]", this.innerView.$el).val("graduate");
      $("[name=sharedSelect]", this.innerView.$el).trigger("change");
      expect(this.outerModel.get("sharedSelect")).toBe(undefined);
    });

    it("the outer radio should not be updated", function () {
      $("[name=graduated_yes][name=sharedRadio]", this.innerView.$el).attr("checked", "checked");
      $("[name=graduated_yes][name=sharedRadio]", this.innerView.$el).trigger("change");
      expect(this.outerModel.get("sharedRadio")).toBe(undefined);
    });

    it("the inner checkbox should be updated", function () {
      $("[name=sharedCheckbox]", this.innerView.$el).removeAttr("checked");
      $("[name=sharedCheckbox]", this.innerView.$el).trigger("change");
      expect(this.innerModel.get("sharedCheckbox")).toBe(false);
      $("[name=sharedCheckbox]", this.innerView.$el).attr("checked", "checked");
      $("[name=sharedCheckbox]", this.innerView.$el).trigger("change");
      expect(this.innerModel.get("sharedCheckbox")).toBe(true);
    });

    it("the outer checkbox should not be updated", function () {
      $("[name=sharedCheckbox]", this.innerView.$el).removeAttr("checked");
      $("[name=sharedCheckbox]", this.innerView.$el).trigger("change");
      $("[name=sharedCheckbox]", this.innerView.$el).attr("checked", "checked");
      $("[name=sharedCheckbox]", this.innerView.$el).trigger("change");
      expect(this.outerModel.get("sharedCheckbox")).toBe(undefined);
    });
  });

  describe("when binding to shared id fields in an outer view", function () {
    it("the outer text should be updated", function () {
      $("[name=sharedText]:first", this.outerView.$el).val("batman");
      $("[name=sharedText]", this.outerView.$el).trigger("change");
      expect(this.outerModel.get("sharedText")).toBe("batman");
    });

    it("the inner text should not be updated", function () {
      $("[name=sharedText]:first", this.outerView.$el).val("robin");
      $("[name=sharedText]:first", this.outerView.$el).trigger("change");
      expect(this.innerModel.get("sharedText")).toBe(undefined);
    });

    it("the outer select should be updated", function () {
      $("[name=sharedSelect]:first", this.outerView.$el).val("college");
      $("[name=sharedSelect]:first", this.outerView.$el).trigger("change");
      expect(this.outerModel.get("sharedSelect")).toBe("college");
    });

    it("the inner select should not be updated", function () {
      $("[name=sharedSelect]:first", this.outerView.$el).val("graduate");
      $("[name=sharedSelect]:first", this.outerView.$el).trigger("change");
      expect(this.innerModel.get("sharedSelect")).toBe(undefined);
    });

    it("the outer checkbox should be updated", function () {
      $("[name=sharedCheckbox]:first", this.outerView.$el).removeAttr("checked");
      $("[name=sharedCheckbox]:first", this.outerView.$el).trigger("change");
      expect(this.outerModel.get("sharedCheckbox")).toBe(false);
      $("[name=sharedCheckbox]:first", this.outerView.$el).attr("checked", "checked");
      $("[name=sharedCheckbox]:first", this.outerView.$el).trigger("change");
      expect(this.outerModel.get("sharedCheckbox")).toBe(true);
    });

    it("the inner checkbox should not be updated", function () {
      $("[name=sharedCheckbox]:first", this.outerView.$el).attr("checked", "checked");
      $("[name=sharedCheckbox]:first", this.outerView.$el).trigger("change");
      expect(this.innerModel.get("sharedCheckbox")).toBe(undefined);
    });
  });
});
