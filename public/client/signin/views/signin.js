var Backbone;

Backbone = require('backbone');

module.exports = Backbone.View.extend({
  el: "[data-view=\"signin\"]",

  events: {
    "submit [data-type=\"form\"]": 'submit'
  },

  initialize: function() {
    var _this = this;

    this.model = window.user;
    this.$form =        this.$el.find("[data-type=\"form\"]");
    this.$login =       this.$form.find("[data-type=\"login\"]");
    this.$password =    this.$form.find("[data-type=\"password\"]");
    this.$button =      this.$form.find("[data-type=\"submit\"]");
    this.$alertError =  this.$el.find("[data-type=\"error\"]");
    this.$login.focus();

    this.on('force', function() {
      _this.$button.button('loading');
      _this.model.reset();
      _this.model.set('force', 1);
      _this.sendRequest();
    });
  },

  submit: function(e) {
    var _this = this;
    e.preventDefault();
    this.model.reset();
    this.model.set({
      login:     this.$login.val(),
      password:  this.$password.val()
    });
    this.sendRequest();
  },

  sendRequest: function() {
    var _this = this;
    this.model.save(null, {
      url: '/api/auth/login',
      timeout: 10000,
      complete: function(xhr, textStatus) {
        _this.checkResponse(xhr, textStatus);
      }
    });
  },

  checkResponse: function(xhr, textStatus) {
    var res;
    this.$button.button('reset');
    if (textStatus === 'success') {
      res = JSON.parse(xhr.responseText);
      if (res.result === 'error') {
        this.error(res.error);
        this.$password.val('');
        this.$password.focus();
      } else {
        if (res.session_success === 1) {
          $.cookie('user_id',        res.user_id);
          $.cookie('session_id',     res.session_id);
          $.cookie('workstation_id', res.workstation_id);
          window.location.href = "/";
        } else {
          // window.app.navigate('signin/resolve', {
          //   trigger: true
          // });
          window.app.navigate('signin/force', {
            trigger: true
          });
        }
      }
    }
    if (textStatus === 'error') {
      this.error("" + xhr.status + ": " + (gettext('Server not found')) + "!");
    }
  },

  error: function(text) {
    var aid,
      _this = this;
    if (text == null) {
      text = '';
    }
    aid = window.aid();
    this.$alertError.removeClass('hide').html(text).data('aid', aid);
    setTimeout(function() {
      if (_this.$alertError.data('aid') === aid) {
        _this.$alertError.addClass('hide');
      }
    }, 3000);
  }

});
