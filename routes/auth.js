const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

router.post("/api/v1/auth/register", authController.postRegister); 
router.post("/api/v1/auth/login", authController.postLogin);
router.post("/api/v1/auth/reset", authController.forgotPassword);
router.get("/api/v1/auth/reset/:token", authController.getNewPassword);
router.post("/api/v1/auth/reset/newPassword", authController.postNewPassword);
router.get("/api/v1/auth/logout", authController.logout);



module.exports = router;