var Storage, colors, exports, fs, _;

colors = require('colors');

fs = require('fs');

_ = require('lodash');

Storage = (function() {
  function Storage(attr) {
    this.options = {};
    this.defaults = {
      data: {},
      path: './settings.json'
    };
    if (attr != null) {
      if (typeof attr === 'string') {
        this.options.path = attr;
      }
      if (typeof attr === 'object') {
        this.options = attr;
      }
      this.options = _.extend({}, this.defaults, this.options);
    }
  }

  Storage.prototype.store = function(attr) {
    this.options = {};
    if (attr != null) {
      if (typeof attr === 'function') {
        attr = attr();
      }
      if (typeof attr === 'string') {
        this.options.path = attr;
      }
      if (typeof attr === 'object') {
        this.options = attr;
      }
      this.options = _.extend({}, this.defaults, this.options);
      return this.check();
    }
  };

  Storage.prototype.check = function() {
    if (!fs.existsSync(this.options.path)) {
      this.write();
    }
    return this.read();
  };

  Storage.prototype.write = function() {
    return fs.writeFileSync(this.options.path, JSON.stringify(this.options.data));
  };

  Storage.prototype.read = function() {
    if (fs.existsSync(this.options.path)) {
      return this.options.data = JSON.parse(fs.readFileSync(this.options.path));
    }
  };

  Storage.prototype.get = function(key) {
    var _base;
    if (key == null) {
      key = '';
    }
    this.check();
    return (_base = this.options.data)[key] != null ? (_base = this.options.data)[key] : _base[key] = false;
  };

  Storage.prototype.set = function(key, value) {
    if (key == null) {
      key = '';
    }
    if (value == null) {
      value = '';
    }
    this.check();
    this.options.data[key] = value;
    this.write();
    if (this.options.data[key] === value) {
      return true;
    } else {
      return false;
    }
  };

  Storage.prototype.remove = function(key) {
    if (key == null) {
      key = '';
    }
    this.check();
    delete this.options.data[key];
    this.write();
    return true;
  };

  Storage.prototype["export"] = function() {
    var _base;
    this.check();
    return (_base = this.options).data != null ? (_base = this.options).data : _base.data = false;
  };

  Storage.prototype["import"] = function(data) {
    this.check();
    this.options.data = data;
    this.write();
    if (this.options.data != null) {
      return true;
    } else {
      return false;
    }
  };

  Storage.prototype.question = function(rl, key, answer, callback) {
    var _this = this;
    if (key == null) {
      key = '';
    }
    if ((rl != null) && typeof rl !== 'string' && (key != null) && typeof key === 'string') {
      if (typeof answer !== 'string') {
        if (answer != null) {
          callback = answer;
        }
        answer = 'please input '.grey + key.blue + ': '.grey + '\n';
      }
      return rl.question(answer, function(value) {
        _this.set(key, value);
        if (callback != null) {
          return callback(value);
        }
      });
    }
  };

  return Storage;

})();

exports = module.exports = new Storage();

exports.Storage = Storage;
