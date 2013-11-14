
var Firebird, AddDeviceValue, async;

async = require('async');

Firebird =     require(process.env.APP_DIR + '/lib/controllers/firebird');

AddDeviceValue = Firebird.extend({

  defaults: {
    uuid:          '',
    value:         0,
    status:        0,
    result:        'success',
    insertdt:      'NOW()',
    session_id:    ''
  },

  initialize: function() {

  },

  insertValue: function(fn) {
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

      insertValue: function(fn) {
        var tr;
        if (_this.get('fb_transaction')) {
          tr = _this.get('fb_transaction');
          tr.query(_this.sqlInsertValue(), function(err, result) {
            if (!err) {
              _this.fbTransactionCommit(fn);
            } else {
              _this.fbCheckError(err, fn);
            }
          });
        } else {
          _this.fbCheckError('Transaction not found', fn);
        }
      }

    }, function(err, result) {
      _this.fbConnectionClose();
      fn();
    });

  },

  sqlInsertValue: function() {
    return  "update or insert into account_data \n" +
            "(DEVICE_D$UUID,VAL,INSERTDT,STATUS,UPDATESESSION_ID,CUR_DATE) \n" +
            "values ( \n" + 
            "'" + this.get('uuid') + "', \n" + 
            "'" + this.get('value') + "', \n" +
            "iif(" + this.get('status') + "=1, \n" +
            "current_timestamp,current_timestamp), \n" +
            "" + this.get('status') + ", \n" +
            "'" + this.get('session_id').toString() + "', \n" + 
            "current_date) \n" + 
            "matching (DEVICE_D$UUID,CUR_DATE)";
  }

});


exports = module.exports = AddDeviceValue;

exports.addDeviceValue = new AddDeviceValue();

