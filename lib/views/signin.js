
var Globals = require(process.env.APP_DIR + '/lib/views/globals');

var Signin = Globals.extend({

  defaults: {
    users: []
  },

  initialize: function() {
    // var req = this.get('req');
    var gettext = this.get('gettext');

    this.globals();
    
    this.set('title', "" + (this.get('title')) + " | " + (gettext('Signin')));
    
    this.addLocalCssFile('signin');
    this.addLocalJsLmdFile('signin');
    
    this.addLocaleString([
      'Server not found', 
      'Attention', 
      'Yes', 
      'Cancel', 
      'Dear user', 
      'Your session is opened on another workstation', 
      'Session is opened', 
      'It was incorrect to exit the program', 
      'Do you want to close the previous session and log in'
    ]);
  }
});

exports = module.exports = Signin;
