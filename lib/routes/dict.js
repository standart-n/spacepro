
var md5 =        require('MD5');
var Dict =       require(process.env.APP_DIR + '/lib/controllers/dict');

// var memwatch =   require('memwatch');
// var jsome =      require(process.env.APP_DIR + '/lib/controllers/jsome');

module.exports = function(app) {

  // app.get('/api/dict/:sid', function(req, res) {
  //   res.json({});
  // });

  app.get('/api/dict/:sid', function(req, res) {

    var dict = new Dict({
      sid:              req.params.sid             || '',
      query:            req.query.query            || '',
      limit:            req.query.limit            || null,
      folder_id:        req.query.folder_id        || 0,
      filter_id:        req.query.filter_id        || -1,
      keys:             req.query.keys             || {},
      vals:             req.query.vals             || {},
      user_id:          req.session.user.id        || '',
      session_id:       req.session.fbsession.id   || '',
      workstation_id:   req.session.workstation.id || ''
    });

    // var hash = md5(JSON.stringify({
    //   sid:              req.params.sid             || '',
    //   query:            req.query.query            || '',
    //   limit:            req.query.limit            || null,
    //   folder_id:        req.query.folder_id        || 0,
    //   filter_id:        req.query.filter_id        || -1,
    //   keys:             req.query.keys             || {},
    //   vals:             req.query.vals             || {},
    //   user_id:          req.session.user.id        || ''
    // }));
    // memcached.get(hash, function(err, result) {
    //   if (!result) {
        dict.initBySidFromCache(function() {
          dict.getData(function(err, data) {
            // if (!res.finished) {
              if (!err) {
                // memcached.set(hash, JSON.stringify(data), 1, function() {
                res.json(200, {
                  data:   data,
                  fields: dict.get('fields')
                });
                // });
              } else {
                res.json({
                  err: err
                });
              }
            // } else {

            //   console.log('/api/dict/:sid', req.params.sid, 'error');
            //   // console.log(_.keys(res));
            //   // console.log(res.statusCode, res._headers);
            // }
          });
        });
    //   } else {
    //     console.log('response from cache!');
    //     res.json(200, JSON.parse(result));
    //   }
    // });

  });

  app.post('/api/dict/:sid', function(req, res) {

    var dict = new Dict({
      sid:              req.params.sid,
      controls:         req.query.controls              || {},
      user_id:          req.session.user.id             || '',
      session_id:       req.session.fbsession.id        || '',
      workstation_id:   req.session.workstation.id      || ''
    });

    dict.initBySidFromCache(function() {
      dict.editLine(function(err) {
        if (!err) {
          res.json(200, {
            result: true
          });
        } else {
          res.json(200, {
            result: false,
            err:    err
          });
        }
      });
    });
  });

  app.put('/api/dict/:sid', function(req, res) {

    var dict = new Dict({
      sid:              req.params.sid,
      controls:         req.query.controls              || {},
      user_id:          req.session.user.id             || '',
      session_id:       req.session.fbsession.id        || '',
      workstation_id:   req.session.workstation.id      || ''
    });

    dict.initBySidFromCache(function() {
      dict.insertLine(function(err) {
        if (!err) {
          res.json(200, {
            result: true
          });
        } else {
          res.json(200, {
            result: false,
            err:    err
          });
        }
      });
    });
  });

  app.delete('/api/dict/:sid', function(req, res) {

    var dict = new Dict({
      sid:              req.params.sid,
      line:             req.query.line                  || {},
      keys:             req.query.keys                  || {},
      vals:             req.query.vals                  || {},
      user_id:          req.session.user.id             || '',
      session_id:       req.session.fbsession.id        || '',
      workstation_id:   req.session.workstation.id      || ''
    });

    dict.initBySidFromCache(function() {
      dict.deleteLine(function(err) {
        if (!err) {
          res.json(200, {
            result: true
          });
        } else {
          res.json(200, {
            result: false
          });
        }
      });
    });
  });

};