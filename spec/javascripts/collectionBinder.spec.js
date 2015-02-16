describe("CollectionBinder", function () {
    describe("Without an elManagerFactory specified", function () {
        it("should throw exception", function () {
            expect(function () { new Backbone.CollectionBinder(); })
                .toThrow();
        });
    });

    describe("bind", function () {
        describe("Without the necessary options", function () {
            beforeEach(function () {
                var elManagerFactory = new Backbone.CollectionBinder.ElManagerFactory("<span></span>");
                this.target = new Backbone.CollectionBinder(elManagerFactory);
            });

            it("should throw exception if collection not provided", function () {
                expect(function () { this.target.bind(); })
                    .toThrow();
            });

            it("should throw if parent element not provided", function () {
                var collection = new Backbone.Collection();

                expect(function () { this.target.bind(collection) })
                    .toThrow();
            });
        });

        describe("Using collection events", function () {
            beforeEach(function () {
                var elManagerFactory = new Backbone.CollectionBinder.ElManagerFactory("<span></span>");
                this.target = new Backbone.CollectionBinder(elManagerFactory);
                this.collection = new Backbone.Collection();

                spyOn(this.collection, "on").andCallThrough();

                this.target.bind(this.collection, jQuery("<div></div>"));
            });

            it("should listen for add events", function () {
                expect(this.collection.on)
                    .toHaveBeenCalledWith("add", jasmine.any(Function), this.target);
            });

            it("should listen for remove events", function () {
                expect(this.collection.on)
                    .toHaveBeenCalledWith("remove", jasmine.any(Function), this.target);
            });

            it("should listen for sort events", function () {
                expect(this.collection.on)
                    .toHaveBeenCalledWith("sort", jasmine.any(Function), this.target);
            });

            it("should listen for reset events", function () {
                expect(this.collection.on)
                    .toHaveBeenCalledWith("reset", jasmine.any(Function), this.target);
            });
        });

        describe("With an empty collection", function () {
            beforeEach(function () {
                var elManagerFactory = new Backbone.CollectionBinder.ElManagerFactory("<span>Hello, world!</span>");
                this.target = new Backbone.CollectionBinder(elManagerFactory);
                this.collection = new Backbone.Collection([]);
                this.$parentEl = jQuery("<div></div>");

                this.target.bind(this.collection, this.$parentEl);
            });

            it("should render no children into parent element", function () {
                expect(this.$parentEl.children().length).toBe(0);
            });

            describe("Adding a model", function () {
                beforeEach(function () {
                    this.collection.add({});
                });

                it("should render one child into parent element", function () {
                    expect(this.$parentEl.children().length).toBe(1);
                });
            });
        });
    });
});
