
var Common, Data, Select;

Common =   require('common');
Data =     require('data');

Select = Common.extend({
      selectfield:         '',

  el: "[data-view=\"select\"]",

  initialize: function() {
    var def, selectfield, _this;

    def = {
      sid:                 '',
      timeout:             10000,
      limit:               100,
      keys:                {},
      vals:                {},
      keyfieldname:        'd$uuid',
      selectfield:         '',
      renderItemSearch:    null,
      renderOptionSearch:  null
    };

    this.options = _.defaults(this.options, def);

    this.data = new Data();
    this.data.url = '/api/dict/' + this.options.sid;

    _this = this;

    selectfield = this.options.selectfield.toString().toLowerCase();

    this.$selectize = this.$el.selectize({
      maxItems:        1,
      maxOptions:      100,
      delimeter:       ',',
      valueField:      selectfield,
      searchField:     selectfield,
      load:            this.load(this),
      persist:         false,
      addPrecedence:   true,
      create: function(input) {
        return {
          value:         input,
          text:          input,
          selectcaption: input
        };
      },
      render: {
        item: function (item, escape) {
          if (item[_this.options.keyfieldname]) {
            if ((_this.options.renderItemSearch) && (_this.options.renderItemSearch !== selectfield)) {
              return _this.setLineVals(_this.options.renderItemSearch, item, escape);
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
          if (item[_this.options.keyfieldname]) {
            if ((_this.options.renderOptionSearch) && (_this.options.renderOptionSearch !== selectfield)) {
              return _this.setLineVals(_this.options.renderOptionSearch, item, escape);
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
    }

    _this.data.fetch({
      timeout: _this.options.timeout,
      data: {
        query: query                       || '',
        limit: _this.options.limit         || null,
        keys:  _this.options.keys          || {},
        vals:  _this.options.vals          || {}
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
  var selectize;
  selectize = this.$selectize[0].selectize;
  selectize.clearOptions();    
};

module.exports = Select;
