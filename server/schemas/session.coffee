
Schema = require('mongoose').Schema

module.exports = new Schema 

	sid:		type: String, index: true
	sess:		type: Object
	post_dt:	type: Date, default: Date.now

