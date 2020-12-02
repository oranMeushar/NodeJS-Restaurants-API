const express = require("express");
const router = express.Router();

const usersController = require("../controllers/usersController");
const isAuth = require("../middleware/isAuth");

router.get("/api/v1/users",isAuth, usersController.getUsers);
router.delete("/api/v1/users/:id",isAuth, usersController.deleteUser);


module.exports = router;