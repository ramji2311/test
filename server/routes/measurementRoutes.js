const express = require("express");
const router = express.Router();

const {
  createMeasurement,
  getMeasurements,
  getMeasurement,
  updateMeasurement,
  deleteMeasurement,
} = require("../controllers/measurementController");

router.post("/", createMeasurement);

router.get("/", getMeasurements);

router.get("/:id", getMeasurement);

router.put("/:id", updateMeasurement);

router.delete("/:id", deleteMeasurement);

module.exports = router;