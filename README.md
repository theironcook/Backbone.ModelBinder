Special thanks to Derick Bailey for providing unit tests and inspiration for this plugin.


This simple lightweight plugin helps you automatically synchronize your Backbone Views and Models together.
Unlike other view-model binding frameworks that rely on bindings created in the html, this model binder defines model binding logic in the Backbone View's javascript.
It uses the same jQuery event binding mechanism that Backbone relies on to capture events on Views.
The plugin is simple and flexible enough to handle almost any type of view-model configuration your projects have.


## Plugin capabilities include:
* Nested views
* Partial view binding - only some view elements are bound
* Binding with multiple models in a single view
* Backbone views are not required. It relies on html elements that may or may not be owned by a view.
* Binding can be performed on an html element's value or any arbitrary attribute (disabled, border, etc.)
* Support for almost all view element types (text area, radio button, etc.)
* A single model attribute can be bound to multiple view elements
* A single view element can be bound to multiple model attributes
* An easy way to format values (phone numbers, dates, etc.)
* An easy way to convert types (ids to models, models to names) - especially useful for select boxes
* Order independent nested view/model binding

<br>
The remaining documentation starts off with some simple examples and builds to more complicated situations.
<hr>

<br>
In Backbone a typical view might looks something like the example below.  The view registers for a change on an element with the id of address.
When the address element changes the model's address attribute will be updated.


