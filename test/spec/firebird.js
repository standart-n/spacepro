
var Firebird, assert, fb_test_data;

process.env.APP_DIR = '../..';

fb_test_data =    require(process.env.APP_DIR + '/test/conf/fb.json');

process.env.FIREBIRD_HOST =         fb_test_data.host;
process.env.FIREBIRD_PATH =         fb_test_data.path;
process.env.FIREBIRD_USER =         fb_test_data.user;
process.env.FIREBIRD_PASSWORD =     fb_test_data.password;

assert = require('chai').assert;

Firebird = require(process.env.APP_DIR + '/lib/controllers/firebird');

describe('Firebird:', function() {

  describe('Open and commit:', function() {
    it('Should return without errors', function(done) {
      var firebird;

      firebird = new Firebird();

      firebird.fbConnectionOpen(function() {      
        assert.equal(null,      firebird.get('error'),            'error');
        assert.equal(null,      firebird.get('fb_transaction'),   'fb_transaction');
        assert.notEqual(null,   firebird.get('fb_connection'),    'fb_connection');

        firebird.fbTransactionStart(function() {      
          assert.equal(null,      firebird.get('error'),           'error');
          assert.notEqual(null,   firebird.get('fb_transaction'),  'fb_transaction');
          assert.notEqual(null,   firebird.get('fb_connection'),   'fb_connection');

          firebird.fbTransactionCommit(function() {

            assert.equal(null,    firebird.get('error'),           'error');
            assert.equal(null,    firebird.get('fb_transaction'),  'fb_transaction');
            assert.notEqual(null, firebird.get('fb_connection'),   'fb_connection');

            firebird.fbConnectionClose();

            assert.equal(null,    firebird.get('error'),           'error');
            assert.equal(null,    firebird.get('fb_transaction'),  'fb_transaction');
            assert.equal(null,    firebird.get('fb_connection'),   'fb_connection');

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
        assert.equal(null,      firebird.get('error'),            'error');
        assert.equal(null,      firebird.get('fb_transaction'),   'fb_transaction');
        assert.notEqual(null,   firebird.get('fb_connection'),    'fb_connection');

        firebird.fbTransactionStart(function() {      
          assert.equal(null,      firebird.get('error'),           'error');
          assert.notEqual(null,   firebird.get('fb_transaction'),  'fb_transaction');
          assert.notEqual(null,   firebird.get('fb_connection'),   'fb_connection');

          firebird.fbTransactionRollback(function() {

            assert.equal(null,    firebird.get('error'),           'error');
            assert.equal(null,    firebird.get('fb_transaction'),  'fb_transaction');
            assert.notEqual(null, firebird.get('fb_connection'),   'fb_connection');

            firebird.fbConnectionClose();

            assert.equal(null,    firebird.get('error'),           'error');
            assert.equal(null,    firebird.get('fb_transaction'),  'fb_transaction');
            assert.equal(null,    firebird.get('fb_connection'),   'fb_connection');

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
        assert.equal(null,      firebird.get('error'),            'error');
        assert.equal(null,      firebird.get('fb_transaction'),   'fb_transaction');
        assert.notEqual(null,   firebird.get('fb_connection'),    'fb_connection');

        firebird.fbTransactionStart(function() {      
          assert.equal(null,      firebird.get('error'),           'error');
          assert.notEqual(null,   firebird.get('fb_transaction'),  'fb_transaction');
          assert.notEqual(null,   firebird.get('fb_connection'),   'fb_connection');

          firebird.fbCheckError('Test error', function() {

            assert.equal('Test error',    firebird.get('error'),           'error');
            assert.equal(null,            firebird.get('fb_transaction'),  'fb_transaction');
            assert.equal(null,            firebird.get('fb_connection'),   'fb_connection');

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
        assert.equal(null,      firebird.get('error'),            'error');
        assert.equal(null,      firebird.get('fb_transaction'),   'fb_transaction');
        assert.notEqual(null,   firebird.get('fb_connection'),    'fb_connection');

        firebird.fbTransactionStart(function() {      
          assert.equal(null,      firebird.get('error'),           'error');
          assert.notEqual(null,   firebird.get('fb_transaction'),  'fb_transaction');
          assert.notEqual(null,   firebird.get('fb_connection'),   'fb_connection');

          firebird.fbCommitAndCloseConnection(function() {

            assert.equal(null,    firebird.get('error'),           'error');
            assert.equal(null,    firebird.get('fb_transaction'),  'fb_transaction');
            assert.equal(null,    firebird.get('fb_connection'),   'fb_connection');

            done();
          });
        });
      });

    });
  });


});
