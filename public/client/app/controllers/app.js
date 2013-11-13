var Backbone, Dict, Search;

Backbone =  require('backbone');
Dict =      require('dict');
Search =    require('search');

module.exports = Backbone.Router.extend({

  initialize: function() {
    var _this = this;

    this.search = new Search();
    
    $('[data-view=\"dict\"]').each(function(i, el) {
      var sid = $(el).data("dict-sid");

      window[sid] = new Dict({
        el:  "[data-dict-sid=\"" + sid + "\"]",
        sid: sid
      });

    });
  
  }

});