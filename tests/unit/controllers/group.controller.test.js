const groupController = require('../../../src/controllers/group.controller')
const { User, Photo, Group } = require('../../../src/models')
const config = require('config')
const mongoose = require('mongoose')
describe('Groups Controller create group', () => {
    let req
    let next
    let res
    beforeEach(async () => {
        await mongoose.connect(config.get('db'), {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
        })
        await mongoose.connection.dropDatabase()
        req = { headers: {}, params: {}, body: {} }
        res = {
            locals: {
                userid: '608834536de13632903701b7',
            },
            response: null,
            statusCode: 0,
            status: function (code) {
                this.statusCode = code
                return this
            },
            json: function (data) {
                this.response = data
            },
        }
        group = new Group({
            name: 'test_group',
            description: 'test',
            privacy: 'public',
            visibility: 'public',
        })
        await group.save()
    })
    describe('Create a new group with no group name', () => {
        it('Should Fail when no group name is set', async () => {
            await groupController.create_group(req, res)
            expect(res.statusCode).toBe(422)
            expect(res.response.message).toBe('Missing group name parameter')
        })
    })
    describe('Create a new group which already exists', () => {
        it('Should Fail when group name is already used', async () => {
            req.body.group_name = 'test_group'
            await groupController.create_group(req, res)
            expect(res.statusCode).toBe(500)
        })
    })
    describe('Create a new group successfully', () => {
        it('Should create a new group successfully', async () => {
            req.body.group_name = 'test_group_edited'
            await groupController.create_group(req, res)
            expect(res.statusCode).toBe(200)
        })
    })
})
