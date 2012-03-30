Automatically synchronize your html views with your Backbone models.  Avoid writing boiler plate code in your views that plumb up model and view changes to synchronize them together.
Special thanks to Derick Bailey for providing unit tests and inspiration for this plugin.

Typically automated view-model binding is most useful for editable forms but view-model binding can also be useful for read only view elements that should be automatically updated when a model changes.  A model's attributes can be bound to a view element's text but also to an element's colors, layout etc.  This plugin can handle most of these situations.


## Plugin capabilities include:
* Automatic view-model binding
* Nested view-model binding
* Partial view-model binding (only some view elements participate in binding)
* Model binding to view element text value or any arbitrary view element attribute (disabled, border, etc.)
* Support for almost all view element types (text area, radio button, etc.)
* A single model attribute can be bound to multiple view elements
* A single view element can be bound to multiple model attributes
* An easy way to format values (phone numbers, dates, etc.)
* An easy way to convert types (ids to models, models to names) - especially useful for select boxes
* Order independent nested view/model binding
* Binding does not require backbone views - especially useful for small nested templates where views are overkill
  

Bindings are initialized with the same syntax that you use to create your events in a Backbone view.  They both simply rely on jquery.  This simple but powerful syntax allows you to handle almost all situations you will encounter.


Here are several examples demonstrating how to use this plugin.  
They are ordered from simplest to complex.  Best practices are shown near the end.

# Example:  Automatic binding to a form that has elements defined with the name attribute.
The model attribute 'address' will be bound with the input element named address. Calling model.set({address: 'something'}) would update the input element's value. If a user updates the input element in the browser the value entered will be automatically pushed to the model's address attribute.

 The view's html
<input name="address"/>

// from inside a View.render() function
var binder = new Backbone.ModelBinder();
binder.bind(this.model, this.el);




# Example: Binding with elements with the id defined instead of name:
In this situation we needed to define a bindings hash because we didn't rely on the default name attribute.  The bindings hash keys are the model's attribute names.  The binding hash values are jquery selector statements that should return 1 or more view elements.  This jquery event style is very simliar to how the backbone view events block is defined.
  <input id="address"/>
  <input id="phone"/>

  // from inside a View.render() function
  var binder = new Backbone.ModelBinder();
  var bindings = {address: '#address', address: '#phone'}
  binder.bind(this.model, this.$el, bindings);


# Example: Binding based on any attribute:
The jquery selector here is based off of the element's class for the address binding.  In the second binding for phone we've defined an arbitrary attribute named anyAttributeType.  The binding will still work because it's simply using a jquery selector to find the bound view element. 
  <input class="address"/>
  <input anyAttributeType="phone"/>

  // from inside a View.render() function
  var binder = new Backbone.ModelBinder();
  var bindings = {address: '[class=address]', phone: '[anyAttributeType=phone'}
  binder.bind(this.model, this.$el, bindings);


# Example: Binding multiple elements at once
  <div name="title"></div>
  <input id="name"/>

  // from inside a View.render() function
    var binder = new Backbone.ModelBinder();
    var bindings = {name: [{selector: '[name=title]'}, {selector: '#name'}]}
    binder.bind(this.model, this.$el, bindings);



