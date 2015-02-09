describe("binding and validations", function () {
    var ValidatingModel = Backbone.Model.extend({
        validate: function (attrs) {
            if (!attrs.name) {
                return "name not found";
            }
        }
    });

    var View = Backbone.View.extend({
        initialize: function () {
            this.modelBinder = new Backbone.ModelBinder();
        },
        render: function () {
            this.$el.append('<input type="text" id="name">');
            this.modelBinder.bind(
                this.model,
                this.$el,
                this.bindings,
                { modelSetOptions: { validate: true } }
            );
        },
        bindings: {
            name: "#name"
        }
    });

    beforeEach(function () {
        this.model = new ValidatingModel({ name: "initial" });
        this.view = new View({ model: this.model });
        this.view.render();
    });

    describe("setting model to valid value", function () {
        beforeEach(function () {
            this.result = this.model.set({
                name: "valid name"
            }, { validate: true });
        });

        it("should have succeeded", function () {
            expect(this.result).toBeTruthy();
        });

        it("should have affected the model", function () {
            expect(this.model.get("name")).toBe("valid name");
        });

        it("should have affected the view", function () {
            expect(this.view.$("#name").val()).toBe("valid name");
        });
    });

    describe("setting model to invalid value", function () {
        beforeEach(function () {
            this.result = this.model.set({
                name: ""
            }, { validate: true });
        });

        it("should not have succeeded", function () {
            expect(this.result).toBe(false);
        });

        it("should not have affected the model", function () {
            expect(this.model.get("name")).not.toBe("");
        });

        it("should not have affected the view", function () {
            expect(this.view.$("#name").val()).not.toBe("");
        });
    });

    describe("setting view to valid value", function () {
        beforeEach(function () {
            this.view.$("#name").val("valid name").trigger("change");
        });

        it("should have affected the model", function () {
            expect(this.model.get("name")).toBe("valid name");
        });

        it("should have persisted in the view", function () {
            expect(this.view.$("#name").val()).toBe("valid name");
        });
    });

    describe("setting view to invalid value", function () {
        beforeEach(function () {
            this.view.$("#name").val("").trigger("change");
        });

        it("should not have affected the model", function () {
            expect(this.model.get("name")).not.toBe("");
        });

        it("should not have persisted in the view", function () {
            expect(this.view.$("#name").val()).not.toBe("");
        });
    });
});
