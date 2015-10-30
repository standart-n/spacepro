
var _ =            require('underscore');
var Modal =        require('modal');
var Select =       require('select');
var GroupEdit =    require('groupedit');

var template_edit_default =     require('edit_default.jade');
var template_edit_header =      require('edit_header.jade');
var template_edit_footer =      require('edit_footer.jade');
var template_edit_select =      require('edit_select.jade');
var template_edit_groups =      require('edit_groups.jade');
var template_edit_text =        require('edit_text.jade');
var template_edit_date =        require('edit_date.jade');

var Edit = Modal.extend({

  el: "[data-view=\"edit\"]",

  initialize: function() {
    var _this;

    this.$header =      this.$el.find("[data-view=\"modal-header\"]");
    this.$body =        this.$el.find("[data-view=\"modal-body\"]");
    this.$form =        this.$el.find("[data-view=\"modal-form\"]");
    this.$button =      this.$el.find("[data-view=\"button\"]");
    this.$footer =      this.$el.find("[data-view=\"modal-footer\"]");
    this.$bottom =      this.$el.find("[data-view=\"modal-bottom\"]");

    this.conf =         this.options.conf    || {};
    this.sid =          this.conf.sid        || {};
    this.editfields =   this.conf.editfields || {};
    this.columns =      this.conf.columns    || {};
    this.controls =     {};
    this.vals =         {};
    this.showdefault =  true;
    
    // this.$button.on('click', function() {
    //   _this.request();
    // });

    // this.$el.on('click', '[data-view=\"button\"]', function(e) {
    //   _this.request();
    // });

    _this = this;

  }

});

Edit.prototype.checkEditField = function(field) {
  if (field == null) {
    field = this.field;
  }

  this.editfield = this.editfields[field];

  if (this.editfield) {
    this.editfield = this.editfield.toString().trim();
    if (this.editfields[this.editfield]) {
      this.field = this.editfield;
      this.editfield = this.editfields[this.editfield].toString().trim();
    }
    this.editfield = this.editfield.toLowerCase();
    return this.editfield;
  } else {
    return false;
  }
};

Edit.prototype.checkPrivilegies = function(field) {
  var privileges =      this.conf.privileges || {};
  var A =               privileges.A         || false;
  var U =               privileges.U         || [];

  if (field == null) {
    field = this.field;
  }

  if (A) {
    return true;
  } else {
    if (_.indexOf(U, field.toUpperCase())>-1) {
      return true;
    } else {
      return false;
    }  
  }
};

Edit.prototype.getCaption = function(field) {
  var column;

  if (field == null) {
    field = this.field;
  }
  
  column = _.findWhere(this.columns, {
    field: field
  });  

  caption = column.caption || '';
  this.caption = caption;
  return caption;
};

Edit.prototype.init = function(field, type, line, fields) {

  this.line =           line;
  this.value =          line[field];  
  this.fieldInfo =      fields[field];
  this.field =          field.toString().trim();
  this.caption =        this.getCaption();

};

