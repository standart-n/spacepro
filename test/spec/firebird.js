
var Firebird, assert, conf;

process.env.APP_DIR = '../..';

conf =    require(process.env.APP_DIR + '/test/conf/fb.json');

process.env.FIREBIRD_HOST =         conf.host;
process.env.FIREBIRD_PATH =         conf.path;
process.env.FIREBIRD_USER =         conf.user;
process.env.FIREBIRD_PASSWORD =     conf.password;

assert = require('chai').assert;

Firebird = require(process.env.APP_DIR + '/lib/controllers/firebird');

describe('Firebird fields:', function() {

  describe('Get fields:', function() {
    it('Should return fields with types', function() {
      var firebird,
        fields = [
          { 
            type:     452,
            field:    'D$UUID',
            relation: 'VW_DEVICE',
            alias:    'D$UUID' 
          },
          { 
            type:     448,
            field:    'KEY_ID',
            relation: 'VW_DEVICE',
            alias:    'KEY_ID' 
          },
          { 
            type:     510,
            field:    'INSERTDT',
            relation: 'VW_DEVICE',
            alias:    'INSERTDT' 
          }
        ],
        result = {
          'd$uuid': { 
            type:     452,
            mtype:    'text',
            field:    'D$UUID',
            relation: 'VW_DEVICE',
            alias:    'D$UUID' 
          },
          'key_id': { 
            type:     448,
            mtype:    'varying',
            field:    'KEY_ID',
            relation: 'VW_DEVICE',
            alias:    'KEY_ID' 
          },
          'insertdt': { 
            type:     510,
            mtype:    'timestamp',
            field:    'INSERTDT',
            relation: 'VW_DEVICE',
            alias:    'INSERTDT' 
          }
        };

      firebird = new Firebird();
      assert.deepEqual(result,firebird.getFields(fields));

    });
  });


});

