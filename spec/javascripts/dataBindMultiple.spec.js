describe("data-bind multiple attributes", function(){
  beforeEach(function(){
    this.model = new AModel({
      url: "/foo/bar.gif",
      name: "me"
    });
    this.view = new AView({model: this.model});
    this.view.render();
    this.el = this.view.$("#avatar");
  });

  describe ("when initializing", function(){
    it("should set the first bound attribute", function(){
      expect(this.el.attr("src")).toBe("/foo/bar.gif");
    });

    it("shoudl set the second bound attribute", function(){
      expect(this.el.attr("class")).toBe("me");
    });
  });

  describe("when setting the values", function(){
    beforeEach(function(){
      this.model.set({url: "/empty.png", name: "you"});
    });

    it("should update the first bound attribute", function(){
      expect(this.el.attr("src")).toBe("/empty.png");
    });

    it("should update the second bound attribute", function(){
      expect(this.el.attr("class")).toBe("you");
    });
  });

});
