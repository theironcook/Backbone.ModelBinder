Special thanks to [Derick Bailey](http://lostechies.com/derickbailey) for creating predecessor to this plugin.
I've been able to reuse unit tests he created for his [Backbone.ModelBinding](https://github.com/derickbailey/backbone.modelbinding) plugin.


### Rationale
Backbone is a great platform for writing client side applications but I've found that as views grow in complexity, synchronizing my models and views can be a pain.
I've spent the past few months trying to use existing view-model binding libraries that others were kind enough to create and share with the world.
Unfortunately in the majority of my backbone application I wasn't able to leverage the existing view-model binding libraries due to various limitations.

I created a new `Backbone.ModelBinder` class that I have leveraged in the majority of a large client side application.
The ModelBinder class helped me remove a lot of cluttered boilerplate code that existed to synchronize my models and views.
As my application became more asynchronous, the ModelBinder saves me from a lot of pain by automatically displaying model attributes in the view as they are asynchronously loaded.
Hopefully you'll find the ModelBinder useful too.

The `Backbone.ModelBinder` class:

* Is as simple as possible yet still flexible and powerful
* Leverages the exact same jQuery syntax that the Backbone.View event blocks use
* Allows you to define type formatting and type conversion in your bindings
* Provides a simple javascript only solution rather than mixing binding syntax in html templates and javascript files.  I personally find mixing binding logic in my html files to be messy and confusing.

<br>
You can use this ModelBinder class to bind backbone model attributes to:

* Read-only html elements such as `<span>`, `<div>` etc.
* Html element attributes such as enabled, displayed, style etc.
* Editable form elements such as `<input>`, `<textarea>` etc. This type of binding is bidirectional between the html elements and the Model's attributes.

<br>
###The ModelBinder is more efficient###
It seems like many of the backbone view examples I've seen register for the model's change event and then re-render the entire view like the example shown below.

````
SomeView = Backbone.View.extend({
    initialize: function(){
        this.model.on('change', this.render, this);
    },

    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});
````
If the model changes frequently the above type of code will be wasteful because so many DOM elements are just thrown away. Converting the model to json is also an unnecessary conversion.

The ModelBinder eliminates these ineffeciencies by listening for model changes like the above code. But it doesn't recreate the entire set of DOM elements. Instead, it will change the content of existing DOM elements.


<br>
## Prerequisites

* Backbone.js v1.0.0 or higher
* Underscore.js v1.4.4 or higher
* jQuery v1.8.3 or higher


<br>
### Availability
You can download the zip/tarball as normal and include it with your other JS assets, but you can now alternatively link to it on [CDNJS](http://www.cdnjs.com/), the free to use, community maintained CDN.

To do this, just drop a reference to the minified version of the plugin into your document's `<head>` as follows, replacing the version number with whatever the latest one is:
````
<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/backbone.modelbinder/1.0.4/Backbone.ModelBinder.min.js"></script>
````


<br>
##Defining Binding Scope with jQuery##

One of the most powerful capabilities of the ModelBinder class is that it allows you to define scope when you create your bindings using jQuery.

* If your views are simple (no nested Views etc.) you can rely on default scoping rules that are based off of the html `name` attribute.
* If your views are more complex you can explicitly define scoping rules with jQuery selectors. Scoping will allow you to handle nested views or have the ModelBinder only manage parts of your Views and your own custom code can handle the more complicated problems.

Both scoping mechanisms will be discussed throughout the rest of this document.

***

##Basic ModelBinder functionality##

The `ModelBinder` class contains all of the logic to facilitate bi-directional view-model binding.

The ModelBinder class exposes 3 public functions shown below:

```javascript
// no arguments passed to the constructor
constructor();

// model is required, it is the backbone Model you're binding to
// rootEl is required, is the root html element containing the elements you want to bind to
// bindings is optional, it's discussed a bit later
// options, discussed at the bottom of the document
bind(model, rootEl, bindings, options);

// unbinds the Model with the elements found under rootEl - defined when calling bind()
unbind();
```

<br>
The `bind()` function's 3rd argument `bindings` is optional.  The `bindings` arg is useful for defining binding scope and formatting and will be discussed later.
If `bindings` is not defined, then `bind()` will locate all of the child elements under the rootEl that define a `name` attribute.
Each of the elements with a `name` attribute will be bound to the model's attributes - the value of the element's name attribute will be used as the model's attribute name.

In the example below, the model's address attribute will be bound to the input text field with the name of 'address'.  This binding is bi-directional between the view and the model.

````
<!-- The html -->
<input type="text" name="address"/>
````

````
<!-- The javascript -->
SomeView = Backbone.View.extend({
    render: function(){
        this.modelBinder.bind(this.model, this.el);
    }
});
````

<br>
## Binding after elements created, rootEl ##

The bind() functions `rootEl` parameter should contain all of the elements that you want to bind to.
Your rootEl might be the view.el property or it could be any valid html element.  It does not matter if the rootEl is displayed in a browser.

The example below shows how the rootEl argument is the result of the jQuery selection "#outerDiv".  This will work just like the previous example.

````
<!-- The html -->
<div id="outerDiv">
    <input type="text" name="address"/>
</div>
````

````
<!-- The javascript -->
SomeView = Backbone.View.extend({
    render: function(){
        this.modelBinder.bind(this.model, this.$('#outerDiv'));
    }
});
````

<br>
## Elements are recursively bound ##

If you do not pass the `bindings` 3rd parameter to the bind() function, <b>all</b> child elements under the rootEl with a "name" attribute are bound.
This includes any nested child elements that define the "name" attribute.

In the example below, the "address" and the "city" elements will be bound to the model.

````
<!-- The html -->
<div id="outerDiv">
    <input type="text" name="address"/>
        <div id="divTwo">
            <input type="text" name="city"/>
        </div>
</div>
````

````
<!-- The javascript -->
SomeView = Backbone.View.extend({
    render: function(){
        this.modelBinder.bind(this.model, this.el);
    }
});
````


<br>
## Binding multiple html elements to the same model attribute ##

In the example below, the `<span>` and the `<input>` elements are both bound to the model.firstName attribute.
If you modified the firstName input element you would see the span automatically updated because the Model would have been updated.

````
<!-- The html -->
Welcome, <span name="firstName"></span>

Edit your information:
<input type="text" name="firstName"/>
````

````
<!-- The javascript -->
SomeView = Backbone.View.extend({
    render: function(){
        this.modelBinder.bind(this.model, this.el);
    }
});
````

<br>
If your View element definitions are simple you can rely on having properly defined "name" attributes in your html elements that match your Model attribute names.
Remember that **all** of the rootEl's child elements (recursive) with a "name" attribute will be bound to your Model.

If your views require formatting, conversion or more scoping due to nested or complex views you'll need to define a `bindings` parameter to the `bind()` function as discussed in the next section.


***

##The bindings parameter to the bind() function##

For more complicated things like formatting or defining scope for composite or nested Views you'll need to define a `bindings` parameter - the optional 3rd parameter to the `bind()` function.
The bindings parameter is a javascript hash object.

The bindings hash keys are the model's attribute names and the values, in the simplest case, are jQuery selectors that must return at least 1 html element.

The example below binds model.address to the element with the id="address":

````
<input type='text' id='address'/>

var bindings = {address: '#address'};
modelBinder.bind(this.model, this.el, bindings);
````

The example below binds model.homeAddress to the element with name="homeAddress" and model.workAddress to the element with name="workAddress":

````
<input type="text" name="homeAddress"/>
<input type="text" name="workAddress "/>

var bindings = {homeAddress: '[name=homeAddress]', workAddress : '[name=workAddress ]'};
modelBinder.bind(this.model, this.el, bindings);
````

The example below binds model.city to `<input type="text" id="city"/>`:

````
var bindings = {city: '#city'};
modelBinder.bind(this.model, this.el, bindings);
````

You can use any jQuery selector that you like, as long as the selector returns at least a single element.
In the example below, both the `<span>` and the `<input>` elements are bound to the model.firstName attribute.
In this situation, you could also eliminate the bindings and get the same behavior.

````
<!-- The html -->
Welcome, <span name="firstName"></span>

Edit your information:
<input type="text" name="firstName"/>
````

````
<!-- The javascript -->
var bindings = {firstName: '[name=firstName]'};
modelBinder.bind(this.model, this.el, bindings);
````

<br>
Here are a few more examples of the bindings hash syntax.

````
    Html                                            bindings entry
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
## You can define multiple jQuery selectors ##

The binding entries can be defined as strings as shown in all previous examples but internally the string is converted to the type of entry shown below.

````
 firstName: {selector: '#firstName'}
````

The jQuery string is a hash parameter named `selector`.
You can define arrays of `selector` arguments in your bindings as shown in the example below.

````
 firstName: [{selector: '#firstName'}, {selector: '#title'}]
````

In the example above, model.firstName is bound to an element with the id of "firstName" and an element with the id of "title".
To define multiple selectors, just define them as an array.

The jQuery bindings leverage the jQuery delegate mechanism - which means they should be fairly efficient.

##Binding to the Root Element##

Sometimes, in rare cases, your views are so simple that you just want to bind
to the root element itself. For example, if your view is an `<li>` tag, it
makes sense to have the inner HTML simply be the appropriate model value.

In those cases, simply use an empty string as your selector:

````
 firstName: { selector: '' }
````

<br>
***

##Formatting and converting values##

The bindings can also define a `converter` parameter.
A converter is simply a function that is called whenever a model's attribute is copied to an html element or when an html elements value is copied into a model's attribute.

Converters help you format values in your views but help keep them clean in your models.

A simple of example of using a converter to format a phone number is shown below.

````
var phoneConverter = function(direction, value){
  // direction is either ModelToView or ViewToModel
  // Return either a formatted value for the view or an un-formatted value for the model
};

var bindings = {phoneNumber: {selector: '[name=phoneNumber]', converter: phoneConverter}}
modelBinder.bind(this.model, this.el, bindings );
````

<br>
A converter function is passed 4 parameters.

* direction - either ModelToView or ViewToModel
* value - the model's attribute value or the view element's value
* attribute Name
* model - this is more useful when you're dealing with calculated attributes
* els - an array of the els that were bound to the converter

If your binding to a read-only element like a `<div>` you'll just ignore the direction parameter - it's always ModelToView.
In most cases, you'll be able to ignore the attribute name and model parameters but they can be helpful in some situations discussed later.

The Model parameter can be quite helpful in complicated situations.
The els array allows a developer to manually modify the els directly when a converter is invoked.
Be very careful when accessing the els directly because any state you set into the els might be overwritten by the ModelBinder after the converter is finished.
For example, if a converter is called with the direction 'ModelToView' and inside the converter the code updates the el values directly those values will be overwritten with the value returned from the converter function.
The els array is more valuable if you need to set other properties etc. on the els.  In most situations you should not need the els parameter.


<br>
Converters can be used for simple formatting operations like phone numbers but they can also be used for more advanced situations like when you want to convert between a model and some description of the model.
You might want to display a list of models in a `<select>` element - a converter could allow you to convert between a model and a model's id making this type of binding easy to do.

The example below shows how this could work.  The `CollectionConverter` shown is defined in the ModelBinder.js file.

````
<!-- The html -->
    <select name="nestedModel">
        <option value="">Please Select Something</option>
        <% _.each(nestedModelChoices, function (modelChoice) { %>
          <option value="<%= modelChoice.id %>"><%= modelChoice.description %></option>
        <% }); %>
    </select>
````

````
<!-- The javascript -->
SomeView = Backbone.View.extend({
    render: function(){
        // An example of what might be passed to the template function
        var nestedModelChoices = [{id: 1, description: 'This is One'}, {id: 2, description: 'This is Two'}];

        $(this.el).html(this.template({nestedModelChoices: nestedModelChoices}));

        var binder = new Backbone.ModelBinder();

        var bindingsHash = {nestedModel: { selector: '[name=nestedModel]',
                                           converter: new Backbone.ModelBinder.CollectionConverter(nestedModelChoices).convert} };

        binder.bind(this.model, this.el, bindingsHash);
````

<br>
## Converters can display calculated attributes ##

Sometimes your models will have computed attributes.
You could cache computed values inside a model's attribute collection and it would be bound like any other attribute.
I favor this solution but it's not perfect because when you save models back to the server, the calculated attributes are sent.

If your model's computed attribute is calculated via a function we can use a converter for the binding.
In the example below, we have a simple computed attribute named hoursLeft calculated by the function calculateHoursLeft().

````
SomeModel = Backbone.Model.extend({
    defaults: {currentHours: 3, totalHours: 8},

    calculateHoursLeft: function(){
        return this.get('totalHours') - this.get('currentHours');
    }
})

// Here is how how we could create a binding for a calculated attribute
var bindings = {currentHours: {selector: '[name=hoursLeft]', converter: this.model.calculateHoursLeft}};
modelBinder.bind(this.model, this.el, bindings);
````

In the example above, we are binding to the model's attribute 'currentHours' because when currentHours changes the hoursLeft calculated value will change - the converter will be invoked at that time.
The converter is simply the model's calculateHoursLeft() function. The function just ignores the parameters passed to it and calculates the hours left.

<br>
If the currentHours attribute is also bound to another html element you could specify an array of element bindings in the binding definition like the example shown below.

````
var bindings = {currentHours: [ {selector: '[name=hoursLeft]', converter: this.model.calculateHoursLeft},
                                {selector: '[name=currentHours]']};
modelBinder.bind(this.model, this.el, bindings);
````

If converters need any other special logic they can be defined in another function outside of the Model because the converter function is passed the Model as a parameter.



<br>

***

##Binding to html element attributes##

You can also define bindings to be bound to any html element's attribute like enabled, class, style or any other attribute you define.
The example below shows how to use the `elAttribute` option.  In this example, the address element will be enabled depending on what the Model.isAddressEnabled attribute is.

````
var bindings = {isAddressEnabled: {selector: '[name=address]',  elAttribute: 'enabled'}};
modelBinder.bind(this.model, this.el, bindings);
````

<br>
You could also extend the example above to be a bit more complicated.  Let's pretend the Model has an attribute called customerType and if customerType == 'residential' we want the address to enabled, otherwise we want it disabled.  We can handle this type of binding by leveraging both `converter` and `elAttribute`.  The example below shows how this would work.  When the Model.customerType is updated, the address input element's enabled attribute would be updated.

````
var addressEnabledConverter = function(direction, value) { return value === 'residential'; };

var bindings = {customerType: {selector: '[name=address]',  elAttribute: 'enabled', converter: addressEnabledConverter}};
modelBinder.bind(this.model, this.el, bindings);
````

<br>
You could also bind to an element's class property as shown in the example below.

````
<!-- The html -->
<div id="patientPic" class="patientPic"></div>
````

````
<!-- The javascript -->
var bindings = {gender: {selector: '#patientPicture',  elAttribute: 'class'}};
modelBinder.bind(this.model, this.el, bindings);
````

In this example, the model.gender value is either "M" or "F".  The CSS files define styles for "patientPic" with either "M" or "F" to show the correct type of avatar.


<br>

***

##Proper scope helps you bind to complex nested views##

Sometimes you'll have nested models displayed in nested views.
An example of a nested backbone model is shown below.  The personModel has a nested homeAddressModel.

````
var personModel = new Backbone.Model({firstName: 'Herman', lastName: 'Munster'});
var homeAddressModel = new Backbone.Model({street: '1313 Mockingbird Lane', city: 'Mockingbird Heights'});

personModel.set({homeAddress: homeAddressModel});
````

In the example above, the nested model is also a backbone.Model but sometimes your nested models are raw javascript objects.  I'll talk about that situation a bit later.

You can bind to this type of nested backbone model fairly easily with the ModelBinder.

There are 2 basic ways to bind nested Models in a View:

1. With a scoped `rootEl` that only contains html elements specific to the nested Model.
2. With scoped bindings selectors in the bindings hash.

<br>
##Nested View option 1: A scoped `rootEl`##

If your nested view can be defined under a single parent element such as a `<div>` you can pass that parent element as the `rootEl` for your nested ModelBinder as shown in the example below.
It refers to the personModel and homeAddressModels defined in a previous code snippet.

````
<!-- html -->
<div id="personFields">
  <input type="text" name="firstName"/>
  <input type="text" name="lastName"/>
</div>
<div id="homeAddressFields">
  <input type="text" name="street"/>
  <input type="text" name="city"/>
</div>
````

````
<!-- javascript -->
personBinder.bind(this.personModel, this.$('#personFields'));
addressBinder.bind(this.personModel.get('homeAddress'), this.$('#homeAddressFields'));
````

In the example above, the nested homeAddressModel is bound to the correct fields because they are scoped by a single parent element.
The personModel bindings also needed to be separately scoped as well.

If the personModel fields were defined on a level that also included the homeAddressFields then the homeAddressFields would have appeared in the personModel.
The next option shows how to avoid that situation.

<br>
##Nested View option 2: scoped bindings##

If your parent and nested Model html elements cannot live under their own parent elements then you'll need to define the `bindings` with jQuery selectors that are properly scoped as shown in the example below.

````
<!-- Html -->
<input type="text" name="firstName"/>
<input type="text" name="lastName"/>
<input type="text" name="street"/>
<input type="text" name="city"/>
````

````
<!-- javascript -->
var personBindings = {firstName: '[name=firstName]', lastName: '[name=lastName]'};
personBinder.bind(this.personModel, this.el, personBindings);

var addressBindings = {street: '[name=street]', city: '[name=city]'};
addressBinder.bind(this.personModel.get('homeAddress'), this.el, addressBindings);
````


<br>

***

##The ModelBinder can be a partial solution##

In some situations, you might have very complex views where you only want some of your view's elements bound by the ModelBinder.
To limit the scope of which fields are bound, you just need to properly scope your bindings hash.

In the example below, the modelBinder will ignore the "phone" and "fax" elements.

````
<!-- Html -->
<input type="text" name="firstName"/>
<input type="text" name="lastName"/>
<input type="text" name="phone"/>
<input type="text" name="fax"/>
````

````
<!-- javascript -->
var personBindings = {firstName: '[name=firstName]', lastName: '[name=lastName]'};
modelBinder.bind(this.personModel, this.el, personBindings);
````


<br>

***

##Quickly create and modify bindings##

In some situations, you might have a large amount of elements that need to be bound but only a few of them need a converter or elAttribute defined.
You probably don't want to define all of the element bindings manually just to add a converter to a few of them.
The utility function Backbone.ModelBinder.createDefaultBindings can help you in this situation.

The Backbone.ModelBinder.createDefaultBindings( ) is shown below.

````
// A static helper function to create a default set of bindings that you can customize before calling the bind() function
// rootEl - where to find all of the bound elements
// attributeType - probably 'name' or 'id' in most cases
// converter(optional) - the default converter you want applied to all your bindings
// elAttribute(optional) - the default elAttribute you want applied to all your bindings
Backbone.ModelBinder.createDefaultBindings = function(rootEl, attributeType, converter, elAttribute){
    ...
}
````

You can use this function to gather all of the elements under the rootEl with a "name" or "id" attribute and quickly create all of the bindings and then modify those bindings.
You might want to delete one or more of the bindings, add converters or elAttributes to bindings etc.
Be careful when you use this with radio buttons - you might not get the proper selectors if you're not careful.

An example of how you might use createDefaultBindings( ) is shown below.

````
// The view has several form element with a name attribute that should be bound
// but one binding requires a converter and one of the bindings should be removed
var bindings = Backbone.ModelBinder.createDefaultBindings(this.el, 'name');
bindings['phone'].converter = this._phoneConverterFunction;
delete bindings['complicatedAttribute'];

this._modelBinder.bind(this.model, this.el, bindings);
````

###Change attribute used for binding###

By default, the `name` attribute of your elements is used to create bindings.  Changing this can be accomplished easily in one of two ways.  First, by using `createDefaultBindings`:

````
var bindings = Backbone.ModelBinder.createDefaultBindings(this.el, 'data-custom');
this._modelBinder.bind(this.model, this.el, bindings);
````

Alternatively, setting `boundAttribute` on the options hash given to bind can point it at any attribute.

````
// Set the default bindings based on the data-custom attribute rather than name.
this._modelBinder.bind(this.model, this.el, null, { boundAttribute: 'data-custom' });
````

<br>

***

<br>

## The Power of jQuery ##
Your jQuery selectors can be based off of a class attribute or anything else you'd like as shown in the example below.

````
<!-- html -->
    <input type="text" class="partOne" name="address"/>
    <input type="text" class="partOne" name="phone"/>
    <input type="text" class="partOne" name="fax"/>
````

````
<!-- javascript -->
SomeView = Backbone.View.extend({
    render: function(){
        $(this.el).html(this.template({model: this.model.toJSON()}));

        var bindingsHash = {isPartOneEnabled: {selector: '[class~=partOne]',  elAttribute: 'enabled'}};

        this.modelBinder.bind(this.model, this.el, bindingsHash);
    }
````

In this example, all 3 html elements enabled attribute are bound to the Model's isPartOneEnabled attribute.
This is because the jQuery selector '[class~=partOne]' returned all 3 elements.


<br>

***

## Calling bind() multiple times ##

Calling ModelBinder.bind() will automatically internally call the unbind() function to unbind the previous model.
You can reuse the same ModelBinder instance with multiple models or even rootEls - just be aware that all previous bindings will be removed.

<br>
## Model values are copied to views when bind() is called ##

The model's attributes are bound are copied from the model to bound elements when the bind() function is called.
View element default values are not copied to the model when bind() is called. That type of behavior usually belongs in the Backbone.Model defaults block.

If you do need to have values copied from the view to the model when bind() is called I would first question why.
In most situations, especially for single page web apps, it's almost always better to let your models drive the behavior of the app instead of the views.
If you need this behavior, you can use the 4th optional parameter to the bind() function. {initialCopyDirection: Backbone.ModelBinder.Constants.ViewToModel}
You can also specify this behavior as the default for all ModelBinder's by calling Backbone.ModelBinder.SetOptions({initialCopyDirection: Backbone.ModelBinder.Constants.ViewToModel});

You can also directly invoke the function modelBinder.copyViewValuesToModel() at any time to copy values from the view into the model.  In most cases, this is not necessary.

When you copy explicitly from the view to the model on bind() or via copyViewValuesToModel() text values and checkboxes will be inserted into the model as blank strings or false if the values have not been set.


<br>
## Cleaning up with unbind() ##

When your views are closed you should always call the unbind() function.  The unbind() function will un-register from the model's change events and the view's jQuery change delegate.

If you don't call unbind() you might end up with zombie views and ModelBinders.  This is particularly important for large client side applications that are not frequently refreshed.



<br>
## The '.' syntax for nested models ##

The ModelBinder doesn't directly support '.' to reference nested Models when binding.
If you have a Backbone.Model implementation that is able to support the '.' syntax for nested models you'll be able to use the ModelBinder.

I've done a bit of testing with the [backbone-deep-model](https://github.com/powmedia/backbone-deep-model) and it seems to work well with the ModelBinder.
[Here](https://github.com/theironcook/Backbone.ModelBinder/blob/master/sandbox/Example_NestedAttributes.html) is a simple example showing how to use backbone-deep-model with the ModelBinder.

The nested models are just plain javascript objects with the deep-model plugin.  If your nested objects are Backbone.Models you'll need something similar to the deep-model plugin.

<br>
The [backbone-nested](https://github.com/afeld/backbone-nested) project also seems to work with the ModelBinder.


***

<br>
## AMD / Require.js support

AMD / Require.js support was added in version 0.1.4


***

<br>
### Binding to Collections
I've also created a collection binder that automatically creates/removes views when models are added/removed to a collection.
It can be used with the ModelBinder.  The collection binder has saved me just as much time as the model binder.  It's a very handy utility.

You can read about it [here](https://github.com/theironcook/Backbone.ModelBinder/wiki/A-new-Class-to-Bind-Backbone-Collections-to-Views:-Javascript-Weekly-May-18th)

<br><br>

## Examples
Some JSFiddle examples can be found [here](https://github.com/theironcook/Backbone.ModelBinder/wiki/Interactive-JSFiddle-Examples).
<br>The same examples are also under the (examples)[https://github.com/theironcook/Backbone.ModelBinder/tree/master/examples] directory.


<br><br>

## Configuration Options
* initialCopyDirection
* changeTriggers
* modelSetOptions
* suppressThrows
* boundAttribute
* converter

Configuration options can either be set for all ModelBinder instances via Backbone.ModelBinder.SetOptions() or for individual ModelBinder instances via the 4th parameter to the bind() function.
Values set at the instance level will eclipse / override values that are set with the SetOptions() function.

* initialCopyDirection - can either be Backbone.ModelBinder.Constants.ModelToView or Backbone.ModelBinder.Constants.ViewToModel.  This property is dicussed in a previous section

* changeTriggers - an object where the keys are jQuery selectors and the values are jQuery events.  These are the events that trigger when values are copied from the view into the model.
The default for change triggers is added below.  You can define your own if needed.

````
{'': 'change', '[contenteditable]': 'blur'}
````

* modelSetOptions - this is an option that you might want sent by default to the Model.set function.
Whenever a bound element changes, it will call the Model.set function as pass the modelSetOptions as the options to the set() function.
If you wanted to turn on backbone model validation for your entire project you might do something like this.

````
Backbone.ModelBinder.SetOptions({modelSetOptions: {validate: true}});
````

The ModelBinder injects this value into the set options for every set() function.
changeSource = 'ModelBinder'
This allows custom logic to determine if the source of the model attribute change is from the ModelBinder.

* suppressThrows - set to true if you don't want the ModelBinder to throw exceptions but instead it will show errors via the console.error

* boundAttribute - change the default attribute used to create bindings.  Default value is "name," but can be set to any valid attribute selector that fits the form `$('[' + boundAttribute + ']')`.

* converter - a default converter for all binders or a single binder.  Probably only really useful for when you want view empty strings to map to nulls or undefined. The default is empty string.
If you define a converter, you might want to pay attention to the converter's 5th parameter of bound els.  You might want to only convert values for specific element types.

<br>
<br>

## Release Notes / Versions
### v 1.1.0 June 1, 2015
* Fixed createEl code not to require that Backbone.View#render returns this
* Don't sort elements on add event (only do so on sort)
* Fixed package.json to make NPM publishing possible (fixes #195)
* Use jQuery .on instead of .delegate for event binding (to move off of deprecated .delegate function)
* Use .prop("checked") instead of .attr("checked") (fixes #199)
* Fixed autoSort behavior to actually work when the collection changes

### v 1.0.6 November 5, 2014
* Made the CollectionBinder loadable via AMD

### v 1.0.5 September 30, 2013
* Fixed issue 164 - Works with jQuery.noConflict
* Added the ability to set static and instance options for the CollectionBinder.  As of now, there is only one option: 'autoSort'.  You can set the option globally via Backbone.CollectionBinder.SetOptions.
* Added the ability to use template functions with the CollectionBinder.ElManagerFactory.  Normally, I wouldn't use the ElManagerFactory except for very simple situations - especially because the content of the data isn't updated.
If you would like to use this option, simply pass a compiled _.template instead of html to the ElManagerFactory constructor. Internally the ElManagerFactory will call the template and pass {model: this._model.toJSON()} to the template function.
* Fix for issue 162.  Undid fix for 133.  Unnecessary Model.set calls for checkboxes and radio buttons.

### v 1.0.4 August 19, 2013
* Fixed the _.bindAll function calls to specify the function names being bound to.
* Added the ability to add a global converter via Backbone.ModelBinder.SetOptions({converter: xxx});

### v 1.0.2 April 18, 2013
* Fixed the _unbindViewToModel to use the changeTrigger options
* Fixed the default jQuery selector for all elements to be '*' instead of ''.  The undelegate events no longer works in jQuery 1.8.3 with the ''

### v 1.0.1 April 15, 2013
* Added suppressThrows configuration option

### v 1.0.0 April 11, 2013
* Updated to use backbone v1.0.0, underscore v1.4.4 and jQuery v1.8.3
* Pull requests 96, 67, 85, 80, 78, 67, 66
* Options are now configurable at the ModelBinder class level via Backbone.ModelBinder.SetOptions() or at the instance level via the bind() 4th parameter
* ModelSetOptions have now been incorporated to the generic options argument at the class or instance level.
  For example: to set model options globally for all binders Backbone.ModelBinder.SetOptions({modelSetOptions: {validate: true}});
  or for a single instance modelBinder.bind(this.model, this.el, bindings, {modelSetOptions: {validate: true}});
  For single instance options, the bindings can be a fully configured set of bindings or the value of null if you want the default bindings.
* bindCustomTriggers() has now been incorporated to the generic options argument at the class or instance level.
  For example: to set custom triggers options globally for all binders Backbone.ModelBinder.SetOptions({changeTriggers: {'': 'change keyup'}});
  or for a single instance modelBinder.bind(this.model, this.el, {changeTriggers: {'': 'change keyup'}});
* Added the els parameter to the converter functions
* Added the changeTriggers to customize which view events trigger the model binder copies values from the view to the model
* Added the modelSetOptions to allow the ModelBinder to send messages to the Model.set function and corresponding callbacks


### v 0.1.6 August 27, 2012

* Bugfix for issue 51


### v 0.1.5 June 20, 2012

* Upgraded model binder to allow single DOM element to be bound to multiple model attributes
* Exposed the model binder copyModelAttributesToView to be public and take an optional array of attribute names to copy

### v 0.1.4 May 11, 2012

* AMD / Require.js support added
* Initial version of the CollectionViewBinder added

### v 0.1.3 May 9, 2012

* Started properly tagging my versions :)

### v 0.1.2

* Added the {source: 'ModelBinder'} option to the model.set call - allows you to know the source of a model's change event
* Bug fix - when binding the elAttribute to class I wasn't going through the converter function

### v 0.1.1

* An empty selector string will now bind to the rootEl
* Removed elementBinding.isSetting guard which was unnecessary and short circuited updating multiple bound elements with the same name

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
