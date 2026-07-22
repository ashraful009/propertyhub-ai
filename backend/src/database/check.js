require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./db');
const PlatformSettings = require('../features/admin/settings/platformSettings.model');

const check = async () => {
  await connectDB();
  const settings = await PlatformSettings.findOne({ key: 'global' });
  console.log('--- Platform Settings ---');
  console.log(settings);
  await mongoose.disconnect();
  process.exit(0);
};

check().catch(console.error);
