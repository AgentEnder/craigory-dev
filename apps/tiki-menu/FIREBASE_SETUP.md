# Firebase Setup Guide

This guide walks you through setting up Firebase for the Tiki Menu app. 

**Note:** This app is bundled into another static pages deployment, so only Firestore and Authentication are configured - no Firebase Hosting.

## Prerequisites

1. A Firebase account (free tier is sufficient)
2. Firebase CLI installed (already included as dev dependency)

## Setup Steps

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Choose a project name (e.g., "tiki-menu-prod")
4. Enable Google Analytics if desired
5. Create project

### 2. Enable Required Services

**Authentication:**
1. Go to Authentication > Sign-in method
2. Enable "Email/Password" provider
3. Create an admin user in the Users tab

**Firestore Database:**
1. Go to Firestore Database
2. Click "Create database"
3. Choose "Start in test mode" (rules will be deployed later)
4. Select a location closest to your users

### 3. Get Firebase Configuration

1. Go to Project Settings (gear icon)
2. Scroll to "Your apps" section
3. Click "Add app" and select Web (</>) icon
4. Register your app with a name
5. Copy the configuration object

### 4. Update Environment Variables

1. Copy `.env.example` to `.env.local`
2. Replace placeholder values with your Firebase config:

```bash
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 5. Initialize Firebase CLI

```bash
npm run firebase:login
npm run firebase:init
```

During init:
- Select "Firestore" only (not Hosting)
- Choose your existing project
- Accept default for Firestore rules file (firestore.rules)

### 6. Deploy Firestore Rules

```bash
npm run firebase:deploy
```

This deploys only the Firestore security rules. The app itself is deployed via your main static pages deployment.

## Available Scripts

- `npm run firebase:login` - Login to Firebase CLI
- `npm run firebase:init` - Initialize Firebase project (Firestore only)
- `npm run firebase:deploy` - Deploy Firestore rules
- `npm run firebase:deploy:rules` - Deploy only Firestore rules (same as above)
- `npm run firebase:emulator` - Start Firestore emulator for local development

## Security Rules

The app uses these Firestore security rules:

- **Inventory collection**: Public read access, authenticated write access
- This allows the menu to be viewed by anyone, but only logged-in admins can modify inventory

## Admin Access

1. Create an admin user in Firebase Auth console
2. Visit `/tiki-menu/admin` and login
3. Click "Initialize Inventory" on first visit
4. Toggle ingredient availability as needed

## Local Development with Emulator

For local development, you can use the Firestore emulator:

```bash
npm run firebase:emulator
```

Then update your `.env.local` to point to the emulator:
```bash
VITE_FIREBASE_AUTH_DOMAIN=localhost
# Other vars remain the same
```

## Troubleshooting

**Rules deployment fails:** Check that you have proper permissions and are logged into the correct Firebase account

**Admin can't login:** Verify the user exists in Firebase Auth and credentials are correct

**Environment variables not working:** Make sure `.env.local` is in the app root and variables start with `VITE_`