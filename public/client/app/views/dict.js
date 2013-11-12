var Backbone, Data;

Backbone = require('backbone');
Data =     require('data');

module.exports = Backbone.View.extend({

  el: "[data-view=\"dict\"]",

  initialize: function() {
    var _this = this;

    this.sid =   this.$el.data("dict-sid");
    this.type =  this.$el.data("dict-type");
    this.step =  20;
    this.query = '';
    
    this.data = new Data();
    this.data.reset(window[this.sid].data);
    this.limit = this.data.length;

    if (this.type === 'parent') {
      this.on('search', function(query) {
        _this.query = query;
        _this.$el.find('tbody').empty();
        _this.sendRequest();
      });

    }

    if (this.type === 'parent') {
      this.$el.on('scroll', function() {
        if (_this.$el.scrollTop() + _this.$el.height() === _this.$el.find('.container').height()) {
          _this.limit = _this.data.length + _this.step;
          _this.sendRequest();
        }
      });
    }

    this.data.on('add', function(line) {
      console.log(line.toJSON());
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
        limit: this.limit,
        query: this.query
      }
    });
  }



});
