const express = require("express");
const router = express.Router();
const userController = require('../controllers/user');

router.post("/signup", userController.user_signup);

router.post("/login", userController.user_login);

//TODO CheckAdmin
router.get("/:userId", userController.user_get_by_mail);
router.patch("/:userId", userController.user_update_user);
router.delete("/:userId", userController.user_delete_user);

module.exports = router;
