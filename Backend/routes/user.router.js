const express = require('express')
const router = express.Router()

const {
    getUsers,
    singleUser,
    editUser,
    deleteUser
} = require('../controllers/user.controller')

router.get('/',getUsers)
router.get('/:id',singleUser)
router.patch('/:id',editUser)
router.delete('/:id',deleteUser)

module.exports = router