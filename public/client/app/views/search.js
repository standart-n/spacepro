
var Common =   require('common');
var Select =   require('select');

var Search = Common.extend({

  el: "[data-view=\"search\"]",

  initialize: function() {
    var _this = this;

    this.$select = this.$el.find('input');

    this.$select.on('keyup', function(e) {
      e.preventDefault();
      if (e.keyCode === 13) {
        _this.trigger('search', _this.$select.val());
      }
    });

    // this.select = new Select({
    //   el:   this.$select,
    //   type: 'search',
    //   conf: this.options.conf || {}
    // });

    // _this = this;

    // this.select.on('search', function(query) {
    //   _this.search(query);
    // });    
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
