

var Common =   require('common');
var Select =   require('select');

var Folders = Common.extend({

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

    if (this.options.conf.initfolder_id) {
      this.select.addItem(this.options.conf.initfolder_id, true);
    }

    var _this = this;

    this.select.on('select', function(value) {
      _this.search(value);
    });    
    
  }
});

Folders.prototype.getQuery = function() {
  return this.$select.val();
};

Folders.prototype.clean = function() {
  this.$select.val('');
};

Folders.prototype.focus = function() {
  this.$select.focus();
};

Folders.prototype.search = function(query) {
  var value = query || this.$select.val();
  this.trigger('select', value);
};

module.exports = Folders;
