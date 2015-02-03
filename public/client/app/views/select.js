
var Common, Data, Select, Dict;

Common =   require('common');
Data =     require('data');
Dict =     require('dict');

Select = Common.extend({

  el: "[data-view=\"select\"]",

  initialize: function() {
    var selectfield, valuefield, selectize, cfselect, load, _this;

    this.dict = new Dict(this.options.dict || {});

    this.data = new Data();
    this.data.url = '/api/dict/' + this.dict.get('sid');

    _this = this;

    cfselect = this.dict.get('cfselect') || {};
    selectfield = cfselect.selectfieldexpression || '';
    if (selectfield !== '') {
      selectfield = selectfield.toString().toLowerCase();
    }

    valuefield = this.options.type === 'search' ? selectfield : this.dict.get('returnfieldname');

    this.$select = this.$el.selectize({
      maxItems:          1,
      maxOptions:        100,
      delimeter:         ',',
      valueField:        valuefield,
      searchField:       selectfield,
      load:              this.load(this),
      persist:           false,
      addPrecedence:     true,
      create: function(input) {
        return {
          value:         input,
          text:          input,
          selectcaption: input
        };
      },
      render: {
        item: function (item, escape) {
          if (item[_this.dict.get('keyfieldname')]) {
            if ((_this.dict.get('renderItemSearch')) && (_this.dict.get('renderItemSearch') !== selectfield)) {
              return _this.dict.setLineVals(_this.dict.get('renderItemSearch'), item, escape);
            } else {
              if (item[selectfield]) {
                return '<div>' + item[selectfield] + '</div>';
              } else {
                return '<div>' + selectfield + '</div>';
              }
            }
          } else {
            return '<div>' + escape(item.value) + '</div>';
          }
        },
        option: function (item, escape) {
          if (item[_this.dict.get('keyfieldname')]) {
            if ((_this.dict.get('renderOptionSearch')) && (_this.dict.get('renderOptionSearch') !== selectfield)) {
              return _this.dict.setLineVals(_this.dict.get('renderOptionSearch'), item, escape);
            } else {
              if (item[selectfield]) {
                return '<div>' + item[selectfield] + '</div>';
              } else {
                return '<div>' + selectfield + '</div>';
              }
            }
          } else {
            return '<div>' + escape(item.value) + '</div>';
          }
        }        
      }
    });

    if (this.$select[0]) {
      this.selectize = this.$select[0].selectize;
    }

    _this = this;

    if (this.selectize) {
      if (this.options.type === 'select') {
        this.updateOptions();

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

Select.prototype.load = function(_this) {
  return function (query, fn) {
    if (!fn) {
      fn = function() {};
    }

    if (!query) {
      return fn();
    }

    if (query === '***') {
      query = '';
    }

    _this.dict.set('query', query);

    _this.data.fetch({
      timeout: _this.dict.get('timeout'),
      data: {
        query: _this.dict.get('query')     || '',
        limit: _this.dict.get('limit')     || null,
        keys:  _this.dict.get('keys')      || {},
        vals:  _this.dict.get('vals')      || {}
      },
      success: function() {
        fn(_this.data.toJSON());
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
