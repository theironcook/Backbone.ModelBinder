AModel = Backbone.Model.extend({});

AView = Backbone.View.extend({
    render:function () {
        var html = $("\
      <div id='eventDiv' data-bind='text event:foo' />\
      <img id='avatar' data-bind='src url; class name'>\
      <input id='noType'>\
      <div id='showHideThing' data-bind='displayed isValid' />\
      <div id='showHideAnotherThing' data-bind='hidden isValid' />\
      <button id='unclicker' data-bind='disabled isValid'>Click Me!</button>\
      <button id='clicker' data-bind='enabled isValid'>Click Me!</button>\
      <div id='villain' data-bind='html villain'><p>test</p></div>\
      <div id='doctor_no_elem' data-bind='doctor'>Seuss</div>\
      <div id='doctor_data_bind_bb' data-bind-bb='doctor'>Seuss</div>\
      <div id='doctor' data-bind='text doctor'>Seuss</div>\
      <div id='pet' data-bind='someAttr pet' someAttr='Cat'></div>\
      <input type='text' id='super_hero_weakness' modelAttr='weakness'>\
      <input type='text' id='something'> \
      <div id='showIt'></div>\
      <input type='text' id='prefilled_name' value='a name'>\
      <input type='text' id='name'>\
      <select id='operating_system'> \
        <option value='osx'>osx</option> \
        <option value='windows'>windows</option> \
        <option value='linux'>linux</option> \
      </select> \
      <select id='education'> \
        <option value='none'>none</option> \
        <option value='grade_school'>i dun learned at grade skool</option> \
        <option value='high school'>high school</option> \
        <option value='college'>college</option> \
        <option value='graduate'>graduate</option> \
      </select> \
      <select id='age_level'> \
        <option value=''>-- select --</option> \
        <option value='0'>under 20</option> \
        <option value='21'>21 - 40</option> \
        <option value='41'>over 41</option> \
      </select> \
      <select id='another_select'> \
        <option value='pre_selected' selected='selected'>pre selected</option> \
        <option value='not_selected'>not selected</option> \
      </select> \
      <input type='radio' id='graduated_yes' name='graduated' value='yes'>\
      <input type='radio' id='graduated_no' name='graduated' value='no'>\
      <input type='radio' id='graduated_maybe' name='graduated' value='maybe'>\
      <input type='radio' id='us_citizen_true' name='us_citizen' value='true'>\
      <input type='radio' id='us_citizen_false' name='us_citizen' value='false'>\
      <input type='radio' id='another_radio_true' name='another_radio' value='true' checked='checked'>\
      <input type='radio' id='another_radio_false' name='another_radio' value='false'>\
      <input type='checkbox' id='drivers_license' value='yes'>\
      <input type='checkbox' id='motorcycle_license' value='yes' checked='checked'>\
      <input type='checkbox' id='binary_checkbox' value='yes'>\
      <textarea id='bio'></textarea>\
      <p id='aParagraph'></p>\
      <input type='password' id='password'>\
      <input type='number' id='number'>\
      <input type='range' id='range' min='0' max='98765'>\
      <input type='email' id='email'>\
      <input type='url' id='url'>\
      <input type='tel' id='tel'>\
      <input type='search' id='search'>\
      <div contenteditable name='paragraph1'>\
      ");
        this.$el.append(html);
        this.binder = new Backbone.ModelBinder();

        var bindings = this.options.bindings;
        if (!bindings) {
            bindings = {
                super_hero_weakness:'#super_hero_weakness',
                drivers_license:'#drivers_license',
                motorcycle_license:'#motorcycle_license',
                binary_checkbox:'#binary_checkbox',
                number:'#number',
                range:'#range',
                tel:'#tel',
                search:'#search',
                url:'#url',
                email:'#email',
                name:'#name',
                bio:'#bio',
                password:'#password',
                education:'#education',
                graduated:'[name=graduated]',
                us_citizen:'[name=us_citizen]',
                age_level:'#age_level',
                operating_system:'#operating_system',
                noType:'#noType',
                paragraph1:'[name=paragraph1]'
            }
        }
        ;
        this.binder.bind(this.model, this.$el, bindings);
    }
});

