# Prashanthi Uniforms Application

This repository contains the full stack codebase for **Prashanthi Uniforms**, powered by Firebase. Everything—from the consumer view to the admin dashboard—is contained within this single highly-dynamic React Native (Expo) application.

## Prerequisites
- Node.js (v18+)
- Firebase Project setup with Authentication (Email/Password) and Cloud Firestore enabled.

## 1. Firebase Configuration

1. Go to your Firebase Console and find your Web App configuration (API Key, Project ID, etc.).
2. In the mobile app root folder, open `firebaseConfig.js` and paste your credentials into the `firebaseConfig` object.

### Security Rules
To ensure secure access, navigate to the Rules tab of your Firestore Database in the Firebase Console and copy the contents of `firestore.rules` (found in the root) into it.

### Seeding Data
To populate your app with sample schools and products:
1. Generate a Service Account Key in Firebase (Project Settings > Service Accounts > Generate new private key).
2. Save it as `serviceAccountKey.json` inside the `scripts` folder.
3. Open a terminal in the root folder and run:
   ```bash
   cd scripts
   npm install firebase-admin
   node seed.js
   ```

## 2. Running the App (React Native)

From the project root folder:
```bash
npm install
npm run start
```
You can use the Expo Go app on your physical device, or press `a` for Android Emulator / `i` for iOS Simulator.

### Accessing the Admin Dashboard
The Admin Dashboard is built directly into the mobile application! To access it:
1. Create a user via the mobile app register page.
2. Open Firestore, navigate to the `users` collection, find your user ID document.
3. Add a String field `role` and set its value exactly to `admin`.
4. Refresh the mobile app, go to your **Profile** tab, and you will see a new **ADMINISTRATION > Admin Dashboard** section.
5. Tap it to securely manage schools, products, and incoming orders natively from your phone.

---
**Powered by Antigravity**
