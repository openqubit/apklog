(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var Blaze = Package.blaze.Blaze;
var UI = Package.blaze.UI;
var Handlebars = Package.blaze.Handlebars;
var _ = Package.underscore._;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var ReactiveVar = Package['reactive-var'].ReactiveVar;
var EJSON = Package.ejson.EJSON;
var Spacebars = Package.spacebars.Spacebars;
var BaseComponent = Package['peerlibrary:base-component'].BaseComponent;
var BaseComponentDebug = Package['peerlibrary:base-component'].BaseComponentDebug;
var assert = Package['peerlibrary:assert'].assert;
var HTML = Package.htmljs.HTML;

/* Package-scope variables */
var __coffeescriptShare, BlazeComponent, BlazeComponentDebug;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/peerlibrary_blaze-components/packages/peerlibrary_blaze-components.js                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/peerlibrary:blaze-components/lookup.js                                                                 //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
/* This file is a direct copy of Blaze lookup.js with modifications described                                      // 1
   in this pull request: https://github.com/meteor/meteor/pull/4036                                                // 2
                                                                                                                   // 3
   TODO: Remove this file once the pull request is merged in.                                                      // 4
 */                                                                                                                // 5
                                                                                                                   // 6
// If `x` is a function, binds the value of `this` for that function                                               // 7
// to the current data context.                                                                                    // 8
var bindDataContext = function (x) {                                                                               // 9
  if (typeof x === 'function') {                                                                                   // 10
    return function () {                                                                                           // 11
      var data = Blaze.getData();                                                                                  // 12
      if (data == null)                                                                                            // 13
        data = {};                                                                                                 // 14
      return x.apply(data, arguments);                                                                             // 15
    };                                                                                                             // 16
  }                                                                                                                // 17
  return x;                                                                                                        // 18
};                                                                                                                 // 19
                                                                                                                   // 20
Blaze._getTemplateHelper = function (template, name, templateInstance) {                                           // 21
  // XXX COMPAT WITH 0.9.3                                                                                         // 22
  var isKnownOldStyleHelper = false;                                                                               // 23
                                                                                                                   // 24
  if (template.__helpers.has(name)) {                                                                              // 25
    var helper = template.__helpers.get(name);                                                                     // 26
    if (helper === Blaze._OLDSTYLE_HELPER) {                                                                       // 27
      isKnownOldStyleHelper = true;                                                                                // 28
    } else if (helper != null) {                                                                                   // 29
      return wrapHelper(bindDataContext(helper), templateInstance);                                                // 30
    } else {                                                                                                       // 31
      return null;                                                                                                 // 32
    }                                                                                                              // 33
  }                                                                                                                // 34
                                                                                                                   // 35
  // old-style helper                                                                                              // 36
  if (name in template) {                                                                                          // 37
    // Only warn once per helper                                                                                   // 38
    if (! isKnownOldStyleHelper) {                                                                                 // 39
      template.__helpers.set(name, Blaze._OLDSTYLE_HELPER);                                                        // 40
      if (! template._NOWARN_OLDSTYLE_HELPERS) {                                                                   // 41
        Blaze._warn('Assigning helper with `' + template.viewName + '.' +                                          // 42
                    name + ' = ...` is deprecated.  Use `' + template.viewName +                                   // 43
                    '.helpers(...)` instead.');                                                                    // 44
      }                                                                                                            // 45
    }                                                                                                              // 46
    if (template[name] != null) {                                                                                  // 47
      return wrapHelper(bindDataContext(template[name]), templateInstance);                                        // 48
    }                                                                                                              // 49
  }                                                                                                                // 50
                                                                                                                   // 51
  return null;                                                                                                     // 52
};                                                                                                                 // 53
                                                                                                                   // 54
var wrapHelper = function (f, templateFunc) {                                                                      // 55
  // XXX COMPAT WITH METEOR 1.0.3.2                                                                                // 56
  if (! Blaze.Template._withTemplateInstanceFunc) {                                                                // 57
    return Blaze._wrapCatchingExceptions(f, 'template helper');                                                    // 58
  }                                                                                                                // 59
                                                                                                                   // 60
  if (typeof f !== "function") {                                                                                   // 61
    return f;                                                                                                      // 62
  }                                                                                                                // 63
                                                                                                                   // 64
  return function () {                                                                                             // 65
    var self = this;                                                                                               // 66
    var args = arguments;                                                                                          // 67
                                                                                                                   // 68
    return Blaze.Template._withTemplateInstanceFunc(templateFunc, function () {                                    // 69
      return Blaze._wrapCatchingExceptions(f, 'template helper').apply(self, args);                                // 70
    });                                                                                                            // 71
  };                                                                                                               // 72
};                                                                                                                 // 73
                                                                                                                   // 74
// templateInstance argument is provided to be available for possible                                              // 75
// alternative implementations of this function by 3rd party packages.                                             // 76
Blaze._getTemplate = function (name, templateInstance) {                                                           // 77
  if ((name in Blaze.Template) && (Blaze.Template[name] instanceof Blaze.Template)) {                              // 78
    return Blaze.Template[name];                                                                                   // 79
  }                                                                                                                // 80
  return null;                                                                                                     // 81
};                                                                                                                 // 82
                                                                                                                   // 83
Blaze.View.prototype.lookup = function (name, _options) {                                                          // 84
  var template = this.template;                                                                                    // 85
  var lookupTemplate = _options && _options.template;                                                              // 86
  var helper;                                                                                                      // 87
  var boundTmplInstance;                                                                                           // 88
  var foundTemplate;                                                                                               // 89
                                                                                                                   // 90
  if (this.templateInstance) {                                                                                     // 91
    boundTmplInstance = _.bind(this.templateInstance, this);                                                       // 92
  }                                                                                                                // 93
                                                                                                                   // 94
  if (/^\./.test(name)) {                                                                                          // 95
    // starts with a dot. must be a series of dots which maps to an                                                // 96
    // ancestor of the appropriate height.                                                                         // 97
    if (!/^(\.)+$/.test(name))                                                                                     // 98
      throw new Error("id starting with dot must be a series of dots");                                            // 99
                                                                                                                   // 100
    return Blaze._parentData(name.length - 1, true /*_functionWrapped*/);                                          // 101
                                                                                                                   // 102
  } else if (template &&                                                                                           // 103
             ((helper = Blaze._getTemplateHelper(template, name, boundTmplInstance)) != null)) {                   // 104
    return helper;                                                                                                 // 105
  } else if (lookupTemplate &&                                                                                     // 106
             ((foundTemplate = Blaze._getTemplate(name, boundTmplInstance)) != null)) {                            // 107
    return foundTemplate;                                                                                          // 108
  } else if (Blaze._globalHelpers[name] != null) {                                                                 // 109
    return wrapHelper(bindDataContext(Blaze._globalHelpers[name]),                                                 // 110
      boundTmplInstance);                                                                                          // 111
  } else {                                                                                                         // 112
    return function () {                                                                                           // 113
      var isCalledAsFunction = (arguments.length > 0);                                                             // 114
      var data = Blaze.getData();                                                                                  // 115
      if (lookupTemplate && ! (data && data[name])) {                                                              // 116
        throw new Error("No such template: " + name);                                                              // 117
      }                                                                                                            // 118
      if (isCalledAsFunction && ! (data && data[name])) {                                                          // 119
        throw new Error("No such function: " + name);                                                              // 120
      }                                                                                                            // 121
      if (! data)                                                                                                  // 122
        return null;                                                                                               // 123
      var x = data[name];                                                                                          // 124
      if (typeof x !== 'function') {                                                                               // 125
        if (isCalledAsFunction) {                                                                                  // 126
          throw new Error("Can't call non-function: " + x);                                                        // 127
        }                                                                                                          // 128
        return x;                                                                                                  // 129
      }                                                                                                            // 130
      return x.apply(data, arguments);                                                                             // 131
    };                                                                                                             // 132
  }                                                                                                                // 133
  return null;                                                                                                     // 134
};                                                                                                                 // 135
                                                                                                                   // 136
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/peerlibrary:blaze-components/lib.coffee.js                                                             //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var ComponentsNamespaceReference, addEvents, bindComponent, bindDataContext, getTemplateInstance, getTemplateInstanceFunction, method, methodName, originalDot, originalGetTemplate, originalInclude, registerFirstCreatedHook, registerHooks, templateInstanceToComponent, wrapHelper, _fn, _ref,                
  __slice = [].slice,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

getTemplateInstance = function(view) {
  while (view && !view._templateInstance) {
    view = view.parentView;
  }
  return view != null ? view._templateInstance : void 0;
};

templateInstanceToComponent = function(templateInstanceFunc) {
  var templateInstance;
  templateInstance = typeof templateInstanceFunc === "function" ? templateInstanceFunc() : void 0;
  templateInstance = getTemplateInstance(templateInstance != null ? templateInstance.view : void 0);
  while (templateInstance) {
    if ('component' in templateInstance) {
      return templateInstance.component;
    }
    templateInstance = getTemplateInstance(templateInstance.view.parentView);
  }
  return null;
};

getTemplateInstanceFunction = function(view) {
  var templateInstance;
  templateInstance = getTemplateInstance(view);
  return function() {
    return templateInstance;
  };
};

ComponentsNamespaceReference = (function() {
  function ComponentsNamespaceReference(namespace, templateInstance) {
    this.namespace = namespace;
    this.templateInstance = templateInstance;
  }

  return ComponentsNamespaceReference;

})();

originalDot = Spacebars.dot;

Spacebars.dot = function() {
  var args, value;
  value = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
  if (value instanceof ComponentsNamespaceReference) {
    return Blaze._getTemplate("" + value.namespace + "." + (args.join('.')), value.templateInstance);
  }
  return originalDot.apply(null, [value].concat(__slice.call(args)));
};

originalInclude = Spacebars.include;

Spacebars.include = function() {
  var args, templateOrFunction;
  templateOrFunction = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
  if (templateOrFunction instanceof ComponentsNamespaceReference) {
    templateOrFunction = Blaze._getTemplate(templateOrFunction.namespace, templateOrFunction.templateInstance);
  }
  return originalInclude.apply(null, [templateOrFunction].concat(__slice.call(args)));
};

Blaze._getTemplateHelper = function(template, name, templateInstance) {
  var component, helper, isKnownOldStyleHelper, mixinOrComponent, _ref;
  isKnownOldStyleHelper = false;
  if (template.__helpers.has(name)) {
    helper = template.__helpers.get(name);
    if (helper === Blaze._OLDSTYLE_HELPER) {
      isKnownOldStyleHelper = true;
    } else if (helper != null) {
      return wrapHelper(bindDataContext(helper), templateInstance);
    } else {
      return null;
    }
  }
  if (name in template) {
    if (!isKnownOldStyleHelper) {
      template.__helpers.set(name, Blaze._OLDSTYLE_HELPER);
      if (!template._NOWARN_OLDSTYLE_HELPERS) {
        Blaze._warn("Assigning helper with `" + template.viewName + "." + name + " = ...` is deprecated.  Use `" + template.viewName + ".helpers(...)` instead.");
      }
    }
    if (template[name] != null) {
      return wrapHelper(bindDataContext(template[name]), templateInstance);
    } else {
      return null;
    }
  }
  if (!templateInstance) {
    return null;
  }
  if ((_ref = template.viewName) === 'Template.__dynamicWithDataContext' || _ref === 'Template.__dynamic') {
    return null;
  }
  component = Tracker.nonreactive(function() {
    return templateInstanceToComponent(templateInstance);
  });
  if (component) {
    if (mixinOrComponent = component.getFirstWith(null, name)) {
      return wrapHelper(bindComponent(mixinOrComponent, mixinOrComponent[name]), templateInstance);
    }
  }
  if (name && name in BlazeComponent.components) {
    return new ComponentsNamespaceReference(name, templateInstance);
  }
  return null;
};

bindComponent = function(component, helper) {
  if (_.isFunction(helper)) {
    return _.bind(helper, component);
  } else {
    return helper;
  }
};

bindDataContext = function(helper) {
  if (_.isFunction(helper)) {
    return function() {
      var data;
      data = Blaze.getData();
      if (data == null) {
        data = {};
      }
      return helper.apply(data, arguments);
    };
  } else {
    return helper;
  }
};

wrapHelper = function(f, templateFunc) {
  if (!Blaze.Template._withTemplateInstanceFunc) {
    return Blaze._wrapCatchingExceptions(f, 'template helper');
  }
  if (!_.isFunction(f)) {
    return f;
  }
  return function() {
    var args, self;
    self = this;
    args = arguments;
    return Blaze.Template._withTemplateInstanceFunc(templateFunc, function() {
      return Blaze._wrapCatchingExceptions(f, 'template helper').apply(self, args);
    });
  };
};

addEvents = function(view, component) {
  var eventMap, events, eventsList, handler, spec, _fn, _i, _len;
  eventsList = component.events();
  if (!_.isArray(eventsList)) {
    throw new Error("'events' method from the component '" + (component.componentName() || 'unnamed') + "' did not return a list of event maps.");
  }
  for (_i = 0, _len = eventsList.length; _i < _len; _i++) {
    events = eventsList[_i];
    eventMap = {};
    _fn = function(spec, handler) {
      return eventMap[spec] = function() {
        var args, currentView, event, templateInstance, withTemplateInstanceFunc;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        event = args[0];
        currentView = Blaze.getView(event.currentTarget);
        templateInstance = getTemplateInstanceFunction(currentView);
        if (Template._withTemplateInstanceFunc) {
          withTemplateInstanceFunc = Template._withTemplateInstanceFunc;
        } else {
          withTemplateInstanceFunc = function(templateInstance, f) {
            return f();
          };
        }
        withTemplateInstanceFunc(templateInstance, function() {
          return Blaze._withCurrentView(currentView, function() {
            return handler.apply(component, args);
          });
        });
      };
    };
    for (spec in events) {
      handler = events[spec];
      _fn(spec, handler);
    }
    Blaze._addEventMap(view, eventMap);
  }
};

originalGetTemplate = Blaze._getTemplate;

Blaze._getTemplate = function(name, templateInstance) {
  var template;
  template = Tracker.nonreactive(function() {
    var componentParent, _ref;
    componentParent = templateInstanceToComponent(templateInstance);
    return (_ref = BlazeComponent.getComponent(name)) != null ? _ref.renderComponent(componentParent) : void 0;
  });
  if (template && (template instanceof Blaze.Template || _.isFunction(template))) {
    return template;
  }
  return originalGetTemplate(name);
};

registerHooks = function(template, hooks) {
  if (template.onCreated) {
    template.onCreated(hooks.onCreated);
    template.onRendered(hooks.onRendered);
    return template.onDestroyed(hooks.onDestroyed);
  } else {
    template.created = hooks.onCreated;
    template.rendered = hooks.onRendered;
    return template.destroyed = hooks.onDestroyed;
  }
};

registerFirstCreatedHook = function(template, onCreated) {
  var oldCreated;
  if (template._callbacks) {
    return template._callbacks.created.unshift(onCreated);
  } else {
    oldCreated = template.created;
    return template.created = function() {
      onCreated.call(this);
      return oldCreated != null ? oldCreated.call(this) : void 0;
    };
  }
};

BlazeComponent = (function(_super) {
  __extends(BlazeComponent, _super);

  function BlazeComponent() {
    return BlazeComponent.__super__.constructor.apply(this, arguments);
  }

  BlazeComponent.getComponentForElement = function(domElement) {
    if (!domElement) {
      return null;
    }
    if (domElement.nodeType !== Node.ELEMENT_NODE) {
      throw new Error("Expected DOM element.");
    }
    return templateInstanceToComponent((function(_this) {
      return function() {
        return getTemplateInstance(Blaze.getView(domElement));
      };
    })(this));
  };

  BlazeComponent.prototype.mixins = function() {
    return [];
  };

  BlazeComponent.prototype.mixinParent = function(mixinParent) {
    if (this._componentInternals == null) {
      this._componentInternals = {};
    }
    if (mixinParent) {
      this._componentInternals.mixinParent = mixinParent;
      return this;
    }
    return this._componentInternals.mixinParent || null;
  };

  BlazeComponent.prototype.requireMixin = function(nameOrMixin) {
    var mixinInstance, mixinInstanceComponent, _ref, _ref1, _ref2, _ref3;
    assert((_ref = this._componentInternals) != null ? _ref.mixins : void 0);
    if (this.getMixin(nameOrMixin)) {
      return this;
    }
    if (_.isString(nameOrMixin)) {
      if (this.constructor.getComponent) {
        mixinInstanceComponent = this.constructor.getComponent(nameOrMixin);
      } else {
        mixinInstanceComponent = BlazeComponent.getComponent(nameOrMixin);
      }
      if (!mixinInstanceComponent) {
        throw new Error("Unknown mixin '" + nameOrMixin + "'.");
      }
      mixinInstance = new mixinInstanceComponent();
    } else if (_.isFunction(nameOrMixin)) {
      mixinInstance = new nameOrMixin();
    } else {
      mixinInstance = nameOrMixin;
    }
    this._componentInternals.mixins.push(mixinInstance);
    if (mixinInstance.mixinParent) {
      mixinInstance.mixinParent(this);
      assert.equal(mixinInstance.mixinParent(), this);
    }
    if (typeof mixinInstance.createMixins === "function") {
      mixinInstance.createMixins();
    }
    if (!((_ref1 = this._componentInternals.templateInstance) != null ? _ref1.view.isDestroyed : void 0)) {
      if (!this._componentInternals.inOnCreated && ((_ref2 = this._componentInternals.templateInstance) != null ? _ref2.view.isCreated : void 0)) {
        if (typeof mixinInstance.onCreated === "function") {
          mixinInstance.onCreated();
        }
      }
      if (!this._componentInternals.inOnRendered && ((_ref3 = this._componentInternals.templateInstance) != null ? _ref3.view.isRendered : void 0)) {
        if (typeof mixinInstance.onRendered === "function") {
          mixinInstance.onRendered();
        }
      }
    }
    return this;
  };

  BlazeComponent.prototype.createMixins = function() {
    var mixin, _i, _len, _ref;
    if (this._componentInternals == null) {
      this._componentInternals = {};
    }
    if (this._componentInternals.mixins) {
      return;
    }
    this._componentInternals.mixins = [];
    _ref = this.mixins();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      mixin = _ref[_i];
      this.requireMixin(mixin);
    }
    return this;
  };

  BlazeComponent.prototype.getMixin = function(nameOrMixin) {
    var mixin, mixinComponentName, _i, _j, _len, _len1, _ref, _ref1, _ref2;
    assert((_ref = this._componentInternals) != null ? _ref.mixins : void 0);
    if (_.isString(nameOrMixin)) {
      _ref1 = this._componentInternals.mixins;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        mixin = _ref1[_i];
        mixinComponentName = (typeof mixin.componentName === "function" ? mixin.componentName() : void 0) || null;
        if (mixinComponentName && mixinComponentName === nameOrMixin) {
          return mixin;
        }
      }
    } else {
      _ref2 = this._componentInternals.mixins;
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        mixin = _ref2[_j];
        if (mixin.constructor === nameOrMixin) {
          return mixin;
        } else if (mixin === nameOrMixin) {
          return mixin;
        }
      }
    }
    return null;
  };

  BlazeComponent.prototype.callFirstWith = function() {
    var afterComponentOrMixin, args, mixin, propertyName;
    afterComponentOrMixin = arguments[0], propertyName = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
    mixin = this.getFirstWith(afterComponentOrMixin, propertyName);
    if (!mixin) {
      return;
    }
    if (_.isFunction(mixin[propertyName])) {
      return mixin[propertyName].apply(mixin, args);
    } else {
      return mixin[propertyName];
    }
  };

  BlazeComponent.prototype.getFirstWith = function(afterComponentOrMixin, propertyName) {
    var found, mixin, _i, _len, _ref, _ref1;
    assert((_ref = this._componentInternals) != null ? _ref.mixins : void 0);
    if (!afterComponentOrMixin) {
      if (propertyName in this) {
        return this;
      }
      found = true;
    } else if (afterComponentOrMixin && afterComponentOrMixin === this) {
      found = true;
    } else {
      found = false;
    }
    _ref1 = this._componentInternals.mixins;
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      mixin = _ref1[_i];
      if (found && propertyName in mixin) {
        return mixin;
      }
      if (mixin === afterComponentOrMixin) {
        found = true;
      }
    }
    return null;
  };

  BlazeComponent.renderComponent = function(componentParent) {
    return Tracker.nonreactive((function(_this) {
      return function() {
        var component, componentClass, data, error;
        componentClass = _this;
        try {
          data = Template.currentData();
        } catch (_error) {
          error = _error;
          data = null;
        }
        if ((data != null ? data.constructor : void 0) !== share.argumentsConstructor) {
          component = new componentClass();
          return component.renderComponent(componentParent);
        }
        return function() {
          var currentWith, reactiveArguments, template;
          currentWith = Blaze.getView('with');
          reactiveArguments = new ReactiveVar([], EJSON.equals);
          assert(Tracker.active);
          Tracker.autorun(function(computation) {
            data = currentWith.dataVar.get();
            assert.equal(data != null ? data.constructor : void 0, share.argumentsConstructor);
            return reactiveArguments.set(data._arguments);
          });
          component = (function(func, args, ctor) {
            ctor.prototype = func.prototype;
            var child = new ctor, result = func.apply(child, args);
            return Object(result) === result ? result : child;
          })(componentClass, reactiveArguments.get(), function(){});
          template = component.renderComponent(componentParent);
          registerFirstCreatedHook(template, function() {
            this.view.originalParentView = this.view.parentView;
            return this.view.parentView = this.view.parentView.parentView.parentView;
          });
          return template;
        };
      };
    })(this));
  };

  BlazeComponent.prototype.renderComponent = function(componentParent) {
    return Tracker.nonreactive((function(_this) {
      return function() {
        var component, componentTemplate, template, templateBase, _base;
        component = _this;
        component.createMixins();
        componentTemplate = component.template();
        if (_.isString(componentTemplate)) {
          templateBase = Template[componentTemplate];
          if (!templateBase) {
            throw new Error("Template '" + componentTemplate + "' cannot be found.");
          }
        } else if (componentTemplate) {
          templateBase = componentTemplate;
        } else {
          throw new Error("Template for the component '" + (component.componentName() || 'unnamed') + "' not provided.");
        }
        template = new Blaze.Template("BlazeComponent." + (component.componentName() || 'unnamed'), templateBase.renderFunction);
        if ((_base = _this.component)._componentInternals == null) {
          _base._componentInternals = {};
        }
        registerHooks(template, {
          onCreated: function() {
            var componentOrMixin, _base1, _base2, _base3;
            if (componentParent) {
              Tracker.nonreactive((function(_this) {
                return function() {
                  assert(!component.componentParent());
                  component.componentParent(componentParent);
                  return componentParent.addComponentChild(component);
                };
              })(this));
            }
            this.view._onViewRendered((function(_this) {
              return function() {
                var componentOrMixin, _results;
                if (_this.view.renderCount !== 1) {
                  return;
                }
                componentOrMixin = null;
                _results = [];
                while (componentOrMixin = _this.component.getFirstWith(componentOrMixin, 'events')) {
                  _results.push(addEvents(_this.view, componentOrMixin));
                }
                return _results;
              };
            })(this));
            this.component = component;
            assert(!this.component._componentInternals.templateInstance);
            this.component._componentInternals.templateInstance = this;
            try {
              this.component._componentInternals.inOnCreated = true;
              componentOrMixin = null;
              while (componentOrMixin = this.component.getFirstWith(componentOrMixin, 'onCreated')) {
                componentOrMixin.onCreated();
              }
            } finally {
              delete this.component._componentInternals.inOnCreated;
            }
            if ((_base1 = this.component._componentInternals).isCreated == null) {
              _base1.isCreated = new ReactiveVar(true);
            }
            this.component._componentInternals.isCreated.set(true);
            if ((_base2 = this.component._componentInternals).isRendered == null) {
              _base2.isRendered = new ReactiveVar(false);
            }
            this.component._componentInternals.isRendered.set(false);
            if ((_base3 = this.component._componentInternals).isDestroyed == null) {
              _base3.isDestroyed = new ReactiveVar(false);
            }
            return this.component._componentInternals.isDestroyed.set(false);
          },
          onRendered: function() {
            var componentOrMixin, _base1;
            try {
              this.component._componentInternals.inOnRendered = true;
              componentOrMixin = null;
              while (componentOrMixin = this.component.getFirstWith(componentOrMixin, 'onRendered')) {
                componentOrMixin.onRendered();
              }
            } finally {
              delete this.component._componentInternals.inOnRendered;
            }
            if ((_base1 = this.component._componentInternals).isRendered == null) {
              _base1.isRendered = new ReactiveVar(true);
            }
            this.component._componentInternals.isRendered.set(true);
            return Tracker.nonreactive((function(_this) {
              return function() {
                return assert.equal(_this.component._componentInternals.isCreated.get(), true);
              };
            })(this));
          },
          onDestroyed: function() {
            return this.autorun((function(_this) {
              return function(computation) {
                var componentOrMixin, _base1, _base2;
                if (_this.component.componentChildren().length) {
                  return;
                }
                computation.stop();
                Tracker.nonreactive(function() {
                  return assert.equal(_this.component._componentInternals.isCreated.get(), true);
                });
                _this.component._componentInternals.isCreated.set(false);
                if ((_base1 = _this.component._componentInternals).isRendered == null) {
                  _base1.isRendered = new ReactiveVar(false);
                }
                _this.component._componentInternals.isRendered.set(false);
                if ((_base2 = _this.component._componentInternals).isDestroyed == null) {
                  _base2.isDestroyed = new ReactiveVar(true);
                }
                _this.component._componentInternals.isDestroyed.set(true);
                componentOrMixin = null;
                while (componentOrMixin = _this.component.getFirstWith(componentOrMixin, 'onDestroyed')) {
                  componentOrMixin.onDestroyed();
                }
                if (componentParent) {
                  component.componentParent(null);
                  componentParent.removeComponentChild(component);
                }
                return delete _this.component._componentInternals.templateInstance;
              };
            })(this));
          }
        });
        return template;
      };
    })(this));
  };

  BlazeComponent.prototype.template = function() {
    return this.callFirstWith(this, 'template') || this.constructor.componentName();
  };

  BlazeComponent.prototype.onCreated = function() {};

  BlazeComponent.prototype.onRendered = function() {};

  BlazeComponent.prototype.onDestroyed = function() {};

  BlazeComponent.prototype.isCreated = function() {
    var _base;
    if (this._componentInternals == null) {
      this._componentInternals = {};
    }
    if ((_base = this._componentInternals).isCreated == null) {
      _base.isCreated = new ReactiveVar(false);
    }
    return this._componentInternals.isCreated.get();
  };

  BlazeComponent.prototype.isRendered = function() {
    var _base;
    if (this._componentInternals == null) {
      this._componentInternals = {};
    }
    if ((_base = this._componentInternals).isRendered == null) {
      _base.isRendered = new ReactiveVar(false);
    }
    return this._componentInternals.isRendered.get();
  };

  BlazeComponent.prototype.isDestroyed = function() {
    var _base;
    if (this._componentInternals == null) {
      this._componentInternals = {};
    }
    if ((_base = this._componentInternals).isDestroyed == null) {
      _base.isDestroyed = new ReactiveVar(false);
    }
    return this._componentInternals.isDestroyed.get();
  };

  BlazeComponent.prototype.insertDOMElement = function(parent, node, before) {
    if (before == null) {
      before = null;
    }
    if (parent && node && (node.parentNode !== parent || node.nextSibling !== before)) {
      parent.insertBefore(node, before);
    }
  };

  BlazeComponent.prototype.moveDOMElement = function(parent, node, before) {
    if (before == null) {
      before = null;
    }
    if (parent && node && (node.parentNode !== parent || node.nextSibling !== before)) {
      parent.insertBefore(node, before);
    }
  };

  BlazeComponent.prototype.removeDOMElement = function(parent, node) {
    if (parent && node && node.parentNode === parent) {
      parent.removeChild(node);
    }
  };

  BlazeComponent.prototype.events = function() {
    return [];
  };

  BlazeComponent.prototype.data = function() {
    var _ref, _ref1;
    if ((_ref = this._componentInternals) != null ? (_ref1 = _ref.templateInstance) != null ? _ref1.view : void 0 : void 0) {
      return Blaze.getData(this._componentInternals.templateInstance.view);
    }
    return void 0;
  };

  BlazeComponent.currentData = function() {
    return Blaze.getData();
  };

  BlazeComponent.prototype.currentData = function() {
    return this.constructor.currentData();
  };

  BlazeComponent.prototype.component = function() {
    return this;
  };

  BlazeComponent.currentComponent = function() {
    return Tracker.nonreactive((function(_this) {
      return function() {
        return templateInstanceToComponent(Template.instance);
      };
    })(this));
  };

  BlazeComponent.prototype.currentComponent = function() {
    return this.constructor.currentComponent();
  };

  BlazeComponent.prototype.firstNode = function() {
    var view;
    view = this._componentInternals.templateInstance.view;
    if (view._domrange && !view.isDestroyed) {
      return view._domrange.firstNode();
    } else {
      return null;
    }
  };

  BlazeComponent.prototype.lastNode = function() {
    var view;
    view = this._componentInternals.templateInstance.view;
    if (view._domrange && !view.isDestroyed) {
      return view._domrange.lastNode();
    } else {
      return null;
    }
  };

  return BlazeComponent;

})(BaseComponent);

