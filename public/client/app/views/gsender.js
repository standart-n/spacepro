var _, Data, AddDeviceValue, Gsender, Common, Search;

_ =        require('underscore');
Common =   require('common');
Data =     require('data');
Dict =     require('dict');
Search =   require('search');

// AddDeviceValue = require('addDeviceValue.pl');

Gsender = Common.extend({

  el: "[data-view=\"dict\"]",

  initialize: function() {
    var model,
      _this = this;

    this.$worksheet =  this.$el.find('tbody');

    this.sid =         this.options.sid  || this.$el.data("dict-sid")  || '';
    this.type =        this.options.type || this.$el.data("dict-type") || '';
    this.limit =       50;
    this.step =        20;
    this.query =       '';
    this.keys =        {};
    this.vals =        {};

    this.dict =        new Dict(window[this.sid + '_data']);
    this.columns =     this.dict.get('columns');
    this.fields =      this.dict.get('fields');
    
    this.data = new Data();
    this.data.reset(this.dict.get('data'));

    this.selectRowUUID = this.dict.get('selectRowUUID') || this.getUUIDbyFirstRecord();

    this.vals = this.cleanVals();

    if (this.type === 'parent') {
      this.child = this.$el.data("dict-child");
      // console.log(this.conf);
    }

    if (this.type === 'child') {
      this.keys = this.dict.get('keys');
      this.vals = this.dict.get('vals');
    }

    this.search = new Search({
      el: this.$el.find("[data-view=\"search\"]")
    });

    this.search.on('search', function(query) {
      // alert('search');
      // if (_this.type === 'parent') {
      _this.limit = 50;
      _this.query = query;
      _this.$el.trigger('start.search');
      _this.sendRequest('search');
      // }
    });

    // $('body').on('keyup', function(e) {      
    //   if ((e.keyCode === 17) && (_this.$el.hasClass('active'))) {
    //     _this.search.clean();
    //     _this.search.focus();
    //     _this.search.search();
    //   }
    // });    

    this.$el.on('scroll', function() {
      if (_this.$el.scrollTop() + _this.$el.height() === _this.$el.find('.container').height()) {
        _this.limit = _this.data.length + _this.step;
        _this.$el.trigger('start.scroll');
        _this.sendRequest('scroll');
      }
    });

    this.$el.on('mouseover', function() {
      $(this).css({
        'cursor': 'pointer'
      });
    });

    this.$el.on('click', 'td', function() {
      var $tr = $(this).parent();
      _this.selectRowUUID = $tr.data('uuid');
      _this.colorActiveLine();
      _this.updateChilds();
    });

    this.data.on('add', function(line) {
      _this.$worksheet.append(jade.templates.line_data({
        columns: _this.columns,
        fields:  _this.fields,
        line:    line.toJSON()
      }));
      _this.$worksheet.find("[data-uuid=\"" + line.get('d$uuid') + "\"]").find("[data-toggle=\"tooltip\"]").tooltip({
        container: 'body',
        placement: 'top'
      });
      _this.$el.trigger('add.line', line.toJSON());
    });

    this.data.on('remove', function(line) {
      _this.$worksheet.find("[data-uuid=\"" + line.get('d$uuid') + "\"]").remove();
      _this.$el.trigger('add.line', line.toJSON());
    });

    if (_this.type === 'parent') {
      _this.sendRequest('onload');
    }

    // this.$el.find('.tooltip-toggle').tooltip({
    //   container: 'body'
    // });
    // this.$el.find('.tooltip-toggle').tooltip('show');

    // if (this.sid == 'WEB$DEVICE_DATA') {
    //   window.addDeviceValue = new AddDeviceValue({
    //     el:  this.el,
    //     sid: this.sid
    //   });
    // }    

  }
});

Gsender.prototype.update = function(vals) {
  if (this.type === 'child') {
    this.limit = 50;
    this.vals = this.cleanVals(vals);
    this.$el.trigger('start.update');
    this.sendRequest('update');
  }
};

