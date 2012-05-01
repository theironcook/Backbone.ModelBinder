describe('default bindings', function(){
    beforeEach(function(){
        this.model = new AModel();
        this.view = new SimpleView({model: this.model});
        this.view.render();
        this.modelBinder = new Backbone.ModelBinder();
    });

    describe('Default bindings', function(){
        it('default name bindings', function(){
            var nameBindings = Backbone.ModelBinder.createDefaultBindings(this.view.el, 'name');

            this.modelBinder.bind(this.model, this.view.el, nameBindings);

            this.model.set({firstName: 'Kerry'});
            expect(this.view.$('[name=firstName]').val()).toBe('Kerry');
            expect(this.view.$('#firstName').val()).toBe('');

            this.view.$('[name=lastName]').val('Collins');
            this.view.$('[name=lastName]').trigger('change');
            expect(this.model.get('lastName')).toBe('Collins');

            this.model.set({education: 'college'});
            expect(this.view.$('[name=education]').val()).toBe('college');
        });

        it('default id bindings', function(){
            var idBindings = Backbone.ModelBinder.createDefaultBindings(this.view.el, 'id');

            this.modelBinder.bind(this.model, this.view.el, idBindings);

            this.model.set({firstName: 'Kerry'});
            expect(this.view.$('#firstName').val()).toBe('Kerry');
            expect(this.view.$('[name=firstName]').val()).toBe('');

            this.model.set({education: 'college'});
            expect(this.view.$('[name=education]').val()).toBe('none');
        });

        it('combined default id and name bindings', function(){
            var idBindings = Backbone.ModelBinder.createDefaultBindings(this.view.el, 'id');
            var nameBindings = Backbone.ModelBinder.createDefaultBindings(this.view.el, 'name');

            Backbone.ModelBinder.combineBindings(nameBindings, idBindings);

            console.log('name bindings ', nameBindings, idBindings);
            this.modelBinder.bind(this.model, this.view.el, nameBindings);

            this.model.set({firstName: 'Kerry'});
            expect(this.view.$('#firstName').val()).toBe('Kerry');
            expect(this.view.$('[name=firstName]').val()).toBe('Kerry');

            this.view.$('#firstName').val('Collins');
            this.view.$('#firstName').trigger('change');
            expect(this.model.get('firstName')).toBe('Collins');
            expect(this.view.$('[name=firstName]').val()).toBe('Collins');

            this.model.set({education: 'college'});
            expect(this.view.$('[name=education]').val()).toBe('college');
        });

        it('converter bindings', function(){
            var defaultConverter = function(direction, value){
                if(direction === Backbone.ModelBinder.Constants.ModelToView){
                    return 'XXX' + value;
                }
                else {
                    return value.replace('XXX');
                }
            };

            var bindings = Backbone.ModelBinder.createDefaultBindings(this.view.el, 'name', defaultConverter);

            this.modelBinder.bind(this.model, this.view.el, bindings);

            this.model.set({firstName: 'Kerry'});
            expect(this.view.$('[name=firstName]').val()).toBe('XXXKerry');

            this.view.$('[name=firstName]').val('Kyle');
            this.view.$('[name=firstName]').trigger('change');
            expect(this.model.get('firstName')).toBe('Kyle');
        });
    });

});