
var _ =        require('underscore');
var Common =   require('common');
var Select =   require('select');

var Edit = Common.extend({

  el: "[data-view=\"edit\"]",

  initialize: function() {
    var _this;

    this.$body =        this.$el.find("[data-type=\"modal-body\"]");
    this.$form =        this.$el.find("[data-view=\"form\"]");
    this.$button =      this.$el.find("[data-type=\"button\"]");

    this.conf =         this.options.conf    || {};
    this.sid =          this.conf.sid        || {};
    this.editfields =   this.conf.editfields || {};
    this.columns =      this.conf.columns    || {};
    this.controls =     {};
    this.vals =         {};
    
    // this.checkFields();

    _this = this;

  }
});


module.exports = Insert;

