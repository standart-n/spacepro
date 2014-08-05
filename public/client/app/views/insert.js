
var _, Common, Data, Dict, Search;

Common =   require('common');
Data =     require('data');
Dict =     require('dict');
_ =        require('underscore');

Insert = Common.extend({

  el: "[data-view=\"search\"]",

  initialize: function() {
    var _this;

    this.dict = new Dict(this.options.dict || {});

    this.$body = this.$el.find("[data-type=\"modal-body\"]");

    this.checkFields();
  }

});

Insert.prototype.checkFields = function() {
  var controls, fields;

  controls = {};
  fields = this.options.addfields || {};

  _.each(fields, function(value, key) {
    var sid, template;
    if (value.toString().match(/WDICTS\./i)) {
      sid = value.toString().replace(/WDICTS\./i, '').replace(/\(.*\)/i, '').trim();
      controls.key = window[sid + '_data'] || {};
      controls.key.sid =  sid;
      // this.$body.append(jade.templates.insert_control(controls.key));
    }
  });
};


module.exports = Insert;

