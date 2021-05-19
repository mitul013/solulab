const request = require('supertest')
const app = require('../expressApp')
const User = require('../model/User')
test('calculate sun', () => {
    const total = 10 + 3
    expect(total).toBe(13);
})


beforeEach(async () => {
    await User.deleteMany({})
})



//Enter diff password so we should get error code 400
test('Should sign up for a user', async (done) => {
    const res = await request(app).post('/users/register')
        .send({
            name: "test01",
            email: "test@gmail.com",
            password: "mi013",
            password2: "mitul013",
            latitude: "23.5",
            longitude: "72.5"
        })
    expect(res.statusCode).toBe(400);
    done()
})

test('should give error for login for a unregistered user', async () => {
    const response = await request(app).post('/users/login').send({
        email: "test@gamil.com",
        password: "mitul0134567"
    })
    expect(response.statusCode).toBe(400);
})