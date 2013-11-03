
var App, Backbone, User;

window.JSON = require('json2');
window.jade = require('jade');

window.jade.templates = {};

require('jquery');
require('bootstrap');
require('moment');

require('resolve.tpl');

Backbone =  require('backbone');
App =       require('app');
User =      require('user');

$(function() {

  if (window.console == null) {
    window.console = {
      info: function() {},
      log: function() {},
      error: function() {},
      warn: function() {}
    };
  }
  
  window.jalert = function(s) {
    alert(JSON.stringify(s));
  };
  
  window.gettext = function(msgid) {
    var msgstr, _ref;
    if (((_ref = window.json_locale_data) != null ? _ref.messages[msgid] : void 0) != null) {
      if (window.json_locale_data.messages[msgid].length > 1) {
        msgstr = window.json_locale_data.messages[msgid][1];
      }
    }
    if (msgstr == null) {
      msgstr = msgid;
    }
    return msgstr;
  };

  window.aid = function() {
    return Math.floor(Math.random() * Math.pow(10, 10));
  };

  window.lang = $('html').attr('lang');

  if (window.lang !== 'en') {
    require("moment-" + window.lang);
    moment.lang(window.lang);
  }

  Backbone.emulateHTTP = true;
  Backbone.emulateJSON = true;

  window.user = new User();
  window.app = new App();
  
  Backbone.history.start();

});
