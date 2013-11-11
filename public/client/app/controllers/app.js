var Backbone, Dict;

Backbone =  require('backbone');
Dict =      require('dict');

module.exports = Backbone.Router.extend({

  initialize: function() {
    var _this = this;

    this.dicts = [];
    
    $('[data-view=\"dict\"]').each(function(i, element) {
      _this.dicts.push(new Dict({
        el: element
      }));
    });
  
  }

});