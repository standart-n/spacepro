
var _ =          require('underscore');
var Backbone =   require('backbone');
var Common =     require('common');
var Data =       require('data');
var Dict =       require('dict');
var Search =     require('search');
var Insert =     require('insert');
var Folders =    require('folders');

// AddDeviceValue = require('addDeviceValue.pl');

var Gsender = Common.extend({

  el: "[data-view=\"dict\"]",

  initialize: function() {
    var model,
      _this = this;

    this.dict = new Dict(this.options.conf || {});

    this.$thead =       this.$el.find('thead');
    this.$worksheet =   this.$el.find('tbody');
    this.$toolbar =     this.$el.find("[data-view=\"toolbar\"]");
    this.$search =      this.$el.find("[data-view=\"search\"]");
    this.$insert =      this.$el.find("[data-view=\"insert\"]");
    this.$folders =     this.$el.find("[data-view=\"folders\"]");

    this.dict.set('type', this.$el.data("dict-type") || 'parent');
    this.dict.cleanVals();

    this.toolbar = this.dict.get('toolbar');

    this.data = new Data();
    this.data.setIdAttribute(this.dict.get('keyfieldname'));
    this.data.url = '/api/dict/' + this.dict.get('sid');

    if (this.toolbar.search === true) {
      this.search = new Search({
        el:    this.$search,
        conf:  this.options.conf || {}
      });

      this.data.on('add', function(data) {
        _this.search.select.addOption(data.toJSON());
      });

      this.search.on('search', function(query) {
        _this.dict.set({
          query: query
        });
        _this.sendRequest('search');
      });
    }

    if (this.toolbar.folders === true) {

      this.folders = new Folders({
        el:    this.$folders,
        conf:  this.options.conf
      });

      if (this.options.conf.initfolder_id) {
        this.dict.set('folder_id', this.options.conf.initfolder_id);
      }

      this.folders.on('select', function(folder_id) {
        _this.dict.set({
          folder_id: folder_id
        });
        _this.sendRequest('search');
      });
    }

    if (this.toolbar.insert === true) {

      this.insert = new Insert({
        el:    this.$insert,
        conf:  this.options.conf
      });

      this.$el.on('click', "[data-action=\"insert\"]", function(e) {
        e.preventDefault();
        if (_this.insert.autoinsert === true) {
          _this.insert.request();
        } else {
          _this.$insert.modal('show');
        }
      });
    }

    this.$toolbar.find("[data-toggle=\"tooltip\"]").tooltip({
      container: 'body',
      placement: 'top'
    });

    this.$thead.find("[data-toggle=\"tooltip\"]").tooltip({
      container: 'body'
      // placement: 'top'
    });

    // this.$el.on('scroll', function() {
    //   if (_this.$el.scrollTop() + _this.$el.height() === _this.$el.find('.container').height()) {
    //     _this.dict.set('limit', _this.data.length + _this.dict.get('step'));
    //     _this.sendRequest('scroll');
    //   }
    // });

    this.$el.on('mouseover', function() {
      $(this).css({
        'cursor': 'pointer'
      });
    });

    this.$el.on('click', 'td', function() {
      var $tr = $(this).parent();
      _this.unColorActiveLine();
      _this.dict.set('selectRowUUID', $tr.data('uuid'));
      _this.colorActiveLine();
      _this.updateChilds();
    });

    this.$el.on('dblclick', 'td', function() {
      var $tr = $(this).parent();
      // alert($(this).data('col-value'));
    });

    this.$el.on('click', "[data-action=\"delete\"]", function() {      
      var $tr = $(this).parent().parent();
      _this.dict.set('selectRowUUID', $tr.data('uuid'));
      _this.sendRequest('remove', _this.getSelectLine());
    });

    this.data.on('add', function(line) {
      var key = _this.dict.get('keyfieldname');
      _this.$worksheet.append(jade.templates.line_data({
        keyfieldname: key,
        columns:      _this.dict.get('columns'),
        line:         line.toJSON()
      }));
      _this.$worksheet.find("[data-uuid=\"" + line.get(key) + "\"]").find("[data-toggle=\"tooltip\"]").tooltip({
        container: 'body',
        placement: 'top'
      });
      // _this.$el.trigger('add.line', line.toJSON());
    });

    this.data.on('remove', function(line) {
      var key = _this.dict.get('keyfieldname');
      _this.$worksheet.find("[data-uuid=\"" + line.get(key) + "\"]").remove();
      // _this.$el.trigger('remove.line', line.toJSON());
    });

    if (_this.dict.get('type') === 'parent') {
      _this.sendRequest('onload');
    }

  }
});

Gsender.prototype.update = function(vals) {
  if (this.dict.get('type') === 'child') {
    this.dict.set('limit', 50);
    this.dict.cleanVals(vals);
    if (this.search != null) {      
      this.search.select.conf.keys = this.dict.get('keys');
      this.search.select.conf.vals = this.dict.get('vals');
    }
    this.sendRequest('update');
  }
};

