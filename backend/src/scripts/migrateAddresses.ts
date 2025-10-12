// backend/scripts/migrateAddresses.js
// Run this script ONCE to add _id to existing addresses

import { config } from "@/config/env";
import User from "@/models/User";
import mongoose from "mongoose";

const migrateAddresses = async () => {
  try {
    // Connect to database
    await mongoose.connect(config.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Find all users with addresses
    const users = await User.find({ "addresses.0": { $exists: true } });
    console.log(`📊 Found ${users.length} users with addresses`);

    let updatedCount = 0;
    let addressCount = 0;

    for (const user of users) {
      let modified = false;

      // Check each address for missing _id
      user.addresses.forEach((address) => {
        if (!address._id) {
          // Generate new ObjectId
          address._id = new mongoose.Types.ObjectId();
          modified = true;
          addressCount++;
          console.log(`  ➕ Added _id to address for ${user.email}`);
        }
      });

      // Save if any address was modified
      if (modified) {
        await user.save();
        updatedCount++;
      }
    }

    console.log("\n✅ Migration complete!");
    console.log(`📈 Updated ${updatedCount} users`);
    console.log(`📍 Added _id to ${addressCount} addresses`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
};

// Run migration
migrateAddresses();

/* 
HOW TO RUN THIS MIGRATION:

1. Save this file to: backend/scripts/migrateAddresses.js

2. Run from your backend directory:
   node scripts/migrateAddresses.js

3. Or add to package.json scripts:
   "scripts": {
     "migrate:addresses": "node scripts/migrateAddresses.js"
   }
   
   Then run: npm run migrate:addresses

IMPORTANT: 
- Run this ONCE after updating the User model
- This will add _id to all existing addresses
- New addresses will automatically get _id from the schema
*/
