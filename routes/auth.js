const { login, register, showCurrentUser } = require("../controller/auth")

const router = require("express").Router()

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/me").get(showCurrentUser)

module.exports = router