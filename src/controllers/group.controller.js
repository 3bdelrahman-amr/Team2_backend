const mongoose = require('mongoose')
const { Group } = require('../models/groups.model')

exports.create_group = async function (req, res) {
    const userId = res.locals.userid
    const groupName = req.body.group_name
    const group = await Group.findOne({ name: groupName }).exec()
    if (!groupName) {
        res.status(422).json({ message: 'Missing group name parameter' })
    } else if (group) {
        res.status(500).json({ message: 'Group already exists' })
    } else {
        await Group.create({
            name: groupName,
            Members: { ref: userId, role: 'admin' },
        })
        res.status(200).json({
            message: 'Group created successfully',
        })
    }
}
