var Backbone, Resolve, Signin;

Backbone =  require('backbone');
Signin =    require('signin');
Resolve =   require('resolve');

module.exports = Backbone.Router.extend({

  routes: {
    'signin/force':   'force',
    'signin/resolve': 'resolve'
  },

  initialize: function() {
    this.signin = new Signin();
    this.resolve = new Resolve();
  },

  force: function() {
    this.signin.trigger('force');
  },

  resolve: function() {
    this.resolve.trigger('resolve');
  }

});
