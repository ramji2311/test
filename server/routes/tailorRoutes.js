const express = require("express");

const router = express.Router();

const {
  getTailors,
  createTailor,
  updateTailor,
  addStitchingRate,
  updateStitchingRate,
  deleteStitchingRate,
  toggleTailorStatus,
  removeTailor,
} = require("../controllers/tailorController");

router.get("/", getTailors);

router.post("/", createTailor);

router.put("/:id", updateTailor);

router.post("/:id/rates", addStitchingRate);

router.put("/:id/rates/:rateId", updateStitchingRate);

router.delete("/:id/rates/:rateId", deleteStitchingRate);

router.patch("/:id/status", toggleTailorStatus);

router.delete("/:id", removeTailor);

module.exports = router;