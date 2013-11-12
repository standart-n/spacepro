var Backbone, Data;

Backbone = require('backbone');
Data =     require('data');

module.exports = Backbone.View.extend({

  el: "[data-view=\"dict\"]",

  initialize: function() {
    var _this = this;

    this.sid =      this.$el.data("dict-sid");
    this.type =     this.$el.data("dict-type");
    this.step =     20;
    this.query =    '';
    this.keys =     {};
    this.vals =     {};
    
    this.data = new Data();
    this.data.reset(window[this.sid].data);
    this.limit = this.data.length;

    this.selectRowUUID = window[this.sid].selectRowUUID || '';

    if (this.type === 'parent') {
      this.child = this.$el.data("dict-child");
    }

    if (this.type === 'child') {
      this.keys = window[this.sid].keys || {};
      this.vals = window[this.sid].vals || {};
    }

    this.on('update', function(vals) {
      if (_this.type === 'child') {
        _this.vals = vals;
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
        _this.query = query;
        _this.data.reset();
        _this.$el.find('tbody').empty();
        _this.sendRequest();
      }
    });

    this.$el.on('scroll', function() {
      // if (_this.type === 'parent') {
      if (_this.$el.scrollTop() + _this.$el.height() === _this.$el.find('.container').height()) {
        _this.limit = _this.data.length + _this.step;
        _this.sendRequest();
      }
      // }
    });

    this.data.on('add', function(line) {
      _this.$el.find('tbody').append(jade.templates.line({
        columns: window[_this.sid].columns,
        line: line.toJSON()
      }));
    });

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

  checkResponse: function() {
    var selectRowUUID, model;

    selectRowUUID = this.$el.find('tbody').find('tr:first').data('d$uuid');

    if (this.type === 'parent') {
      if ((this.child != null) && (this.data != null)) {
        if (window.app[this.child] != null) {      
          if (selectRowUUID != this.selectRowUUID) {
            this.selectRowUUID = selectRowUUID;
            model = this.data.findWhere({'d$uuid': selectRowUUID});
            if (model != null) {              
              window.app[this.child].trigger('update', model.toJSON() || {});
            } else {
              window.app[this.child].trigger('clear');
            }
          }      
        }
      }
    }

  }

});
