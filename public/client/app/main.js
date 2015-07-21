
window.JSON = require('json2');
window.jade = require('runtime');

require('jquery');
// require('jquery-ui');
require('bootstrap');
require('selectize');
require('moment');
require('store');
require('datepicker');
require('timepicker');
require('noty');

window.jade.templates = {};
window.jade.templates.line_data =        require('line_data.jade');
window.jade.templates.line_nothing =     require('line_nothing.jade');
window.jade.templates.line_error =       require('line_error.jade');
window.jade.templates.line_loading =     require('line_loading.jade');
window.jade.templates.insert_select =    require('insert_select.jade');
window.jade.templates.insert_default =   require('insert_default.jade');
window.jade.templates.edit_default =     require('edit_default.jade');
window.jade.templates.edit_header =      require('edit_header.jade');
window.jade.templates.edit_select =      require('edit_select.jade');
window.jade.templates.edit_groups =      require('edit_groups.jade');
window.jade.templates.edit_text =        require('edit_text.jade');
window.jade.templates.edit_date =        require('edit_date.jade');

var Backbone =    require('backbone');
var App =         require('app');

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
