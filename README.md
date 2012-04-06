Special thanks to Derick Bailey for providing unit tests and the predecessor to this plugin.

This simple lightweight plugin helps you automatically synchronize your Backbone Views and Models together - when a model changes the view is updated or when the view changes the model is updated.
Your Backbone applications already do this but you usually have to include a lot of boiler plate code to make it happen - this plugin helps you eliminate that boiler plate code.


The core of the plugin is a simple javascript class named the Backbone.ModelBinder that will live inside of your Backbone javascript files - typically a Backbone.View. You probably won't need to modify any of your existing html to use the ModelBinder.

The ModelBinder uses the same jQuery event binding mechanism that Backbone relies on to handle events on Views so it should be pretty easy to understand.

It should simple and flexible enough to handle almost any type of view-model configuration your app requires including
 * Deeply nested models and views
 * Partial view binding (only some elements are bound while others are ignored)
 * Easy formatting and type conversion
 * Binding a Model's attribute to multiple html elements
 * Binding to any html attribute (Color, size, text etc.)
 * Dynamic re-binding when swapping models


<br>
## Typical Boilerplate code for view-model binding (Skip this if your proficient with Backbone)

A Backbone typical app will have code that looks something like this...

````
TypicalView = Backbone.View.extend({
    initialize: function{
        this.model.on('change:address', this._onModelAddressChange, this);
    },
    _onModelAddressChange: function(){
        this.$('#address').val(this.model.get('address'));
    }
````

In the ex. above the view is registering for when the address changes and will update the view appropriately.
In some smaller apps registering for model changes probably isn't necessary but for larger apps where the model can change from other views it's very necessary.

<br>
In most apps the handlers aren't so fine grained - typically if any model attribute changes the whole view is re-rendered as shown below. This could be wasteful for some situations...

````
TypicalView = Backbone.View.extend({
    initialize: function{
        this.model.on('change', this.render, this);
    },
    render: function(){
        // Entire view
    }
````

<br>
More commonly, if a form is updated we need to update our models...

````
TypicalView = Backbone.View.extend({
    events: {
        'change #address', '_onAddressChanged'
    },
    _onAddressChanged: function(){
        this.model.set({address: this.$('#address')});
    }
````

In the example above, we use Backbone's event block to register for when a element with an id="address" changes.
In _onAddressChanged we update the model's address attribute with the new value.
Some applications don't copy values from the View to the Model until the user clicks on a submit button and then perform a simple copy from all field elements to the Model attributes.


<br>
## Simple Example of the ModelBinder

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

In the simple example above, the the bind() function takes a Backbone Model and an html element that will contain all of the view elements to be bound.
Note that the ModelBinder does not care about Backbone Views, although you'll typically create ModelBinders inside of Views.
After calling bind(), the Model's 'address' attribute will be synchronized with the text field with a name='address'.
The bind() function must be called after your html elements exist.
For many simple views that that define a 'name' attribute that matches a Model's attribute name, this technique is sufficient.


<br>
## The Bindings Hash

The ModelBinder.bind() function can take a Bindings Hash as a 3rd parameter.
The Bindings Hash uses a very similar format as the Backbone View events block.
It relies on JQuery selectors to locate which html elements to bind to.
Here is how the previous simple example of the ModelBinder will look like with a Bindings Hash to achieve the same result.

````
// Snippet from the template file
<input type="text" name="address"/>

SomeView = Backbone.View.extend({
    initialize: function(){
        this.modelBinder = new Backbone.ModelBinder();
    },
    render: function(){
        this.$el.append(this.template());
        var bindingsHash = {address: '[name=address]'};
        this.modelBinder.bind(this.model, this.el, bindingsHash);
    }
````

<br>
## Basic Bindings Hash syntax
The Bindings Hash follows this basic structure:

````
    bindingsHash: {

        // Basic syntax
        'modelAttributeName' : 'JQuerySelector',

        // If your binding to an html element with id="attribute"
        'address'            : '#address',

        // If your binding to an html element with name="attribute"
        'phone'            : '[name=phone]'

    }
````

The Binding Hash can take any JQuery selector to locate which html element(s) to bind to - just like the Backbone View events block.

<br>
The bindings definition hash can also define multiple html elements with an array.

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
        var bindingsHash = {address: [ '[name=address]', '[name=pageTitle]' ]};
        this.modelBinder.bind(this.model, this.el, bindingsHash);
    }
````

In the example above, address will be bound to both the input element and the span with the name pageTitle.
The bindings value can be an array of element bindings.

<br><br>
You can also bind to any arbitrary html attribute.

````
// Snippet from the template file
<input type="text" name="address"/>

SomeView = Backbone.View.extend({
    initialize: function(){
        this.modelBinder = new Backbone.ModelBinder();
    },
    render: function(){
        this.$el.append(this.template());
        var bindingsHash = {address: '[name=address]', addressWanted: {selector: '[name=address]',  elAttribute: 'enabled'}};
        this.modelBinder.bind(this.model, this.el, bindingsHash);
    }
````

In the example above, we are binding the Model's attribute addressWanted to the address html element's enabled attribute.


<br><br>
## Bindings Hash syntax - Converters
You can also define Converters with your bindings.
Converters are just functions that allow you to keep your views formatted differently than your Model attributes or perform type conversion.
All previous examples just defined a JQuery selector without explicitly naming it 'selector' but if you pass in multiple options you must specify the selector with a name.

````
  <input name="phoneNumber"/>

  // from inside a View.render() function
  var binder = new Backbone.ModelBinder();

  // This converter function can be defined anywhere, for simplicity it's just defined inline
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

  var bindingsHash = {phoneNumber: [{selector: '[name=phoneNumber]', converter: phoneConverter}]}
  binder.bind(this.model, this.el, bindingsHash);
````

In the example above, the phoneNumber elementBinding defines a Converter. A Converter is simply a function that takes a direction and a value as inputs and should return a converted value.
The direction will either be ModelToView or ViewToModel.  This allows your model's attributes to remain in a pristine state but the view to format them appropriately.


<br><br>
You can also use Converters for more advanced operations like easily selecting a nested Model.

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

  var bindingsHash = {nestedModel: { selector: '[name=nestedModel]',
                                 converter: new Backbone.ModelBinder.CollectionConverter(nestedModelChoices).convert} }
  binder.bind(this.model, this.el, bindingsHash);
````

Here, the converter is leveraging the Backbone.ModelBinder.CollectionConverter - this converts Backbone Models to ids.
The select element's values are defined with the possible model's ids.
The net result is that the nested model will be whatever the user selected in the view with little effort.


<br><br>
## Bindings Hash syntax - Binding to Any Html Attribute with elAttribute

All previous example bound to the text of the html elements but you can also bind to attributes like Color, Enabled, Size etc.

````
// Snippet from the template file
<input type="text" name="address"/>

SomeView = Backbone.View.extend({
    initialize: function(){
        this.modelBinder = new Backbone.ModelBinder();
    },
    render: function(){
        this.$el.append(this.template());
        var bindingsHash = {isAddressEnabled: {selector: '[name=address]',  elAttribute: 'enabled'}};
        this.modelBinder.bind(this.model, this.el, bindings);
    }
````

In the example above, we bound the Model.isAddressEnabled property to the address element's enabled attribute.
You could also extend this to html element colors, sizes, the sky is the limit!


<br><br>
## Exposing the Power of JQuery Selectors, Selecting by Classes etc.
Binding definitions simply use jquery.  You can select based off of a class attribute or anything else you'd like.

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
        var bindingsHash = {isPartOneEnabled: {selector: '[class~=partOne]',  elAttribute: 'enabled'}};
        this.modelBinder.bind(this.model, this.el, bindingsHash);
    }
````

In this example, all 3 html elements enabled attribute are bound to the Model's isPartOneEnabled attribute.
This is because the jquery selector '[class~=partOne]' returned all 3 elements.



<br><br>
## ModelBinder Scoping Rules and Name Conflicts
<br>
The ModelBinder.bind() function takes a root html element as an input parameter.
All bound html elements will need to exist under this root element.
Sometimes you'll have fields that might share the same name on the same page like the field 'identifier' shown below.

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

In this example, each binder takes a different root element that each have an element where name="identifier".
Since the elements are under their own scope there is no conflict.

<br><br>
## Multiple ModelBinders in a Single View
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
Model values are copied to the view on when bind() is invoked. 
In the example below, the address html element will have the value of '1313 Mockingbird Lane' right after the .bind() function is invoked.
View values are not copied to model attributes at bind() time.  The appropriate place to initialize models is with the Backbone Model defaults block.

````
<input type="text" name="address"/>

SomeView = Backbone.View.extend({
    initialize: function(){
        this.modelBinder = new Backbone.ModelBinder();
    },
    render: function(){
        this.$el.append(this.template());
        this.model.set({address: '1313 Mockingbird Lane'});
        this.modelBinder.bind(this.model, this.el);
    }
````

<br>
You can call bind multiple times with different models.  
Calling bind will automatically internally call the model binder unbind() function to unbind the previous model.



<br>
When a view closes you should call the ModelBinder.unbind() function.





# Legal Info (MIT License)

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