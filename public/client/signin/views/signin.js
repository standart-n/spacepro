var Backbone;

Backbone = require('backbone');

module.exports = Backbone.View.extend({
  el: "[data-view=\"signin\"]",
  events: {
    "submit [data-type=\"form\"]": 'submit'
  },
  initialize: function() {
    this.model = window.user;
    this.$form = this.$el.find("[data-type=\"form\"]");
    this.$login = this.$form.find("[data-type=\"login\"]");
    this.$password = this.$form.find("[data-type=\"password\"]");
    this.$button = this.$form.find("[data-type=\"submit\"]");
    this.$alertError = this.$el.find("[data-type=\"error\"]");
    return this.$login.focus();
  },
  submit: function(e) {
    var _this = this;
    e.preventDefault();
    this.$button.button('loading');
    this.model.reset();
    return this.model.save({
      login: this.$login.val(),
      password: this.$password.val()
    }, {
      url: '/api/signin',
      timeout: 10000,
      complete: function(xhr, textStatus) {
        return _this.checkResponse(xhr, textStatus);
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
          alert('success');
        }
      }
    }
    if (textStatus === 'error') {
      return this.error("" + xhr.status + ": " + (gettext('Server not found')) + "!");
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
    return setTimeout(function() {
      if (_this.$alertError.data('aid') === aid) {
        return _this.$alertError.addClass('hide');
      }
    }, 3000);
  }
});
