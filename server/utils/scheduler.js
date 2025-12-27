import cron from "node-cron";
// import UserPreferences from "../models/UserPreferences.js";
import User from "../models/usermodel.js";
import { generatePersonalPost } from "../config/gemini.js";
import Horoscope from "../models/Horoscope.js";
import { sendEmail } from "./emailService.js";

/**
 * Run this after server starts. For testing use a cron like "*
 */

export function startScheduler() {
  // Example: every day at 06:00 server time
  cron.schedule("* * * * *", async () => {
    const users = await User.find({ frequency: "daily" });
    for (const u of users) {
      try {
        const json = await generatePersonalPost({ name: u.name || "friend", prefs: u });
        await Horoscope.create({ userId: u.userId, ...json, generatedAt: new Date() });
      } catch (e) { console.error("job error", e); }
    }
  });
}


// send daily horoscope email at 6 AM every day


export function startDailyMailJob() {
cron.schedule("14 10 * * *", async () => {
  console.log("Running at 6 AM");

    console.log("⏰ Running Daily Horoscope Mail Job at", new Date().toLocaleString());

    try {
      const users = await User.find();
      console.log(`👥 Found ${users.length} users to process`);

      for (const user of users) {
        console.log(`🔍 Processing user: ${user.email}`);

        // Step 1: Find today’s horoscope
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let horoscope = await Horoscope.findOne({
          userId: user._id,
          generatedAt: { $gte: today },
        });

        // Build link regardless of horoscope existing
        const link = `${process.env.FRONTEND_URL}/horoscope`;

        let snippet, html;

        if (horoscope) {
          // ✅ If horoscope exists → show snippet
          snippet = horoscope.summary?.english || horoscope.title || "Your horoscope is ready!";
          html = `
            <h2>Hey, ${user.name || "Friend"} 🌞</h2>
            <p>Here’s your <a href="${link}">horoscope for today</a>.</p>
            <blockquote>${snippet.substring(0, 150)}...</blockquote>
            <p>Share your Thoughts with The World  </p>
            <p>✨ Wishing you a wonderful day ahead!<br/>— Team Trendkari</p>
          `;
          console.log(`✅ Found horoscope for ${user.email}, sending with snippet.`);
        } else {
          // ⚠️ No horoscope → just send link (user clicks → generated automatically)
          html = `
            <h2>Good Morning, ${user.name || "Friend"} 🌞</h2>
            <p>Your horoscope will be ready when you check it! Click here 👉 <a href="${link}">View Horoscope</a></p>
            <p>✨ Wishing you a wonderful day ahead!<br/>— Team Trendkari</p>
          `;
          console.log(`⚠️ No horoscope found for ${user.email}, sending link only.`);
        }

        // Step 3: Send email
        await sendEmail(
          user.email,
          "Your Daily Horoscope ✨",
          html
        );

        console.log(`📩 Sent daily horoscope mail to ${user.email}`);
      }
    } catch (err) {
      console.error("❌ Error in daily mail job:", err.message);
    }
  });
}


// send test email

export function startEngagementMailJob() {
  // Runs every day at 9 AM
  cron.schedule("16 19 * * *", async () => {
    console.log("⏰ Running Daily Engagement Mail Job at", new Date().toLocaleString());

     try {
      const users = await User.find();
      console.log(`👥 Found ${users.length} users to send emails`);

      for (const user of users) {
        console.log(`🔍 Processing user: ${user.email}`);

        // 🔗 You can change this link anytime
const postLink = "https://www.trendkari.in/blog/ramganjmandi-mein-goonjega-shri-ram-ka-naam-padhaar-rahe-hain-bageshwar-dham!";

const html = `
  <h3>🚩 Ramganjmandi में गूँजेगा श्री राम का नाम, पधार रहे हैं बागेश्वर धाम!</h3>

  <p>
    आस्था, संस्कार और सनातन चेतना का महापर्व <strong>Ramganjmandi</strong> में दस्तक देने जा रहा है। 
    23 से 25 जनवरी तक परम पूज्य <strong>पंडित श्री धीरेन्द्र कृष्ण शास्त्री जी (बागेश्वर धाम सरकार)</strong> 
    के मुखारविंद से श्रीराम कथा एवं गौमाता महोत्सव का भव्य आयोजन होने जा रहा है।
  </p>

  <p>
    इस पावन आयोजन की तैयारियाँ शुरू हो चुकी हैं। गाँव-गाँव संदेश पहुँचाने के लिए 5 'कथा-रथ' 
    रवाना किए गए हैं और 22 जनवरी को भव्य कलश यात्रा से नगर भक्तिमय हो जाएगा।
  </p>

  <p>
    👉 <a href="${postLink}">
      रामगंजमंडी कार्यक्रम का पूरा विवरण और शेड्यूल यहाँ पढ़ें
    </a>
  </p>

  <hr/>

  <p>
    The spiritual wave of Bageshwar Dham is coming to Rajasthan! 
    ✨ ऐसे ही trending news, cultural updates और awareness blogs के लिए 
    Trendkari के साथ जुड़े रहें।
  </p>

  <p>
    by Chhavi Dhanotiya <br/>
    — Team Trendkari
  </p>
`;

await sendEmail(
  user.email,
  "🚩 Ramganjmandi तैयार है: पधार रहे हैं बागेश्वर धाम सरकार!",
  html
);


        console.log(`📩 Avatar Movie mail sent to ${user.email}`);
      }
    }
    catch (err) {
      console.error("❌ Error in engagement mail job:", err.message);
    }
  });
}


//testing


// export function startDailyMailJob() {
//   cron.schedule("40 21 * * *", async () => {
//     console.log("Running at 6 AM");
//     console.log("⏰ Running Post Request Mail Job at", new Date().toLocaleString());

//     try {
//       const users = await User.find();
//       console.log(`👥 Found ${users.length} users to process`);

//       for (const user of users) {
//         console.log(`🔍 Processing user: ${user.email}`);

//         const link = `${process.env.FRONTEND_URL}/blog/best-fitness-gadgets-for-home-workouts-india-sept-2025`;

//         const html = `
//           <h2>Hello ${user.name || "Trendkari User"} 👋</h2>
//           <p>Top Recommended Fitness Gadgets for Home Workouts</p>
//           <p>Read Now - ${link}</p>
//           <hr/>
//           <p> Let’s make Trendkari vibrant together<br/>— Team Trendkari</p>
//         `;

//         // ✅ Now inside the loop
//         await sendEmail(
//           user.email,
//           "Recommended Fitness Gadgets - Top Picks",
//           html,

//         );

//         console.log(`📩 Sent daily post mail to ${user.email}`);
//       }
//     } catch (err) {
//       console.error("❌ Error in daily mail job:", err.message);
//     }
//   });
// }

