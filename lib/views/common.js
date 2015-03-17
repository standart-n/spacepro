
var _ =          require('lodash');
var Backbone =   require('backbone');

var Common = Backbone.Model.extend({
  
  common: function() {
    this.set({
      pretty:             true,
      css:                [],
      js:                 [],
      scripts:            [],
      globalObjects:      [],
      wdicts_data:        {},
      json_locale_data: {
        messages: {}
      }
    });
  },
  
  addLocalCssFile: function(file) {
    var ms;
    if (file == null) {
      file = 'theme';
    }
    ms = this.get('css');
    file = this.editLocalFileName(file, 'css');
    ms.push(file);
    this.set('css', ms);
  },
  
  addLocalJsFile: function(file) {
    var ms;
    if (file == null) {
      file = 'sn';
    }
    ms = this.get('js');
    file = this.editLocalFileName(file, 'js');
    ms.push(file);
    this.set('js', ms);
  },
  
  addLocalJsLmdFile: function(file) {
    var ms;
    if (file == null) {
      file = 'sn';
    }
    ms = this.get('js');
    file = this.editLocalFileName(file, 'lmd.js');
    ms.push(file);
    this.set('js', ms);
  },
  
  addScript: function(script) {
    var ms;
    if (script == null) {
      script = '';
    }
    ms = this.get('scripts');
    ms.push(script);
    this.set('scripts', ms);
  },
  
  exportGlobalObject: function(name, obj) {
    var ms;
    if (name == null) {
      name = 'val';
    }
    if (obj == null) {
      obj = {};
    }
    ms = this.get('globalObjects');
    ms.push({
      name: name,
      data: obj
    });
    this.set('globalObjects', ms);
  },
  
  editLocalFileName: function(file, ext) {
    var version;
    if (file == null) {
      file = '';
    }
    if (ext == null) {
      ext = 'css';
    }
    version = this.get('version');
    if (!file.match(/\//)) {
      file = file.replace(/^\_/, '');
      file = file.replace(/.css$/, '');
      file = file.replace(/.less$/, '');
      file = file.replace(/.js$/, '');
      file = file.replace(/.lmd$/, '');
      file = file.replace(version, '');
      file = file.replace(/\.\./, '.');
      if (ext === 'css') {
        file = "" + file + "." + version + "." + 'css';
      }
      if (ext === 'js') {
        file = "" + file + "." + 'js';
      }
      if (ext === 'lmd.js') {
        file = "" + file + ".lmd." + version + "." + 'js';
      }
    }
    return file;
  },
  
  addLocaleString: function(keys) {
    var key, ms, req, _i, _len;
    if (typeof keys === 'string') {
      keys = _.toArray(arguments);
    }
    req = this.get('req');
    ms = this.get('json_locale_data');
    for (_i = 0, _len = keys.length; _i < _len; _i++) {
      key = keys[_i];
      // ms.messages[key] = [null, req.gettext(key)];
      ms.messages[key] = req.gettext(key);
    }
    this.set('json_locale_data', ms);
  }

});

exports = module.exports = Common;
