describe("CollectionBinder with ElManagerFactory", function () {
    describe("Without a proper element specification", function () {
        it("should throw if no HTML is given", function () {
            expect(function () {
                new Backbone.CollectionBinder.ElManagerFactory();
            }).toThrow();
        });

        it("should throw if non-HTML is given", function () {
            expect(function () {
                new Backbone.CollectionBinder.ElManagerFactory({});
            }).toThrow();
        });
    });

    describe("With string HTML", function () {
        describe("With no bindings", function () {
            beforeEach(function () {
                this.elManagerFactory = new Backbone.CollectionBinder.ElManagerFactory("<span>CollectionBinder is fun</span>");
                this.collectionBinder = new Backbone.CollectionBinder(this.elManagerFactory);
                this.$el = jQuery("<div></div>");
                this.collection = new Backbone.Collection([{}, {}]);
                this.collectionBinder.bind(this.collection, this.$el);
            });

            it("should render the same HTML string in each child", function () {
                expect(this.$el.children().eq(0).prop("tagName"))
                    .toBe("SPAN");
                expect(this.$el.children().eq(0).html())
                    .toBe("CollectionBinder is fun");
                expect(this.$el.children().eq(1).prop("tagName"))
                    .toBe("SPAN");
                expect(this.$el.children().eq(1).html())
                    .toBe("CollectionBinder is fun");
            });
        });

        describe("With string bindings", function () {
            beforeEach(function () {
                this.elManagerFactory = new Backbone.CollectionBinder.ElManagerFactory('<div><span name="firstName"></span><span name="lastName"></span></div>', "name");
                this.collectionBinder = new Backbone.CollectionBinder(this.elManagerFactory);
                this.$el = jQuery("<div></div>");
                this.collection = new Backbone.Collection([
                    { firstName: "John", lastName: "Doe" },
                    { firstName: "Dorothy", lastName: "Gale" }
                ]);
                this.collectionBinder.bind(this.collection, this.$el);
            });

            it("should render model attributes using given attribute", function () {
                expect(this.$el.children().eq(0).find("[name=firstName]").text())
                    .toBe("John");
                expect(this.$el.children().eq(0).find("[name=lastName]").text())
                    .toBe("Doe");
                expect(this.$el.children().eq(1).find("[name=firstName]").text())
                    .toBe("Dorothy");
                expect(this.$el.children().eq(1).find("[name=lastName]").text())
                    .toBe("Gale");
            });

            describe("Changing model attributes", function () {
                beforeEach(function () {
                    this.collection.at(0).set({
                        firstName: "George",
                        lastName: "Washington"
                    });
                });

                it("should update changed model element", function () {
                    expect(this.$el.children().eq(0).find("[name=firstName]").text())
                        .toBe("George");
                    expect(this.$el.children().eq(0).find("[name=lastName]").text())
                        .toBe("Washington");
                });

                it("should not update unchanged model element", function () {
                    expect(this.$el.children().eq(1).find("[name=firstName]").text())
                        .toBe("Dorothy");
                    expect(this.$el.children().eq(1).find("[name=lastName]").text())
                        .toBe("Gale");
                });
            });
        });

        describe("With object bindings", function () {
            beforeEach(function () {
                var bindings = {
                    firstName: ".firstName",
                    lastName: {
                        selector: "[data-name=upperLastName]",
                        converter: function (dir, value) {
                            return value.toUpperCase();
                        }
                    }
                };
                this.elManagerFactory = new Backbone.CollectionBinder.ElManagerFactory('<div><span class="firstName"></span><span data-name="upperLastName"></span></div>', bindings);
                this.collectionBinder = new Backbone.CollectionBinder(this.elManagerFactory);
                this.$el = jQuery("<div></div>");
                this.collection = new Backbone.Collection([
                    { firstName: "John", lastName: "Doe" },
                    { firstName: "Dorothy", lastName: "Gale" }
                ]);
                this.collectionBinder.bind(this.collection, this.$el);
            });

            it("should render model attributes using given attribute", function () {
                expect(this.$el.children().eq(0).find(".firstName").text())
                    .toBe("John");
                expect(this.$el.children().eq(0).find("[data-name=upperLastName]").text())
                    .toBe("DOE");
                expect(this.$el.children().eq(1).find(".firstName").text())
                    .toBe("Dorothy");
                expect(this.$el.children().eq(1).find("[data-name=upperLastName]").text())
                    .toBe("GALE");
            });

            describe("Changing model attributes", function () {
                beforeEach(function () {
                    this.collection.at(0).set({
                        firstName: "George",
                        lastName: "Washington"
                    });
                });

                it("should update changed model element", function () {
                    expect(this.$el.children().eq(0).find(".firstName").text())
                        .toBe("George");
                    expect(this.$el.children().eq(0).find("[data-name=upperLastName]").text())
                        .toBe("WASHINGTON");
                });

                it("should not update unchanged model element", function () {
                    expect(this.$el.children().eq(1).find(".firstName").text())
                        .toBe("Dorothy");
                    expect(this.$el.children().eq(1).find("[data-name=upperLastName]").text())
                        .toBe("GALE");
                });
            });
        });
    });

    describe("With HTML template", function () {
        describe("With no bindings", function () {
            beforeEach(function () {
                var htmlTemplate = _.template("<div><%- model.firstName %> <%- model.lastName %></div>");
                this.elManagerFactory = new Backbone.CollectionBinder.ElManagerFactory(htmlTemplate);
                this.collectionBinder = new Backbone.CollectionBinder(this.elManagerFactory);
                this.$el = jQuery("<div></div>");
                this.collection = new Backbone.Collection([
                    { firstName: "John", lastName: "Doe" },
                    { firstName: "Dorothy", lastName: "Gale" }
                ]);
                this.collectionBinder.bind(this.collection, this.$el);
            });

            it("should render template with model JSON passed in", function () {
                expect(this.$el.children().eq(0).text())
                    .toBe("John Doe");
                expect(this.$el.children().eq(1).text())
                    .toBe("Dorothy Gale");
            });

            describe("Changing a model with no bindings", function () {
                beforeEach(function () {
                    this.collection.at(0).set({
                        firstName: "George",
                        lastName: "Washington"
                    });
                });

                it("should not change pre-rendered HTML", function () {
                    expect(this.$el.children().eq(0).text())
                        .toBe("John Doe");
                    expect(this.$el.children().eq(1).text())
                        .toBe("Dorothy Gale");
                });
            });
        });

        describe("With string bindings", function () {
            beforeEach(function () {
                var htmlTemplate = _.template("<div><%- model.firstName %> <span name='lastName'><%- model.lastName %></span></div>");
                this.elManagerFactory = new Backbone.CollectionBinder.ElManagerFactory(htmlTemplate, "name");
                this.collectionBinder = new Backbone.CollectionBinder(this.elManagerFactory);
                this.$el = jQuery("<div></div>");
                this.collection = new Backbone.Collection([
                    { firstName: "John", lastName: "Doe" },
                    { firstName: "Dorothy", lastName: "Gale" }
                ]);
                this.collectionBinder.bind(this.collection, this.$el);
            });

            it("should render template with model JSON passed in", function () {
                expect(this.$el.children().eq(0).text())
                    .toBe("John Doe");
                expect(this.$el.children().eq(1).text())
                    .toBe("Dorothy Gale");
            });

            describe("Changing a model", function () {
                beforeEach(function () {
                    this.collection.at(0).set({
                        firstName: "George",
                        lastName: "Washington"
                    });
                });

                it("should change bound HTML only", function () {
                    expect(this.$el.children().eq(0).text())
                        .toBe("John Washington");
                });

                it("should not change other element", function () {
                    expect(this.$el.children().eq(1).text())
                        .toBe("Dorothy Gale");
                });
            });
        });

        describe("With object bindings", function () {
            beforeEach(function () {
                var bindings = {
                    lastName: {
                        selector: ".lastName",
                        converter: function (dir, value) {
                            return value.toUpperCase();
                        }
                    }
                };
                var htmlTemplate = _.template("<div><%- model.firstName %> <span class='lastName'><%- model.lastName %></span></div>");
                this.elManagerFactory = new Backbone.CollectionBinder.ElManagerFactory(htmlTemplate, bindings);
                this.collectionBinder = new Backbone.CollectionBinder(this.elManagerFactory);
                this.$el = jQuery("<div></div>");
                this.collection = new Backbone.Collection([
                    { firstName: "John", lastName: "Doe" },
                    { firstName: "Dorothy", lastName: "Gale" }
                ]);
                this.collectionBinder.bind(this.collection, this.$el);
            });

            it("should apply bindings on render", function () {
                expect(this.$el.children().eq(0).text())
                    .toBe("John DOE");
                expect(this.$el.children().eq(1).text())
                    .toBe("Dorothy GALE");
            });

            describe("Changing a model", function () {
                beforeEach(function () {
                    this.collection.at(0).set({
                        firstName: "George",
                        lastName: "Washington"
                    });
                });

                it("should change bound HTML only", function () {
                    expect(this.$el.children().eq(0).text())
                        .toBe("John WASHINGTON");
                });

                it("should not change other element", function () {
                    expect(this.$el.children().eq(1).text())
                        .toBe("Dorothy GALE");
                });
            });
        });
    });
});
