var Backbone;

window.JSON = require('json2');

require('jquery');

require('bootstrap');

Backbone = require('Backbone');

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
    return alert(JSON.stringify(s));
  };
  window.aid = function() {
    return Math.floor(Math.random() * Math.pow(10, 10));
  };
  Backbone.emulateHTTP = true;
  return Backbone.emulateJSON = true;
});
