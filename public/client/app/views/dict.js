var _, Backbone, Data;

_ =        require('underscore');
Backbone = require('backbone');
Data =     require('data');

module.exports = Backbone.View.extend({

  el: "[data-view=\"dict\"]",

  initialize: function() {
    var model,
      _this = this;

    this.$worksheet =  this.$el.find('tbody');

    this.sid =         this.$el.data("dict-sid");
    this.type =        this.$el.data("dict-type");
    this.limit =       50;
    this.step =        20;
    this.query =       '';
    this.keys =        {};
    this.vals =        {};

    this.columns =     window[this.sid].columns || {};
    this.fields =      window[this.sid].fields  || {};
    
    this.data = new Data();
    this.data.reset(window[this.sid].data);

    this.selectRowUUID = window[this.sid].selectRowUUID || this.getUUIDbyFirstRecord();

    this.colorActiveLine();

    this.cleanVals();

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
        _this.vals = _this.cleanVals(vals);
        _this.sendRequest('update');
      }
    });

    this.on('clear', function() {
      if (_this.type === 'child') {
        _this.showInformationNotFound();
      }
    });

    this.on('search', function(query) {
      if (_this.type === 'parent') {
        _this.limit = 50;
        _this.query = query;
        _this.sendRequest('search');
      }
    });

    this.$el.on('scroll', function() {
      if (_this.$el.scrollTop() + _this.$el.height() === _this.$el.find('.container').height()) {
        _this.limit = _this.data.length + _this.step;
        _this.sendRequest('scroll');
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
      _this.$worksheet.append(jade.templates.line_data({
        columns: _this.columns,
        fields:  _this.fields,
        line:    line.toJSON()
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

  getUUIDbyFirstRecord: function() {
    return this.$worksheet.find('tr:first').data('uuid') || '';
  },

  colorActiveLine: function(classname) {

    if (classname == null) {
      classname = 'success';
    }

    this.$worksheet.find('tr').removeClass(classname);
    this.$activeLine = this.$worksheet.find("[data-uuid=\"" + this.selectRowUUID + "\"]");
    if (this.$activeLine != null) {
      this.$activeLine.addClass(classname);
    }
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

  showInformationNotFound: function() {
    this.$worksheet.html(jade.templates.line_nothing({
      columns: this.columns || {}
    }));
  },

  hideInformationNotFound: function() {
    this.$worksheet.find("[data-type=\"nothing\"]").remove();
  },

  showErrorOnServer: function() {
    this.$worksheet.html(jade.templates.line_error({
      columns: this.columns || {}
    }));
  },

  hideErrorOnServer: function() {
    this.$worksheet.find("[data-type=\"error\"]").remove();
  },

  showLoading: function(type) {

    if (type == null) {
      type = 'replace';
    }

    if (!this.$worksheet.find("[data-type=\"loading\"]").length) {
      switch (type) {
        case 'replace':
          this.$worksheet.html(jade.templates.line_loading({
            columns: this.columns || {}
          }));
        break;
        case 'after':
          this.$worksheet.append(jade.templates.line_loading({
            columns: this.columns || {}
          }));
        break;
        case 'before':
          this.$worksheet.prepend(jade.templates.line_loading({
            columns: this.columns || {}
          }));
        break;
      }
    }

  },

  hideLoading: function() {
    this.$worksheet.find("[data-type=\"loading\"]").remove();
  },

  sendRequest: function(type) {
    var _this = this;

    if (type == null) {
      type = 'scroll';
    }

    switch (type) {
      case 'update':
        _this.showLoading();
      break;
      case 'search':
        _this.showLoading();
      break;
      case 'scroll':
        _this.showLoading('after');
      break;
    }

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
        _this.hideLoading();
        _this.hideErrorOnServer();
        _this.hideInformationNotFound();
        _this.checkResponse(type);
      },
      error: function() {
        _this.hideLoading();
        _this.showErrorOnServer();
      }
    });
  },

  checkResponse: function(type) {

    if (type == null) {
      type = "scroll";
    }

    switch (type) {
      case 'update':
        this.selectRowUUID = this.getUUIDbyFirstRecord();
        this.colorActiveLine();
      break;
      case 'search':
        this.selectRowUUID = this.getUUIDbyFirstRecord();
        this.colorActiveLine();
        this.updateChilds();
      break;      
    }

    if (this.data.length < 1) {
      this.showInformationNotFound();
    }

  }

});
