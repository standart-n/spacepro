var Dict, _, async;

_ =     require('lodash');
async = require('async');

Dict = require(process.env.APP_DIR + '/lib/controllers/dict');

module.exports = function(app) {
  
  app.get('/api/dict/:sid', function(req, res) {
    var model, body, dict;

    dict = new Dict({
      sid:   req.params.sid,
      query: req.query.query || '',
      limit: req.query.limit || null      
    });

    dict.initBySid(function() {
      dict.getData(function() {
        res.json(dict.toJSON().data);
      });
    });

  });

};



