
var _     =   require('lodash');
var Dict =    require(process.env.APP_DIR + '/lib/controllers/dict');
var Bar =     require(process.env.APP_DIR + '/lib/controllers/bar');
var Globals = require(process.env.APP_DIR + '/lib/views/globals');

var Index = Globals.extend({

  initialize: function() {
    this.globals();
    this.addLocalCssFile('index');
    this.addLocalJsLmdFile('app');

    this.addLocaleString([
      'Information not found',
      'Error on server',
      'Line data edit',
      'Line data remove'
    ]);
  },

  view: function(fn) {
    var _this = this;
    
    if (fn == null) {
      fn = function() {};
    }

    var req = this.get('req');

    var bar = new Bar({
      user_id:    req.session.user.id,
      requireSid: req.params.sid || ''
    });
  
    bar.getDictsFromCache(function() {

      _this.set('webDicts', {
        dicts:       bar.get('dicts')  || [],
        active:      bar.get('active') || ''
      });

      bar.renderActiveDict(function(err, dict) {

        if (!err) {      

          dict.exportInfo(function(data) {
            _this.set('wdicts_data', data);
            fn();
          });

        } else {

          console.log('Index:', err);
          fn(err);
        }

      });
    });  
  }
});

exports = module.exports = Index;
