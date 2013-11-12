var Backbone, Dict;

Backbone =  require('backbone');
Dict =      require('dict');
Search =    require('search');

module.exports = Backbone.Router.extend({

  initialize: function() {
    var _this = this;

    this.search = new Search();
    
    $('[data-view=\"dict\"]').each(function(i, el) {
      _this[$(el).data("dict-sid")] = new Dict({
        el: "[data-dict-sid=\"" + $(el).data("dict-sid") + "\"]"
      });
    });
  
  }

});