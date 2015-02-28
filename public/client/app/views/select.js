
var Common, Data, Select;

Common =   require('common');
Data =     require('data');

Select = Common.extend({

  el: "[data-view=\"select\"]",

  initialize: function() {
    var _this;
    var searchfields = [];
    var plugins = [];
    var valuefield;
    var create;
    var selectOnTab = false;

    // this.dict = new Dict(this.options.conf || {});
    this.conf = this.options.conf || {};

    this.data = new Data();
    this.data.url = '/api/dict/' + this.conf.sid;

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
    console.log(this.conf.sid, this.selectfield, searchfields);

    switch (this.options.type) {
      case 'search':
        plugins =        ['restore_on_backspace'];
        valuefield =     'value';
        create =         this.create();
        selectOnTab =    true;
        break;
      default:
        plugins =        [];
        valuefield =     this.conf.returnfieldname;
        create =         false;
        selectOnTab =    false;
    }

    this.$select = this.$el.selectize({
      load:              this.load(this, searchfields),
      valueField:        valuefield,
      searchField:       searchfields,
      create:            create,
      plugins:           this.options.plugins           || plugins,
      preload:           this.options.preload           || true,
      maxItems:          this.options.maxItems          || 1,
      maxOptions:        this.options.maxOptions        || 20,
      delimeter:         this.options.delimeter         || ',',
      persist:           this.options.persist           || true,
      addPrecedence:     this.options.addPrecedence     || true,
      selectOnTab:       this.options.selectOnTab       || selectOnTab,
      allowEmptyOption:  this.options.allowEmptyOption  || true,      
      render: {
        item:            this.renderItem(searchfields),
        option:          this.renderOption(searchfields)
      }
    });

    if (this.$select[0]) {
      this.selectize = this.$select[0].selectize;
    }

    _this = this;

    if (this.selectize) {
      if (this.options.type === 'select') {
        // this.updateOptions();

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


Select.prototype.addOption = function(data) {
  if ((data) && (this.selectize)) {
    this.selectize.addOption(data);
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

Select.prototype.renderItem = function(searchfields) {
  var _this = this;
  return function (item, escape) {
    if (item[_this.conf.keyfieldname]) {
      if ((_this.conf.renderItemSearch) && (_this.conf.renderItemSearch !== _this.selectfield)) {
        return _this.setLineVals(_this.conf.renderItemSearch, item, escape);
      } else {
        if (item[_this.selectfield]) {
          return '<div>' + item[_this.selectfield] + '</div>';
        } else {
          return '<div>' + _this.setSearchFields(searchfields, item, escape) + '</div>';
        }
      }
    } else {
      return '<div>' + escape(item.value) + '</div>';
    }
  };
};

Select.prototype.renderOption = function(searchfields) {
  var _this = this;
  return function (item, escape) {
    if (item[_this.conf.keyfieldname]) {
      if ((_this.conf.renderOptionSearch) && (_this.conf.renderOptionSearch !== _this.selectfield)) {
        return _this.setLineVals(_this.conf.renderOptionSearch, item, escape);
      } else {
        if (item[_this.selectfield]) {
          return '<div>' + item[_this.selectfield] + '</div>';
        } else {
          return '<div>' + _this.setSearchFields(searchfields, item, escape) + '</div>';
        }
      }
    } else {
      return '<div>' + escape(item.value) + '</div>';
    }
  };
};

Select.prototype.load = function(_this, searchfields) {
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

    console.log(_this.conf.sid, query);

    _this.data.fetch({
      timeout: _this.options.timeout       || 1000,
      data: {
        query: query                       || '',
        limit: _this.options.limit         || 20,
        keys:  _this.conf.keys             || {},
        vals:  _this.conf.vals             || {}
      },
      success: function() {
        var data = _.map(_this.data.toJSON(), function(item) {
          var str = _this.setSearchFields(searchfields, item);
          item.value = str;
          item.text = str;
          return item;
        });
        fn(data);
      },
      error: function() {
        fn();
      }
    });
  };
};

Select.prototype.clearOptions = function() {
  if (this.selectize) {
    // this.selectize.clearOptions();
  }
};

module.exports = Select;
