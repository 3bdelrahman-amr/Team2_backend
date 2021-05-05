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
            _id: '608834536de13632903701b7',
            name: 'test_group',
            description: 'test',
            privacy: 'public',
            visibility: 'public',
        })
        privateGroup = new Group({
            _id: '608834536de13632903701b6',
            name: 'test_group',
            description: 'test',
            privacy: 'private',
            visibility: 'invite',
        })
        await group.save()
        await privateGroup.save()
    })
    describe('Get a group with invalid id', () => {
        it('Should Fail when invalid id used', async () => {
            req.params.group_id = '10'
            await groupController.get_group(req, res)
            expect(res.statusCode).toBe(500)
            expect(res.response.message).toBe('Invalid group ID')
        })
    })
    describe('Get a group with no id', () => {
        it('Should Fail when no group ID specified', async () => {
            await groupController.create_group(req, res)
            expect(res.statusCode).toBe(422)
        })
    })
    describe('Get a group successfully', () => {
        it('Should successfully fetch a group', async () => {
            req.params.group_id = '608834536de13632903701b7'
            await groupController.get_group(req, res)
            expect(res.statusCode).toBe(200)
        })
    })
    describe('Get a group with incorrect id', () => {
        it('Should fail as id doesnt exist', async () => {
            req.params.group_id = '608834536de13632903701b3'
            await groupController.get_group(req, res)
            expect(res.statusCode).toBe(404)
        })
    })
    describe('Get a group which is private', () => {
        it('Should fail as group is private and user is not a member', async () => {
            req.params.group_id = '608834536de13632903701b6'
            await groupController.get_group(req, res)
            expect(res.statusCode).toBe(404)
        })
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
