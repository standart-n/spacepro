
var _, async, ini, Backbone;

_ =          require('lodash');
// ini =        require('ini');
// ini =        require('node-ini');
async =      require('async');
Backbone =   require('backbone');

Firebird =  require(process.env.APP_DIR + '/lib/controllers/firebird');
ini =       require(process.env.APP_DIR + '/lib/controllers/ini');

Dict = Firebird.extend({

  defaults: function() {
    return {
      id:    70,
      sid:   'DEVICE_DATA'
    };
  },

  initialize: function() {

  },

  initBySid: function(fn) {
    var _this = this;

    if (fn == null) {
      fn = function() {};
    }

    async.series({

      openConnection: function(fn) {
        _this.fbConnectionOpen(fn);
      },

      startTransaction: function(fn) {
        _this.fbTransactionStart(fn);
      },

      getIni: function(fn) {
        var tr;
        if (_this.get('fb_transaction')) {
          tr = _this.get('fb_transaction');
          tr.query(_this.sqlGetByDictSid(), function(err, result) {
            if ((result != null) && (!err)) {
              if (result.length < 1) {
                _this.fbCheckError('Dict not found', fn);
              } else {
                _this.checkLine(result[0]);
                _this.parseIni();
                fn();
              }
            } else {
              _this.fbCheckError(err, fn);
            }
          });
        } else {
          _this.fbCheckError('Transaction not found', fn);
        }
      }

    }, function(err, result) {

      fn();

    });

  },

  parseIni: function(data) {
    
    if (data == null) {
      data = this.get('ini');
      if (data == null) {
        data = '';
      }
    }

    // this.set('json', ini.parse(data));
    // console.log(this.get('json'));

    // ini.parse(data, function(err, json) {
    //   if (err) {
    //     console.log('err', err);
    //   } else {
    //     console.log('json', json);
    //   }
    // });

    ini.parse(data);

  },

  checkLine: function(result) {
    if (result == null) {
      result = {};
    }

    this.set({
      'id':           result.id            || null,
      'parent_id':    result.parent_id     || '0',
      'caption':      result.caption       || 'dict',
      'status':       result.status        || 0,
      'description':  result.description   || null,
      'sid':          result.sid           || null,
      'ini':          result.ini           || null,
      'insertdt':     result.insertdt      || null
    });

  },

  sqlGetByDictSid: function() {
    return "select \n" +
           "* \n" +
           "from sp$wdicts \n" +
           "where \n" +
           // "(1=1)";
           "(sid = '" + this.get('sid') + "')";
  }

});

exports = module.exports = Dict;
