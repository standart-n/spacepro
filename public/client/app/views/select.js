

var _ =        require('_');
var Common =   require('common');
// var Data =     require('data');

var Select = Common.extend({

  el: "[data-view=\"select\"]",

  initialize: function() {
    var _this;
    var plugins = [];
    var valuefield;
    var create;
    var selectOnTab = false;
    var preload = true;

    // this.dict = new Dict(this.options.conf || {});
    this.conf = this.options.conf || {};

    // this.data = new Data();
    // this.data.url = '/api/dict/' + this.conf.sid;

    this.searchfields = [];
    this.columns =      this.conf.columns || {};
    this.fields =       _.pluck(this.columns, 'field') || [];

    this.cfselect = this.conf.cfselect || {};
    this.selectfield = this.cfselect.selectfieldexpression || '';
    if (this.selectfield !== '') {
      this.selectfield = this.selectfield.toString().toLowerCase();
    }

    // if (this.fields.length < 1) {
    //   this.fields.push(this.selectfield);
    // }

    this.getSearchfields();

    _this = this;

  
    // console.log(this.conf.sid, this.selectfield, searchfields);

    switch (this.options.type) {
      case 'search':
        plugins =        ['restore_on_backspace'];
        valuefield =     'value';
        create =         this.create();
        selectOnTab =    true;
        preload =        false;
      break;
      case 'select':
        plugins =        [];
        valuefield =     this.conf.returnfieldname;
        create =         false;
        selectOnTab =    false;
        preload =        true;
      break;
      case 'folders':
        plugins =        [];
        valuefield =     'id';
        create =         false;
        selectOnTab =    false;
        preload =        false;
      break;
      case 'filters':
        plugins =        [];
        valuefield =     'id';
        create =         false;
        selectOnTab =    false;
        preload =        false;
      break;
    }

    this.$select = this.$el.selectize({
      load:              this.load(this),
      valueField:        valuefield,
      searchField:       this.searchfields,
      create:            create,
      plugins:           this.options.plugins           || plugins,
      preload:           this.options.preload           || preload,
      maxItems:          this.options.maxItems          || 1,
      maxOptions:        this.options.maxOptions        || 20,
      delimeter:         this.options.delimeter         || ',',
      persist:           this.options.persist           || true,
      addPrecedence:     this.options.addPrecedence     || true,
      selectOnTab:       this.options.selectOnTab       || selectOnTab,
      allowEmptyOption:  this.options.allowEmptyOption  || true,      
      render: {
        item:            this.renderItem(),
        option:          this.renderOption()
      }
    });

    if (this.$select[0]) {
      this.selectize = this.$select[0].selectize;
    }

    _this = this;

    if (this.selectize) {
      if ((this.options.type === 'select') || (this.options.type === 'folders') || (this.options.type === 'filters')) {
        this.selectize.on('change', function(value) {
          _this.trigger('select', value);
        });
      }

      if (this.options.type === 'search') {
        this.selectize.on('item_add', function(value) {
          _this.trigger('search', value);
        });

        this.selectize.on('item_remove', function() {
          _this.trigger('search', '');
        });
      }
    }
  }
});

Select.prototype.getSearchfields = function() {
  var _this = this;
  _.each(this.fields, function(value, key) {
    var re1 = new RegExp("^" + value, 'ig');
    var re2 = new RegExp("\\W" + value, 'ig');
    if ((_this.selectfield.match(re1)) || (_this.selectfield.match(re2))) {
      if (!_this.searchfields.value) {
        _this.searchfields.push(value);
      }
    }
  });
};

Select.prototype.setSearchFields = function(fields, line, escape) {
  var str = '';

  if (fields == null) {
    fields = [];
  }

  if (line == null) {
    line = {};
  }

  _.each(fields, function(value, key) {
    if (line[value]) {
      str = str + line[value] + ' ';
    }
  });

  return str;
};

Select.prototype.addItem = function(item, silent) {
  if (silent == null) {
    silent = true;
  }
  if ((item) && (this.selectize)) {
    this.selectize.addItem(item, false);
  }
};

Select.prototype.addOption = function(data) {
  if ((data) && (this.selectize)) {
    this.selectize.addOption(this.checkDataItem(data));
  }
};

Select.prototype.addOptions = function(data) {
  var _this = this;
  if ((data) && (this.selectize)) {
    _.each(data, function(item) {
      _this.selectize.addOption(_this.checkDataItem(item));
    });
  }
};

Select.prototype.updateOptions = function() {
  var load, _this;
  _this = this;
  load = this.load(this);
  load('***', function(data) {
    if ((data) && (_this.selectize)) {
      _this.selectize.addOption(data);
    }
  });
};

