
window.JSON = require('json2');
window.jade = require('runtime');

require('units');
require('jquery');
// require('jquery-ui');
require('bootstrap');
require('selectize');
require('moment');
require('store');
require('datepicker');
require('timepicker');
require('noty');
require('cookie');

var Backbone =    require('backbone');
var App =         require('app');

// console.log('user_id', $.cookie('user_id'));

$(function() {

  // $.noty({
  //   text:"This is an alert",
  //   layout:"topCenter",
  //   type:"alert",
  //   closeButton:false,
  //   timeout:2000
  // });

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
    gr.replace(/(-?\d+)=\{(\d+)\|(-?\d+)\}([\D]+)/ig, function(text, id, color, icon, caption) {
      groups.push({
        id:       id                       || 0,
        color:    color                    || '',
        hex:      window.colorToHex(color) || "#ccc",
        icon:     icon                     || -1,
        caption:  caption                  || ''
      });
    });
    return groups;
  };

  window.guid = function() {
    var s4 = function() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    };
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
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
