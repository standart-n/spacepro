
var _ =        require('underscore');
var Modal =    require('modal');
// var noty =     require('noty');

var Delete = Modal.extend({

  el: "[data-view=\"delete\"]",

  initialize: function() {
    var _this;

    this.$body =        this.$el.find("[data-type=\"modal-body\"]");
    this.$form =        this.$el.find("[data-view=\"form\"]");
    this.$button =      this.$el.find("[data-view=\"button\"]");

    this.conf =         this.options.conf   || {};
    this.sid =          this.conf.sid       || {};
    
    _this = this;

    this.$button.on('click', function() {
      _this.request();
    });

  }
});

Delete.prototype.init = function(line) {
  var keyfieldname = this.options.conf.keyfieldname;
  this.line = line;
  this.line_id = line[keyfieldname];
};

Delete.prototype.checkPrivilegies = function() {
  var privileges =      this.conf.privileges || {};
  var A =               privileges.A         || false;
  var D =               privileges.D         || [];

  if (A) {
    return true;
  } else {
    if (D === true) {
      return true;
    } else {
      return false;
    }
  }  
};

Delete.prototype.open = function(gsender, e) {
  var _this = this;
  var sid, conf;

  this.init(e.line);

  if (this.checkPrivilegies()) {

    this.$el.modal('show');      

  } else {
    $.noty({
      text:         'Удаление записей запрещено!',
      layout:       'topCenter',
      type:         'error',
      closeButton:  false,
      timeout:      10000
    });    
  }
};


Delete.prototype.request = function() {
  var _this = this;
  $.ajax({
    url: '/api/dict/' + this.sid,
    type: 'GET',
    data: {
      line:    this.line || {},
      vals:    this.vals || {},
      keys:    this.keys || {},
      _method: 'DELETE'
    },
    timeout: 10000,
    success: function(res) {
      if (!res.err) {
        _this.$el.modal('hide');
        _this.$el.trigger('update');
        $.noty({
          text:         'Запись успешно удалена!',
          layout:       'topCenter',
          type:         'success',
          closeButton:  false,
          timeout:      2000
        });
      } else {
        $.noty({
          text:         'Произошла ошибка при удалении записи!',
          layout:       'topCenter',
          type:         'error',
          closeButton:  false,
          timeout:      3000
        });
        console.error('Delete.prototype.request', res.err);
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
      console.error('Delete.prototype.request error', e);
    }
  });
};


module.exports = Delete;

