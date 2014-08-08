
var Common, Search, Select, Dict;

Dict =     require('dict');
Common =   require('common');
Select =   require('select');

Search = Common.extend({

  el: "[data-view=\"search\"]",

  initialize: function() {
    var def, _this;

    this.$query = this.$el.find('input');

    this.select = new Select({
      el:   this.$query,
      type: 'search',
      dict: this.options.dict || {}
    });

    _this = this;

    this.select.on('search', function(query) {
      _this.search(query);
    });

  }
});

Search.prototype.getQuery = function() {
  return this.$query.val();
};

Search.prototype.clean = function() {
  this.$query.val('');
};

Search.prototype.focus = function() {
  this.$query.focus();
};

Search.prototype.search = function(query) {
  var value, selectize;
  value = query || this.$query.val();
  this.select.clearOptions();
  this.trigger('search', value);
};

module.exports = Search;
