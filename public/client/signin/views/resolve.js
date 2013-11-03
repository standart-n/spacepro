var Backbone;

Backbone = require('backbone');

module.exports = Backbone.View.extend({

  el: "[data-view=\"resolve\"]",

  initialize: function() {
    var _this = this;
    this.model = window.user;
    this.model.on('change:session_success', function() {
      if (_this.model.get('session_success') === 0) {
        _this.$el.html(jade.templates.resolve(_this.model.toJSON()));
        _this.$modal = _this.$el.find("[data-type=\"modal\"]");
        _this.$modal.modal('show');
      }
    });
  }

});
