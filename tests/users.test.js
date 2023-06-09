const request = require('supertest')
const mongoose = require('mongoose')
const { MongoMemoryServer} = require('mongodb-memory-server')
const app = require('../app')
const server = app.listen(8080, () => console.log('Testing on Port 8080'))
const User = require('../models/user')
let mongoServer

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    await mongoose.connect(mongoServer.getUri())
})

afterAll(async () => {
    await mongoose.connection.close() //programmatic ctrl+c
    mongoServer.stop()//getting rid of our MongoDB instance itself
    server.close()//
})

describe('Test the user endpoints', () => {
    test('It should create a new user', async ()=> {
        const response = await request(app)
            .post('/users')
            .send({name: 'John Doe', email: 'john.doe@example.com', password: 'password1' })

        expect(response.statusCode).toBe(200)
        expect(response.body.user.name).toEqual('John Doe')
        expect(response.body.user.email).toEqual('john.doe@example.com')
        expect(response.body).toHaveProperty('token')
    })

    test('It should login a user', async () => {
        const user = new User({ name: 'John Doe', email: 'john.doe@example.com', password: 'password1', loggedIn: false })
        await user.save()
        const token = await user.generateAuthToken()

        const response = await request(app)
            .post('/users/login')
            .set("Authorization", `Bearer ${token}`)
            .send({ email: 'john.doe@example.com', password: 'password1' })

        expect(response.statusCode).toBe(200)
        expect(response.body.user.name).toEqual('John Doe')
        expect(response.body.user.email).toEqual('john.doe@example.com')
        expect(response.body.user.loggedIn).toBe(true)
        expect(response.body).toHaveProperty('token')
            
    })

    test('It should update a user', async () => {
        const user = new User({ name: 'John Doe', email: 'john.doe@example.com', password: 'password123' })
        await user.save()
        const token = await user.generateAuthToken()

        const response = await request(app)
            .put(`/users/${user._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Jane Doe', email: 'jane.doe@example.com' })

        expect(response.statusCode).toBe(200)
        expect(response.body.name).toEqual('Jane Doe')
        expect(response.body.email).toEqual('jane.doe@example.com')
    })

    test('It should delete a user', async () => {
        const user = new User({ name: 'John Doe', email: 'john.doe@example.com', password: 'password123' })
        await user.save()
        const token = await user.generateAuthToken()

        const response = await request(app)
            .delete(`/users/${user._id}`)
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.statusCode).toBe(200)
        expect(response.body.message).toEqual('User deleted')
    })

    test('It should show all users', async () => {
        const users = await User.find()
        const loggedInUsers = users.map((user) => {
            return {
                _id: user._id,
                name: user.name,
                email: user.email,
                password: user.password,
                loggedIn: user.loggedIn,
            }
        })

        const response = await request(app)
            .get('/users')

        expect(response.statusCode).toBe(200)
        expect(response.body.loggedInUsers).toEqual(loggedInUsers[users])
    })
})