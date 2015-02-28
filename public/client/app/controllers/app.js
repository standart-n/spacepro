var Backbone, Gsender, Sidebar;

Backbone =  require('backbone');
Gsender =   require('gsender');
Sidebar =   require('sidebar');

module.exports = Backbone.Router.extend({

  initialize: function() {
    var _this = this;

    this.sidebar = new Sidebar();
    
    $('[data-view=\"dict\"]').each(function(i, el) {
      var sid, conf;

      sid = $(el).data("dict-sid") || '';
      conf = window[sid + '_data'] || {};

      window[sid] = new Gsender({
        el:   conf.el,
        conf: conf
      });

    });     
  }

});