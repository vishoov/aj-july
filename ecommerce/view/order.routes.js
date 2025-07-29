const router = require("express").Router();
const { placeOrder, cancelOrder, trackOrder } = require("../controller/order.controller");

// Place Order
router.post("/place", placeOrder);

// Cancel Order
router.put("/cancel/:orderId", cancelOrder)


// Track
router.get("/track/:orderId", trackOrder);

module.exports = router;