
var Backbone;

Backbone = require('backbone');

module.exports = Backbone.Model.extend({

  defaults: function() {
    return {
      columns:        {},
      fields:         {},
      data:           {},
      keys:           {},
      vals:           {},
      childs:         {},
      selectRowUUID:  ''
    };
  },

  initialize: function() {
  }    

});
