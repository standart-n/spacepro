var Schema;

Schema = require('mongoose').Schema;

module.exports = new Schema({
  id: {
    type: Schema.Types.ObjectId
  },
  user_id: {
    type:  String,
    index: true
  },
  username: {
    type: String,
    trim: true,
    index: true
  },
  userlogin: {
    type: String,
    trim: true,
    index: true
  },
  userpsw: {
    type: String,
    trim: true,
    index: true
  },
  status: {
    type: Number,
    index: true
  },
  groups: [{
    id: {
      type: Number,
      index: true
    },
    group_id: {
      type: String,
      index: true
    },
    parent_id: {
      type: String,
      index: true
    },
    sid: {
      type: String,
      trim: true,
      index: true
    },
    caption: {
      type: String,
      trim: true,
      index: true
    },
    color: {
      type: String,
      index: true
    },
    status: {
      type: Number,
      index: true
    }
  }],
  post_dt: {
    type: Date,
    "default": Date.now
  }
});
