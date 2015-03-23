
var _ =         require('_');
var Backbone =  require('backbone');
var Gsender =   require('gsender');
var Sidebar =   require('sidebar');

module.exports = Backbone.Router.extend({

  initialize: function() {
    var _this = this;
    var dicts = [];

    this.sidebar = new Sidebar();
    
    $('[data-view=\"dict\"]').each(function(i, el) {

      var sid = $(el).data("dict-sid") || '';
      var conf = window[sid + '_data'] || {};

      window[sid] = new Gsender({
        el:   conf.el,
        conf: conf
      });

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

  }
});