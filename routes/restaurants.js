const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/isAuth");
const restaurantController = require("../controllers/restaurantController");
const handleQuery = require("../middleware/handleRestQuery");


router.get("/api/v1/restaurants", handleQuery, restaurantController.getRestaurants);
router.post("/api/v1/restaurants", isAuth, restaurantController.postRestaurants);
router.get("/api/v1/restaurants/:id", handleQuery, restaurantController.getRestaurant);
router.patch("/api/v1/restaurants/:id", isAuth, restaurantController.updateRestaurant);
router.delete("/api/v1/restaurants/:id", isAuth, restaurantController.deleteRestaurant)
router.get("/api/v1/restaurants/distance/:zipcode/:maxDistance", handleQuery, restaurantController.getWithinDistance);





module.exports = router;