Gsender.prototype.updateChilds = function() {
  var _this = this;
  var line = this.getSelectLine();
  if (this.data !== null) {
    _.each(this.dict.get('childsInfo'), function(childInfo) {
      if (window[childInfo.wdict] !== undefined) {
        if (line != null) {
          window[childInfo.wdict].update(line.toJSON() || {});
          if (window[childInfo.wdict].search != null) {
            if (window[childInfo.wdict].search.select != null) {
              window[childInfo.wdict].search.select.clearOptions();
            }
          }
        } else {
          window[childInfo.wdict].showInformationNotFound();
        }
      }
    });
  }
};

Gsender.prototype.getUUIDbyFirstRecord = function() {
  return this.$worksheet.find('tr:first').data('uuid') || '';
};

Gsender.prototype.getSelectLine = function() {
  return this.data.get(this.dict.get('selectRowUUID')) || {};
};

Gsender.prototype.unColorActiveLine = function(classname) {
  if (classname == null) {
    classname = 'active';
  }
  this.$activeLine = this.$worksheet.find("[data-uuid=\"" + this.dict.get('selectRowUUID') + "\"]").first();
  if (this.$activeLine != null) {
    this.$activeLine.removeClass(classname);
  }
};

Gsender.prototype.colorActiveLine = function(classname) {
  if (classname == null) {
    classname = 'active';
  }
  this.$activeLine = this.$worksheet.find("[data-uuid=\"" + this.dict.get('selectRowUUID') + "\"]").first();
  if (this.$activeLine != null) {
    this.$activeLine.addClass(classname);
  }
};

Gsender.prototype.showInformationNotFound = function() {
  this.$worksheet.html(jade.templates.line_nothing({
    columns: this.dict.get('columns') || {}
  }));
};

Gsender.prototype.hideInformationNotFound = function() {
  this.$worksheet.find("[data-type=\"nothing\"]").remove();
};

Gsender.prototype.showErrorOnServer = function() {
  this.$worksheet.html(jade.templates.line_error({
    columns: this.dict.get('columns') || {}
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
          columns: this.dict.get('columns') || {}
        }));
      break;
      case 'after':
        this.$worksheet.append(jade.templates.line_loading({
          columns: this.dict.get('columns') || {}
        }));
      break;
      case 'before':
        this.$worksheet.prepend(jade.templates.line_loading({
          columns: this.dict.get('columns') || {}
        }));
      break;
    }
  }
};

Gsender.prototype.hideLoading = function() {
  this.$worksheet.find("[data-type=\"loading\"]").remove();
};

Gsender.prototype.sendRequest = function(type, model) {
  var method,
    url,
    success,
    error,
    _this = this;

  if (type == null) {
    type = 'scroll';
  }

  switch (type) {
    case 'onload':
      method = "fetch";
      this.$worksheet.empty();
      this.data.reset();
      this.showLoading();
    break;
    case 'update':
      method = "fetch";
      this.$worksheet.empty();
      this.data.reset();
      this.showLoading();
    break;
    case 'search':
      method = "fetch";
      this.$worksheet.empty();
      this.data.reset();
      this.showLoading();
    break;
    case 'scroll':
      method = "fetch";
      this.showLoading('after');
    break;
    case 'remove':
      method = "remove";
    break;
  }


  success = function() {
    _this.hideLoading();
    _this.hideErrorOnServer();
    _this.hideInformationNotFound();
    _this.checkResponse(type);
  };

  error = function() {
    _this.hideLoading();
    _this.showErrorOnServer();
  };

  if (method === 'fetch') {
    this.data.fetch({
      timeout: this.dict.get('timeout'),
      data: {
        limit:     this.dict.get('limit')         || null,
        folder_id: this.dict.get('folder_id')     || null,
        query:     this.dict.get('query')         || '',
        keys:      this.dict.get('keys')          || {},
        vals:      this.dict.get('vals')          || {}
      },
      success: success,
      error:   error
    });
  }

  if (method === 'remove') {
    $.ajax({
      url: '/api/dict/' + this.dict.get('sid'),
      type: 'GET',
      data: {
        _method: 'DELETE',
        line:    model.toJSON(),
        keys:    this.dict.get('keys')        || {},
        vals:    this.dict.get('vals')        || {}
      },
      timeout: this.dict.get('timeout'),
      success: success,
      error:   error
    });
    // model.destroy({
    //   timeout: timeout,
    //   // data:    data,
    //   success: success,
    //   error:   error
    // });
  }
  
};

Gsender.prototype.checkResponse = function(type) {

  if (type == null) {
    type = "scroll";
  }

  switch (type) {
    case 'update':
      this.dict.set('selectRowUUID', this.getUUIDbyFirstRecord());
      this.colorActiveLine();
    break;
    case 'onload':
      this.dict.set('selectRowUUID', this.getUUIDbyFirstRecord());
      this.colorActiveLine();
      this.updateChilds();
    break;      
    case 'search':
      this.dict.set('selectRowUUID', this.getUUIDbyFirstRecord());
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
