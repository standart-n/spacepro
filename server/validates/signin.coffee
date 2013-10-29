
module.exports = 

	login:
		type: 'string'
		required: true
		minLen: 2
		maxLen: 20
		message: 'Неверно заполнено поле Логин'


	password:
		type: 'string'
		required: true
		minLen: 2
		maxLen: 20
		message: 'Неверно заполнено поле Пароль'

