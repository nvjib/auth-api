const express = require("express")
const router = express.Router()
const { signUp, login, profile } = require("../controllers/auth")
const authenticate = require("../middleware/auth")

router.post("/sign-up", signUp)
router.post("/login", login)
router.get("/profile", authenticate, profile)

module.exports = router