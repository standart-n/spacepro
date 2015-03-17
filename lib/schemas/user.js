
var Schema = require('mongoose').Schema;

module.exports = new Schema({
  id: {
    type: Schema.Types.ObjectId
  },
  user_id: {
    type:      String,
    index:     true
  },
  username: {
    type:      String,
    trim:      true,
    index:     true
  },
  userlogin: {
    type:      String,    
    trim:      true,
    index:     true,
    lowercase: true
  },
  userpsw: {
    type:      String,
    trim:      true,
    index:     true
  },
  status: {
    type:      Number,
    index:     true
  },
  privileges: [{
    sid: {
      type:    String,
      index:   true
    },
    rules: {
      S: {
        type:      Boolean,
        'default': false
      },
      I: {
        type:      Boolean,
        'default': false
      },
      D: {
        type:      Boolean,
        'default': false
      },
      F: {
        type:      Boolean,
        'default': false
      },
      U: [{
        type: String
      }]
    }
  }],
  groups: [{
    id: {
      type:    Number,
      index:   true
    },
    group_id: {
      type:    String,
      index:   true
    },
    parent_id: {
      type:    String,
      index:   true
    },
    sid: {
      type:    String,
      trim:    true,
      index:   true
    },
    caption: {
      type:    String,
      trim:    true,
      index:   true
    },
    color: {
      type:    String,
      index:   true
    },
    status: {
      type:    Number,
      index:   true
    }
  }],
  post_dt: {
    type:      Date,
    "default": Date.now
  }
});
