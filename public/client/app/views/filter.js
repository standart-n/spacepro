
var Common =   require('common');
var Select =   require('select');

var Filter = Common.extend({

  el: "[data-view=\"filters\"]",

  initialize: function() {

    if (!this.options.conf) {
      this.options.conf = {};
    }

    this.$select = this.$el.find('select');

    this.select = new Select({
      el:   this.$select,
      type: 'filters',
      conf: this.options.conf || {}
    });

    this.select.addOption({
      id:      -1,
      caption: 'Фильтр не выбран'
    });

    this.select.addOptions(this.options.conf.filters || []);

    if (store.get(this.options.conf.sid + '#filter_id')) {
      this.select.addItem(store.get(this.options.conf.sid + '#filter_id'), true);
    } else {
      if (this.options.conf.initfilter_id) {
        this.select.addItem(this.options.conf.initfolder_id, true);
      } else {
        this.select.addItem(-1, true);
      }
    }

    var _this = this;

    this.select.on('select', function(value) {
      _this.search(value);
    });    
    
  }
});

Filter.prototype.getQuery = function() {
  return this.$select.val();
};

Filter.prototype.clean = function() {
  this.$select.val('');
};

Filter.prototype.focus = function() {
  this.$select.focus();
};

Filter.prototype.search = function(query) {
  var value = query || this.$select.val();
  this.trigger('select', value);
};

module.exports = Filter;
