
/*
Модуль для работы с группами
@module Group
*/

var _ =          require('lodash');
var async =      require('async');

var Firebird =     require(process.env.APP_DIR + '/lib/controllers/firebird');

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
      name:        '',
      fb_global:   true
    };
  },

  initialize: function() {
    var name = this.get('name') || '';
    this.set('name', name.toString().toLowerCase().trim());
  }

});

/*
@api public
*/

Group.prototype.getTreeByGroupName = function(fn) {
  var _this = this;
  var list = [];

  var recurse = function(tr, result, fn) {
    if (fn == null) {
      fn = function() {};
    }
    async.eachSeries(result, function(value, fn) {
      // list.push(_.pick(value, 'id', 'parent_id', 'caption', 'i'));
      list.push(value);
      tr.query(_this.sqlGroups(value.id), function(err, res, fields) {
        if (!err) {
          if (res.length > 0) {
            recurse(tr, res, fn);
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

  if (fn == null) {
    fn = function() {};
  }



  _this.fbTransactionOpen(function(err, tr) {
    if (!err) {
      recurse(tr, [
      {
       id: 0 
      }], function() {
        console.log(list);
        _this.fbTransactionCommit(function() {
          fn();
        });
      });
    } else {
      this.fbCheckError('Transaction not found: ' + err, fn);
    }
  });

};

/*
@api private
*/

Group.prototype.sqlGroups = function(parent_id) {    

  if (parent_id == null) {
    parent_id = 0;
  }

  return "select " +
         "g.id, parent_id, g.sid, g.caption as caption, g.color, g.sorting " +
         //"gd.id as id, gd.group_id as group_id, gd.grouptable_id as user_id,  " +
         //"g.sid as sid, g.parent_id as parent_id, g.caption as caption, g.color as color, g.status as status " +
         "from sp$groups g " +
         "where (1=1) " +
         "and (g.grouptable = 'USERS') " +
         "and (g.status = 0) " +
         "and (g.parent_id = " + parent_id + ") " +
         "order by g.sorting asc";
};

/*
@export Group
*/

exports = module.exports = Group;

exports.group = new Group();

