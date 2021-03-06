

var Backbone = require('backbone');
var template_resolve = require('resolve.jade');

module.exports = Backbone.View.extend({

  el: "[data-view=\"resolve\"]",

  initialize: function() {
    var _this =    this;
    this.model =   window.user;

    this.on('resolve', function() {
      if (_this.model.get('session_success') === 0) {
        _this.$el.html(template_resolve(_this.model.toJSON()));
        _this.$modal = this.$el.find("[data-type=\"modal\"]");
        _this.$force = this.$el.find("[data-type=\"force\"]");
        _this.$modal.modal('show');

        _this.$force.on('click', function() {
          _this.$el.empty();
          window.app.navigate('signin/force', {
            trigger: true
          });
        });
      }
    });
    // this.model.on('change:session_success', function() {
    // });

    // $('document').on('click', "[data-type=\"force\"]", function() {
    //   _this.$modal.modal('show');
    // });

  }

});