Gsender.prototype.updateChilds = function() {
  var _this = this,
    childs = this.dict.get('childs'),
    line = this.data.findWhere({'d$uuid': this.selectRowUUID});
  if (this.data !== null) {
    _.each(childs, function(child) {
      if (window[child.sid] !== null) {
        if (line != null) {
          window[child.sid].search.clean();
          window[child.sid].update(line.toJSON() || {});
        } else {
          window[child.sid].showInformationNotFound();
        }
      }
    });
  }
};


Gsender.prototype.getUUIDbyFirstRecord = function() {
  return this.$worksheet.find('tr:first').data('uuid') || '';
};

Gsender.prototype.colorActiveLine = function(classname) {

  if (classname == null) {
    classname = 'active';
  }

  this.$worksheet.find('tr').removeClass(classname);
  this.$activeLine = this.$worksheet.find("[data-uuid=\"" + this.selectRowUUID + "\"]").first();
  if (this.$activeLine != null) {
    this.$activeLine.addClass(classname);
  }
};

Gsender.prototype.showInformationNotFound = function() {
  this.$worksheet.html(jade.templates.line_nothing({
    columns: this.columns || {}
  }));
};

Gsender.prototype.hideInformationNotFound = function() {
  this.$worksheet.find("[data-type=\"nothing\"]").remove();
};

Gsender.prototype.showErrorOnServer = function() {
  this.$worksheet.html(jade.templates.line_error({
    columns: this.columns || {}
  }));
};

Gsender.prototype.hideErrorOnServer = function() {
  this.$worksheet.find("[data-type=\"error\"]").remove();
};

Gsender.prototype.showLoading = function(type) {

  if (type == null) {
    type = 'before';
  }

  if (!this.$worksheet.find("[data-type=\"loading\"]").length) {
    switch (type) {
      case 'replace':
        this.$worksheet.html(jade.templates.line_loading({
          columns: this.columns || {}
        }));
      break;
      case 'after':
        this.$worksheet.append(jade.templates.line_loading({
          columns: this.columns || {}
        }));
      break;
      case 'before':
        this.$worksheet.prepend(jade.templates.line_loading({
          columns: this.columns || {}
        }));
      break;
    }
  }

};

Gsender.prototype.hideLoading = function() {
  this.$worksheet.find("[data-type=\"loading\"]").remove();
};

Gsender.prototype.sendRequest = function(type) {
  var _this = this;

  if (type == null) {
    type = 'scroll';
  }

  switch (type) {
    case 'onload':
      this.$worksheet.empty();
      this.data.reset();
      this.showLoading();
    break;
    case 'update':
      this.$worksheet.empty();
      this.data.reset();
      this.showLoading();
    break;
    case 'search':
      this.$worksheet.empty();
      this.data.reset();
      this.showLoading();
    break;
    case 'scroll':
      this.showLoading('after');
    break;
  }

  this.$el.trigger('request:' + type);

  this.data.fetch({
    url:     '/api/dict/' + this.sid,
    timeout: 10000,
    data: {
      limit: this.limit             || null,
      query: this.search.getQuery() || '',
      keys:  this.keys              || {},
      vals:  this.vals              || {}
    },
    success: function() {
      _this.hideLoading();
      _this.hideErrorOnServer();
      _this.hideInformationNotFound();
      _this.checkResponse(type);
    },
    error: function() {
      _this.hideLoading();
      _this.showErrorOnServer();
    }
  });
};

Gsender.prototype.checkResponse = function(type) {

  if (type == null) {
    type = "scroll";
  }

  switch (type) {
    case 'update':
      this.selectRowUUID = this.getUUIDbyFirstRecord();
      this.colorActiveLine();
    break;
    case 'onload':
      this.selectRowUUID = this.getUUIDbyFirstRecord();
      this.colorActiveLine();
      this.updateChilds();
    break;      
    case 'search':
      this.selectRowUUID = this.getUUIDbyFirstRecord();
      this.colorActiveLine();
      this.updateChilds();
    break;      
  }

  if (this.data.length < 1) {
    this.showInformationNotFound();
  }

  this.$el.trigger('response:' + type);
};

module.exports = Gsender;
