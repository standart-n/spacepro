var Backbone, App, AddDeviceValues;

window.JSON = require('json2');
window.jade = require('jade');

window.jade.templates = {};

require('jquery');
// require('jquery-ui');
require('bootstrap');
require('selectize');
require('moment');

require('line_data.jade');
require('line_nothing.jade');
require('line_error.jade');
require('line_loading.jade');
require('insert_control.jade');

// alert('loading_' + typeof(jade.templates.line_loading));

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

  window.colorToHex = function(c) {
    var x='00000'+(((c&0xff)<<16)+(c&0xff00)+(c>>16)).toString(16);
    return x.slice(-6);               
  };

  window.parseGroupLine = function(gr) {
    var groups = [];
    gr.replace(/(-?\d+)=\{(\d+)\|(-?\d+)\}([\D]+)/ig, function(text, id, color, icon, title) {
      groups.push({
        id:       id                       || 0,
        color:    window.colorToHex(color) || "#ccc",
        icon:     icon                     || -1,
        title:    title                    || ''
      });
    });
    return groups;
  };

  window.aid = function() {
    return Math.floor(Math.random() * Math.pow(10, 10));
  };

  window.lang = $('html').attr('lang');

  if (window.lang !== 'en') {
    require("moment-" + window.lang);
    moment.lang(window.lang);
  }

  // Backbone.emulateHTTP = true;
  // Backbone.emulateJSON = true;

  window.app = new App();

  Backbone.history.start();

});
