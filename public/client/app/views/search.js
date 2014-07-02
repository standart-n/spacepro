var Backbone, Data, Search;

Backbone = require('backbone');
Data =     require('data');

Search = Backbone.View.extend({

  el: "[data-view=\"search\"]",

  initialize: function() {
    var def, _this = this;

    def = {
      sid:                 '',
      timeout:             10000,
      limit:               100,
      keys:                {},
      vals:                {},
      keyfieldname:        'd$uuid'
    };

    this.options = _.defaults(this.options, def);

    this.$query = this.$el.find('input');

    this.data = new Data();
    this.data.url = '/api/dict/' + this.options.sid;

    this.$select = this.$query.selectize({
      maxItems:        1,
      maxOptions:      100,
      delimeter:       ',',
      valueField:      'selectcaption',
      searchField:     'selectcaption',
      load:             this.load(this),
      persist:          false,
      addPrecedence:    true,
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
            return '<div>' + escape(item.street) + ' д' + escape(item.nomer) + ' к' + escape(item.apartment) + '</div>';
          } else {
            return '<div>' + escape(item.value) + '</div>';
          }
        },
        option: function (item, escape) {
          if (item[_this.options.keyfieldname]) {
            return '<div>' + escape(item.street) + ' д' + escape(item.nomer) + ' к' + escape(item.apartment) + '</div>';
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
  var selectize;
  this.trigger('search', this.$query.val());
  selectize = this.$select[0].selectize;
  selectize.clearOptions();  
};

module.exports = Search;
