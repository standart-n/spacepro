
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

    this.$body =   this.$el.find("[data-type=\"modal-body\"]");
    this.$form =   this.$el.find("[data-view=\"form\"]");
    this.$button = this.$el.find("[data-type=\"button\"]");

    this.controls = {};
    this.autoinsert = true;
    this.checkFields();

    _this = this;

    this.$button.on('click', function() {
      _this.request();
    });
  }
});

Insert.prototype.checkFields = function() {
  var _this = this;
  var fields = this.dict.get('addfields') || {};

  _.each(fields, function(value, key) {
    var id, sid, dict, conf, select;
    _this.controls[key] = 'none';
    if (value.toString().match(/^WDICTS\./i)) {
      _this.autoinsert = false;
      sid = value.toString().replace(/WDICTS\./i, '').replace(/\(.*\)/i, '').trim();
      id = _this.dict.get('sid') + "_" + sid;
      conf = window[sid + '_data'];
      if ((conf !== null) && (conf.privileges.S !== false)) {
        dict = new Dict(conf);
        _this.$form.append(jade.templates.insert_control({
          id:   id,
          dict: dict.toJSON()
        }));
        select = new Select({
          el:   "[data-control=\"" + id + "\"]",
          type: 'select',
          dict: dict.toJSON()
        });
        select.on('select', function(value) {
          _this.controls[key] = value;
          if (_this.checkCompleteFields()) {
            _this.$button.removeAttr('disabled');
          }
        });
      }
    } else {
      if (value.toString().match(/^select/i)) {
        _this.controls[key] = value;
      }
    }
  });
};

Insert.prototype.request = function() {
  $.ajax({
    url: '/api/dict/' + this.dict.get('sid'),
    type: 'GET',
    data: {
      _method: 'PUT',
      controls: this.controls
    },
    timeout: this.dict.get('timeout'),
    success: function() {
      alert('success');
    },
    error: function() {
      alert('error');
    }
  });
};

Insert.prototype.checkCompleteFields = function() {
  var result = true;
  _.each(this.controls, function(value, key) {
    if (value === 'none') {
      result = false;
    }
  });
  return result;
};

module.exports = Insert;

