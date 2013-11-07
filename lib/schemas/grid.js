var Schema;

Schema = require('mongoose').Schema;

module.exports = new Schema({
  user_id: {
    type: String,
    index: true
  },
  view: {
    type: Object
  },
  // views: [{
  //   name: {
  //     type: String
  //   },
  //   data: {
  //     type: String
  //   }
  // }],
  post_dt: {
    type: Date,
    "default": Date.now
  }
});
