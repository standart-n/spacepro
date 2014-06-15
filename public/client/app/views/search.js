var Backbone, Search;

Backbone = require('backbone');

Search = Backbone.View.extend({

  el: "[data-view=\"search\"]",

  initialize: function() {
    var _this = this;

    this.$query = this.$el.find('input');

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
  this.trigger('search', this.$query.val());
};

module.exports = Search;
