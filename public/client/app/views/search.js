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
    var dict = this.dict;
    if (dict != null){
      if (window[dict] != null) {
        window[dict].trigger('search', this.$query.val());
      }
    }
  }


});
