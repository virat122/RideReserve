const router = require("express").Router();
const {registerVal }= require("../../validators/auth/register");
const { register }= require('../../controllers/auth/register')

router.post("/register", registerVal);

//controllers
router.post("/register", register);


module.exports = router;