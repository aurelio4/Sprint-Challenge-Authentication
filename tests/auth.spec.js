const supertest = require('supertest')
const server = require('../api/server')
const db = require('../database/dbConfig')

afterEach(async () => {
	await db('users').truncate()
})

describe('registering user', () => {
	it('should return 200 when registering', () => {
		return (
			supertest(server)
				.post('/api/auth/register')
				.send({
					username: "testing1",
					password: "test"
				})
				.expect(201)
		)
	})
})

describe('logging user in', () => {
	it('should log user in', () => {
		const userData = {
			username: "testing1",
			password: "test"
		}

		return supertest(server).post('/api/auth/register')
			.send(userData)
			.expect(201)
			.then(res => {
				return supertest(server).post('/api/auth/login')
					.send(userData)
					.expect(200)
					.then(resp => {
						const token = resp.body.token
						expect(token).toBeTruthy()
						return supertest(server).get('/api/jokes')
							.set('authorization', token)
							.expect(200)
							.then(jokes => {
								expect(jokes.body.length).toBeTruthy()
							})
					})
			})
	})
})