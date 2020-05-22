const db = require('../database/dbConfig')

async function createUser(user) {
	await db('users').insert(user)
	const getUser = await db('users').select('users.id', 'users.username').where({ username: user.username })
	return getUser
}

function findBy(filter) {
	return db('users').where(filter).first()
}

function loginUser(username) {
	return db('users').where({ username })
}

module.exports = {
	createUser,
	loginUser,
	findBy
}