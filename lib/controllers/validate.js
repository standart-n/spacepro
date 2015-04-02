
var Backbone = require('backbone');
var validate = require('validate');

var Validate = Backbone.Model.extend({

  defaults: {
    schema:   '',
    data:     {},
    errors:   [],
    result:   false
  },

  initialize: function() {
    this.checkout();
  }
});

Validate.prototype.checkout = function() {
  var error, errors, _i, _len;
  var schema = require(process.env.APP_DIR + '/lib/validates/' + this.get('schema'));
  var result = validate(schema, this.get('data'));
  if (Array.isArray(result)) {
    errors = [];
    for (_i = 0, _len = result.length; _i < _len; _i++) {
      error = result[_i];
      errors.push(error.toString().replace('Error: ', ''));
    }
    this.set('errors', errors);
    this.set('result', false);
  } else {
    this.set('result', true);
  }
};

Validate.prototype.check = function() {
  return this.get('result');
};

Validate.prototype.result = function() {
  return this.get('result');
};

Validate.prototype.errors = function() {
  return this.get('errors');
};

exports = module.exports = Validate;
