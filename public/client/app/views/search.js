var Backbone;

Backbone = require('backbone');

module.exports = Backbone.View.extend({

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

  },

  clean: function() {
    this.$query.val('').focus();
  },

  search: function() {
    this.trigger('search', this.$query.val());
  }


});
