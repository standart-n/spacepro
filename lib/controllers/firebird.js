
/*
Модуль для работы с базой Firebird
@module Firebird
*/

var _ =         require('lodash');
var Backbone =  require('backbone');
var moment =    require('moment');

var fb =        require(process.env.APP_DIR + '/firebird1.x');
var jsome =     require(process.env.APP_DIR + '/lib/controllers/jsome');

/*
Инициализация класса
@class Firebird
*/

var Firebird = Backbone.Model.extend({

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
Создать подключение к базе
@param {function} callback
@callback
@param {string} error
@param {connection} connection
@api public
*/

Firebird.prototype.fbConnectionCreate = function(fn) {

  if (fn == null) {
    fn = function() {};
  }

  this.set({
    fb_host:        this.get('fb_host')       || process.env.FIREBIRD_HOST      || '',
    fb_database:    this.get('fb_database')   || process.env.FIREBIRD_PATH      || '',
    fb_user:        this.get('fb_user')       || process.env.FIREBIRD_USER      || '',
    fb_password:    this.get('fb_password')   || process.env.FIREBIRD_PASSWORD  || ''
  });

  fb.attach({
    host:           this.get('fb_host'),
    database:       this.get('fb_database'),
    user:           this.get('fb_user'),
    password:       this.get('fb_password')
  }, function(err, connect) {

    // connect.on('data', function(res) {
    //   console.log(res);
    // });

    // connection._queueEvent(function(data) {
    //   console.log(data);
    // });

    // connection.fetch();

    // fb.connection._socket.on('data', function(data) {
    //   console.log('socket: ' + data);
    // });

    // fb.connection._queueEvent(function(data) {
    //   console.log('event: ' + data);
    // });

    fn(err, connect);
  });
};

/*
Найти существующее подключение к базе или создать новое
@param {function} callback(err,connection)
@callback
@param {string} error
@param {connection} connection
@api public
*/

Firebird.prototype.fbConnectionOpen = function(fn) {
  var _this = this;

  if (fn == null) {
    fn = function() {};
  }

  if (!this.get('fb_global')) {
    if (!this.get('fb_error')) {
      if (this.fbIsConnectionClose()) {
        this.fbConnectionCreate(function(err, connect) {
          if (connect != null) {
            _this.set('fb_connection', connect);
            fn(null, connect);
          } else {
            _this.fbCheckError(err, fn);
          }
        });
      } else {
        fn(null, this.get('fb_connection'));
      }
    } else {
      fn(this.get('fb_error'));
    }
  } else {
    if (!this.get('fb_error')) {
      if (this.fbIsConnectionClose()) {
        // console.log('need connect');
        this.fbConnectionCreate(function(err, connect) {
          if (connect != null) {
            global.fb_connection = connect;
            fn(null, connect);
          } else {
            _this.fbCheckError(err, fn);
          }
        });
      } else {
        fn(null, global.fb_connection);
      }
    } else {
      fn(this.get('fb_error'));
    }
  }

};

/*
Закрыть подключение
@api public
*/

Firebird.prototype.fbConnectionClose = function() {
  var connect;
  if (!this.get('fb_global')) {
    if (this.get('fb_connection')) {
      connect = this.get('fb_connection');
      connect.detach();
      this.unset('fb_connection');
    }
  } else {
    if (global.fb_connection) {
      global.fb_connection.detach();
      global.fb_connection = null;
    }
  }
};

/*
Проверить есть ли активное подключение к базе
@return {boolean} true если подключение активно
@api public
*/

Firebird.prototype.fbIsConnectionReady = function() {
  var connect, socket, res = false;
  if (!this.get('fb_global')) {
    connect = this.get('fb_connection');
  } else {
    connect = global.fb_connection;
  }
  if (connect != null) {
    if (connect.connection != null) {
      if (connect.connection._socket != null) {
        socket = connect.connection._socket;
        if ((socket.destroyed != null) && (socket.writable != null) && (socket.readable != null)) {
          if ((!socket.destroyed) && (socket.writable) && (socket.readable)) {
            res = true;
          }
        }
      }
    }
  }

  if ((!res) && (connect != null)) {
    if (!this.get('fb_global')) {
      this.unset('fb_connection');
      this.unset('fb_transaction');
    } else {
      global.fb_connection = null;
      this.unset('fb_transaction');
    }
  }
  return res;
};

/*
Проверить подключение к базе на доступность
@return {boolean} true если подключение закрыто
@api private
*/

Firebird.prototype.fbIsConnectionClose = function() {
  return !this.fbIsConnectionReady();
};

/*;
Открыть транзакцию
@param {function} callback
@callback
@param {string} error
@param {transaction} transaction
@api public
*/

Firebird.prototype.fbTransactionOpen = function(fn) {
  var _this = this;

  if (fn == null) {
    fn = function() {};
  }

  this.fbConnectionOpen(function(err, connect) {
    if (!err) {
      if (_this.get('fb_transaction')) {
        fn(null, _this.get('fb_transaction'));
      } else {
        connect.startTransaction(function(err, tr) {
        // connect.transaction(Firebird.ISOLATION_READ_COMMITED, function(err, tr) {
          if (!err) {
            _this.set('fb_transaction', tr);
            fn(null, tr);
          } else {
            fn(err);
          }
        });
      }
    } else {
      fn(err);
    }
  });
};

/*
Commit транзакции
@param {transaction} [transaction] транзакция
@param {function} callback
@callback
@param {string} error
@param {string} result
@api public
*/

Firebird.prototype.fbTransactionCommit = function(tr, fn) {
  var args,
    _this = this;
  // console.log('commit');
  args = _.toArray(arguments);
  switch (args.length) {
    case 0:
      tr = this.get('fb_transaction');
      fn = function() {};
    break;
    case 1:
      tr = this.get('fb_transaction');
      fn = args[0];
    break;
  }

  if (fn == null) {
    fn = function() {};
  }

  if (tr != null) {
    tr.commit(function(err) {
      if (!err) {
        _this.unset('fb_transaction');
        fn(null, 'commit');
      } else {
        _this.fbCheckError(err, fn);
      }
      // _this.unset('fb_transaction');
      // if (!_this.fbCheckError(err, fn)) {
      //   fn(null, 'commit');
      // }
    });
  }
};

/*
Закоммитить локальную транзакцию и закрыть соединение
@param {function} callback
@callback ()
@api private
*/

Firebird.prototype.fbCommitAndCloseConnection = function(fn) {
  var _this = this;

  if (fn == null) {
    fn = function() {};
  }

  this.fbTransactionCommit(function() {
    _this.fbConnectionClose();
    fn();
  });

};

/*
Rollback транзакции
@param {transaction} транзакция
@param {function} callback
@callback ()
@api public
*/

Firebird.prototype.fbTransactionRollback = function(tr, fn) {
  var args;
  // console.log('rollback');
  args = _.toArray(arguments);
  switch (args.length) {
    case 0:
      tr =       this.get('fb_transaction');
      fn =       function() {};
    break;
    case 1:
      tr =       this.get('fb_transaction');
      fn =       args[0];
    break;      
  }

  if (fn == null) {
    fn = function() {};
  }

  if (tr != null) {
    tr.rollback();
    this.unset('fb_transaction');
    fn();
  } else {
    fn();
  }
};

/*
Обработка ошибок
@param {(string|function)} error
@param {function} callback
@return {boolean} true если была ошибка
@callback
@return {string} error
@api private
*/

Firebird.prototype.fbCheckError = function(err, fn) {
  var req, tm;

  tm = moment().format('HH:mm:ss.SSS').red + " " + moment().format('DD/MM/YYYY').magenta;

  if (fn == null) {
    fn = function() {};
  }

  if (err != null) {
    // req = this.get('req') ? this.get('req') : {
    //   gettext: function(s) {
    //     return s;
    //   }
    // };
    // if (typeof err === 'function') {
    //   try {
    //     err = err();
    //   } catch(_error) {
    //     console.log(tm, _error);
    //   }
    // }
    // if (typeof err === 'string') {
    //   err = req.gettext(err);
    // }
    // if (typeof err === 'object') {
    //   if (err.hasOwnProperty('err')) {
    //     err.err = req.gettext(err.err);
    //   }
    // }
    this.set('fb_error', err);
    if (!this.get('fb_hide_errors')) {
      if (typeof(err) !== 'string') {
        console.error(tm, jsome(err));
      } else {
        console.error(tm, err);
      }
    }
    this.fbTransactionRollback();
    fn(err);
    return true;
  } else {
    return false;
  }
};

/*
Коды полей
@return {array} расшифровка типов полей
@api private
*/

Firebird.prototype.getFieldTypes = function() {
  var types = [];
  types[452] =   'text';
  types[448] =   'varying';
  types[500] =   'short';
  types[496] =   'long';
  types[482] =   'float';
  types[480] =   'double';
  types[530] =   'd_float';
  types[510] =   'timestamp';
  types[520] =   'blob';
  types[540] =   'array';
  types[550] =   'quad';
  types[560] =   'type_time';
  types[570] =   'type_date';
  types[580] =   'int64';
  types[32764] = 'boolean';
  types[32766] = 'null';
  return types;
};

/*
Получить типы полей по их кодам
@param {object} fields - поля
@return {array} массив с обозначением типов полей
@api public
*/

Firebird.prototype.getFields = function(fields) {
  var caption,
    tmp = {},
    types = this.getFieldTypes() || [];

  _.each(fields, function(field) {
    if ((field.alias != null) && (field.type != null) && (types[field.type] != null)) {
      caption = field.alias.toLowerCase();
      tmp[caption] = field;
      tmp[caption].mtype = types[field.type];
    }
  });
  return tmp;
};

/*
@export Firebird
*/

exports = module.exports = Firebird;
