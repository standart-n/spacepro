var Dict, _, async, Memcached, md5;

_ =          require('lodash');
async =      require('async');
md5 =        require('MD5');

Dict = require(process.env.APP_DIR + '/lib/controllers/dict');

module.exports = function(app) {
  
  app.get('/api/dict/:sid', function(req, res) {
    var dict, memcached, hash, data;

    memcached = global.memcached;

    dict = new Dict({
      sid:              req.params.sid,
      query:            req.query.query            || '',
      limit:            req.query.limit            || null,
      keys:             req.query.keys             || {},
      vals:             req.query.vals             || {},
      user_id:          req.session.user.id        || '',
      session_id:       req.session.fbsession.id   || '',
      workstation_id:   req.session.fbsession.id   || ''
    });

    hash = md5(JSON.stringify(dict.toJSON()));

    memcached.get(hash, function(err, result) {
      if (!result) {
        dict.initBySidFromCache(function() {
          dict.getData(function() {
            dict.fbTransactionCommit(function() {
              data = dict.get('data');
              memcached.set(hash, JSON.stringify(data), 5, function() {
                res.json(200, data);
              });
            });
          });
        });
      } else {
        res.json(200, JSON.parse(result));
      }
    });

  });


  app.delete('/api/dict/:sid', function(req, res) {
    var dict;

    dict = new Dict({
      sid:              req.params.sid,
      line:             req.query.line                  || {},
      keys:             req.query.keys                  || {},
      vals:             req.query.vals                  || {},
      user_id:          req.session.user.id             || '',
      session_id:       req.session.fbsession.id        || '',
      workstation_id:   req.session.workstation.id      || ''
    });

    dict.initBySidFromCache(function() {
      dict.deleteLine(function() {
        res.json(200, {result: true});
      });
    });

  });

};