describe('Firebird with local connection:', function() {

  describe('Open and commit:', function() {
    it('Should return without errors', function(done) {
      var firebird;

      firebird = new Firebird({
        fb_global: false
      });

      firebird.fbConnectionOpen(function() {      
        assert.equal(null,      firebird.get('fb_error'),         'fb_error');
        assert.equal(null,      firebird.get('fb_transaction'),   'fb_transaction');
        assert.equal(true,      firebird.fbIsConnectionReady(),   'fb_connection 1');

        firebird.fbTransactionStart(function() {      
          assert.equal(null,      firebird.get('fb_error'),        'fb_error');
          assert.notEqual(null,   firebird.get('fb_transaction'),  'fb_transaction');
          assert.equal(true,      firebird.fbIsConnectionReady(),  'fb_connection 2');

          firebird.fbTransactionCommit(function() {

            assert.equal(null,    firebird.get('fb_error'),        'fb_error');
            assert.equal(null,    firebird.get('fb_transaction'),  'fb_transaction');
            assert.equal(true,    firebird.fbIsConnectionReady(),  'fb_connection 3');

            firebird.fbConnectionClose();

            assert.equal(null,    firebird.get('fb_error'),        'fb_error');
            assert.equal(null,    firebird.get('fb_transaction'),  'fb_transaction');
            assert.equal(false,   firebird.fbIsConnectionReady(),  'fb_connection 4');

            done();
          });
        });
      });

    });
  });


  describe('Open and rollback:', function() {
    it('Should return without errors', function(done) {
      var firebird;

      firebird = new Firebird({
        fb_global: false
      });

      firebird.fbConnectionOpen(function() {      
        assert.equal(null,      firebird.get('fb_error'),         'fb_error');
        assert.equal(null,      firebird.get('fb_transaction'),   'fb_transaction');
        assert.equal(true,      firebird.fbIsConnectionReady(),   'fb_connection');

        firebird.fbTransactionStart(function() {      
          assert.equal(null,      firebird.get('fb_error'),        'fb_error');
          assert.notEqual(null,   firebird.get('fb_transaction'),  'fb_transaction');
          assert.equal(true,      firebird.fbIsConnectionReady(),  'fb_connection');

          firebird.fbTransactionRollback(function() {

            assert.equal(null,    firebird.get('fb_error'),        'fb_error');
            assert.equal(null,    firebird.get('fb_transaction'),  'fb_transaction');
            assert.equal(true,    firebird.fbIsConnectionReady(),  'fb_connection');

            firebird.fbConnectionClose();

            assert.equal(null,    firebird.get('fb_error'),        'fb_error');
            assert.equal(null,    firebird.get('fb_transaction'),  'fb_transaction');
            assert.equal(false,   firebird.fbIsConnectionReady(),  'fb_connection');

            done();
          });
        });
      });

    });
  });


  describe('Open and make error:', function() {
    it('Should return error', function(done) {
      var firebird;

      firebird = new Firebird({
        fb_global: false
      });

      firebird.fbConnectionOpen(function() {      
        assert.equal(null,      firebird.get('fb_error'),         'fb_error 1');
        assert.equal(null,      firebird.get('fb_transaction'),   'fb_transaction 1');
        assert.equal(true,      firebird.fbIsConnectionReady(),   'fb_connection 1');

        firebird.fbTransactionStart(function() {      
          assert.equal(null,      firebird.get('fb_error'),        'fb_error 2');
          assert.notEqual(null,   firebird.get('fb_transaction'),  'fb_transaction 2');
          assert.equal(true,      firebird.fbIsConnectionReady(),  'fb_connection 2');

          firebird.fbCheckError('Test error', function() {

            assert.equal('Test error',    firebird.get('fb_error'),        'fb_error 3');
            assert.equal(null,            firebird.get('fb_transaction'),  'fb_transaction 3');
            assert.equal(true,            firebird.fbIsConnectionReady(),  'fb_connection 3');

            firebird.fbConnectionClose();

            assert.equal(false,           firebird.fbIsConnectionReady(),  'fb_connection 4');

            done();
          });
        });
      });

    });
  });


  describe('Auto commit and close connection:', function() {
    it('Should return without error', function(done) {
      var firebird;

      firebird = new Firebird({
        fb_global: false
      });

      firebird.fbConnectionOpen(function() {      
        assert.equal(null,      firebird.get('fb_error'),         'fb_error');
        assert.equal(null,      firebird.get('fb_transaction'),   'fb_transaction');
        assert.equal(true,      firebird.fbIsConnectionReady(),   'fb_connection');

        firebird.fbTransactionStart(function() {      
          assert.equal(null,      firebird.get('fb_error'),        'fb_error');
          assert.notEqual(null,   firebird.get('fb_transaction'),  'fb_transaction');
          assert.equal(true,      firebird.fbIsConnectionReady(),  'fb_connection');

          firebird.fbCommitAndCloseConnection(function() {

            assert.equal(null,    firebird.get('fb_error'),        'fb_error');
            assert.equal(null,    firebird.get('fb_transaction'),  'fb_transaction');
            assert.equal(false,   firebird.fbIsConnectionReady(),  'fb_connection');

            done();
          });
        });
      });

    });
  });

});



