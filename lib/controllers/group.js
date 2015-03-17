
/*
Модуль для работы с группами
@module Group
*/

var _ =          require('lodash');
var async =      require('async');
var moment =     require('moment');
var mongoose =   require('mongoose');

var Firebird =   require(process.env.APP_DIR + '/lib/controllers/firebird');
var DictSchema = require(process.env.APP_DIR + '/lib/schemas/dict');

var DictModel =  mongoose.model('Dict', DictSchema);

/*
Инициализация класса

`var group = new Group(options);`

@param {object} options
@class Group
@extends Firebird
*/

var Group = Firebird.extend({

  defaults: function() {
    return {
      name:        'uchet.folders',
      groups:      [],
      fb_global:   true
    };
  },

  initialize: function() {
    var name = this.get('name') || '';
    this.set('name', name.toString().toUpperCase().trim());
  }

});

/*
@api public
*/

Group.prototype.getTreeByGroupName = function(name, fn) {
  var _this = this;
  var list = [];
  var depth = 0;

  var args = _.toArray(arguments);
  switch (args.length) {
    case 0:
      name =   this.get('name') || '';
      fn =     function() {};
    break;
    case 1:
      name =   this.get('name') || '';
      fn =     args[0];   
    break;
  }

  var recurse = function(tr, result, depth, fn) {
    if (fn == null) {
      fn = function() {};
    }
    async.eachSeries(result, function(value, fn) {
      // list.push(_.pick(value, 'id', 'parent_id', 'caption', 'i'));
      value.depth = depth;
      list.push(value);
      tr.query(_this.sqlGroups(name, value.id), function(err, res, fields) {
        if (!err) {
          if (res.length > 0) {
            recurse(tr, res, depth + 1, fn);
          } else {
            fn();
          }
        } else {
          _this.fbCheckError(err, fn);
        }
      });    

    }, function() {
      fn();
    });
  };

  _this.fbTransactionOpen(function(err, tr) {
    if (!err) {
      recurse(tr, [
      {
       id: 0 
      }], depth, function() {
        // console.log(name, list);
        _this.fbTransactionCommit(function() {
          fn(null, list);
        });
      });
    } else {
      this.fbCheckError('Transaction not found: ' + err, fn);
    }
  });

};

/*
@api public
*/

Group.prototype.getListOfGroups = function(fn) {
  var _this = this;

  if (fn == null) {
    fn = function() {};
  }

  this.fbTransactionOpen(function(err, tr) {
    if (!err) {
      tr.query(_this.sqlGroupList(), function(err, res) {
        if (!err) {
          _this.fbTransactionCommit(function() {
            // console.log('groups:', res);
            fn(null, _.pluck(res, 'grouptable'));
          });
        } else {
          _this.fbCheckError(err, fn);
        }
      });    
    } else {
      this.fbCheckError('Transaction not found: ' + err, fn);
    }
  });

};

/*
@api public
*/

Group.prototype.updateAllGroups = function(fn) {
  var _this = this;

  if (fn == null) {
    fn = function() {};
  }

  this.getListOfGroups(function(err, list) {
    if (!err) {
      async.eachSeries(list, function(name, cb) {
        _this.getTreeByGroupName(name, function(err, groups) {
          if (!err) {
            _this.updateDicts(name, groups, cb);
          } else {
            cb(err);
          }
        });
      }, function(err) {
        if (!err) {
          fn();
        } else {
          fn(err);
        }
      });
    } else {
      fn(err);
    }
  });
};

/*
@api public
*/

Group.prototype.updateDicts = function(name, groups, fn) {
  var _this = this;

  var args = _.toArray(arguments);
  switch (args.length) {
    case 0:
      name =     this.get('name')   || '';
      groups =   this.get('groups') || '';
      fn =       function() {};
    break;
    case 1:
      name =     this.get('name')   || '';
      groups =   this.get('groups') || '';
      fn =       args[0];
    break;
    case 2:
      name =     this.get('name')   || '';
      groups =   args[0];
      fn =       args[1];
    break;
  }

  name = name.toString().trim().toLowerCase();

  if (name !== '') {
    DictModel.find({
      'settings.main.foldergroup': name
    }, function(err, dicts) {
      if (err) {
        _this.set('error', err);
        fn(err);
      } else {
        if (dicts != null) {
          async.eachSeries(dicts, function(dict, cb) {
            dict.settings.folders = groups;
            dict.save(function(err) {
              if (err) {
                cb(err);
              } else {
                var log = (moment().format('HH:mm:ss.SSS').blue)  + " " +
                      (moment().format('DD/MM/YYYY').magenta)     + " " +
                      "update".green                              + " " +
                      "Folders".cyan                              + " " +
                       name.yellow                                + " " +
                       dict.sid.red;
                console.log(log);
              }
              // console.log('update', dict.sid, dict.settings.folders);
              cb();
            });
          }, function(err) {
            if (!err) {
              fn();
            } else {
              fn(err);
            }
          });
        } else {
          fn('Data not found');
        }
      }
    });    
  } else {
    fn('Undefined name');
  }
};

/*
@api private
*/

Group.prototype.sqlGroupList = function(name, parent_id) {    
  return "select " +
         "g.grouptable " +
         "from sp$groups g " +
         "where (1=1) " +
         "and (g.status = 0) " +
         "group by g.grouptable " +
         "order by g.grouptable asc ";
};

/*
@api private
*/

Group.prototype.sqlGroups = function(name, parent_id) {    

  if (name == null) {
    name = 'USERS';
  }

  if (parent_id == null) {
    parent_id = 0;
  }

  return "select " +
         "g.id, parent_id, g.sid, g.caption as caption, g.color, g.sorting " +
         "from sp$groups g " +
         "where (1=1) " +
         "and (g.grouptable = '" + name + "') " +
         "and (g.status = 0) " +
         "and (g.parent_id = " + parent_id + ") " +
         "order by g.sorting asc";
};

/*
@export Group
*/

exports = module.exports = Group;

exports.group = new Group();

