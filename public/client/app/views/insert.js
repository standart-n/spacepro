
var _, Common, Data, Dict, Search, Select;

Common =   require('common');
Data =     require('data');
Dict =     require('dict');
Select =   require('select');
_ =        require('underscore');

Insert = Common.extend({

  el: "[data-view=\"insert\"]",

  initialize: function() {
    var _this;

    this.dict = new Dict(this.options.dict || {});

    this.$body = this.$el.find("[data-type=\"modal-body\"]");

    this.checkFields();
  }

});

Insert.prototype.checkFields = function() {
  var controls, fields, _this;

  _this = this;
  controls = {};
  fields = this.dict.get('addfields') || {};

  _.each(fields, function(value, key) {
    var id, sid, dict, conf, select;
    if (value.toString().match(/WDICTS\./i)) {
      sid = value.toString().replace(/WDICTS\./i, '').replace(/\(.*\)/i, '').trim();
      id = _this.dict.get('sid') + "_" + sid;
      conf = window[sid + '_data'];
      if ((conf !== null) && (conf.privileges.S !== false)) {
        dict = new Dict(conf);
        _this.$body.append(jade.templates.insert_control({
          id:   id,
          dict: dict.toJSON()
        }));
        select = new Select({
          el:   "[data-control=\"" + id + "\"]",
          type: 'select',
          dict: dict.toJSON()
        });
        select.on('select', function(value) {
          alert(dict.get('sid') + ' ' + value);
        });
      }
    }
  });
};

module.exports = Insert;