describe('Firebird with global connection:', function() {

  describe('Open and commit:', function() {
    it('Should return without errors', function(done) {
      var firebird;

      firebird = new Firebird();

      firebird.fbConnectionOpen(function() {      
        assert.equal(null,      firebird.get('fb_error'),         'fb_error');
        assert.equal(null,      firebird.get('fb_transaction'),   'fb_transaction');
        assert.equal(true,      firebird.fbIsConnectionReady(),   'fb_connection');

        firebird.fbTransactionStart(function() {      
          assert.equal(null,      firebird.get('fb_error'),        'fb_error');
          assert.notEqual(null,   firebird.get('fb_transaction'),  'fb_transaction');
          assert.equal(true,      firebird.fbIsConnectionReady(),  'fb_connection');

          firebird.fbTransactionCommit(function() {

            assert.equal(null,    firebird.get('fb_error'),        'fb_error');
            assert.equal(null,    firebird.get('fb_transaction'),  'fb_transaction');
            assert.equal(true,    firebird.fbIsConnectionReady(),  'fb_connection');

            firebird.fbConnectionClose();

            assert.equal(null,    firebird.get('fb_error'),        'fb_error');
            assert.equal(null,    firebird.get('fb_transaction'),  'fb_transaction');
            assert.equal(false,   firebird.fbIsConnectionReady(),  'fb_connection');

            done();
          });
        });
      });

    });
  });


  describe('Open and rollback:', function() {
    it('Should return without errors', function(done) {
      var firebird;

      firebird = new Firebird();

      firebird.fbConnectionOpen(function() {      
        assert.equal(null,      firebird.get('fb_error'),         'fb_error');
        assert.equal(null,      firebird.get('fb_transaction'),   'fb_transaction');
        assert.equal(true,      firebird.fbIsConnectionReady(),   'fb_connection');

        firebird.fbTransactionStart(function() {      
          assert.equal(null,      firebird.get('fb_error'),        'fb_error');
          assert.notEqual(null,   firebird.get('fb_transaction'),  'fb_transaction');
          assert.equal(true,      firebird.fbIsConnectionReady(),  'fb_connection');

          firebird.fbTransactionRollback(function() {

            assert.equal(null,    firebird.get('fb_error'),        'fb_error');
            assert.equal(null,    firebird.get('fb_transaction'),  'fb_transaction');
            assert.equal(true,    firebird.fbIsConnectionReady(),  'fb_connection');

            firebird.fbConnectionClose();

            assert.equal(null,    firebird.get('fb_error'),        'fb_error');
            assert.equal(null,    firebird.get('fb_transaction'),  'fb_transaction');
            assert.equal(false,   firebird.fbIsConnectionReady(),  'fb_connection');

            done();
          });
        });
      });

    });
  });


  describe('Open and make error:', function() {
    it('Should return error', function(done) {
      var firebird;

      firebird = new Firebird();

      firebird.fbConnectionOpen(function() {      
        assert.equal(null,      firebird.get('fb_error'),         'fb_error 1');
        assert.equal(null,      firebird.get('fb_transaction'),   'fb_transaction 1');
        assert.equal(true,      firebird.fbIsConnectionReady(),   'fb_connection 1');

        firebird.fbTransactionStart(function() {      
          assert.equal(null,      firebird.get('fb_error'),        'fb_error 2');
          assert.notEqual(null,   firebird.get('fb_transaction'),  'fb_transaction 2');
          assert.equal(true,      firebird.fbIsConnectionReady(),  'fb_connection 2');

          firebird.fbCheckError('Test error', function() {

            assert.equal('Test error',    firebird.get('fb_error'),        'fb_error 3');
            assert.equal(null,            firebird.get('fb_transaction'),  'fb_transaction 3');
            assert.equal(true,            firebird.fbIsConnectionReady(),  'fb_connection 3');

            firebird.fbConnectionClose();

            assert.equal(false,           firebird.fbIsConnectionReady(),  'fb_connection 4');

            done();
          });
        });
      });

    });
  });


  describe('Auto commit and close connection:', function() {
    it('Should return without error', function(done) {
      var firebird;

      firebird = new Firebird();

      firebird.fbConnectionOpen(function() {      
        assert.equal(null,      firebird.get('fb_error'),         'fb_error');
        assert.equal(null,      firebird.get('fb_transaction'),   'fb_transaction');
        assert.equal(true,      firebird.fbIsConnectionReady(),   'fb_connection');

        firebird.fbTransactionStart(function() {      
          assert.equal(null,      firebird.get('fb_error'),        'fb_error');
          assert.notEqual(null,   firebird.get('fb_transaction'),  'fb_transaction');
          assert.equal(true,      firebird.fbIsConnectionReady(),  'fb_connection');

          firebird.fbCommitAndCloseConnection(function() {

            assert.equal(null,    firebird.get('fb_error'),        'fb_error');
            assert.equal(null,    firebird.get('fb_transaction'),  'fb_transaction');
            assert.equal(false,   firebird.fbIsConnectionReady(),  'fb_connection');

            done();
          });
        });
      });

    });
  });

});
