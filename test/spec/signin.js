
var Signin, assert, fb_test_data, user_test_data, user_id, session_id, workstation_id;

process.env.APP_DIR = '../..';

fb_test_data =    require(process.env.APP_DIR + '/test/conf/fb.json');
user_test_data =  require(process.env.APP_DIR + '/test/conf/user.json');

process.env.FIREBIRD_HOST =         fb_test_data.host;
process.env.FIREBIRD_PATH =         fb_test_data.path;
process.env.FIREBIRD_USER =         fb_test_data.user;
process.env.FIREBIRD_PASSWORD =     fb_test_data.password;

assert = require('chai').assert;

Signin = require(process.env.APP_DIR + '/lib/controllers/signin');

describe('Signin:', function() {

  describe('Signin whithout login and password:', function() {
    it('Should return "Please enter your login"', function(done) {
      var signin;

      signin = new Signin({
        login:       '',
        password:    '',
        hide_errors: true
      });

      signin.check(function() {
        assert.equal('Please enter your login', signin.get('error'));
        assert.equal('error', signin.get('result'),         'result');
        assert.equal(null,    signin.get('id'),             'id');
        assert.equal(null,    signin.get('name'),           'name');
        assert.equal(null,    signin.get('fb_connection'),  'fb_connection');
        assert.equal(null,    signin.get('fb_transaction'), 'fb_transaction');
        done();
      });

    });
  });

  describe('Signin whithout password:', function() {
    it('Should return "Please enter your password"', function(done) {
      var signin;

      signin = new Signin({
        login:       'username',
        password:    '',
        hide_errors: true
      });

      signin.check(function() {
        assert.equal('Please enter your password', signin.get('error'));
        assert.equal('error', signin.get('result'),         'result');
        assert.equal(null,    signin.get('id'),             'id');
        assert.equal(null,    signin.get('name'),           'name');
        assert.equal(null,    signin.get('fb_connection'),  'fb_connection');
        assert.equal(null,    signin.get('fb_transaction'), 'fb_transaction');
        done();
      });

    });
  });

  describe('Signin whith wrong login:', function() {
    it('Should return "User not found"', function(done) {
      var signin;

      signin = new Signin({
        login:       'username',
        password:    'password',
        hide_errors: true
      });

      signin.check(function() {
        assert.equal('User not found', signin.get('error'));
        assert.equal('error', signin.get('result'),         'result');
        assert.equal(null,    signin.get('id'),             'id');
        assert.equal(null,    signin.get('name'),           'name');
        assert.equal(null,    signin.get('fb_connection'),  'fb_connection');
        assert.equal(null,    signin.get('fb_transaction'), 'fb_transaction');
        done();
      });

    });
  });

  describe('Signin whith wrong password:', function() {
    it('Should return "Incorrect login or password"', function(done) {
      var signin;

      signin = new Signin({
        login:       user_test_data.worker.login,
        password:    'password',
        hide_errors: true
      });

      signin.check(function() {
        assert.equal('Incorrect login or password', signin.get('error'));
        assert.equal('error', signin.get('result'),         'result');
        assert.notEqual(null, signin.get('id'),             'id');
        assert.notEqual(null, signin.get('name'),           'name');
        assert.equal(null,    signin.get('fb_connection'),  'fb_connection');
        assert.equal(null,    signin.get('fb_transaction'), 'fb_transaction');
        done();
      });

    });
  });

  describe('Signin whith permission denied:', function() {
    it('Should return "You are not allowed to login"', function(done) {
      var signin;
  
      signin = new Signin({
        login: user_test_data.worker.login,
        password: user_test_data.worker.password,
        web_group_id: '-9999',
        hide_errors: true
      });
  
      signin.check(function() {
        assert.equal('You are not allowed to login', signin.get('error'));
        assert.equal('error', signin.get('result'),         'result');
        assert.notEqual(null, signin.get('id'),             'id');
        assert.notEqual(null, signin.get('name'),           'name');
        assert.equal(null,    signin.get('fb_connection'),  'fb_connection');
        assert.equal(null,    signin.get('fb_transaction'), 'fb_transaction');
        done();
      });
  
    });
  });

  describe('Authorization successful:', function() {
    it('Should login or force login', function(done) {
      var signin;

      signin = new Signin({
        login:       user_test_data.worker.login,
        password:    user_test_data.worker.password,
        hide_errors: true
      });

      signin.check(function() {
        
        assert.notEqual(null,     signin.get('session_success'), 'session_success');
        assert.equal(null,        signin.get('fb_connection'),   'fb_connection');
        assert.equal(null,        signin.get('fb_transaction'),  'fb_transaction');
        assert.notEqual(null,     signin.get('id'),              'id');
        assert.notEqual(null,     signin.get('name'),            'name');
        assert.equal(null,        signin.get('error'),           'error');
        assert.equal('success',   signin.get('result'),          'result');

        if (signin.get('session_success') === 1) {

          user_id =           signin.get('id');
          session_id =        signin.get('session_id');
          workstation_id =    signin.get('workstation_id');

          assert.equal(true,    signin.get('session_open'),     'session_open');
          assert.notEqual(null, signin.get('session_id'),       'session_id');
          assert.notEqual(null, signin.get('workstation_id'),   'workstation_id');
          assert.equal(null,    signin.get('workstation_name'), 'workstation_name');
          assert.equal(null,    signin.get('session_startdt'),  'session_startdt');

          done();

        } else {

          assert.equal(0,       signin.get('session_success'),  'session_success');
          assert.equal(false,   signin.get('session_open'),     'session_open');
          assert.notEqual(null, signin.get('session_id'),       'session_id');
          assert.notEqual(null, signin.get('workstation_id'),   'workstation_id');
          assert.notEqual(null, signin.get('workstation_name'), 'workstation_name');
          assert.notEqual(null, signin.get('session_startdt'),  'session_startdt');

          signin.set('force', 1);
          
          signin.check(function() {

            user_id =           signin.get('id');
            session_id =        signin.get('session_id');
            workstation_id =    signin.get('workstation_id');

            assert.equal(1,       signin.get('force'),            'force');
            assert.equal(true,    signin.get('session_open'),     'session_open');
            assert.notEqual(null, signin.get('session_id'),       'session_id');
            assert.notEqual(null, signin.get('workstation_id'),   'workstation_id');
            assert.equal(null,    signin.get('workstation_name'), 'workstation_name');
            assert.equal(null,    signin.get('session_startdt'),  'session_startdt');

            done();

          });

        }

      });
    });
  });


  describe('Logout:', function() {
    it('Should find and close session', function(done) {
      var signin;

      signin = new Signin({
        id:          user_id,
        hide_errors: true
      });

      signin.logout(function() {

        assert.equal(null,                signin.get('fb_connection'),    'fb_connection');
        assert.equal(null,                signin.get('fb_transaction'),   'fb_transaction');
        assert.notEqual(null,             signin.get('id'),               'id');
        assert.equal(null,                signin.get('name'),             'name');
        assert.equal(null,                signin.get('error'),            'error');
        assert.equal('success',           signin.get('result'),           'result');

        assert.equal(false,               signin.get('session_open'),     'session_open');
        assert.deepEqual(session_id,      signin.get('session_id'),       'session_id');
        assert.notEqual(null,             signin.get('session_startdt'),  'session_startdt');
        assert.deepEqual(user_id,         signin.get('id'),               'user_id');
        assert.deepEqual(workstation_id,  signin.get('workstation_id'),   'workstation_id');

        done();
      });

    });
  });


});
