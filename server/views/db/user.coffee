
Schema = 				require('mongoose').Schema

module.exports = 		new Schema 

	id:					type: Schema.Types.ObjectId	
	firstname:			type: String, trim: true, index: true	
	lastname:			type: String, trim: true, index: true	
	email:				type: String, lowercase: true, trim: true, index: true	
	company:			type: String, trim: true, index: true	
	key:				type: String, index: true

	disabled:			type: Boolean, default: false
	token:				type: String, index: true	
	sessid:				type: String, index: true
	reg_dt:				type: Date, default: Date.now
	post_dt:			type: Date, default: Date.now