Edit.prototype.editor = function(e) {
  var _this = this;
  var sid, conf, initOptions, select, groupEdit, groups, control;

  var id = guid();
  var operation_id = guid();

  this.init(e.field, e.type, e.line, e.fields);

  if (this.checkEditField()) {

    if (this.checkPrivilegies()) {

      this.$header.html(template_edit_header({
        caption: this.caption
      }));

      this.$footer.html(template_edit_footer({
        operation_id: operation_id
      }));

      this.$bottom.empty();

      this.$el.on('click', '[data-request=\"' + operation_id + '\"]', function(e) {
        _this.request();
      });

        
      if (this.editfield.match(/^WDICTS\./i)) {
        sid = this.editfield.toString().replace(/WDICTS\./i, '').replace(/\(.*\)/i, '').trim();
        conf = window[sid + '_data'];
        initOptions = this.editfield.toString().replace(/WDICTS\./i, '').replace(/.*\(/i, '').replace(/\)/i, '').trim() || '';
        if (initOptions === sid) {
          initOptions = '';
        }
        // this.$header.html(template_edit_header({
        //   caption: this.caption
        // }));
        this.$body.html(template_edit_select({
          id:   id,
          conf: conf
        }));
        select = new Select({
          el:           "[data-control=\"" + id + "\"]",
          type:         'select',
          conf:         conf,
          initOptions:  initOptions,
          line:         e.line
        });
        this.controls = {
          field:      this.field,
          fieldInfo:  this.fieldInfo,
          line:        e.line,
          type:       'select',
          val:  function() {
            return select.getValue();
          }
        };
        this.showdefault = false;
        this.$el.modal('show');
      }
      
      if ((this.editfield === 'strings') || (this.fieldInfo.mtype === 'blob')) {
        // this.$header.html(template_edit_header({
        //   caption: this.caption
        // }));
        this.$body.html(template_edit_text({
          id:         id,
          fieldInfo:  this.fieldInfo,
          value:      this.value
        }));
        this.controls = {
          field:      this.field,
          fieldInfo:  this.fieldInfo,
          line:       e.line,
          type:       'blob',
          val:  function() {
            return $("[data-control=\"" + id + "\"]").val();
          }
        };
        this.showdefault = false;
        this.$el.modal('show');
      }

      if ((this.editfield === 'default') && (this.fieldInfo.mtype === 'timestamp')) {
        // this.$header.html(template_edit_header({
        //   caption: this.caption
        // }));
        this.$body.html(template_edit_date({
          id:         id,
          fieldInfo:  this.fieldInfo,
          value:      this.value
        }));
        $("[data-control=\"" + id + "_date\"]").datepicker({
          format: 'dd.mm.yyyy'
        }).on('changeDate', function() {
          $("[data-control=\"" + id + "_date\"]").datepicker('hide');
        });
        $("[data-control=\"" + id + "_time\"]").timepicker({
          showMeridian: false,
          defaultTime:  moment(this.value).format('HH:mm')
        });
        $('.icon-chevron-up').addClass('fa').addClass('fa-chevron-up').removeClass('icon-chevron-up');
        $('.icon-chevron-down').addClass('fa').addClass('fa-chevron-down').removeClass('icon-chevron-down');
        this.controls = {
          field:      this.field,
          fieldInfo:  this.fieldInfo,
          line:       e.line,
          type:       'timestamp',
          val:  function() {
            return $("[data-control=\"" + id + "_date\"]").val() + ' ' + $("[data-control=\"" + id + "_time\"]").val();
            // return new Date($("[data-control=\"" + id + "_date\"]").val() + ' ' + $("[data-control=\"" + id + "_time\"]").val());
            // return {
            //   date: $("[data-control=\"" + id + "_date\"]").val(),
            //   time: $("[data-control=\"" + id + "_time\"]").val()
            // };
          }
        };
        this.showdefault = false;
        this.$el.modal('show');
      }

      if ((this.editfield === 'default') && (this.field === 'mmbsh')) {
        groups = this.options.conf.groups || [];
        // this.$header.html(template_edit_header({
        //   caption: this.caption
        // }));
        this.$body.html(template_edit_groups({
          id:         id,
          fieldInfo:  this.fieldInfo,
          value:      this.value,
          groups:     groups
        }));
        groupEdit = new GroupEdit({
          el:         "[data-control=\"" + id + "\"]",
          value:      this.value,
          groups:     groups
        });
        this.controls = {
          field:      this.field,
          fieldInfo:  this.fieldInfo,
          line:       e.line,
          type:       'mmbsh',
          val:  function() {
            return groupEdit.result();
          }
        };
        this.$el.modal('show');
      }

      if ((this.editfield === 'default') && (this.field !== 'mmbsh') && (this.fieldInfo.mtype !== 'timestamp')) {
        // this.$header.html(template_edit_header({
        //   caption: this.caption
        // }));
        this.$body.html(template_edit_default({
          id:         id,
          fieldInfo:  this.fieldInfo,
          value:      this.value
        }));
        this.controls = {
          field:      this.field,
          fieldInfo:  this.fieldInfo,
          line:       e.line,
          type:       'default',
          input:      this.$body.find("[data-control=\"" + id + "\"]"),
          val:  function() {
            return $("[data-control=\"" + id + "\"]").val();
          }
        };
        this.$el.modal('show');
      }

    } else {

      // if (fieldInfo.mtype === 'blob') {
      
      //   id = "edit_" + this.sid + "_" + field;
      //   this.$header.html(template_edit_header({
      //     caption: this.caption
      //   }));
      //   this.$body.html(template_edit_show({
      //     id:         id,
      //     fieldInfo:  this.fieldInfo,
      //     value:      this.value
      //   }));
      //   this.$footer.hide();
      //   // this.controls = {
      //   //   field:      this.field,
      //   //   fieldInfo:  this.fieldInfo,
      //   //   line:       line,
      //   //   type:       type,
      //   //   val:  function() {
      //   //     return $("[data-control=\"" + id + "\"]").val();
      //   //   }
      //   // };
      //   // this.showdefault = false;
      //   this.$el.modal('show');        
      
      // } else {

      //   $.noty({
      //     text:         'Данное поле запрещено для редактирования!',
      //     layout:       'topCenter',
      //     type:         'error',
      //     closeButton:  false,
      //     timeout:      500
      //   });

      // }

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
      timeout: 10000,
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