AllBindingAttributesView = Backbone.View.extend({
    render:function () {
        var html = $("\
          <input type='text' id='v_name' class='name'> \
          <select id='v_education' class='education'> \
            <option value='none'>none</option> \
            <option value='grade_school'>i dun learned at grade skool</option> \
            <option value='high school'>high school</option> \
            <option value='college'>college</option> \
            <option value='graduate'>graduate</option> \
          </select> \
          <input type='radio' id='graduated_yes' name='graduated' class='graduated' value='yes'>\
          <input type='radio' id='graduated_no' name='graduated' class='graduated' value='no'>\
          <input type='radio' id='graduated_maybe' name='graduated' class='graduated' value='maybe'>\
          <input type='checkbox' id='v_drivers_license' class='drivers_license' value='yes'>\
          <textarea id='v_bio' class='bio'></textarea>\
        ");
        this.$el.append(html);

        var binder = new Backbone.ModelBinder();
        var bindings = {
            name:'[class=name]',
            bio:'[class=bio]',
            graduated:'[class=graduated]',
            education:'[class=education]',
            drivers_license:'[class=drivers_license]'
        };
        binder.bind(this.model, this.$el, bindings);
    }
});

GlobalAllBindingAttributesView = Backbone.View.extend({
    render:function () {
        var html = $("\
          <input type='text' id='v_name' class='name'> \
          <select id='v_education' class='education'> \
            <option value='none'>none</option> \
            <option value='grade_school'>i dun learned at grade skool</option> \
            <option value='high school'>high school</option> \
            <option value='college'>college</option> \
            <option value='graduate'>graduate</option> \
          </select> \
          <input type='radio' id='graduated_yes' name='graduated' class='graduated' value='yes'>\
          <input type='radio' id='graduated_no' name='graduated' class='graduated' value='no'>\
          <input type='radio' id='graduated_maybe' name='graduated' class='graduated' value='maybe'>\
          <input type='checkbox' id='v_drivers_license' class='drivers_license' value='yes'>\
          <textarea id='v_bio' class='bio'></textarea>\
        ");
        this.$el.append(html);

        var binder = new Backbone.ModelBinder();
        var bindings = {
            name:'[class=name]',
            bio:'[class=bio]',
            graduated:'[class=graduated]',
            education:'[class=education]',
            drivers_license:'[class=drivers_license]'
        };
        binder.bind(this.model, this.$el, bindings);
    }
});

SelectorBindingView = Backbone.View.extend({
    render:function () {
        var html = $("\
          <textarea id='comment'></textarea>\
        ");
        this.$el.append(html);

        var binder = new Backbone.ModelBinder();
        var bindings = {
            type: {
				selector: '',
				elAttribute: 'data-type'
			},
            comment: '#comment'
        };
        binder.bind(this.model, this.$el, bindings);
    }
});

CssBindingView = Backbone.View.extend({
    render:function () {
        var binder = new Backbone.ModelBinder();
        var bindings = {
            number: {
                selector: '',
                elAttribute: 'css',
                cssAttribute: 'width',
                converter: function(dir,val){return val + "px";}
            },
            color:{
                selector: '',
                elAttribute: 'css',
                cssAttribute: 'background-color'
            }
        };
        binder.bind(this.model, this.$el, bindings);
    }
});

AnotherView = Backbone.View.extend({
    render:function () {
        var html = $("\
          <input type='text' class='super_power' modelAttr='weakness'>\
          <select class='education'> \
            <option value='none'>none</option> \
            <option value='grade_school'>i dun learned at grade skool</option> \
            <option value='high school'>high school</option> \
            <option value='college'>college</option> \
            <option value='graduate'>graduate</option> \
          </select> \
          <input type='radio' id='graduated_yes' class='graduated' value='yes'>\
          <input type='radio' id='graduated_no' class='graduated' value='no'>\
          <input type='radio' id='graduated_maybe' class='graduated' value='maybe'>\
          <input type='checkbox' class='drivers_license' value='yes'>\
        ");

        this.$el.append(html);

        var binder = new Backbone.ModelBinder();
        var bindings = {
            super_power:'[class=super_power]',
            graduated:'[class=graduated]',
            education:'[class=education]',
            drivers_license:'[class=drivers_license]'
        };
        binder.bind(this.model, this.$el, bindings);
    }
});

