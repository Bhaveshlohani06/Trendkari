// import mongoose from 'mongoose';
// import dotenv from 'dotenv';

// dotenv.config();

// export const connectDB = async () => {
//   try {
//     // Check if MONGO_URI exists
//     if (!process.env.MONGO_URI) {
//       throw new Error('MONGO_URI is not defined in environment variables');
//     }

//     console.log('🔗 Attempting to connect to MongoDB...');
    
//     // Connection options
//     const options = {
//       serverSelectionTimeoutMS: 15000, // 15 seconds timeout
//       socketTimeoutMS: 45000, // 45 seconds socket timeout
//       family: 4, // Force IPv4
//     };
    
//     await mongoose.connect(process.env.MONGO_URI, options);
//     console.log('✅ MongoDB connected successfully');
    
//     // Set up event listeners
//     mongoose.connection.on('error', (err) => {
//       console.error('❌ MongoDB connection error:', err.message);
//     });
    
//     mongoose.connection.on('disconnected', () => {
//       console.log('🔌 MongoDB disconnected');
//     });
    
//     return mongoose.connection;
    
//   } catch (error) {
//     console.error('❌ MongoDB connection failed:', error.message);
    
//     // Provide specific troubleshooting advice based on error type
//     if (error.name === 'MongooseServerSelectionError') {
//       console.log('\n🔧 Network connection issue detected:');
//       console.log('1. Check your internet connection');
//       console.log('2. Verify MongoDB Atlas IP whitelist includes your current IP');
//       console.log('3. Try using a different network (e.g., mobile hotspot)');
//     } else if (error.message.includes('ETIMEDOUT')) {
//       console.log('\n🔧 Connection timeout issues:');
//       console.log('1. Firewall or antivirus may be blocking the connection');
//       console.log('2. Your ISP might be blocking MongoDB connections');
//       console.log('3. Try using a VPN service');
//     } else if (error.message.includes('auth failed')) {
//       console.log('\n🔧 Authentication issues:');
//       console.log('1. Check your MongoDB username and password');
//       console.log('2. Verify your database user has proper permissions');
//     }
    
//     process.exit(1);
//   }
// };

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); 

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      family: 4,   // 👈 forces IPv4

    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1); // Exit process with failure
  }
}