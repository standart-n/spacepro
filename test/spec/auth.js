
var Auth, assert, fb_test_data, user_test_data, user_id, session_id, workstation_id;

process.env.APP_DIR = '../..';

fb_test_data =    require(process.env.APP_DIR + '/test/conf/fb.json');
user_test_data =  require(process.env.APP_DIR + '/test/conf/user.json');

process.env.FIREBIRD_HOST =         fb_test_data.host;
process.env.FIREBIRD_PATH =         fb_test_data.path;
process.env.FIREBIRD_USER =         fb_test_data.user;
process.env.FIREBIRD_PASSWORD =     fb_test_data.password;

assert = require('chai').assert;

Auth = require(process.env.APP_DIR + '/lib/controllers/auth');

describe('Auth:', function() {

  describe('Signin whithout login and password:', function() {
    it('Should return "Please enter your login"', function(done) {
      var auth;

      auth = new Auth({
        user_login:       '',
        user_password:    '',
        hide_errors:      true
      });

      auth.login(function() {
        assert.equal('Please enter your login', auth.get('error'));
        assert.equal('error', auth.get('result'),         'result');
        assert.equal(null,    auth.get('user_id'),        'user_id');
        assert.equal(null,    auth.get('user_name'),      'user_name');
        assert.equal(null,    auth.get('fb_transaction'), 'fb_transaction');
        assert.equal(true,    auth.fbIsConnectionClose(), 'fb_connection');

        done();
      });

    });
  });

  describe('Signin whithout password:', function() {
    it('Should return "Please enter your password"', function(done) {
      var auth;

      auth = new Auth({
        user_login:       'username',
        user_password:    '',
        hide_errors:      true
      });

      auth.login(function() {
        assert.equal('Please enter your password', auth.get('error'));
        assert.equal('error', auth.get('result'),         'result');
        assert.equal(null,    auth.get('user_id'),        'user_id');
        assert.equal(null,    auth.get('user_name'),      'user_name');
        assert.equal(null,    auth.get('fb_transaction'), 'fb_transaction');
        assert.equal(true,    auth.fbIsConnectionClose(), 'fb_connection');

        done();
      });

    });
  });

  describe('Signin whith wrong login:', function() {
    it('Should return "User not found"', function(done) {
      var auth;

      auth = new Auth({
        user_login:       'username',
        user_password:    'password',
        hide_errors:      true
      });

      auth.login(function() {
        assert.equal('User not found', auth.get('error'));
        assert.equal('error', auth.get('result'),         'result');
        assert.equal(null,    auth.get('user_id'),        'user_id');
        assert.equal(null,    auth.get('name'),           'user_name');
        assert.equal(null,    auth.get('fb_transaction'), 'fb_transaction');

        auth.fbConnectionClose();

        done();
      });

    });
  });

  describe('Signin whith wrong password:', function() {
    it('Should return "Incorrect login or password"', function(done) {
      var auth;

      auth = new Auth({
        user_login:       user_test_data.worker.login,
        user_password:    'password',
        hide_errors:      true
      });

      auth.login(function() {
        assert.equal('Incorrect login or password', auth.get('error'));
        assert.equal('error', auth.get('result'),         'result');
        assert.notEqual(null, auth.get('user_id'),        'user_id');
        assert.notEqual(null, auth.get('user_name'),      'user_name');
        assert.equal(null,    auth.get('fb_transaction'), 'fb_transaction');

        auth.fbConnectionClose();

        done();
      });

    });
  });

  describe('Signin whith permission denied:', function() {
    it('Should return "You are not allowed to login"', function(done) {
      var auth;
  
      auth = new Auth({
        user_login:      user_test_data.worker.login,
        user_password:   user_test_data.worker.password,
        web_group_id:    '-9999',
        hide_errors:     true
      });
  
      auth.login(function() {
        assert.equal('You are not allowed to login', auth.get('error'));
        assert.equal('error', auth.get('result'),         'result');
        assert.notEqual(null, auth.get('user_id'),        'user_id');
        assert.notEqual(null, auth.get('user_name'),      'user_name');
        assert.equal(null,    auth.get('fb_transaction'), 'fb_transaction');

        auth.fbConnectionClose();

        done();
      });
  
    });
  });

  describe('Authorization successful:', function() {
    it('Should login or force login', function(done) {
      var auth;

      auth = new Auth({
        user_login:       user_test_data.worker.login,
        user_password:    user_test_data.worker.password,
        hide_errors:      true
      });

      auth.login(function() {
        
        assert.notEqual(null,     auth.get('session_success'), 'session_success');
        assert.equal(null,        auth.get('fb_transaction'),  'fb_transaction');
        assert.notEqual(null,     auth.get('user_id'),         'user_id');
        assert.notEqual(null,     auth.get('user_name'),       'user_name');
        assert.equal(null,        auth.get('error'),           'error');
        assert.equal('success',   auth.get('result'),          'result');

        if (auth.get('session_success') === 1) {

          user_id =           auth.get('user_id');
          session_id =        auth.get('session_id');
          workstation_id =    auth.get('workstation_id');

          assert.equal(true,    auth.get('session_open'),     'session_open');
          assert.notEqual(null, auth.get('session_id'),       'session_id');
          assert.notEqual(null, auth.get('workstation_id'),   'workstation_id');
          assert.equal(null,    auth.get('workstation_name'), 'workstation_name');
          assert.equal(null,    auth.get('session_startdt'),  'session_startdt');

          done();

        } else {

          assert.equal(0,       auth.get('session_success'),  'session_success');
          assert.equal(false,   auth.get('session_open'),     'session_open');
          assert.notEqual(null, auth.get('session_id'),       'session_id');
          assert.notEqual(null, auth.get('workstation_id'),   'workstation_id');
          assert.notEqual(null, auth.get('workstation_name'), 'workstation_name');
          assert.notEqual(null, auth.get('session_startdt'),  'session_startdt');

          auth.set('force', 1);
          
          auth.login(function() {

            user_id =           auth.get('user_id');
            session_id =        auth.get('session_id');
            workstation_id =    auth.get('workstation_id');

            assert.equal(1,       auth.get('force'),            'force');
            assert.equal(true,    auth.get('session_open'),     'session_open');
            assert.notEqual(null, auth.get('session_id'),       'session_id');
            assert.notEqual(null, auth.get('workstation_id'),   'workstation_id');
            assert.equal(null,    auth.get('workstation_name'), 'workstation_name');
            assert.equal(null,    auth.get('session_startdt'),  'session_startdt');

            auth.fbConnectionClose();

            done();

          });

        }

      });
    });
  });


  describe('Logout:', function() {
    it('Should find and close session', function(done) {
      var auth;

      auth = new Auth({
        user_id:      user_id,
        hide_errors:  true
      });

      auth.logout(function() {

        assert.equal(false,               auth.get('session_open'),     'session_open');
        assert.deepEqual(session_id,      auth.get('session_id'),       'session_id');
        assert.notEqual(null,             auth.get('session_startdt'),  'session_startdt');
        assert.deepEqual(user_id,         auth.get('user_id'),          'user_id');
        assert.deepEqual(workstation_id,  auth.get('workstation_id'),   'workstation_id');

        assert.notEqual(null,             auth.get('user_id'),          'user_id');
        assert.equal(null,                auth.get('user_name'),        'name');
        assert.equal(null,                auth.get('error'),            'error');
        assert.equal('success',           auth.get('result'),           'result');
        assert.equal(null,                auth.get('fb_transaction'),   'fb_transaction');

        auth.fbConnectionClose();

        done();
      });

    });
  });


});
