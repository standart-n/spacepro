
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
      if (value.color) {
        var c = value.color;
        var hex = '00000'+(((c&0xff)<<16)+(c&0xff00)+(c>>16)).toString(16);
        value.hex = hex.slice(-6);
      } else {
        value.hex = 'ccc';
      }
      if ((value.caption) && (value.id !== 0)) {
        list.push(value);
      } else {
        value.caption = 'Все';
        list.push(value);
      }
      tr.query(_this.sqlGroups(name, value.id), function(err, res) {
        if (!err) {
          if (res.length > 0) {
            recurse(tr, res, depth + 1, fn);
          } else {
            fn();
          }
        } else {
          fn(err);
        }
      });    

    }, function() {
      fn();
    });
  };

  this.fbCreateConnection(function(err, db) {
    if (!err) {
      db.startTransaction(function(err, tr) {
        if (!err) {
          recurse(tr, [
          {
           id: 0 
          }], depth, function(err) {
            tr.rollback();
            db.detach();
            if (!err) {
              fn(null, list);
            } else {
              fn(err);
            }
          });
        } else {
          db.detach();
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

Group.prototype.getListOfGroups = function(fn) {
  var _this = this;

  if (fn == null) {
    fn = function() {};
  }

  this.fbCreateConnection(function(err, db) {
    if (!err) {
      db.query(_this.sqlGroupList(), function(err, result) {
        db.detach();
        if (!err) {
          fn(null, _.pluck(result, 'grouptable'));
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
  var query, type;

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

    if (name.match(/.folders/)) {
      // console.log('folder:', name);
      type = 'Folders';
      query = DictModel.find({
        'settings.main.foldergroup': name
      });
    } else {
      type = 'Groups';
      query = DictModel.find({
        'settings.main.mmbshgroup': name
      });
    }

    query.exec(function(err, dicts) {
      if (err) {
        _this.set('error', err);
        fn(err);
      } else {
        if (dicts != null) {
          async.eachSeries(dicts, function(dict, cb) {
            if (type === 'Folders') {
              dict.settings.folders = groups;
            } else {
              dict.settings.groups = groups;
            }
            dict.save(function(err) {
              if (err) {
                cb(err);
              } else {
                var log = (moment().format('HH:mm:ss.SSS').blue)  + " " +
                       (moment().format('DD/MM/YYYY').magenta)    + " " +
                       "update".green                             + " " +
                       type.cyan                                  + " " +
                       name.yellow                                + " " +
                       dict.sid.red;
                console.log(log);
              }
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

