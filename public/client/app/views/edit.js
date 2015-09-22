
var _ =            require('underscore');
var Common =       require('common');
var Select =       require('select');
var GroupEdit =    require('groupedit');

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
    
    this.$button.on('click', function() {
      _this.request();
    });

    _this = this;

  }

});

Edit.prototype.open = function(field, type, line, fields) {
  var id, sid, conf, select, groupEdit, groups, control;
  var showdefault =     true;
  var privileges =      this.conf.privileges || {};
  var U =               privileges.U         || [];
  var value =           line[field];
  var fieldInfo =       fields[field];
  var column =        _.findWhere(this.columns, {
    field: field
  });
  var caption = column.caption || '';

  this.editfield = this.editfields[field];

  if (this.editfield) {

    if (_.indexOf(U, field.toUpperCase())>-1) {

      console.log(fieldInfo.mtype);

      this.editfield = this.editfield.toString().trim();
      if (this.editfields[this.editfield]) {
        field = this.editfield;
        this.editfield = this.editfields[this.editfield].toString().trim();
      }
      this.editfield = this.editfield.toLowerCase();
      
      if (this.editfield.match(/^WDICTS\./i)) {
        sid = this.editfield.toString().replace(/WDICTS\./i, '').replace(/\(.*\)/i, '').trim();
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
        this.controls = {
          field:      field,
          fieldInfo:  fieldInfo,
          line:       line,
          type:       'select',
          val:  function() {
            return select.getValue();
          }
        };
        showdefault = false;
        this.$el.modal('show');
      }
      
      if ((this.editfield === 'strings') || (fieldInfo.mtype === 'blob')) {
        id = "edit_" + this.sid + "_" + field;
        this.$header.html(jade.templates.edit_header({
          caption: caption
        }));
        this.$body.html(jade.templates.edit_text({
          id:         id,
          fieldInfo:  fieldInfo,
          value:      value
        }));
        this.controls = {
          field:      field,
          fieldInfo:  fieldInfo,
          line:       line,
          type:       type,
          val:  function() {
            return $("[data-control=\"" + id + "\"]").val();
          }
        };
        showdefault = false;
        this.$el.modal('show');
      }

      if ((this.editfield === 'default') && (fieldInfo.mtype === 'timestamp')) {
        id = "edit_" + this.sid + "_" + sid;
        this.$header.html(jade.templates.edit_header({
          caption: caption
        }));
        this.$body.html(jade.templates.edit_date({
          id:         id,
          fieldInfo:  fieldInfo,
          value:      value
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
        this.controls = {
          field:      field,
          fieldInfo:  fieldInfo,
          line:       line,
          type:       type,
          val:  function() {
            return $("[data-control=\"" + id + "_date\"]").val() + ' ' + $("[data-control=\"" + id + "_time\"]").val();
            // return new Date($("[data-control=\"" + id + "_date\"]").val() + ' ' + $("[data-control=\"" + id + "_time\"]").val());
            // return {
            //   date: $("[data-control=\"" + id + "_date\"]").val(),
            //   time: $("[data-control=\"" + id + "_time\"]").val()
            // };
          }
        };
        showdefault = false;
        this.$el.modal('show');
      }

      if ((this.editfield === 'default') && (field === 'mmbsh')) {
        id = "edit_" + this.sid + "_" + field;
        groups = this.conf.groups || [];
        this.$header.html(jade.templates.edit_header({
          caption: caption
        }));
        this.$body.html(jade.templates.edit_groups({
          id:         id,
          fieldInfo:  fieldInfo,
          value:      value,
          groups:     groups
        }));
        groupEdit = new GroupEdit({
          el:   "[data-control=\"" + id + "\"]",
          value:       value,
          groups:      groups
        });
        this.controls = {
          field:      field,
          fieldInfo:  fieldInfo,
          line:       line,
          type:       type,
          val:  function() {
            return groupEdit.result();
          }
        };
        this.$el.modal('show');
      }

      if ((this.editfield === 'default') && (showdefault)) {
        id = "edit_" + this.sid + "_" + field;
        this.$header.html(jade.templates.edit_header({
          caption: caption
        }));
        this.$body.html(jade.templates.edit_default({
          id:         id,
          fieldInfo:  fieldInfo,
          value:      value
        }));
        this.controls = {
          field:      field,
          fieldInfo:  fieldInfo,
          line:       line,
          type:       type,
          input:      this.$body.find("[data-control=\"" + id + "\"]"),
          val:  function() {
            return $("[data-control=\"" + id + "\"]").val();
          }
        };
        this.$el.modal('show');
      }

    } else {

      $.noty({
        text:         'Данное поле запрещено для редактирования!',
        layout:       'topCenter',
        type:         'error',
        closeButton:  false,
        timeout:      500
      });

    }

  } else {


  }
};

Edit.prototype.checkCompleteFields = function() {
  var _this = this;
  var result = false;

  if (this.editfield) {
    result = {
      field:      this.controls.field,
      fieldInfo:  this.controls.fieldInfo,
      type:       this.controls.type,
      line:       this.controls.line,
      val:        this.controls.val()
    };
  }

  return result;
};

Edit.prototype.request = function() {
  var _this = this;
  var controls = this.checkCompleteFields();

  if (controls) {
    $.ajax({
      url: '/api/dict/' + this.sid,
      type: 'GET',
      data: {
        _method: 'POST',
        controls: controls
      },
      timeout: this.options.timeout || 1000,
      success: function(res) {
        if (!res.err) {
          _this.$el.modal('hide');
          _this.$el.trigger('update');
          $.noty({
            text:         'Запись успешно изменена!',
            layout:       'topCenter',
            type:         'success',
            closeButton:  false,
            timeout:      2000
          });
        } else {
          $.noty({
            text:         'Произошла ошибка при редактировании записи!',
            layout:       'topCenter',
            type:         'error',
            closeButton:  false,
            timeout:      3000
          });
          console.error('Edit.prototype.request', res.err);
        }
      },
      error: function(e) {
        $.noty({
          text:         'Произошла ошибка при запросе к серверу!',
          layout:       'topCenter',
          type:         'error',
          closeButton:  false,
          timeout:      3000
        });
        console.error('Edit.prototype.request error', e);
      }
    });
  }

};


module.exports = Edit;
