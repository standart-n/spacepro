
var _, Common, Data, Search;

Common =   require('common');
Data =     require('data');
_ =        require('underscore');

Insert = Common.extend({

  el: "[data-view=\"search\"]",

  initialize: function() {
    var def, selectfield, _this;

    def = {
      sid:                 '',
      timeout:             10000,
      limit:               100,
      keys:                {},
      vals:                {},
      keyfieldname:        'd$uuid',
      addfields :          {}
    };

    this.options = _.defaults(this.options, def);

    this.$body = this.$el.find("[data-type=\"modal-body\"]");

    this.checkFields();
  }

});

Insert.prototype.checkFields = function() {
  var fields;

  fields = this.options.addfields || {};

  _.each(fields, function(value, key) {
    console.log('value', value);
    console.log('key', key);
  });
};


module.exports = Insert;

