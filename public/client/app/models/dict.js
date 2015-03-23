var _, Backbone, Dict;

_        = require('underscore');
Backbone = require('backbone');

Dict = Backbone.Model.extend({

  idAttribute: "d$uuid",

  initialize: function() {
    return {
      sid:                     '',
      type:                    'parent',
      caption:                 '',
      showcaption:             '',
      timeout:                 10000,
      limit:                   50,
      step:                    20,
      query:                   '',
      selectRowUUID:           '',
      returnfieldname:         'd$uuid',
      captionfieldname:        'd$uuid',
      keyfieldname:            'd$uuid',
      addfields:               {},
      editfields:              {},
      keys:                    {},
      vals:                    {},
      columns:                 {},
      childs:                  {},
      childsInfo:              {},
      filter_id:               null,
      filters:                 [],
      folder_id:               null,
      folders:                 [],
      foldergroup:             '',
      initfolder_id:           null,
      folders_visible:         0,
      renderItemSearch:        null,
      renderOptionSearch:      null,
      cfselect: {
        selectfieldexpression: '',
        allwayspartial:        true
      },
      privileges: {
        I: false,
        S: false,
        U: [],
        D: false,
        F: false
      }
    };
  }    

});

Dict.prototype.setValsToLowerCase = function(ms) {
  var tmp = {};
  _.each(ms || {}, function(value, key) {
    tmp[key] = value.toLowerCase();
  });
  return tmp;
};

Dict.prototype.setKeysToLowerCase = function(ms) {
  var tmp = {};
  _.each(ms || {}, function(value, key) {
    tmp[key.toLowerCase()] = value;
  });
  return tmp;
};

Dict.prototype.cleanVals = function(new_vals) {
  var keys, vals, 
    tmp = {};

  keys = this.get('keys') || {};
  vals = this.get('vals') || {};

  if ((new_vals != null) && (typeof new_vals === 'object')) {
    vals = _.extend({}, vals, new_vals);
  }

  keys =  this.setValsToLowerCase(keys);
  vals =  this.setKeysToLowerCase(vals);

  _.each(keys, function(value, key) {
    if (vals[value] != null) {
      if (typeof vals[value] === 'string') {
        tmp[value] = vals[value].trim();
      } else {
        tmp[value] = vals[value];
      }
    }
  });

  this.set('vals', tmp);

  return tmp;
};

module.exports = Dict;
