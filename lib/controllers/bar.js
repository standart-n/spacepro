
var _, async, Firebird, Bar;

_ =          require('lodash');
async =      require('async');

Firebird =   require(process.env.APP_DIR + '/lib/controllers/firebird');

Bar = Firebird.extend({

  defaults: function() {
    return {
      active: '',
      dicts: []
    };
  },

  initialize: function() {
  },

  getDicts: function(fn) {

    var _this = this;

    if (fn == null) {
      fn = function() {};
    }

    async.series({
      getDictList: function(fn) {
        var tr;
        _this.fbTransactionOpen(function() {
          if (_this.get('fb_transaction')) {
            tr = _this.get('fb_transaction');
            tr.query(_this.sqlGetDicts(), function(err, result) {
              if ((result != null) && (!err)) {
                if (result.length < 1) {
                  _this.fbCheckError('Dicts not found', fn);
                } else {
                  _this.set('dicts', result);
                  _this.set('active', result[0].sid);
                  // console.log(_this.get('dicts'));
                  fn();
                }
              } else {
                _this.fbCheckError(err, fn);
              }
            });
          } else {
            _this.fbCheckError('Transaction not found', fn);
          }
        });
      }

    }, function(err, result) {
      fn();
    });


  },


  // sqlGetWebDicts: function(fn) {
  //   var tr,
  //     _this = this;

  //   if (fn == null) {
  //     fn = function() {};
  //   }

  //       _this.fbTransactionOpen(function() {
  //         if (_this.get('fb_transaction')) {
  //           tr = _this.get('fb_transaction');
    

  // },

  sqlGetDicts: function() {
    return "select \n" +
           "id, caption, sid, status, sorting \n" +
           "from sp$wdicts \n" +
           "where (1=1) \n" +
           "and (sid starting with 'WEB$')" +
           "order by sorting asc";
  }


});

exports = module.exports = Bar;
