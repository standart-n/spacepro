
var Common =   require('common');
var Select =   require('select');

var Folder = Common.extend({

  el: "[data-view=\"folders\"]",

  initialize: function() {

    if (!this.options.conf) {
      this.options.conf = {};
    }

    this.$select = this.$el.find('select');

    this.select = new Select({
      el:   this.$select,
      type: 'folders',
      conf: this.options.conf || {}
    });

    this.select.addOptions(this.options.conf.folders || []);

    if (store.get(this.options.conf.sid + '#folder_id')) {
      this.select.addItem(store.get(this.options.conf.sid + '#folder_id'), true);
    } else {
      if (this.options.conf.initfolder_id) {
        this.select.addItem(this.options.conf.initfolder_id, true);
      }
    }

    var _this = this;

    this.select.on('select', function(value) {
      _this.search(value);
    });    
    
  }
});

Folder.prototype.getQuery = function() {
  return this.$select.val();
};

Folder.prototype.clean = function() {
  this.$select.val('');
};

Folder.prototype.focus = function() {
  this.$select.focus();
};

Folder.prototype.search = function(query) {
  var value = query || this.$select.val();
  this.trigger('select', value);
};

module.exports = Folder;