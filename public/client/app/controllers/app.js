var Backbone;

Backbone =  require('backbone');

module.exports = Backbone.Router.extend({

  routes: {
    'auth/logout':   'logout',
  },

  initialize: function() {
  },

  logout: function() {
    $.ajax({
      url: '/api/auth/logout',
      timeout: 10000,
      success: function() {
        window.location.href = "/";
      }
    });
  }

});
