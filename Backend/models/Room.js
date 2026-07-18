const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    collegeId: { type: mongoose.Schema.Types.ObjectId, ref: "College", required: true, index: true },
    roomName: { type: String, required: true, trim: true },
    roomCode: { type: String, required: true, trim: true, uppercase: true },
    capacity: { type: Number, required: true, min: 1 },
    isActive: { type: Boolean, default: true, index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

roomSchema.index({ collegeId: 1, roomCode: 1 }, { unique: true });

module.exports = mongoose.model("Room", roomSchema);
