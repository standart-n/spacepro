
var Common, Search, Select;

Common =   require('common');
Select =   require('select');

Search = Common.extend({

  el: "[data-view=\"search\"]",

  initialize: function() {
    var def, _this;

    this.$select = this.$el.find('input');

    this.select = new Select({
      el:   this.$select,
      type: 'search',
      conf: this.options.conf || {}
    });

    _this = this;

    this.select.on('search', function(query) {
      _this.search(query);
    });    
  }
});

Search.prototype.getQuery = function() {
  return this.$select.val();
};

Search.prototype.clean = function() {
  this.$select.val('');
};

Search.prototype.focus = function() {
  this.$select.focus();
};

Search.prototype.search = function(query) {
  var value = query || this.$select.val();
  this.trigger('search', value);
};

module.exports = Search;
