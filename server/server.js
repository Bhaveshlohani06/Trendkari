// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import { connectDB } from './config/db.js';
// import { startScheduler, startDailyMailJob, startEngagementMailJob  } from "./utils/scheduler.js";
// import authrouter from './routes/authRoutes.js';
// import categoryroutes from './routes/categoryRoutes.js';
// import postRoutes from './routes/postRoutes.js';
// import horoscopeRoutes from './routes/horoscope.js'
// import commentRoutes from "./routes/commentRoutes.js";
// import searchRoutes from './routes/searchRoutes.js';
// import userRoutes from './routes/userRoutes.js';
// import weatherRoutes from './routes/weatherRoutes.js';
// import passport from 'passport';
// import './config/passport.js'; // import the strategy config
// import session from 'express-session';
// import mobileAuthRoutes from './routes/mobileRoutes.js';
// import "./config/firebase.js";
// import notificationRoutes from './routes/notificationRoutes.js';
// import debugPushRoutes from './routes/debugPushRoutes.js';
// import likeRoutes from './routes/likeRoutes.js';
// import { initSocket } from './utils/socket.js';
// import http from 'http';


// dotenv.config(); // Load environment variables





// const app = express();
// const server = http.createServer(app);

// connectDB(); // Connect to MongoDB

// // after mongoose.connect(...)
// startScheduler();
// startDailyMailJob();
// startEngagementMailJob();

// const allowedOrigins = [
//   'http://localhost:5173',
//   'https://trendkari.vercel.app',
//   'https://trendkari-qp0pmwukf-bhavesh-lohanis-projects.vercel.app',
// `https://trendkari.onrender.com`,
//   'https://www.trendkari.in',
//   'https://trendkari.in',
//     "https://trendkari-e2uzitjrf-bhavesh-lohanis-projects.vercel.app"

// ];



// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS: ' + origin));
//     }
//   },
//   credentials: true,
// }));





// // Middleware
// // app.use(cors());
// app.use(express.json());

// // Passport middleware
// app.use(session({
//       secret: process.env.SESSION_SECRET, // required

//   name: 'trend-oauth',
//   keys: ['your_secret_key'],
//   maxAge: 24 * 60 * 60 * 1000,
// }));


// // Initialize Passport
// app.use(passport.initialize());
// app.use(passport.session());

// // Routes
// app.use('/api/v1/auth', authrouter); 
// app.use('/api/v1/category', categoryroutes);
// app.use('/api/v1/post', postRoutes); 
// app.use('/api/v1/horoscope', horoscopeRoutes)
// app.use("/api/v1", commentRoutes);
// app.use('/api/v1/search', searchRoutes);
// app.use('/api/v1/user', userRoutes);
// app.use('/api/v1/weather', weatherRoutes);
// app.use("/api/v1/mobile", mobileAuthRoutes);
// app.use("/api/v1/notifications", notificationRoutes);
// app.use("/api/v1/debug-push", debugPushRoutes);
// app.use("/api/v1/likes", likeRoutes);


// // 🔥 INIT SOCKET
// initSocket(server);


// app.get("/api/ping", (req, res) => {
//   res.json({ message: "Backend working" });
// });


// // Server setup
// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`✅ Server is running on port ${PORT}`);
// });

// export default app;







import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import session from "express-session";
import passport from "passport";

import { connectDB } from "./config/db.js";
import "./config/passport.js";
import "./config/firebase.js";

import {
  startScheduler,
  startDailyMailJob,
  startEngagementMailJob,
} from "./utils/scheduler.js";

import { initSocket } from "./utils/socket.js";

// Routes
import authrouter from "./routes/authRoutes.js";
import categoryroutes from "./routes/categoryRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import horoscopeRoutes from "./routes/horoscope.js";
import commentRoutes from "./routes/commentRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import weatherRoutes from "./routes/weatherRoutes.js";
import mobileAuthRoutes from "./routes/mobileRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import debugPushRoutes from "./routes/debugPushRoutes.js";
import likeRoutes from "./routes/likeRoutes.js";

dotenv.config();

/* -------------------- APP & SERVER -------------------- */
const app = express();
const server = http.createServer(app);

/* -------------------- DATABASE -------------------- */
connectDB();

/* -------------------- CRON / SCHEDULERS -------------------- */
startScheduler();
startDailyMailJob();
startEngagementMailJob();

/* -------------------- CORS -------------------- */
const allowedOrigins = [
  "http://localhost:5173",
  "https://trendkari.vercel.app",
  "https://trendkari.onrender.com",
  "https://www.trendkari.in",
  "https://trendkari.in",
  "https://trendkari-e2uzitjrf-bhavesh-lohanis-projects.vercel.app",
  "https://trendkari-qp0pmwukf-bhavesh-lohanis-projects.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

/* -------------------- MIDDLEWARE -------------------- */
app.use(express.json());

app.use(
  session({
    name: "trend-oauth",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "none",
      secure: true,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

/* -------------------- ROUTES -------------------- */
app.use("/api/v1/auth", authrouter);
app.use("/api/v1/category", categoryroutes);
app.use("/api/v1/post", postRoutes);
app.use("/api/v1/horoscope", horoscopeRoutes);
app.use("/api/v1", commentRoutes);
app.use("/api/v1/search", searchRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/weather", weatherRoutes);
app.use("/api/v1/mobile", mobileAuthRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/debug-push", debugPushRoutes);
app.use("/api/v1/likes", likeRoutes);

app.get("/api/ping", (req, res) => {
  res.json({ message: "Backend working" });
});

/* -------------------- SOCKET INIT (🔥 IMPORTANT) -------------------- */
initSocket(server);

/* -------------------- START SERVER -------------------- */
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;
