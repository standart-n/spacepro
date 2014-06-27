var _, Data, AddDeviceValue, Gsender, Common, Search;

_ =        require('underscore');
Common =   require('common');
Data =     require('data');
Search =   require('search');

// AddDeviceValue = require('addDeviceValue.pl');

Gsender = Common.extend({

  el: "[data-view=\"dict\"]",

  initialize: function() {
    var def,
      model,
      _this = this;

    def = {
      sid:                 '',
      caption:             '',
      showcaption:         '',
      limit:               50,
      step:                20,
      query:               '',
      selectRowUUID:       '',
      returnfieldname:     'd$uuid',
      captionfieldname:    'd$uuid',
      keyfieldname:        'd$uuid',
      keys:                {},
      vals:                {},
      columns:             {},
      childsInfo:          {},
      privileges: {
        I: false,
        S: false,
        U: [],
        D: false,
        F: false
      }
    };

    this.$worksheet = this.$el.find('tbody');

    this.options = _.defaults(this.options, def);

    if (!this.options.type) {
      this.options.type = this.$el.data("dict-type") || 'parent';
    }
    
    this.data = new Data();

    this.options.vals = this.cleanVals();

    this.search = new Search({
      el: this.$el.find("[data-view=\"search\"]")
    });

    this.search.on('search', function(query) {
      // alert('search');
      // if (_this.options.type === 'parent') {
      _this.options.limit = 50;
      _this.options.query = query;
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
        _this.options.limit = _this.data.length + _this.options.step;
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
      _this.options.selectRowUUID = $tr.data('uuid');
      _this.colorActiveLine();
      _this.updateChilds();
    });

    this.$el.on('click', "[data-action=\"delete\"]", function() {
      var $tr = $(this).parent().parent();
      _this.options.selectRowUUID = $tr.data('uuid');
      _this.sendRequest('delele');
    });

    this.data.on('add', function(line) {
      var key = _this.options.keyfieldname;
      _this.$worksheet.append(jade.templates.line_data({
        keyfieldname: key,
        columns:      _this.options.columns,
        line:         line.toJSON()
      }));
      _this.$worksheet.find("[data-uuid=\"" + line.get(key) + "\"]").find("[data-toggle=\"tooltip\"]").tooltip({
        container: 'body',
        placement: 'top'
      });
      _this.$el.trigger('add.line', line.toJSON());
    });

    this.data.on('remove', function(line) {
      var key = _this.options.keyfieldname;
      _this.$worksheet.find("[data-uuid=\"" + line.get(key) + "\"]").remove();
      _this.$el.trigger('add.line', line.toJSON());
    });

    if (_this.options.type === 'parent') {
      _this.sendRequest('onload');
    }

    // this.$el.find('.tooltip-toggle').tooltip({
    //   container: 'body'
    // });
    // this.$el.find('.tooltip-toggle').tooltip('show');

    // if (this.options.sid == 'WEB$DEVICE_DATA') {
    //   window.addDeviceValue = new AddDeviceValue({
    //     el:  this.el,
    //     sid: this.options.sid
    //   });
    // }    

  }
});

Gsender.prototype.update = function(vals) {
  if (this.options.type === 'child') {
    this.options.limit = 50;
    this.options.vals = this.cleanVals(vals);
    this.$el.trigger('start.update');
    this.sendRequest('update');
  }
};

Gsender.prototype.updateChilds = function() {
  var key,
    childs,
    line,
    _this = this;
  key =     this.options.keyfieldname;
  childs =  this.options.childs;
  line =    this.data.find(function(s) {
    return s.get(key) === _this.options.selectRowUUID;
  });
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
  this.$activeLine = this.$worksheet.find("[data-uuid=\"" + this.options.selectRowUUID + "\"]").first();
  if (this.$activeLine != null) {
    this.$activeLine.addClass(classname);
  }
};

Gsender.prototype.showInformationNotFound = function() {
  this.$worksheet.html(jade.templates.line_nothing({
    columns: this.options.columns || {}
  }));
};

Gsender.prototype.hideInformationNotFound = function() {
  this.$worksheet.find("[data-type=\"nothing\"]").remove();
};

Gsender.prototype.showErrorOnServer = function() {
  this.$worksheet.html(jade.templates.line_error({
    columns: this.options.columns || {}
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
          columns: this.options.columns || {}
        }));
      break;
      case 'after':
        this.$worksheet.append(jade.templates.line_loading({
          columns: this.options.columns || {}
        }));
      break;
      case 'before':
        this.$worksheet.prepend(jade.templates.line_loading({
          columns: this.options.columns || {}
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
    case 'delete':
    break;
  }

  this.$el.trigger('request:' + type);

  this.data.fetch({
    url:     '/api/dict/' + this.options.sid,
    timeout: 10000,
    data: {
      limit: this.options.limit         || null,
      query: this.search.getQuery()     || '',
      keys:  this.options.keys          || {},
      vals:  this.options.vals          || {}
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
      this.options.selectRowUUID = this.getUUIDbyFirstRecord();
      this.colorActiveLine();
    break;
    case 'onload':
      this.options.selectRowUUID = this.getUUIDbyFirstRecord();
      this.colorActiveLine();
      this.updateChilds();
    break;      
    case 'search':
      this.options.selectRowUUID = this.getUUIDbyFirstRecord();
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
