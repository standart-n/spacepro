
var _ =         require('_');
var Backbone =  require('backbone');
var Gsender =   require('gsender');
var Sidebar =   require('sidebar');

module.exports = Backbone.Router.extend({

  routes: {
    'auth/logout':   'logout'
  },

  initialize: function() {
    var _this = this;
    var dicts = [];
    var units = window.units || {};

    this.sidebar = new Sidebar();
    
    $('[data-view=\"dict\"]').each(function(i, el) {
      var unit;
      var resource;

      var sid = $(el).data("dict-sid") || '';
      var conf = window[sid + '_data'] || {};

      if (units[sid]) {
        unit = units[sid];
        resource = require(unit);
        
        window[sid] = new resource({
          el:   conf.el,
          conf: conf
        });
      } else {
        window[sid] = new Gsender({
          el:   conf.el,
          conf: conf
        });
      }

      dicts.push(sid);
    });

    $(document).find("[data-toggle-tab=\"tooltip\"]").tooltip({
      container: 'body',
      placement: 'top'
    });

    $(window).on('scroll', function() {
      if ($(window).scrollTop() + $(window).height() >= $(document).height()) {
        _.each(dicts, function(sid) {
          if (window[sid]) {
            window[sid].trigger('scroll.end');
          }
        });
      }
    });

  },

  logout: function() {
    $.ajax({
      url: '/api/auth/logout',
      timeout: 10000,
      complete: function(xhr, textStatus) {
        if (textStatus === 'success') {
          var res = JSON.parse(xhr.responseText);
          if (!res.err) {
            $.removeCookie('user_id');
            $.removeCookie('session_id');
            $.removeCookie('workstation_id');
            window.location.href = "/";    
          }
        }
      }
    });
  }

});