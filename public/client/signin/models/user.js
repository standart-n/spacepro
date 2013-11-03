
var Backbone;

Backbone = require('backbone');

module.exports = Backbone.Model.extend({
  defaults: {
    login:    '',
    password: ''
  },
  initialize: function() {},
  reset: function() {
    this.unset('result');
    this.unset('error');
    this.unset('id');
    this.unset('name');
    this.unset('session_id');
    this.unset('session_success');
    this.unset('session_startdt');
    this.unset('workstation_id');
    this.unset('workstation_name');
  }
});
