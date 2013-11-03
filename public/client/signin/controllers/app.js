var Backbone, Resolve, Signin;

Backbone = require('backbone');

Signin = require('signin');

Resolve = require('resolve');

module.exports = Backbone.Router.extend({
  initialize: function() {
    this.signin = new Signin();
    return this.resolve = new Resolve();
  }
});
