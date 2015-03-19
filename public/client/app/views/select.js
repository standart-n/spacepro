

var _ =        require('_');
var Common =   require('common');
// var Data =     require('data');

var Select = Common.extend({

  el: "[data-view=\"select\"]",

  initialize: function() {
    var _this;
    var searchfields = [];
    var plugins = [];
    var valuefield;
    var create;
    var selectOnTab = false;
    var preload = true;

    // this.dict = new Dict(this.options.conf || {});
    this.conf = this.options.conf || {};

    // this.data = new Data();
    // this.data.url = '/api/dict/' + this.conf.sid;

    this.columns = this.conf.columns || {};
    this.fields =  _.pluck(this.columns, 'field') || {};

    this.cfselect = this.conf.cfselect || {};
    this.selectfield = this.cfselect.selectfieldexpression || '';
    if (this.selectfield !== '') {
      this.selectfield = this.selectfield.toString().toLowerCase();
    }

    _this = this;

    _.each(this.fields, function(value, key) {
      var re1 = new RegExp("^" + value, 'ig');
      var re2 = new RegExp("\\W" + value, 'ig');
      if ((_this.selectfield.match(re1)) || (_this.selectfield.match(re2))) {
        searchfields.push(value);
      }
    });

    this.searchfields = searchfields;

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
      if ((this.options.type === 'select') || (this.options.type === 'folders')) {
        console.log('this.options.type:', this.options.type);
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

Select.prototype.setLineVals = function(str, line, escape) {

  if (str == null) {
    str = '';
  }

  if (line == null) {
    line = {};
  }

  _.each(line, function(value, key) {
    var re, pattern;
    if (typeof value === 'string') {
      if (typeof escape === 'function') {
        value = escape(value.toString().trim());
      } else {
        value = "'" + value.trim() + "'";
      }
    }
    key =      key.replace(/\$/gi, "\\$");
    pattern =  ':' + key;
    re =       new RegExp(pattern, 'ig');
    str =      str.replace(re, value);
  });

  return str;
};

Select.prototype.setSearchVals = function(str, line, escape) {

  if (str == null) {
    str = '';
  }

  if (line == null) {
    line = {};
  }

  _.each(line, function(value, key) {
    var re, pattern;
    if (typeof value === 'string') {
      if (typeof escape === 'function') {
        value = escape(value.toString().trim());
      } else {
        value = "" + value.toString().trim() + "";
      }
    }
    key =      key.replace(/\$/gi, "\\$");
    pattern =  key;
    re =       new RegExp(pattern, 'ig');
    str =      str.replace(re, value);
  });

  str = str.replace(/\|\|/gi, "");
  str = str.replace(/\'\ \'/gi, " ");

  return str;
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
  return function (item, escape) {
    if (_this.options.type !== 'folders') {
      if (item[_this.conf.keyfieldname]) {
        if ((_this.conf.renderitemsearch !== '') && (_this.conf.renderitemsearch !== _this.selectfield)) {
          return _this.setLineVals(_this.conf.renderitemsearch, item, escape);
        } else {
          if (item[_this.selectfield]) {
            return '<div>' + item[_this.selectfield] + '</div>';
          } else {
            return '<div>' + _this.setSearchFields(_this.searchfields, item, escape) + '</div>';
          }
        }
      } else {
        return '<div>' + escape(item.value) + '</div>';
      }
    } else {
      return '<div>' + _this.renderFolder(item, escape) + '</div>';
    }
  };
};

Select.prototype.renderOption = function() {
  var _this = this;
  return function (item, escape) {
    if (_this.options.type !== 'folders') {
      if (item[_this.conf.keyfieldname]) {
        if ((_this.conf.renderoptionsearch !== '') && (_this.conf.renderoptionsearch !== _this.selectfield)) {
          return _this.setLineVals(_this.conf.renderoptionsearch, item, escape);
        } else {
          if (item[_this.selectfield]) {
            return '<div>' + item[_this.selectfield] + '</div>';
          } else {
            return '<div>' + _this.setSearchFields(_this.searchfields, item, escape) + '</div>';
          }
        }
      } else {
        return '<div>' + escape(item.value) + '</div>';
      }
    } else {
      return '<div>' + _this.renderFolder(item, escape) + '</div>';
    }
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
      success: function(data) {
        fn(_this.checkData(data));
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
    str = this.setSearchFields(this.searchfields, item);
    item.value = str;
    item.text = str;
  }
  return item;
};

Select.prototype.clearOptions = function() {
  if (this.selectize) {
    this.selectize.clearOptions();
  }
};

module.exports = Select;
