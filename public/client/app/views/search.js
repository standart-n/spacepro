
var Common, Search, Select;

Common =   require('common');
Select =   require('select');

Search = Common.extend({

  el: "[data-view=\"search\"]",

  initialize: function() {
    var def, _this;

    def = {
      sid:                 '',
      keyfieldname:        'd$uuid',
      selectfield:         '',
      renderItemSearch:    null,
      renderOptionSearch:  null
    };

    this.$query = this.$el.find('input');

    this.options =     _.defaults(this.options, def);
    this.options.el =  this.$query;

    this.select = new Select(this.options);

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
