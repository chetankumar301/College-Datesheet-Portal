require("dotenv").config();

const College = require("../models/College");
const Subscription = require("../models/Subscription");
const { calculatePlanAmount, getPlanConfig } = require("../services/planPricingService");
const connectDB = require("../config/db");

const DEMO_COLLEGE = {
  name: "TechnoVait Institute of Technology",
  code: "TVIT-001",
  email: "info@technovait.edu",
  phone: "+91-135-2456789",
  address: "Rajpur Road, Dehradun, Uttarakhand, India",
  city: "Dehradun",
  state: "Uttarakhand",
  country: "India",
  pricingPlan: "standard",
  currentStudents: 850,
  maxStudents: 2000,
  subscriptionStatus: "active",
  subscriptionStart: new Date(),
  subscriptionEnd: (() => {
    const end = new Date();
    end.setFullYear(end.getFullYear() + 1);
    return end;
  })(),
  annualFee: 0,
  perStudentFee: 0,
  isActive: true,
  isSuspended: false,
  suspensionReason: "",
};

const seedDemoCollege = async () => {
  try {
    await connectDB();

    const college = await College.findOneAndUpdate(
      { code: DEMO_COLLEGE.code },
      { $set: DEMO_COLLEGE },
      { returnDocument: "after", upsert: true, runValidators: true }
    );

    const planConfig = getPlanConfig(DEMO_COLLEGE.pricingPlan);
    const pricing = calculatePlanAmount(DEMO_COLLEGE.pricingPlan, DEMO_COLLEGE.currentStudents);

    await Subscription.findOneAndUpdate(
      { college: college._id },
      {
        $set: {
          college: college._id,
          name: planConfig.code,
          code: planConfig.code,
          description: planConfig.description,
          billingCycle: planConfig.billingCycle,
          pricePerStudent: planConfig.pricePerStudent,
          calculatedAmount: pricing.calculatedAmount,
          studentCount: pricing.studentCount,
          features: planConfig.features,
          isActive: true,
          plan: planConfig.code,
          startDate: DEMO_COLLEGE.subscriptionStart,
          endDate: DEMO_COLLEGE.subscriptionEnd,
          status: "active",
          amount: pricing.calculatedAmount,
          currency: planConfig.currency,
          paymentMethod: "bank_transfer",
          paymentStatus: "paid",
          billingName: DEMO_COLLEGE.name,
          billingEmail: DEMO_COLLEGE.email,
          billingAddress: DEMO_COLLEGE.address,
          autoRenew: true,
        },
      },
      { new: true, upsert: true, runValidators: true }
    );

    console.log("Demo college seeded successfully:");
    console.log(`- ${college.name} (${college.code})`);
    console.log(`- Plan: ${planConfig.name}`);
    console.log(`- Students: ${DEMO_COLLEGE.currentStudents}`);
    console.log(`- Amount: ₹${pricing.calculatedAmount}/year`);
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed demo college:", error.message);
    process.exit(1);
  }
};

seedDemoCollege();
