const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");
require("dotenv").config();

const seedSuperAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Delete existing super admin if exists
    await Admin.deleteOne({ email: "Chetan149" });
    console.log("🗑️  Deleted existing super admin if any");

    // Hash the password
    const hashedPassword = await bcrypt.hash("9149225355", 10);
    console.log("✅ Password hashed successfully");

    // Create super admin
    const superAdmin = await Admin.create({
      name: "Super Admin",
      email: "Chetan149",
      password: hashedPassword,
      role: "super_admin"
    });

    console.log("✅ Super admin created successfully:");
    console.log("   Username: Chetan149");
    console.log("   Password: 9149225355");
    console.log("   Role: super_admin");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating super admin:", error.message);
    process.exit(1);
  }
};

seedSuperAdmin();
