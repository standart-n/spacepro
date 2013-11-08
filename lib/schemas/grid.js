var Schema;

Schema = require('mongoose').Schema;

module.exports = new Schema({
  user_id: {
    type: String,
    index: true
  },
  view: {
    type: String,
    index: true
  },
  settings: {
    type: Object
  },
  post_dt: {
    type: Date,
    "default": Date.now
  }
});
