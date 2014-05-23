
var Backbone, App, AddDeviceValues;

window.JSON = require('json2');
window.jade = require('jade');

window.jade.templates = {};

require('jquery');
// require('jquery-ui');
require('bootstrap');
require('moment');

require('line_data.jade');
require('line_nothing.jade');
require('line_error.jade');
require('line_loading.jade');

Backbone =    require('backbone');
App =         require('app');

$(function() {

  if (window.console == null) {
    window.console = {
      info:   function() {},
      log:    function() {},
      error:  function() {},
      warn:   function() {}
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
        if (data.messages[msgid].length > 1) {
          msgstr = data.messages[msgid][1];
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

  window.app = new App();

  Backbone.history.start();

});
