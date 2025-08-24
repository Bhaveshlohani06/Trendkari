import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { startScheduler, startDailyMailJob } from "./utils/scheduler.js";
import authrouter from './routes/authRoutes.js';
import categoryroutes from './routes/categoryRoutes.js';
import postRoutes from './routes/postRoutes.js';
import horoscopeRoutes from './routes/horoscope.js'
import passport from 'passport';
import './config/passport.js'; // import the strategy config
import session from 'express-session';


dotenv.config(); // Load environment variables

// after mongoose.connect(...)
startScheduler();
startDailyMailJob();



const app = express();

connectDB(); // Connect to MongoDB

const allowedOrigins = [
  'http://localhost:5173',
  'https://trendkari.vercel.app',
  'https://trendkari-qp0pmwukf-bhavesh-lohanis-projects.vercel.app',
  'https://www.trendkari.in',
  'https://trendkari.in',
];



app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS: ' + origin));
    }
  },
  credentials: true,
}));

// app.use(cors({
//   origin: '*',
// }));



// Middleware
// app.use(cors());
app.use(express.json());

// Passport middleware
app.use(session({
      secret: process.env.SESSION_SECRET, // required

  name: 'trend-oauth',
  keys: ['your_secret_key'],
  maxAge: 24 * 60 * 60 * 1000,
}));


// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/v1/auth', authrouter); 
app.use('/api/v1/category', categoryroutes);
app.use('/api/v1/post', postRoutes); 
app.use('/api/v1/horoscope', horoscopeRoutes)

app.get("/api/ping", (req, res) => {
  res.json({ message: "Backend working" });
});


// Server setup
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});

export default app;
