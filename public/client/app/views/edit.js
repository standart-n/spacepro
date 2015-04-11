
var _ =        require('underscore');
var Common =   require('common');
var Select =   require('select');

var Edit = Common.extend({

  el: "[data-view=\"edit\"]",

  initialize: function() {
    var _this;

    this.$header =      this.$el.find("[data-type=\"modal-header\"]");
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

Edit.prototype.open = function(field, type, line, fields) {

  var id, sid, conf, select;
  var value = line[field];
  var fieldInfo = fields[field];
  var editfield = this.editfields[field];
  var column = _.findWhere(this.columns, {
    field: field
  });
  var caption = column.caption || '';

  if (editfield) {
    editfield = editfield.toString().trim();
    if (this.editfields[editfield]) {
      editfield = this.editfields[editfield].toString().trim();
    }
    editfield = editfield.toLowerCase();
    
    if (editfield.match(/^WDICTS\./i)) {
      sid = editfield.toString().replace(/WDICTS\./i, '').replace(/\(.*\)/i, '').trim();
      id = "edit_" + this.sid + "_" + sid;
      conf = window[sid + '_data'];
      this.$header.html(jade.templates.edit_header({
        caption: caption
      }));
      this.$body.html(jade.templates.edit_select({
        id:   id,
        conf: conf
      }));
      select = new Select({
        el:   "[data-control=\"" + id + "\"]",
        type: 'select',
        conf: conf
      });
      this.$el.modal('show');
    }
    
    if (editfield === 'strings') {
      id = "edit_" + this.sid + "_" + field;
      this.$header.html(jade.templates.edit_header({
        caption: caption
      }));
      this.$body.html(jade.templates.edit_text({
        id:       id,
        value:    value
      }));
      this.$el.modal('show');
    }

    if ((editfield === 'default') && (fieldInfo.mtype === 'timestamp')) {
      id = "edit_" + this.sid + "_" + sid;
      this.$header.html(jade.templates.edit_header({
        caption: caption
      }));
      this.$body.html(jade.templates.edit_date({
        id:       id,
        value:    value
      }));
      $("[data-control=\"" + id + "_date\"]").datepicker({
        format: 'dd.mm.yyyy'
      }).on('changeDate', function() {
        $("[data-control=\"" + id + "_date\"]").datepicker('hide');
      });
      $("[data-control=\"" + id + "_time\"]").timepicker({
        showMeridian: false,
        defaultTime:  moment(value).format('HH:mm')
      });
      $('.icon-chevron-up').addClass('fa').addClass('fa-chevron-up').removeClass('icon-chevron-up');
      $('.icon-chevron-down').addClass('fa').addClass('fa-chevron-down').removeClass('icon-chevron-down');
      this.$el.modal('show');
    }

    if ((editfield === 'default') && (field === 'mmbsh')) {
      id = "edit_" + this.sid + "_" + field;
      this.$header.html(jade.templates.edit_header({
        caption: caption
      }));
      this.$body.html(jade.templates.edit_groups({
        id:       id,
        value:    value
      }));
      this.$el.modal('show');
    }

  }

  // this.$el.modal('show');
};


module.exports = Edit;
