Similar to Derick Bailey's Backbone Model binding plugin but a bit simpler.

This plugin provides a way to be able to bind between model attributes and html elements.  It is meant to help you avoid
writing boiler plate code to plumb up changes between your views and models.

2 way binding means that when a model's attributes change views are automatically updated and when a view's values
are updated the corresponding model's attributes are changed.


Plugin capabilities include:
  Nested views / models
  Partial view-model binding (only some view elements are automatically bound)
  2 way binding a model's attributes to any element values or element attributes
  2 way binding a model's attributes to multiple element values or element attributes
  Easy way to format values during binding (phone numbers, dates, etc.)
  Easy way to convert types during binding (ids to models, etc.) - especially useful for select boxes
  Order independent nested view/model binding
  Removes need for Views, binding is done on elements - especially useful for small nested templates


Examples are ordered from simplest to complex.

Example:  Automatic binding to a form that has elements with name attributes.

  <input name="address"/>

  // from inside a View.render() function
  var binder = new Backbone.ModelBinder();
  binder.bind(this.model, this.$el);

  The model attribute 'address' would be synchronized with the elementment where name="address"


Example: Binding with elements with the id defined instead of name:

  <input id="address"/>
  <input id="phone"/>

  // from inside a View.render() function
  var binder = new Backbone.ModelBinder();
  var bindings = {address: '#address', address: '#phone'}
  binder.bind(this.model, this.$el, bindings);


Example: Binding based on any attribute:
  <input class="address"/>
  <input anyAttributeType="phone"/>

  // from inside a View.render() function
  var binder = new Backbone.ModelBinder();
  var bindings = {address: '[class=address]', address: '[anyAttributeType=phone'}
  binder.bind(this.model, this.$el, bindings);


Example: Binding multiple elements at once
  <div name="title"></div>
  <input id="name"/>

  // from inside a View.render() function
    var binder = new Backbone.ModelBinder();
    var bindings = {name: [{selector: '[name=title]'}, {selector: '#name'}]}
    binder.bind(this.model, this.$el, bindings);


