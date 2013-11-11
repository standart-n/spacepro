var Backbone, Data;

Backbone = require('backbone');
Data =     require('data');

module.exports = Backbone.View.extend({

  el: "[data-view=\"dict\"]",

  initialize: function() {
    var _this = this;

    this.sid =   this.$el.data("dict-sid");
    this.step =  20;
    
    this.data = new Data();
    this.data.reset(window[this.sid].data);

    this.$el.on('scroll', function() {
      if (_this.$el.scrollTop() + _this.$el.height() === _this.$el.find('.container').height()) {
        _this.sendRequest();
      }
    });

    this.data.on('add', function(line) {
      console.log(window[_this.sid].columns, line);
      _this.$el.find('tbody').append(jade.templates.line({
        columns: window[_this.sid].columns,
        line:    line.toJSON()
      }));
    });

  },

  sendRequest: function() {
    var _this = this;

    this.data.fetch({
      url:     '/api/dict/' + this.sid,
      timeout: 10000,
      data: {
        limit: this.data.length + this.step
      }
    });
  }



});
