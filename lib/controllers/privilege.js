
/*
Модуль для работы с привелегиями
@module Privilege
*/

var _, Firebird, Privilege;

_ = require('lodash');

Firebird =   require(process.env.APP_DIR + '/lib/controllers/firebird');

/*
Инициализация класса

`var privilege = new Privilege(options);`

`options`:
- `user_id` `id` пользователя

@param {object} options
@class Privilege
@extends Firebird
*/

Privilege = Firebird.extend({

  defaults: function() {
    return {
      user_id:       0,
      usergroup_id:  0
    };
  },

  initialize: function() {}

});



/*
@export Privilege
*/

exports = module.exports = Privilege;
