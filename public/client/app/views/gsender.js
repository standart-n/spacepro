
var _ =          require('underscore');
var Backbone =   require('backbone');
var Common =     require('common');
var Data =       require('data');
var Dict =       require('dict');
var Search =     require('search');
var Insert =     require('insert');
var Edit =       require('edit');
var Folder =     require('folder');
var Filter =     require('filter');

var Gsender = Common.extend({

  el: "[data-view=\"dict\"]",

  initialize: function() {
    var model,
      _this = this;

    this.dict = new Dict(this.options.conf || {});

    this.$caption =     $(document).find("[data-dict-caption=\"" + this.dict.get('sid') + "\"]");
    this.$thead =       this.$el.find('thead');
    this.$worksheet =   this.$el.find('tbody');
    this.$toolbar =     this.$el.find("[data-view=\"toolbar\"]");
    this.$search =      this.$el.find("[data-view=\"search\"]");
    this.$insert =      this.$el.find("[data-view=\"insert\"]");
    this.$edit =        this.$el.find("[data-view=\"edit\"]");
    this.$folders =     this.$el.find("[data-view=\"folders\"]");
    this.$filters =     this.$el.find("[data-view=\"filters\"]");

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

      this.folders = new Folder({
        el:    this.$folders,
        conf:  this.options.conf
      });

      if (store.get(this.dict.get('sid') + '#folder_id')) {
          this.dict.set('folder_id', store.get(this.dict.get('sid') + '#folder_id'));
      } else {
        if (this.options.conf.initfolder_id) {
          this.dict.set('folder_id', this.options.conf.initfolder_id);
        }
      }

      this.folders.on('select', function(folder_id) {
        _this.dict.set({
          folder_id: folder_id
        });
        store.set(_this.dict.get('sid') + '#folder_id', folder_id);
        _this.sendRequest('search');
      });
    }

    if (this.toolbar.filters === true) {

      this.filters = new Filter({
        el:    this.$filters,
        conf:  this.options.conf
      });

      if (store.get(this.dict.get('sid') + '#filter_id')) {
        this.dict.set('filter_id', store.get(this.dict.get('sid') + '#filter_id'));
      } else {
        if (this.options.conf.initfilter_id) {
          this.dict.set('filter_id', this.options.conf.initfilter_id);
        } else {
          this.dict.set('filter_id', -1);
        }
      }

      this.filters.on('select', function(filter_id) {
        _this.dict.set({
          filter_id: filter_id
        });
        store.set(_this.dict.get('sid') + '#filter_id', filter_id);
        _this.sendRequest('search');
      });
    }

    if (this.toolbar.insert === true) {

      this.insert = new Insert({
        el:         this.$insert,
        conf:       this.options.conf
      });

      this.$el.on('click', "[data-action=\"insert\"]", function(e) {
        e.preventDefault();
        _this.insert.open();
      });

      this.$insert.on('update', function() {
        _this.sendRequest('search');
      });
    }

    this.edit = new Edit({
      el:    this.$edit,
      conf:  this.options.conf
    });

    this.$edit.on('update', function() {
      _this.sendRequest('search');
    });

    this.$toolbar.find("[data-toggle=\"tooltip\"]").tooltip({
      container: 'body',
      placement: 'top'
    });

    this.$thead.find("[data-toggle=\"tooltip\"]").tooltip({
      container: 'body'
      // placement: 'top'
    });

    this.$el.on('mouseover', function() {
      $(this).css({
        'cursor': 'pointer'
      });
    });

    this.$el.on('click', 'td', function() {
      var $tr = $(this).parent();
      var uuid = $tr.data('uuid');
      if (!$tr.hasClass('active')) {
        _this.unColorActiveLine();
        _this.dict.set('selectRowUUID', uuid);
        _this.colorActiveLine();
        _this.updateChilds();
      } else {
        _this.edit.open($(this).data('col-field'), $(this).data('col-type'), _this.data.get(uuid).toJSON(), _this.dict.get('fields'));
      }
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

    this.on('scroll.end', function() {
      if (_this.isActiveDict()) {
        if (!_this.isScrolling) {
          _this.dict.set('limit', _this.data.length + _this.dict.get('step'));
          _this.sendRequest('scroll');
        }
      }
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
    vals = this.dict.get('vals');
    var keys = this.dict.get('keys');
    var controls = this.compareKeyVals(keys, vals);
    this.updateCaption(controls);
    if (this.search != null) {
      this.search.select.conf.keys = keys;
      this.search.select.conf.vals = vals;
    }
    if (this.insert != null) {
      this.insert.vals = _.extend(this.insert.vals, controls);
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
  var _this = this;
  var method;

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
      this.isScrolling = true;
      this.showLoading('after');
      this.updateScrollTime();
    break;
    case 'remove':
      method = "remove";
    break;
  }

  var success = function(res) {
    if (!res.err) {
      _this.dict.set('fields', res.fields || {});
      _this.data.add(res.data);
    } else {
      $.noty({
        text:         res.err,
        layout:       'topCenter',
        type:         'error',
        closeButton:  false,
        timeout:      3000
      });
    }
    _this.hideLoading();
    _this.hideErrorOnServer();
    _this.hideInformationNotFound();
    _this.checkResponse(type);
  };

  var error = function(e) {
    _this.hideLoading();
    _this.showErrorOnServer();
    console.error(e);
  };

  if (method === 'fetch') {

    $.ajax({
      url: '/api/dict/' + this.dict.get('sid'),
      type: 'GET',
      timeout: this.dict.get('timeout'),
      data: {
        limit:        this.dict.get('limit')         || null,
        folder_id:    this.dict.get('folder_id')     || null,
        filter_id:    this.dict.get('filter_id')     || null,
        query:        this.dict.get('query')         || '',
        keys:         this.dict.get('keys')          || {},
        vals:         this.dict.get('vals')          || {}
      },
      success: success,
      error:   error
    });
    // this.data.fetch({
    //   timeout: this.dict.get('timeout'),
    //   data: {
    //     limit:        this.dict.get('limit')         || null,
    //     folder_id:    this.dict.get('folder_id')     || null,
    //     filter_id:    this.dict.get('filter_id')     || null,
    //     query:        this.dict.get('query')         || '',
    //     keys:         this.dict.get('keys')          || {},
    //     vals:         this.dict.get('vals')          || {}
    //   },
    //   success: success,
    //   error:   error
    // });
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
    case 'scroll':
      this.isScrolling = false;
    break;
  }

  if (this.data.length < 1) {
    this.showInformationNotFound();
  }

  this.$el.trigger('response:' + type);
};

Gsender.prototype.isActiveDict = function() {
  return this.$el.css('display') !== 'none';
};

Gsender.prototype.updateCaption = function(controls) {
  var caption = this.dict.get('showcaption') || '';
  caption = this.setCaptionVals(caption, controls);
  this.$caption.html(caption);
};

Gsender.prototype.compareKeyVals = function(keys, vals) {
  var controls = {};
  _.each(keys, function(item, key) {
    if (vals[item]) {
      controls[key] = vals[item];
    }
  });
  return controls;
};

Gsender.prototype.setCaptionVals = function(str, line) {

  if (str == null) {
    str = '';
  }

  if (line == null) {
    line = {};
  }

  _.each(line, function(value, key) {
    var re, pattern;
    value =    value.toString().trim();
    key =      key.replace(/\$/gi, "\\$");
    pattern =  ':' + key + ':';
    re =       new RegExp(pattern, 'ig');
    if (str.match(re)) {
      if (value.length > 10) {
        value = '<b>' + value.slice(0, 10) + '</b>...';
      } else {
        value = '<b>' + value + '</b>';
      }
      str = str.replace(re, value);
    }
  });
  str = str.replace(/\"\"/g, '"');
  str = str.replace(/\"<b>\"/g, '"<b>');
  return str;
};

module.exports = Gsender;
