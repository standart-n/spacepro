var _, Backbone, Data, AddDeviceValue;

_ =        require('underscore');
Backbone = require('backbone');
Data =     require('data');

AddDeviceValue = require('addDeviceValue.pl');

module.exports = Backbone.View.extend({

  el: "[data-view=\"dict\"]",

  initialize: function() {
    var model,
      _this = this;

    this.$worksheet =  this.$el.find('tbody');

    this.sid =         this.options.sid  || this.$el.data("dict-sid")  || '';
    this.type =        this.options.type || this.$el.data("dict-type") || '';
    this.limit =       50;
    this.step =        20;
    this.query =       '';
    this.keys =        {};
    this.vals =        {};

    this.conf =        this.sid + '_data';
    this.columns =     window[this.conf].columns || {};
    this.fields =      window[this.conf].fields  || {};
    
    this.data = new Data();
    this.data.reset(window[this.conf].data);

    this.selectRowUUID = window[this.conf].selectRowUUID || this.getUUIDbyFirstRecord();

    this.colorActiveLine();

    this.vals = this.cleanVals();

    if (this.type === 'parent') {
      this.child = this.$el.data("dict-child");
    }

    if (this.type === 'child') {
      this.keys = window[this.conf].keys || {};
      this.vals = window[this.conf].vals || {};
    }

    this.on('update', function(vals) {
      if (_this.type === 'child') {
        _this.limit = 50;
        _this.vals = _this.cleanVals(vals);
        _this.$el.trigger('start.update');
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
        _this.$el.trigger('start.search');
        _this.sendRequest('search');
      }
    });

    this.on('update.childs', function() {
      var _this = this;
      var model = _this.data.findWhere({'d$uuid': _this.selectRowUUID});
      if ((_this.child != null) && (_this.data != null)) {
        if (window[_this.child] != null) {
          if (model != null) {
            window[_this.child].trigger('update', model.toJSON() || {});
          } else {
            window[_this.child].trigger('clear');
          }
        }
      }
    });

    this.$el.on('scroll', function() {
      if (_this.$el.scrollTop() + _this.$el.height() === _this.$el.find('.container').height()) {
        _this.limit = _this.data.length + _this.step;
        _this.$el.trigger('start.scroll');
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
      _this.trigger('update.childs');
    });

    this.data.on('add', function(line) {
      _this.$worksheet.append(jade.templates.line_data({
        columns: _this.columns,
        fields:  _this.fields,
        line:    line.toJSON()
      }));
      _this.$el.trigger('add.line', line.toJSON());
    });

    this.data.on('remove', function(line) {
      _this.$worksheet.find("[data-uuid=\"" + line.get('d$uuid') + "\"]").remove();
      _this.$el.trigger('add.line', line.toJSON());
    });

    if (this.sid == 'DEVICE_DATA') {
      window.addDeviceValue = new AddDeviceValue({
        el:  this.el,
        sid: this.sid
      });
    }    

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
      classname = 'active';
    }

    this.$worksheet.find('tr').removeClass(classname);
    this.$activeLine = this.$worksheet.find("[data-uuid=\"" + this.selectRowUUID + "\"]");
    if (this.$activeLine != null) {
      this.$activeLine.addClass(classname);
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
      type = 'before';
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
        this.$worksheet.empty();
        this.data.reset();
        this.showLoading();
      break;
      case 'search':
        this.$worksheet.empty();
        this.data.reset();
        this.showLoading();
      break;
      case 'scroll':
        this.showLoading('after');
      break;
    }

    this.$el.trigger('request:' + type);

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
        this.trigger('update.childs');
      break;      
    }

    if (this.data.length < 1) {
      this.showInformationNotFound();
    }

    this.$el.trigger('response:' + type);

  }

});
