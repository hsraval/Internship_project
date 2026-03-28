const express = require('express')
const router = express.Router()

const {
    getUsers,
    singleUser,
    editUser,
    deleteUser,
    restoreUser
} = require('../controllers/user.controller')

const authorizeRoles = require('../middleware/role.middleware');
const protect = require('../middleware/auth.middleware')

router.get('/',protect,authorizeRoles('admin'),getUsers)
router.get('/:id',protect,authorizeRoles('admin'),singleUser)
router.patch('/:id',protect,authorizeRoles('admin'),editUser)
router.patch('/:id/restore',protect,authorizeRoles('admin'),restoreUser)
router.delete('/:id',protect,deleteUser)

module.exports = router