_ref = Blaze.TemplateInstance.prototype;
_fn = function(methodName, method) {
  return BlazeComponent.prototype[methodName] = function() {
    var args, _ref1;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return (_ref1 = this._componentInternals.templateInstance)[methodName].apply(_ref1, args);
  };
};
for (methodName in _ref) {
  method = _ref[methodName];
  _fn(methodName, method);
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/peerlibrary:blaze-components/debug.coffee.js                                                           //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var                     
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

BlazeComponentDebug = (function(_super) {
  __extends(BlazeComponentDebug, _super);

  function BlazeComponentDebug() {
    return BlazeComponentDebug.__super__.constructor.apply(this, arguments);
  }

  BlazeComponentDebug.startComponent = function(component) {
    BlazeComponentDebug.__super__.constructor.startComponent.apply(this, arguments);
    return console.log(component.data());
  };

  BlazeComponentDebug.startMarkedComponent = function(component) {
    BlazeComponentDebug.__super__.constructor.startMarkedComponent.apply(this, arguments);
    return console.log(component.data());
  };

  BlazeComponentDebug.dumpComponentSubtree = function(rootComponentOrElement) {
    if (rootComponentOrElement.nodeType === Node.ELEMENT_NODE) {
      rootComponentOrElement = BlazeComponent.getComponentForElement(rootComponentOrElement);
    }
    return BlazeComponentDebug.__super__.constructor.dumpComponentSubtree.apply(this, arguments);
  };

  BlazeComponentDebug.dumpComponentTree = function(rootComponentOrElement) {
    if (rootComponentOrElement.nodeType === Node.ELEMENT_NODE) {
      rootComponentOrElement = BlazeComponent.getComponentForElement(rootComponentOrElement);
    }
    return BlazeComponentDebug.__super__.constructor.dumpComponentTree.apply(this, arguments);
  };

  BlazeComponentDebug.dumpAllComponents = function() {
    var allRootComponents, rootComponent, _i, _len;
    allRootComponents = [];
    $('*').each((function(_this) {
      return function(i, element) {
        var component, rootComponent;
        component = BlazeComponent.getComponentForElement(element);
        if (!component) {
          return;
        }
        rootComponent = _this.componentRoot(component);
        if (__indexOf.call(allRootComponents, rootComponent) < 0) {
          return allRootComponents.push(rootComponent);
        }
      };
    })(this));
    for (_i = 0, _len = allRootComponents.length; _i < _len; _i++) {
      rootComponent = allRootComponents[_i];
      this.dumpComponentSubtree(rootComponent);
    }
  };

  return BlazeComponentDebug;

})(BaseComponentDebug);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['peerlibrary:blaze-components'] = {}, {
  BlazeComponent: BlazeComponent,
  BlazeComponentDebug: BlazeComponentDebug
});

})();

//# sourceMappingURL=peerlibrary_blaze-components.js.map
