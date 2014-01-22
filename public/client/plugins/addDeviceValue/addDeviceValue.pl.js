
var _, Backbone, Name, Template,
  name = 'addDeviceValue';

_ =            require('underscore');
Backbone =     require('backbone');
Template =     require(name + '.tpl');

module.exports = Backbone.View.extend({

  el: "[data-view=\"dict\"]",

  initialize: function() {
    var _this = this;

    this.$worksheet =  this.$el.find('tbody');

    this.sid =         this.options.sid         || '';    
    this.targetField = this.options.targetField || 'account_data';
    this.uuid = '';

    this.template = new Template();

    this.checkLines();

    this.$el.on('add.line', function(e, line) {
      var $el, $line;      
      if (line != null) {
        if (line.d$uuid != null) {          
          $line = _this.$worksheet.find("[data-uuid=\"" + line.d$uuid + "\"]");          
          if ($line.length) {
            $el = $line.find("[data-col-field=\"" + _this.targetField + "\"]");
            if ($el.length) {
              _this.checkLine($el);
            }
          }
        }
      }
    });

    this.$el.on('click', "[data-" + name + "=\"link\"]", function(e) {
      e.preventDefault();
      _this.uuid = $(this).parent().parent().data('uuid');
      _this.$worksheet.find( "[data-" + name + "=\"input\"]").addClass('hide');
      _this.$worksheet.find( "[data-" + name + "=\"link\"]").removeClass('hide');
      $(this).addClass('hide');
      $(this).parent().find( "[data-" + name + "=\"input\"]").removeClass('hide').focus();
    });

    this.$el.on('click', "td", function(e) {
      if ($(this).parent().data('uuid') != _this.uuid) {
        _this.$worksheet.find( "[data-" + name + "=\"input\"]").addClass('hide');
        _this.$worksheet.find( "[data-" + name + "=\"link\"]").removeClass('hide');
      }
    });

    this.$el.on('keyup', "[data-" + name + "=\"input\"]", function(e) {
      var __this = this;
      if (e.keyCode === 13) {
        // $(this).parent().addClass('success');
        this.blur();
        $.ajax({
          url:       '/api/' + name,
          type:      'POST',
          dataType:  'text',
          data: {
            uuid:   _this.uuid.trim(),
            value:  $(this).val()
          },
          success: function(s) {
            var sid = _this.sid;
            $(__this).parent().html(_this.template.line({
              value: $(__this).val()
            }));
            if (window[sid] != null) {
              window[sid].trigger('update.childs');
            }
          }
        });
      }
    });

  },


  checkLines: function() {
    var _this = this;

    this.$worksheet.find("[data-col-field=\"" + this.targetField + "\"]").each(function() {
      _this.checkLine($(this));
    });
  },

  checkLine: function($el) {
    if ($el.data(name) != 'cell') {
      $el.html(this.template.line({
        value: $el.text()
      }));
      $el.data(name, 'cell');
    }
  }

});
