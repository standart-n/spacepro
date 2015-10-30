
var _ =        require('underscore');
var Modal =    require('modal');
var Select =   require('select');
// var noty =     require('noty');

var template_insert_select =    require('insert_select.jade');
var template_insert_default =   require('insert_default.jade');

var Insert = Modal.extend({

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
      } else {
        $.noty({
          text:         'Вы заполнили не все поля!',
          layout:       'topCenter',
          type:         'error',
          closeButton:  false,
          timeout:      10000
        });
      }
    });
  }
});


Insert.prototype.checkPrivilegies = function() {
  var privileges =      this.conf.privileges || {};
  var A =               privileges.A         || false;
  var I =               privileges.I         || [];

  if (A) {
    return true;
  } else {
    if (I === true) {
      return true;
    } else {
      return false;
    }
  }
  
};

Insert.prototype.open = function() {

  if (this.checkPrivilegies()) {
    if (this.autoinsert === true) {
      this.request();
    } else {
      this.$el.modal('show');
    }
  } else {
    $.noty({
      text:         'Добавление новой записи запрещено!',
      layout:       'topCenter',
      type:         'error',
      closeButton:  false,
      timeout:      500
    });    
  }
};

Insert.prototype.checkFields = function() {
  var _this = this;

  _.each(this.addfields, function(addfield, key) {
    var sid, conf, select, caption, field;

    var id = guid();

    _this.controls[key] = 'none';
    addfield = addfield.toString().trim();
    if (addfield.match(/^WDICTS\./i)) {
      _this.autoinsert = false;
      sid = addfield.toString().replace(/WDICTS\./i, '').replace(/\(.*\)/i, '').trim();
      conf = window[sid + '_data'];
      _this.$form.append(template_insert_select({
        id:   id,
        conf: conf
      }));
      select = new Select({
        el:   "[data-control=\"" + id + "\"]",
        type: 'select',
        conf: conf
      });
      // select.on('select', function(addfield) {
      //   _this.checkCompleteFields();
      // });
      _this.controls[key] = {
        type:   'select',
        select: select,
        value:  ''
      };
    }
    if (addfield === 'default') {
      _this.autoinsert = false;
      field = _.findWhere(_this.columns, {
        field: key
      });
      caption = field.caption || '';
      _this.$form.append(template_insert_default({
        id:       id,
        caption:  caption
      }));
      _this.controls[key] = {
        type:   'default',
        input:  _this.$form.find("[data-control=\"" + id + "\"]"),
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
  var _this = this;
  $.ajax({
    url: '/api/dict/' + this.sid,
    type: 'GET',
    data: {
      _method: 'PUT',
      controls: this.vals
    },
    timeout: 10000,
    success: function(res) {
      if (!res.err) {
        _this.$el.modal('hide');
        _this.$el.trigger('update');
        $.noty({
          text:         'Запись успешно добавлена!',
          layout:       'topCenter',
          type:         'success',
          closeButton:  false,
          timeout:      2000
        });
      } else {
        $.noty({
          text:         'Произошла ошибка при добавлении записи!',
          layout:       'topCenter',
          type:         'error',
          closeButton:  false,
          timeout:      3000
        });
        console.error('Insert.prototype.request', res.err);
      }
    },
    error: function(e) {
      $.noty({
        text:         'Произошла ошибка при запросе к серверу!',
        layout:       'topCenter',
        type:         'error',
        closeButton:  false,
        timeout:      3000
      });
      console.error('Insert.prototype.request error', e);
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
        if (_this.controls[key].input) {
          _this.vals[key] = _this.controls[key].input.val();
        } else {          
          _this.vals[key] = _this.controls[key].value;
        }
    }
    if (_this.vals[key] === '') {
      result = false;
    }
  });
  // if (!result) {
  //   _this.$button.attr('disabled', 'disabled');
  // } else {
  //   _this.$button.removeAttr('disabled');
  // }
  return result;
};

module.exports = Insert;

