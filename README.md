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


### Example:  Automatic binding to a form that has elements defined with the name attribute.
The model attribute 'address' will be bound with the input element named address.
Changes to the model's address are automatically pushed to the html address element and changes to the view's address element are automatically pushed to the model's address.

````
The view's html
<input name="address"/>

// from inside a View.render() function
var binder = new Backbone.ModelBinder();
binder.bind(this.model, this.el);
````


### Example: Binding with elements with the id defined instead of name:
Here the html elements rely on the id attribute rather than the name attribute.  In this case, we need to define a hash named 'bindings'.
The bindings hash keys are the names of the model attributes. The values are jquery selectors that will resolve to view elements that are bound to the html elements.

````
  <input id="address"/>
  <input id="phone"/>

  // from inside a View.render() function
  var binder = new Backbone.ModelBinder();
  var bindings = {address: '#address', address: '#phone'}
  binder.bind(this.model, this.$el, bindings);
````


### Example: Binding based on any attribute:
The bindings selector here is based off of the element's class for the address binding.
In the second binding for phone we've defined an arbitrary attribute named anyAttributeType.
The binding will still work because it's simply using a jquery selector to find the bound view element.

````
  <input class="address"/>
  <input anyAttributeType="phone"/>

  // from inside a View.render() function
  var binder = new Backbone.ModelBinder();
  var bindings = {address: '[class=address]', phone: '[anyAttributeType=phone'}
  binder.bind(this.model, this.$el, bindings);
````


### Example: Binding multiple elements at once
Here the div title and the input with the id of color will both be update when the model's color changes.
If a user changed the color in the input element, the model's color would be updated and the div title would also be updated.

````
  <div name="title"></div>
  <input id="color"/>

  // from inside a View.render() function
  var binder = new Backbone.ModelBinder();
  var bindings = {color: [{selector: '[name=title]'}, {selector: '#color'}]}
  binder.bind(this.model, this.$el, bindings);
````


### Example: Formatting a phone number
Here the div title and the input with the id of color will both be update when the model's color changes.
If a user changed the color in the input element, the model's color would be updated and the div title would also be updated.
The big difference here is the converter : phoneConverter entry for the binding.  Any binding can take a converter as an argument.
A converter is simply a function that takes a direction (ModelToView or ViewToModel) and the value to convert.
In this situation it's a very simple phone formatter.

````
  <input name="phoneNumber"/>

  // from inside a View.render() function
  var binder = new Backbone.ModelBinder();

  var phoneConverter = function(direction, value){
    if (direction === Backbone.ModelBinder.Constants.ModelToView) {
      if (value.length == 7){
        return value.substring(0, 3) + '-' + value.substring(3, 7);
      }
      else{
        return value;
      }
    }
    else {
      return value.replace(/[^0-9]/g, '');
    }
  };

  var bindings = {phoneNumber: [{selector: '[name=phoneNumber]', converter: phoneConverter}]}
  binder.bind(this.model, this.$el, bindings);
````


### Example: Converting a nested model's selection to a select box with text
In this situation, the view shows a selection which represents a nested model that the outer model refers to.
Here, the converter is leveraging the CollectionConverter - this converts between a model to a model id.
The select element's values are defined with the possible model's ids.  The net result is that the nested model will point to whatever the user selected.

````
  <select name="nestedModel">
    <option value="">Please Select Something</option>
    <% _.each(nestedModelChoices, function (modelChoice) { %>
      <option value="<%= modelChoice.id %>"><%= modelChoice.description %></option>
    <% }); %>
  </select>

  // from inside a View.render() function
  // an example of what might be passed to the template function
  var nestedModelChoices = [{id: 1, description: 'This is One'}, {id: 2, description: 'This is Two'}];

  var binder = new Backbone.ModelBinder();

  var bindings = {phoneNumber: [{selector: '[name=phoneNumber]',
                  converter: converter: new Backbone.ModelBinder.CollectionConverter(nestedModelChoices).convert}]}
  binder.bind(this.model, this.$el, bindings);
````
