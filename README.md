Special thanks to Derick Bailey for providing unit tests and the predecessor to this plugin.

This simple, flexible and powerful plugin helps you automatically synchronize your Backbone Models and Views together.

Your Backbone applications already have to synchronize your Models and Views but you usually have to write a lot of boiler plate code to make it happen. This plugin helps you eliminate most of that boiler plate code.

This plugin is a simple javascript class named the `Backbone.ModelBinder`.  `ModelBinders` are used inside of your Backbone javascript files - typically Backbone Views.

Your html should not require any modification - this style is different than most of the other View-Model binding apis out there such as `Knockout` that require modification to your html.

## Simple but powerful
The `ModelBinder` uses the same jQuery event binding mechanism that Backbone relies on to handle events on Views so it should be pretty easy to understand.

The `ModelBinder` should be flexible enough to handle most situations you'll encounter including:

* Deeply nested Models and Views
* Partial View binding (only some html elements are bound while others are ignored by the binder)
* Easy formatting and type conversion
* Binding a Model's attribute to multiple html elements
* Binding to any html attribute (Color, size, font etc.)
* Dynamic re-binding when swapping Models in a View


## Prerequisites

* Backbone.js v0.9.0
* Underscore.js v1.3.1
* jQuery v1.7.1

<br>
### Some examples can be found here but I'd recomend reading the docs first.
[Examples](https://github.com/theironcook/Backbone.ModelBinder/wiki/Examples)

<br>
## Typical Backbone View-Model boilerplate code
**The `ModelBinder` helps you get rid of most of this type of code**

Backbone applications typically need to update the Views whenever the Models change as shown in the example below. View's usually reference a Backbone Model.

The View will register for when the Model changes and re-render the View.  Typically old DOM elements are just thrown away which could become a performance concern.

The `ModelBinder` will help eliminate this type of potentially wasteful code.

 ````
 TypicalView = Backbone.View.extend({
     initialize: function{
         this.model.on('change', this.render, this);
     },

     render: function(){
         // The entire view is recreated
         $(this.el).html(this.template({model: this.model.toJSON()}));
     }
 });
 ````

<br>
Some Backbone applications will define more fine grained event handlers where they will only update part of the View's elements when the Model's attributes change as shown in the example below.

The View registers for specific Model attribute change events and only update specific DOM elements owned by the View.

The `ModelBinder` helps to eliminate this type of boiler plate code.

````
TypicalView = Backbone.View.extend({
    initialize: function{
        this.model.on('change:address', this._onModelAddressChange, this);
    },

    _onModelAddressChange: function(){
        this.$('#address').val(this.model.get('address'));
    }
});
````


<br>
More commonly, if a View's elements are updated we will need to update our Backbone Models as shown in the example below.

The View registers when one of it's element's changes and will update the corresponding Model attribute.

The View's event block uses standard jQuery selectors to locate which elements to bind to. The `ModelBinder` uses the same jQuery selector syntax.

````
TypicalView = Backbone.View.extend({
    events: {
        'change #address', '_onAddressChanged'
    },

    _onAddressChanged: function(){
        this.model.set({address: this.$('#address')});
    }
});
````

Some applications don't copy values from the View to the Model until the user clicks on a submit button and then perform a copy from all the View's elements to the Model's attributes.


<br>
## Simple Example of the ModelBinder
`ModelBinder` has a no argument constructor and 2 public functions - `bind()` and `unbind()`.
An example of how to use the `ModelBinder` and `bind()` is shown below.

````
// Html snippet used in the template() function below
    <input type="text" name="address"/>


SomeView = Backbone.View.extend({
    initialize: function(){
        this.modelBinder = new Backbone.ModelBinder();
    },

    render: function(){
        $(this.el).html(this.template({model: this.model.toJSON()}));

        this.modelBinder.bind(this.model, this.el);
    }
});
````

In the example above, you can see we've created a new `ModelBinder` and stored it with the View's instance.
We store the modelBinder because when the View closes we will need to call the `unbind()` function.

The `bind()` function takes 2 required parameters and a 3rd optional parameter:

* The Backbone Model your binding to.
* An html `rootElement` that should contain all of the other elements your binding to - probably a form, div or span element.
* A 3rd optional parameter called the `bindingsHash` - this is reviewed in the next section.

The `bind()` function finds all of the child elements under the `rootElement` that have a `name` attribute defined. `bind()` then binds the discovered child elements to Models attributes with the same `name`.

`bind()` needs to be called after you've created your child DOM elements you want to bind to.  The DOM elements don't need to be rendered on a web page.

For many simple views that that have elements with a `name` attribute that matches a Model's attribute name, this technique is sufficient.
Otherwise, you'll need to define the `bindingsHash` discussed in the next section.

Typically `ModelBinders` are defined inside of Views but the `bind()` is performed with html elements. `bind()` is Backbone View agnostic.


<br>
## The bindingsHash

The `ModelBinder.bind()` function can take a `bindingsHash` as a 3rd optional parameter. The `bindingsHash` uses a very similar format as the Backbone View events block.

It relies on jQuery selectors to locate which html elements to bind to. Here is how the previous simple example will look like with a `bindingsHash` to achieve the exact same binding behavior.

````
// Html snippet used in the template() function below
    <input type="text" name="address"/>


SomeView = Backbone.View.extend({
    initialize: function(){
        this.modelBinder = new Backbone.ModelBinder();
    },

    render: function(){
        $(this.el).html(this.template({model: this.model.toJSON()}));

        var bindingsHash = {address: '[name=address]'};

        this.modelBinder.bind(this.model, this.el, bindingsHash);
    }
````

<br>
## Basic Bindings Hash syntax
The `bindingsHash` follows the basic structure shown below.

````
    bindingsHash: {

        // Basic syntax
        'modelAttributeName' : 'jQuerySelector',
    }
````

Hash keys match Backbone Model attribute names.

Hash values can be jQuery selector strings or more advanced options described later.


<br>
Some examples of html elements and bindingHash entries are shown below.  The bindingHashEntries can use any jQuery you would like.

The only hard rule is that the jQuery selector needs to return at least 1 html element.

````
    Html template                                   bindingHash entry
    -----------------------------------------------------------------------------------------------
    <input type="text" id="firstName"/>             firstName: '#firstName'

    <input type="text" name="firstName"/>           firstName: '[name=firstName]'

    <select name="operatorSelectEl">                operator: '[name=operatorSelectEl]'
      <option value="1">Dan</option>
      <option value="2">Eli</option>
      <option value="3">Frank</option>
    </select>

    <input type="radio" name="isOk" value="yes">    isOk: '[name=isOk]'

    <input type="text" class="myTestClass"          myTestAttribute: '[class~=myTestClass]'
        name="address"/>
````


<br>
The `bindingsHash` can also define multiple html selectors with an array as shown below.

````
// Html snippet used in the template() function below
    <span name="pageTitle"/>
    <input type="text" name="address"/>


SomeView = Backbone.View.extend({
    render: function(){
        $(this.el).html(this.template({model: this.model.toJSON()}));

        var bindingsHash = {address: [ '[name=address]', '[name=pageTitle]' ]};

        this.modelBinder.bind(this.model, this.el, bindingsHash);
    }
````

In the example above, the Model's address will be bound to both the input element and the span with the name pageTitle.
Both elements will be updated with the Model's address attribute changes.

<br><br>
## Bindings Hash syntax - Converters
You can also define `Converters` with your bindings.
`Converters` are just functions that allow you to keep your Views formatted differently than your Model attributes or perform type conversion.

All previous examples just defined a jQuery selector without explicitly naming it `'selector'` but if you pass in multiple options in your attribute binding you must specify the `selector`.
The example below shows a `Converter` doing simple phone formatting.

````
// Html snippet used in the template() function below
    <input name="phoneNumber"/>


SomeView = Backbone.View.extend({
    render: function(){
        $(this.el).html(this.template({model: this.model.toJSON()}));

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

A `Converter` is simply a function that takes a `direction` and a `value` as parameters and should return a converted value.
The direction will either be ModelToView or ViewToModel.  This allows your Model's attributes to remain in a pristine state but the view to format them appropriately.


<br><br>
You can also use `Converters` for more advanced operations like easily selecting a nested Model like the example shown below.

````
// Html snippet used in the template() function below
    <select name="nestedModel">
        <option value="">Please Select Something</option>
        <% _.each(nestedModelChoices, function (modelChoice) { %>
          <option value="<%= modelChoice.id %>"><%= modelChoice.description %></option>
        <% }); %>
    </select>


SomeView = Backbone.View.extend({
    render: function(){
        // An example of what might be passed to the template function
        var nestedModelChoices = [{id: 1, description: 'This is One'}, {id: 2, description: 'This is Two'}];

        $(this.el).html(this.template({model: this.model.toJSON(), nestedModelChoices: nestedModelChoices}));

        var binder = new Backbone.ModelBinder();

        var bindingsHash = {nestedModel: { selector: '[name=nestedModel]',
                                         converter: new Backbone.ModelBinder.CollectionConverter(nestedModelChoices).convert} };

        binder.bind(this.model, this.el, bindingsHash);
````

Here, the `Converter` is leveraging the Backbone.ModelBinder.CollectionConverter - this converts Backbone Models to ids.
The select element's values are defined with the possible Model's ids.
The net result is that the nested Model will be whatever the user selected in the view with little effort.

<br><br>
## Converter options
Converter callback functions are passed 4 parameters

* Direction, either ViewToModel or ModelToView
* Value, the current value in the View or the Model
* The Model's attribute name that has changed
* The Model


<br><br>
## Bindings Hash `elAttribute` - binding to any html attribute

Previous examples bound to the text of the html elements but you can also bind to element attributes like Color, Enabled, Size etc as shown in the example below.

````
// Html snippet used in the template() function below
    <input type="text" name="address"/>


SomeView = Backbone.View.extend({
    render: function(){
        $(this.el).html(this.template({model: this.model.toJSON()}));

        var bindingsHash = {isAddressEnabled: {selector: '[name=address]',  elAttribute: 'enabled'}};

        this.modelBinder.bind(this.model, this.el, bindings);
    }
````

In the example above, we bound the Model.isAddressEnabled attribute to the address element's enabled attribute.  When Model.isAddressEnabled is false, the address element will be disabled.
You could also set the elAttribute to class, style, enabled or any other attribute you define.


<br><br>
## Exposing the Power of jQuery Selectors, Selecting by Classes etc.
Binding definitions simply use jQuery.  You can select based off of a class attribute or anything else you'd like as shown in the example below.

````
// Html snippet used in the template() function below
    <input type="text" class="partOne" name="address"/>
    <input type="text" class="partOne" name="phone"/>
    <input type="text" class="partOne" name="fax"/>

SomeView = Backbone.View.extend({
    render: function(){
        $(this.el).html(this.template({model: this.model.toJSON()}));

        var bindingsHash = {isPartOneEnabled: {selector: '[class~=partOne]',  elAttribute: 'enabled'}};

        this.modelBinder.bind(this.model, this.el, bindingsHash);
    }
````

In this example, all 3 html elements enabled attribute are bound to the Model's isPartOneEnabled attribute.
This is because the jQuery selector '[class~=partOne]' returned all 3 elements.



<br><br>
## Using Multiple ModelBinders / Scoping Rules
<br>
Sometimes your View's will render more than 1 Model.  In the example below, the View renders a personModel and an invoiceModel.

We'll need to define 2 separate model binders for each Model we are rendering.

````
// Html snippet used in the template() function below
    <input type="text" name="address"/>
    <input type="text" name="invoiceNumber"/>


SomeView = Backbone.View.extend({
    initialize: function(){
        this.personInfoBinder = new Backbone.ModelBinder();
        this.invoiceBinder = new Backbone.ModelBinder();
    },

    render: function(){
        ...
        this.personInfoBinder.bind(this.personModel, this.el, {address: '[name=address]'});
        this.invoiceBinder.bind(this.invoiceModel, this.el, {address: '[name=invoiceNumber]'});
    }
````

In the example above we explicitly defined the `bindingHash` argument in the `bind` function.
If didn't define the `bindingHash` and just relied on the default no bindingHash behavior the address element would have been bound to the invoiceModel and the invoiceNumber would have been bound to the personModel.

<br>
If you have simple views where no `Converters` or `elAttribute` options are necessary you can avoid defining the `bindingHash` by scoping your different model fields with div or span tags as shown below.

Instead of passing this.el we pass in the root level element containing the models' elements - this.$('#personFields').

````
// Html snippet used in the template() function below
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
        ...
        this.personInfoBinder.bind(this.personModel, this.$('#personFields'));
        this.invoiceBinder.bind(this.invoiceModel, this.$('#invoiceFields'));
    }
````



<br><br>
## Nested Backbone Model's and Views
<br>
In larger more complex applications you'll have nested Backbone Models like the example shown below where a Person Model contains an Address Model.

````
    var personModel = new Backbone.Model({firstName: 'Herman', lastName: 'Munster'});
    var homeAddressModel = new Backbone.Model({street: '1313 Mockingbird Lane', city: 'Mockingbird Heights'});

    personModel.set({homeAddress: homeAddressModel});
````

In the example above, the generic Backbone.Model class was used but you you might have your own Model classes that inherit from Backbone.Model.

Now we'll create a View that lets a user edit the person Model and the person's nested home address Model.

````
// Html snippet used in the template() function below
    <input type="text" name="firstName"/>
    <input type="text" name="lastName"/>

    <input type="text" name="street"/>
    <input type="text" name="city"/>


SomeView = Backbone.View.extend({
    render: function(){
        this.personInfoBinder.bind(this.personModel, this.el, {firstName: '[name=firstName]', lastName: '[name=lastName]'});
        this.addressBinder.bind(this.personModel.get('homeAddress'), this.el, {street: '[name=street]', city: '[name=city]'});
    }
````

In the previous example, the nested View's definition was defined inline with the outer View but that's probably not typical.
In many nested Model/View situations your nested Views will have a separate html template and possibly a separate BackboneView.

In the example below, the nested Address html is defined in a separate file with a separate template but it does not have a separate View.

````
// Address View snippet
    <input type="text" name="street"/>
    <input type="text" name="city"/>

// Person View snippet
    <input type="text" name="firstName"/>
    <input type="text" name="lastName"/>

PersonView = Backbone.View.extend({

    initialize: function(){
        this.addressTemplate = _.template(addressHtmlSnippet);
        this.personTemplate = _.template(personHtmlSnippet);
    },

    render: function(){
        $(this.el).html(this.personTemplate({model: this.personModel.toJSON()}));
        $(this.el).append(this.addressTemplate({model: this.personModel.get('homeAddress').toJSON()}));

        this.personInfoBinder.bind(this.personModel, this.el, {firstName: '[name=firstName]', lastName: '[name=lastName]'});
        this.addressBinder.bind(this.personModel.get('homeAddress'), this.el, {street: '[name=street]', city: '[name=city]'});
    }
````

In most cases with nested models you'll need to define `bindingHash` arguments to ensure that your bindings are properly scoped.

Occasionally you'll be able to scope nested models in their individual `<div>` or `<span>` tags but the safest bet is to just define the `bindingsHash`.


<br><br>
## Model values are copied to Views on `bind()`
<br>
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

<br><br>
## Cleaning up with `unbind()`
<br>
When your View's are closed you should always call the `unbind()` function.  It will unregister from the Model change events and the View jQuery change delegates.

If you don't call `unbind()` you might end up with zombie Views and `ModelBinders` that are not cleaned up.  This is particularly important for large client side applications that are not frequently refreshed.


<br><br>
## Calling `bind()` multiple times with the different Models
<br>
Calling `bind()` will automatically internally call the `ModelBinder.unbind()` function to unbind the previous model.
The last bound Model will be unbound, the new Model will be bound and the new Model's values will be copied to the bound View's elements.


<br><br>
## Why no '.' syntax for nested Models?
It might be nice to be able to facilitate using '.' syntax to reference nested models with the `bindingHash`.
For example, if my personModel has a nested model named homeAddress that has a street attribute it would be great if I could bind using the syntax shown below.

````
PersonView = Backbone.View.extend({
    render: function(){
        this.personInfoBinder.bind(this.personModel, this.el, {homeAddress.street: '[name=street]'});
    }
````

I work on a relatively large project and we haven't had a dramatic need for this yet.

In most situations, our nested Views are duplicated in many other Views so we end up having a separate html template and a separate Backbone View which lends itself very well to having a separate `ModelBinder`.

The other complication is that when you not only change the guts of the nested Model but when you can change which nested Model your referencing it becomes much more difficult to handle.
Right now, we handle this with another ModelBinder and works well but it would hard to shove this functionality into the ModelBinder.

If you feel like having the '.' syntax is critical for nested Models let me know.



<br>
<br>

## Release Notes / Versions

### v 0.1.1

* An empty selector string will now bind to the rootEl

### v 0.1.0

* Initial version starting April 16th.  Future api changes will have updated version numbers.



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