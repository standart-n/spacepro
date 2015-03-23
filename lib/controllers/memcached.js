
/*
Модуль для работы с Memcached
@module Memcached
*/

var Backbone =  require('backbone');
var memcached = require('memcached');

/*
Инициализация класса
@class Fake
*/

var Fake = function() {};

Fake.prototype.get = function() {
  if (typeof(arguments[arguments.length-1]) === 'function') {
    arguments[arguments.length-1]();
  }
};

Fake.prototype.set = function() {
  if (typeof(arguments[arguments.length-1]) === 'function') {
    arguments[arguments.length-1]();
  }
};

/*
Инициализация класса
@class Memcached
*/

var Memcached = Backbone.Model.extend({

  defaults: function() {
    return {
      mc_connection:  process.env.MEMCACHED_CONNECTION,
      mc_poolsize:    10,      
      mc_fake:        true
    };
  },

  initialize: function() {
    if ((this.get('mc_connection') == null) || (this.get('mc_connection') === undefined)) {
      this.set('mc_fake', true);
    }
    if (!this.get('mc_fake')) {
      global.memcached = new memcached(process.env.MEMCACHED_CONNECTION, {
        poolSize: this.get('mc_poolsize') || 10
      });
    } else {
      global.memcached = new Fake();
    }
  }
});

/*
@export Memcached
*/

if (!global.memcached) {
  new Memcached();
}

exports = module.exports = global.memcached;
