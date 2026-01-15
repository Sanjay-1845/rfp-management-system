const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const MONGO_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}`;
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.log('MongoDB connection failed', err);
    process.exit(1);
  }
};

module.exports = connectDB;