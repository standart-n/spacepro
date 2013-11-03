var Globals, Signin, exports;

Globals = require(process.env.APP_DIR + '/lib/views/globals');

Signin = Globals.extend({
  defaults: {
    users: []
  },
  initialize: function() {
    var req;
    req = this.get('req');
    this.globals();
    this.set('title', "" + (this.get('title')) + " | " + (req.gettext('Signin')));
    this.addLocalCssFile('signin');
    this.addLocalJsFile('signin');
    return this.addLocaleString(['Server not found', 'Attention', 'Yes', 'Cancel', 'Dear user', 'Your session is opened on another workstation', 'Session is opened', 'It was incorrect to exit the program', 'Do you want to close the previous session and log in']);
  }
});

exports = module.exports = Signin;
