const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");
require("dotenv").config();

const seedSuperAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Check if super admin already exists
    const existingAdmin = await Admin.findOne({ email: "chetan149" });
    
    if (existingAdmin) {
      console.log("⚠️  Super admin already exists with email: chetan149");
      console.log("If you want to recreate, delete the existing admin first.");
      process.exit(0);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash("91492253555", 10);
    console.log("✅ Password hashed successfully");

    // Create super admin
    const superAdmin = await Admin.create({
      name: "Super Admin",
      email: "chetan149",
      password: hashedPassword,
      role: "super_admin"
    });

    console.log("✅ Super admin created successfully:");
    console.log("   Email: chetan149");
    console.log("   Password: 91492253555");
    console.log("   Role: super_admin");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating super admin:", error.message);
    process.exit(1);
  }
};

seedSuperAdmin();
