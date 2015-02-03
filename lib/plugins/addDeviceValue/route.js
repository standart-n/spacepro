
var AddDeviceValue;

AddDeviceValue = require(process.env.APP_DIR + '/lib/plugins/addDeviceValue/addDeviceValue');

module.exports = function(app) {
  
  app.post('/api/addDeviceValue', function(req, res) {
    var addDeviceValue;

    addDeviceValue = new AddDeviceValue({
      uuid:       req.body.uuid   || '',
      value:      req.body.value  || 0,
      session_id: req.session.fbsession.id
    });

    addDeviceValue.insertValue(function() {
      res.json(addDeviceValue.get('result'));
    });

  });

};



