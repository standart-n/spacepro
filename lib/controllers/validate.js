var Backbone, exports, validate;

Backbone = require('backbone');

validate = require('validate');

exports = module.exports = Backbone.Model.extend({
  defaults: {
    schema: '',
    data: {},
    errors: [],
    result: false
  },
  initialize: function() {
    return this.checkout();
  },
  checkout: function() {
    var error, errors, result, schema, _i, _len;
    schema = require(process.env.APP_DIR + '/lib/validates/' + this.get('schema'));
    result = validate(schema, this.get('data'));
    if (Array.isArray(result)) {
      errors = [];
      for (_i = 0, _len = result.length; _i < _len; _i++) {
        error = result[_i];
        errors.push(error.toString().replace('Error: ', ''));
      }
      this.set('errors', errors);
      return this.set('result', false);
    } else {
      return this.set('result', true);
    }
  },
  check: function() {
    return this.get('result');
  },
  result: function() {
    return this.get('result');
  },
  errors: function() {
    return this.get('errors');
  }
});
