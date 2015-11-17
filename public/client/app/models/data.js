
var Backbone =       require('backbone');
var Line_id =        require('line_id');
var Line_d$uuid =    require('line_d$uuid');
var Line_global_id = require('line_global_id');

var Data = Backbone.Collection.extend({

});

Data.prototype.setIdAttribute = function(attr) {

  if (attr === 'id') {
    this.model = Line_id;
  }

  if (attr === 'd$uuid') {
    this.model = Line_d$uuid;
  }

  if (attr === 'global_id') {
    this.model = Line_global_id;
  }

};

module.exports = Data;