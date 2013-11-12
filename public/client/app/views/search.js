var Backbone;

Backbone = require('backbone');

module.exports = Backbone.View.extend({

  el: "[data-view=\"search\"]",

  initialize: function() {
    var _this = this;

    this.dict =   this.$el.data("search-dict");
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

  search: function() {
    if (this.dict != null){
      if (window.app[this.dict] != null) {
        window.app[this.dict].trigger('search', this.$query.val());
      }
    }
  }


});
