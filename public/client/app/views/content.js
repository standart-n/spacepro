var Backbone;

Backbone = require('backbone');

module.exports = Backbone.View.extend({

  el: "#content",

  initialize: function() {
    var _this = this;

    this.$main =   this.$el.find('#main');
    this.$bottom = this.$el.find('#bottom');

    this.$el.on('transform', function() {    
      
      var left = _this.$el.offset().left + 10;

      _this.$main.css({
        left: left
      });

      _this.$bottom.css({
        left: left
      });

    });

    this.$el.trigger('transform');

  }

});
