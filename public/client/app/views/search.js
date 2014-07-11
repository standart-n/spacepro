var Common, Data, Search;

Common =   require('common');
Data =     require('data');

Search = Common.extend({

  el: "[data-view=\"search\"]",

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

    this.$query = this.$el.find('input');

    this.data = new Data();
    this.data.url = '/api/dict/' + this.options.sid;

    _this = this;

    selectfield = this.options.selectfield.toString().toLowerCase();

    this.$select = this.$query.selectize({
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

    this.$el.on('submit', function(e) {
      e.preventDefault();
    });

    this.$el.on('keyup', function(e) {
      if (e.keyCode === 13) {
        _this.search();
      }
    });
  }
});

Search.prototype.load = function(_this) {
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
        limit: _this.options.limit         || null,
        query: query                       || '',
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

Search.prototype.getQuery = function() {
  return this.$query.val();
};

Search.prototype.clean = function() {
  this.$query.val('');
};

Search.prototype.focus = function() {
  this.$query.focus();
};

Search.prototype.search = function() {
  var value, selectize;
  value = this.$query.val();
  this.trigger('search', value);
  selectize = this.$select[0].selectize;
  selectize.clearOptions();  
};

module.exports = Search;
