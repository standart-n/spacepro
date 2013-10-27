
module.exports = 

	firstname:			
		type: 'string'
		required: true
		minLen: 2
		maxLen: 20
		message: 'Неверно заполнено поле Имя'
		custom: (s) ->
			s.match(/^([\D]+)$/gi)

	lastname:
		type: 'string'
		required: true
		minLen: 2
		maxLen: 20
		message: 'Неверно заполнено поле Фамилия'
		custom: (s) ->
			s.match(/^([\D]+)$/gi)

	email:
		type: 'email'
		required: true
		message: 'Неверно заполнено поле Email'

	company:			
		type: 'string'
		required: true
		minLen: 3
		maxLen: 20
		message: 'Неверно заполнено поле Компания'



	region:

		caption:
			type: 'string'
			required: true
			minLen: 3
			maxLen: 100
			message: 'Неопределен регион пользователя'

		name:
			type: 'string'
			required: true
			minLen: 3
			maxLen: 100
			message: 'Неопределен регион пользователя'
			custom: (s) ->
				s.match(/^([a-z]+)$/gi)
