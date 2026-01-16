import admin from "firebase-admin";

console.log("🔄 Initializing Firebase Admin...");


const privateKey = process.env.FIREBASE_PRIVATE_KEY;
if (!privateKey) {
  throw new Error('FIREBASE_PRIVATE_KEY is missing from environment variables!');
}


if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey.replace(/\\n/g, "\n")
    })
  });
  console.log("✅ Firebase Admin Initialized");
}

export default admin;
