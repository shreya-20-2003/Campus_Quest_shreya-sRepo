import dotenv from 'dotenv';
import mongoose from 'mongoose';
import chalk from 'chalk';

dotenv.config();

const MONGO_URI = process.env.MONGO;

if (!MONGO_URI) {
  console.error(chalk.red.bold('❌ MONGO environment variable is missing!'));
  process.exit(1);
}

const connectDB = async (retries = 5, delay = 5000) => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(chalk.green.bold('✅ MongoDB connected successfully!'));
    console.log(
      chalk.cyan(`📌 Database: ${conn.connection.name} | 🖥 Host: ${conn.connection.host}`)
    );

    mongoose.connection.on('disconnected', () => {
      console.log(chalk.yellow.bold('⚠️ MongoDB disconnected! Reconnecting...'));
      connectDB();
    });

    mongoose.connection.on('reconnected', () => {
      console.log(chalk.blue.bold('🔄 MongoDB reconnected!'));
    });

  } catch (error) {
    console.error(chalk.red.bold(`❌ Error connecting to MongoDB: ${error.message}`));

    if (retries > 0) {
      console.log(chalk.yellow(`🔁 Retrying in ${delay / 1000} seconds... (${retries} retries left)`));
      setTimeout(() => connectDB(retries - 1, delay * 2), delay);
    } else {
      console.error(chalk.red.bold('❌ Could not connect to MongoDB. Exiting...'));
      process.exit(1);
    }
  }
};

export default connectDB;