NestedInnerView = Backbone.View.extend({
    id:'innerDiv',

    render:function () {
        var html = $("\
          <input type='text' name='innerText'>\
          <input type='text' name='sharedText'>\
          <select name='innerSelect'> \
            <option value='none'>none</option> \
            <option value='grade_school'>i dun learned at grade skool</option> \
            <option value='high school'>high school</option> \
            <option value='college'>college</option> \
            <option value='graduate'>graduate</option> \
          </select> \
          <select name='sharedSelect'> \
            <option value='none'>none</option> \
            <option value='grade_school'>i dun learned at grade skool</option> \
            <option value='high school'>high school</option> \
            <option value='college'>college</option> \
            <option value='graduate'>graduate</option> \
          </select> \
          <input type='radio' id='graduated_yes' name='innerRadio' value='yes'>\
          <input type='radio' id='graduated_no' name='innerRadio' value='no'>\
          <input type='radio' id='graduated_maybe' name='innerRadio' value='maybe'>\
          <input type='checkbox' name='innerCheckbox' value='yes'>\
          <input type='checkbox' name='sharedCheckbox' value='yes'>\
        ");
        this.$el.append(html);

        var modelBinder = new Backbone.ModelBinder();
        modelBinder.bind(this.model, this.$el);

        return this;
    }
});

NestedOuterView = Backbone.View.extend({
    initialize:function () {
        this.innerView = new NestedInnerView({model:this.model.get('innerModel')});
    },

    render:function () {
        var html = $("\
          <div id='outerDiv'>\
            <input type='text' name='outerText'>\
            <input type='text' name='sharedText'>\
            <select name='outerSelect'> \
              <option value='none'>none</option> \
              <option value='grade_school'>i dun learned at grade skool</option> \
              <option value='high school'>high school</option> \
              <option value='college'>college</option> \
              <option value='graduate'>graduate</option> \
            </select> \
            <select name='sharedSelect'> \
              <option value='none'>none</option> \
              <option value='grade_school'>i dun learned at grade skool</option> \
              <option value='high school'>high school</option> \
              <option value='college'>college</option> \
              <option value='graduate'>graduate</option> \
            </select> \
            <input type='radio' id='graduated_yes' name='outerRadio' value='yes'>\
            <input type='radio' id='graduated_no' name='outerRadio' value='no'>\
            <input type='radio' id='graduated_maybe' name='outerRadio' value='maybe'>\
            <input type='checkbox' name='outerCheckbox' value='yes'>\
            <input type='checkbox' name='sharedCheckbox' value='yes'>\
          </div>\
        ");

        this.$el.append(html);
        this.innerView.render();
        this.$('#outerDiv').append(this.innerView.$el);

        var outerViewBindingAttributeConfig = {all:"name",
            shouldBindToEl:function (el) {
                return el.parent().attr('id') === 'outerDiv';
            }};
        var innerViewBindingAttributeConfig = {all:"name",
            shouldBindToEl:function (el) {
                return el.parent().attr('id') === 'innerDiv';
            }};

        var modelBinder = new Backbone.ModelBinder();
        var bindings = {
            outerText: '[name=outerText]',
            sharedText: '[name=sharedText]:first',
            outerSelect: '[name=outerSelect]',
            sharedSelect: '[name=sharedSelect]:first',
            outerRadio: '[name=outerRadio]',
            outerCheckbox: '[name=outerCheckbox]',
            sharedCheckbox: '[name=sharedCheckbox]:first'
        };
        modelBinder.bind(this.model, this.$el, bindings);
    }
});

SimpleView = Backbone.View.extend({
    render:function () {
        var html = $("\
          <div type='text' id='firstName'></div>\
          <div type='text' id='lastName'></div>\
          <div type='text' id='address'></div>\
          <input type='text' name='firstName'>\
          <input type='text' name='lastName'>\
          <input type='text' class='dateClass'>\
          <div class='dateClass'></div>\
          <select name='education'> \
            <option value='none'>none</option> \
            <option value='grade_school'>i dun learned at grade skool</option> \
            <option value='high school'>high school</option> \
            <option value='college'>college</option> \
            <option value='graduate'>graduate</option> \
          </select> \
          <input type='radio' id='graduated_yes' name='graduated' value='yes'>\
          <input type='radio' id='graduated_no' name='graduated' value='no'>\
          <input type='radio' id='graduated_maybe' name='graduated' value='maybe'>\
          <input type='checkbox' name='isActive' value='yes'>\
        ");
        this.$el.append(html);

        return this;
    }
});

