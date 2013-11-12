var _, Backbone, Data;

_ =        require('underscore');
Backbone = require('backbone');
Data =     require('data');

module.exports = Backbone.View.extend({

  el: "[data-view=\"dict\"]",

  initialize: function() {
    var model,
      _this = this;

    this.sid =      this.$el.data("dict-sid");
    this.type =     this.$el.data("dict-type");
    this.limit =    50;
    this.step =     20;
    this.query =    '';
    this.keys =     {};
    this.vals =     {};
    
    this.data = new Data();
    this.data.reset(window[this.sid].data);

    this.selectRowUUID = window[this.sid].selectRowUUID || this.$el.find('tbody').find('tr:first').data('uuid') || '';

    this.colorActiveLine();

    if (this.type === 'parent') {
      this.child = this.$el.data("dict-child");
    }

    if (this.type === 'child') {
      this.keys = window[this.sid].keys || {};
      this.vals = window[this.sid].vals || {};
    }

    this.on('update', function(vals) {
      if (_this.type === 'child') {
        _this.limit = 50;
        _this.vals = this.cleanVals(vals);
        _this.data.reset();
        _this.$el.find('tbody').empty();
        _this.sendRequest();
      }
    });

    this.on('clear', function() {
      if (_this.type === 'child') {
        _this.data.reset();
        _this.$el.find('tbody').empty();
      }
    });

    this.on('search', function(query) {
      if (_this.type === 'parent') {
        _this.limit = 50;
        _this.query = query;
        _this.data.reset();
        _this.$el.find('tbody').empty();
        _this.sendRequest();
      }
    });

    this.$el.on('scroll', function() {
      if (_this.$el.scrollTop() + _this.$el.height() === _this.$el.find('.container').height()) {
        _this.limit = _this.data.length + _this.step;
        _this.sendRequest();
      }
    });

    this.$el.on('mouseover', function() {
      $(this).css({
        'cursor': 'pointer'
      });
    });


    this.$el.on('click', 'td', function() {
      var $tr = $(this).parent();
      _this.selectRowUUID = $tr.data('uuid');
      _this.colorActiveLine();
      _this.updateChilds();
    });

    this.data.on('add', function(line) {
      _this.$el.find('tbody').append(jade.templates.line({
        columns: window[_this.sid].columns,
        line: line.toJSON()
      }));
    });

  },

  setValsToLowerCase: function(ms) {
    var tmp = {};
    _.each(ms || {}, function(value, key) {
      tmp[key] = value.toLowerCase();
    });
    return tmp;
  },

  setKeysToLowerCase: function(ms) {
    var tmp = {};
    _.each(ms || {}, function(value, key) {
      tmp[key.toLowerCase()] = value;
    });
    return tmp;
  },

  cleanVals: function(new_vals) {
    var keys, vals, 
      tmp = {};

    keys = this.keys || {};
    vals = this.vals || {};

    if ((new_vals != null) && (typeof new_vals === 'object')) {
      vals = _.extend({}, vals, new_vals);
    }

    keys =  this.setValsToLowerCase(keys);
    vals =  this.setKeysToLowerCase(vals);

    _.each(keys, function(value, key) {
      if (vals[value] != null) {
        if (typeof vals[value] === 'string') {
          tmp[value] = vals[value].trim();
        } else {
          tmp[value] = vals[value];
        }
      }
    });

    return tmp;
  },

  colorActiveLine: function() {
    this.$el.find('tr').removeClass('success');
    this.$activeLine = this.$el.find("[data-uuid=\"" + this.selectRowUUID + "\"]");
    this.$activeLine.addClass('success');
  },

  sendRequest: function() {
    var _this = this;
    this.data.fetch({
      url:     '/api/dict/' + this.sid,
      timeout: 10000,
      data: {
        limit: this.limit  || null,
        query: this.query  || '',
        keys:  this.keys   || {},
        vals:  this.vals   || {}
      },
      success: function() {
        _this.checkResponse();
      }
    });
  },

  updateChilds: function() {
    var model = this.data.findWhere({'d$uuid': this.selectRowUUID});
    if ((this.child != null) && (this.data != null)) {
      if (window.app[this.child] != null) {
        if (model != null) {
          window.app[this.child].trigger('update', model.toJSON() || {});
        } else {
          window.app[this.child].trigger('clear');
        }
      }
    }
  },

  checkResponse: function() {
    var selectRowUUID;

    selectRowUUID = this.$el.find('tbody').find('tr:first').data('uuid');

    if (this.type === 'parent') {
      if (selectRowUUID != this.selectRowUUID) {
        this.selectRowUUID = selectRowUUID;
        this.colorActiveLine();
        this.updateChilds();
      }
    }

  }

});
