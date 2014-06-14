var Backbone, Gsender, Search, Sidebar, Content;

Backbone =  require('backbone');
Gsender =   require('gsender');
Search =    require('search');
Sidebar =   require('sidebar');
Content =   require('content');

module.exports = Backbone.Router.extend({

  initialize: function() {
    var _this = this;

    // this.search =  new Search();
    // this.sidebar = new Sidebar();
    // this.content = new Content();
    
    $('[data-view=\"dict\"]').each(function(i, el) {
      var sid = $(el).data("dict-sid");

      window[sid] = new Gsender({
        el:  "[data-dict-sid=\"" + sid + "\"]",
        sid: sid
      });

    });
  
  }

});