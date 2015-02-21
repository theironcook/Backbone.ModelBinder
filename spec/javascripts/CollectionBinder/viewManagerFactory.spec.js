describe("ViewManagerFactory", function () {
    describe("Without a view factory", function () {
        it("should throw exception if no factory provided", function () {
            expect(function () {
                new Backbone.Collection.ViewManagerFactory();
            }).toThrow();
        });

        it("should throw exception if non-function provided", function () {
            expect(function () {
                new Backbone.Collection.ViewManagerFactory({});
            }).toThrow();

            expect(function () {
                new Backbone.Collection.ViewManagerFactory("string");
            }).toThrow();
        });
    });

    describe("makeElManager", function () {
        beforeEach(function () {
            this.ViewClass = Backbone.View.extend({
                render: function () {
                    this.$el.empty().append("<span class='thing'></span>");
                }
            });
            this.viewCreator = _.bind(function (model) {
                this.view = new this.ViewClass({
                    model: model
                });

                return this.view;
            }, this);
            spyOn(this, "viewCreator").andCallThrough();
            this.model = new Backbone.Model();
            this.collection = new Backbone.Collection();
            this.$el = jQuery("<div></div>");
            this.viewManagerFactory = new Backbone.CollectionBinder.ViewManagerFactory(this.viewCreator);
            this.collectionBinder = new Backbone.CollectionBinder(this.viewManagerFactory);
            this.collectionBinder.bind(this.collection, this.$el);
            this.elManager = this.viewManagerFactory.makeElManager(this.model);
        });

        it("should create an elManager with appropriate methods", function () {
            expect(this.elManager.createEl)
                .toEqual(jasmine.any(Function));

            expect(this.elManager.removeEl)
                .toEqual(jasmine.any(Function));

            expect(this.elManager.isElContained)
                .toEqual(jasmine.any(Function));

            expect(this.elManager.getModel)
                .toEqual(jasmine.any(Function));

            expect(this.elManager.getEl)
                .toEqual(jasmine.any(Function));
        });

        describe("createEl", function () {
            beforeEach(function () {
                spyOn(this.ViewClass.prototype, "render");
                this.elManager._setParentEl(this.$el);

                spyOn(this.elManager, "trigger");

                this.elManager.createEl();
            });

            it("should invoke view factory function", function () {
                expect(this.viewCreator)
                    .toHaveBeenCalled();

                expect(this.viewCreator)
                    .toHaveBeenCalledWith(this.model);
            });

            it("should render view", function () {
                expect(this.ViewClass.prototype.render)
                    .toHaveBeenCalled();
            });

            it("should append to parent element", function () {
                expect(this.$el.children().length)
                    .toBe(1);
            });

            it("should trigger elCreated event", function () {
                expect(this.elManager.trigger)
                    .toHaveBeenCalled();

                expect(this.elManager.trigger)
                    .toHaveBeenCalledWith("elCreated", this.model, jasmine.any(Backbone.View));
            });
        });

        describe("removeEl", function () {
            beforeEach(function () {
                this.elManager._setParentEl(this.$el);
                this.elManager.createEl();

                spyOn(this.elManager, "trigger");

                this.elManager.removeEl();
            });

            it("should remove from parent element", function () {
                expect(this.$el.children().length)
                    .toBe(0);
            });

            it("should trigger elRemoved event", function () {
                expect(this.elManager.trigger)
                    .toHaveBeenCalled();

                expect(this.elManager.trigger)
                    .toHaveBeenCalledWith("elRemoved", this.model, jasmine.any(Backbone.View));
            });
        });

        describe("isElContained", function () {
            beforeEach(function () {
                this.elManager._setParentEl(this.$el);
                this.elManager.createEl();
            });

            it("should return true for view element", function () {
                expect(this.elManager.isElContained(this.view.el))
                    .toBe(true);
            });

            xit("should return true for jQuery-wrapped view element", function () {
                expect(this.elManager.isElContained(this.view.$el))
                    .toBe(true);
            });

            it("should return true for element contained within view", function () {
                expect(this.elManager.isElContained(this.view.$(".thing")[0]))
                    .toBe(true);
            });

            it("should return true for jQuery-wrapped element contained within view", function () {
                expect(this.elManager.isElContained(this.view.$(".thing")))
                    .toBe(true);
            });
        });

        describe("getModel", function () {
            it("should return model provided to viewManagerFactory", function () {
                expect(this.elManager.getModel())
                    .toBe(this.model);
            });
        });

        describe("getView", function () {
            beforeEach(function () {
                this.elManager.createEl();
            });

            it("should return created view", function () {
                expect(this.elManager.getView())
                    .toBeDefined();

                expect(this.elManager.getView())
                    .toBe(this.view);
            });
        });

        describe("getEl", function () {
            beforeEach(function () {
                this.elManager.createEl();
            });

            it("should return root element of created view", function () {
                expect(this.elManager.getEl())
                    .toBe(this.view.$el);
            });
        });
    });
});
