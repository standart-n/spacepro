var Backbone;

Backbone = require('backbone');

module.exports = Backbone.View.extend({

  el: "[data-view=\"search\"]",

  initialize: function() {
    var _this = this;

    this.$query = this.$el.find('input');

    this.$el.on('submit', function(e) {
      e.preventDefault();
      _this.search();
    });

  },

  search: function() {
    window.app.navigate('search/' + this.$query.val(), {
      trigger: true
    });
  }


});
