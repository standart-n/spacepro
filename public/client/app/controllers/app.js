var Backbone, Dict;

Backbone =  require('backbone');
Dict =      require('dict');
Search =    require('search');

module.exports = Backbone.Router.extend({

  routes: {
    'search/:query': 'search'
  },

  initialize: function() {
    var _this = this;

    this.dicts = [];
    this.search = new Search();
    
    $('[data-view=\"dict\"]').each(function(i, element) {
      _this.dicts.push(new Dict({
        el: element
      }));
    });
  
  },

  search: function(query) {
    this.dicts[0].trigger('search', query);
  }

});