const express= require("express");
const isAuth = require("../middleware/isAuth");
const router = express.Router();

const ownersController = require("../controllers/ownersController");
const handleQuery = require("../middleware/handleOwnerQuery");

router.get("/api/v1/owners", handleQuery, ownersController.getOwners);
router.get("/api/v1/owners/:id", handleQuery, ownersController.getOwner);
router.patch("/api/v1/owners/:id",isAuth, handleQuery, ownersController.updateOwner);
router.delete("/api/v1/owners/:id",isAuth, handleQuery, ownersController.deleteOwner);
router.get("/api/v1/owners/:id/restaurants", handleQuery, ownersController.getOwnerRestaurants);
router.post("/api/v1/owners",isAuth,  ownersController.postOwner);


module.exports = router;