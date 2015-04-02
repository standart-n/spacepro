
/*
@module FbEvent
*/

var Backbone =  require('backbone');
// var fb =        require('firebird');
var fb =        require(process.env.APP_DIR + '/node-firebird-libfbclient/firebird');

/*
Инициализация класса
@class Firebird
*/

var FbEvent = Backbone.Model.extend({

  defaults: function() {
    return {
      // настройки по-умолчанию берутся из файла
      fb_host:        process.env.FIREBIRD_HOST,
      fb_database:    process.env.FIREBIRD_PATH,
      fb_user:        process.env.FIREBIRD_USER,
      fb_password:    process.env.FIREBIRD_PASSWORD,
      fb_port:        3050,
      fb_connection:  null,
      fb_transaction: null,
      fb_error:       null,
      fb_hide_errors: true,
      // использовать или нет подключение как глобальный объект 
      fb_global:      true
    };
  },

  initialize: function() {
    //
  }

});

/*
@api public
*/

FbEvent.prototype.start = function(fn) {

  if (fn == null) {
    fn = function() {};
  }

  this.set({
    fb_host:        this.get('fb_host')       || process.env.FIREBIRD_HOST      || '',
    fb_database:    this.get('fb_database')   || process.env.FIREBIRD_PATH      || '',
    fb_user:        this.get('fb_user')       || process.env.FIREBIRD_USER      || '',
    fb_password:    this.get('fb_password')   || process.env.FIREBIRD_PASSWORD  || ''
  });

  // connect = fb.createConnection();
  // connect.connectSync(this.get('fb_host') + ':' + this.get('fb_database'), this.get('fb_user'), this.get('fb_password'), '');
  // connect.addFBevent('EV_USERMSG');
  // connect.on('fbevent', function(event, count) {
  //   if (count > 0) {
  //     console.log('event:', event);
  //   }
  // });

  // fb.attach({
  //   host:           this.get('fb_host'),
  //   database:       this.get('fb_database'),
  //   user:           this.get('fb_user'),
  //   password:       this.get('fb_password')
  // }, function(err, connect) {

  //   fn(err, connect);

  // });

};


/*
@export FbEvent
*/

exports = module.exports = new FbEvent();
