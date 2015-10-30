
window.JSON = require('json2');
window.jade = require('runtime');


require('jquery');
require('bootstrap');
require('moment');
require('cookie');

var Backbone =  require('backbone');
var App =       require('app');
var User =      require('user');

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
  
  window.gettext = function(msgid, json_locale_data) {
    var msgstr, data;
    data = json_locale_data || window.json_locale_data || {};
    if (data.messages != null) {
      if (data.messages[msgid] != null) {
        if (typeof(data.messages[msgid]) == 'string') {
          msgstr = data.messages[msgid];
        } else {
          if (data.messages[msgid].length > 1) {
            msgstr = data.messages[msgid][1];
          }
        }
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
