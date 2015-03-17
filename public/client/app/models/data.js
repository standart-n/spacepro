
var Backbone =    require('backbone');
var Line_id =     require('line_id');
var Line_d$uuid = require('line_d$uuid');

var Data = Backbone.Collection.extend({

});

Data.prototype.setIdAttribute = function(attr) {

  if (attr === 'id') {
    this.model = Line_id;
  }

  if (attr === 'd$uuid') {
    this.model = Line_d$uuid;
  }

};

module.exports = Data;