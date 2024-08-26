const userControllers = require('../controllers/userControllers')
const authController = require('../controllers/authControllers')
const express = require('express')
const router = express.Router()

router.route('/signup').post(authController.signup)
router.route('/login').post(authController.login)
router.get('/logout', authController.logout)
router.get('/verify-email', authController.verifyEmail)
router.post('/forgot-password', authController.forgotPassword)
router.patch('/reset-password', authController.resetPassword)
router.patch(
  '/update-password',
  authController.protect,
  authController.updatePassword
)

router.route('/').get(authController.protect, userControllers.getAllUsers)

router
  .route('/:id')
  .get(authController.protect, userControllers.getUser)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    userControllers.updateUser
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    userControllers.deleteUser
  )

module.exports = router
