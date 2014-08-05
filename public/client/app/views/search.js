
var Common, Search, Select, Dict;

Dict =     require('dict');
Common =   require('common');
Select =   require('select');

Search = Common.extend({

  el: "[data-view=\"search\"]",

  initialize: function() {
    var def, _this;

    this.$query = this.$el.find('input');

    this.dict = new Dict(this.options.dict || {});

    this.select = new Select({
      el:   this.$query,
      dict: this.dict.toJSON()
    });

    _this = this;

    this.select.on('search', function() {
      _this.search();
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

Search.prototype.search = function() {
  var value, selectize;
  value = this.$query.val();
  this.select.clearOptions();
  this.trigger('search', value);
};

module.exports = Search;
