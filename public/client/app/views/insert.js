
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

    // this.dict = new Dict(this.options.conf || {});


    this.$body =        this.$el.find("[data-type=\"modal-body\"]");
    this.$form =        this.$el.find("[data-view=\"form\"]");
    this.$button =      this.$el.find("[data-type=\"button\"]");

    this.conf =         this.options.conf   || {};
    this.sid =          this.conf.sid       || {};
    this.addfields =    this.conf.addfields || {};
    this.columns =      this.conf.columns   || {};
    this.controls =     {};
    this.vals =         {};
    this.autoinsert =   true;
    
    this.checkFields();

    _this = this;

    this.$button.on('click', function() {
      if (_this.checkCompleteFields()) {
        _this.request();
      }
    });
  }
});

Insert.prototype.checkFields = function() {
  var _this = this;

  _.each(this.addfields, function(value, key) {
    var id, sid, conf, select, caption, field;
    _this.controls[key] = 'none';
    value = value.toString().trim();
    if (value.match(/^WDICTS\./i)) {
      _this.autoinsert = false;
      sid = value.toString().replace(/WDICTS\./i, '').replace(/\(.*\)/i, '').trim();
      id = _this.sid + "_" + sid;
      conf = window[sid + '_data'];
      // console.log(_this.sid, sid, conf);
      _this.$form.append(jade.templates.insert_select({
        id:   id,
        conf: conf,
      }));
      select = new Select({
        el:   "[data-control=\"" + id + "\"]",
        type: 'select',
        conf: conf
      });
      select.on('select', function(value) {
        if (_this.checkCompleteFields()) {
          _this.$button.removeAttr('disabled');
        }
      });
      _this.controls[key] = {
        type:   'select',
        select: select,
        value:  ''
      };
    }
    if (value === 'default') {
      _this.autoinsert = false;
      id = _this.sid + "_" + key;
      field = _.findWhere(_this.columns, {
        field: key
      });
      caption = field.caption || '';
      _this.$form.append(jade.templates.insert_default({
        id:       id,
        caption:  caption
      }));
      _this.controls[key] = {
        type:   'default',
        value:  ''
      };
    }
    if (value.match(/^select/i)) {
      _this.controls[key] = {
        type: 'sql',
        value: value
      };
    }
  });
};

Insert.prototype.request = function() {
  $.ajax({
    url: '/api/dict/' + this.sid,
    type: 'GET',
    data: {
      _method: 'PUT',
      controls: this.vals
    },
    timeout: this.options.timeout || 1000,
    success: function() {
      alert('success');
    },
    error: function() {
      alert('error');
    }
  });
};

Insert.prototype.checkCompleteFields = function() {
  var _this = this;
  var result = true;

  _.each(this.controls, function(value, key) {
    switch (_this.controls[key].type) {
      case 'select':
        _this.vals[key] = _this.controls[key].select.getValue();
        break;
      default:
        _this.vals[key] = _this.controls[key].value;        
    }
    if (_this.vals[key] === '') {
      result = false;
    }
  });
  return result;
};

module.exports = Insert;

