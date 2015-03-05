var Backbone, Line;

var Backbone = require('backbone');
var Line =     require('line');

var Data = Backbone.Collection.extend({

  model: Line

});

Data.prototype.setIdAttribute = function(attr) {

	this.model.prototype.idAttribute = attr;

};

module.exports = Data;