````
SomeView = Backbone.View.extend({
    events: {
        'change #address', '_onAddressChanged'
    },
    _onAddressChanged: function(){
        this.model.set({address: this.$('#address')});
    }
````

<br>
In some situations the model's address might be updated and you want to update the view.
The view will need to listen for when the model changes and then update itself

````
SomeView = Backbone.View.extend({
    initialize: function{
        this.model.on('change:address', this._onModelAddressChange, this);
    },
    _onModelAddressChange: function(){
        this.$('#address').val(this.model.get('address'));
    }
````

<br>
The model binder plugin allows you to have your view and model automatically synchronized.
The the bind() function takes a Backbone model and an html element that will contain all of the view elements to be bound.
The bind() function must be called after your html elements exist.  They do not need to be rendered on a web page though.

The model binder will synchronize the input that has name="address" to the model's address attribute because they have the same value.
For very simple forms where you want each field bound to a single html element with no formatting this technique is sufficient.

````
// Snippet from the template file
<input type="text" name="address"/>

SomeView = Backbone.View.extend({
    initialize: function(){
        this.modelBinder = new Backbone.ModelBinder();
    },
    render: function(){
        this.$el.append(this.template());
        this.modelBinder.bind(this.model, this.el);
    }
````

<br>
For more complicated situations such as binding to a view elements attribute rather than it's value or performing formatting operations you will need to define a binding definitions hash.
The simplest binding definition defines model attributes as keys and a jQuery selector to locate the view elements to bind to.
Here is how the previous example would have defined the binding definition to achieve the same result.

````
// Snippet from the template file
<input type="text" name="address"/>

SomeView = Backbone.View.extend({
    initialize: function(){
        this.modelBinder = new Backbone.ModelBinder();
    },
    render: function(){
        this.$el.append(this.template());
        var bindings = {address: '[name=address]'};
        this.modelBinder.bind(this.model, this.el, bindings);
    }
````

<br>
The bindings definition hash can also define multiple html elements.
In this example the address will be bound to both the input element and the span with the name pageTitle.
The bindings value can be an array of element bindings.

````
// Snippet from the template file
<span name="pageTitle"/>
<input type="text" name="address"/>

SomeView = Backbone.View.extend({
    initialize: function(){
        this.modelBinder = new Backbone.ModelBinder();
    },
    render: function(){
        this.$el.append(this.template());
        var bindings = {address: ['[name=address]', '[name=pageTitle]']};
        this.modelBinder.bind(this.model, this.el, bindings);
    }
````

<br>
You can also bind to any arbitrary html attribute.
In this example, we are binding the model's attribute addressWanted to the address html element's enabled attribute.
This example also shows how the binding definitions value can have multiple fields defined.

All previous examples just defined a jquery selector without explicitly naming it 'selector' but if you pass in multiple options you must specify the selector with a name.
In this example we make use of the elAttribute.  This specifies which attribute will be updated.  In this case the enabled attribute.

````
// Snippet from the template file
<input type="text" name="address"/>

SomeView = Backbone.View.extend({
    initialize: function(){
        this.modelBinder = new Backbone.ModelBinder();
    },
    render: function(){
        this.$el.append(this.template());
        var bindings = {address: '[name=address]', addressWanted: {selector: '[name=address]',  elAttribute: 'enabled'}};
        this.modelBinder.bind(this.model, this.el, bindings);
    }
````

<br>
Binding definitions simply use jquery.
The binder will throw an exception if no elements are found but will work just fine if multiple elements are returned.
In this example, all 3 html elements enabled attribute are bound to the model's isPartOneEnabled attribute.
This is because the jquery selector '[class~=partOne]' returned all 3 elements.

````
// Snippet from the template file
<input type="text" class="partOne" name="address"/>
<input type="text" class="partOne" name="phone"/>
<input type="text" class="partOne" name="fax"/>

SomeView = Backbone.View.extend({
    initialize: function(){
        this.modelBinder = new Backbone.ModelBinder();
    },
    render: function(){
        this.$el.append(this.template());
        var bindings = {isPartOneEnabled: {selector: '[class~=partOne]',  elAttribute: 'enabled'}};
        this.modelBinder.bind(this.model, this.el, bindings);
    }
````

<br>
You can also format or convert values as part of the automatic binding. You can format phone numbers or convert model's to model descriptions.
In this example the phoneNumber elementBinding defines a converter - a converter is simply a function that takes a direction and a value as inputs and should return a converted value.
The direction will either be ModelToView or ViewToModel.  This allows your model's attributes to remain in a pristine state but the view to format them appropriately.

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
  binder.bind(this.model, this.el, bindings);
````

<br>
In this next example, the view shows a select element which represents a nested model that the outer model refers to.
Here, the converter is leveraging the CollectionConverter - this converts models to ids.
The select element's values are defined with the possible model's ids.  The net result is that the nested model will be whatever the user selected in the view with little effort.

````
  <select name="nestedModel">
    <option value="">Please Select Something</option>
    <% _.each(nestedModelChoices, function (modelChoice) { %>
      <option value="<%= modelChoice.id %>"><%= modelChoice.description %></option>
    <% }); %>
  </select>

  // From inside a View.render() function
  // An example of what might be passed to the template function
  var nestedModelChoices = [{id: 1, description: 'This is One'}, {id: 2, description: 'This is Two'}];

  var binder = new Backbone.ModelBinder();

  var bindings = {phoneNumber: [{selector: '[name=phoneNumber]',
                  converter: new Backbone.ModelBinder.CollectionConverter(nestedModelChoices).convert}]}
  binder.bind(this.model, this.el, bindings);
````

<br>
You can use as many model binders as you want to in a view.
In this example, the personInfoBinder binds appropriate elements to the personModel and the invoiceBinder binds the correct elements to the invoiceNumber.
The next example shows how to make this work in an easier way.

````
 // Snippet from the template file
 <input type="text" name="address"/>
 <input type="text" name="phone"/>
 <input type="text" name="invoiceNumber"/>

 SomeView = Backbone.View.extend({
     initialize: function(){
         this.personInfoBinder = new Backbone.ModelBinder();
         this.invoiceBinder = new Backbone.ModelBinder();
     },
     render: function(){
         this.$el.append(this.template());
         this.personInfoBinder.bind(this.personModel, this.el, {address: '[name=address]', phone: '[name=phone]' });
         this.invoiceBinder.bind(this.invoiceModel, this.el, {invoiceNumber: '[name=invoiceNumber]');
     }
````

<br>
This example is just like the one above but the unique models are scoped with their own <span> tags.
We could have also used <form>, <div> or anything else - as long as only fields belonging to a single model fell under the same root tag.
This example did not define the bindings definition because the element's name attributes are the same as the model attributes and we didn't need to do any formatting.
Also, you can see that there are 2 elements that both have the attribute named 'identifier' - since they have unique scopes this is not an issue.
Person.identifier and Invoice.identifier will be properly bound and there will not be any conflicts.

````
  // Snippet from the template file
  <span id="personFields">
    <input type="text" name="address"/>
    <input type="text" name="identifier"/>
  </span>
  <span id="invoiceFields">
    <input type="text" name="invoiceNumber"/>
    <input type="text" name="identifier"/>
  </span>

  SomeView = Backbone.View.extend({
      initialize: function(){
          this.personInfoBinder = new Backbone.ModelBinder();
          this.invoiceBinder = new Backbone.ModelBinder();
      },
      render: function(){
          this.$el.append(this.template());
          this.personInfoBinder.bind(this.personModel, this.$('#personFields'));
          this.invoiceBinder.bind(this.invoiceModel, this.$('#invoiceFields'));
      }
````

<br>
Model values are copied to the view on when bind() is invoked.


Nothing happens when you instantiate a new ModelBinder.


You can call bind multiple times




# Legal Mumbo Jumbo (MIT License)

Copyright (c) 2012 Bart Wood

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.