
var Common, Data, Select, Dict;

Common =   require('common');
Data =     require('data');
Dict =     require('dict');

Select = Common.extend({

  el: "[data-view=\"select\"]",

  initialize: function() {
    var selectfield, cfselect, _this;

    this.dict = new Dict(this.options.dict || {});

    this.data = new Data();
    this.data.url = '/api/dict/' + this.dict.get('sid');

    _this = this;

    cfselect = this.dict.get('cfselect') || {};
    selectfield = cfselect.selectfieldexpression || '';
    if (selectfield !== '') {
      selectfield = selectfield.toString().toLowerCase();
    }

    console.log('>>>>', selectfield);

    this.$selectize = this.$el.selectize({
      maxItems:          1,
      maxOptions:        100,
      delimeter:         ',',
      valueField:        selectfield,
      searchField:       selectfield,
      load:              this.load(this),
      persist:           false,
      addPrecedence:     true,
      create: function(input) {
        console.log('create', input);
        return {
          value:         input,
          text:          input,
          selectcaption: input
        };
      },
      render: {
        item: function (item, escape) {
          console.log('---', item);
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
          console.log('---', item);
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

    $(document).on('submit', this.el, function(e) {
      e.preventDefault();
      _this.trigger('submit', _this.$el.val());
    });

    $(document).on('keyup', this.el, function(e) {
      if (e.keyCode === 13) {
        _this.trigger('search', _this.$el.val());
      }
    });
  }
});

Select.prototype.load = function(_this) {
  return function (query, fn) {
    if (!fn) {
      fn = function() {};
    }

    if (!query) {
      fn();
    } else {

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

    }
  };
};

Select.prototype.clearOptions = function() {
  var selectize;
  selectize = this.$selectize[0].selectize;
  selectize.clearOptions();    
};

module.exports = Select;
