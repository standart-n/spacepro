var Schema;

Schema = require('mongoose').Schema;

module.exports = new Schema({
  id: {
    type: Schema.Types.ObjectId
  },
  user_id: {
    type: String,
    index: true
  },
  view: {
    type: String,
    index: true
  },
  settings: [{
    id: {
      type: Schema.Types.ObjectId
    },
    index:           String,
    field:           String,
    caption:         String,    
    visible:         Boolean,
    readonly:        Boolean,
    disableeditor:   Boolean
  }],
  post_dt: {
    type: Date,
    "default": Date.now
  }
});
