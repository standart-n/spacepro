
/*
Модуль для работы с Memcached
@module Memcached
*/

var Backbone, Memcached, Fake, memcached;

Backbone =  require('backbone');
memcached = require('memcached');

/*
Инициализация класса
@class Fake
*/

Fake = function() {};

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

Memcached = Backbone.Model.extend({

  defaults: function() {
    return {
      mc_connection:  process.env.MEMCACHED_CONNECTION,
      mc_poolsize:    10,      
      mc_fake:        false
    };
  },

  initialize: function() {
    if ((this.get('mc_connection') == null) || (this.get('mc_connection') === undefined)) {
      this.set('mc_fake', true);
    }
    if (!this.get('mc_fake')) {
      memcached.config.poolsize = this.get('mc_poolsize');
      global.memcached = new memcached(process.env.MEMCACHED_CONNECTION);
    }
    if ((!global.memcached.connections.length) || (this.get('mc_fake'))) {
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
