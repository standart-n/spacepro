
var _ =        require('underscore');
var Common =   require('common');
var Select =   require('select');

var Insert = Common.extend({

  el: "[data-view=\"insert\"]",

  initialize: function() {
    var _this;

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

Insert.prototype.open = function() {
  if (this.autoinsert === true) {
    this.request();
  } else {
    this.$el.modal('show');
  }
};

Insert.prototype.checkFields = function() {
  var _this = this;

  _.each(this.addfields, function(addfield, key) {
    var id, sid, conf, select, caption, field;
    _this.controls[key] = 'none';
    addfield = addfield.toString().trim();
    if (addfield.match(/^WDICTS\./i)) {
      _this.autoinsert = false;
      sid = addfield.toString().replace(/WDICTS\./i, '').replace(/\(.*\)/i, '').trim();
      id = "insert_" + _this.sid + "_" + sid;
      conf = window[sid + '_data'];
      _this.$form.append(jade.templates.insert_select({
        id:   id,
        conf: conf
      }));
      select = new Select({
        el:   "[data-control=\"" + id + "\"]",
        type: 'select',
        conf: conf
      });
      select.on('select', function(addfield) {
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
    if (addfield === 'default') {
      _this.autoinsert = false;
      id = "insert_" + _this.sid + "_" + key;
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
    if (addfield.match(/^select/i)) {
      _this.controls[key] = {
        type: 'sql',
        value: addfield
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

