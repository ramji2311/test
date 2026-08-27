const Tailor = require("../models/Tailor");

// Get all tailors
const getTailors = async (req, res) => {
  try {
    const tailors = await Tailor.find({
      isRemoved: false,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: tailors,
    });
  } catch (error) {
    console.error("Get tailors error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch tailors",
    });
  }
};

// Create tailor
const createTailor = async (req, res) => {
  try {
    const { name, phone } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Tailor name is required",
      });
    }

    const tailor = await Tailor.create({
      name: name.trim(),
      phone: phone || "",
      stitchingRates: [],
      isActive: true,
      isRemoved: false,
    });

    res.status(201).json({
      success: true,
      data: tailor,
      message: "Tailor added successfully",
    });
  } catch (error) {
    console.error("Create tailor error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add tailor",
    });
  }
};

// Update tailor basic details
const updateTailor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, isActive } = req.body;

    const tailor = await Tailor.findOne({
      _id: id,
      isRemoved: false,
    });

    if (!tailor) {
      return res.status(404).json({
        success: false,
        message: "Tailor not found",
      });
    }

    if (name !== undefined) {
      tailor.name = name.trim();
    }

    if (phone !== undefined) {
      tailor.phone = phone;
    }

    if (isActive !== undefined) {
      tailor.isActive = Boolean(isActive);
    }

    await tailor.save();

    res.json({
      success: true,
      data: tailor,
      message: "Tailor updated successfully",
    });
  } catch (error) {
    console.error("Update tailor error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update tailor",
    });
  }
};

// Add stitching rate
const addStitchingRate = async (req, res) => {
  try {
    const { id } = req.params;
    const { dressName, rate } = req.body;

    if (!dressName || !dressName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Dress name is required",
      });
    }

    if (
      rate === undefined ||
      rate === "" ||
      Number(rate) < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid rate is required",
      });
    }

    const tailor = await Tailor.findOne({
      _id: id,
      isRemoved: false,
    });

    if (!tailor) {
      return res.status(404).json({
        success: false,
        message: "Tailor not found",
      });
    }

    const normalizedDressName = dressName.trim();

    const existingRate = tailor.stitchingRates.find(
      (item) =>
        item.dressName.toLowerCase() ===
        normalizedDressName.toLowerCase()
    );

    if (existingRate) {
      return res.status(400).json({
        success: false,
        message: "This dress already has a rate",
      });
    }

    tailor.stitchingRates.push({
      dressName: normalizedDressName,
      rate: Number(rate),
    });

    await tailor.save();

    res.status(201).json({
      success: true,
      data: tailor,
      message: "Stitching rate added successfully",
    });
  } catch (error) {
    console.error("Add stitching rate error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add stitching rate",
    });
  }
};

// Update stitching rate
const updateStitchingRate = async (req, res) => {
  try {
    const { id, rateId } = req.params;
    const { dressName, rate } = req.body;

    const tailor = await Tailor.findOne({
      _id: id,
      isRemoved: false,
    });

    if (!tailor) {
      return res.status(404).json({
        success: false,
        message: "Tailor not found",
      });
    }

    const stitchingRate = tailor.stitchingRates.id(rateId);

    if (!stitchingRate) {
      return res.status(404).json({
        success: false,
        message: "Stitching rate not found",
      });
    }

    if (dressName !== undefined) {
      stitchingRate.dressName = dressName.trim();
    }

    if (rate !== undefined) {
      if (rate === "" || Number(rate) < 0) {
        return res.status(400).json({
          success: false,
          message: "Valid rate is required",
        });
      }

      stitchingRate.rate = Number(rate);
    }

    await tailor.save();

    res.json({
      success: true,
      data: tailor,
      message: "Stitching rate updated successfully",
    });
  } catch (error) {
    console.error("Update stitching rate error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update stitching rate",
    });
  }
};

// Delete stitching rate
const deleteStitchingRate = async (req, res) => {
  try {
    const { id, rateId } = req.params;

    const tailor = await Tailor.findOne({
      _id: id,
      isRemoved: false,
    });

    if (!tailor) {
      return res.status(404).json({
        success: false,
        message: "Tailor not found",
      });
    }

    const stitchingRate = tailor.stitchingRates.id(rateId);

    if (!stitchingRate) {
      return res.status(404).json({
        success: false,
        message: "Stitching rate not found",
      });
    }

    stitchingRate.deleteOne();

    await tailor.save();

    res.json({
      success: true,
      data: tailor,
      message: "Stitching rate deleted successfully",
    });
  } catch (error) {
    console.error("Delete stitching rate error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete stitching rate",
    });
  }
};

// Activate / deactivate tailor
const toggleTailorStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const tailor = await Tailor.findOne({
      _id: id,
      isRemoved: false,
    });

    if (!tailor) {
      return res.status(404).json({
        success: false,
        message: "Tailor not found",
      });
    }

    tailor.isActive = !tailor.isActive;

    await tailor.save();

    res.json({
      success: true,
      data: tailor,
      message: tailor.isActive
        ? "Tailor activated successfully"
        : "Tailor deactivated successfully",
    });
  } catch (error) {
    console.error("Toggle tailor status error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to change tailor status",
    });
  }
};

// Soft remove tailor
const removeTailor = async (req, res) => {
  try {
    const { id } = req.params;

    const tailor = await Tailor.findById(id);

    if (!tailor) {
      return res.status(404).json({
        success: false,
        message: "Tailor not found",
      });
    }

    tailor.isActive = false;
    tailor.isRemoved = true;

    await tailor.save();

    res.json({
      success: true,
      message:
        "Tailor removed successfully. Historical data is preserved.",
    });
  } catch (error) {
    console.error("Remove tailor error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to remove tailor",
    });
  }
};

module.exports = {
  getTailors,
  createTailor,
  updateTailor,
  addStitchingRate,
  updateStitchingRate,
  deleteStitchingRate,
  toggleTailorStatus,
  removeTailor,
};