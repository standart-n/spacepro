
var _     =      require('lodash');
var debug =      require('debug')('index');

var Dict =       require(process.env.APP_DIR + '/lib/controllers/dict');
var Bar =        require(process.env.APP_DIR + '/lib/controllers/bar');
var Globals =    require(process.env.APP_DIR + '/lib/views/globals');
var jsome =      require(process.env.APP_DIR + '/lib/controllers/jsome');

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

    var user_id =    this.get('user_id');
    var requireSid = this.get('requireSid') || '';

    var bar = new Bar({
      user_id:    user_id,
      requireSid: requireSid
    });

    debug('view'.magenta, user_id.blue, requireSid.yellow);
  
    bar.getDictsFromCache(function(err, res) {
  
      if (!err) {

        debug('dicts'.magenta, user_id.blue, res.active.yellow);
        debug(jsome(_.pluck(res.dicts, 'sid')));

        _this.set('webDicts', {
          dicts:       res.dicts  || [],
          active:      res.active || ''
        });

        bar.renderActiveDict(res, function(err, data) {
          if (!err) {
            debug('render'.magenta, jsome(_.keys(data)));
            _this.set('wdicts_data', data);
            fn();
          } else {
            debug('render'.red, err);
            fn(err);
          }
        });
      } else {
        fn(err);
      }
    });  
  }
});

exports = module.exports = Index;
