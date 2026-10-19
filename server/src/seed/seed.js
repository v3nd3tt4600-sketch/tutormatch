import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Service from '../models/Service.js';
import User from '../models/User.js';
import servicesData from './servicesData.js';

const seed = async () => {
  await connectDB();

  await Service.deleteMany();
  const services = await Service.insertMany(servicesData);
  console.log(`Added ${services.length} services`);

  const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (ADMIN_EMAIL && ADMIN_PASSWORD) {
    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });
    if (existingAdmin) {
      console.log(`Admin ${ADMIN_EMAIL} already exists`);
    } else {
      await User.create({
        name: 'Admin',
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: 'admin',
      });
      console.log(`Created admin ${ADMIN_EMAIL}`);
    }
  }

  await mongoose.disconnect();
  console.log('Seeding finished');
};

seed().catch((error) => {
  console.error(`Seeding failed: ${error.message}`);
  process.exit(1);
});