Select.prototype.getValue = function() {
  if (this.selectize) {
    return this.selectize.getValue();
  }
};

Select.prototype.create = function() {
  return function(input) {
    return {
      value:         input,
      text:          input,
      selectcaption: input
    };
  };
};

Select.prototype.renderItem = function() {
  var _this = this;
  var result;
  return function (item, escape) {
    switch (_this.options.type) {
      case 'folders':
        result = '<div>' + _this.renderFolder(item, escape) + '</div>';
      break;
      case 'filters':
        result = '<div>' + _this.renderFilter(item, escape) + '</div>';
      break;
      default:
        // if (item[_this.conf.keyfieldname]) {
        if (typeof(item) === 'object') {
          if ((_this.conf.renderitemsearch !== '') && (_this.conf.renderitemsearch !== _this.selectfield)) {
            result = _this.setLineVals(_this.conf.renderitemsearch, item, escape);
          } else {
            if (item[_this.selectfield]) {
              result = '<div>' + item[_this.selectfield] + '</div>';
            } else {
              result = '<div>' + _this.setSearchFields(_this.searchfields, item, escape) + '</div>';
            }
          }
        } else {
          result = '<div>' + escape(item.value) + '</div>';
        }
    }
    return result;
  };
};

Select.prototype.renderOption = function() {
  var _this = this;
  var result;
  return function (item, escape) {
    switch (_this.options.type) {
      case 'folders':
        result = '<div>' + _this.renderFolder(item, escape) + '</div>';
      break;
      case 'filters':
        result = '<div>' + _this.renderFilter(item, escape) + '</div>';
      break;
      default:
        if (typeof(item) === 'object') {
          if ((_this.conf.renderoptionsearch !== '') && (_this.conf.renderoptionsearch !== _this.selectfield)) {
            result = _this.setLineVals(_this.conf.renderoptionsearch, item, escape);
          } else {
            if (item[_this.selectfield]) {
              result = '<div>' + item[_this.selectfield] + '</div>';
            } else {
              result = '<div>' + _this.setSearchFields(_this.searchfields, item, escape) + '</div>';
            }
          }
        } else {
          result = '<div>' + escape(item.value) + '</div>';
        }
    }
    return result;
  };
};

Select.prototype.renderFolder = function(item, escape) {
  var color;
  var str = "";
  if (item.color) {
    color = window.colorToHex(item.color);
  } else {
    color = 'f5f5f5';
  }
  str += '<span class="label" style="color:#000;background-color:#' + color + ';">&nbsp;</span>&nbsp;&nbsp;';
  // str += escape(item.depth) + ' ';
  // str += escape(item.id) + ' ';
  str += escape(item.caption);
  return str;
};

Select.prototype.renderFilter = function(item, escape) {
  var str = escape(item.caption);
  return str;
};

Select.prototype.load = function(_this) {
  return function (query, fn) {
    if (!fn) {
      fn = function() {};
    }

    // if (!query) {
    //   return fn();
    // }

    if (query === '***') {
      query = '';
    }

    $.ajax({
      type: "GET",
      url: '/api/dict/' + _this.conf.sid,
      dataType: 'json',
      timeout: _this.options.timeout       || 1000,
      data: {
        query: query                       || '',
        limit: _this.options.limit         || 20,
        keys:  _this.conf.keys             || {},
        vals:  _this.conf.vals             || {}
      },
      success: function(res) {
        if (!res.err) {
          fn(_this.checkData(res.data));
        }
      },
      error: function() {
        fn();
      }
    });

  };
};

Select.prototype.checkData = function(data) {
  var _this = this;
  if (typeof(data) === 'object') {
    _.map(data, function(item) {
      return _this.checkDataItem(item);
    });    
  }
  return data;
};

Select.prototype.checkDataItem = function(item) {
  var str = '';
  if (typeof(item) === 'object') {
    if ((this.searchfields.length < 1) && (this.fields.length < 1)) {
      this.fields = _.keys(item);
      this.getSearchfields();
    }

    switch (this.options.type) {
      case 'folders':
        str = item.caption;
        item.value = str;
        item.text = str;
      break;
      case 'filters':
        str = item.caption;
        item.value = str;
        item.text = str;
      break;
      default: 
        str = this.setSearchFields(this.searchfields, item);
        item.value = str;
        item.text = str;
    }
  }
  return item;
};

Select.prototype.clearOptions = function() {
  if (this.selectize) {
    this.selectize.clearOptions();
  }
};

module.exports = Select;
